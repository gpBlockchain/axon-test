const {ethers} = require("hardhat");
const {expect} = require("chai");


describe("eth_gasPrice", function () {

    it('[] ,should return 0x....', async () => {
        let version = await ethers.provider.send('eth_gasPrice', [])
        expect(version).to.be.include('0x')
    })
})