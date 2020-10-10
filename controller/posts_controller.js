const Post = require('../models/posts');
const Comment = require('../models/comment')
module.exports.create = async function(req, res){
    let post = await Post.create({
        content: req.body.content,
        user: req.user._id
    });
    return res.redirect('back');
}
module.exports.destroy = async function(req, res){
    let post = await Post.findById(req.params.id);
    
        if(post.user == req.user.id)// to comapre two ids both of them should be strings but typeof(req.user._id) is id not string 
        {                           // mongoose provide the conversion of id to string by writing req.user.id
            post.remove();
            Comment.deleteMany({post: req.params.id})
        }
        return res.redirect('back');
}                        