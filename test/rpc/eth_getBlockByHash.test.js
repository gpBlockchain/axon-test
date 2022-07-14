const {ethers} = require("hardhat");
const {expect} = require("chai");
const {BigNumber} = require("ethers");

describe("eth_getBlockByHash", function () {
    this.timeout(600000)

    let containTxBlockNumHash;
    before(async function () {
        let fallbackAndReceiveContract = await ethers.getContractFactory("fallbackAndReceive");
        let logContract = await ethers.getContractFactory("contracts/LogContract.sol:LogContract");
        await (await fallbackAndReceiveContract.deploy()).deployed()
        let receipt = await (await (await logContract.deploy()).deployed()).deployTransaction.wait()
        containTxBlockNumHash = receipt.blockHash
    });

    it(" not exist hash,should return null", async () => {
        let response = await ethers.provider.send("eth_getBlockByHash", ["0xb2fea9c4b24775af6990237aa90228e5e092c56bdaee74496992a53c208da1ee", true])
        expect(response).to.be.equal(null)
    })

    it(" not exist hash ,should return  null", async () => {
        let response = await ethers.provider.send("eth_getBlockByHash", ["0xb2fea9c4b24775af6990237aa90228e5e092c56bdaee74496992a53c208da1ee", false])
        expect(response).to.be.equal(null)
    })

    it("exist hash, should return data ", async () => {
        // let number = await ethers.provider.getBlockNumber();
        let response = await ethers.provider.getBlock("latest")

        // hash
        let responseByBlockHashTrue = await ethers.provider.send("eth_getBlockByHash", [response.hash, true])
        let responseByBlockFalse = await ethers.provider.send("eth_getBlockByHash", [response.hash, false])
        expect(responseByBlockHashTrue.hash).to.be.equal(response.hash)
        expect(responseByBlockFalse.hash).to.be.equal(response.hash)

        // parentHash
        responseByBlockHashTrue = await ethers.provider.send("eth_getBlockByHash", [response.parentHash, true])
        responseByBlockFalse = await ethers.provider.send("eth_getBlockByHash", [response.parentHash, false])
        expect(responseByBlockHashTrue.hash).to.be.equal(response.parentHash)
        expect(responseByBlockFalse.hash).to.be.equal(response.parentHash)
    })
    it('contains deploy tx  block hash, should return txMsg',async ()=>{

        let responseForTrue = await ethers.provider.send("eth_getBlockByHash",[containTxBlockNumHash,true])
        let responseForFalse = await  ethers.provider.send("eth_getBlockByHash",[containTxBlockNumHash,false])
        console.log('')
        console.log('----')
        expect(responseForFalse.number).to.be.equal(responseForTrue.number)
        expect(responseForFalse.transactions.length).to.be.equal(responseForTrue.transactions.length)
        for (let i = 0; i < responseForFalse.transactions.length; i++) {
            let txMsg = responseForTrue.transactions[i]
            expect(txMsg.blockHash).to.be.equal(responseForFalse.hash)
            expect(txMsg.blockNumber).to.be.equal(responseForFalse.number)
            expect(txMsg.transactionIndex).to.be.equal(BigNumber.from(i).toHexString().replace('0x0','0x'))
        }

    })
})