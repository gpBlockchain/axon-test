const {ethers} = require("hardhat");
const {expect} = require("chai");


describe("eth_syncing", function () {

    it('[] ,should return false', async () => {
        let syncing = await ethers.provider.send('eth_syncing', [])
        console.log('syncing:',syncing)
        expect(syncing).to.be.equal(false)
    })
})