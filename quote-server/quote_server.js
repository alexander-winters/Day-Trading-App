const crypto = require('crypto');
const base64url = require('base64url')
const guassian = require('gaussian')

async function get_quote(user, stock_symbol) {
    // Introduce a delay of 3 seconds using setTimeout
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Extract the first 3 characters of the symbol
    let sym = stock_symbol.substring(0,3);

    // Generate a random value from a Gaussian distribution
    const mu = 0; // mean
    const sigma = 1; // standard deviation
    const distribution = guassian(mu, sigma);
    const gauss_val = distribution.ppf(Math.random());

    // Calculate a base value for the quote based on the symbol
    let base_p = 0;
    for (let i = 0; i < sym.length; i++) base_p = base_p + sym.charCodeAt(0);
    base_p = ((base_p % 250) + (base_p * 0.03)).toFixed(2);;
    base_p = parseFloat(base_p);

    // If the base value is 0, set it to 49.49
    if (base_p == 0) base_p = 49.49;

    // Calculate the increment for the quote based on the base value
    let base_inc = base_p * 0.35;

    // Calculate the final price of the quote based on the base value, increment, and sine value
    let p = (base_p + (base_inc * gauss_val)).toFixed(2);
    p = parseFloat(p);

    // If the final price is less than 0, set it to 0.01
    if (p < 0) p = 0.01;

    // Construct and return the quote object
    let quote_obj = {
        "quote_price": p,
        "stock_symbol": sym,
        "username": user,
        "timestamp": new Date().getTime(),
        "cryptokey": base64url(crypto.randomBytes(20))
    }
    
    // Return the quote object
    return quote_obj;
}

module.exports = {get_quote}
