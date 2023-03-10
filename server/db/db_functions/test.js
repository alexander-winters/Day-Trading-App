// const { create_user } = require("./user_functions");
const User = require('../models/user');
require("dotenv").config({ path: "../../config.env" });
const connectDB = require('../conn');
const { create_user } = require('./user_functions');

connectDB();

async function get_users() {
    const users = await User.find()
    console.log("Printing user list...");
    console.log(users);
    console.log("Done printing user list.");
}

//create_user("Jim");
get_users();