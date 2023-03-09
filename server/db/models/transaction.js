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
    user_request: {
        type: Object,
        unqiue: false,
        required: true
    },
    server_response: {
        type: Object,
        unique: false,
        required: true
    },
    transaction_timestamp: {
        type: Date,
        unique: false,
        required: true,
        default: Date.now()
    },
    transaction_expires: {
        type: Date,
        unique: false,
        required: true,
        default: Date.now() + (60 * 1000) 
    },
});

const Transaction = mongoose.model('Transaction', transaction_schema);
module.exports = Transaction;