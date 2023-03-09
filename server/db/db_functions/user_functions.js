const User = require('../models/user');

async function create_user(username) {
    try {
        // Create a new user with provided username
        let new_user = new User({ username });

        // Save the new user to the database
        await new_user.save();

        // Return the newly created user
        return new_user;

    } catch (error) {
        // Handle the error
        console.error(error);
        throw new Error('Error creating user');
    }
}

module.exports = { create_user };