function update_balance(user, transaction) {
    if (transaction.type == "BUY") {
        user.balance -= transaction.amount;
    }
    else {
        user.balance += transaction.amount;
    }
}

function update_stock(user, transaction) {
    if (transaction.type == "BUY") {
        user.stocks[transaction.sym].value += transaction.amount;
        user.stocks[transaction.sym].qty += transaction.qty; 
    }
    else {
        user.stocks[transaction.sym].value -= transaction.amount; 
        user.stocks[transaction.sym].qty -= transaction.qty; 
    }
}

function initialize_transaction() {
    return {
        type: '',
        sym: '',
        qty: 0,
        amount:0,
        time: Date.now(),
    };
}

module.exports = {
    update_balance,
    update_stock,
    initialize_transaction,
}