const Transaction = require('../models/transaction');
require("dotenv").config({ path: "../../config.env" });
const connectDB = require('../conn');

// Connect to MongoDB
connectDB();

async function create_transaction(userid, user, logType, request = {}) {
    try {
        const transaction = await Transaction({user_id: userid, username: user, log_type: logType, user_request: request});

        await transaction.save();

        // console.log(transaction);
        return transaction;

    } catch (error) {
        // Handle the error
        console.error(error);
        throw new Error('Error creating transaction');
    }
}

module.exports = {
    create_transaction,
}