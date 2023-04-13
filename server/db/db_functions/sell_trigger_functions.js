const SellTrigger = require('../models/sell_trigger');
require("dotenv").config({ path: "../../config.env" });
const connectDB = require('../conn')

// Connect to MongoDB
connectDB();

async function create_sell_trigger(username) {
    try {
        // Create a new sell trigger for the provided username
        const new_sell_trigger = new SellTrigger({ username });

        // Save the new sell trigger to the database
        await new_sell_trigger.save();

        // Return the newly created user
        // console.log('NEW SELL TRIGGER WATCHER:\n' + new_sell_trigger);
        return new_sell_trigger;

    } catch (error) {
        // Handle the error
        console.error(error);
        throw new Error('Error creating sell trigger watcher');
    }
}

module.exports = { create_sell_trigger };