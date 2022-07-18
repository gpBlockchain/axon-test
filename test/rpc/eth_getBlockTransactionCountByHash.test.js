const {ethers} = require("hardhat");
const {expect} = require("chai");
const {BigNumber} = require("ethers");

describe("eth_getBlockTransactionCountByHash", function () {
    this.timeout(600000)

    it('exist blockHash ,should return block\'s tx length ',async ()=>{

        // get latest blockHash
        let block = await ethers.provider.getBlock('latest');
        // get tx count
        let txNum =await ethers.provider.send('eth_getBlockTransactionCountByHash',[block.hash]);
        expect(BigNumber.from(block.transactions.length)).to.be.equal(txNum)
    })

    it('not exist blockHash,should return 0x0',async ()=>{
        // get tx count
        let txNum =await ethers.provider.send('eth_getBlockTransactionCountByHash',['0x1b20d4544ba9f3f31bf8b3faca7f0ca9d3d60f0599ec38ae3b379d759920d70d']);
        expect('0x0').to.be.include(txNum)

    })


})