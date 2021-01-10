let mysql = require('mysql')

// const username = "epiz_27646481";
// const password = "zE2F3WtC6wutQY";
// const dbname = "epiz_27646481_refugeecenter";
// const host = "sql107.epizy.com";

const username = "root";
const password = "password";
const dbname = "refugeecenter";
const host = "localhost";

var connection = mysql.createConnection({
	host     : host,
	user     : username,
	password : password,
	database : dbname,
	insecureAuth: true
});

// Connect to mysql
connection.connect(function(err){
	if(!err){
 		console.log("Database is connected");
	} else {
		console.log("Error while connecting with database");
		console.log(err);
	}
});

class database{
	constructor(){
	}
	getUserByEmail(email){
		if(email){
			connection.query("SELECT * FROM users WHERE email = ?;", [req.body.user_email], (err, result) => { // Add account to database
				if (err) {
					console.log("Error: Could not get user.");
					console.log(err);
					return { message: "Error: Could not get user." };
				} else {
					if (result.length > 0) {
						let user = {
							first_name: result[0].first_name,
							last_name: result[0].last_name,
							email: result[0].email,
							speaking_language: result[0].speaking_language,
							preferred_language: result[0].preferred_language
						};
						return res.send({ user: user });
					} else {
						return res.send({ message: "Error: Could not get user." });
					}
				}
			});  
		}
	}
};



module.exports = {connection};