const mongoose = require('mongoose');

const transaction_schema = new mongoose.Schema( {
    user_id: {
        type: Number,
        ref: 'User',
        unique: true,
        required: true
    },
    username: {
        type: String,
        ref: 'User',
        unique: true,
        required: true
    },
    transaction_hash: {
        type: String,
        unique: true,
        required: true
    },
    transaction_id: {
        type: Number,
        unique: false,
        required: true,
    },
    command: {
        type: String,
        required: true
    },
    
});