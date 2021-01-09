let connection = require('./config.js');
let MessageApp = require("./messageApp.js");
const JSDOM = require("jsdom");
const http = require("http");
const $ = require("jquery");
const fs = require("fs");
const url = require("url");


var totalUserCount = 0;
//structure of a user, if info is missing just add it, a javascript object is dynamically typed anyway
class user {
  constructor(
    firstName, lastName,
    ID = totalUserCount,
    preferredLanguage,
    speakingLanguages,
    Interests,
    email,
    location,
    //profilePic, ? idk how to implement this
    contacts) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.ID = ID;
    this.preferredLanguage = preferredLanguage;
    this.speakingLanguages = speakingLanguages
    this.Interests = Interests;
    this.email = email;
    this.location = location;
    this.contacts = contacts;
    this.client=null;
    this.online=true;
  }
}

var users = [];

// Create server
var server = http.createServer((request, response) => {
  if (request.method == "POST") {
    //code to add user to db
    var body = ''
    request.on('data', function (data) {
      body += data
    })
    request.on('end', function () {
      //body processing
    })
  } else {

  }
  var pathname = url.parse(request.url).pathname.substr(1);
  if (pathname == "" || pathname == "login" || pathname == "login.html") {//checks the pathname after the name of server. ex: 127.0.0.1:8080/webpage pathname = webpage
    fs.readFile("login.html", function (err, data) { // Read and prepare login.html page
      if (err) { // Error handler (i mean it would be a big problem if login.html was not there)
        console.log(err);
        response.writeHead(404, { "Content-Type": "text/html" });
        response.end();
      } else {
        response.writeHead(200, { "Content-Type": "text/html" }); // Send the page to user
        var html = data.toString();
        const page = new JSDOM(html);
        //if needed some JQuery stuff
        response.write(page.serialize());
        response.end();
      }
    });
  } else {
    fs.readFile(pathname, function (err, data) { // Find requested page
      if (err) { // Error handler
        console.log(err);
        response.writeHead(404, { "Content-Type": "text/html" });
        response.end();
      } else {
        response.writeHead(200, { "Content-Type": "text/html" }); // Send the page to user
        var html = data.toString();
        const page = new JSDOM(html);
        //if needed some JQuery stuff
        response.write(page.serialize());
        response.end();
      }
    });
  }
});

var MSGApp = new MessageApp.UserMessageApplication(server, []);


//---------------------------------------------------------------------------------------
//    whenever updating data and sending it to db call MSGApp.updateUserList(userList)
//---------------------------------------------------------------------------------------
function createUser(user){
  users.push(user);
  MSGApp.updateUserList(users);
}



// Start server
server.listen(8080);