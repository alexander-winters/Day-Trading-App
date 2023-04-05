const Buy = require('../models/buy');

async function create_buy_account(username) {
    try {
        // Create a new buy account with provided username
        const new_buy_acc = new Buy({ username });

        // Save the new buy account to the database
        await new_buy_acc.save();

        // Return the newly created user
        console.log(new_buy_acc);
        return new_buy_acc;

    } catch (error) {
        // Handle the error
        console.error(error);
        throw new Error('Error creating buy account');
    }
}


module.exports = { create_buy_account };