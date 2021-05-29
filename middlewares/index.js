const ACCESS_TOKEN_SECRET = "133fb998c60fdaa6af5613b2670c2c3d5eb8a8d2bad8269c744b554b4dd24e9625d4efdbe3b56ebea2226a2daad84ffc4f8549a25a407b15d8dcfc8f6da65d6d";
const jwt = require('jsonwebtoken');
const { getSecrets, getCookie } = require('../helpers.js');

// TODO: middleware to check whether user connected or not
// Logged in return user
// Not logged in return false

module.exports = {
    authenticated(req, res, next) {
        let authHeader;
        if (req.headers.cookie){
            authHeader = getCookie(req.headers.cookie, 'UserData')
        } else {
            req.currentUser = false;
            return next();
        }

        const token = authHeader;
        if (token == null) { // Invalid or null token
            req.currentUser = false;
            return next();
        }

        const secrets = getSecrets(); // Retrieve list of secrets
        for (var s = 0; s < secrets.length; s++) { // Check with every secret
            jwt.verify(token, secrets[s], { algorithms: ["HS256"] }, (err, user) => { // Verify token and extract user

                if (err) { // Invalid or expired token
                    if (s == secrets.length - 1) {
                        req.currentUser = false; 
                        return next();
                    }
                } else {
                    req.currentUser = user; // Use user.email to get email addrs
                    return next();
                }
            });
        }
    }
}