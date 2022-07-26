const {ethers} = require("hardhat");
const {expect} = require("chai");


describe("RevertContract.js opcode ", function () {
    this.timeout(100000)

    let contract;
    let contractInfo;

    before(async function () {
        contractInfo = await ethers.getContractFactory("RevertContract");
        contract = await contractInfo.deploy();
        await contract.deployed();
    });

    it("revert1View 1(https://github.com/nervosnetwork/godwoken-web3/issues/423)", async () => {
        try {
            await contract.revert1View();
        } catch (e) {
            console.log('e.toString():', e.toString())
            expect(e.toString()).to.be.include("1234112341123411234112341123411234112")
            return
        }
        expect("").to.be.equal("failed")

    })
    it("revert msg(https://github.com/nervosnetwork/godwoken-web3/issues/423)", async () => {
        let msg = "";
        for (let i = 0; i < 1000; i++) {
            msg = msg + "ssss"
        }
        try {
            await contract.revertMsg(msg);
        } catch (e) {
            expect(e.toString()).to.be.contains("sssssssssssssssssssssssssssssssssssss")
            return
        }
        expect("").to.be.equal("failed")


    })

    it("revert with method ",async ()=>{

        try {
            await contract.testEmpty()
        }catch (e){
            expect(e.toString()).to.be.include("Empty")
            return
        }
        expect("").to.be.equal("failed")


    })

    it("require error", async () => {

        try {
            await contract.testRequireBalance()
        } catch (e) {
            console.log('toString:', e.toString())
            expect(e.toString()).to.be.contains("ERC20: transfer amount exceeds balance")
            return
        }
        expect("").to.be.equal("failed")
    })

    describe("panic", function () {
//     enum FailedStyle{
//         NO,         // 0: normal tx
//         REQUIRE_1,  // 1: failed for require(false)
//         ASSERT01,   // 2: 0x01: assert false
//         ASSERT11,   // 3: 0x11: If an arithmetic operation results in underflow or overflow
//         ASSERT12,   // 4: 0x12: divide or divide modulo by zero
//         ASSERT21,   // 5: 0x21: If you convert a value that is too big or negative into an enum type.
//         ASSERT22,   // 6: 0x22: If you access a storage byte array that is incorrectly encoded.
//         ASSERT31,   // 7: 0x31: If you call .pop() on an empty array.
//         ASSERT32,   // 8: 0x32: If you access an array, bytesN or an array slice at an out-of-bounds or negative index (i.e. x[i] where i >= x.length or i < 0).
//         ASSERT41,   // 9: 0x41: If you allocate too much memory or create an array that is too large.
//         ASSERT51,   // 10: todo:0x51: If you call a zero-initialized variable of internal function type.
//         Error1,     // 11: error
//     }
        let failedContract080;
        before(async function () {
            let contractInfo = await ethers.getContractFactory("contracts/failedTx/failedTxContract.0.8.4.sol:FailedTxContract")
            failedContract080 = await contractInfo.deploy()
            await failedContract080.deployed()
        })
        it("0x01", async () => {
            await invokeFailedTx(failedContract080, 2, "1")
        })
        it("0x11", async () => {
            await invokeFailedTx(failedContract080, 3, "0x11")
        })
        it("0x12", async () => {
            await invokeFailedTx(failedContract080, 4, "0x12")
        })
        it("0x21", async () => {
            await invokeFailedTx(failedContract080, 5, "0x21")
        })
        it("0x22", async () => {
            await invokeFailedTx(failedContract080, 6, "0x22")
        })
        it("0x31", async () => {
            await invokeFailedTx(failedContract080, 7, "0x31")
        })
        it("0x32", async () => {
            await invokeFailedTx(failedContract080, 8, "0x32")
        })
        it("0x41", async () => {
            await invokeFailedTx(failedContract080, 9, "0x41")
        })

        it("error", async () => {
            await invokeFailedTx(failedContract080, 11, "error")
        })

        async function invokeFailedTx(contract, number, expected) {
            try {
                await contract.callStatic.FailedTx(number)
            } catch (e) {
                console.log(e.toString())
                // test call
                expect(e.toString()).to.be.include(expected)
                return
            }
            expect("").to.be.include("failed")

        }
    })

})