// const { create_user } = require("./user_functions");
const User = require('../models/user');
const db  = 

// create_user('alex').then((user) => {
//     console.log("User added to the database:", user);
// }).catch((error) => {
//     console.error('Error adding user to database:', error);
// });
async function get_users() {
    const users = await User.find()
    console.log(users);
}

get_users();