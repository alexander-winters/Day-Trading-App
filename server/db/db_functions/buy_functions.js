const Buy = require('../models/buy');
require("dotenv").config({ path: "../../config.env" });
const connectDB = require('../conn')

// Connect to MongoDB
connectDB();

async function create_buy_account(username) {
    try {
        // Create a new buy account with provided username
        const new_buy_acc = new Sell({ username });

        // Save the new buy account to the database
        await new_buy_acc.save();

        // Return the newly created user
        console.log(new_buy_acc);
        return new_buy_acc;

    } catch (error) {
        // Handle the error
        console.error(error);
        throw new Error('Error creating sell account');
    }
}


module.exports = { create_buy_account };