const Trigger = require('../models/trigger');
require("dotenv").config({ path: "../../config.env" });
const connectDB = require('../conn')

// Connect to MongoDB
connectDB();

async function create_trigger(username) {
    try {
        // Create a new trigger for the provided username
        const new_trigger = new Trigger({ username });

        // Save the new trigger to the database
        await new_trigger.save();

        // Return the newly created user
        console.log('NEW TRIGGER WATCHER:\n' + new_trigger);
        return new_trigger;

    } catch (error) {
        // Handle the error
        console.error(error);
        throw new Error('Error creating trigger watcher');
    }
}

module.exports = { create_trigger };