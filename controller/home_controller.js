const post = require('../models/posts');
const User = require('../models/users');
module.exports.home = async function(req, res){
    try{
       let posts = await post.find({})
       .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate:{
                path: 'user'
            }
        });
        
        let users = await User.find({});
        
        return res.render('home',{
            title: "HOME",
            posts: posts,
            all_users: users
            });            
    }catch(err){
        console.log("error in home controller in home", err);
        return;
    }
    }
