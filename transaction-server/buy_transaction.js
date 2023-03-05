// const fetch = require('node-fetch');
const { get_quote } = require("../quote-server/quote_server");

// const url = 'http://localhost:5000/dashboard'
let user_currrent_balance = 100000;

async function buy(user, stock_symbol, amount) {
    console.log("Trying to buy");
    const quote = await get_quote(user, stock_symbol);
    let buy_total = quote * amount; // Calculates total price user is trying to purchase
    // Check False pre-condition first to avoid if, else.
    // Check if the user does not have enough
    if (user_currrent_balance < buy_total) {
        return ({ error: "Insufficient funds" });
    }
    // Assume the user has enough
    return ({success: "Please confirm or cancel the transaction" });
}

async function commit_buy(user) {
    console.log("Trying to commit most recent buy");

    // TODO: REPLACE BELOW: Fetch most recent buy command from the user's db
    let pending_buy = true;
    let buy_time = Date.now();
    let buy_amount = 2000;
    let buy_price = 100;

    // Only commit a buy if it was performed in the last 60 seconds (i.e. 60,000ms)
    if (pending_buy && (Date.now() - buy_time <= (60 * 1000))) {
        let new_balance = user_currrent_balance - buy_amount;
        if (new_balance >= 0) {
            user_currrent_balance = new_balance;

            // TODO - REPLACE: Add purchased amount of stock to the db for that user
            let user_stock_db_Key = 0;
            user_stock_db_Key += (buy_amount / buy_price); // Add purchased quantity to users owned stocks

            return ({ success: "Buy commited."});
        }
        else {
            return ({ error: "Insufficient funds" });
        }
    }
    else {
        return ({ error: "Could not commit buy. No \'BUY\' command executed in the last 60 seconds."});
    }
}

async function cancel_buy(user) {
    console.log("Trying to cancel most recent buy");

    // TODO: REPLACE BELOW: Fetch most recent buy command from the user's db
    let pending_buy = true;
    let buy_time = Date.now();
    let transaction_id = "abc123";

    // Only cancel a buy if it was performed in the last 60 seconds (i.e. 60,000ms)
    if (pending_buy && (Date.now() - buy_time <= (60 * 1000))) {

        // TODO: REPLACE: Remove pending buy transaction from the db for that user given a "transaction_id"

        return ({ success: "Buy canceled."});
    }
    else {
        return ({ error: "Could not cancel buy. No \'BUY\' command executed in the last 60 seconds."});
    }
}

async function set_buy_amount(user, stock_symbol, amount) {
    // TODO: Complete
    console.log("Trying to set automatic buy amount");




    console.log("Not yet implemented. Command could not be executed.");
}

async function set_buy_trigger(user, stock_symbol, amount) {
    // TODO: Complete
    console.log("Trying to set automatic buy trigger");
    console.log("Not yet implemented. Command could not be executed.");
}

async function cancel_set_buy(user, stock_symbol, amount) {
    // TODO: Complete
    console.log("Trying to cancel automatic buy");
    console.log("Not yet implemented. Command could not be executed.");
}

module.exports = { buy,
    commit_buy, 
    cancel_buy, 
    set_buy_amount, 
    cancel_set_buy,
    set_buy_trigger
};

// TODO: Remove these tests
//console.log(commit_buy("John"));