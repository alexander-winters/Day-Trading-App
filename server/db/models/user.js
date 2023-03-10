const mongoose = require('mongoose');
//const { generate_user_id } = require('../utils');

const user_schema = new mongoose.Schema({
    user_id: {
        type: Number,
        unique: true,
        required: false,
    },
    username: {
       type: String,
       unique: true,
       required: true 
    },
    member_since: {
        type: Date,
        required: false,
        default: Date.now
    },
    funds: {
        type: Number,
        required: false,
        default: 0
    },
});

// Use a pre hook to generate a new user_id before a new user to the database
user_schema.pre('save', async function(next) {
    let user = this;
    if (!user.user_id) {
        user.user_id = await generate_user_id();
    }
    next();
});

async function generate_user_id() {
    let highest_user = await User.estimatedDocumentCount();
    if (!highest_user) {
        return 1;
    }
    return highest_user + 1;
}

const User = mongoose.model('User', user_schema);

module.exports = User;