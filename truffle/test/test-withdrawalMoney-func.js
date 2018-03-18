var CryptoMarketplace = artifacts.require("CryptoMarketplace");
const keccak256 = require('js-sha3').keccak256;
const expect = require('chai').expect;

contract('FundRaise', function ([owner, acc1, acc2, acc3, acc4, acc5, acc6, acc7, acc8, acc9]) {
    let cryptoMarketplace
    beforeEach('setup contract for each test', async function () {
        cryptoMarketplace = await CryptoMarketplace.new()
    });

    describe("test withdrawalMoney func", async () => {
        // TODO add and buy product and withdrawal the money
        // TODO add and buy product and withdrawal the money

        // TOOD and and buy a lot of products and then withdrawal the money



        // TODO try to withdrawal the money with zero balance

        // TODO try to withdrawal the money from not owner address
    })
    
})