const mongoose = require('mongoose');


const likeSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.ObjectId,
    },
    // defines the id of the liked object
    likeable: {
        type: mongoose.Schema.ObjectId,
        require: true,
        refPath: 'onModel'
    },
    //this fields defines the type of liked object by dynamic referencing
    onModel: {
        type: String,
        required: true,
        enum:['Post', 'Comment']
    }
}, {timestamps: true}
);


const Like = mongoose.model('Like', likeSchema);
module.exports = Like;