const {ethers} = require("hardhat");
const {expect} = require("chai");
const {BigNumber} = require("ethers");
const {deployLogContractAddress, deployContractByContractName} = require("../utils/rpc");

describe("eth_getCode", function () {
    this.timeout(600000)


    it('not exist address,should return 0x0',async ()=>{
        let response = await ethers.provider.send('eth_getCode',['0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92267','latest'])
        expect(response).to.be.equal('0x')
    })

    it('eoa address, should return 0x0',async ()=>{
        let eoaAddress = (await ethers.getSigners())[0].address
        let code = await ethers.provider.send('eth_getCode',[eoaAddress,'latest'])
        expect(code).to.be.equal('0x')
    })

    describe('contract',function (){

        let deployReceipt;

        let contract;

        before(async ()=>{
            contract = await deployContractByContractName("contracts/LogContract.sol:LogContract")
            await contract.deployed();
            deployReceipt = await contract.deployTransaction.wait()
        })

        it('latest,should return code ',async ()=>{
            let code = await ethers.provider.send('eth_getCode',[contract.address,'latest'])
            expect(code.length).to.be.gte(100)
        })

        it('pending,should return code ',async ()=>{
            let code = await ethers.provider.send('eth_getCode',[contract.address,'pending'])
            expect(code.length).to.be.gte(100)
        })

        it('earliest,should return 0x',async ()=>{
            let code = await ethers.provider.send('eth_getCode',[contract.address,'earliest'])
            expect(code).to.be.equal('0x')
        })

        it('deploy blockNum,should return code',async ()=>{
            let code = await ethers.provider.send('eth_getCode',[contract.address,BigNumber.from(deployReceipt.blockNumber).toHexString()])
            expect(code.length).to.be.gte(100)
        })

        it('before deployNum,should return 0x',async ()=>{
            let code = await ethers.provider.send('eth_getCode',[contract.address,BigNumber.from(deployReceipt.blockNumber-1).toHexString()])
            expect(code).to.be.equal('0x')
        })

        it('max later num,should return error msg',async ()=>{
            try {
                 await ethers.provider.send('eth_getCode',[contract.address,'0xfffffffff'])
            }catch (e){return}
            expect('').to.be.equal('failed')

        })

    })



})