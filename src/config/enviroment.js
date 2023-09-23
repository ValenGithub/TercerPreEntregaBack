import dotenv from 'dotenv';

let path = '.env.dev';

dotenv.config({ path })

export default { 
    DB_LINK: process.env.DB_LINK,
    PORT: process.env.PORT,
    DB_LINK_CREATE: process.env.DB_LINK_CREATE,
    KEYJWT: process.env.KEYJWT
};