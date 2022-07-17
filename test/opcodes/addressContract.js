const {ethers} = require("hardhat");
const {expect} = require("chai");
// address(address(this)
// address(this).balance
// address(this).code
// address(this).code.length
// address(this).codehash
describe("addressContract.js opcode -address(address(this),address(this).balance,address(this).code,address(this).code.length,address(this).codehash) ", function () {
    this.timeout(600000)

    let contract
    let contract2
    let contractInfo
    before(async function () {
        contractInfo = await ethers.getContractFactory("addressContract");
        contract = await contractInfo.deploy({value: 10000n});
        await contract.deployed();
        contract2 = await contractInfo.deploy({value: 101n});
        await contract2.deployed();
    })

    describe("query address in deploy log", function () {

        let result;
        before(async function () {
            result = await contract2.deployTransaction.wait();
        })
        it("check address(address(this)", async () => {
            expect(result.events[0].args.msg.latestAddress).to.be.equal(contract2.address)
        })
        it("check address(this).balance", async () => {
            expect(result.events[0].args.msg.latestBalance).to.be.equal(101n)
        })
        it("check address(this).code (godwoken deploy code is 0x0)", async () => {
            expect(result.events[0].args.msg.latestCode).to.be.equal("0x")
        })
        it("check address(this).code.length(godwoken deploy code is 0x0)", async () => {
            expect(result.events[0].args.msg.latestCodeLength).to.be.equal(0n)
        })
        it("check address(this).codehash", async () => {
            expect(result.events[0].args[1].latestCodeHash).to.be.not.equal("0x0000000000000000000000000000000000000000000000000000000000000000");
        })
    })

    describe("query address msg for eth call", async () => {
        let result;
        before(async function () {
            result = await contract.opcodeWithAddress();
        })
        //return (address(this),address(this).balance,address(this).code,address(this).code.length,address(this).codehash);
        it("check address(address(this)", async () => {
            expect(result[0]).to.be.equal(contract.address)
        })
        it("check address(this).balance", async () => {
            expect(result[1]).to.be.equal(10000n)
        })

        it("check address(this).code", async () => {
            let code = await ethers.provider.getCode(contract.address)
            expect(result[2]).to.be.equal(code)
        })

        it("check address(this).codeHash", async () => {
            expect(result[4]).to.be.equal("0xc5a94d21b524783a20d29f69f58fb1e79791dd9145c027947fdb87fbb1e25826");
        })
    })

    describe("set address msg use invoke", async () => {

        //function setAddressMsg() public {
        //         (latestAddress,latestBalance,latestCode,latestCodeLength,latestCodeHash) = opcodeWithAddress();
        //         addrMsg.latestBalance = latestBalance;
        //         addrMsg.latestAddress = latestAddress;
        //         addrMsg.latestCode = latestCode;
        //         addrMsg.latestCodeLength = latestCodeLength;
        //         addrMsg.latestCodeHash = latestCodeHash;
        //         emit updateAddressEvent(1,addrMsg);
        //     }

        let result
        let ethCallResult
        before(async function () {
            let tx = await contract.setAddressMsg();
            result = await tx.wait()
            ethCallResult = await contract.addrMsg();
        })


        it("check address(this).balance", async () => {
            // log msg eq eth call msg
            expect(result.events[0].args[1].latestBalance).to.be.equal(10000n)
            expect(result.events[0].args[1].latestBalance).to.be.equal(ethCallResult.latestBalance)
        })

        it("check address(this)", async () => {
            expect(result.events[0].args[1].latestAddress).to.be.equal(contract.address)
            expect(result.events[0].args[1].latestAddress).to.be.equal(ethCallResult.latestAddress)
        })

        it("check address(this).code", async () => {
            expect(result.events[0].args[1].latestCode).to.not.be.contains("00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000");
            expect(result.events[0].args[1].latestCode).to.be.equal(ethCallResult.latestCode);
        })

        it("check address(this).code.length", async () => {
            expect(result.events[0].args[1].latestCodeLength).to.be.equal(3441n)
            expect(result.events[0].args[1].latestCodeLength).to.be.equal(ethCallResult.latestCodeLength);
        })

        it("check address(this).codehash", async () => {
            expect(result.events[0].args[1].latestCodeHash).to.be.equal("0xc5a94d21b524783a20d29f69f58fb1e79791dd9145c027947fdb87fbb1e25826")
            expect(result.events[0].args[1].latestCodeHash).to.be.equal(ethCallResult.latestCodeHash);
        })
    })

    describe("get other address msg", function () {

        it("eoa address", async () => {
            let queryAddress = (await ethers.getSigners())[0].address
            let result = await contract.getOtherAddress(queryAddress);
            let balanceOfEoaAddress = await ethers.provider.getBalance(queryAddress)
            expect(result[0]).to.be.equal(queryAddress)
            expect(result[1]).to.be.equal(balanceOfEoaAddress)
            expect(result[2]).to.be.equal("0x")
            expect(result[3]).to.be.equal(0n)
            expect(result[4]).to.be.not.equal("0x0000000000000000000000000000000000000000000000000000000000000000")
        })

        it("un register address", async () => {
            let result = await contract.getOtherAddress("0xdB81D2b8154A10C6f25bC2a9225F403D954D0B65");
            expect(result[0]).to.be.equal("0xdB81D2b8154A10C6f25bC2a9225F403D954D0B65")
            expect(result[1]).to.be.equal(0n)
            expect(result[2]).to.be.equal("0x")
            expect(result[3]).to.be.equal(0n)
            expect(result[4]).to.be.equal("0x0000000000000000000000000000000000000000000000000000000000000000")
        })

        it("contract address", async () => {
            let result = await contract.getOtherAddress(contract2.address);
            let code = await ethers.provider.getCode(contract2.address)
            expect(result[0]).to.be.equal(contract2.address)
            expect(result[1]).to.be.equal(101n)
            expect(result[2]).to.be.equal(code)
            expect(result[3]).to.be.equal(code.length / 2 - 1)
            expect(result[4]).to.be.equal("0xc5a94d21b524783a20d29f69f58fb1e79791dd9145c027947fdb87fbb1e25826")

        })


    })

})