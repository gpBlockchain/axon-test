const {ethers} = require("hardhat");
const {expect} = require("chai");


describe("eth_protocolVersion", function () {

    it('[] ,should return true', async () => {
        let version = await ethers.provider.send('eth_protocolVersion', [])
        expect(version).to.be.include('0x')
    })
})