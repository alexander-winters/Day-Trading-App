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
            let user_currrent_balance = 0;
            user_currrent_balance += amount;
            res.json(user_currrent_balance);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (type === 'quote') {
        try {
            const quote = await get_quote(user, stock_symbol);
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
            const quote = await get_quote(user, stock_symbol)

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (type === 'cancel_buy') {
        try {
            const quote = await get_quote(user, stock_symbol)

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (type === 'sell') {
        try {
            const quote = await get_quote(user, stock_symbol)

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (type === 'commit_sell') {
        try {
            const quote = await get_quote(user, stock_symbol)

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (type === 'cancel_sell') {
        try {
            const quote = await get_quote(user, stock_symbol)

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (type === 'set_buy_amount') {
        try {
            const quote = await get_quote(user, stock_symbol)

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (type === 'cancel_set_buy') {
        try {
            const quote = await get_quote(user, stock_symbol)

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (type === 'set_buy_trigger') {
        try {
            const quote = await get_quote(user, stock_symbol)

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (type === 'set_sell_amount') {
        try {
            const quote = await get_quote(user, stock_symbol)

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (type === 'set_sell_trigger') {
        try {
            const quote = await get_quote(user, stock_symbol)

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (type === 'cancel_set_sell') {
        try {
            const quote = await get_quote(user, stock_symbol)

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (type === 'dumplog') {
        try {

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (type === 'display_summary') {
        try {

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } 
});


module.exports = dashboardRoutes;