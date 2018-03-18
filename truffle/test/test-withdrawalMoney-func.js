const CryptoMarketplace = artifacts.require("CryptoMarketplace");
const keccak256 = require('js-sha3').keccak256;
const expect = require('chai').expect;
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

contract('FundRaise', function ([owner, acc1, acc2, acc3, acc4, acc5, acc6, acc7, acc8, acc9]) {
    let cryptoMarketplace
    beforeEach('setup contract for each test', async function () {
        cryptoMarketplace = await CryptoMarketplace.new()
    });

    describe("test withdrawalMoney func", async () => {
        it("add and buy product and withdrawal the money", async () => {
            let productID1 = await cryptoMarketplace.newProduct("Kakao", 2, 10);
            let balanceBefore = await web3.eth.getBalance(owner)
            await cryptoMarketplace.buy(productID1, 2, {from: owner, value: web3.toWei(4, "ether")});
            await cryptoMarketplace.withdrawalMoney()
            let balanceAfter = await web3.eth.getBalance(owner)
            balanceAfter = web3.fromWei(balanceAfter, "ether");
            balanceBefore = web3.fromWei(balanceBefore, "ether");
            expect(balanceAfter).to.be.equal(balanceBefore)
        })

        it("add and buy product and withdrawal the money", async () => {
            let productID1 = await cryptoMarketplace.newProduct("Kakao", 2, 10);
            let productID2 = await cryptoMarketplace.newProduct("Prah", 1, 30);
            let balanceBefore = await web3.eth.getBalance(owner)
            await cryptoMarketplace.buy(productID1, 2, {from: acc1, value: web3.toWei(4, "ether")});
            await cryptoMarketplace.buy(productID1, 2, {from: acc2, value: web3.toWei(4, "ether")});
            await cryptoMarketplace.buy(productID1, 2, {from: acc3, value: web3.toWei(4, "ether")});
            await cryptoMarketplace.buy(productID2, 1, {from: acc4, value: web3.toWei(1, "ether")});
            await cryptoMarketplace.buy(productID2, 1, {from: acc5, value: web3.toWei(1, "ether")});
            await cryptoMarketplace.buy(productID2, 1, {from: acc6, value: web3.toWei(1, "ether")});
            await cryptoMarketplace.withdrawalMoney()
            let balanceAfter = await web3.eth.getBalance(owner)
            balanceAfter = web3.fromWei(balanceAfter, "ether");
            balanceBefore = web3.fromWei(balanceBefore, "ether");
            expect(balanceAfter - balanceBefore).to.be.above(15);
        })

        it("try to withdrawal the money with zero balance", async () => {
            expect(await cryptoMarketplace.withdrawalMoney()).to.throw();
        })

        it("try to withdrawal the money from not owner address", async () => {
            let productID1 = await cryptoMarketplace.newProduct("Kakao", 2, 10);
            await cryptoMarketplace.buy(productID1, 2, {from: owner, value: web3.toWei(4, "ether")});
            expect(await cryptoMarketplace.withdrawalMoney({from: acc4})).to.throw();
        })
    })
    
})