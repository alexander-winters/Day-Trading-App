const { get_quote } = require("../quote-server/quote_server");
const User = require("../server/db/models/user");
const Sell = require('../server/db/models/sell');
const { create_transaction } = require('../server/db/db_functions/transaction_functions');
const { create_sell_trigger } = require('../server/db/db_functions/sell_trigger_functions');
const SellTrigger = require("../server/db/models/sell_trigger");

const TIME_TO_EXPIRE = 60;

const Redis = require('ioredis');
const redis_client = new Redis({
    host: 'myredis-container',
    port: 6379
});


async function sell(user, stock_symbol, amount) {
    try {
        // Check if the stock symbol exists in Redis
        let quote = await redis_client.get(stock_symbol);

        if (!quote) {
            // If the stock symbol is not in Redis, fetch the quote object from the quote server
            quote = await get_quote(user, stock_symbol);
            // Add the stock symbol and its quote object to Redis with a TTL of 4 minutes (240 seconds)
            await redis_client.setex(stock_symbol, 240, JSON.stringify(quote));
        } else {
            // If the stock symbol is in Redis, parse the quote object from a string into a JavaScript object
            quote = JSON.parse(quote);
        }
        const sell_qty = quote.quote_price !== 0 ? amount / quote.quote_price : 0;

        const request = {
            type: 'SELL',
            user: user,
            stock_symbol: stock_symbol,
            amount: amount
        };

        //Get user account
        const user_acc = await User.findOne({ username: user });

        //Get user sell transactions
        const sell_acc = await Sell.findOne({ username: user });

        //Get specific stock owned
        const user_stock = user_acc.stocks_owned.find( stock => stock.stock_symbol === stock_symbol );

        // Verify user has stocks owned 
        if ( !user_stock ) {
            // Create a transaction
            await create_transaction(user_acc.user_id, user, 'error_event', request, {}, 'transaction_server');

            // console.error("No stocks owned")
            return({error: "No stocks owned"});
        }

        // Verify user have enough stocks to sell
        if ( user_stock.quantity < sell_qty ) {
            // Create a transaction
            await create_transaction(user_acc.user_id, user, 'error_event', request, {}, 'transaction_server');

            // console.error("Insufficient stocks to sell");
            return({error: "Insufficient stocks to sell"});
        }

        const now = Math.floor(new Date().getTime());

        // Create a sell_pending
        sell_acc.pending_sell.stock_symbol = stock_symbol;
        sell_acc.pending_sell.amount = amount;
        sell_acc.pending_sell.quantity = sell_qty;
        sell_acc.pending_sell.expiration_time = now + (TIME_TO_EXPIRE * 1000);

        // Create a transaction
        await create_transaction(user_acc.user_id, user, 'user_command', request, {}, 'transaction_server');

        await sell_acc.save();


        // console.log("Sell transaction created");
        // console.log(sell_acc); // Display sell account
        return ({success: "Please confirm or cancel the sell transaction" });
    } catch (error) {
        console.error("Error in sell:", error);
    }
}

async function commit_sell(user) {
    try {
        const user_acc = await User.findOne({ username: user });

        //Get user sell transactions
        const sell_acc = await Sell.findOne({ username: user });
        const pending_sell = sell_acc.pending_sell;

        const request = {
            type: 'COMMIT_SELL',
            user: user,
            stock_symbol: pending_sell.stock_symbol,
            amount: pending_sell.amount
        }

        const now = Math.floor(new Date().getTime());

        // Check if there is a transaction pending
        if (Object.keys(pending_sell).length !== 0 && (now <= pending_sell.expiration_time)) {

            // Update user stock owned
            user_acc.stocks_owned.find( stock => stock.stock_symbol === pending_sell.stock_symbol ).quantity -= pending_sell.quantity;
            
            // Update user funds
            user_acc.funds += pending_sell.amount;

            // Remove the pending sell
            await Sell.updateOne({ username: user }, {$unset: {'pending_sell':''}});
        
            // Create a transaction
            await create_transaction(user_acc.user_id, user, 'user_command', request, {}, 'transaction_server');

            await user_acc.save();

            // console.log("Sell transaction was successful");
            // console.log(await Sell.findOne({ username: user })); // Display sell account

            return({success: "Sell transaction was successful"});
        }    

        // Create a transaction
        await create_transaction(user_acc.user_id, user, 'error_event', request, {}, 'transaction_server');

        // console.error("No sell transaction initiated within 60 seconds");
        return({error: "No sell transaction initiated within 60 seconds"});
    } catch (error) {
        console.error("Error in commit_sell:", error);
    }
    
}

async function cancel_sell(user) {
    try {
        const user_acc = await User.findOne({ username: user });

        //Get user sell transactions
        const sell_acc = await Sell.findOne({ username: user });
        const pending_sell = sell_acc.pending_sell;

        const request = {
            type: 'CANCEL_SELL',
            user: user,
            stock_symbol: pending_sell.stock_symbol,
            amount: pending_sell.amount
        }

        const now = Math.floor(new Date().getTime());
        // Check if there is a transaction pending
        if (Object.keys(pending_sell).length !== 0 && (now <= pending_sell.expiration_time)) {
            
            // Remove the pending sell
            await Sell.updateOne({ username: user }, {$unset: {'pending_sell':''}});

            await user_acc.save();

            // Create a transaction
            await create_transaction(user_acc.user_id, user, 'user_command', request, {}, 'transaction_server');

            // console.log("Sell transaction canceled");
            // console.log(await Sell.findOne({ username: user })); // Display sell account
            return({success: "Sell transaction canceled"});
        }
        
        // Create a transaction
        await create_transaction(user_acc.user_id, user, 'error_event', request, {}, 'transaction_server');

        // console.error("No sell transaction initiated within 60 seconds");
        return ({error: "No sell transaction initiated within 60 seconds"})
    } catch (error) {
        console.error("Error in canell_sell:", error);
    }  
}

async function set_sell_amount(user, stock_symbol, amount) {
    try {
        // Check if the stock symbol exists in Redis
    let quote = await redis_client.get(stock_symbol);

    if (!quote) {
        // If the stock symbol is not in Redis, fetch the quote object from the quote server
        quote = await get_quote(user, stock_symbol);
        // Add the stock symbol and its quote object to Redis with a TTL of 4 minutes (240 seconds)
        await redis_client.setex(stock_symbol, 240, JSON.stringify(quote));
    } else {
        // If the stock symbol is in Redis, parse the quote object from a string into a JavaScript object
        quote = JSON.parse(quote);
    }
    const sell_qty = amount / Number(quote.quote_price);

    const request = {
        type: 'SET_SELL_AMOUNT',
        user: user,
        stock_symbol: stock_symbol,
        amount: amount
    }
    
    //Get user account
    const user_acc = await User.findOne({ username: user });

    //Get user sell transactions
    const sell_acc = await Sell.findOne({ username: user });

    //Get specific stock owned
    const user_stock = user_acc.stocks_owned.find( stock => stock.stock_symbol === stock_symbol );
    
    // Verify user have enough stocks to sell
    if ( user_stock && user_stock.quantity < sell_qty ) {
        // Create a transaction
        await create_transaction(user_acc.user_id, user, 'error_event', request, {}, 'transaction_server');

        // console.error("Insufficient stocks to sell");
        return({error: "Insufficient stocks to sell"});
    }

    // Create a pending set sell
    sell_acc.pending_set_sell.stock_symbol = stock_symbol;
    sell_acc.pending_set_sell.amount = amount;
    sell_acc.pending_set_sell.quantity = sell_qty;

    // Create a transaction
    await create_transaction(user_acc.user_id, user, 'user_command', request, {}, 'transaction_server');

    await sell_acc.save();

    // console.log("Set sell trigger initialized");
    // console.log(await Sell.findOne({ username: user })); // Display sell account
    return ({success: "Set sell trigger initialized"});
    } catch (error) {
        console.error("Error in set_sell_amount:", error); 
    }
    
}

async function set_sell_trigger(user, stock_symbol, price) {
    try {
        console.log('user:', user);
        console.log('stock_symbol:', stock_symbol);
        console.log('price:', price);
        
        const request = {
            type: 'SET_SELL_TRIGGER',
            user: user,
            stock_symbol: stock_symbol,
            amount: price
        };
    
        //Get user account
        const user_acc = await User.findOne({ username: user });
    
        //Get user sell transactions
        const sell_acc = await Sell.findOne({ username: user });

        console.log('sell_acc:', sell_acc);
        console.log('sell_acc.pending_set_sell:', sell_acc.pending_set_sell);

         // Check if pending_set_sell exists in sell_acc and if it has a quantity property
        if (!sell_acc.pending_set_sell || Object.keys(sell_acc.pending_set_sell).length === 0 || !sell_acc.pending_set_sell.hasOwnProperty('quantity')) {
            // Create a transaction
            await create_transaction(user_acc.user_id, user, 'error_event', request, {}, 'transaction_server');
            // console.error("Please initialize a set sell trigger first");
            return ({ error: "Please initialize a set sell trigger first" });
        }
    
        const pending_set_sell = sell_acc.pending_set_sell;
        console.log('pending_set_sell:', pending_set_sell);
        if (Object.keys(pending_set_sell).length !== 0) {
            // Create a sell_trigger
            sell_acc.sell_triggers.push({
                stock_symbol: pending_set_sell.stock_symbol,
                amount: pending_set_sell.amount,
                quantity: Number(pending_set_sell.quantity),
                sell_price: price
            });

            user_acc.stocks_owned.find( stock => stock.stock_symbol === pending_set_sell.stock_symbol ).quantity -= Number(pending_set_sell.quantity);

            // Remove the pending set sell
            await Sell.updateOne({ username: user }, {$unset: {'pending_set_sell':''}});

            // Create a transaction
            await create_transaction(user_acc.user_id, user, 'user_command', request, {}, 'transaction_server');

            await user_acc.save();
            await sell_acc.save();

                // Add to list of users who have sell triggers we need to process if not already there
            const existing_sell_trigger = await SellTrigger.findOne({username: sell_acc.username})
            if (!existing_sell_trigger) {
                await create_sell_trigger(sell_acc.username);
                // console.log('Created sell trigger watcher for user: ' + sell_acc.username);
            }
            
            // console.log(`Sell transaction was set at sell price: ${price}`);
            // console.log(await Sell.findOne({ username: user })); // Display sell account
            return ({success: `Sell transaction was set at ${price}`});
        }
    } catch (error) {
        console.error("Error in set_sell_trigger:", error);
    }
}

async function cancel_set_sell(user, stock_symbol, amount) {
    try{
        const request = {
            type: 'CANCEL_SET_SELL',
            user: user,
            stock_symbol: stock_symbol,
            amount: amount
        };
    
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
    
            // Create a transaction
            await create_transaction(user_acc.user_id, user, 'user_command', request, {}, 'transaction_server');
    
            await user_acc.save();
    
            // Delete sell trigger watcher for that user if no sell triggers remaining in user account
            const existing_sell_trigger = await SellTrigger.findOne({username: sell_acc.username})
            if (existing_sell_trigger && (!sell_acc.sell_triggers || sell_acc.sell_triggers.length <= 0)) {
                await SellTrigger.deleteMany({username: sell_acc.username});
                // console.log('Deleted sell trigger watcher for user: ' + sell_acc.username);
            }
    
            // console.log("Sell trigger was successfully canceled");
            // console.log(await Sell.findOne({ username: user })); // Display sell account
            return ({success: "Sell trigger was successfully canceled"});
        }
    
        // Create a transaction
        await create_transaction(user_acc.user_id, user, 'error_event', request, {}, 'transaction_server');
    
        // console.error(`There is no sell trigger for ${stock_symbol}`);
        return({error: `There is no sell trigger for ${stock_symbol}`});
    } catch (error) {
        console.error("Error in cancel_set_sell:", error);
    } 
}

module.exports = { sell,
    commit_sell,
    cancel_sell,
    set_sell_amount,
    cancel_set_sell,
    set_sell_trigger
};