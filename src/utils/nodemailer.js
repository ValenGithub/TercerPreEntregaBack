import nodmailer from 'nodemailer'
import enviroment from '../config/enviroment.js'


export const transporter = nodmailer.createTransport({
    service: 'gmail',
    port: 465,
    auth: {
        user: enviroment.NODEMAILER_MAIL,
        pass: enviroment.NODEMAILER_TOKENPASS,
    },
})