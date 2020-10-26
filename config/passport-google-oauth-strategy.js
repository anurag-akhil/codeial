const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy; 
const crypto = require('crypto');
const User = require('../models/users');


// tell passport to use google strategy
passport.use(new googleStrategy({
    clientID: "350038789612-q6pdnr53epk2i42pmtjeqnl1n4eplvgu.apps.googleusercontent.com",
    clientSecret:"sQ1b4717QJtpFKehk_Rh9j8_", 
    callbackURL: "http://localhost:8000/users/auth/google/callback"

}, function(accessToken, refreshToken, profile, done){
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