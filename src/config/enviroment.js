import dotenv from 'dotenv';

let path = '.env.dev';

dotenv.config({ path })

export default { 
    DB_LINK: process.env.DB_LINK,
    PORT: process.env.PORT,
    DB_LINK_CREATE: process.env.DB_LINK_CREATE,
    KEYJWT: process.env.KEYJWT,
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    NODEMAILER_MAIL: process.env.NODEMAILER_MAIL,
    NODEMAILER_TOKENPASS: process.env.NODEMAILER_TOKENPASS
};