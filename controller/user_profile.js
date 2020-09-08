const user = require('../models/users');

module.exports.users = function(req, res){
    console.log('cookie is ', req.cookies.user_id);
    user.findOne({_id : req.cookies.user_id},function(err, user1){
        if(err){console.log('error in getting user');}
        if(!user1)
        {
            console.log('user is not signed in');
            return res.redirect('/users/sign-in');                  // always use if and else statements else it will  
        }                                                           //asynchronously call another res.render(if not written under else)
        else
        {
            return res.render('user', {
                title: 'codeial',
                name: user1.name
            });
        }
    });
};

module.exports.sign_up = function(req, res){
    return res.render('sign_up',{
        title: 'codeial / sign_up'
    });
}

module.exports.sign_in = function(req, res){
    return res.render('sign_in',{
        title: 'codeial / sign_in'
    });
};
module.exports.kill_cookie = function(req, res){
    res.clearCookie('user_id');
    res.redirect('back');
};

module.exports.create = function(req, res){
    if(req.body.password != req.body.confirm_password)
    console.log(req.body.email);
    user.findOne({email: req.body.email}, function(err, user1){
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
    
    user.findOne({'email': req.body.email, 'password': req.body.password}, function(err, user2){
        console.log('user2 is_ ', user2);
        if(!user2)
            return res.redirect('back');
        else
        {
            console.log('hello', user2);
            res.cookie('user_id', user2.id);
            return res.redirect('/');
        }
    });
};