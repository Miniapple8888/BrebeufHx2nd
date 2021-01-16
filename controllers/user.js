const bcrypt = require('bcrypt');
const {DataTypes} = require('sequelize');
const db = require('../models/index');
const User = require('../models/user')(db.sequelize, DataTypes);
const { generateFutureDateTime, generateAccessToken, verifyToken } = require('../helpers.js');
const Mailer = require('../mailer/index.js');

const mailer = new Mailer();

module.exports = {
    /*
    Creates new user when signing up
    Generate verification token
    Sends verification email
     */
    create(req, res) {
        let emailVerificationExpirationDate = generateFutureDateTime()
        let emailVerificationToken = generateAccessToken(req.body.email);
        // sends email to user
        mailer.sendMail("noreply@langr.com", req.body.email, "Verify your account", `http://localhost:8082/verify/${emailVerificationToken}`, `<p>http://localhost:8082/verify/${emailVerificationToken}</p>`)
        // encrypt password
        bcrypt.hash(req.body.password, 10).then(passwordHash => {
            console.log(passwordHash);
            // create user
            return User.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                passwordHash: passwordHash,
                emailVerificationToken: emailVerificationToken,
                emailVerificationExpirationDate: emailVerificationExpirationDate
            }).then(user => {
                res.status(201).send({ error: "", message: "Successfully created an account! Sent verification email!" });
            })
            .catch(error => res.status(400).send(error));
        }).catch(e => res.status(400).send(error));
    },
    // Find User return user
    find(req, res) {
        User.findAll({
            where: {
                email: req.body.email
            },
        }).then(user => {
            return res.status(200).send(user);
        }).catch(e => {
            console.log(e);
            return res.status(400).send(e);
        })
    },
    // Verify email address of person
    verify(req, res) {
        let token = req.body.token;
        // Fetch user associated to token
        verifyToken(token).then(userFound => {
            // find user
            User.findAll({
                where: {
                    email: userFound.email
                },
            }).then(user => {
                // Check if token is valid for current date
                // TODO: Check also whether user is already verified.
                let emailVerificationExpirationDate = user[0].emailVerificationExpirationDate + "Z";
                let expirationDate = new Date(emailVerificationExpirationDate);
                let currentDate = new Date();
                if(expirationDate >= currentDate) {
                    // TODO: Update confirmed user
                    console.log("Not expired!");
                    User.update({ emailVerified: true }, {
                        where: {
                            email: user[0].email
                        }
                    }).then(result => {
                        return res.status(200).send({verified: true});
                    }).catch(e => {
                        console.log(e);
                        res.status(400).send(e);
                    });
                } else {
                    // Delete user with expired token
                    User.destroy({
                        where: {
                            email: user.email
                        }
                    }).then(res => {
                        return res.status(200).send({verified: false});
                    }).catch(e => res.status(400).send(e));
                }
            }).catch(e => {
                console.log(e);
                return res.status(400).send(e);
            });
        });
    }
}