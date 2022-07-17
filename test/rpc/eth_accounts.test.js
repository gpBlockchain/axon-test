const {ethers} = require("hardhat");
const {expect} = require("chai");


describe("eth_accounts", function () {

    it('[] ,should return 0x....', async () => {
        let accounts = await ethers.provider.send('eth_accounts', [])
        console.log('eth_accounts:', accounts)
        // expect(version).to.be.include('0x')
    })
})