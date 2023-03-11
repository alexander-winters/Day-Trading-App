const quote_server = require("../quote-server/quote_server");
const User = require("../server/db/models/user");
const Sell = require('../server/db/models/sell');
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

    //Get user sell transactions
    const sell_acc = await Sell.findOne({ username: user });

    //Get specific stock owned
    const user_stock = user_acc.stocks_owned.find( stock => stock.stock_symbol === stock_symbol );

    // Verify user has stocks owned 
    if ( !user_stock ) {
        console.error("No stocks owned")
        return({error: "No stocks owned"});
    }

    // Verify user have enough stocks to sell
    if ( user_stock.quantity < sell_qty ) {
        console.error("Insufficient stocks to sell");
        return({error: "Insufficient stocks to sell"});
    }

    // Create a sell_pending
    sell_acc.pending_sell.stock_symbol = stock_symbol;
    sell_acc.pending_sell.amount = amount;
    sell_acc.pending_sell.quantity = sell_qty;
    sell_acc.pending_sell.expiration_time = Date.now() + (TIME_TO_EXPIRE * 1000);

    await sell_acc.save();


    console.log("Sell transaction created");
    // console.log(sell_acc); // Display sell account
    return ({success: "Please confirm or cancel the sell transaction" });
}

async function commit_sell(user) {
    const user_acc = await User.findOne({ username: user });

    //Get user sell transactions
    const sell_acc = await Sell.findOne({ username: user });
    const pending_sell = sell_acc.pending_sell;

    // Check if there is a transaction pending
    if (pending_sell && (Date.now() <= pending_sell.expiration_time)) {

        // Update user stock owned
        user_acc.stocks_owned.find( stock => stock.stock_symbol === pending_sell.stock_symbol ).quantity -= pending_sell.quantity;
        
        // Update user funds
        user_acc.funds += pending_sell.amount;

        // Remove the pending sell
        await Sell.updateOne({ username: user }, {$unset: {'pending_sell':''}});

        await user_acc.save();

        console.log("Sell transaction was successful");
        // console.log(await Sell.findOne({ username: user })); // Display sell account

        return({success: "Sell transaction was successful"});
    }    

    console.error("No sell transaction initiated within 60 seconds");
    return({error: "No sell transaction initiated within 60 seconds"});
}

async function cancel_sell(user) {
    const user_acc = await User.findOne({ username: user });
    const pending_sell = user_acc.pending_sell;

    // Check if there is a transaction pending
    if (pending_sell && (Date.now() <= pending_sell.expiration_time)) {
        
        // Remove the pending sell
        await Sell.updateOne({ username: user }, {$unset: {'pending_sell':''}});

        await user_acc.save();

        console.log("Sell transaction canceled");
        // console.log(await Sell.findOne({ username: user })); // Display sell account
        return({success: "Sell transaction canceled"});
    }
    
    console.error("No sell transaction initiated within 60 seconds");
    return ({error: "No sell transaction initiated within 60 seconds"})
}

async function set_sell_amount(user, stock_symbol, amount) {
    const quote = await quote_server.get_quote(stock_symbol, user);
    const sell_qty = amount/quote.Quoteprice;
    
    //Get user account
    const user_acc = await User.findOne({ username: user });

    //Get user sell transactions
    const sell_acc = await Sell.findOne({ username: user });

    //Get specific stock owned
    const user_stock = user_acc.stocks_owned.find( stock => stock.stock_symbol === stock_symbol );
    
    // Verify user have enough stocks to sell
    if ( user_stock.quantity < sell_qty ) {
        console.error("Insufficient stocks to sell");
        return({error: "Insufficient stocks to sell"});
    }

     // Create a pending set sell
     sell_acc.pending_set_sell.stock_symbol = stock_symbol;
     sell_acc.pending_set_sell.amount = amount;
     sell_acc.pending_set_sell.quantity = sell_qty;

     await sell_acc.save();

    console.log("Set sell trigger initialized");
    // console.log(await Sell.findOne({ username: user })); // Display sell account
    return ({success: "Set sell trigger initialized"});
}

async function set_sell_trigger(user, stock_symbol, price) {
    //Get user account
    const user_acc = await User.findOne({ username: user });

    //Get user sell transactions
    const sell_acc = await Sell.findOne({ username: user });

    const pending_set_sell = sell_acc.pending_set_sell;
    if (pending_set_sell) {
        
        // Create a sell_trigger
        sell_acc.sell_triggers.push({
            stock_symbol: pending_set_sell.stock_symbol,
            amount: pending_set_sell.amount,
            quantity: pending_set_sell.quantity,
            sell_price: price
        });

        // Update user stock owned
        user_acc.stocks_owned.find( stock => stock.stock_symbol === pending_set_sell.stock_symbol ).quantity -= pending_set_sell.quantity;

        // Remove the pending set sell
        await Sell.updateOne({ username: user }, {$unset: {'pending_set_sell':''}});

        await user_acc.save();
        await sell_acc.save();
        
        console.log(`Sell transaction was set at sell price: ${price}`);
        // console.log(await Sell.findOne({ username: user })); // Display sell account
        return ({success: `Sell transaction was set at ${price}`});
    }

    console.error("Please initialize a set sell trigger first");
    return({error: "Please initialize a set sell trigger first"});
}

async function cancel_set_sell(user, stock_symbol, amount) {
    //Get user account
    const user_acc = await User.findOne({ username: user });

    //Get user sell transactions
    const sell_acc = await Sell.findOne({ username: user });

    //Find corresponding trigget
    const trigger = sell_acc.sell_triggers.find(trig => (trig.stock_symbol === stock_symbol) && (trig.amount === amount));

    if (trigger) {
        // TODO
        // Remove the sell trigger
        await Sell.updateOne({ username: user }, {$pull: {'sell_triggers': {stock_symbol: `${stock_symbol}`}}});

        // Restore stock owned
        user_acc.stocks_owned.find( stock => stock.stock_symbol === trigger.stock_symbol ).quantity += trigger.quantity;

        await user_acc.save();

        console.log("Sell trigger was successfully canceled");
        // console.log(await Sell.findOne({ username: user })); // Display sell account
        return ({success: "Sell trigger was successfully canceled"});
    }

    console.error(`There is no sell trigger for ${stock_symbol}`);
    return({error: `There is no sell trigger for ${stock_symbol}`});
}

module.exports = { sell,
    commit_sell,
    cancel_sell,
    set_sell_amount,
    cancel_set_sell,
    set_sell_trigger
};