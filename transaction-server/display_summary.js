// const Transaction = require('../server/db/models/transaction');
// const Buy = require('../server/db/models/buy');
// const Sell = require('../server/db/models/sell');

// const connectDB = require('../server/db/conn');

// connectDB();

const txn = [{
      _id: "6427e16f12ca7609cb2036d0",
      user_request: {
         type: 'COMMIT_BUY',
         user: 'oY01WVirLr',
         stock_symbol: 'S',
         amount: 749.86
      }
   },
   {
      _id: "6427e16f12ca7609cb2036de",
      user_request: {
         type: 'SELL',
         user: 'oY01WVirLr',
         stock_symbol: 'S',
         amount: 664.1
      }
    }
];

const buy_triggers = [{
      _id: "6427e16f12ca7609cb2036de",
      buy_triggers: {
         stock_symbol: 'S',
         amount: 664.1,
         quantity: 10,
         buy_price: 20
      }
   }
];

const sell_triggers = [{
   _id: "6427e16f12ca7609cb2036de",
   sell_triggers: {
      stock_symbol: 'S',
      amount: 664.1,
      quantity: 10,
      sell_price: 20
   }
   }
];

function display_summary(user) {
   // const transactions = await Transaction.find({username:user}, 'user_request');
   // const user_acc = await User.findOne({username:user});
   // const sell_triggers = await Sell.findOne({username:user}, 'sell_triggers');
   // const buy_triggers = await Buy.findOne({username:user}, 'buy_triggers');
   
   // Add new line
   document.body.appendChild(document.createElement('br'));
   document.body.appendChild(document.createElement('br'));

   document.body.appendChild(document.createTextNode('Transactions'));
   generate_table('transactions', txn);

   // Add new line
   document.body.appendChild(document.createElement('br'));

   document.body.appendChild(document.createTextNode('sell_triggers'));
   generate_table('sell_triggers', sell_triggers);

   // Add new line
   document.body.appendChild(document.createElement('br'));

   document.body.appendChild(document.createTextNode('buy_triggers'));
   generate_table('buy_triggers', buy_triggers);
}

function generate_table(data_type, data) {
   const table = document.createElement("table");
   const tbody = document.createElement("tbody");
 
   for (let i = 0; i < data.length; i++) {
      const row = document.createElement("tr"); 

      const cell1 = document.createElement("td");
      const cell2 = document.createElement("td");
      const cell3 = document.createElement("td");
      const cell4 = document.createElement("td");

      if ( data_type === 'transactions' ) {
         const {user, type, stock_symbol, amount} = data[i].user_request;
         cell1.appendChild(document.createTextNode(user));
         cell2.appendChild(document.createTextNode(type));
         cell3.appendChild(document.createTextNode(stock_symbol));
         cell4.appendChild(document.createTextNode(amount));

      } else if( data_type === 'sell_triggers' ) {
         const {stock_symbol, amount, quantity, sell_price} = data[i].sell_triggers;
         cell1.appendChild(document.createTextNode(stock_symbol));
         cell2.appendChild(document.createTextNode(amount));
         cell3.appendChild(document.createTextNode(quantity));
         cell4.appendChild(document.createTextNode(sell_price));

      } else if( data_type === 'buy_triggers' ){
         const {stock_symbol, amount, quantity, buy_price} = data[i].buy_triggers;
         cell1.appendChild(document.createTextNode(stock_symbol));
         cell2.appendChild(document.createTextNode(amount));
         cell3.appendChild(document.createTextNode(quantity));
         cell4.appendChild(document.createTextNode(buy_price));
      }

      row.appendChild(cell1);
      row.appendChild(cell2);
      row.appendChild(cell3);
      row.appendChild(cell4);

      tbody.appendChild(row);
   }
 
   table.appendChild(tbody);
   document.body.appendChild(table);
   table.setAttribute("border", "1");
}
