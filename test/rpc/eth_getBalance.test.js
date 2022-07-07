const {ethers} = require("hardhat");
const {expect} = require("chai");


describe("eth_getBalance", function () {
    //todo
    it('not exist address,should return 0', async () => {
        let version = await ethers.provider.send('eth_getBalance', [])
    })
    it('haveBalance  address,should return not 0', async () => {
        let version = await ethers.provider.send('eth_getBalance', [])
    })

    it('contract address and no balance ,should return 0', async () => {
        let version = await ethers.provider.send('eth_getBalance', [])
    })

    it('contract address and have balance ,should return not 0', async () => {
        let version = await ethers.provider.send('eth_getBalance', [])
        expect(version).to.be.include('0x')
    })

    it('0x0 address and have balance ,should return not 0', async () => {
        let version = await ethers.provider.send('eth_getBalance', [])
        expect(version).to.be.include('0x')
    })

    it('send 0x1 balance query 0x1 balance ,should return not 0', async () => {
        let version = await ethers.provider.send('eth_getBalance', [])
        expect(version).to.be.include('0x')
    })
})