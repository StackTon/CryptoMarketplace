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

    describe("test newProduct func", async () => {

        describe("test with one product", async () => {

            it("check if product id is add in productIDs", async () => {
                let productID = await cryptoMarketplace.newProduct("Domati", 2, 1);
                let productsIDs = await cryptoMarketplace.getProducts.call();
                expect(productsIDs.length).to.be.equal(1, "ProductsIDs is not empty");
            });

            it("check if ID is correct length", async () => {
                await cryptoMarketplace.newProduct("Purjoli", 2123, 1);
                let productIDs = await cryptoMarketplace.getProducts();
                expect(productIDs[0]).to.have.lengthOf(66, "Product ID is not correct");
            });

            it("check if the product is add in products mapping", async () => {
                await cryptoMarketplace.newProduct("Domati", 2, 1);
                let productsIDs = await cryptoMarketplace.getProducts.call();
                let result = await cryptoMarketplace.getProduct.call(productsIDs[0]);
                expect(result.length).to.be.equal(3, "getProduct func return wrong amount of arguments");
            });

            it("check if products mapping name is correct", async () => {
                await cryptoMarketplace.newProduct("Domati", 2, 1);
                let productsIDs = await cryptoMarketplace.getProducts.call();
                let result = await cryptoMarketplace.getProduct.call(productsIDs[0]);
                expect(result[0]).to.be.equal("Domati", "Name of the product is not saved correct in products mapping");
            });

            it("check if products mapping price is correct", async () => {
                await cryptoMarketplace.newProduct("Domati", 2, 1);
                let productsIDs = await cryptoMarketplace.getProducts.call();
                let result = await cryptoMarketplace.getProduct.call(productsIDs[0]);
                expect(result[1].toString()).to.be.equal("2", "Price of the product is not saved correct in products mapping")
            });

            it("check if products mapping quantity is correct", async () => {
                await cryptoMarketplace.newProduct("Domati", 2, 1);
                let productsIDs = await cryptoMarketplace.getProducts.call();
                let result = await cryptoMarketplace.getProduct.call(productsIDs[0]);
                expect(result[2].toString()).to.be.equal("1", "Quantity of the product is not saved correct in products mapping")
            });
        })

        describe("test with two or more products", async () => {

            it("add two products and check if their productIDs are different", async () => {
                await cryptoMarketplace.newProduct("Domati", 2, 1);
                await cryptoMarketplace.newProduct("Krastavici", 1, 5);
                let productsIDs = await cryptoMarketplace.getProducts.call();
                expect(productsIDs[0]).to.not.equal(productsIDs[1], "The hash function make products Id the same");
            });

            it("add two products and check if they are added to productsArray", async () => {
                await cryptoMarketplace.newProduct("Domati", 2, 1);
                await cryptoMarketplace.newProduct("Krastavici", 1, 5);
                let productsIDs = await cryptoMarketplace.getProducts.call();
                expect(productsIDs.length).to.be.equal(2, "Products id array have incorenct amount of ids");
            });

            it("add two products and check if first product id is good", async () => {
                await cryptoMarketplace.newProduct("Domati", 2, 1);
                await cryptoMarketplace.newProduct("Krastavici", 1, 5);
                let productsIDs = await cryptoMarketplace.getProducts.call();
                let product = await cryptoMarketplace.getProduct.call(productsIDs[0]);
                product[1] = product[1].toString();
                product[2] = product[2].toString();
                let expectArr = ["Domati", "2", "1"];
                expect(product).to.have.all.members(expectArr, "getProduct func return wrong amount or arguments");
            });

            it("add two products and check if second product id is good", async () => {
                await cryptoMarketplace.newProduct("Domati", 2, 1);
                await cryptoMarketplace.newProduct("Krastavici", 1, 5);
                let productsIDs = await cryptoMarketplace.getProducts.call();
                let product2 = await cryptoMarketplace.getProduct.call(productsIDs[1]);
                product2[1] = product2[1].toString();
                product2[2] = product2[2].toString();
                let expectArr = ["Krastavici", "1", "5"]
                expect(product2).to.have.all.members(expectArr, "getProduct func return wrong amount or arguments");
            });

            it("add five products and check if productIDs returns correct amount", async () => {
                await cryptoMarketplace.newProduct("Domati", 2, 1);
                await cryptoMarketplace.newProduct("Krastavici", 1, 5);
                await cryptoMarketplace.newProduct("Purjoli", 20, 50);
                await cryptoMarketplace.newProduct("Piper", 1, 20);
                await cryptoMarketplace.newProduct("Chushka", 20, 1);

                let productsIDs = await cryptoMarketplace.getProducts.call();

                expect(productsIDs.length).to.be.equal(5, "productIDs returns wrong amount of arguments");
            });

            
            it("add five products and check if every thing is saved correct", async () => {
                await cryptoMarketplace.newProduct("Domati", 2, 1);
                await cryptoMarketplace.newProduct("Krastavici", 1, 5);
                await cryptoMarketplace.newProduct("Purjoli", 20, 50);
                await cryptoMarketplace.newProduct("Chushka", 20, 1);
                await cryptoMarketplace.newProduct("Piper", 1, 20);

                let productsIDs = await cryptoMarketplace.getProducts.call();

                let product1 = await cryptoMarketplace.getProduct.call(productsIDs[0]);
                let product2 = await cryptoMarketplace.getProduct.call(productsIDs[1]);
                let product3 = await cryptoMarketplace.getProduct.call(productsIDs[2]);
                let product4 = await cryptoMarketplace.getProduct.call(productsIDs[3]);
                let product5 = await cryptoMarketplace.getProduct.call(productsIDs[4]);

                let products = [product1, product2, product3, product4, product5];

                for (let i = 0; i < products.length; i++) {
                    for (let y = 0; y < products[i].length; y++) {
                        products[i][y] = products[i][y].toString();
                    }
                }

                let expectArr = [["Domati", "2", "1"], ["Krastavici", "1", "5"], ["Purjoli", "20", "50"], ["Chushka", "20", "1"], ["Piper", "1", "20"]];

                expect(products).to.deep.equal(expectArr, "Product are not saved correctly in the contract");
            });
        })
        
        describe("test with invalid parameters", async () => {

            it("check with empty name", async () => {
                await cryptoMarketplace.newProduct("", 5, 7).should.be.rejectedWith("revert");
            });

            it("check with number name", async () => {
                await cryptoMarketplace.newProduct(50, 5, 7).should.be.rejectedWith("revert");
            });

            it("check with empty price", async () => {
                await cryptoMarketplace.newProduct("Lutenica", "", 7).should.be.rejectedWith("revert");
            });

            it("check with empty quantity", async () => {
                await cryptoMarketplace.newProduct("Lutenica", 10, "").should.be.rejectedWith("revert");
            });

            it("check with zero price", async () => {
                await cryptoMarketplace.newProduct("Lutenica", 0, 10).should.be.rejectedWith("revert");
            });

            it("check with zero quantity", async () => {
                await cryptoMarketplace.newProduct("Lutenica", 5, 0).should.be.rejectedWith("revert");
            });

            it("try to add product form not owner acc - 1", async () => {
                await cryptoMarketplace.newProduct("Domata", 2, 2, {from: acc4}).should.be.rejectedWith("revert");
            });

            it("try to add product form not owner acc - 2", async () => {
                await cryptoMarketplace.newProduct("Turshiq", 1, 5, {from: acc7}).should.be.rejectedWith("revert");
            });
        });
    });
});