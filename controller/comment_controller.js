const Comment = require('../models/comment');
const Post = require('../models/posts');
const Like = require('../models/like');
const commentsMailer = require('../mailer/comments_mailer');
const queue = require('../config/kue');  
const commentEmailWorker = require('../workers/comment_email_worker');


module.exports.create = async function(req, res){
    try{
        let post = await Post.findById(req.body.post)
        if(post){
            console.log('req.body is ',req.body);
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });
            console.log("new comment ", comment);
            post.comments.push(comment);
            post.save();

            
            comment = await comment.populate('user', 'name email').execPopulate();
            //commentsMailer.newComment(comment);
            let job = queue.create('emails', comment).save(function(err){
                console.log('inside queue.create');
                if(err){console.log('error in comment_controller.js', err);}
                console.log(job.id);
            });

            if (req.xhr){
                // Similar for comments to fetch the user's id!
    
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Post created!"
                });
            }

            req.flash('success', 'Comment published!');

            res.redirect('/');
        }
    }catch(err)
    {
        req.flash('error', err);
        return;
    }
}       

module.exports.destroy = async function(req, res){
    try{
        let comment = await Comment.findById(req.params.id);
        if(comment.user == req.user.id)
        {
            let postId = comment.post;
            comment.remove;
            let post1 = Post.findByIdAndUpdate(postId,{ $pull: {comments: req.params.id}});

            await Like.deleteMany({likeable: comment._id, onModel:'Comment'});

            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }

            req.flash('success', 'Comment deleted!');
            return res.redirect('back');
        }
        else
        {
            req.flash('error', 'Unauthorized');
            return res.redirect('back');
        }
    }catch(err)
    {
        req.flash('error', err);
        return;
    }
}