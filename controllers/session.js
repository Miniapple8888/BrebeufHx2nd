const bcrypt = require('bcrypt'); // Password encryption
const {User} = require('../models/models'); // Database model 'User'
const { generateAccessToken } = require('../helpers.js'); // JWT token

module.exports = {
    // When user logs in
    new(req, res){ 
        let currentUser = req.currentUser;
        return res.status(200).send({auth: currentUser});
    },
    // Creates new user session
    async create(req, res) {
        const email = req.body.email;
        const password = req.body.password;

        // search email if account exists && account is verified
        await User.findOne({ where: { email: email }}).then(user => {
            if (user) {
                if (user.emailVerified) {
                    // TODO update user date logged in
                    // TODO update user status logged in
                    if (bcrypt.compare(password, user.passwordHash)) {
                        User.update({ loggedIn: true, lastLoggedIn: new Date() }, { where: {email: user.email} }).then(userUpdate => {
                            const accessToken = generateAccessToken(email);
                            req.cookies.userData = accessToken;
                            return res.cookie("UserData", accessToken, {maxAge: 360000}).send({ // return JWT token
                                message: "Success",
                                user: user
                            });
                        }).catch(e => {
                            console.log(e);
                            return res.send({errors: [{msg: "Error"}]});
                        });
                    } else { return res.send({errors: [{msg: "Incorrect email or password."}]}); } // Password is incorect
                    
                } else { return res.send({errors: [{msg: "Account is not verified."}]}); } // Account is not verified yet
            } else { return res.send({errors: [{msg: "Incorrect email or password."}]}); } // Could not find email
        }).catch((err) => {
            return res.send({errors: [{msg: "Incorrect email or password."}]}); // Could not find email
        });
            
        // check if password is correct
        // return error message otherwise
    },
    // When user logs out
    destroy(req, res) {
        // find user make sure connected (auth)
        const email = req.currentUser.email || "";
        return User.findOne({
            where: {
                email: email
            }
        }).then(user => {
            // TODO update user status logged in false
            User.update({ loggedIn: false }, {
                where: {
                    email: user.email
                }
            }).then(result => {
                // clear cookies
                return res.clearCookie('UserData').send({message: "Successfully logged out"});
            }).catch(e => {
                console.log(e);
                return res.status(400).send(e);
            });
        }).catch(e => {
            console.log(e);
            return res.send(e);
        });
    }
}