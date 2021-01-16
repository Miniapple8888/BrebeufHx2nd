const ACCESS_TOKEN_SECRET = "133fb998c60fdaa6af5613b2670c2c3d5eb8a8d2bad8269c744b554b4dd24e9625d4efdbe3b56ebea2226a2daad84ffc4f8549a25a407b15d8dcfc8f6da65d6d";
const jwt = require('jsonwebtoken');

// TODO: middleware to check whether user connected or not
// Logged in return user
// Not logged in return false

module.exports = {
    authenticated(req, res, next) {
        let authHeader;
        if(req.headers.cookie){
            authHeader = req.headers.cookie.split(',')[0].split("=")[1]; // Get token
        }else{
            //return res.sendStatus(403)
            req.currentUser = false;
        }
        // EXPECTED HEADER WITH Axios (view login.js and signup.js)
        // headers: {
        //   'Authorization': 'Bearer'
        // }
        const token = authHeader;
        if (token == null) req.currentUser = false; // Invalid or null token
        jwt.verify(token, ACCESS_TOKEN_SECRET, { algorithms: ["HS256"] }, (err, user) => { // Verify token and extract user
            if (err) req.currentUser = false; // Invalid or expired token
            req.currentUser = user; // Use user.email to get email addrs
            next();
        });
    }
}

  