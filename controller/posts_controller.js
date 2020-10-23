const Post = require('../models/posts');
const Comment = require('../models/comment')
module.exports.create = async function(req, res){
    try{
    let post1 = await Post.create({
        content: req.body.content,
        user: req.user._id
    });
    if(req.xhr)
    {
        return res.status(200).json({
            data: {
                post: post1,
            },
            message: 'Post Created!'
        });
    }

    req.flash('success', 'post published');
    return res.redirect('back');

    }catch(err){
            req.flash('error', err);
            return res.redirect('back');
    }
}
module.exports.destroy = async function(req, res){
    try{
    let post = await Post.findById(req.params.id);
    
        if(post.user == req.user.id)// to comapre two ids both of them should be strings but typeof(req.user._id) is id not string 
        {                           // mongoose provide the conversion of id to string by writing req.user.id
            post.remove();
            await Comment.deleteMany({post: req.params.id});

            if(req.xhr)
            {
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post removed"
                });
            }
            req.flash('success', 'post removed');
            return res.redirect('back'); 
        }
        else
        {
            req.flash('error', 'You cannot delete this post!');
            return res.redirect('back');
        }

    }catch(err){
        req.flash('error', err); 
        return res.redirect('back');
    }
};                 