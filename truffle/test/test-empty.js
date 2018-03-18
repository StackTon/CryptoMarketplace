const CryptoMarketplace = artifacts.require("CryptoMarketplace");
const keccak256 = require('js-sha3').keccak256;
const expect = require('chai').expect;

contract('FundRaise', function ([owner, acc1, acc2, acc3, acc4, acc5, acc6, acc7, acc8, acc9]) {
    let cryptoMarketplace
    beforeEach('setup contract for each test', async function () {
        cryptoMarketplace = await CryptoMarketplace.new()
    });

    it('has an owner', async function () {
        let contractOwner = await cryptoMarketplace.owner()
        expect(contractOwner).to.equal(owner, "Owner of contract is not correct");
    });
    
    describe("test with zero products", async () => {
        it("check if productIDs is empty", async () => {
            let productsIDs = await cryptoMarketplace.getProducts.call();
            expect(productsIDs).to.be.empty;
        });

        it("check if products mapping is empty", async () => {
            let product = await cryptoMarketplace.getProduct.call(keccak256("koko"));
            expect(product.length).to.be.equal(3, "product maping name returns wrong amount of parameters");
        })

        it("check if products mapping name is epmty", async () => {
            let product = await cryptoMarketplace.getProduct.call(keccak256("koko"));
            expect(product[0]).to.be.equal("", "products mapping name is not empty");
        })

        it("check if products mapping price is epmty", async () => {
            let product = await cryptoMarketplace.getProduct.call(keccak256("koko"));
            expect(product[1]).to.be.equal(0, "products mapping price is not empty");
        })

        it("check if products mapping quantity is epmty", async () => {
            let product = await cryptoMarketplace.getProduct.call(keccak256("koko"));
            expect(product[2]).to.be.equal(0, "products mapping quantity is not empty");
        })
    })
})