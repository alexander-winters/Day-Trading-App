const BuyTrigger = require('../models/buy_trigger');
require("dotenv").config({ path: "../../config.env" });
const connectDB = require('../conn')

// Connect to MongoDB
connectDB();

async function create_buy_trigger(username) {
    try {
        // Create a new buy trigger for the provided username
        const new_buy_trigger = new BuyTrigger({ username });

        // Save the new buy trigger to the database
        await new_buy_trigger.save();

        // Return the newly created user
        // console.log('NEW BUY TRIGGER WATCHER:\n' + new_buy_trigger);
        return new_buy_trigger;

    } catch (error) {
        // Handle the error
        console.error(error);
        throw new Error('Error creating buy trigger watcher');
    }
}

module.exports = { create_buy_trigger };