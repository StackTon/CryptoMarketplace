var CryptoMarketplace = artifacts.require("CryptoMarketplace");
const keccak256 = require('js-sha3').keccak256;
const expect = require('chai').expect;

contract('FundRaise', function ([owner, acc1, acc2, acc3, acc4, acc5, acc6, acc7, acc8, acc9]) {
    let cryptoMarketplace
    beforeEach('setup contract for each test', async function () {
        cryptoMarketplace = await CryptoMarketplace.new()
    });

    describe("test newProduct func", async () => {

        describe("test with one product", async () => {
            it("check if return correct ID", async () => {
                let productID = await cryptoMarketplace.newProduct("Domati", 2, 1);
                let ID = keccak256("Domati" + 2 + 1);
                expect(productID).to.be.equal(ID, "Product ID is not correct");
            });

            it("check if product id is add in productIDs", async () => {
                let productID = await cryptoMarketplace.newProduct("Domati", 2, 1);
                let productsIDs = await cryptoMarketplace.getProducts.call();
                expect(productsIDs.length).to.be.equal(1, "ProductsIDs is not empty");
            });

            it("check if product id is add in productIDs", async () => {
                let productID = await cryptoMarketplace.newProduct("Domati", 2, 1);
                let ID = keccak256("Domati" + 2 + 1);
                let productsIDs = await cryptoMarketplace.getProducts.call();
                expect(productsIDs[0]).to.be.equal(ID, "ProductID is not saved correctly in productIDs");
            });

            it("check if the product is add in products mapping", async () => {
                let productID = await cryptoMarketplace.newProduct("Domati", 2, 1);
                let result = await cryptoMarketplace.getProduct.call(productID);
                expect(result.length).to.be.equal(3, "getProduct func return wrong amount of arguments");
            });

            it("check if products mapping name is correct", async () => {
                let productID = await cryptoMarketplace.newProduct("Domati", 2, 1);
                let result = await cryptoMarketplace.getProduct.call(productID);
                expect(result[0]).to.be.equal("Domati", "Name of the product is not saved correct in products mapping");
            });

            it("check if products mapping name is correct", async () => {
                let productID = await cryptoMarketplace.newProduct("Domati", 2, 1);
                let result = await cryptoMarketplace.getProduct.call(productID);
                expect(result[1]).to.be.equal(2, "Price of the product is not saved correct in products mapping")
            });

            it("check if products mapping name is correct", async () => {
                let productID = await cryptoMarketplace.newProduct("Domati", 2, 1);
                let result = await cryptoMarketplace.getProduct.call(productID);
                expect(result[2]).to.be.equal(2, "Quantity of the product is not saved correct in products mapping")
            });
        })

        describe("test with two or more products", async () => {

            it("add two products and check if productIDs ", async () => {
                let productID1 = await cryptoMarketplace.newProduct("Domati", 2, 1);
                let productID2 = await cryptoMarketplace.newProduct("Krastavici", 1, 5);
                expect(productID1).to.not.equal(productID2, "The hash function make products Id the same");
            });

            it("add two products and check if second product id is good", async () => {
                let productID1 = await cryptoMarketplace.newProduct("Domati", 2, 1);
                let productID2 = await cryptoMarketplace.newProduct("Krastavici", 1, 5);
                let ID2 = keccak256("Krastavici" + 1 + 5);
                expect(productID2).to.be.equal(ID2, "Hash of product id 2 is not correct");
            });

            it("add two products and check if second product id is good", async () => {
                let productID1 = await cryptoMarketplace.newProduct("Domati", 2, 1);
                let productID2 = await cryptoMarketplace.newProduct("Krastavici", 1, 5);
                let productsIDs = await cryptoMarketplace.getProducts.call();
                let myProductsIDs = [productID1, productID2];
                expect(productsIDs).to.have.all.members(myProductsIDs, "getProducts return wrong arguments");
            });

            it("add two products and check if second product id is good", async () => {
                let productID1 = await cryptoMarketplace.newProduct("Domati", 2, 1);
                let productID2 = await cryptoMarketplace.newProduct("Krastavici", 1, 5);
                let productsIDs = await cryptoMarketplace.getProducts.call();
                expect(productsIDs.length).to.be.equal(2, "Products id array have incorenct amount of ids");
            });

            it("add two products and check if second product id is good", async () => {
                let productID1 = await cryptoMarketplace.newProduct("Domati", 2, 1);
                let productID2 = await cryptoMarketplace.newProduct("Krastavici", 1, 5);
                let product2Call = await cryptoMarketplace.getProduct.call(productID2);
                expect(product2Call.length).to.be.equal(3, "getProduct func return wrong amount or arguments");
            });

            it("add two products and check if second product id is good", async () => {
                let productID1 = await cryptoMarketplace.newProduct("Domati", 2, 1);
                let productID2 = await cryptoMarketplace.newProduct("Krastavici", 1, 5);
                let product2Call = await cryptoMarketplace.getProduct.call(productID2);
                expect(product2Call[0]).to.be.equal("Krastavici", "products name is not saved correctly");
            });

            it("add two products and check if second product id is good", async () => {
                let productID1 = await cryptoMarketplace.newProduct("Domati", 2, 1);
                let productID2 = await cryptoMarketplace.newProduct("Krastavici", 1, 5);
                let product2Call = await cryptoMarketplace.getProduct.call(productID2);
                expect(product2Call[1]).to.be.equal(2, "products price is not saved correctly");
            });

            it("add two products and check if second product id is good", async () => {
                let productID1 = await cryptoMarketplace.newProduct("Domati", 2, 1);
                let productID2 = await cryptoMarketplace.newProduct("Krastavici", 1, 5);
                let product2Call = await cryptoMarketplace.getProduct.call(productID2);
                expect(product2Call[2]).to.be.equal(1, "products quantity is not saved correctly");
            });

            it("add five products and check if productIDs returns correct amount", async () => {
                let productID1 = await cryptoMarketplace.newProduct("Domati", 2, 1);
                let productID2 = await cryptoMarketplace.newProduct("Krastavici", 1, 5);
                let productID3 = await cryptoMarketplace.newProduct("Purjoli", 20, 50);
                let productID4 = await cryptoMarketplace.newProduct("Piper", 1, 20);
                let productID5 = await cryptoMarketplace.newProduct("Chushka", 20, 1);

                let productsIDs = await cryptoMarketplace.getProducts.call();

                expect(productsIDs.length).to.be.equal(5, "productIDs returns wrong amount of arguments");
            });

            it("add five products and check if productIDs are correct", async () => {
                let productID1 = await cryptoMarketplace.newProduct("Domati", 2, 1);
                let productID2 = await cryptoMarketplace.newProduct("Krastavici", 1, 5);
                let productID3 = await cryptoMarketplace.newProduct("Purjoli", 20, 50);
                let productID4 = await cryptoMarketplace.newProduct("Piper", 1, 20);
                let productID5 = await cryptoMarketplace.newProduct("Chushka", 20, 1);

                let productsIDs = await cryptoMarketplace.getProducts.call();

                let arrOfIDs = [productID1, productID2, productID3, productID4, productID5];

                expect(productsIDs).to.have.all.members(arrOfIDs, "productsID are not correcly saved");
            });

            it("add five products and check if productIDs returns correct (test with onw keccak)", async () => {
                let productID1 = await cryptoMarketplace.newProduct("Domati", 2, 1);
                let productID2 = await cryptoMarketplace.newProduct("Krastavici", 1, 5);
                let productID3 = await cryptoMarketplace.newProduct("Purjoli", 20, 50);
                let productID4 = await cryptoMarketplace.newProduct("Piper", 1, 20);
                let productID5 = await cryptoMarketplace.newProduct("Chushka", 20, 1);

                let ID1 = keccak256("Domati" + 2 + 1);
                let ID2 = keccak256("Krastavici" + 1 + 5);
                let ID3 = keccak256("Purjoli" + 20 + 50);
                let ID4 = keccak256("Piper" + 1 + 20);
                let ID5 = keccak256("Chushka" + 20 + 1);

                let productsIDs = await cryptoMarketplace.getProducts.call();

                let arrOfIDs = [ID1, ID2, ID3, ID4, ID5];

                expect(productsIDs).to.have.all.members(arrOfIDs, "productsID are not correcly saved");
            });

            it("add five products and check if the third product name is correct", async () => {
                let productID1 = await cryptoMarketplace.newProduct("Domati", 2, 1);
                let productID2 = await cryptoMarketplace.newProduct("Krastavici", 1, 5);
                let productID3 = await cryptoMarketplace.newProduct("Purjoli", 20, 50);
                let productID4 = await cryptoMarketplace.newProduct("Piper", 1, 20);
                let productID5 = await cryptoMarketplace.newProduct("Chushka", 20, 1);

                let productValues = await cryptoMarketplace.getProduct.call(productID3);

                expect(productValues[0]).to.be.equal("Purjoli", "The name of the third product is not correct");
            });

            it("add five products and check if the forth product price is correct", async () => {
                let productID1 = await cryptoMarketplace.newProduct("Domati", 2, 1);
                let productID2 = await cryptoMarketplace.newProduct("Krastavici", 1, 5);
                let productID3 = await cryptoMarketplace.newProduct("Purjoli", 20, 50);
                let productID4 = await cryptoMarketplace.newProduct("Piper", 14, 20);
                let productID5 = await cryptoMarketplace.newProduct("Chushka", 20, 1);

                let productValues = await cryptoMarketplace.getProduct.call(productID4);

                expect(productValues[1]).to.be.equal(14, "The price of the forth product is not correct");
            });

            it("add five products and check if the fifte product quantity is correct", async () => {
                let productID1 = await cryptoMarketplace.newProduct("Domati", 2, 1);
                let productID2 = await cryptoMarketplace.newProduct("Krastavici", 1, 5);
                let productID3 = await cryptoMarketplace.newProduct("Purjoli", 20, 50);
                let productID4 = await cryptoMarketplace.newProduct("Piper", 14, 20);
                let productID5 = await cryptoMarketplace.newProduct("Chushka", 20, 37);

                let productValues = await cryptoMarketplace.getProduct.call(productID5);

                expect(productValues[2]).to.be.equal(37, "The quantity of the fift product is not correct");
            });

        })

        describe("test with invalid parameters", async () => {

            it("check with empty name", async () => {
                expect(await cryptoMarketplace.newProduct("", 5, 7)).to.throw();
            });

            it("check with number name", async () => {
                expect(await cryptoMarketplace.newProduct(50, 5, 7)).to.throw();
            });

            it("check with empty price", async () => {
                expect(await cryptoMarketplace.newProduct("Lutenica", "", 7)).to.throw();
            });

            it("check with negative price", async () => {
                expect(await cryptoMarketplace.newProduct("Lutenica", -5, 7)).to.throw();
            });

            it("check with zero price", async () => {
                expect(await cryptoMarketplace.newProduct("Lutenica", 0, 7)).to.throw();
            });

            it("check with big price", async () => {
                expect(await cryptoMarketplace.newProduct("Lutenica", 556465455456444455665546655645645656564556456456455656565645656565656, 7)).to.throw();
            });

            it("check check with empty quantity", async () => {
                expect(await cryptoMarketplace.newProduct("Lutenica", 5, "")).to.throw();
            });

            it("check quantity with negative num", async () => {
                expect(await cryptoMarketplace.newProduct("Lutenica", 5, -5)).to.throw();
            });

            it("check check quantity with zero", async () => {
                expect(await cryptoMarketplace.newProduct("Lutenica", 5, 0)).to.throw();
            });

            it("check quantity with big num", async () => {
                expect(await cryptoMarketplace.newProduct("Lutenica", 5, 9999999999999999999999999999999999999999999999999999999999999999999999)).to.throw();
            });

            it("check with param only name", async () => {
                expect(await cryptoMarketplace.newProduct("Lutenica")).to.throw();
            });

            it("check with param only name", async () => {
                expect(await cryptoMarketplace.newProduct("Lutenica", 5)).to.throw();
            });

            it("check with four params", async () => {
                expect(await cryptoMarketplace.newProduct("Lutenica", 5, 6, "Oppps")).to.throw();
            });

            it("check with zero params", async () => {
                expect(await cryptoMarketplace.newProduct()).to.throw();
            });
        })

        // TODO try to add product form not owner acc
    })
})