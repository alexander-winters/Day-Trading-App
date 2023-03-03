const { get_quote } = require("../quote-server/quote_server");

async function sell(user, stock_symbol, amount) {
    // Complete
}

async function commit_sell(user) {
    // Complete
}

async function cancel_sell(user) {
    // Complete
}

async function set_sell_amount(user, stock_symbol, amount) {
    // Complete
}

async function set_sell_trigger(user, stock_symbol, amount) {
    // Complete
}

async function cancel_set_sell(user, stock_symbol, amount) {
    // Complete
}

module.exports = { sell,
    commit_sell,
    cancel_sell,
    set_sell_amount,
    cancel_set_sell,
    set_sell_trigger
};