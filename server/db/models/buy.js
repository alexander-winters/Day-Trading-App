const mongoose = require('mongoose');

const buy_schema = new mongoose.Schema({
    username: {
        type: String,
        ref: 'User',
        unique: true,
        required: true
    },
    // TODO: Migrate pending_buy to here from user.js
    pending_set_buy: {
        stock_symbol: {
            type: String,
            unique: true,
        },
        amount: {
            type: Number,
        },
        quantity: {
            type: Number,
        }
    },
    buy_triggers: [
        {
            stock_symbol: String,
            amount: Number,
            quantity: Number,
            buy_price: Number,
        }
    ]
});

const Buy = mongoose.model('Buy', buy_schema);

module.exports = Buy;