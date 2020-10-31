const user = require('../models/users');
const user_recovery = require('../models/users_recovery');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const recover_password_mailer = require('../mailer/recover_password_mailer');

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
module.exports.update = async function(req, res){
    if(req.user.id == req.params.id){
        /*user.findByIdAndUpdate(req.params.id, {  
            name: req.body.name,
            email: req.body.email
        }, function(err, user){
            console.log('updated user is ', user);
            return res.redirect('back');
        })*/
        try{
            console.log('req.params',req.params);
            let user1 = await user.findById(req.params.id);
            if(user1)
                console.log("user found!!");
            user.uploadedAvatar(req, res, function(err){//we cant read the req part without multer as it is multipart.
                if(err){console.log('multer err', err);}
                else
                {
                    console.log('req.file is ', req.file);
                    user1.name = req.body.name;
                    user1.email = req.body.email;
                    if(req.file)
                    {
                        if(user1.avatar)
                        {
                            fs.unlinkSync(path.join(__dirname, '..', user1.avatar))
                        }
                        user1.avatar = user.avatarPath + "/" + req.file.filename;
                    }
                    user1.save();
                    return res.redirect('back');
                }
            });
        }catch(err){     
            req.flash('error', err); 
            console.log("error catched", err);
            return res.redirect('back');
        }
    }
    else
    {
        req.flash("error", 'unauthorised!!');
        return res.status(401).send('unathorised');
    }
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
    console.log('we are here');
    req.flash('success', 'logged in successfully');
    return res.redirect('/');
};
module.exports.sign_out = function(req, res){
    req.logout();
    req.flash('success', 'logged out successfully');
        return res.redirect('/');
}

module.exports.forgot_pass = function(req, res){
    return res.render('recover_password',{
        title: 'codeial/recover'
    });
}

module.exports.recover_pass =  async function(req, res){
    let user1 = await user.findOne({email: req.body.email});
    if(user1)
    {
        let user_recover1 = await user_recovery.findOne({user: user1._id});
        console.log('finding user****', user_recover1);
        if(user_recover1)
        {
            console.log('user_recover found !!!!!');
            await user_recovery.updateOne(
                {user: user1._id},
                {
                        token: crypto.randomBytes(20).toString('hex'),
                        is_valid: true
                }
            );
            console.log('after updation*******', user_recover1);
            
        user_recover1 = await user_recovery.findOne({user: user1._id});
        console.log('finding user****', user_recover1);
        }
        else{
            user_recover1 = await user_recovery.create({
                token: crypto.randomBytes(20).toString('hex'),
                is_valid: true,
                user: user1._id
            });
            console.log('user recover1 created!!!!', user_recover1);
        }
        console.log('the final user recover is ', user_recover1);
        user_recover1 = await user_recover1.populate('user', 'name email').execPopulate();
        recover_password_mailer.recoverylink(user_recover1);
        return res.redirect('/');
    }
    else
        return res.render('back');

}


module.exports.new_pass = async function(req, res){
    user1 = await user_recovery.findOne({token: req.params.token});
    user1 = await user1.populate('user', 'email').execPopulate();
    var x = 0;
    if(user1 && (user1.is_valid == true))
    {
        x = 1;
        await user_recovery.updateOne(
            {token: req.params.token},
            {
                is_valid: false
            }
        );
    }
    res.render('reset_pass',{
        title: 'codeial/reset',
        x: x,
        user1: user1
    });
}
module.exports.change_pass = async function(req, res){
    console.log('req.body is ***********************************', req.body);
    user1 = await user.findOne({'email' : req.body.email});
    console.log('user is***************** ', user1);
    if(user1 && (req.body.password == req.body.confirm_password))
    {
        await user.updateOne(
            {email: req.body.email},
            {
                password: req.body.password
            }

        );
        let user2 = await user.findOne({email: req.body.email});
        console.log('updated user is *******************', user2);
    }
    return res.redirect('/');
}