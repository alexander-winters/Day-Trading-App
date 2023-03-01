const crypto = require('crypto');
const base64url = require('base64url')
const guassian = require('gaussian')

function get_quote(sym_raw, user) {
    // Return a promise that resolves with the quote object after a delay of 3 seconds
    return new Promise(resolve => {
         // Introduce a delay of 3 seconds using setTimeout
        setTimeout(() => {
            // Extract the first 3 characters of the symbol
            let sym = sym_raw.substring(0,3);

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
                "Quoteprice": p,
                "SYM": sym,
                "username": user,
                "timestamp": new Date().getTime(),
                "cryptokey": base64url(crypto.randomBytes(20))
            }
            // Resolve the promise with the quote object
            resolve(quote_obj)
        }, 3000) // Delay for 3 seconds before executing the code inside setTimeout
    })
}

module.exports = {get_quote}
