const mongoose = require('mongoose');

const sell_schema = new mongoose.Schema({
    username: {
        type: String,
        ref: 'User',
        unique: true,
        required: true
    },
    pending_sell: {
        stock_symbol: {
            type: String,
            unique: true,
        },
        amount: {
            type: Number,
        },
        quantity: {
            type: Number,
        },
        expiration_time: {
            type: Date
        }
    },
    pending_set_sell: {
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
    sell_triggers: [
        {
            stock_symbol: String,
            amount: Number,
            quantity: Number,
            sell_price: Number,
        }
    ]
});

const Sell = mongoose.model('Sell', sell_schema);

module.exports = Sell;