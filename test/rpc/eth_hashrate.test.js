const {ethers} = require("hardhat");
const {expect} = require("chai");


describe("eth_hashrate", function () {

    it('[] ,should return true', async () => {

        let hashrate = await ethers.provider.send('eth_hashrate', [])
        console.log('hashrate:',hashrate)
        expect(hashrate).to.be.include('0x')

    })
})