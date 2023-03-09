const mongoose = require('mongoose');
const { generate_user_id } = require('../utils');

const user_schema = new mongoose.Schema({
    user_id: {
        type: Number,
        unique: true,
        required: true
    },
    username: {
       type: String,
       unique: true,
       required: true 
    },
    member_since: {
        type: Date,
        required: true,
        default: Date.now
    },
    funds: {
        type: Number,
        required: true,
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

const User = mongoose.model('User', user_schema);

module.exports = User;