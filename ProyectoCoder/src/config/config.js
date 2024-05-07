import dotenv from 'dotenv';

dotenv.config();

export default {
    port: process.env.PORT,
    gmailAccount: process.env.GMAIL_ACCOUNT,
    gmailAppPassword: process.env.GMAIL_APP_PASSWD,
    dbPassword: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
    privateKey: process.env.PRIVATE_KEY,
    sessionSecret: process.env.SESSION_SECRET
};
