const mongoose = require('mongoose');
const crypto = require('crypto');

const transaction_schema = new mongoose.Schema( {
    user_id: {
        type: Number,
        ref: 'User',
        unique: false,
        required: true
    },
    username: {
        type: String,
        ref: 'User',
        unique: false,
        required: true
    },
    transaction_id: {
        type: Number,
        unique: false,
    },
    transaction_hash: {
        type: String,
        unique: false,
    },
    log_type: {
        type: String,
        unique: false,
        required: true
    },
    server: {
        type: String,
        unique: false,
        required: false
    },
    user_request: {
        type: Object,
        unqiue: false,
        required: false
    },
    server_response: {
        type: Object,
        unique: false,
        required: false
    },
    transaction_timestamp: {
        type: Date,
        unique: false,
        required: false,
        default: Date.now()
    },
    transaction_expires: {
        type: Date,
        unique: false,
        required: false,
        default: Date.now() + (60 * 1000) 
    },
    error_event: {
        type: String,
        unique: false,
        required: false,
    },
    debug_event: {
        type: String,
        unqiue: false,
        required: false
    }
});

transaction_schema.pre('save', async function(next) {
    let transaction = this;
    if (!transaction.transaction_id) {
        transaction.transaction_id = await generate_transaction_id();
    }

    if(!transaction.transaction_hash) {
        transaction.transaction_hash = await generate_transaction_hash(transaction.username, transaction.transaction_id, transaction.transaction_timestamp);
    }
    
    next();
});

async function generate_transaction_hash(username, transaction_id, transaction_timestamp) {
    let secret = (transaction_id + transaction_timestamp).toString();
    let hash = crypto.createHash('sha256').update(username + secret).digest('hex');
    let existing_transaction = await Transaction.findOne({ transaction_hash: hash });
    
    if (existing_transaction) {
        return generate_transaction_hash(username, transaction_id, transaction_timestamp);
    }
    return hash;
}

async function generate_transaction_id() {
    let transaction_count = await Transaction.estimatedDocumentCount();
    if (!transaction_count) {
        return 1;
    }
    return transaction_count + 1;
}

const Transaction = mongoose.model('Transaction', transaction_schema);

module.exports = Transaction;