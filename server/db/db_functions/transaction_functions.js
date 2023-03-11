const Transaction = require('../models/transaction');
require("dotenv").config({ path: "../../config.env" });
const connectDB = require('../conn');

// Connect to MongoDB
connectDB();

const request = {
    cmd: "SELL",
}


async function create_transaction(user, request) {
    try {
        const transaction = await Transaction({username: user, user_request: request});

        await transaction.save();

        console.log(transaction);
        return transaction;

    } catch (error) {
        // Handle the error
        console.error(error);
        throw new Error('Error creating transaction');
    }
}

create_transaction('Ellie', request);

module.exports = {
    create_transaction,
}