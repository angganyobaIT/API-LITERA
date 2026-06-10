// test-mail.js

require("dotenv").config();

const transporter =
    require("./src/config/mail");

async function test() {
    try {
        await transporter.verify();

        console.log(
            "SMTP Brevo Connected"
        );
    } catch (err) {
        console.error(err);
    }
}

test();