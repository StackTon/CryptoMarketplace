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

    describe("test buy func", async () => {
        describe("test with valid parameters", async () => {
            it("try to buy a product", async () => {
                let productID = await cryptoMarketplace.newProduct("Domati", 1, 2);
                await cryptoMarketplace.buy(productID, 1, {from: owner, value:  web3.toWei(1, "ether")});
                let product = await cryptoMarketplace.getProduct.call(productID);
                expect(product[2]).to.be.equal(1, "quantity after buy should be 1 insted it's " + product[2]);
            })
    
            it("try to buy two times a product", async () => {
                let productID1 = await cryptoMarketplace.newProduct("Domati", 2, 4);
                await cryptoMarketplace.buy(productID1, 2, {from: owner, value: web3.toWei(4, "ether")});
                await cryptoMarketplace.buy(productID1, 1, {from: owner, value: web3.toWei(2, "ether")});
                let product = await cryptoMarketplace.getProduct.call(productID);
                let expectArr = ["Domati", 2, 1]
                expect(product).to.have.all.members(expectArr, `expect result to be ${JSON.stringify(expectArr)} instead it's ${JSON.stringify(product)}`);
            })
    
            it("try to buy five times a product", async () => {
                let productID1 = await cryptoMarketplace.newProduct("Domati", 2, 15);
                await cryptoMarketplace.buy(productID1, 1, {from: owner, value: web3.toWei(2, "ether")});
                await cryptoMarketplace.buy(productID1, 2, {from: owner, value: web3.toWei(4, "ether")});
                await cryptoMarketplace.buy(productID1, 5, {from: owner, value: web3.toWei(10, "ether")});
                await cryptoMarketplace.buy(productID1, 1, {from: owner, value: web3.toWei(2, "ether")});
                await cryptoMarketplace.buy(productID1, 3, {from: owner, value: web3.toWei(6, "ether")});
                let product = await cryptoMarketplace.getProduct.call(productID);
                let expectArr = ["Domati", 2, 2]
                expect(product).to.have.all.members(expectArr,`expect result to be ${JSON.stringify(expectArr)} instead it's ${JSON.stringify(product)}`);
            })
    
            it("try to buy a product with more money then needed", async () => {
                let productID = await cryptoMarketplace.newProduct("Domati", 1, 2);
                await cryptoMarketplace.buy(productID, 1, {from: owner, value: web3.toWei(3, "ether")});
                let product = await cryptoMarketplace.getProduct.call(productID);
                let expectArr = ["Domati", 1, 1]
                expect(product).to.have.all.members(expectArr, `expect result to be ${JSON.stringify(expectArr)} instead it's ${JSON.stringify(product)}`);
            })
    
            it("try to add and buy multiply products and check first", async () => {
                let productID1 = await cryptoMarketplace.newProduct("Bob", 2, 10);
                await cryptoMarketplace.buy(productID1, 3, {from: owner, value: web3.toWei(6, "ether")});
                await cryptoMarketplace.buy(productID1, 1, {from: owner, value: web3.toWei(2, "ether")});
                await cryptoMarketplace.buy(productID1, 1, {from: owner, value: web3.toWei(2, "ether")});
                let productID2 = await cryptoMarketplace.newProduct("Rakiq", 10, 1);
                let productID3 = await cryptoMarketplace.newProduct("Piper", 1, 2);
                await cryptoMarketplace.buy(productID3, 1, {from: owner, value: web3.toWei(2, "ether")});
                await cryptoMarketplace.buy(productID2, 1, {from: owner, value: web3.toWei(10, "ether")});
                await cryptoMarketplace.buy(productID1, 1, {from: owner, value: web3.toWei(1, "ether")});
    
                let product = cryptoMarketplace.getProduct.call(productID1);
    
                let expectArr = ["Bob", 2, 4]; 
                
                expect(product).to.have.all.members(expectArr, `expect result to be ${JSON.stringify(expectArr)} instead it's ${JSON.stringify(product)}`);
            })
    
            it("try to add and buy multiply products and check second", async () => {
                let productID1 = await cryptoMarketplace.newProduct("Bob", 2, 10);
                await cryptoMarketplace.buy(productID1, 3, {from: owner, value: web3.toWei(6, "ether")});
                await cryptoMarketplace.buy(productID1, 1, {from: owner, value: web3.toWei(2, "ether")});
                await cryptoMarketplace.buy(productID1, 1, {from: owner, value: web3.toWei(2, "ether")});
                let productID2 = await cryptoMarketplace.newProduct("Rakiq", 10, 1);
                let productID3 = await cryptoMarketplace.newProduct("Piper", 1, 2);
                await cryptoMarketplace.buy(productID3, 1, {from: owner, value: web3.toWei(2, "ether")});
                await cryptoMarketplace.buy(productID2, 1, {from: owner, value: web3.toWei(10, "ether")});
                await cryptoMarketplace.buy(productID1, 1, {from: owner, value: web3.toWei(1, "ether")});
    
                let product = cryptoMarketplace.getProduct.call(productID2);
    
                let expectArr = ["Rakiq", 10, 0]; 
                
                expect(product1).to.have.all.members(expectArr, `expect result to be ${JSON.stringify(expectArr)} instead it's ${JSON.stringify(product)}`);
            })
    
            it("try to add and buy multiply products and check third", async () => {
                let productID1 = await cryptoMarketplace.newProduct("Bob", 2, 10);
                await cryptoMarketplace.buy(productID1, 3, {from: owner, value: web3.toWei(6, "ether")});
                await cryptoMarketplace.buy(productID1, 1, {from: owner, value: web3.toWei(2, "ether")});
                await cryptoMarketplace.buy(productID1, 1, {from: owner, value: web3.toWei(2, "ether")});
                let productID2 = await cryptoMarketplace.newProduct("Rakiq", 10, 1);
                let productID3 = await cryptoMarketplace.newProduct("Piper", 1, 2);
                await cryptoMarketplace.buy(productID3, 1, {from: owner, value: web3.toWei(2, "ether")});
                await cryptoMarketplace.buy(productID2, 1, {from: owner, value: web3.toWei(10, "ether")});
                await cryptoMarketplace.buy(productID1, 1, {from: owner, value: web3.toWei(1, "ether")});
    
                let product = cryptoMarketplace.getProduct.call(productID3);
    
                let expectArr = ["Piper", 1, 1]; 
                
                expect(product1).to.have.all.members(expectArr, `expect result to be ${JSON.stringify(expectArr)} instead it's ${JSON.stringify(product)}`);
            })

            it("check balance after buy", async () => {
                let productID = await cryptoMarketplace.newProduct("Domati", 1, 2);
                let balanceBefore = await web3.eth.getBalance(owner)
                await cryptoMarketplace.buy(productID, 1, {from: acc9, value: web3.toWei(1, "ether")});
                let balanceAfter = await web3.eth.getBalance(owner)
                balanceAfter = web3.fromWei(balanceAfter, "ether");
                balanceBefore = web3.fromWei(balanceBefore, "ether");
                expect(balanceAfter - balanceBefore).to.be.equal(1);
            })

            it("check balance after buy with over price", async () => {
                let productID = await cryptoMarketplace.newProduct("Domati", 1, 2);
                let balanceBefore = await web3.eth.getBalance(owner)
                await cryptoMarketplace.buy(productID, 1, {from: acc9, value: web3.toWei(5, "ether")});
                let balanceAfter = await web3.eth.getBalance(owner)
                balanceAfter = web3.fromWei(balanceAfter, "ether");
                balanceBefore = web3.fromWei(balanceBefore, "ether");
                expect(balanceAfter - balanceBefore).to.be.equal(5);
            })
        })
        
        describe("test with invalid parameters", async () => {
            it("try to buy zero products", async () => {
                let productID1 = await cryptoMarketplace.newProduct("Bob", 2, 10);
                expect(await cryptoMarketplace.buy(productID1, 0, {from: owner, value: web3.toWei(1, "ether")})).to.throw();
            })
    
            it("try to buy zero products", async () => {
                let productID1 = await cryptoMarketplace.newProduct("Bob", 2, 10);
                expect(await cryptoMarketplace.buy(productID1, -5, {from: owner, value: web3.toWei(1, "ether")})).to.throw();
            })
    
            it("try to buy zero products", async () => {
                let productID1 = await cryptoMarketplace.newProduct("Bob", 2, 10);
                expect(await cryptoMarketplace.buy(productID1, 20, {from: owner, value: web3.toWei(40, "ether")})).to.throw();
            })
    
            it("try to buy zero products", async () => {
                let productID1 = await cryptoMarketplace.newProduct("Bob", 2, 10);
                expect(await cryptoMarketplace.buy(productID1, 54545545454545, {from: owner, value: web3.toWei(40, "ether")})).to.throw();
            })
    
            it("try to buy products with less money", async () => {
                let productID1 = await cryptoMarketplace.newProduct("Bob", 2, 10);
                expect(await cryptoMarketplace.buy(productID1, 2, {from: owner, value: web3.toWei(2, "ether"))).to.throw();
            })
    
            it("try to buy with wrong id", async () => {
                let productID1 = await cryptoMarketplace.newProduct("Bob", 2, 10);
                expect(await cryptoMarketplace.buy(keccak256("Bob", 2, 10), 2, {from: owner, value: web3.toWei(4, "ether")})).to.throw();
            })
    
            it("try to buy with quantity pesho", async () => {
                let productID1 = await cryptoMarketplace.newProduct("Bob", 2, 10);
                expect(await cryptoMarketplace.buy(productID1, "pehso", {from: owner, value: web3.toWei(2, "ether")})).to.throw();
            })
    
            it("try to buy with zero params ", async () => {
                expect(await cryptoMarketplace.buy()).to.throw();
            })
    
            it("try to buy with one param", async () => {
                let productID1 = await cryptoMarketplace.newProduct("Bob", 2, 10);
                expect(await cryptoMarketplace.buy(productID1, {from: owner, value: web3.toWei(2, "ether")})).to.throw();
            })
    
            it("try to buy with three params", async () => {
                let productID1 = await cryptoMarketplace.newProduct("Bob", 2, 10);
                expect(await cryptoMarketplace.buy(productID1, 1, 10, {from: owner, value:  web3.toWei(2, "erher")})).to.throw();
            })
        })
    })  
})