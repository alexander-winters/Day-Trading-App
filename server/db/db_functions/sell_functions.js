const Sell = require('../models/sell');

async function create_sell_account(username) {
    try {
        // Create a new sell account with provided username
        const new_sell_acc = new Sell({ username });

        // Save the new sell account to the database
        await new_sell_acc.save();

        // Return the newly created user
        // console.log(new_sell_acc);
        return new_sell_acc;

    } catch (error) {
        // Handle the error
        console.error(error);
        throw new Error('Error creating sell account');
    }
}


module.exports = { create_sell_account };