const quote_server = require("../quote-server/quote_server");
const utils = require("./utils");

let transaction = utils.initialize_transaction();

async function sell(user, stock_symbol, amount) {
    const quote = await quote_server.get_quote(stock_symbol, user);

    // Verify user has stocks owned 
    if ( !user.stocks[stock_symbol] ) {
        return({error: "No stocks owned"})
    }

    // Verify user have enough stocks to sell
    if (user.stocks[stock_symbol].value < amount) {
        return({error: "Insufficient stocks owned"})
    }

    const sell_qty = amount/quote.Quoteprice;

    transaction.type = "SELL";
    transaction.sym = stock_symbol;
    transaction.qty = sell_qty;
    transaction.amount = amount;
    transaction.sell_time = Date.now();

    return ({success: "Please confirm or cancel the transaction" });
}

async function commit_sell(user) {
    // Check if there is a transaction pending
    if (transaction.type == 'SELL' && (Date.now() - transaction.sell_time <= (60 * 1000))) {

        utils.update_balance(user, transaction); // Update user balance
        utils.update_stock(user, transaction); // Update stock owned
        
        transaction = utils.initialize_transaction(); // resets transaction

        return({success: "Transaction was successful"})
    }    

    return({error: "No sell transaction initiated within 60 seconds"})
}

async function cancel_sell(user) {
    if (transaction.type == 'SELL' && (Date.now() - transaction.sell_time <= (60 * 1000))) {
        transaction = utils.initialize_transaction(); // resets transaction
        return({success: "Transaction canceled"})
    }
    
    return ({error: "No sell transaction initiated within 60 seconds"})
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