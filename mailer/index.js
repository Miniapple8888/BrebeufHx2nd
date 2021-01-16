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
        }).then(info => {
            return { message: "Sucessfully sent email!" }
        }).catch(e => {return {message: "Problem with sending email"}});
    }
}

module.exports = Mailer;