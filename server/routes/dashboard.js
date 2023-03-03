const express = require('express');
const { get_quote } = require('../../quote-server/quote_server');

// dashboardRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /dashboard.
const dashboardRoutes = express.Router();
let previous_stock_symbol = '';

// 'http://localhost:5000/dashboard?type=quote&symbol=ABC&user=john'
dashboardRoutes.route('/dashboard').get(async (req, res) => {
    const { type, // Command 
            user, // user_id
            stock_symbol,
            amount, // Amount to add, buy, or sell.
            filename, // Specify dumplog filename
    } = req.query;
    
    console.log( `Type: ${type}, Symbol: ${symbol}, User: ${user}`);
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
            const quote = await get_quote(stock_symbol, user);
            res.json(quote);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (type === 'buy') {
        try {

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (type === 'commit_buy') {
        try {

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (type === 'cancel_buy') {
        try {

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (type === 'sell') {
        try {

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (type === 'commit_sell') {
        try {

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (type === 'cancel_sell') {
        try {

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (type === 'set_buy_amount') {
        try {

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (type === 'cancel_set_buy') {
        try {

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (type === 'set_buy_trigger') {
        try {

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (type === 'set_sell_amount') {
        try {

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (type === 'set_sell_trigger') {
        try {

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (type === 'cancel_set_sell') {
        try {

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