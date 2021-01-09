// var mysql = require('mysql');
// var express = require('express');
// var session = require('express-session');
// var bodyParser = require('body-parser');
// var path = require('path');

// let connection = require('/config.js');


let xhr = new XMLHttpRequest();

$('#login-button').on('click', function() { // Login button pressed
    console.log("Login clicked.");

    var email = $('#email').val();
    var rawPassword = $('#password').val();

    xhr.open("POST", "", true);

    // $(".loginForm").submit();
});