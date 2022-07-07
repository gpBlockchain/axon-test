const {ethers} = require("hardhat");
const {expect} = require("chai");


describe("net_listening", function () {

    it('[] ,should return true', async () => {
        let listen = await ethers.provider.send('net_listening', [])
        expect(listen).to.be.equal(true)
    })
})