const CryptoMarketplace = artifacts.require("CryptoMarketplace");
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

    describe("test withdrawalMoney func", async () => {
        it("add and buy product and withdrawal the money", async () => {
            await cryptoMarketplace.newProduct("Kakao", web3.toWei('1', 'ether'), 10);
            let productsID = await cryptoMarketplace.getProducts.call();
            let balanceBefore = web3.eth.getBalance(owner)
            await cryptoMarketplace.buy(productsID[0], 2, { from: acc5, value: web3.toWei(2, "ether") });
            await cryptoMarketplace.withdrawalMoney({ from: owner })
            let balanceAfter = web3.eth.getBalance(owner)
            balanceAfter.should.be.bignumber.above(balanceBefore.add(web3.toWei('1.99', 'ether')))
        })

        it("add and buy product and withdrawal the money", async () => {
            let productID1 = await cryptoMarketplace.newProduct("Kakao", 2, 10);
            let productID2 = await cryptoMarketplace.newProduct("Prah", 1, 30);
            let balanceBefore = web3.eth.getBalance(owner)
            let productsID = await cryptoMarketplace.getProducts.call();
            await cryptoMarketplace.buy(productsID[0], 2, { from: acc1, value: web3.toWei(4, "ether") });
            await cryptoMarketplace.buy(productsID[0], 2, { from: acc2, value: web3.toWei(4, "ether") });
            await cryptoMarketplace.buy(productsID[0], 2, { from: acc3, value: web3.toWei(4, "ether") });
            await cryptoMarketplace.buy(productsID[1], 1, { from: acc4, value: web3.toWei(1, "ether") });
            await cryptoMarketplace.buy(productsID[1], 1, { from: acc5, value: web3.toWei(1, "ether") });
            await cryptoMarketplace.buy(productsID[1], 1, { from: acc6, value: web3.toWei(1, "ether") });
            await cryptoMarketplace.withdrawalMoney({ from: owner })
            let balanceAfter = web3.eth.getBalance(owner)
            balanceAfter.should.be.bignumber.above(balanceBefore.add(web3.toWei('14.99', 'ether')))
        })

        it("try to withdrawal the money with zero balance", async () => {
            await cryptoMarketplace.withdrawalMoney().should.be.rejectedWith("revert");
        })

        it("try to withdrawal the money from not owner address", async () => {
            await cryptoMarketplace.newProduct("Kakao", 2, 10);
            let productsID = await cryptoMarketplace.getProducts.call();
            await cryptoMarketplace.buy(productsID[0], 2, { from: owner, value: web3.toWei(4, "ether") });
            await cryptoMarketplace.withdrawalMoney({ from: acc4 }).should.be.rejectedWith("revert");
        })
    })

})