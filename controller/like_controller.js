const Like = require('../models/like');
const Post = require('../models/posts');
const Comment = require('../models/comment');

module.exports.toggleLikes = async function(req, res){
    try{
        // likes/toggle/?id=abcde&type=postorcomment
        let likeable;
        let deleted = false;

        console.log('**********req.query is ', req.query);
        if(req.query.type == 'Post')
        {
            likeable = await Post.findById(req.query.id).populate('likes');
        }
        else
        {
            likeable = await Comment.findById(req.query.id).populate('likes');
        }
        console.log('**************likeable is', likeable);
        //check if a like already exists by the user if so delete it or otherwise create it
        let existingLike = await Like.findOne({
            likeable: req.query.id,
             onModel: req.query.type,
             user: req.user._id
        });

        if(existingLike)
        {
            likeable.likes.pull(existingLike._id);
            likeable.save;
            existingLike.remove();
            deleted = true;
        }
        else
        {
            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type
            });
            likeable.likes.push(newLike._id);//you can also just push .push(like). it will pull the id part on its own.
            likeable.save();
        }
        return res.status(200).json({
            message: 'successfully udated likes!!',
            data: {
                deleted: deleted
            }
        });

    }
    catch(err){
        if(err){console.log('error in toggleLikes in like_controller.js', err); return res.status(500).json(
            {
                message: 'Internal Server Error'
            }
        );}
    }
} 