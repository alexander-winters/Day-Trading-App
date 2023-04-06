const mongoose = require('mongoose');

const sell_trigger_schema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    }
});

const SellTrigger = mongoose.model('SellTrigger', sell_trigger_schema);

module.exports = SellTrigger;