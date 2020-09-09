const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;

const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');//though we have already called passport in the local strategy file still we have to call passport here
const mongoStore = require('connect-mongo')(session);
app.use(expressLayouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static('./assets'));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
    name: 'codeial',
    //TODO change the secret before deployment
    secret: 'justsomething',
    saveUninitialized: false,
    resave: false,
    cookie:{
        maxAge:(1000 * 60 * 100)    
    },
    store: new mongoStore(
        {
            mongooseConnection: db,
            autoRemove: 'disabled'
        },
        function(err){(console.log(err|| 'connected to mongostore '));}
    )
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use('/', require('./routes/index'));

app.listen(port, function(err){
    if(err)
    {
        console.log(`error in firing the server : ${err}`);
        return;
    }
    console.log(`server up and running on port :${port}`);
});