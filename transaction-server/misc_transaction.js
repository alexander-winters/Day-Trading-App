const User = require('../server/db/models/user');
//require("dotenv").config({ path: "../server/config.env" });
const connectDB = require('../server/db/conn')

// Connect to MongoDB
connectDB();


async function add(user, amount) {
    console.log("Trying to add");
   
    console.log("Username: \"" + user + "\".");
    
    const userObj = await User.findOne({ "username": user });

    console.log("my funds (Before): " + userObj.funds);

    // Need to get the current balance from db for user
    userObj.funds += amount;

    userObj.save();

    console.log("my funds (After): " + userObj.funds);

    // Assume the user has enough
    return ({success: "Successfully added funds." });
}

module.exports = {
    add
};