const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 2525,
    secure: false,

    auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_SMTP_KEY,
    },

    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,
});

module.exports = transporter;