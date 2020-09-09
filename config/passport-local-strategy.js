const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User  = require('../models/users');

//authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email',
}, function(email, password, done){
    // find a user and establish the identity
    User.findOne({email: email}, function(err, user){
        if(err){
            console.log("error getting user");
            return done(err);                                    // err takes two args here we are passing only one.
        }
        if(!user || user.password != password)
        {
            console.log('invalid username/password');
            return done(null, false);                       // error is null and authentication failed.
        }
        return done(null, user);                            // error is null and user found.
    });
}

));

//serialize the user to decide which key to keep in cookie
passport.serializeUser(function(user, done){
    done(null, user.id);
});


// deserialize the user from the key in cookie
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err)
        {
            console.log('error in getting user in deserialzing');
            done(err);
        }
        done(null, user);
    });
});


//check whether user is authenticated
passport.checkAuthentication = function(req, res, next){         // middleware
   if(req.isAuthenticated())
   {
       return next();                                   // if the user is signed in let him/her view the page.
   } 
   else
        return res.redirect('/users/sign-in');          // if not signed in redirect to sign-in page
}

passport.setAuthenticatedUser = function(req,res, next){    // for sending the authenticated user to diff views.
    if(req.isAuthenticated())
        res.locals.user = req.user;
        // in the above line req.user have user info from session cookie and it is transfered into the locals for views.
        return next();
}


module.exports = passport;
