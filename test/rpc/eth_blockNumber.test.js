const {ethers} = require("hardhat");
const {expect} = require("chai");


describe("eth_blockNumber", function () {

    it('[] ,should return 0x....', async () => {
        let number = await ethers.provider.send('eth_blockNumber', [])
        expect(number).to.be.include('0x')
    })
})