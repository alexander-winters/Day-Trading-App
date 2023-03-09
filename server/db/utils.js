const crypto = require('crypto');
const User = require('./models/user');
const Transaction = require('./models/transaction');

async function generate_user_id() {
    let highest_user = await User.estimatedDocumentCount();
    if (!highest_user) {
        return 1;
    }
    return highest_user + 1;
}

async function generate_transaction_hash(username, transaction_id, transaction_timestamp) {
    let secret = (transaction_id + transaction_timestamp).toString();
    let hash = crypto.createHash('sha256').update(username + secret).digest('hex');
    let existing_transaction = await Transaction.findOne({ transaction_hash });
    
    if (existing_transaction) {
        return generate_transaction_hash(username, transaction_id, transaction_timestamp);
    }
    return hash;
}

module.exports = { generate_user_id, generate_transaction_hash };