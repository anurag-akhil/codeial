const passport = require('passport');
const JWTstrategy = require('passport-jwt').Strategy;
const extractJWT = require('passport-jwt').ExtractJwt;
const env  = require('./environment');
const user = require('../models/users');

let opts = {
    jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.secret_key
}

passport.use(new JWTstrategy(opts, function(jwtPayLoad, done){
    user.findById(jwtPayLoad._id, function(err, user1){
        if(err){console.log("error in pass jwt config", err);}
        
        if(user1)
            return done(null, user1);
        
        else
            return done(null, false);

    });
}));

module.exports = passport;