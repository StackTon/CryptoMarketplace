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

    describe("test buy func", async () => {
        
        describe("test with valid parameters", async () => {

            it("try to buy a product", async () => {
                await cryptoMarketplace.newProduct("Domati", web3.toWei('1', 'ether'), 2);
                let productIDs = await cryptoMarketplace.getProducts.call();

                await cryptoMarketplace.buy(productIDs[0], 1, { from: owner, value: web3.toWei(1, "ether") });

                let product = await cryptoMarketplace.getProduct.call(productIDs[0]);
                product[1] = product[1].toString();
                product[2] = product[2].toString();

                let expectArr = ["Domati", web3.toWei('1', 'ether').toString(), "1"]

                expect(product).to.have.all.members(expectArr, "quantity after buy should be 1 insted it's " + product[2]);
            })

            it("try to buy two times a product", async () => {
                await cryptoMarketplace.newProduct("Domati", web3.toWei('2', 'ether'), 4);

                let productIDs = await cryptoMarketplace.getProducts.call();

                await cryptoMarketplace.buy(productIDs[0], 2, { from: owner, value: web3.toWei(4, "ether") });
                await cryptoMarketplace.buy(productIDs[0], 1, { from: owner, value: web3.toWei(2, "ether") });
                let product = await cryptoMarketplace.getProduct.call(productIDs[0]);

                product[1] = product[1].toString();
                product[2] = product[2].toString();

                let expectArr = ["Domati", web3.toWei('2', 'ether').toString(), "1"]
                expect(product).to.have.all.members(expectArr, `expect result to be ${JSON.stringify(expectArr)} instead it's ${JSON.stringify(product)}`);
            })

            it("try to buy five times a product", async () => {
                await cryptoMarketplace.newProduct("Domati", web3.toWei('1', 'ether'), 12);

                let productIDs = await cryptoMarketplace.getProducts.call();

                await cryptoMarketplace.buy(productIDs[0], 5, { from: acc1, value: web3.toWei(10, "ether") });
                await cryptoMarketplace.buy(productIDs[0], 1, { from: acc2, value: web3.toWei(1.5, "ether") });
                await cryptoMarketplace.buy(productIDs[0], 2, { from: acc3, value: web3.toWei(5, "ether") });
                await cryptoMarketplace.buy(productIDs[0], 3, { from: acc4, value: web3.toWei(3.1, "ether") });
                await cryptoMarketplace.buy(productIDs[0], 1, { from: acc5, value: web3.toWei(1, "ether") });

                let product = await cryptoMarketplace.getProduct.call(productIDs[0]);

                product[1] = product[1].toString();
                product[2] = product[2].toString();

                let expectArr = ["Domati", web3.toWei('1', 'ether').toString(), "0"]

                expect(product).to.have.all.members(expectArr, `expect result to be ${JSON.stringify(expectArr)} instead it's ${JSON.stringify(product)}`);
            })

            it("try to buy a product with more money then needed", async () => {
                let productID = await cryptoMarketplace.newProduct("Domati", web3.toWei('1', 'ether'), 2);

                let productIDs = await cryptoMarketplace.getProducts.call();

                await cryptoMarketplace.buy(productIDs[0], 1, { from: owner, value: web3.toWei('3', "ether") });
                let product = await cryptoMarketplace.getProduct.call(productIDs[0]);

                product[1] = product[1].toString();
                product[2] = product[2].toString();

                let expectArr = ["Domati", web3.toWei('1', 'ether').toString(), "1"];
                expect(product).to.have.all.members(expectArr, `expect result to be ${JSON.stringify(expectArr)} instead it's ${JSON.stringify(product)}`);
            })

            it("try to add and buy multiply products and check all", async () => {
                await cryptoMarketplace.newProduct("Bob", web3.toWei('2', 'ether'), 10);
                let products = await cryptoMarketplace.getProducts.call();
                let productID1 = products[0];
                await cryptoMarketplace.buy(productID1, 3, { from: acc8, value: web3.toWei(6, "ether") });
                await cryptoMarketplace.buy(productID1, 1, { from: acc2, value: web3.toWei(2, "ether") });
                await cryptoMarketplace.buy(productID1, 1, { from: acc3, value: web3.toWei(2, "ether") });
                await cryptoMarketplace.newProduct("Rakiq", web3.toWei('2', 'ether'), 1);
                products = await cryptoMarketplace.getProducts.call();
                let productID2 = products[1];

                await cryptoMarketplace.buy(productID2, 1, { from: acc6, value: web3.toWei(2, "ether") });
                await cryptoMarketplace.newProduct("Piper", web3.toWei('1', 'ether'), 2);
                products = await cryptoMarketplace.getProducts.call();
                let productID3 = products[2];

                await cryptoMarketplace.buy(productID3, 1, { from: owner, value: web3.toWei(2, "ether") });
                await cryptoMarketplace.buy(productID1, 1, { from: acc1, value: web3.toWei(2, "ether") });

                let product1 = await cryptoMarketplace.getProduct(productID1);
                let product2 = await cryptoMarketplace.getProduct(productID2);
                let product3 = await cryptoMarketplace.getProduct(productID3);

                let productsArr = [product1, product2, product3];

                let expectArr = [["Bob", web3.toWei(2, "ether").toString(), "4"], ["Rakiq", web3.toWei(2, "ether").toString(), "0"], ["Piper", web3.toWei(1, "ether").toString(), "1"]];

                expect(JSON.stringify(productsArr)).to.be.equal(JSON.stringify(expectArr), `expect result to be ${JSON.stringify(expectArr)} instead it's ${JSON.stringify(productsArr)}`);
            })

            it("try to buy a product with exaclity quantity there are", async () => {
                await cryptoMarketplace.newProduct("Domati", web3.toWei('2', 'ether'), 4);

                let productIDs = await cryptoMarketplace.getProducts.call();

                await cryptoMarketplace.buy(productIDs[0], 4, { from: acc4, value: web3.toWei(8, "ether") });
                let product = await cryptoMarketplace.getProduct.call(productIDs[0]);

                product[1] = product[1].toString();
                product[2] = product[2].toString();

                let expectArr = ["Domati", web3.toWei('2', 'ether').toString(), "0"]
                expect(product).to.have.all.members(expectArr, `expect result to be ${JSON.stringify(expectArr)} instead it's ${JSON.stringify(product)}`);
            })

            it("check balance after buy", async () => {
                await cryptoMarketplace.newProduct("Domati",  web3.toWei('1', 'ether'), 2);
                let balanceBefore = web3.eth.getBalance(acc9);
                
                let productsIDs =  await cryptoMarketplace.getProducts.call();
                await cryptoMarketplace.buy(productsIDs[0], 1, {from: acc9, value: web3.toWei(1, "ether")});
                let balanceAfter = web3.eth.getBalance(acc9);

                balanceBefore.should.be.bignumber.above(balanceAfter.add(web3.toWei(0.999, "ether")));
            })

            it("check balance after buy with over price", async () => {
                await cryptoMarketplace.newProduct("Domati",  web3.toWei('1', 'ether'), 2);
                let balanceBefore = web3.eth.getBalance(acc9);
                
                let productsIDs =  await cryptoMarketplace.getProducts.call();
                await cryptoMarketplace.buy(productsIDs[0], 1, {from: acc9, value: web3.toWei(5, "ether")});
                let balanceAfter = web3.eth.getBalance(acc9);

                balanceBefore.should.be.bignumber.above(balanceAfter.add(web3.toWei(4.999, "ether")));
            })
        })
        
        
        describe("test with invalid parameters", async () => {
            it("try to buy zero products", async () => {
                await cryptoMarketplace.newProduct("Bob", web3.toWei('2', 'ether'), 10);
                let productIDs = await cryptoMarketplace.getProducts.call();
                await cryptoMarketplace.buy(productIDs[0], 0, {from: owner, value: web3.toWei(1, "ether")}).should.be.rejectedWith("revert");
            })

    
            it("try to buy more then currnet quantity", async () => {
                await cryptoMarketplace.newProduct("Bob", web3.toWei('1', 'ether'), 3);
                let productIDs = await cryptoMarketplace.getProducts.call();
                await cryptoMarketplace.buy(productIDs[0], 5, {from: acc8, value: web3.toWei(11, "ether")}).should.be.rejectedWith("revert");
            })

            it("try to buy products with less money", async () => {
                await cryptoMarketplace.newProduct("Bob", web3.toWei('1', 'ether'), 3);
                let productIDs = await cryptoMarketplace.getProducts.call();
                await cryptoMarketplace.buy(productIDs[0], 2, {from: owner, value: web3.toWei(1, "ether")}).should.be.rejectedWith("revert");
            })

            it("try to buy with wrong id", async () => {
                await cryptoMarketplace.newProduct("Bob", 2, 10);
                await cryptoMarketplace.buy(keccak256("Bob", 2, 10), 2, {from: owner, value: web3.toWei(4, "ether")}).should.be.rejectedWith("revert");
            })
        })
        
    })
})