const express = require('express');
const env = require('./config/environment');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const app = express();
require('./config/view-helper')(app);
const port = 8000;

const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');//though we have already called passport in the local strategy file still we have to call passport here
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth-strategy');

const MongoStore = require('connect-mongo')(session);
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const custom = require('./config/flash');


const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');

const path = require('path');

if(env.name == "production")
{
    console.log("******************************************");
    console.log(env.asset_path);
}

if(env.name == "devlopment"){
    console.log("******************************************");
    console.log(env.asset_path);
app.use(sassMiddleware({
    src: path.join(__dirname, env.asset_path, 'scss'),/*'./assets/scss',*/
    dest: path.join(__dirname, env.asset_path, 'css'),
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));
}


app.use(express.urlencoded());
app.use(cookieParser());

app.use(logger(env.morgan.mode, env.morgan.options));

app.use(express.static(env.asset_path));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(expressLayouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
    name: 'codeial',
    //TODO change the secret before deployment
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie:{
        maxAge:(1000 * 60 * 100)    
    },
    store: new MongoStore(
        {
            mongooseConnection: db,
            autoRemove: 'disabled'

        },
        function(err){
            (console.log(err|| 'connected to mongostore '));
        }
    )
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use((custom.setFlash));

app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err)
    {
        console.log(`error in firing the server : ${err}`);
        return;
    }
    console.log(`server up and running on port :${port}`);
});