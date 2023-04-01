const Transaction = require('../models/transaction');

async function create_transaction(userid, user, logType, request = {}, response = {}, server) {
    try {
        const transaction = await Transaction({
            user_id: userid, 
            username: user, 
            log_type: logType, 
            user_request: request, 
            server_response: response,
            server: server,
            transaction_timestamp: Math.floor(new Date().getTime()),
            transaction_expires: Math.floor(new Date().getTime()) + (60 * 1000)
        });

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