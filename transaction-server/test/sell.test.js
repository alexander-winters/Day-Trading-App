const chai = require("chai");
const sinon = require("sinon");
const sell_transaction = require("../sell_transaction");
const quote_server = require("../../quote-server/quote_server");

chai.use(require('sinon-chai'));
const expect = chai.expect;

describe("Sell Transaction", function () {
    let user = {
        balance: 500,
        stocks: {
            APL: {
                value: 1000,
                qty: 100,
            }
        }
    };

    let quote_stub;

    beforeEach(function() {
        quote_stub = sinon.stub(quote_server, "get_quote").resolves({Quoteprice: 10});
    });

    afterEach(function() {
        sinon.restore();
    })

    describe("Sell command", function () {
        
        it("Initiates a sell transaction", async function () {
            let result = await sell_transaction.sell(user, 'APL', 500);
            expect(quote_stub).to.be.calledOnce;
            expect(!!result.success).to.be.true;
        });
        
        it("Returns error if there are no stocks owned", async function () {
            let result = await sell_transaction.sell(user, 'TSLA', 500);
            expect(quote_stub).to.be.calledOnce;
            expect(!!result.error).to.be.true;
        });

        it("Returns error if stocks owned are insufficient", async function () {
            let result = await sell_transaction.sell(user, 'APL', 2000);
            expect(quote_stub).to.be.calledOnce;
            expect(!!result.error).to.be.true;
        });
    });

    describe("Commit_Sell command", function () {
        it("Commits sell transaction", async function () {
            await sell_transaction.sell(user, 'APL', 500);
            await sell_transaction.commit_sell(user);
            
            expect(user.balance).to.equal(1000);
            expect(user.stocks.APL.value).to.equal(500);
            expect(user.stocks.APL.qty).to.equal(50);
        });
        
        it("Returns error if there are no sell transaction pending", async function () {
            let result = await sell_transaction.commit_sell(user);
            expect(!!result.error).to.be.true;
        });
    });

    describe("Cancel_Sell command", function () {
        it("Cancel sell transaction", async function () {
            await sell_transaction.sell(user, 'APL', 500);
            let result = await sell_transaction.cancel_sell(user);
            expect(!!result.success).to.be.true;
        });

        it("Returns error if there are no sell transaction pending", async function () {
            let result = await sell_transaction.cancel_sell(user);
            expect(!!result.error).to.be.true;
        });
    });

});