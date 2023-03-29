const mongoose = require('mongoose');

const trigger_schema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    }
});

const Trigger = mongoose.model('Trigger', trigger_schema);

module.exports = Trigger;