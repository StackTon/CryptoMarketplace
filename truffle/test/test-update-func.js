const CryptoMarketplace = artifacts.require("CryptoMarketplace");
const keccak256 = require('js-sha3').keccak256;
const expect = require('chai').expect;

contract('FundRaise', function ([owner, acc1, acc2, acc3, acc4, acc5, acc6, acc7, acc8, acc9]) {
    let cryptoMarketplace
    beforeEach('setup contract for each test', async function () {
        cryptoMarketplace = await CryptoMarketplace.new()
    });

    describe("test update func", async () => {
        describe("test with valid parameters", async () => {
            it("add one product and update it and check the product prop", async () => {
                let productID = cryptoMarketplace.newProduct("Domati", 2, 2);
                await cryptoMarketplace.update(productID, 5);
                let product = await cryptoMarketplace.getProduct.call(productID);
                let expectArr = ["Domati", 2, 5];
                expect(product).to.have.all.members(expectArr, "update func don't work correctly!")
            });

            it("add one product and update it twice and check the product prop", async () => {
                let productID = cryptoMarketplace.newProduct("Domati", 2, 2);
                await cryptoMarketplace.update(productID, 5);
                await cryptoMarketplace.update(productID, 3);
                let product = await cryptoMarketplace.getProduct.call(productID);
                let expectArr = ["Domati", 2, 3];
                expect(product).to.have.all.members(expectArr, "update func don't work correctly!")
            });

            it("add one product and update it five times and check the product prop", async () => {
                let productID = cryptoMarketplace.newProduct("Domati", 2, 2);
                await cryptoMarketplace.update(productID, 1);
                await cryptoMarketplace.update(productID, 10);
                await cryptoMarketplace.update(productID, 2);
                await cryptoMarketplace.update(productID, 7);
                await cryptoMarketplace.update(productID, 30);
                let product = await cryptoMarketplace.getProduct.call(productID);
                let expectArr = ["Domati", 2, 30];
                expect(product).to.have.all.members(expectArr, "update func don't work correctly!")
            });

            it("add three products and update them many times and check the first product prop", async () => {
                let productID1 = cryptoMarketplace.newProduct("Domati", 2, 2);
                await cryptoMarketplace.update(productID1, 1);
                await cryptoMarketplace.update(productID1, 10);
                await cryptoMarketplace.update(productID1, 2);
                let productID2 = cryptoMarketplace.newProduct("Krastavaci", 10, 3);
                await cryptoMarketplace.update(productID1, 50);
                await cryptoMarketplace.update(productID2, 1);
                await cryptoMarketplace.update(productID1, 25);
                await cryptoMarketplace.update(productID2, 11);
                await cryptoMarketplace.update(productID1, 24);
                let productID3 = cryptoMarketplace.newProduct("Chushka", 2, 8);
                await cryptoMarketplace.update(productID3, 500);
                await cryptoMarketplace.update(productID3, 3);
                await cryptoMarketplace.update(productID1, 8);
                await cryptoMarketplace.update(productID2, 16);
                await cryptoMarketplace.update(productID1, 10);

                let product = await cryptoMarketplace.getProduct.call(productID1);
                let expectArr = ["Domati", 2, 10];
                expect(product).to.have.all.members(expectArr, "update func don't work correctly!")
            });

            it("add three products and update them many times and check the second product prop", async () => {
                let productID1 = cryptoMarketplace.newProduct("Domati", 2, 2);
                await cryptoMarketplace.update(productID1, 1);
                await cryptoMarketplace.update(productID1, 10);
                await cryptoMarketplace.update(productID1, 2);
                let productID2 = cryptoMarketplace.newProduct("Krastavaci", 10, 3);
                await cryptoMarketplace.update(productID1, 50);
                await cryptoMarketplace.update(productID2, 1);
                await cryptoMarketplace.update(productID1, 25);
                await cryptoMarketplace.update(productID2, 11);
                await cryptoMarketplace.update(productID1, 24);
                let productID3 = cryptoMarketplace.newProduct("Chushka", 2, 8);
                await cryptoMarketplace.update(productID3, 500);
                await cryptoMarketplace.update(productID3, 3);
                await cryptoMarketplace.update(productID1, 8);
                await cryptoMarketplace.update(productID2, 16);
                await cryptoMarketplace.update(productID1, 10);

                let product = await cryptoMarketplace.getProduct.call(productID2);
                let expectArr = ["Krastavaci", 10, 16];
                expect(product).to.have.all.members(expectArr, "update func don't work correctly!")
            });

            it("add three products and update them many times and check the third product prop", async () => {
                let productID1 = cryptoMarketplace.newProduct("Domati", 2, 2);
                await cryptoMarketplace.update(productID1, 1);
                await cryptoMarketplace.update(productID1, 10);
                await cryptoMarketplace.update(productID1, 2);
                let productID2 = cryptoMarketplace.newProduct("Krastavaci", 10, 3);
                await cryptoMarketplace.update(productID1, 50);
                await cryptoMarketplace.update(productID2, 1);
                await cryptoMarketplace.update(productID1, 25);
                await cryptoMarketplace.update(productID2, 11);
                await cryptoMarketplace.update(productID1, 24);
                let productID3 = cryptoMarketplace.newProduct("Chushka", 2, 8);
                await cryptoMarketplace.update(productID3, 500);
                await cryptoMarketplace.update(productID3, 3);
                await cryptoMarketplace.update(productID1, 8);
                await cryptoMarketplace.update(productID2, 16);
                await cryptoMarketplace.update(productID1, 10);

                let product = await cryptoMarketplace.getProduct.call(productID3);
                let expectArr = ["Chushka", 2, 3];
                expect(product).to.have.all.members(expectArr, "update func don't work correctly!")
            });

            it("add one product and try to update with zero quantity", async () => {
                let productID = await cryptoMarketplace.newProduct("Kazan", 50, 1);
                await cryptoMarketplace.update(productID, 0);
                let product = cryptoMarketplace.getProduct.call(productID);
                let expectArr = ["Kazan", 50, 0];
                expect(product).to.have.all.members(expectArr, "update func don't work correctly!")
            })

            it("add one product and try to update with zero quantity", async () => {
                let productID1 = await cryptoMarketplace.newProduct("Kazan", 50, 1);
                let productID2 = await cryptoMarketplace.newProduct("Purjola", 2, 10);
                await cryptoMarketplace.update(productID1, 5);
                let product = cryptoMarketplace.getProduct.call(productID1);
                let expectArr = ["Kazan", 50, 5];
                expect(product).to.have.all.members(expectArr, "update func don't work correctly!")
            })

            it("add one product and try to update with zero quantity", async () => {
                let productID1 = await cryptoMarketplace.newProduct("Kazan", 50, 1);
                let productID2 = await cryptoMarketplace.newProduct("Purjola", 2, 10);
                let productID3 = await cryptoMarketplace.newProduct("Qbulka", 1, 15);
                let productID4 = await cryptoMarketplace.newProduct("Pica", 13, 5);
                let productID5 = await cryptoMarketplace.newProduct("Bob", 20, 100);
                await cryptoMarketplace.update(productID3, 55);
                let product = cryptoMarketplace.getProduct.call(productID3);
                let expectArr = ["Qbulka", 1, 55];
                expect(product).to.have.all.members(expectArr, "update func don't work correctly!")
            })

            it("add one product and try to update with zero quantity", async () => {
                let productID1 = await cryptoMarketplace.newProduct("Kazan", 50, 1);
                let productID2 = await cryptoMarketplace.newProduct("Purjola", 2, 10);
                await cryptoMarketplace.update(productID1, 3);
                await cryptoMarketplace.update(productID2, 15);
                let product = cryptoMarketplace.getProduct.call(productID1);
                let expectArr = ["Kazan", 50, 3];
                expect(product).to.have.all.members(expectArr, "update func don't work correctly!")
            })

            it("add one product and try to update with zero quantity", async () => {
                let productID1 = await cryptoMarketplace.newProduct("Kazan", 50, 1);
                let productID2 = await cryptoMarketplace.newProduct("Purjola", 2, 10);
                await cryptoMarketplace.update(productID1, 3);
                await cryptoMarketplace.update(productID2, 15);
                let product = cryptoMarketplace.getProduct.call(productID2);
                let expectArr = ["Purjola", 2, 15];
                expect(product).to.have.all.members(expectArr, "update func don't work correctly!")
            })
        });

        describe("test with invalid parameters", async () => {
            it("add one product and try to update with wrong ID", async () => {
                let productID = await cryptoMarketplace.newProduct("TV", 499, 2);
                let wrongID = keccak256("TV", 499, 2);
                expect(await cryptoMarketplace.update(wrongID, 5)).to.throw();
            })
 
            it("add one product and try to update with 'pesho' quantity", async () => {
                let productID = await cryptoMarketplace.newProduct("TV", 499, 2);
                expect(await cryptoMarketplace.update(productID, "pesho")).to.throw();
            })

            it("add one product and try to update with one params", async () => {
                let productID = await cryptoMarketplace.newProduct("TV", 499, 2);
                expect(await cryptoMarketplace.update(productID)).to.throw();
            })

            it("try to update product without params", async () => {
                let productID = await cryptoMarketplace.newProduct("TV", 499, 2);
                expect(await cryptoMarketplace.update()).to.throw();
            })

            it("try to update product with big quantity", async () => {
                let productID = await cryptoMarketplace.newProduct("TV", 499, 2);
                expect(await cryptoMarketplace.update(productID, 34234234234342342342342342342342423423423423423423423423423423234)).to.throw();
            })

            it("try to update it with the same quantity as before", async () => {
                let productID = await cryptoMarketplace.newProduct("TV", 499, 2);
                expect(await cryptoMarketplace.update(productID, 2)).to.throw();
            })

            it("try to update from not owner acc1", async () => {
                let productID = await cryptoMarketplace.newProduct("TV", 499, 2);
                expect(await cryptoMarketplace.update(productID, 4, {from: acc1})).to.throw();
            })

            it("try to update from not owner acc3", async () => {
                let productID = await cryptoMarketplace.newProduct("TV", 499, 2);
                expect(await cryptoMarketplace.update(productID, 2, {from: acc3})).to.throw();
            })
        });
    });
});