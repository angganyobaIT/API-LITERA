require("dotenv").config();

const transporter =
    require("./src/config/mail");

(async () => {

    try {

        console.log("VERIFYING...");

        await transporter.verify();

        console.log("SMTP OK");

        const info =
            await transporter.sendMail({

                from:
                    process.env.EMAIL_USER,

                to:
                    process.env.EMAIL_USER,

                subject:
                    "TEST EMAIL",

                html:
                    "<h1>TEST EMAIL BERHASIL</h1>"
            });

        console.log(info);

    } catch (err) {

        console.log(err);
    }

})();