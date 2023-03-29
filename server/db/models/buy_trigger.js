const mongoose = require('mongoose');

const buy_trigger_schema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    }
});

const BuyTrigger = mongoose.model('BuyTrigger', buy_trigger_schema);

module.exports = BuyTrigger;