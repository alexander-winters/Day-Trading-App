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
const { create_transaction } = require('../db/db_functions/transaction_functions');
const { dumplog } = require('../../transaction-server/dumplog');
const User = require('../db/models/user');


// dashboardRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /dashboard.
const dashboardRoutes = express.Router();

dashboardRoutes.route('/dashboard').post(async (req, res, next) => {
    const { type, // Command 
            user, // user_id
            transaction_id,
            stock_symbol,
            amount, // Amount to add, buy, or sell.
            filename, // Specify dumplog filename
    } = req.body;
    
    try {
        let result;

        switch (type) {
            case 'add':
                result = await add(user, amount)
                break;
            case 'quote':
                // Get user account
                user_acc = await User.findOne({ username: user });
                // Get quote
                result = await get_quote(user, stock_symbol);
                // Create transaction
                await create_transaction(user_acc.user_id, user, 'quote-server', {}, result, 'quote_server');
                break;
            case 'buy':
                result = await buy(user, stock_symbol, amount);
                break;
            case 'commit_buy':
                result = await commit_buy(user);
                break;
            case 'cancel_buy':
                result = await cancel_buy(user);
                break;
            case 'sell':
                result = await sell(user, stock_symbol, amount);
                break;
            case 'commit_sell':
                result = await commit_sell(user);
                break;
            case 'cancel_sell':
                result = await cancel_sell(user);
                break;
            case 'set_buy_amount':
                result = await set_buy_amount(user, stock_symbol, amount);
                break;
            case 'cancel_set_buy':
                result = await cancel_set_buy(user, stock_symbol);
                break;
            case 'set_buy_trigger':
                result = await set_buy_trigger(user, stock_symbol, amount);
                break;
            case 'set_sell_amount':
                result = await set_sell_amount(user, stock_symbol, amount);
                break;
            case 'set_sell_trigger':
                result = await set_sell_trigger(user, stock_symbol, amount);
                break;
            case 'cancel_set_sell':
                result = await cancel_set_sell(user, stock_symbol);
                break;
            case 'dumplog':
                await dumplog(user);
                return res.json({ message: "Dumplog Complete"})
            case 'display_summary':
                result = await display_summary(user);
                break;
            default:
                return res.status(400).json({ error: "Invalid request type" });
        }

        res.json(result);
    } catch (err) {
        next(err); // Pass the error to the error handling middleware
    }
});

// Error handling middleware
dashboardRoutes.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: err.message });
})

module.exports = dashboardRoutes;
