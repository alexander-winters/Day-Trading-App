const User = require('../server/db/models/user');
const { create_user } = require('../server/db/db_functions/user_functions');
const { create_transaction } = require('../server/db/db_functions/transaction_functions');

async function add(user, amount) {
    const request = {
        type: 'ADD',
        user: user,
        amount: amount
    };

    console.log("Trying to add");
   
    console.log("Username: \"" + user + "\".");

    let userObj = await User.findOne({ "username": user });

    // TODO: Move this to a better location later
    // I'm creating a new user in add if it does not exist as a bit of a hack
    // since it is assumed "add" will pretty much always be the first command for any new user.
    if(!userObj) {
        console.log("Provided user does not exist. Creating new user. " + userObj);
        if (user !== undefined) {
            userObj = await create_user(user);
            // create_user(user);
            // userObj = await User.findOne({ "username": user });
        }
        else {
            // Create a transaction
            await create_transaction(userObj.user_id, user, 'error_event', request, {}, 'transaction_server');

            console.log("Exiting add command with error.")
            return ({error: "Invalid username. Unable to add funds."});
        }
    }

    //userObj = await User.findOne({ "username": user });

    console.log("my funds (Before): User: " + userObj.username + " Funds: " + userObj.funds);

    // Need to get the current balance from db for user
    userObj.funds += amount;

    // Create a transaction
    await create_transaction(userObj.user_id, user, 'account_transaction', request, {}, 'transaction_server');

    await userObj.save();

    console.log("my funds (After): " + userObj.funds);

    // Assume the user has enough
    return ({success: "Successfully added funds." });
}

//TODO: Implement function
async function display_summary(user) {
    //Get user account
    const user_acc = await User.findOne({ username: user });

    const request = {
        type: 'DISPLAY_SUMMARY',
        user: user,
    };

    await create_transaction(user_acc.user_id, user, 'user_command', request, {}, 'transaction_server');

    return ({success: "Summary Displayed" });
};

module.exports = {
    add,
    display_summary
};