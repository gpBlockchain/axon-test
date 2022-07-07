const {ethers} = require("hardhat");
const {expect} = require("chai");


describe("net_peerCount", function () {

    it('[] ,should return contains 0x', async () => {
        let count = await ethers.provider.send('net_peerCount', [])
        expect(count).to.be.include('0x')
    })
})