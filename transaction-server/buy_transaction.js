// const fetch = require('node-fetch');
const { get_quote } = require("../quote-server/quote_server");
const User = require('../server/db/models/user');
require("dotenv").config({ path: "../server/config.env" });
const connectDB = require('../server/db/conn');
const { create_transaction } = require('../server/db/db_functions/transaction_functions');

// Connect to MongoDB
connectDB();

const expireAfterSeconds = 60;

// const url = 'http://localhost:5000/dashboard'

async function buy(user, stock_symbol, amount) {
    console.log("Trying to buy");
    console.log("Stock: " + stock_symbol + " for amount: " + amount);

    const quote = await get_quote(user, stock_symbol);
    let stock_quantity = amount / Number(quote.Quoteprice); // Calculates total quantity of stocks to buy

    const request = {
        type: 'BUY',
        user: user,
        stock_symbol: stock_symbol,
        amount: amount
    }

    console.log("Quoted buy price: " + stock_symbol + " - " + Number(quote.Quoteprice));

    const userObj = await User.findOne({ "username": user });

    console.log("Existing funds: User: " + userObj.username + " Funds: " + userObj.funds);

    // Check False pre-condition first to avoid if, else.
    // Check if the user does not have enough
    if (userObj.funds < amount) {
        // Create a transaction
        await create_transaction(user_acc.user_id, user, 'error_event', request);

        console.log("Insufficient funds");
        return ({ error: "Insufficient funds" });
    }

    console.log("Date: " + (Date.now() + (expireAfterSeconds * 1000)));

    // Add the buy to pending
    userObj.pending_buy.stock_symbol = stock_symbol;
    userObj.pending_buy.amount = amount;
    userObj.pending_buy.quantity = stock_quantity;
    userObj.pending_buy.expiration_time = Date.now() + (expireAfterSeconds * 1000); // expires after 60 seconds (60,000ms)

    await userObj.save();

    // Create a transaction
    await create_transaction(user_acc.user_id, user, 'user_command', request);

    console.log("User after buy command:\n" + userObj);

    return ({success: "Please confirm or cancel the transaction" });
}

async function commit_buy(user) {
    console.log("Trying to commit most recent buy");

    const userObj = await User.findOne({ "username": user });

    console.log("Is Buy Set (regardless of expiration) = " + (userObj.pending_buy.stock_symbol !== undefined));
    
    const request = {
        type: 'COMMIT_BUY',
        user: user,
        stock_symbol: userObj.pending_buy.stock_symbol,
        amount: userObj.pending_buy.amount
    }

    // Only commit a buy if it was performed in the last 60 seconds (i.e. 60,000ms)
    if (userObj.pending_buy.stock_symbol !== undefined && (Date.now() <= userObj.pending_buy.expiration_time)) {

        // Check if the user does not have enough
        if (userObj.funds < userObj.pending_buy.amount) {
            // Create a transaction
            await create_transaction(user_acc.user_id, user, 'error_event', request);

            console.log("Insufficient funds");
            return ({ error: "Insufficient funds" });
        }

        // Commit the buy
        // Remove funds and adds purchased quantity of stocks
        userObj.funds -= userObj.pending_buy.amount;

        //let new_quantity = userObj.pending_buy.quantity;
        // const curStock = userObj.stocks_owned.find({"stock_symbol": userObj.pending_buy.stock_symbol});
        const curStock = userObj.stocks_owned.find(function (x) {return x.stock_symbol === userObj.pending_buy.stock_symbol});

        console.log("curStock = " + curStock);

        if (curStock) {
            curStock.quantity += userObj.pending_buy.quantity; // add new quantity to existing stock
        } else {
            userObj.stocks_owned.push({stock_symbol: userObj.pending_buy.stock_symbol, quantity: userObj.pending_buy.quantity}); // create new stock
        }
        
        // Remove from pending_buy
        userObj.pending_buy.stock_symbol = undefined;
        userObj.pending_buy.amount = 0;
        userObj.pending_buy.quantity = 0;
        userObj.pending_buy.expiration_time = Date.now();

        await userObj.save();

        // Create a transaction
        await create_transaction(user_acc.user_id, user, 'user_command', request);

        console.log("User after commit_buy command:\n" + userObj);

        return ({ success: "Buy commited."});
    }
    else {
        // Create a transaction
        await create_transaction(user_acc.user_id, user, 'error_event', request);

        return ({ error: "Could not commit buy. No \'BUY\' command executed in the last 60 seconds."});
    }
}

async function cancel_buy(user) {
    console.log("Trying to cancel most recent buy");

    const userObj = await User.findOne({ "username": user });

    let successFlag = (userObj.pending_buy.stock_symbol === undefined || Date.now() > userObj.pending_buy.expiration_time);

    const request = {
        type: 'CANCEL_BUY',
        user: user,
        stock_symbol: userObj.pending_buy.stock_symbol,
        amount: userObj.pending_buy.amount
    }

    // Remove from pending_buy
    // NOTE: No need to check for stated pre-conditions mentioned in the spec
    // as there is no reason we would not want to remove an expired pending_buy.
    userObj.pending_buy.stock_symbol = undefined;
    userObj.pending_buy.amount = 0;
    userObj.pending_buy.quantity = 0;
    userObj.pending_buy.expiration_time = Date.now();

    await userObj.save();
    console.log("User after cancel_buy command:\n" + userObj);

    // Only cancel a buy if it was performed in the last 60 seconds (i.e. 60,000ms)
    if (successFlag) {
        // Create a transaction
        await create_transaction(user_acc.user_id, user, 'error_event', request);

        return ({ error: "Nothing to cancel. No BUY command was executed in the last 60 seconds. Removing residual data."});
    }
    else {
        // Create a transaction
        await create_transaction(user_acc.user_id, user, 'user_command', request);

        return ({ success: "Buy canceled."});
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