/*
let mysql = require('mysql')

let username = "id15872316_dfsdfs999";
let password = "p-05OE(AfyEtLS2K";
let dbname = "id15872316_refugeecenter";
let host = "localhost";

// connect to mysql
var connection = mysql.createConnection({
	host     : host,
	user     : username,
	password : password,
	database : dbname
});

connection.connect(function(err){
if(!err){
    console.log("Database is connected");
}else{
    console.log("Error while connecting with database");
}
});
module.exports = {connection};
*/
const { Client } = require('pg')
const client = new Client()
client.connect()
