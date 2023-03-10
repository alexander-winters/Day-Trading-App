const User = require('../server/db/models/user');
//require("dotenv").config({ path: "../server/config.env" });
const connectDB = require('../server/db/conn');
const { create_user } = require('../server/db/db_functions/user_functions');


// Connect to MongoDB
connectDB();


async function add(user, amount) {
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
            console.log("Exiting add command with error.")
            return ({error: "Invalid username. Unable to add funds."});
        }
    }

    //userObj = await User.findOne({ "username": user });

    console.log("my funds (Before): User: " + userObj.username + " Funds: " + userObj.funds);

    // Need to get the current balance from db for user
    userObj.funds += amount;

    await userObj.save();

    console.log("my funds (After): " + userObj.funds);

    // Assume the user has enough
    return ({success: "Successfully added funds." });
}

module.exports = {
    add
};