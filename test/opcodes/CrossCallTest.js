const {ethers} = require("hardhat");
const {expect} = require("chai");

//call
//delegate_call
//static_call
//todo call_code
describe("CrossCallTest.js cross call ", function () {
    this.timeout(600000)
    let crossContract

    before(async function () {
        const CrossCallTestInfoContract = await ethers.getContractFactory("CrossCallTest");
        crossContract = await CrossCallTestInfoContract.deploy();
        await crossContract.deployed();
        console.log("contractAddress:", crossContract.address);
    });

    describe("call", function () {

        it("call demo", async () => {
            let tx = await crossContract.call_1()
            let receipt = await tx.wait()
            console.log(receipt)
        })

        it("call out of gas", async () => {
            let tx = await crossContract.call_out_of_gas()
            let receipt = await tx.wait()
            console.log(receipt)
        })

        it("call stack", async () => {
            console.log("--------------")
            try {
                let tx = await crossContract.call_stack(4030)
                let receipt = await tx.wait();
                console.log("receipt:", receipt)
            } catch (e) {
                // expect(e.toString()).to.be.contains("")
                return
            }
            expect('').to.be.equal('failed')
        })

    })


    describe("delegate_call", function () {
        it("delegate_call demo", async () => {
            let tx = await crossContract.call_delegatecallFunc();
            await tx.wait()
        })

    })

    describe("static_call", function () {
        it("static_call demo", async () => {
            let tx = await crossContract.call_staticcallFunc();
            await tx.wait()
        })
    })

    describe("call_code", function () {

        it("callcode demo", async () => {
            //todo
        })
    })
})