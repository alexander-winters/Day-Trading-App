require("dotenv").config({ path: "../server/config.env" });
const connectDB = require('../server/db/conn');
const User = require('../server/db/models/user');
const Transaction = require('../server/db/models/transaction');
const fs = require('fs');

connectDB();

module.exports = async (username, cb) => {
    // Create instance of 'Query' for building queries
    const query = Transaction.find();
    query.collection(Transaction.transactions) // Use the transactions collection

    // If username is null, select all transactions and order them by oldest timestamp
    if (username == null) {
        query.sort({transaction_timestamp: 1});
    }
    // Otherwise, select transactions with the given username and order them by timestamp
    else {
        query.
        where('username').equals(username).
        sort({ transaction_timestamp: 1});
    }
    // Run the query
    try {
        const results = await query.exec();
        // Write the dumplog file
        fs.writeFileSync('./dumplog.xml', "<?xml version='1.0'?>\n<log>\n");
        // Iterate through each row of our query results
        results.forEach(result => {
            let log = result.log_type;
            let sublog = "";

            if (log === "quote_server") {
                sublog = `<quoteServer>\n` +
                `<timestamp>${result.transaction_timestamp}</timestamp>\n` +
                `<server>${result.server}</server>\n` +
                `<transactionNum>${result.transaction_id}</transactionNum>\n` +
                `<price>${result.server_response.quote_price}</price>\n` +
                `<stockSymbol>${result.server_response.stock_symbol}</stockSymbol>\n` +
                `<username>${result.server_response.username}</username>\n` +
                `<quoteServerTime>${result.server_response.timestamp}</quoteServerTime>\n` +
                `<cryptokey>${result.server_response.cryptokey}</cryptokey>\n` +
                `</quoteServer>\n`;
            }
        })

    } catch (err) {
        // If there is an error we should handle it with a fail safe function
        console.error(err);
    }
}