const crypto = require('crypto');
const { cookie } = require('express-validator');
const jwt = require('jsonwebtoken');
const VERIFY_ACCESS_TOKEN_SECRET = "133fb998c60fdaa6af5613b2670c2c3d5eb8a8d2bad8269c744b554b4dd24e9625d4efdbe3b56ebea2226a2daad84ffc4f8549a25a407b15d8dcfc8f6da65d6d";
var ACCESS_TOKEN_SECRETS = [];
const maxSecrets = 5; // Max size of ACCESS_TOKEN_SECRETS

/*
    05/02/21 - Eduard
    ACCESS_TOKEN_SECRETS array contains multiple secrets for enhanced security upon sign up.
    If the key was to be stolen, it wouln't that big of a concern because they will expire eventually.
    Email verify secret does not require that level of security, so it can remain a constant.
*/

setInterval(renewAcessToken, 3600000); // update access tokens each 1 hour
renewAcessToken();

function formatDateTime(dateTime) {
    var date = dateTime.getFullYear()+'-'+(dateTime.getMonth()+1)+'-'+dateTime.getDate();
    var time = dateTime.getHours() + "-" + dateTime.getMinutes() + "-" + dateTime.getSeconds();
    return date+' '+time;
}

function renewAcessToken() { // Regenerate secrets (synced with clock)
    var key = crypto.randomBytes(64).toString('hex'); // Generate secret
    if (ACCESS_TOKEN_SECRETS.length >= maxSecrets) {
        ACCESS_TOKEN_SECRETS.shift();
    }
    console.log("Renewed!")
    ACCESS_TOKEN_SECRETS.push(key);
}

module.exports = {
    generateEmailVerificationToken(email) {
        return jwt.sign({email: email}, VERIFY_ACCESS_TOKEN_SECRET, { expiresIn: '2 days', algorithm: "HS256" }); // Generate access token that expires in 20 min
    },
    getCurrentDateTime() {
        var today = new Date();
        return today.toUTCString();
    },
    // generates date 2 days later on
    generateFutureDateTime() {
        var futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 2);
        return futureDate.toUTCString();
    },
    getCookie(cookies, cookieName) {
        cookiesArr = cookies.split(';')
        for(var i =0; i<cookiesArr.length; i++) {
            const cookie = cookiesArr[i];
            if (cookie.includes(cookieName)) {
                return cookie.split('=')[1]
            }
        } 
    },
    async validateEmailVerificationToken(token) {
        let tokenUser = null;
        jwt.verify(token, VERIFY_ACCESS_TOKEN_SECRET, { algorithms: ["HS256"] }, (err, user) => { // Verify token and extract user
            if (err) {
                return res.sendStatus(403).send("Invalid or expired token."); // Invalid or expired token
            } else {
                tokenUser = user;
            }
            // return user; // Use user.email to get email addrs
        });
        return tokenUser;
    },
    getSecrets() {
        return ACCESS_TOKEN_SECRETS;
    },
    generateAccessToken(email) {
        const secret = ACCESS_TOKEN_SECRETS[ACCESS_TOKEN_SECRETS.length - 1]; // Get latest access token secret
        console.log(secret)
        return jwt.sign({email: email}, secret, { expiresIn: '1h', algorithm: "HS256" }); // Generate access token for sign-up
    }
}
