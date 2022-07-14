const {ethers} = require("hardhat");
const {expect} = require("chai");

describe("eth_getBlockByNumber", function () {
    this.timeout(600000)

    before(async function () {
        let fallbackAndReceiveContract = await ethers.getContractFactory("fallbackAndReceive");
        let logContract = await ethers.getContractFactory("contracts/LogContract.sol:LogContract");
        await (await fallbackAndReceiveContract.deploy()).deployed()
        await (await logContract.deploy()).deployed()
    });


    it("getBlockByNumber not exist number => null", async () => {
        let response = await ethers.provider.send("eth_getBlockByNumber", ["0x1b41111111111111", true])
        expect(response).to.be.equal(null)
    })

    it("overflow not exist number => invalid argument 0: block number larger than int64", async () => {
        try{
            await ethers.provider.send("eth_getBlockByNumber", ["0xffffffffffffffff", true])
        }catch (e){
            return
        }
        expect('').to.be.equal('failed')
    })

    it("overflow not exist number => 'invalid argument 0: hex number > 64 bits'", async () => {
        try {
            await ethers.provider.send("eth_getBlockByNumber", ["0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", true])

        }catch (e){
            return
        }
        expect('').to.be.equal('failed')
    })

    it("getBlockByNumber 0 => null", async () => {
        let response = await ethers.provider.send("eth_getBlockByNumber", ["0x0", false])
        expect(response.parentHash).to.be.equal("0x0000000000000000000000000000000000000000000000000000000000000000")
    })

    it("getBlockByNumber earliest => 0x0", async () => {
        // let number = await ethers.provider.getBlockNumber();
        let response = await ethers.provider.send("eth_getBlockByNumber", ["earliest", false])
        expect(response.parentHash).to.be.equal("0x0000000000000000000000000000000000000000000000000000000000000000")
    })

    it("getBlockByNumber pending => not 0x0", async () => {
        // let number = await ethers.provider.getBlockNumber();
        let response = await ethers.provider.send("eth_getBlockByNumber", ["pending", false])
        expect(response.parentHash).to.be.not.equal("0x0000000000000000000000000000000000000000000000000000000000000000")
    })

    it("getBlockByNumber latest => ", async () => {
        // let number = await ethers.provider.getBlockNumber();
        let response = await ethers.provider.send("eth_getBlockByNumber", ["latest", false])
        expect(response.parentHash).to.be.contains("0x")
    })
})