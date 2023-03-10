require("dotenv").config({ path: "../server/config.env" });
const connectDB = require('../server/db/conn');
const User = require('../server/db/models/user');
const Transaction = require('../server/db/models/transaction');
const fs = require('fs');

connectDB();

module.exports = async (username) => {
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
            } else if (log === 'user_command') {
                // If the logtype is userCommand, create a userCommand sublog
                sublog = `<userCommand>\n` +
                  `<timestamp>${result.transaction_timestamp}</timestamp>\n` +
                  `<server>${result.server}</server>\n` +
                  `<transactionNum>${result.transaction_id}</transactionNum>\n` +
                  `<command>${result.user_request.type}</command>\n`;
            
                // Check if any optional fields are present and add them to the sublog
                if (result.user_request.userid != null) sublog += `<username>${result.username}</username>\n`;
                if (result.user_request.stock_symbol != null) sublog += `<stockSymbol>${result.user_request.stock_symbol}</stockSymbol>\n`;
                if (result.user_request.filename != null) sublog += `<filename>${result.user_request.filename}</filename>\n`;
                if (result.user_request.amount != null) sublog += `<funds>${result.user_request.amount}</funds>\n`;
            
                sublog += '</userCommand>\n';
            } else if (log === 'account_transaction') {
                sublog = `<accountTransaction>\n` +
                          `<timestamp>${result.transaction_timestamp}</timestamp>\n` +
                          `<server>${result.server}</server>\n` +
                          `<transactionNum>${result.transaction_id}</transactionNum>\n` +
                          `<action>${result.user_request.type}</action>\n` +
                          `<username>${result.username}</username>\n` +
                          `<funds>${result.user_request.amount}</funds>\n`
                
                if(result.user_request.stock_symbol != null) {
                    sublog += `<stockSymbol>${result.user_request.stock_symbol}</stockSymbol>\n`;
                }
                
                sublog += "</accountTransaction>\n";
            } else if (log === "system_event") {
                sublog = `<systemEvent>\n`+
                            `<timestamp>${result.transaction_timestamp}</timestamp>\n`+
                            `<server>${result.server}</server>\n`+
                            `<transactionNum>${result.transaction_id}</transactionNum>\n`+
                            `<command>${result.user_request.type}</command>\n`
                
                // Check if any optional fields are present and add them to the sublog
                if (result.user_request.userid != null) sublog += `<username>${result.username}</username>\n`;
                if (result.user_request.stock_symbol != null) sublog += `<stockSymbol>${result.user_request.stock_symbol}</stockSymbol>\n`;
                if (result.user_request.filename != null) sublog += `<filename>${result.user_request.filename}</filename>\n`;
                if (result.user_request.amount != null) sublog += `<funds>${result.user_request.amount}</funds>\n`;
      
                sublog += "</systemEvent>\n";
            } else if (log === "error_event") {
                sublog = `<errorEvent>\n`+
                            `<timestamp>${result.transaction_timestamp}</timestamp>\n`+
                            `<server>${result.server}</server>\n`+
                            `<transactionNum>${result.transaction_id}</transactionNum>\n`+
                            `<command>${result.user_request.type}</command>\n`
                
                // Check if any optional fields are present and add them to the sublog
                if (result.user_request.userid != null) sublog += `<username>${result.username}</username>\n`;
                if (result.user_request.stock_symbol != null) sublog += `<stockSymbol>${result.user_request.stock_symbol}</stockSymbol>\n`;
                if (result.user_request.filename != null) sublog += `<filename>${result.user_request.filename}</filename>\n`;
                if (result.user_request.amount != null) sublog += `<funds>${result.user_request.amount}</funds>\n`;
                if (result.error_message != null) sublog += `<errorMessage>${result.error_message}</errorMessage>\n`;
      
                sublog += "</errorEvent>\n";
            } else if (log === "debug_event") {
                sublog = `<debugEvent>\n`+
                            `<timestamp>${result.transaction_timestamp}</timestamp>\n`+
                            `<server>${result.server}</server>\n`+
                            `<transactionNum>${result.transaction_id}</transactionNum>\n`+
                            `<command>${result.user_request.type}</command>\n`
                
                // Check if any optional fields are present and add them to the sublog
                if (result.user_request.userid != null) sublog += `<username>${result.username}</username>\n`;
                if (result.user_request.stock_symbol != null) sublog += `<stockSymbol>${result.user_request.stock_symbol}</stockSymbol>\n`;
                if (result.user_request.filename != null) sublog += `<filename>${result.user_request.filename}</filename>\n`;
                if (result.user_request.amount != null) sublog += `<funds>${result.user_request.amount}</funds>\n`;
                if (result.error_message != null) sublog += `<debugMessage>${result.error_message}</debugMessage>\n`;
      
                sublog += "</debugEvent>\n";
            }
            fs.appendFileSync('dumplog.xml', sublog);
        });
        fs.appendFileSync('./dumplog.xml', "</log>");
        console.log("Dumplog Ready");

    } catch (err) {
        // If there is an error we should handle it with a fail safe function
        console.error(err);
    }
}