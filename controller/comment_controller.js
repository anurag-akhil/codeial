const Comment = require('../models/comment');
const post = require('../models/posts')
module.exports.create = async function(req, res){
    let Post = await post.findById(req.body.post)
        if(Post){
            console.log('req.body is ',req.body);
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });
            console.log("new comment ", comment);
            Post.comments.push(comment);
            Post.save();
            res.redirect('/');
        }
}

module.exports.destroy = async function(req, res){
    let comment = await Comment.findById(req.params.id);
        if(comment.user == req.user.id)
        {
            let postId = comment.post;
            comment.remove;
            let post1 = await post.findByIdAndUpdate(postId,{ $pull: {comments: req.params.id}});
        }
        return res.redirect('back');
}