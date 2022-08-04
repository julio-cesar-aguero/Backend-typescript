import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
// const nodemailer = require("nodemailer");

async function main() {
    const hostname = "hostname from account page";
    const username = "username from account page";
    const password = "password from account page";

    const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "92b08c96ee6f55",
            pass: "739a05dac15e90"
        },
        logger: true
    })
    const info = await transporter.sendMail({
        from: '"Sender Name" <from@example.net>',
        to: "to@example.com",
        subject: "Hello from node",
        text: "Hello world?",
        html: "<strong>Hello world?</strong>",
        headers: { 'x-myheader': 'test header' }
    });

    console.log("Message sent: %s", info.response);
}

