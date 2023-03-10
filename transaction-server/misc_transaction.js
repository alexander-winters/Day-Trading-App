require("dotenv").config({ path: "../server/config.env" });
const connectDB = require('../server/db/conn');
const User = require('../server/db/models/user');
const Transaction = require('../server/db/models/transaction');
const fs = require('fs');

connectDB();

module.exports = async (username, cb) => {
    // If username is null, select all transactions and order them by timestamp
    if (username == null) {
        const query = Transaction.find();
    }
    // Otherwise, select transactions with the given username and order them by timestamp
    else {
        const query = Transaction.find({ 'username': username});
    }

    
}