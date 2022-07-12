const {ethers} = require("hardhat");
const {expect} = require("chai");
const {BigNumber} = require("ethers");

describe("eth_getBlockTransactionCountByHash", function () {
    this.timeout(600000)

    it('exist block num,should return block\'s tx length',async ()=>{

        // get latest blockHash
        let block = await ethers.provider.getBlock('latest');
        // get tx count
        let txNum =await ethers.provider.send('eth_getBlockTransactionCountByNumber',[block.number]);
        expect(BigNumber.from(block.transactions.length).toHexString()).to.be.include(txNum)
    })

    it('pending,should return block\'s tx length',async ()=>{

        // get latest blockHash
        let block = await ethers.provider.getBlock('pending');
        // get tx count
        let txNum =await ethers.provider.send('eth_getBlockTransactionCountByNumber',['pending']);
        expect(BigNumber.from(block.transactions.length).toHexString()).to.be.include(txNum)
    })

    it('earliest,should return block\'s tx length',async ()=>{

        // get latest blockHash
        let block = await ethers.provider.getBlock('earliest');
        // get tx count
        let txNum =await ethers.provider.send('eth_getBlockTransactionCountByNumber',['earliest']);
        expect(BigNumber.from(block.transactions.length).toHexString().replace('0x0','0x')).to.be.include(txNum)
    })

    it('not exist block num,should return error ',async ()=>{
        // get tx count
        try {
            await ethers.provider.send('eth_getBlockTransactionCountByNumber',['0x1b20d4544ba9f3f31bf8b3faca7f0ca9d3d60f0599ec38ae3b379d759920d70d']);
        }catch (e){
            return
        }
        expect('').to.be.include('failed')
    })


})