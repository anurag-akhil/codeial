const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy; 
const crypto = require('crypto');
const env = require('./environment');
const User = require('../models/users');


// tell passport to use google strategy
passport.use(new googleStrategy(env.google, function(accessToken, refreshToken, profile, done){
    // find a user
    User.findOne({email: profile.emails[0].value}).exec(function(err, user){
        if(err){console.log("error in google strategy ", err); return;}

        console.log("profile is ", profile);
        // if found put user in req.user
        if(user){
            return done(null, user);
        }
        else{
            // if not found create a user in db and set it as req.user
            User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex')
            }, function(err, user){
                if(err){console.log('error in creating user by google auth', err); return;}
                return done(null, user);
            });
        }
    });
}

));