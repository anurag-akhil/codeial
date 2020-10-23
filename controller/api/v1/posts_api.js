const post = require('../../../models/posts');
const Comment = require('../../../models/comment');
module.exports.index = async function(req, res){
    /*return res.json(200, {
        message: "list of posts",
        posts: []
    });*/

    let posts = await post.find({})
       .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate:{
                path: 'user'
            }})


    return res.status(200).json({
        message: "list of posts",
        posts: posts
    });
}


module.exports.destroy = async function(req, res){
    try{
    let post1 = await post.findById(req.params.id);

    console.log('user is ', req.user);
    console.log()
    if(post1.user == req.user.id){
            post1.remove();
            await Comment.deleteMany({post: req.params.id});

            res.status(200).json({
                message:'post and associated comments deleted!!'
            }); 
    }else{
        console.log("we came here ");
        res.status(401).json({
            message: "you cannot delete this post!"
        });
    }
    }catch(err){
        //console.log('error in post api', err); 
        return res.status(500).json({
            message: 'internal server error'
        });
    }
};