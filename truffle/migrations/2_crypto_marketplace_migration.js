const CryptoMarketplace = artifacts.require("./CryptoMarketplace.sol");
const SafeMath = artifacts.require("./SafeMath.sol");

module.exports = function (deployer) {

  deployer.deploy(SafeMath);
  deployer.link(SafeMath, CryptoMarketplace);
  deployer.deploy(CryptoMarketplace);
};
