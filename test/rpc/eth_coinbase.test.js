const {ethers} = require("hardhat");
const {expect} = require("chai");


describe("eth_coinbase", function () {

    it('[] ,should return 0x....', async () => {
        let version = await ethers.provider.send('eth_coinbase', [])
        expect(version).to.be.include('0x')
    })
})