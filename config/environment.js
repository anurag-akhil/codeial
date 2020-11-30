const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');


const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)   ;

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
});

const devlopment = {
    name: 'devlopment',
    asset_path: './assets',
    session_cookie_key: 'justsomething',
    db: 'codeial_development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth:{
            user: 'akhil.anurag1999@gmail.com',
            pass: 'Akhism47'
        }
    },
    google: {
        clientID: "350038789612-q6pdnr53epk2i42pmtjeqnl1n4eplvgu.apps.googleusercontent.com",
        clientSecret:"sQ1b4717QJtpFKehk_Rh9j8_", 
        callbackURL: "http://localhost:8000/users/auth/google/callback"
    
    },
    secret_key: 'codeial',
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }
};

const production = {
    name: 'production',
    asset_path: process.env.CODEIAL_ASSET_PATH,
    session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY,
    db: process.env.CODEIAL_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth:{
            user:  process.env.CODEIAL_AUTH_USER,
            pass: process.env.CODEIAL_AUTH_PASS
        }
    },
    google: {
        clientID: process.env.CODEIAL_CLIENT_ID,
        clientSecret:  process.env.CODEIAL_CLIENT_SECRET, 
        callbackURL:   process.env.CODEIAL_CALLBACK_URL
    
    },
    secret_key: process.env.CODEIAL_SECRET_KEY,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
};

module.exports = eval(process.env.NODE_ENV) == undefined ? devlopment: eval(process.env.NODE_ENV);