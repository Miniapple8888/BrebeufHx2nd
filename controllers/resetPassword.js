const bcrypt = require('bcrypt');
const {DataTypes} = require('sequelize');
const db = require('../models/index');
const User = require('../models/user')(db.sequelize, DataTypes);
const Mailer = require('../mailer/index.js');
const { generateAccessToken, generateFutureDateTime, verifyToken } = require('../helpers.js');

const mailer = new Mailer();

module.exports = {
    forgot(req, res) {
        let email = req.body.email;
        // look up user check if exist
        User.findAll({
            where: {
                email: email
            }
        }).then(res1 => {
            if (res1[0]) {
                // email exists 
                // then generate token & send email & store in db
                let token = generateAccessToken(email);
                let futureDate = generateFutureDateTime();
                User.update({ resetToken: token, resetExpiredAt: futureDate }, {
                    where: {
                        email: email
                    }
                }).then(resp2 => {
                    mailer.sendMail("noreply@langr.com", email, "Reset password", `http://localhost:8082/reset/${token}`, `http://localhost:8082/reset/${token}`);
                    return res.status(200).send({ message: "Successfully sent link to your email to reset your password!" });
                }).catch(e => res.status(400).send({ message: "Errorrr" }))
            } else {
                return res.send({ message: "Account does not exist" });
            }
        }).catch(e => {
            console.log(e);
        });
    },
    // verify reset: ensure token is valid, return user email
    verifyReset(req, res) {
        let token = req.body.token;
        verifyToken(token).then(userFound => {
            User.findAll({
                where: {
                    email: userFound.email
                },
            }).then(user => {
                // verify if reset token is valid
                let expiredDate = new Date(user[0].resetExpiredAt+'Z');
                if(expiredDate >= new Date()) {
                    return res.send({ message: 'Successful', email: user[0].email , success: true});
                } else {
                    return res.send({ message: "Reset token expired. Enter your email in forgot your password page again.", success: false })
                }
            }).catch(e => {return res.status(400).send(e)});
        }).catch(e => {return res.status(400).send(e)});
    },
    // reset password
    reset(req, res) {
        let email = req.body.email;
        let password = req.body.password;
        // encrypt password
        bcrypt.hash(password, 10).then(passwordHash => {
            // update user password && resetToken
            let pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - 99);
            User.update({ passwordHash: passwordHash, resetToken: '', resetExpiredAt: pastDate }, {
                where: {email: email}
            }).then(updateRes => {
                return res.status(200).send({ message: "Password successfully reset. You may now log in." })
            }).catch(e => {return res.status(400).send(e)});
        }).catch(e => {return res.status(400).send(e)});
    },
};