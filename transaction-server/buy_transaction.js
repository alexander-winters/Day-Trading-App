// const fetch = require('node-fetch');
const { get_quote } = require("../quote-server/quote_server");
const User = require('../server/db/models/user');
const Buy = require('../server/db/models/buy');
require("dotenv").config({ path: "../server/config.env" });
const connectDB = require('../server/db/conn');
const { create_transaction } = require('../server/db/db_functions/transaction_functions');
const { create_buy_trigger } = require('../server/db/db_functions/buy_trigger_functions');
const BuyTrigger = require("../server/db/models/buy_trigger");

// Connect to MongoDB
connectDB();

const expireAfterSeconds = 60;

// const url = 'http://localhost:5000/dashboard'

async function buy(user, stock_symbol, amount) {
    console.log("Trying to buy");
    console.log("Stock: " + stock_symbol + " for amount: " + amount);

    const quote = await get_quote(user, stock_symbol);
    let stock_quantity = amount / Number(quote.quote_price); // Calculates total quantity of stocks to buy

    const request = {
        type: 'BUY',
        user: user,
        stock_symbol: stock_symbol,
        amount: amount
    }

    console.log("Quoted buy price: " + stock_symbol + " - " + Number(quote.quote_price));

    const user_acc = await User.findOne({ "username": user });

    console.log("Existing funds: User: " + user_acc.username + " Funds: " + user_acc.funds);

    // Check False pre-condition first to avoid if, else.
    // Check if the user does not have enough
    if (user_acc.funds < amount) {
        // Create a transaction
        await create_transaction(user_acc.user_id, user, 'error_event', request, {}, 'transaction_server');

        console.log("Insufficient funds");
        return ({ error: "Insufficient funds" });
    }

    const now = Math.floor(new Date().getTime());
    console.log("Date: " + (now + (expireAfterSeconds * 1000)));

    // Add the buy to pending
    user_acc.pending_buy.stock_symbol = stock_symbol;
    user_acc.pending_buy.amount = amount;
    user_acc.pending_buy.quantity = stock_quantity;
    user_acc.pending_buy.expiration_time = now + (expireAfterSeconds * 1000); // expires after 60 seconds (60,000ms)

    await user_acc.save();

    // Create a transaction
    await create_transaction(user_acc.user_id, user, 'user_command', request, {}, 'transaction_server');

    console.log("User after buy command:\n" + user_acc);

    return ({success: "Please confirm or cancel the transaction" });
}

async function commit_buy(user) {
    console.log("Trying to commit most recent buy");

    const user_acc = await User.findOne({ "username": user });

    console.log("Is Buy Set (regardless of expiration) = " + (user_acc.pending_buy.stock_symbol !== undefined));
    
    const request = {
        type: 'COMMIT_BUY',
        user: user,
        stock_symbol: user_acc.pending_buy.stock_symbol,
        amount: user_acc.pending_buy.amount
    }

    const now = Math.floor(new Date().getTime());

    // Only commit a buy if it was performed in the last 60 seconds (i.e. 60,000ms)
    if (user_acc.pending_buy.stock_symbol !== undefined && (now <= user_acc.pending_buy.expiration_time)) {

        // Check if the user does not have enough
        if (user_acc.funds < user_acc.pending_buy.amount) {
            // Create a transaction
            await create_transaction(user_acc.user_id, user, 'error_event', request, {}, 'transaction_server');

            console.log("Insufficient funds");
            return ({ error: "Insufficient funds" });
        }

        // Commit the buy
        // Remove funds and adds purchased quantity of stocks
        user_acc.funds -= user_acc.pending_buy.amount;

        //let new_quantity = user_acc.pending_buy.quantity;
        // const curStock = user_acc.stocks_owned.find({"stock_symbol": user_acc.pending_buy.stock_symbol});
        const curStock = user_acc.stocks_owned.find(function (x) {return x.stock_symbol === user_acc.pending_buy.stock_symbol});

        console.log("curStock = " + curStock);

        if (curStock) {
            curStock.quantity += user_acc.pending_buy.quantity; // add new quantity to existing stock
        } else {
            user_acc.stocks_owned.push({stock_symbol: user_acc.pending_buy.stock_symbol, quantity: user_acc.pending_buy.quantity}); // create new stock
        }
        
        // Remove from pending_buy
        user_acc.pending_buy.stock_symbol = undefined;
        user_acc.pending_buy.amount = 0;
        user_acc.pending_buy.quantity = 0;
        user_acc.pending_buy.expiration_time = now;

        await user_acc.save();

        // Create a transaction
        await create_transaction(user_acc.user_id, user, 'user_command', request, {}, 'transaction_server');

        console.log("User after commit_buy command:\n" + user_acc);

        return ({ success: "Buy commited."});
    }
    else {
        // Create a transaction
        await create_transaction(user_acc.user_id, user, 'error_event', request, {}, 'transaction_server');

        return ({ error: "Could not commit buy. No \'BUY\' command executed in the last 60 seconds."});
    }
}

async function cancel_buy(user) {
    console.log("Trying to cancel most recent buy");

    const user_acc = await User.findOne({ "username": user });

    const now = Math.floor(new Date().getTime());

    let successFlag = (user_acc.pending_buy.stock_symbol === undefined || now > user_acc.pending_buy.expiration_time);

    const request = {
        type: 'CANCEL_BUY',
        user: user,
        stock_symbol: user_acc.pending_buy.stock_symbol,
        amount: user_acc.pending_buy.amount
    }

    // Remove from pending_buy
    // NOTE: No need to check for stated pre-conditions mentioned in the spec
    // as there is no reason we would not want to remove an expired pending_buy.
    user_acc.pending_buy.stock_symbol = undefined;
    user_acc.pending_buy.amount = 0;
    user_acc.pending_buy.quantity = 0;
    user_acc.pending_buy.expiration_time = now;

    await user_acc.save();
    console.log("User after cancel_buy command:\n" + user_acc);

    // Only cancel a buy if it was performed in the last 60 seconds (i.e. 60,000ms)
    if (successFlag) {
        // Create a transaction
        await create_transaction(user_acc.user_id, user, 'error_event', request, {}, 'transaction_server');

        return ({ error: "Nothing to cancel. No BUY command was executed in the last 60 seconds. Removing residual data."});
    }
    else {
        // Create a transaction
        await create_transaction(user_acc.user_id, user, 'user_command', request, {}, 'transaction_server');

        return ({ success: "Buy canceled."});
    }
}

async function set_buy_amount(user, stock_symbol, amount) {
    console.log("Trying to set automatic buy amount");

    const request = {
        type: 'SET_BUY_AMOUNT',
        user: user,
        stock_symbol: stock_symbol,
        amount: amount
    }

    //Get user account
    const user_acc = await User.findOne({ "username": user });

    // Verify user has enough funds to buy
    if (user_acc.funds < amount) {
        // Create a transaction
        await create_transaction(user_acc.user_id, user, 'error_event', request, {}, 'transaction_server');

        console.log("Insufficient funds");
        return ({ error: "Insufficient funds" });
    }

    //Get user buy transactions
    const buy_acc = await Buy.findOne({ username: user });

    // Setup a buy point
    buy_acc.pending_set_buy.stock_symbol = stock_symbol;
    buy_acc.pending_set_buy.amount = amount;
    // NOTE: The quantity is set in set_buy_trigger command.

    user_acc.funds -= amount; // Funds need to be added back in the cancel_set_buy command if applicable

    await buy_acc.save();
    await user_acc.save();

    // Create a transaction
    await create_transaction(user_acc.user_id, user, 'user_command', request, {}, 'transaction_server');

    console.log("Set buy trigger initialized");
    console.log("User after set_buy_amount command:\n" + user_acc + "\n" + buy_acc);
    return ({ success: "Set buy trigger initialized"});
}

async function set_buy_trigger(user, stock_symbol, amount) {
    console.log("Trying to set automatic buy trigger");

    const request = {
        type: 'SET_BUY_TRIGGER',
        user: user,
        stock_symbol: stock_symbol,
        amount: amount
    }

    //Get user account
    const user_acc = await User.findOne({ "username": user });

    //Get user buy transactions
    const buy_acc = await Buy.findOne({ username: user });

    // Make sure there is a pending_set_buy set with the matching stock symbol
    if (buy_acc.pending_set_buy.stock_symbol !== stock_symbol) {
        // Create a transaction
        await create_transaction(user_acc.user_id, user, 'error_event', request, {}, 'transaction_server');

        console.log(`There is no SET_BUY currently set for stock ${stock_symbol}`);
        return ({error: `There is no SET_BUY currently set for stock ${stock_symbol}`});
    }

    // Add a new trigger or replace the existing one for the same stock

    let quantity = buy_acc.pending_set_buy.amount / amount // purchase amount / price per share

    const existing_set_buy = buy_acc.buy_triggers.find(function (x) {return x.stock_symbol === stock_symbol});

    console.log("existing_set_buy = " + existing_set_buy);

    if (existing_set_buy) {
        existing_set_buy.stock_symbol = buy_acc.pending_set_buy.stock_symbol;
        existing_set_buy.amount = buy_acc.pending_set_buy.amount;
        existing_set_buy.quantity = quantity;
        existing_set_buy.buy_price = amount;
    } else {
        buy_acc.buy_triggers.push({
            stock_symbol: buy_acc.pending_set_buy.stock_symbol,
            amount: buy_acc.pending_set_buy.amount,
            quantity: quantity,
            buy_price: amount
        }); 
    }

    // Remove from pending_set_buy
    buy_acc.pending_set_buy.stock_symbol = undefined;
    buy_acc.pending_set_buy.amount = undefined;
    buy_acc.pending_set_buy.quantity = undefined;

    // Add to list of users who have buy triggers we need to process if not already there
    const existing_buy_trigger = await BuyTrigger.findOne({username: buy_acc.username})
    if (!existing_buy_trigger) {
        await create_buy_trigger(buy_acc.username);
        console.log('Created buy trigger watcher for user: ' + buy_acc.username);
    }

    await buy_acc.save();
    await user_acc.save();

    // Create a transaction
    await create_transaction(user_acc.user_id, user, 'user_command', request, {}, 'transaction_server');

    console.log(`Buy transaction was set at buy price: ${amount}`);
    //console.log(await Buy.findOne({ "username": user })); // Display buy account
    console.log("User after set_buy_trigger command:\n" + user_acc + "\n" + buy_acc);
    return ({success: `Buy transaction was set at ${amount}`});
}

async function cancel_set_buy(user, stock_symbol) {
    console.log("Trying to cancel automatic buy");

    const request = {
        type: 'CANCEL_SET_BUY',
        user: user,
        stock_symbol: stock_symbol,
        amount: 0
    }

    //Get user account
    const user_acc = await User.findOne({ "username": user });

    //Get user buy transactions
    const buy_acc = await Buy.findOne({ "username": user });

    // Remove any active pending_set_buy
    if (buy_acc.pending_set_buy.stock_symbol === stock_symbol) {
        if (buy_acc.pending_set_buy.amount !== undefined) {
            // if there is a valid pending_set_buy add back amount before deleting
            user_acc.funds += buy_acc.pending_set_buy.amount;
        }

        buy_acc.pending_set_buy.stock_symbol = undefined;
        buy_acc.pending_set_buy.amount = undefined;
        buy_acc.pending_set_buy.quantity = undefined;
    }

    //Find corresponding buy trigger
    const trigger = buy_acc.buy_triggers.find(trig => (trig.stock_symbol === stock_symbol));

    // If trigger doesn't exists, do nothing
    if (!trigger) {
        // Create a transaction
        await create_transaction(user_acc.user_id, user, 'error_event', request, {}, 'transaction_server');

        console.error(`There is no buy trigger for ${stock_symbol}`);
        return({error: `There is no buy trigger for ${stock_symbol}`});
    }

    // If trigger exists, remove trigger

    // Restore amount spent
    user_acc.funds += trigger.amount;

    // Remove the buy trigger
    await Buy.updateOne({ username: user }, {$pull: {'buy_triggers': {stock_symbol: `${stock_symbol}`}}});

    await buy_acc.save();
    await user_acc.save();

    // Delete buy trigger watcher for that user if no buy triggers remaining in user account
    const existing_buy_trigger = await BuyTrigger.findOne({username: buy_acc.username})
    if (existing_buy_trigger && (buy_acc.buy_triggers === undefined || buy_acc.buy_triggers.length() <= 0)) {
        await BuyTrigger.deleteMany({username: buy_acc.username});
        console.log('Deleted buy trigger watcher for user: ' + buy_acc.username);
    }

    // Create a transaction
    await create_transaction(user_acc.user_id, user, 'user_command', request, {}, 'transaction_server');

    console.log(`Buy trigger for ${stock_symbol} was succesfully canceled`);
    console.log("User after cancel_set_buy command:\n" + user_acc + "\n" + buy_acc);
    return ({ success: `Buy trigger for ${stock_symbol} was succesfully canceled`});
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