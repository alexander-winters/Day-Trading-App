const get_quote = require("../quote-server/quote_server");

async function buy(user, stock_symbol, amount) {
    // Complete
}

async function commit_buy(user, stock_symbol, amount) {
    // Complete
}

async function cancel_buy(user, stock_symbol, amount) {
    // Complete
}

async function set_buy_amount(user, stock_symbol, amount) {
    // Complete
}

async function cancel_set_buy(user, stock_symbol, amount) {
    // Complete
}

async function set_buy_trigger(user, stock_symbol, amount) {
    // Complete
}

module.exports = { buy,
    commit_buy, 
    cancel_buy, 
    set_buy_amount, 
    cancel_set_buy,
    set_buy_trigger
};