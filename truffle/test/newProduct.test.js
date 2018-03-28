const CryptoMarketplace = artifacts.require("CryptoMarketplace");
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

    describe("test newProduct func", async () => {

        describe("test with one product", async () => {
 
            it("check if product id is add in productIDs", async () => {
                const ID = encrypt("Domati:" + "2.00");
                await cryptoMarketplace.newProduct(ID, "Domati", 2, 1);
                let productsIDs = await cryptoMarketplace.getProducts.call();
                expect(productsIDs.length).to.be.equal(1, "ProductsIDs is not empty");
            });

            it("check if ID is correct length", async () => {
                const ID = encrypt("Purjoli:" + "2123");
                await cryptoMarketplace.newProduct(ID, "Purjoli", 2123, 1);
                let productIDs = await cryptoMarketplace.getProducts();
                expect(productIDs[0]).to.have.lengthOf(66, "Product ID is not correct");
            });

            it("check if the product is add in products mapping", async () => {
                const ID = encrypt("Domati:" + "2.00");
                await cryptoMarketplace.newProduct(ID, "Domati", 2, 1);
                let productsIDs = await cryptoMarketplace.getProducts.call();
                let result = await cryptoMarketplace.getProduct.call(productsIDs[0]);
                expect(result.length).to.be.equal(3, "getProduct func return wrong amount of arguments");
            });

            it("check if products mapping name is correct", async () => {
                const ID = encrypt("Domati:" + "2.00");
                await cryptoMarketplace.newProduct(ID, "Domati", 2, 1);
                let productsIDs = await cryptoMarketplace.getProducts.call();
                let result = await cryptoMarketplace.getProduct.call(productsIDs[0]);
                expect(result[0]).to.be.equal("Domati", "Name of the product is not saved correct in products mapping");
            });

            it("check if products mapping price is correct", async () => {
                const ID = encrypt("Domati:" + "2.00");
                await cryptoMarketplace.newProduct(ID, "Domati", 2, 1);
                let productsIDs = await cryptoMarketplace.getProducts.call();
                let result = await cryptoMarketplace.getProduct.call(productsIDs[0]);
                expect(result[1].toString()).to.be.equal("2", "Price of the product is not saved correct in products mapping")
            });

            it("check if products mapping quantity is correct", async () => {
                const ID = encrypt("Domati:" + "2.00");
                await cryptoMarketplace.newProduct(ID, "Domati", 2, 1);
                let productsIDs = await cryptoMarketplace.getProducts.call();
                let result = await cryptoMarketplace.getProduct.call(productsIDs[0]);
                expect(result[2].toString()).to.be.equal("1", "Quantity of the product is not saved correct in products mapping")
            });
            
            it("test if id is equal to made before id", async () => {
                const ID = encrypt("Domati:" + "2.00");
                await cryptoMarketplace.newProduct(ID, "Domati", 2, 1);
                let productsIDs = await cryptoMarketplace.getProducts.call();

                let IDfromContract = web3.toAscii(productsIDs[0]).trim();

                IDfromContract = IDfromContract.split("").filter(e => e != " ").filter(e => e != "\u0000");

                expect(ID).to.be.equal(IDfromContract.join(""), "Products ID is not correct");
            })

            it("test if id from bytes to string and decrypt is correct", async () => {
                const ID = encrypt("Domati:" + "2.00");
                await cryptoMarketplace.newProduct(ID, "Domati", 2, 1);
                let productsIDs = await cryptoMarketplace.getProducts.call();

                let productID = web3.toAscii(productsIDs[0]);

                let decryptID = decrypt(productID).trim()

                expect(decryptID).to.be.equal("Domati:2.00", "Decrypt algoritom is not correct")
            })
            
        })
        
        describe("test with two or more products", async () => {

            it("add two products and check if their productIDs are different", async () => {
                const ID1 = encrypt("Domati:" + "2.00");
                const ID2 = encrypt("Krastavici:" + "1.00");
                await cryptoMarketplace.newProduct(ID1, "Domati", 2, 1);
                await cryptoMarketplace.newProduct(ID2, "Krastavici", 1, 5);
                let productsIDs = await cryptoMarketplace.getProducts.call();
                expect(productsIDs[0]).to.not.equal(productsIDs[1], "The hash function make products Id the same");
            });

            it("add two products and check if they are added to productsArray", async () => {
                const ID1 = encrypt("Domati:" + "2.00");
                const ID2 = encrypt("Krastavici:" + "1.00");
                await cryptoMarketplace.newProduct(ID1, "Domati", 2, 1);
                await cryptoMarketplace.newProduct(ID2, "Krastavici", 1, 5);
                let productsIDs = await cryptoMarketplace.getProducts.call();
                expect(productsIDs.length).to.be.equal(2, "Products id array have incorenct amount of ids");
            });

            it("add two products and check if first product id is good", async () => {
                const ID1 = encrypt("Domati:" + "2.00");
                const ID2 = encrypt("Krastavici:" + "1.00");
                await cryptoMarketplace.newProduct(ID1, "Domati", 2, 1);
                await cryptoMarketplace.newProduct(ID2, "Krastavici", 1, 5);
                let productsIDs = await cryptoMarketplace.getProducts.call();
                let product = await cryptoMarketplace.getProduct.call(productsIDs[0]);
                product[1] = product[1].toString();
                product[2] = product[2].toString();
                let expectArr = ["Domati", "2", "1"];
                expect(product).to.have.all.members(expectArr, "getProduct func return wrong amount or arguments");
            });

            it("add two products and check if second product id is good", async () => {
                const ID1 = encrypt("Domati:" + "2.00");
                const ID2 = encrypt("Krastavici:" + "1.00");
                await cryptoMarketplace.newProduct(ID1, "Domati", 2, 1);
                await cryptoMarketplace.newProduct(ID2, "Krastavici", 1, 5);
                let productsIDs = await cryptoMarketplace.getProducts.call();
                let product2 = await cryptoMarketplace.getProduct.call(productsIDs[1]);
                product2[1] = product2[1].toString();
                product2[2] = product2[2].toString();
                let expectArr = ["Krastavici", "1", "5"]
                expect(product2).to.have.all.members(expectArr, "getProduct func return wrong amount or arguments");
            });

            it("add five products and check if productIDs returns correct amount", async () => {
                const ID1 = encrypt("Domati:" + "2.00");
                const ID2 = encrypt("Krastavici:" + "1.00");
                const ID3 = encrypt("Purjoli:" + "20.00");
                const ID4 = encrypt("Piper:" + "1.00");
                const ID5 = encrypt("Chushka:" + "20.00");
                await cryptoMarketplace.newProduct(ID1, "Domati", 2, 1);
                await cryptoMarketplace.newProduct(ID2, "Krastavici", 1, 5);
                await cryptoMarketplace.newProduct(ID3, "Purjoli", 20, 50);
                await cryptoMarketplace.newProduct(ID4, "Piper", 1, 20);
                await cryptoMarketplace.newProduct(ID5, "Chushka", 20, 1);

                let productsIDs = await cryptoMarketplace.getProducts.call();

                expect(productsIDs.length).to.be.equal(5, "productIDs returns wrong amount of arguments");
            });

            it("add five products and check if every thing is saved correct", async () => {
                const ID1 = encrypt("Domati:" + "2.00");
                const ID2 = encrypt("Krastavici:" + "1.00");
                const ID3 = encrypt("Purjoli:" + "20.00");
                const ID4 = encrypt("Piper:" + "1.00");
                const ID5 = encrypt("Chushka:" + "20.00");
                await cryptoMarketplace.newProduct(ID1, "Domati", 2, 1);
                await cryptoMarketplace.newProduct(ID2, "Krastavici", 1, 5);
                await cryptoMarketplace.newProduct(ID3, "Purjoli", 20, 50);
                await cryptoMarketplace.newProduct(ID4, "Piper", 1, 20);
                await cryptoMarketplace.newProduct(ID5, "Chushka", 20, 1);

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

                let expectArr = [["Domati", "2", "1"], ["Krastavici", "1", "5"], ["Purjoli", "20", "50"], ["Piper", "1", "20"], ["Chushka", "20", "1"]];

                expect(products).to.deep.equal(expectArr, "Product are not saved correctly in the contract");
            });
        })
        
        describe("test with invalid parameters", async () => {

            it("check with empty name", async () => {
                const ID = encrypt(":" + "5.00");
                await cryptoMarketplace.newProduct(ID, "", 5, 7).should.be.rejectedWith("revert");
            });

            it("check with number name", async () => {
                const ID = encrypt("50:" + "5.00");
                await cryptoMarketplace.newProduct(ID, 50, 5, 7).should.be.rejectedWith("revert");
            });

            it("check with empty price", async () => {
                const ID = encrypt("Lutenica:");
                await cryptoMarketplace.newProduct(ID, "Lutenica", "", 7).should.be.rejectedWith("revert");
            });

            it("check with empty quantity", async () => {
                const ID = encrypt("Lutenica:" + "10.00");
                await cryptoMarketplace.newProduct(ID, "Lutenica", 10, "").should.be.rejectedWith("revert");
            });

            it("check with zero price", async () => {
                const ID = encrypt("Lutenica:" + "0.00");
                await cryptoMarketplace.newProduct(ID, "Lutenica", 0, 10).should.be.rejectedWith("revert");
            });

            it("check with zero quantity", async () => {
                const ID = encrypt("Lutenica:" + "5.00");
                await cryptoMarketplace.newProduct(ID, "Lutenica", 5, 0).should.be.rejectedWith("revert");
            });

            it("try to add product form not owner acc - 1", async () => {
                const ID = encrypt("Domata:" + "2.00");
                await cryptoMarketplace.newProduct(ID, "Domata", 2, 2, { from: acc4 }).should.be.rejectedWith("revert");
            });

            it("try to add product form not owner acc - 2", async () => {
                const ID = encrypt("Turshiq:" + "1.00");
                await cryptoMarketplace.newProduct(ID, "Turshiq", 1, 5, { from: acc7 }).should.be.rejectedWith("revert");
            });
        });
    });
});