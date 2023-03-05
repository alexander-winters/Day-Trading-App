const mongoose = require('mongoose');
// const AutoIncrement = require('mongoose-auto-increment');

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

const User = mongoose.model('User', user_schema);

module.exports = User;