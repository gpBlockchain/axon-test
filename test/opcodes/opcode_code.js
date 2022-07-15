const {ethers} = require("hardhat");
const {expect} = require("chai");

//ext_code_size
//ext_code_copy
//code_copy
describe("opcode_code.js opcode -code ", function () {
    this.timeout(600000)

    let contract;

    beforeEach(async function () {
        const contractInfo = await ethers.getContractFactory("opcode_code");
        contract = await contractInfo.deploy();
        await contract.deployed();
        console.log("contractAddress:", contract.address);
    });

    it("code ", async () => {
        let response = await contract.ass(33, 4, 32);
        expect(response.length).to.be.equal(2)
    });

    it("code store", async () => {
        try {
            await contract.storeData(33, 4, 32);
        } catch (e) {
            //'gas required exceeds allowance (50000000)'
            return
        }
        expect('').to.be.include('failed')
    })

})

