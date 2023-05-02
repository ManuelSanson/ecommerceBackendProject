import dotenv from 'dotenv';

dotenv.config()
export default {
    port: process.env.PORT || 8080,
    persistence: process.env.PERSISTENCE,
    mongoURI: process.env.MONGO_URI,
    mongoDBname: process.env.MONGO_DB_NAME,
    mailUser: process.env.MAIL_USER,
    mailPass: process.env.MAIL_PASSWORD,
    jwtKey: process.env.JWT_KEY
}