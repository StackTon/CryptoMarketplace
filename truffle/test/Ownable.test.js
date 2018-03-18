const Ownable = artifacts.require('Ownable');

const expect = require('chai').expect;

const BigNumber = web3.BigNumber;

require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BigNumber))
    .should();

contract('Ownable', function (accounts) {
    let ownable;

    beforeEach(async function () {
        ownable = await Ownable.new();
    });

    it('should have an owner', async function () {
        let owner = await ownable.owner();
        expect(owner !== 0).to.be.true;
    });


    it('changes owner after transfer', async function () {
        let other = accounts[1];
        await ownable.transferOwnership(other);
        let owner = await ownable.owner();

        expect(owner).to.be.equal(other, "transferOwnership does not work correctly");
    });

    it('should prevent non-owners from transfering', async function () {
        const other = accounts[2];
        const owner = await ownable.owner.call();
        assert.isTrue(owner !== other);
        await ownable.transferOwnership(other, { from: other }).should.be.rejectedWith("revert");
    });

    it('should guard ownership against stuck state', async function () {
        let originalOwner = await ownable.owner();
        await ownable.transferOwnership(null, { from: originalOwner }).should.be.rejectedWith("revert");
    });
});