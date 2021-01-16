const bcrypt = require('bcrypt');
const {DataTypes} = require('sequelize');
const db = require('../models/index');
const User = require('../models/user')(db.sequelize, DataTypes);
const { generateAccessToken } = require('../helpers.js');

module.exports = {
    // When user logs in
    new(req, res){ 
        let currentUser = req.currentUser;
        console.log(currentUser);
        return res.status(200).send({auth: currentUser});
    },
    create(req, res) {
        var email = req.body.email;
        var password = req.body.password;
        // search email if account exists && account is verified
        User.findAll({
            where: {
                email: email
            }
        }).then(user => {
            if(user.length == 1) {
                if (user[0].emailVerified && bcrypt.compare(password, user[0].passwordHash)) {
                    // TODO update user date logged in
                    // TODO update user status logged in
                    User.update({ loggedIn: true, lastLoggedIn: new Date() }, {
                        where: {
                            email: user[0].email
                        }
                    }).then(userUpdate => {
                        const accessToken = generateAccessToken(email);
                        req.cookies.userData = accessToken;
                        return res.cookie("UserData", accessToken, {maxAge: 360000}).send({
                            message: "Success",
                            user: user[0]
                        });
                    }).catch(err => {
                        console.log(err);
                        return res.status(400).send(err);
                    });
                }
            }
        }).catch(e => {
            return res.send({message: "Error: Incorrect email or password."});
        })
        // check if password is correct
        // return error message otherwise
    },
    // When user logs out
    destroy(req, res) {
        // find user make sure connected (auth)
        const email = req.currentUser.email;
        return User.findAll({
            where: {
                email: email
            }
        }).then(user => {
            // TODO update user status logged in false
            User.update({ loggedIn: false }, {
                where: {
                    email: user[0].email
                }
            }).then(result => {
                // clear cookies
                return res.clearCookie('UserData').send({message: "Successfully logged out"});
            }).catch(e => {
                console.log(e);
                res.status(400).send(e);
            });
        }).catch(e => {
            console.log(e);
            return res.send(e);
        });
    }
}