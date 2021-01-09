// Secret key for jwt (was generated randomly)
const ACCESS_TOKEN_SECRET = "133fb998c60fdaa6af5613b2670c2c3d5eb8a8d2bad8269c744b554b4dd24e9625d4efdbe3b56ebea2226a2daad84ffc4f8549a25a407b15d8dcfc8f6da65d6d";
//const REFRESH_TOKEN_SECRET = "dfff6c808d7472f6cfa04b604846a45c4bceb06955cd2a66e4e1f3040107070a1173befc0f85ab9b406c548feb4aae76e1dada42aee3709ade0ad0da281c0764";

let connection = require('./database.js').connection; // Database MySQL
const express = require('express');
const cors = require("cors");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require("fs");
const cookieParser = require('cookie-parser');
let msgApp=require("./messageApp.js")

const server = express(); // Server app
var MSGApp = new msgApp.UserMessageApplication(server);
server.use(express.json());
server.use(cors());
server.use(cookieParser());

server.get("*", (req, res, next) => {
  if (req.url==="/"||req.url === '#' || req.url === '') { //Default page
    return res.sendFile(path.join(__dirname + "/index.html"));
  }

  if (fs.existsSync(path.join(__dirname + req.url))) { // Any other web page available

    return res.sendFile(path.join(__dirname + req.url));
  
  } else { // If page could not be found, then return 404
    res.status(404); // Error 404, page not found
    return res.send('404: File Not Found' + req.url);

  }
  
});

server.post('/users/signup', async (req, res) => { // Register event
  const email = req.body.email;
  const password = req.body.password;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const spoken_language = req.body.spoken_language;
  const preferred_language = req.body.preferred_language;
  const location = req.body.location;
  const profilepic = req.body.profilepic;
   // get current date
  var dateTime = getCurrentDateTime();
  // Server side validation of credentials
  if (email === "" || email == null) {
    return res.send({message: "Email is invalid."});
  }
  if (req.body.password.length < 6) {
    return res.send({message: "A minimum password length of 6 characters is required."});
  }
  connection.query("SELECT * FROM users WHERE email = ?", [email], async function(err, result){ // Check if email exists already in database
    if (err) {
      console.log({message: "Error"});
      return res.send({message: "Error"});
    }else{
      if(result.length>0){
        return res.send({message: "Error: User exists already."});
      }else{
        const hashedPassword = await bcrypt.hash(req.body.password, 10); // Encrypt password
        connection.query("INSERT INTO users (email, first_name, last_name, password_hash, speaking_language, preferred_language, location, date_created) VALUES (?,?,?,?,?,?,?,?);", [email, first_name, last_name, hashedPassword, spoken_language, preferred_language, location, dateTime], (err, req) => { // Add account to database
          if (err) {
            console.log({message: "Error: Could not create the account."});
            console.log(err);
            return res.send({message: "Error: Could not create the account."});
          }else{
            return res.send({message: "Successfully created and account. You can now log in."});
          }
        });
      }
    }
  });
});

server.post('/users/token', authenticateToken, (req, res) => {
  var accessToken = generateAccessToken(req.user.email); // Generate new token
  res.cookie("UserData", accessToken, {maxAge: 360000});
  return res.send({ message: "Success", accessToken: accessToken}); //Return token to user
});

server.post('/users/removeToken', authenticateToken, (req, res) => { // Remove cookie and token
  res.clearCookie("UserData"); // Clear the cookie
  return res.send({message: "Disconnected."});
});

// messages, sends back list of connections to message
server.post('/connections', (req, res)=> {
  const user = req.body.user;
  if(user){
    const userid =user.id;
    console.log(user);
    connection.query('SELECT * FROM connections WHERE user_id_from=? OR user_id_to=?;', [userid,userid], (error, result) =>{
      if (err) {
        console.log({message: "Error: Could not insert"});
        console.log(err);
        return res.send({message: "Error: Could not insert"});
      } else {
        return res.send({message: result});
      }
    });
  }
});

// inserts new interest
server.post('/interests/new', (req, res) => {
  const interestname = req.body.interestname;
  const dateTime  = getCurrentDateTime();
  connection.query("INSERT INTO interests (interest_name, date_created) VALUES(?, ?)", [interestname, dateTime], (err, result) => {
    if (err) {
      console.log({message: "Error: Could not insert"});
      console.log(err);
      return res.send({message: "Error: Could not insert"});
    } else {
      return res.send({message: "Successfully added new interest"});
    }
  })
});

// user interest
server.post('/user-interests', (req, res) => {
  const userid = req.body.userid;
  const interestid = req.body.interestid;
  connection.query("INSERT INTO user_interests (interest_id, user_id) VALUES(?, ?)", [interestid, userid], (err, result) => {
    if (err) {
      console.log({message: "Error: Could not insert"});
      console.log(err);
      return res.send({message: "Error: Could not insert"});
    } else {
      return res.send({message: "Successfully added new interest to user!"});
    }
  })
});

server.post('/users/login', async (req, res) => { // Login event
  const email = req.body.email;
  const password = req.body.password;
  // SHOULD CHECK IF EMAIL EXISTS IN DATABASE ALREADY BEFORE PROCEEDING
  connection.query("SELECT password_hash FROM users WHERE email = ?", [email], async function(err, result){ // Check credentials with database
    if (err) {
      return res.send({message: "Error: Incorrect email or password."});
    }
    if (result.length > 0) {
      if (await bcrypt.compare(password, result[0].password_hash)) { // Check if valid hash password from database (result)
        // Logged in
        const accessToken = generateAccessToken(email); // Create user JWT token for user
        res.cookie("UserData", accessToken);
        return res.send({ message: "Success", accessToken: accessToken}); //Return token to user
      } else {
        // Incorrect password
        return res.send({message: "Error: Incorrect email or password."});
      }
    } else {
      return res.send({message: "Error: Incorrect email or password."});
    }
  });
});

// EXAMPLE HOW TO ACCESS PROFILE
// axios.post("/users/profile", {
//   headers: {
//     'Authorization': ACCESS TOKEN FROM VARIABLE OR document.cookie.split('=')[1]
//   }
// }).then((response)=> { });

server.post('/users/get_user', (req, res) => { // Access user profile info event
  if(req.body.user_email){
    connection.query("SELECT * FROM users WHERE email = ?;", [req.body.user_email], (err, result) => { // Add account to database
      if (err) {
        console.log({message: "Error: Could not get user."});
        console.log(err);
        return res.send({message: "Error: Could not get user."});
      }else{
        if(result.length>0){
          let user={  
            first_name:result[0].first_name,
            last_name:result[0].last_name,
            email:result[0].email,
            speaking_language:result[0].speaking_language,
            preferred_language:result[0].preferred_language
          }; 
          return res. send({user:user});
        }else{
          return res.send({message: "Error: Could not get user."});
        }
      }
    });   
  }
});

server.post('/users/profile', authenticateToken, (req, res) => { // Access user profile info event
  connection.query("SELECT * FROM users WHERE email = ?;", [req.user.email], (err, result) => { // Add account to database
    if (err) {
      console.log({message: "Error: Could not get user."});
      console.log(err);
      return res.send({message: "Error: Could not get user."});
    }else{
      // fetch user interests
      connection.query("select i.interest_name from user_interests u inner join interests i on u.interest_id=i.id where u.user_id=?;", [result[0].id], (err, result2) => {
        if(err) {
          console.log({message: "Error: Could not get user."});
          console.log(err);
          return res.send({message: "Error: Could not get user."});
        } else {
          console.log(result);
          let user={
            id: result[0].id,
            first_name:result[0].first_name,
            last_name:result[0].last_name,
            email:result[0].email,
            speaking_language:result[0].speaking_language,
            preferred_language:result[0].preferred_language,
            location:result[0].location,
            interests:result2
          }
          return res.send({ user: user});
        }
      })
    }
  });
});

    
server.post('/users/list',(req,res)=>{
  var arr=[];
  connection.query("SELECT * FROM users WHERE email = *;", [], async (err, result) => { // Add account to database
    if (err) {
      console.log({message: "Error: Could not get user."});
      console.log(err);
      return res.send({message: "Error: Could not get user."});
    }else{
      let user={
        first_name:result[0].first_name,
        last_name:result[0].last_name,
        email:result[0].email,
        speaking_language:result[0].speaking_language,
        preferred_language:result[0].preferred_language,
        location:result[0].location
      };
      arr.push(user);
    }
  });
  return res.send({list:arr});
});

server.post('/validate', authenticateToken, (req, res) => { // Check if user is log in  (token is still valid).
  return res.send({ message: "Valid" });
});

// send current user meetings
server.post('/schedules', authenticateToken, (req, res) => { // Give schedule to user
  const user=req.body.user;
  const userid=user.id;
  connection.query("SELECT * FROM meetings WHERE user_id_create=?;", [userid], (err, result) => {
    if (err) {
      console.log(err);
      return res.sendStatus(403);
    } else {
      console.log(result);
      return res.send({meetings:result});
    }
  });
});

server.post('/users/match', (req, res) => {
  // retrieve current user
  const user  =  q.body.user;
  const userid = user.id;
  const preferred_lang  = user.preferred_language;
  const speaking_lang = user.speaking_language; 
  const dateTime = getCurrentDateTime()
  // searches in databa se for match 
  connection.query("SELECT * FROM users WHERE preferred_language=? AND speaking_language=? ;", [speaking_lang, preferred_lang], async (err, result) => { // Add account to database
    if (err) {  
      console.log({message: "Error: Could not get user."});
      console.log(err);
      return res.send({message: "Error: Could not get user."});
    }else{
      if (result.length > 0) {
        // generate random from user
        console.log(result[0]);

        var match = result[0];
        console.log(user);
        // add cont act  
        connection.query('INSERT INTO connections (user_id_from, user_id_to, created_at) VALUES(?,?,?);', [userid, match.
          id, dateTime] , (err, result2) => { 
            if (err) {
              console.log({message: "Error: Could not insert"}); 
              console.log(err);
              return res.send({message: "Error: Could not insert"});
            } else {
              console.log("Successfully added new connection :" + match.first_name + "!");
              return res.send({message: "Successfully added new interest",contact:result});
            }
        });
      } else {
        return res. send({message: "No match :(("}); 
      }
    }  
  });
});

//list interests
server.post('/interests/list', (req, res) => {
  connection.query("SELECT * FROM interests;", [], (err, result) => {
    if (err) {
      console.log({message: "Error: Could not insert"});
      console.log(err);
      return res.send({message: "Error: Could not insert"});
    } else{
      console.log(result);
      return res.send({interests:result});
    }
  });
});

// messages, sends back list of connections to message
server.post('/connections', (req, res)=> {
  const user = req.body.user;
  if(user){
    const userid =user.id;
    console.log(user);
    connection.query('SELECT * FROM connections WHERE user_id_from=? OR user_id_to=?;', [userid,userid], (error, result) =>{
      if (err) {
        console.log({message: "Error: Could not insert"});
        console.log(err);
        return res.send({message: "Error: Could not insert"});
      } else {
        return res.send({message: result});
      }
    });
  }
});

server.listen(8081, () => {
  console.log("Server is running.");
});

function authenticateToken(req, res, next) {
  let authHeader;
  if(req.headers.cookie){
    authHeader = req.headers.cookie.split(',')[0].split("=")[1]; // Get token
  }else{
    return res.sendStatus(403)
  }
  // EXPECTED HEADER WITH Axios (view login.js and signup.js)
  // headers: {
  //   'Authorization': 'Bearer'
  // }
  const token = authHeader;
  if (token == null) return res.sendStatus(401); // Invalid or null token

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => { // Verify token and extract user
    if (err) return res.sendStatus(403); // Invalid or expired token
    req.user = user; // Use user.email to get email addrs
    next();
  });
}

function generateAccessToken(email) {
  return jwt.sign({email: email}, ACCESS_TOKEN_SECRET, { expiresIn: '20m' }); // Generate access token that expires in 20 min
}

function getCurrentDateTime() {
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
  return date+' '+time;
}
