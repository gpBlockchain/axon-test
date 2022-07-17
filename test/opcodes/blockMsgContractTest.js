const {ethers} = require("hardhat");
const {expect} = require("chai");

// blockhash(number)
// block.chainid
// block.coinbase
// block.difficulty
// block.gaslimit
// block.number
// block.timestamp
describe("BlockMsgContractTest.js opcode -blockchain -block ", function () {
    this.timeout(600000)
    let contract;

    before(async function () {
        const blockInfoContract = await ethers.getContractFactory("BlockMsgContract");
        contract = await blockInfoContract.deploy();
        await contract.deployed();
        console.log("contractAddress:", contract.address);
    });

    it("Verify the blockhash of the past 256 blocks by log", async () => {

        let tx = await contract.getBlockHashEventTopre256({gasLimit: 2000000})
        let receipt = await tx.wait()


        for (let i = 0; i < receipt.events.length; i++) {
            if (i < 2 || i >= 258) {
                expect(receipt.events[i].args[0]).to.be.equal("0x0000000000000000000000000000000000000000000000000000000000000000");
            } else {
                expect(receipt.events[i].args[0]).to.be.not.equal("0x0000000000000000000000000000000000000000000000000000000000000000");
                await checkBlockNumAndHash(receipt.events[i].args[0], receipt.events[i].args[1])

            }
        }

    })
    it("Verify the block hash of the past 256 blocks by eth_call", async () => {
        let receipt = await contract.getBlockHashEventTopre256View()
        // let height = await ethers.provider.getBlockNumber()
        let height = receipt.blockNumber
        for (let i = 0; i < receipt.blkHashs.length; i++) {
            console.log("receipt.blkHashs[i]:", i, receipt.blkHashs[i])
            if (height.add(1) - i < 0) {
                expect(receipt.blkHashs[i]).to.be.equal("0x0000000000000000000000000000000000000000000000000000000000000000");
                continue;
            }
            if (i < 2 || i >= 258) {
                expect(receipt.blkHashs[i]).to.be.equal("0x0000000000000000000000000000000000000000000000000000000000000000");
            } else {
                expect(receipt.blkHashs[i]).to.be.not.equal("0x0000000000000000000000000000000000000000000000000000000000000000");
            }
        }

    })

    describe("query block related information", function () {
        let updateBlockMsg
        let ethCallBlockData

        before(async function () {
            let tx = await contract.update_block_msg()
            let updateBlockMsgTxReceipt = await tx.wait()
            ethCallBlockData = await contract.get_block_data()
            updateBlockMsg = await ethers.provider.getBlock(updateBlockMsgTxReceipt.blockNumber)
        })


        it("check blockHash", async () => {
            // updateBlockMsgTxReceipt.blockHash => blockHash(blockNumber-1)
            let blockMsg = await ethers.provider.getBlock(ethCallBlockData[0])
            console.log('blockMsg')
            expect(ethCallBlockData[0]).to.be.equal(updateBlockMsg.parentHash)
        })


        it("check block.chainId", async () => {
            let chainId = await ethers.provider.send("eth_chainId", []);
            expect(ethCallBlockData[1]).to.be.equal(chainId);

        })
        it("check block.coinbase", async () => {
            expect(ethCallBlockData[2]).to.be.equal(updateBlockMsg.miner)
        })

        it("check block.difficulty", async () => {
            expect(ethCallBlockData[3].toString()).to.be.equal(updateBlockMsg.difficulty.toString())
        })

        it("check block.gaslimit", async () => {
            expect(ethCallBlockData[4]).to.be.gt("1")

        })

        it("check block.number", async () => {
            expect(updateBlockMsg.number.toString()).to.be.equal(ethCallBlockData[5].toString())
        })

        it("check block.timestamp", async () => {
            expect(ethCallBlockData[6]).to.be.equal(updateBlockMsg.timestamp)
        })
    })

})

async function checkBlockNumAndHash(blockHash, blockNum) {
    let block = await ethers.provider.getBlock(blockHash)
    expect(block.number).to.be.equal(blockNum)

}