const {ethers} = require("hardhat");
const {expect} = require("chai");


describe("net_version", function () {

    it('[] ,should return data', async () => {

        let version = await ethers.provider.send('net_version', [])
        console.log(version)
        expect(version.length).to.be.gte(1)
    })
})