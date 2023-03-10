// const { create_user } = require("./user_functions");
const User = require('../models/user');
require("dotenv").config({ path: "../../config.env" });
const connectDB = require('../conn')

connectDB();

async function get_users() {
    const users = await User.find()
    console.log(users);
}

get_users();