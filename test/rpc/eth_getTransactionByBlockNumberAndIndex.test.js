const {ethers} = require("hardhat");
const {expect} = require("chai");
const {BigNumber} = require("ethers");

describe("getTransactionByBlockNumberAndIndex", function () {
    this.timeout(600000)
    before(async function () {
        let fallbackAndReceiveContract = await ethers.getContractFactory("fallbackAndReceive");
        let logContract = await ethers.getContractFactory("contracts/LogContract.sol:LogContract");
        await (await fallbackAndReceiveContract.deploy()).deployed()
        await (await logContract.deploy()).deployed()
    });

    describe("tag", async () => {
        it("not exist block num(https://github.com/nervosnetwork/godwoken-web3/issues/269)", async () => {
            let num = await ethers.provider.getBlockNumber()
            let response = await ethers.provider.send("eth_getTransactionByBlockNumberAndIndex", [BigInterToHexString(BigNumber.from(num + 1)), "0x0"])
            console.log("eth_getTransactionByBlockHashAndIndex response:", response)
            expect(response).to.be.equal(null)
        }).timeout(50000)

        it("not exist block num overflow  larger than int64(https://github.com/nervosnetwork/godwoken-web3/issues/269)", async () => {
            try {
                await ethers.provider.send("eth_getTransactionByBlockNumberAndIndex", ["0xfffffffffffffffffffffffffffffffffffff", "0x0"])

            }catch (e){
                return
            }
            expect('').to.be.equal('failed')
        }).timeout(50000)

        it("not exist block num overflow  larger than 64 bits(https://github.com/nervosnetwork/godwoken-web3/issues/269)", async () => {

            try {
                await ethers.provider.send("eth_getTransactionByBlockNumberAndIndex", ["0xffffffffffffffffff", "0x0"])

            }     catch (e){
                return
            }
            expect('').to.be.equal('failed')
        }).timeout(50000)
    })


    describe("exist num ,idx", async () => {

        it("empty txs block ", async () => {
            //todo check axon result
            let tx = await ethers.provider.send("eth_getTransactionByBlockNumberAndIndex", ["0x0", "0x0"])
            expect(tx).to.be.equal(null)
        })

        it("first tx", async () => {
            let blockNum = await ethers.provider.getBlockNumber();
            let txResponse;
            do {
                blockNum = blockNum - 1;
                txResponse = await ethers.provider.getBlock(blockNum)
            } while (txResponse.transactions.length <= 0)

            let tx = await ethers.provider.send("eth_getTransactionByBlockNumberAndIndex", [BigInterToHexString(BigNumber.from(blockNum)), "0x0"])
            expect(tx.blockHash).to.be.equal(txResponse.hash)
        }).timeout(500000)

        it("latest tx", async () => {
            let blockNum = await ethers.provider.getBlockNumber();
            let txResponse;
            do {
                blockNum = blockNum - 1;
                txResponse = await ethers.provider.getBlock(blockNum)
            } while (txResponse.transactions.length < 1)
            let tx = await ethers.provider.send("eth_getTransactionByBlockNumberAndIndex", [BigInterToHexString(BigNumber.from(blockNum)), BigInterToHexString(BigNumber.from(txResponse.transactions.length - 1))])
            expect(tx.blockHash).to.be.equal(txResponse.hash)
        }).timeout(500000)

        it("idx out of bound for block num", async () => {
            let blockNum = await ethers.provider.getBlockNumber();
            let txResponse = await ethers.provider.getBlock(blockNum);
            let tx = await ethers.provider.send("eth_getTransactionByBlockNumberAndIndex", [BigInterToHexString(BigNumber.from(blockNum)), BigInterToHexString(BigNumber.from(txResponse.transactions.length + 11111))])
            expect(tx).to.be.equal(null)
        }).timeout(500000)

        it("idx out of bound for block num overflow", async () => {
            let blockNum = await ethers.provider.getBlockNumber();
            let txResponse;
            do {
                blockNum = blockNum - 1;
                txResponse = await ethers.provider.getBlock(blockNum)
            } while (txResponse.transactions.length < 1)
            let tx = await ethers.provider.send("eth_getTransactionByBlockNumberAndIndex", [BigInterToHexString(BigNumber.from(blockNum)), "0xffffffffffffff"])
            expect(tx).to.be.equal(null)
        }).timeout(500000)

    })


})


function BigInterToHexString(bn) {
    if (bn < 16) {
        return "0x" + bn.toHexString().replaceAll("0x0", "");
    }
    return bn.toHexString().replaceAll("0x0", "0x");
}
