const {ethers} = require("hardhat");
const {expect} = require("chai");

describe("sha256Contract.js opcode -sha256 ", function () {
    this.timeout(1000000)

    let contract;

    before(async function () {
        const blockInfoContract = await ethers.getContractFactory("sha256Contract");
        contract = await blockInfoContract.deploy();
        await contract.deployed();
    });
    it("opKeccak256 - args", async () => {
        await invokeKeccak256("", "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470")
        await invokeKeccak256("keccakData", "0x87b233f537b1a1ab22f816370bbc771578c1a7451f113606b5ae09fedd8d2d32")
        await invokeKeccak256("keccakDataasda撒asadasasdasdadasdadanklnebvwebvoqb", "0x06059791f31635d63f0c1d7cab0dad6ba282b0004a4eabc0fae3fb89a6234fd8")
        await invokeKeccak256("12313那我等拿到哪里都懒得烂我的懒都懒得理拿到了看到了看到懒得理看到快烂掉了asaasasaasdasdndnakdnawdawdiubawiufbwaifbwaladnlakeccakDataasda撒asadasasdasdadasdadanklnebvwebvoqb", "0xf0d8895a9234297ef9b92a99f6dce1e17c4f947d44ef0224721ece69872f22d6")
    })

    async function invokeKeccak256(keccakData, hash) {
        let result = await contract.opKeccak256(keccakData);
        expect(result).to.be.equal(hash);
        let callResult = await contract.opKeccak256(keccakData);
        expect(callResult).to.be.equal(hash);
        let tx = await contract.opKeccak256WithLog(keccakData, ethers.utils.arrayify(hash));
        let receipt = await tx.wait();
        expect(receipt.events[0].args[1]).to.be.equal(hash);
    }
})