"use strict";
const nodemailer = require("nodemailer");

class Mailer {

    constructor(configs=[]) {
        this.transporter = nodemailer.createTransport({
            host: "localhost",
            port: 1025,
            ignoreTLS: true,
        });
    }

    // sends mail
    sendMail(from, to, subject, text, html) {

        this.transporter.sendMail({
            from: from,
            to: to,
            subject: subject,
            text: text,
            html: html,
        }, (err, data) => {
            if (err) { 
                return { message: "Problem with sending email" }; 
            } else {
                return { message: "Sucessfully sent email!" }
            }
        });
    }

    sendVerificationMail(from, to, token) { // Sends verification email for account
        var htmlMessage = `
            <p>http://localhost:8082/verify/${token}</p>
        `;

        return this.sendMail(from, to, "Verify your Langr account", "", htmlMessage);
    }
}

module.exports = Mailer;