const {ethers} = require("hardhat");
const {expect} = require("chai");


describe("web3_clientVersion", function () {

    it('[]', async () => {

        let version = await ethers.provider.send('web3_clientVersion', [])
        console.log(version)
        expect(version.length).to.be.gte(1)
    })
})