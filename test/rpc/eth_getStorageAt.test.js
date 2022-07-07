const {ethers} = require("hardhat");
const {expect} = require("chai");


describe("eth_getStorageAt", function () {

    it('not exist address no slot , should return 0x0', async () => {
        let version = await ethers.provider.send('eth_getStorageAt', [])
        expect(version).to.be.include('0x')
    })
    it('eoa address, should return 0x0',async ()=>{

    })

    describe('contract address', function () {

        it('exist slot ,should return data',async ()=>{

        })
        it('very large slot,should return ?',async ()=>{

        })

        it('destruct address time:latest , should return 0x0',async ()=>{

        })
        it('query slot when ')
    });

})