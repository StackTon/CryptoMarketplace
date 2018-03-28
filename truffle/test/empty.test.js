const CryptoMarketplace = artifacts.require("CryptoMarketplace");
const keccak256 = require('js-sha3').keccak256;
const expect = require('chai').expect;

const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('FundRaise', function ([owner, acc1, acc2, acc3, acc4, acc5, acc6, acc7, acc8, acc9]) {
    let cryptoMarketplace
    beforeEach('setup contract for each test', async function () {
        cryptoMarketplace = await CryptoMarketplace.new()
    });
    
    describe("test with zero products", async () => {
        it("check if productIDs is empty", async () => {
            let productsIDs = await cryptoMarketplace.getProducts.call();
            expect(productsIDs).to.be.empty;
        });

        it("check if products mapping is empty", async () => {
            await cryptoMarketplace.getProduct.call(keccak256("koko")).should.be.rejectedWith("revert");
        })
    })
})