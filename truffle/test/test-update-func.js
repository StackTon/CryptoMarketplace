var CryptoMarketplace = artifacts.require("CryptoMarketplace");
const keccak256 = require('js-sha3').keccak256;
const expect = require('chai').expect;

contract('FundRaise', function ([owner, acc1, acc2, acc3, acc4, acc5, acc6, acc7, acc8, acc9]) {
    let cryptoMarketplace
    beforeEach('setup contract for each test', async function () {
        cryptoMarketplace = await CryptoMarketplace.new()
    });

    describe("test update func", async () => {
        // TODO add one product and update it and check the newQuantity
        // TODO add one product and update it and check the newQuantity
        // TODO add one product and update it and check the newQuantity

        // TODO add one product and try to update with zero quantity

        // TODO add two product and update one and check the newQuantity

        // TODO add five product and update one and check the newQuantity

        // TODO add two product and update bouth and check the one newQuantity
        // TODO add two product and update bouth and check the other newQuantity
        


        // TODO add one product and try to update with wrong ID
        
        // TODO add two products and try to update with wrong ID
        
        // TODO add one product and try to update with "pesho" quantity

        // TODO try to update product without quantity param

        // TODO try to update product without params

        // TODO try to update product with big quantity
        
    })
    
})