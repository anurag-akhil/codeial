const mongoose = require('mongoose');

user_recovery_schema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    is_valid: {
        type: Boolean,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}, {
    timestamps: true
});

userRecovery = mongoose.model('user_recovery', user_recovery_schema);
module.exports = userRecovery;