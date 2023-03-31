require("dotenv").config({ path: "../server/config.env" });
const User = require('../server/db/models/user');
const Transaction = require('../server/db/models/transaction');
const fs = require('fs');

async function dumplog(username) {
    // Create instance of 'Query' for building queries
    const query = Transaction.find();
    // query.collection(Transaction.user_request) // Use the transactions collection

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
                sublog = `\t<quoteServer>\n` +
                `\t\t<timestamp>${result.transaction_timestamp}</timestamp>\n` +
                `\t\t<server>${result.server}</server>\n` +
                `\t\t<transactionNum>${result.transaction_id}</transactionNum>\n` +
                `\t\t<price>${result.server_response.quote_price}</price>\n` +
                `\t\t<stockSymbol>${result.server_response.stock_symbol}</stockSymbol>\n` +
                `\t\t<username>${result.server_response.username}</username>\n` +
                `\t\t<quoteServerTime>${result.server_response.timestamp}</quoteServerTime>\n` +
                `\t\t<cryptokey>${result.server_response.cryptokey}</cryptokey>\n` +
                `\t</quoteServer>\n`;

            } else if (log === 'user_command') {
                // If the logtype is userCommand, create a userCommand sublog
                sublog = `\t<userCommand>\n` +
                  `\t\t<timestamp>${result.transaction_timestamp}</timestamp>\n` +
                  `\t\t<server>${result.server}</server>\n` +
                  `\t\t<transactionNum>${result.transaction_id}</transactionNum>\n` +
                  `\t\t<command>${result.user_request.type}</command>\n`;
            
                // Check if any optional fields are present and add them to the sublog
                if (result.user_request.user != null) sublog = sublog.concat(`\t\t<username>${result.username}</username>\n`);
                if (result.user_request.stock_symbol != null) sublog = sublog.concat(`\t\t<stockSymbol>${result.user_request.stock_symbol}</stockSymbol>\n`);
                if (result.user_request.filename != null) sublog = sublog.concat(`\t\t<filename>${result.user_request.filename}</filename>\n`);
                if (result.user_request.amount != null) sublog  = sublog.concat(`\t\t<funds>${result.user_request.amount}</funds>\n`);
            
                sublog = sublog.concat('\t</userCommand>\n');

            } else if (log === 'account_transaction') {
                sublog = `\t<accountTransaction>\n` +
                          `\t\t<timestamp>${result.transaction_timestamp}</timestamp>\n` +
                          `\t\t<server>${result.server}</server>\n` +
                          `\t\t<transactionNum>${result.transaction_id}</transactionNum>\n` +
                          `\t\t<action>${result.user_request.type}</action>\n` +
                          `\t\t<username>${result.username}</username>\n` +
                          `\t\t<funds>${result.user_request.amount}</funds>\n`
                
                if (result.user_request.stock_symbol != null) {
                    sublog  = sublog.concat(`\t\t<stockSymbol>${result.user_request.stock_symbol}</stockSymbol>\n`);
                }
                
                sublog  = sublog.concat("\t</accountTransaction>\n");

            } else if (log === "system_event") {
                sublog = `\t<systemEvent>\n`+
                            `\t\t<timestamp>${result.transaction_timestamp}</timestamp>\n`+
                            `\t\t<server>${result.server}</server>\n`+
                            `\t\t<transactionNum>${result.transaction_id}</transactionNum>\n`+
                            `\t\t<command>${result.user_request.type}</command>\n`
                
                // Check if any optional fields are present and add them to the sublog
                if (result.user_request.user != null) sublog = sublog.concat(`\t\t<username>${result.username}</username>\n`);
                if (result.user_request.stock_symbol != null) sublog  = sublog.concat(`\t\t<stockSymbol>${result.user_request.stock_symbol}</stockSymbol>\n`);
                if (result.user_request.filename != null) sublog = sublog.concat(`\t\t<filename>${result.user_request.filename}</filename>\n`);
                if (result.user_request.amount != null) sublog = sublog.concat(`\t\t<funds>${result.user_request.amount}</funds>\n`);
      
                sublog  = sublog.concat("\t</systemEvent>\n");

            } else if (log === "error_event") {
                sublog = `\t<errorEvent>\n`+
                            `\t\t<timestamp>${result.transaction_timestamp}</timestamp>\n`+
                            `\t\t<server>${result.server}</server>\n`+
                            `\t\t<transactionNum>${result.transaction_id}</transactionNum>\n`+
                            `\t\t<command>${result.user_request.type}</command>\n`
                
                // Check if any optional fields are present and add them to the sublog
                if (result.user_request.user != null) sublog = sublog.concat(`\t\t<username>${result.username}</username>\n`);
                if (result.user_request.stock_symbol != null) sublog  = sublog.concat(`\t\t<stockSymbol>${result.user_request.stock_symbol}</stockSymbol>\n`);
                if (result.user_request.filename != null) sublog = sublog.concat(`\t\t<filename>${result.user_request.filename}</filename>\n`);
                if (result.user_request.amount != null) sublog = sublog.concat(`\t\t<funds>${result.user_request.amount}</funds>\n`);
                if (result.error_message != null) sublog = sublog.concat(`\t\t<errorMessage>${result.error_message}</errorMessage>\n`);
      
                sublog = sublog.concat("\t</errorEvent>\n");

            } else if (log === "debug_event") {
                sublog = `\t<debugEvent>\n`+
                            `\t\t<timestamp>${result.transaction_timestamp}</timestamp>\n`+
                            `\t\t<server>${result.server}</server>\n`+
                            `\t\t<transactionNum>${result.transaction_id}</transactionNum>\n`+
                            `\t\t<command>${result.user_request.type}</command>\n`
                
                // Check if any optional fields are present and add them to the sublog
                if (result.user_request.user != null) sublog = sublog.concat(`\t\t<username>${result.username}</username>\n`);
                if (result.user_request.stock_symbol != null) sublog  = sublog.concat(`\t\t<stockSymbol>${result.user_request.stock_symbol}</stockSymbol>\n`);
                if (result.user_request.filename != null) sublog = sublog.concat(`\t\t<filename>${result.user_request.filename}</filename>\n`);
                if (result.user_request.amount != null) sublog = sublog.concat(`\t\t<funds>${result.user_request.amount}</funds>\n`);
                if (result.error_message != null) sublog = sublog.concat(`\t\t<errorMessage>${result.error_message}</errorMessage>\n`);
      
                sublog = sublog.concat("\t</debugEvent>\n");
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

module.exports = {
    dumplog
};