const express = require('express');
const { get_quote } = require('../../quote-server/quote_server');

// dashboardRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /dashboard.
const dashboardRoutes = express.Router();

// 'http://localhost:5000/dashboard?type=quote&symbol=ABC&user=john'
dashboardRoutes.route('/dashboard').get(async (req, res) => {
    const { type, symbol, user } = req.query;
    console.log( `Type: ${type}, Symbol: ${symbol}, User: ${user}`);
    if (type === 'quote') {
        try {
            const quote = await get_quote(symbol, user);
            res.json(quote);
        } catch (err) {
            res.status(500).json({ error: err.message});
        }
    } // else { } finish to handle other requests for this page
})


module.exports = dashboardRoutes;