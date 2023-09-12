import nodmailer from 'nodemailer'


export const transporter = nodmailer.createTransport({
    service: 'gmail',
    port: 465,
    auth: {
        user: 'moreschivalen44@gmail.com',
        pass: 'rjlumqrycycbmfjf',
    },
})