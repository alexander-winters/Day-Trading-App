// const { create_user } = require("./user_functions");
const User = require('../models/user');
const Transaction = require('../models/transaction')
require("dotenv").config({ path: "../../config.env" });
const connectDB = require('../conn')

connectDB();

async function get_users() {
    const users = await User.find()
    console.log(users);
}

async function get_transactions() {
    const transactions = await Transaction.find();
    console.log(transactions);
}

// get_users();
get_transactions();