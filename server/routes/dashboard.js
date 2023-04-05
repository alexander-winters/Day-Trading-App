const express = require('express');
const { get_quote } = require('../../quote-server/quote_server');
const { buy,
    commit_buy, 
    cancel_buy, 
    set_buy_amount, 
    cancel_set_buy,
    set_buy_trigger 
} = require('../../transaction-server/buy_transaction');
const { sell,
    commit_sell,
    cancel_sell,
    set_sell_amount,
    cancel_set_sell,
    set_sell_trigger
} = require('../../transaction-server/sell_transaction');
const { add, display_summary } = require('../../transaction-server/misc_transaction');
const { create_user } = require('../../server/db/db_functions/user_functions');
const { create_transaction } = require('../db/db_functions/transaction_functions');
const { dumplog } = require('../../transaction-server/dumplog');
const User = require('../db/models/user');


// dashboardRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /dashboard.
const dashboardRoutes = express.Router();

let previous_stock_symbol = '';

// 'http://localhost:5000/dashboard?type=quote&user=john&stock_symbol=ABC'
dashboardRoutes.route('/dashboard').post(async (req, res) => {
    const { type, // Command 
            user, // user_id
            transaction_id,
            stock_symbol,
            amount, // Amount to add, buy, or sell.
            filename, // Specify dumplog filename
    } = req.body;

    // Implement checking if the previous symbol is equal to the requesting symbol
    // This will improve performance
    
    console.log( `Type: ${type}, User: ${user}, Symbol: ${stock_symbol}, Amount: ${amount}, Filename: ${filename}`);
    if (type === 'add') {
        try {
            // Need to get the current balance from db for user
            // let user_currrent_balance = 0;
            // user_currrent_balance += amount;
            // res.json(user_currrent_balance);

            const user_add = await add(user, amount);
            res.json(user_add);
            //res.json({myValue: 3456});

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (type === 'quote') {
        try {
            //Get user account
            const user_acc = await User.findOne({ username: user });

            const quote = await get_quote(user, stock_symbol);
            // Create a transaction
            await create_transaction(user_acc.user_id, user, 'quote_server', {}, quote, 'quote_server');
            res.json(quote);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (type === 'buy') {
        try {
            const user_buy = await buy(user, stock_symbol, amount);
            res.json(user_buy);

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (type === 'commit_buy') {
        try {
            const user_commit_buy = await commit_buy(user)
            res.json(user_commit_buy);

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (type === 'cancel_buy') {
        try {
            const user_cancel_buy = await cancel_buy(user)
            res.json(user_cancel_buy);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (type === 'sell') {
        try {
            const user_sell = await sell(user, stock_symbol, amount);
            res.json(user_sell);

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (type === 'commit_sell') {
        try {
            const user_commit_sell = await commit_sell(user);
            res.json(user_commit_sell);

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (type === 'cancel_sell') {
        try {
            const user_cancel_sell = await cancel_sell(user);
            res.json(user_cancel_sell);

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (type === 'set_buy_amount') {
        try {
            const user_set_buy = await set_buy_amount(user, stock_symbol, amount);
            res.json(user_set_buy);

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (type === 'cancel_set_buy') {
        try {
            const user_cancel_set_buy = await cancel_set_buy(user, stock_symbol);
            res.json(user_cancel_set_buy);

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (type === 'set_buy_trigger') {
        try {
            const user_set_buy_trigger = await set_buy_trigger(user, stock_symbol, amount);
            res.json(user_set_buy_trigger);

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (type === 'set_sell_amount') {
        try {
            const user_set_sell_amount = await set_sell_amount(user, stock_symbol, amount);
            res.json(user_set_sell_amount);

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (type === 'set_sell_trigger') {
        try {
            const user_set_sell_trigger = await set_sell_trigger(user, stock_symbol, amount);
            res.json(user_set_sell_trigger);

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (type === 'cancel_set_sell') {
        try {
            const user_cancel_set_sell = await cancel_set_sell(user, stock_symbol, amount);
            res.json(user_cancel_set_sell);

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (type === 'dumplog') {
        try {
            const dumplog = await dumplog(user);
            res.json(dumplog);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (type === 'display_summary') {
        try {
           const display = await display_summary(user);
           res.json(display);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } 
});


module.exports = dashboardRoutes;