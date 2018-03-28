const CryptoMarketplace = artifacts.require("CryptoMarketplace");
const keccak256 = require('js-sha3').keccak256;
const expect = require('chai').expect;

const BigNumber = web3.BigNumber;

require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BigNumber))
    .should();

const crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

function encrypt(text) {
    let cipher = crypto.createCipher(algorithm, password)
    let crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    let decipher = crypto.createDecipher(algorithm, password)
    let dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}

contract('FundRaise', function ([owner, acc1, acc2, acc3, acc4, acc5, acc6, acc7, acc8, acc9]) {
    let cryptoMarketplace
    beforeEach('setup contract for each test', async function () {
        cryptoMarketplace = await CryptoMarketplace.new()
    });


    describe("test update func", async () => {
        describe("test with valid parameters", async () => {

            it("add one product and update it and check the product prop", async () => {
                const ID = encrypt("Domati:" + "1.00");
                await cryptoMarketplace.newProduct(ID, "Domati", web3.toWei('1', 'ether'), 2);
                let productsID = await cryptoMarketplace.getProducts.call();
                await cryptoMarketplace.update(productsID[0], 5);
                let product = await cryptoMarketplace.getProduct.call(productsID[0]);
                let expectArr = ["Domati", web3.toWei('1', 'ether'), "5"];
                expect(JSON.stringify(product)).to.be.equal(JSON.stringify(expectArr), "update func don't work correctly!")
            });

            it("add one product and update it twice and check the product prop", async () => {
                const ID = encrypt("Domati:" + "1.00");
                await cryptoMarketplace.newProduct(ID, "Domati", web3.toWei('1', 'ether'), 2);
                let productsID = await cryptoMarketplace.getProducts.call();
                await cryptoMarketplace.update(productsID[0], 5);
                await cryptoMarketplace.update(productsID[0], 3);
                let product = await cryptoMarketplace.getProduct.call(productsID[0]);
                let expectArr = ["Domati", web3.toWei('1', 'ether'), "3"];
                expect(JSON.stringify(product)).to.be.equal(JSON.stringify(expectArr), "update func don't work correctly!")
            });

            it("add one product and update it five times and check the product prop", async () => {
                const ID = encrypt("Domati:" + "1.00");
                await cryptoMarketplace.newProduct(ID, "Domati", web3.toWei('1', 'ether'), 2);
                let productsID = await cryptoMarketplace.getProducts.call();
                await cryptoMarketplace.update(productsID[0], 1);
                await cryptoMarketplace.update(productsID[0], 10);
                await cryptoMarketplace.update(productsID[0], 2);
                await cryptoMarketplace.update(productsID[0], 7);
                await cryptoMarketplace.update(productsID[0], 30);
                let product = await cryptoMarketplace.getProduct.call(productsID[0]);
                let expectArr = ["Domati", web3.toWei('1', 'ether'), "30"];
                expect(JSON.stringify(product)).to.be.equal(JSON.stringify(expectArr), "update func don't work correctly!")
            });

            it("add one product and try to update with zero quantity", async () => {
                const ID = encrypt("Kazan:" + "50.00");
                await cryptoMarketplace.newProduct(ID, "Kazan", web3.toWei('50', 'ether'), 1);
                let productsID = await cryptoMarketplace.getProducts.call();
                await cryptoMarketplace.update(productsID[0], 0);
                let product = await cryptoMarketplace.getProduct.call(productsID[0]);
                let expectArr = ["Kazan", web3.toWei('50', 'ether'), "0"];
                expect(JSON.stringify(product)).to.be.equal(JSON.stringify(expectArr), "update func don't work correctly!")
            })

            it("add two product and try to update the quantity on one of them", async () => {
                const ID1 = encrypt("Kazan:" + "50.00");
                const ID2 = encrypt("Purjola:" + "2.00");
                await cryptoMarketplace.newProduct(ID1, "Kazan", web3.toWei('50', 'ether'), 1);
                await cryptoMarketplace.newProduct(ID2, "Purjola", web3.toWei('2', 'ether'), 10);
                let productsID = await cryptoMarketplace.getProducts.call();
                await cryptoMarketplace.update(productsID[0], 5);
                let product1 = await cryptoMarketplace.getProduct.call(productsID[0]);
                let product2 = await cryptoMarketplace.getProduct.call(productsID[1]);
                let product = [product1, product2]
                let expectArr = [["Kazan", web3.toWei('50', 'ether'), "5"], ["Purjola", web3.toWei('2', 'ether'), "10"]];
                expect(JSON.stringify(product)).to.be.equal(JSON.stringify(expectArr), "update func don't work correctly!")
            })

            it("add three products and update them many times and check the first product prop", async () => {
                const ID1 = encrypt("Domati:" + "2.00");
                const ID2 = encrypt("Krastavaci:" + "10.00");
                const ID3 = encrypt("Chushka:" + "4.00");
                await cryptoMarketplace.newProduct(ID1, "Domati", web3.toWei('2', 'ether'), 2);
                let productsID = await cryptoMarketplace.getProducts.call();
                let productID1 = productsID[0]

                await cryptoMarketplace.update(productID1, 1);
                await cryptoMarketplace.update(productID1, 10);
                await cryptoMarketplace.update(productID1, 2);

                await cryptoMarketplace.newProduct(ID2, "Krastavaci", web3.toWei('10', 'ether'), 3);
                productsID = await cryptoMarketplace.getProducts.call();
                let productID2 = productsID[1]

                await cryptoMarketplace.update(productID1, 50);
                await cryptoMarketplace.update(productID2, 1);
                await cryptoMarketplace.update(productID1, 25);
                await cryptoMarketplace.update(productID2, 11);
                await cryptoMarketplace.update(productID1, 24);

                await cryptoMarketplace.newProduct(ID3, "Chushka", web3.toWei('4', 'ether'), 8);
                productsID = await cryptoMarketplace.getProducts.call();
                let productID3 = productsID[2]

                await cryptoMarketplace.update(productID3, 500);
                await cryptoMarketplace.update(productID3, 3);
                await cryptoMarketplace.update(productID1, 8);
                await cryptoMarketplace.update(productID2, 16);
                await cryptoMarketplace.update(productID1, 10);

                let product1 = await cryptoMarketplace.getProduct.call(productID1);
                let product2 = await cryptoMarketplace.getProduct.call(productID2);
                let product3 = await cryptoMarketplace.getProduct.call(productID3);

                let product = [product1, product2, product3];

                let expectArr = [["Domati", web3.toWei('2', 'ether'), "10"], ["Krastavaci", web3.toWei('10', 'ether'), "16"], ["Chushka", web3.toWei('4', 'ether'), "3"]]
                expect(JSON.stringify(product)).to.be.equal(JSON.stringify(expectArr), "update func don't work correctly!");
            });

        });

        describe("test with invalid parameters", async () => {

            it("add one product and try to update with wrong ID", async () => {
                const ID = encrypt("TV:" + "499.00");
                await cryptoMarketplace.newProduct(ID, "TV", web3.toWei('499', 'ether'), 2);
                let wrongID = keccak256("TV", 499, 2);
                await cryptoMarketplace.update(wrongID, 5).should.be.rejectedWith("revert");
            });

            it("try to update it with the same quantity as before", async () => {
                const ID = encrypt("TV:" + "499.00");
                await cryptoMarketplace.newProduct(ID, "TV", web3.toWei('499', 'ether'), 2);
                let productsID = await cryptoMarketplace.getProducts.call();
                await cryptoMarketplace.update(productsID[0], 2).should.be.rejectedWith("revert");
            });

            it("try to update from not owner acc1", async () => {
                const ID = encrypt("TV:" + "499.00");
                await cryptoMarketplace.newProduct(ID, "TV", 499, 2);
                let productsID = await cryptoMarketplace.getProducts.call();
                await cryptoMarketplace.update(productsID[0], 4, { from: acc1 }).should.be.rejectedWith("revert");
            });
        });
    });

});