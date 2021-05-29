const {check, body, validationResult} = require('express-validator'); // Middleware for credentials validation
const bcrypt = require('bcrypt'); // Password encryption
const {User, Interest} = require('../models/models'); // Database models
const { generateEmailVerificationToken, validateEmailVerificationToken } = require('../helpers.js'); // Email methods for validation
const Mailer = require('../mailer/index.js'); // Email verification

const mailer = new Mailer();

module.exports = {
    /*
    Creates new user when signing up
     */
    async create(req, res) {

        // Check if there are any errors during the validation of the new user form
        var errorsArray = validationResult(req).errors;
            
        // Check whether user's email exists
        await User.findOne({ where: { email: req.body.email } }).then(resp => {
            // User email exists already
            if (resp) {
                errorsArray.push({ msg: "Email already exists." });
            }
        }).catch(e => { // Normally this should never be called (debug only)
            console.log(e);
            return res.status(403).send({ message: "Yep, something went wrong here" });
        });
            
        // If there are any errors, send them back
        if (errorsArray.length > 0) {
            console.log(errorsArray);
            return res.send({ errors: errorsArray, message: "Credentials Error"});
        }

        // Generate verification token
        const emailVerificationToken = generateEmailVerificationToken(req.body.email); // **SHOULD USE SOMETHING DIFFERENT THAN THE EMAIL SYSTEM
            
        // Sends email to user
        mailer.sendVerificationMail("noreply@langr.com", req.body.email, emailVerificationToken);

        // insert new interests
        // should go through a validator filter as well
        // check if any of the interest exist in the database
        // interests objects
        let interests = [];
        for (let i = 0; i < req.body.interests.length; i++) {
            let interest = req.body.interests[i].toLowerCase();
            let foundInterest =  await Interest.findOne({ where: { name: interest } });
            if (foundInterest) {
                interests.push(foundInterest);
            } else {
                // else create new interest name MUST BE UNIQUE
                await Interest.create({ name: interest }).then((res) => { 
                    interests.push(res); 
                }).catch((e) => console.log(e));
            }
        }

        // encrypt password
        bcrypt.hash(req.body.password, 10).then(passwordHash => {
            // create user

            User.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                passwordHash: passwordHash,
            }).then(user => {
                user.addInterests(interests, {through: "User_Interest"});
                return res.status(202).send( { message: "Successfully created an account! Sent verification email!"} );
            });
        }).catch(err => { 
            return res.status(403).send({errors: err, message: "Could not encrypt password."});
        });
        
    },
    // Find User return user
    find(req, res) {
        User.findOne({ where: { email: req.body.email } }).then(user => {
            return res.status(200).send(user);
        }).catch(e => {
            console.log(e);
            return res.status(400).send(e);
        })
    },
    // Verify email address of person
    verify(req, res) {
        let token = req.body.token || "";
        // Fetch user associated to token and check if it is still valid
        var userFound = validateEmailVerificationToken(token);
        validateEmailVerificationToken(token).then(userFound => {
            // find user according to email
            User.findOne({ where: { email: userFound.email },}).then(user => {
                // simple check to know whether we have a user associated to that email
                if (user) {
                    if (!user.emailVerified) {
                        // Update user verified
                        User.update({ emailVerified: true }, { where: { email: user.email } }).then(res => {
                            return res.status(200).send({verified: true});
                        }).catch(e => { return res.status(400).send(e) });
                    } else {
                        // User's email is already verified!
                        return res.send({ message: "Email already verified.", verified: true });
                    }
                }
            }).catch(e => { console.log(e); return res.send({ verified: false });});
        }).catch(e => { console.log(e); return res.send({ verified: false });});
    },
    validateCredentials: [ // Input credentials verification
        check('email')
            .isEmail().withMessage('Email is not valid.'),
        check('firstName')
            .isAlpha().withMessage('First name must contain letters.')
            .isLength({ min: 2, max: 30 })
            .withMessage('First name size must be between 2 to 30 letters.'),
        check('lastName')
            .isAlpha().withMessage('Last name must contain letters.')
            .isLength({ min: 2, max: 30 }).withMessage('Last name size must be between 2 to 30 letters.'),
        check('password')
            .isLength({ min: 5 , max: 255 }).withMessage('Password must be at least 5 characters long (255 max).')
            .matches('[0-9]').withMessage('Password must contain at least one digit.')
            .matches('[a-z]').withMessage('Password must contain at least one lowercase letter.')
            .matches('[A-Z]').withMessage('Password must contain at least one uppercase letter')
            .custom((value, { req }) => {
                if (value !== req.body.confirmPassword) {
                    return false;
                } else {
                    return value;
                }
            }).withMessage('Passwords must match.'),
        // check('spokenLanguages')
        //     .custom((value, { req }) => {
        //         if (value.length > 0) {
        //             return value;
        //         } else {
        //             return false;
        //         }
        //     }).withMessage('A minimum of 1 spoken language is required.'),
        // check('learningLanguages')
        //     .custom((value, { req }) => {
        //         if (value.length > 0) {
        //             return value;
        //         } else {
        //             return false;
        //         }
        //     }).withMessage('A minimum of 1 learning language is required.'),
    ]
}