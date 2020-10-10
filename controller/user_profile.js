const user = require('../models/users');

module.exports.users = function(req, res){
    return res.render('user', {
        title: 'codeial'
    });
}

module.exports.sign_up = function(req, res){
    if(req.isAuthenticated())
        return res.redirect('/');
    return res.render('sign_up',{
        title: 'codeial / sign_up'
    });
}

module.exports.sign_in = function(req, res){
    if(req.isAuthenticated())
    {
        console.log('request came here');
        return res.redirect('/');
    }
    return res.render('sign_in',{
        title: 'codeial / sign_in'
    });
}
module.exports.profile = function(req, res){
    user.findById(req.params.id, function(err, user){ 
        return res.render('profile',{
            title: 'codeial / profile',
            profile_user: user
        });
    });
}
module.exports.update = function(req, res){
    if(req.user.id == req.params.id){
        user.findByIdAndUpdate(req.params.id, {  
            name: req.body.name,
            email: req.body.email
        }, function(err, user){
            console.log('updated user is ', user);
            return res.redirect('back');
        })
    }
    else
        return res.status(401).send('unathorised');
}
module.exports.sign_out = function(req, res){
    req.logout();
        return res.redirect('/');
}
module.exports.create = function(req, res){
    console.log("req reached the controller");
    if(req.body.password != req.body.confirm_password)
        return res.redirect('back');
    console.log("both password matches");
    console.log(req.body.email);
    user.findOne({email: req.body.email}, function(err, user1){
        console.log("user searched", user);
        if(err){console.log('error in finding user'); return;}
        if(!user1)
        {
            console.log("user is being created");
            user.create(req.body, function(err, user1){
                if(err){console.log('error in finding user'); return;}
                
                return res.redirect('/users/sign-in');
            });
        }
        else
        return res.redirect('back');
    });
    
};

module.exports.create_session = function(req, res){
    return res.redirect('/');
};