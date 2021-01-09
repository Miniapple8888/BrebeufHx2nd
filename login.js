// var mysql = require('mysql');
// var express = require('express');
// var session = require('express-session');
// var bodyParser = require('body-parser');
// var path = require('path');

// let connection = require('/config.js');


let xhr = new XMLHttpRequest();

$(document).ready(function() {

});

$('#login-button').on('click', function() { // Login button pressed

    var email = $('#email').val();
    var rawPassword = $('#password').val();

    // validation
    if (email === "" || email == null) {
        alert("Email is invalid.")
    } else if (rawPassword.length < 6) {
        alert("A minimum password length of 6 characters is required.")
    } else {
        xhr.open("POST", window.location.host, true);
        xhr.setRequestHeader('Content-Type', 'application/json'); // Still looking for encryption solutions
        xhr.send({
            email: email,
            password: rawPassword
        });
    }
});