const quote_server = require("../quote-server/quote_server");
const User = require("../server/db/models/user");
require("dotenv").config({ path: "../server/config.env" });
const connectDB = require('../server/db/conn');

const TIME_TO_EXPIRE = 60;

// Connect to db
connectDB();

async function sell(user, stock_symbol, amount) {
    const quote = await quote_server.get_quote(stock_symbol, user);
    const sell_qty = amount/quote.Quoteprice;

    //Get user account
    const user_acc = await User.findOne({ username: user });

    //Get specific stock owned
    const user_stock = user_acc.stocks_owned.find( stock => stock.stock_symbol === stock_symbol );

    // Verify user has stocks owned 
    if ( !user_stock ) {
        return({error: "No stocks owned"});
    }

    // Verify user have enough stocks to sell
    if ( user_stock.quantity < sell_qty ) {
        return({error: "Insufficient stocks to sell"});
    }

    // Create a sell_pending
    user_acc.pending_sell.stock_symbol = stock_symbol;
    user_acc.pending_sell.amount = amount;
    user_acc.pending_sell.quantity = sell_qty;
    user_acc.pending_sell.expiration_time = Date.now() + (TIME_TO_EXPIRE * 1000);

    await user_acc.save();


    console.log("Sell transaction created");
    console.log(user_acc);
    return ({success: "Please confirm or cancel the sell transaction" });
}

async function commit_sell(user) {
    const user_acc = await User.findOne({ username: user });
    const pending_sell = user_acc.pending_sell;

    // Check if there is a transaction pending
    if (pending_sell && (Date.now() <= pending_sell.expiration_time)) {

        // Update user stock owned
        user_acc.stocks_owned.find( stock => stock.stock_symbol === pending_sell.stock_symbol ).quantity -= pending_sell.quantity;
        
        // Update user funds
        user_acc.funds += user_acc.pending_sell.amount;

        // Remove the pending sell
        await User.updateOne({ username: user }, {$unset: {'pending_sell':''}});

        await user_acc.save();

        // console.log("User after sell \n" +user_acc)
        console.log("Sell transaction was successful");
        console.log(await User.findOne({ username: user }));

        return({success: "Sell transaction was successful"});
    }    

    return({error: "No sell transaction initiated within 60 seconds"});
}

async function cancel_sell(user) {
    const user_acc = await User.findOne({ username: user });
    const pending_sell = user_acc.pending_sell;

    // Check if there is a transaction pending
    if (pending_sell && (Date.now() <= pending_sell.expiration_time)) {
        
        // Remove the pending sell
        await User.updateOne({ username: user }, {$unset: {'pending_sell':''}});

        await user_acc.save();

        console.log("Sell transaction canceled");
        console.log(await User.findOne({ username: user }));
        return({success: "Sell transaction canceled"});
    }
    
    return ({error: "No sell transaction initiated within 60 seconds"})
}

async function set_sell_amount(user, stock_symbol, amount) {
    let user_stock_value = 1000;
    
    if (user_stock_value >= amount) {
        set_sell_pending = true;
        return ({success: "Set sell trigger initialized"});
    }

    return({error: "Insufficient stocks to sell"})
}

async function set_sell_trigger(user, stock_symbol, amount) {
    if (set_sell_pending == true) {
        // TODO
        // Create a reserve account for the specified amount of the given stock
        // Reduce specified user owned stocks
        // Add trigger to user's sell triggers
        return ({success: `Sell transaction was set at ${amount}`});
    }

    return({error: "Please initialize a set sell trigger first"});
}

async function cancel_set_sell(user, stock_symbol, amount) {
    if (set_sell_pending == true) {
        // TODO
        // Remove associated sell trigger
        // Restore user account information values
        return ({success: "Set sell trigger was successfully canceled"});
    }

    return({error: "No set sell trigger initialized"});
}

module.exports = { sell,
    commit_sell,
    cancel_sell,
    set_sell_amount,
    cancel_set_sell,
    set_sell_trigger
};