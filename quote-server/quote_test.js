const { get_quote } = require('./quote_server.js');

const quote = get_quote('ABC', 'John');
quote.then((response) => {
    console.log(response)
}).catch((error) => {
    console.error(error)
});