let mysql = require('mysql')

// const username = "epiz_27646481";
// const password = "zE2F3WtC6wutQY";
// const dbname = "epiz_27646481_refugeecenter";
// const host = "sql107.epizy.com";

const username = "root";
const password = "password";
const dbname = "refugeecenter";
const host = "localhost";

// Connect to mysql
var connection = mysql.createConnection({
	host     : host,
	user     : username,
	password : password,
	database : dbname,
	insecureAuth: true
});

connection.connect(function(err){
	if(!err){
 		console.log("Database is connected");
	} else {
		console.log("Error while connecting with database");
		console.log(err);
	}
});

module.exports = {connection};