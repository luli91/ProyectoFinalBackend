import nodemailer from 'nodemailer';
import config from '../config/config.js';
import {__dirname} from '../utils.js'


// configuracion de transport
export const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false,
    auth: {
        user: config.gmailAccount,
        pass: config.gmailAppPassword
    },
    tls: {
        rejectUnauthorized: false
    }
})

// Verificamos conexion con gmail
transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
})

export async function sendEmail(to, subject, html) {
    // console.log(`to: ${to}`);
    // console.log(`subject: ${subject}`);
    // console.log(`html: ${html}`);
    const mailOptions = {
        from: "Coder Test - " + config.gmailAccount,
        to: to,
        subject: subject,
        html: html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Resultado del envío de correo:", result);
}