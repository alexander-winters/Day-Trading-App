// const fetch = require('node-fetch');
const { get_quote } = require("../quote-server/quote_server");

// const url = 'http://localhost:5000/dashboard'
const user_currrent_balance = 100000;

async function buy(user, stock_symbol, amount) {
    console.log("Trying to buy");
    const quote = await get_quote(user, stock_symbol);
    let buy_total = quote * amount; // Calculates total price user is trying to purchase
    // Check False pre-condition first to avoid if, else.
    // Check if the user does not have enough
    if (user_currrent_balance < buy_total) {
        return ({ error: "Insufficient funds" });
    }
    // Assume the user has enough
    return ({success: "Please confirm or cancel the transaction" });
}

async function commit_buy(user) {
    // Complete
}

async function cancel_buy(user) {
    // Complete
}

async function set_buy_amount(user, stock_symbol, amount) {
    // Complete
}

async function set_buy_trigger(user, stock_symbol, amount) {
    // Complete
}

async function cancel_set_buy(user, stock_symbol, amount) {
    // Complete
}

module.exports = { buy,
    commit_buy, 
    cancel_buy, 
    set_buy_amount, 
    cancel_set_buy,
    set_buy_trigger
};