const {ethers} = require("hardhat");
const {expect} = require("chai");
const {sendTxToAddBlockNum} = require("../utils/rpc");

describe("eth_newBlockFilter", function () {
    this.timeout(6000000)


    it("filter 2times => second must 0", async () => {

        // eth_newBlockFilter
        const filterId = await ethers.provider.send("eth_newBlockFilter", []);
        // send 2 block number
        await sendTxToAddBlockNum(ethers.provider, 2)
        // check filter data  > 1
        let txs = await ethers.provider.send("eth_getFilterChanges", [filterId]);
        expect(txs.length).to.be.gte(1)
        // second invoke  filter must = 0
        txs = await ethers.provider.send("eth_getFilterChanges", [filterId]);
        expect(txs.length).to.be.equal(0)
    })


    it(" send 5 block num ,should sort", async () => {

        let beginNum = await ethers.provider.getBlockNumber();
        const filterId = await ethers.provider.send("eth_newBlockFilter", []);
        await ethers.provider.send("eth_getFilterChanges", [filterId]);
        // expect(txs.length).to.be.equal(0)
        await sendTxToAddBlockNum(ethers.provider, 5)
        let txs = await ethers.provider.send("eth_getFilterChanges", [filterId]);
        let endNum = await ethers.provider.getBlockNumber();
        console.log("begin:", beginNum, "end:", endNum)
        expect(txs.length).to.be.gt(0)
        txs = await ethers.provider.send("eth_getFilterChanges", [filterId]);
        expect(txs.length).to.be.equal(0)

        await checkBlockHashIsSort(txs)
        await checkBlockHashGtNumber(txs, beginNum)
    }).timeout(100000000)

})

async function checkBlockHashGtNumber(txs, beginNum) {
    for (let i = 0; i < txs.length; i++) {
        let blockMsg = await ethers.provider.getBlock(txs[i])
        expect(blockMsg.number).to.be.gt(beginNum)
    }
}

async function checkBlockHashIsSort(txs) {
    let beginNum = 0;
    for (let i = 0; i < txs.length; i++) {
        console.log(txs[i])
        let blockMsg = await ethers.provider.getBlock(txs[i])
        console.log(blockMsg.number)
        expect(blockMsg.number).to.be.gt(beginNum)
        beginNum = blockMsg.number
    }

}