const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User} = require('../models/models');
const Mailer = require('../mailer/index.js');
const { generateAccessToken, generateFutureDateTime, getSecrets } = require('../helpers.js');

const mailer = new Mailer();

module.exports = {
    forgot(req, res) {
        let email = req.body.email;
        // look up user check if exist
        User.findAll({ where: { email: email }}).then(res1 => {
            if (res1[0]) {
                // email exists 
                // then generate token & send email
                let token = generateAccessToken(email);
                let futureDate = generateFutureDateTime();
                mailer.sendMail("noreply@langr.com", email, "Reset password", `http://localhost:8082/reset/${token}`, `http://localhost:8082/reset/${token}`);
                return res.status(200).send({ message: "Successfully sent link to your email to reset your password!" });
            }
            return res.send({ errors: [{msg: "Invalid email account"}] });
        }).catch(e => { return res.status(404).send(e); });
    },
    // verify reset: ensure token is valid, return user email and whether token is valid
    verifyReset(req, res) {
        let token = req.body.token;
        const secrets = getSecrets();
        for (var s = 0; s < secrets.length; s++) { // Check with every secret
            jwt.verify(token, secrets[s], { algorithms: ["HS256"] }, (err, user) => { // Verify token and extract user

                if (err) { // Invalid or expired token
                    if (s == secrets.length - 1) {
                        return res.status(200).send({ message: 'Invalid or expired token', valid: false })
                    }
                } else {
                    User.findAll({ where: { email: user.email }, }).then(userFound => {
                        // simple check to know whether we have a user associated to that email
                        if (userFound.length > 0) {
                            return res.send({ email: userFound[0].email , valid: true});
                        }
                        return res.send({ valid: false });
                    }).catch(e => {
                        console.log(e);
                        return res.status(200).send({ message: 'Invalid or expired token', valid: false, error: e })
                    });
                }
            });
        }
    },
    // reset password
    reset(req, res) {
        try {
            // Check if there are any errors during the validation of the reset password form
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.send({ errors: errors.array() });
            }
            // encrypt password
            bcrypt.hash(req.body.password, 10).then(passwordHash => {
                // update user password
                User.update({ passwordHash: passwordHash }, { where: {email: req.body.email} }).then(updateRes => {
                    return res.status(200).send({ message: "Password successfully reset. You may now log in." })
                }).catch(e => {return res.status(400).send(e)});
            }).catch(e => {return res.status(400).send(e)});
        } catch(e) { return res.status(400).send(error); }
    },
    validateNewPassword: [
        check('password')
        .isLength({ min:5, max: 30 }).withMessage('Password must be between 5 to 30 characters.')
        .matches('[0-9]').withMessage('Password must contain at least one digit.')
        .matches('[a-z]').withMessage('Password must contain at least one lowercase letter.')
        .matches('[A-Z]').withMessage('Password must contain at least one uppercase letter')
        .custom((value, {req, loc, path}) => {
            if (value !== req.body.confirmPassword) {
                return false;
            } else {
                return value;
            }
        }).withMessage("Passwords don't match."),
    ]
};