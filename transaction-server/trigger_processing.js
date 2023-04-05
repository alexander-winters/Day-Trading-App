const User = require('../server/db/models/user');
const Buy = require('../server/db/models/buy');
const Sell = require('../server/db/models/sell');
const BuyTrigger = require('../server/db/models/buy_trigger');
const SellTrigger = require('../server/db/models/sell_trigger');
const { get_quote } = require("../quote-server/quote_server");

//require("dotenv").config({ path: "../server/config.env" });
const connectDB = require('../server/db/conn');

const TRIGGER_PROCESS_INTERVAL_MS = 30000; // 30 seconds (in milliseconds)

let trigger_timer;

// Connect to MongoDB
connectDB();

function start_trigger_timer() {
    console.log(`Started a ${TRIGGER_PROCESS_INTERVAL_MS}ms timer to process buy and sell triggers.`);
    trigger_timer = setInterval(process_triggers, TRIGGER_PROCESS_INTERVAL_MS);
}

function stop_trigger_timer() {
    clearInterval(trigger_timer);
    console.log('Stopped trigger processing timer.');
}

async function process_triggers() {
    const time = new Date(Date.now());
    console.log('Processing triggers - Time: ' + time.toISOString());

    await manage_buy_triggers();
    await manage_sell_triggers();

    const time_end = new Date(Date.now());
    console.log('Finished processing triggers - End Time: ' + time_end.toISOString());
}

async function manage_buy_triggers() {
    const all_buy_trigger_watchers = await BuyTrigger.find({});

    let trigger_watcher_deletion_list = [];

    // For all buy accounts in the trigger watch list
    for (const user_triggers of all_buy_trigger_watchers) {
        const buy_acc = await Buy.findOne({ username: user_triggers.username });
        
        let user_deletion_list = [];

        // For all buy triggers in the buy account
        for (const trigger of buy_acc.buy_triggers) {

            const quote_price = await get_quote(buy_acc.username, trigger.stock_symbol);
            console.log(`While processing Buy trigger ${trigger.stock_symbol} for user ${buy_acc.username}, quote price is ${quote_price.quote_price}.`);
            
            if (quote_price.quote_price === trigger.buy_price) {

                // Buy stock and add to owned stocks
                const user_acc = await User.findOne({ "username": buy_acc.username });

                const cur_stock = user_acc.stocks_owned.find(x => x.stock_symbol === trigger.stock_symbol);

                if (cur_stock) {
                    cur_stock.quantity += trigger.quantity; // add new quantity to existing stock
                } else {
                    user_acc.stocks_owned.push({stock_symbol: trigger.stock_symbol, quantity: trigger.quantity}); // create new stock
                }

                await user_acc.save();

                console.log(`BUY TRIGGER PROCESS: User ${user_acc.username} bought amount ${trigger.amount} of ${trigger.stock_symbol} at price point ${trigger.buy_price}.`);

                // Flag to delete trigger in the current user buy account
                user_deletion_list.push(trigger);
            }
        }

        console.log('buy user_deletion_list at deletion time = ' + user_deletion_list);

        // Delete all user account buy triggers that were purchased
        for (let t in user_deletion_list) {
            console.log('BUY: I am in the user_deletion_list loop!');
            console.log('t =');
            console.log(t);
            console.log('user_deletion_list[t].stock_symbol =');
            console.log(user_deletion_list[t].stock_symbol);

            // Remove the buy trigger
            await Buy.updateOne({ username: buy_acc.username }, {$pull: {'buy_triggers': {stock_symbol: `${user_deletion_list[t].stock_symbol}`}}});
        }

        // Save changes to buy account
        await buy_acc.save();

        console.log('user.buy_triggers after deletion:');
        console.log(buy_acc.buy_triggers);

        // Flag to delete trigger watcher in the BuyTriggers
        if (buy_acc.buy_triggers.length === 0) {
            trigger_watcher_deletion_list.push(buy_acc.username);
        }
    }

    console.log('buy trigger_watcher_deletion_list at deletion time = ' + trigger_watcher_deletion_list);
    console.log(trigger_watcher_deletion_list);
    // Delete buy trigger watcher for the current user if no more triggers in buy account
    for (let username in trigger_watcher_deletion_list) {
        await BuyTrigger.deleteOne({ username: trigger_watcher_deletion_list[username] });
        //await BuyTrigger.save();
    }
}

async function manage_sell_triggers() {
    const all_sell_trigger_watchers = await SellTrigger.find({});

    let trigger_watcher_deletion_list = [];

    // For all sell accounts in the trigger watch list
    for (const user_triggers of all_sell_trigger_watchers) {
        const sell_acc = await Sell.findOne({ username: user_triggers.username });
        
        let user_deletion_list = [];

        // For all sell triggers in the sell account
        for (const trigger of sell_acc.sell_triggers) {

            const quote_price = await get_quote(sell_acc.username, trigger.stock_symbol);

            console.log(`While processing Sell trigger ${trigger.stock_symbol} for user ${sell_acc.username}, quote price is ${quote_price.quote_price}.`);

            if (quote_price.quote_price === trigger.sell_price) {

                // Sell stock and add funds
                const user_acc = await User.findOne({ "username": sell_acc.username });
                user_acc.funds += trigger.amount;

                await user_acc.save();

                console.log(`SELL TRIGGER PROCESS: User ${user_acc.username} sold ${trigger.stock_symbol} and added $${trigger.amount} to account funds`);
                
                // Flag to delete trigger in the current user sell account
                user_deletion_list.push(trigger);
            }
        }

        console.log('sell user_deletion_list at deletion time = ' + user_deletion_list);

        // Delete all user account buy triggers that were sold
        for (let t in user_deletion_list) {
            console.log('SELL: I am in the user_deletion_list loop!');
            console.log('t =');
            console.log(t);
            console.log('user_deletion_list[t].stock_symbol =');
            console.log(user_deletion_list[t].stock_symbol);

            // Remove the sell trigger
            await Sell.updateOne({ username: sell_acc.username }, {$pull: {'sell_triggers': {stock_symbol: `${user_deletion_list[t].stock_symbol}`}}});
        }

        // Save changes to buy account
        await sell_acc.save();

        console.log('user.sell_triggers after deletion:');
        console.log(sell_acc.sell_triggers);

        // Flag to delete trigger watcher in the SellTriggers
        if (sell_acc.sell_triggers.length === 0) {
            trigger_watcher_deletion_list.push(sell_acc.username);
        }
    }

    console.log('sell trigger_watcher_deletion_list at deletion time = ' + trigger_watcher_deletion_list);
    console.log(trigger_watcher_deletion_list);

    // Delete sell trigger watcher for the current user if no more triggers in sell account
    for (let username in trigger_watcher_deletion_list) {
        await SellTrigger.deleteOne({ username: trigger_watcher_deletion_list[username] });
        //await SellTrigger.save();
    }
}

module.exports = {
    start_trigger_timer,
    stop_trigger_timer,
    process_triggers
};