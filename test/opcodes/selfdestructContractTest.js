const {ethers} = require("hardhat");
const {expect} = require("chai");

//self destruct
describe("self destructContractTest.js self destruct ", function () {
    this.timeout(100000)

    let contract;

    before(async function () {
        const blockInfoContract = await ethers.getContractFactory("selfdestructContractTest");
        contract = await blockInfoContract.deploy();
        await contract.deployed();
    });

    it("deploy self destruct", async () => {

        let tx = await contract.test_deploy();
        let receipt = await tx.wait();
        console.log("receipt:", receipt)
    })

    it("invoke self destruct", async () => {
        let tx = await contract.test_destruct_transfer({value: 1});
        let receipt = await tx.wait();
        console.log("receipt:", receipt)
    })
    //get_selfdestructContract_code

    it("invoke get code ", async () => {
        let code = await contract.get_selfdestructContract_code(false, "0x5fbdb2315678afecb367f032d93f642f64180aa3");
        console.log("code:", code);
        expect(code.toString()).to.be.contains("5fbdb2315678afecb367f032d93f642f64180aa3");
    })


})