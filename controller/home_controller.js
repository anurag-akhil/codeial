const post = require('../models/posts');
const User = require('../models/users');
module.exports.home = async function(req, res){
    try{
       let posts = await post.find({})
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
            post: posts,
            all_users: users
            });            
    }catch(err){
        console.log("error in home controller in home", err);
    }
    }
