const {ethers} = require("hardhat");
const {expect} = require("chai");


describe("eth_mining", function () {

    it('[] ,should return false', async () => {
        //todo check when return true .when return false
        let mining = await ethers.provider.send('eth_mining', [])
        expect(mining).to.be.equal(false)
    })
})