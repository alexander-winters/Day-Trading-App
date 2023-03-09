const User = require('../models/user');
require("dotenv").config({ path: "../../config.env" });
const connectDB = require('../conn')

// Connect to MongoDB
connectDB();

async function create_user(username) {
    try {
        // Create a new user with provided username
        const new_user = new User({ username });

        // Save the new user to the database
        await new_user.save();

        // Return the newly created user
        console.log(new_user);
        return new_user;

    } catch (error) {
        // Handle the error
        console.error(error);
        throw new Error('Error creating user');
    }
}

create_user('olivier');

module.exports = { create_user };