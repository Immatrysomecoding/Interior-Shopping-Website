const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
module.exports = async (email, subject, text) => {

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS, 
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            text: text,
        });
        console.log("email sent successfully");
    } catch (err) {
        console.log("email not sent!");
        return err;
    }
};
