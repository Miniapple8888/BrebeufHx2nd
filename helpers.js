const ACCESS_TOKEN_SECRET = "133fb998c60fdaa6af5613b2670c2c3d5eb8a8d2bad8269c744b554b4dd24e9625d4efdbe3b56ebea2226a2daad84ffc4f8549a25a407b15d8dcfc8f6da65d6d";
const jwt = require('jsonwebtoken');

function formatDateTime(dateTime) {
    var date = dateTime.getFullYear()+'-'+(dateTime.getMonth()+1)+'-'+dateTime.getDate();
    var time = dateTime.getHours() + "-" + dateTime.getMinutes() + "-" + dateTime.getSeconds();
    return date+' '+time;
}

module.exports = {
    generateAccessToken(email) {
        return jwt.sign({email: email}, ACCESS_TOKEN_SECRET, { expiresIn: '2 days', algorithm: "HS256" }); // Generate access token that expires in 20 min
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
    async verifyToken(token) {
        var toReturn = {};
        jwt.verify(token, ACCESS_TOKEN_SECRET, { algorithms: ["HS256"] }, (err, user) => { // Verify token and extract user
            if (err) return res.sendStatus(403); // Invalid or expired token
            toReturn = user;
            console.log(toReturn);
            return user; // Use user.email to get email addrs
        });
        return toReturn;
    },
}
