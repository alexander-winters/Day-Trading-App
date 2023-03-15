const User = require('../models/user');
require("dotenv").config({ path: "../../config.env" });
const connectDB = require('../conn')
const { create_buy_account } = require('./buy_functions');
const { create_sell_account } = require('./sell_functions');

// Connect to MongoDB
connectDB();

async function create_user(username) {
    try {
        // Create a new user with provided username
        const new_user = new User({ username });

        // Save the new user to the database
        await new_user.save();

        // Create a user buy account
        await create_buy_account(username);

        // Create a user sell account
        await create_sell_account(username);

        // Return the newly created user
        console.log(new_user);
        return new_user;

    } catch (error) {
        // Handle the error
        console.error(error);
        throw new Error('Error creating user');
    }
}

// create_user('elmer_test');

module.exports = { create_user };