const {ethers} = require("hardhat");
const {expect} = require("chai");
const {sendTxToAddBlockNum} = require("../utils/rpc");

describe("eth_newPendingTransactionFilter", function () {
    this.timeout(6000000)


    it.skip("filter 2times => second must 0", async () => {

        // eth_newBlockFilter
        const filterId = await ethers.provider.send("eth_newPendingTransactionFilter", []);
        // send 2 block number
        await sendTxToAddBlockNum(ethers.provider, 2)
        // check filter data  > 1
        let txs = await ethers.provider.send("eth_getFilterChanges", [filterId]);
        expect(txs.length).to.be.gte(1)
        // second invoke  filter must = 0
        txs = await ethers.provider.send("eth_getFilterChanges", [filterId]);
        expect(txs.length).to.be.equal(0)
    })


    it.skip(" send 2 block num ,should sort", async () => {

        let beginNum = await ethers.provider.getBlockNumber();
        const filterId = await ethers.provider.send("eth_newPendingTransactionFilter", []);
        await ethers.provider.send("eth_getFilterChanges", [filterId]);
        // expect(txs.length).to.be.equal(0)
        await sendTxToAddBlockNum(ethers.provider, 2)
        let txs = await ethers.provider.send("eth_getFilterChanges", [filterId]);
        let endNum = await ethers.provider.getBlockNumber();
        console.log("begin:", beginNum, "end:", endNum)
        expect(txs.length).to.be.gt(0)
        await checkTxGtNumber(txs, beginNum)
    }).timeout(100000000)

})

async function checkTxGtNumber(txs, beginNum) {
    for (let i = 0; i < txs.length; i++) {
        let txMsg = await ethers.provider.getTransaction(txs[i])
        if (txMsg.blockNumber == null){
            continue
        }
        expect(txMsg.blockNumber).to.be.gte(beginNum)
    }
}