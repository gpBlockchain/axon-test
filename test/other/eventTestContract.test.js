const {ethers} = require("hardhat");
const {expect} = require("chai");


describe("eventTestContract", function () {
    this.timeout(600000)

    let contract;

    before(async function () {
        const contractInfo = await ethers.getContractFactory("eventTestContract");
        contract = await contractInfo.deploy();
        await contract.deployed();
        console.log("contractAddress:", contract.address);
    });

    it("code ", async () => {
        let tx = await contract.testLog(10000,{gasLimit:30000000});
        let response = await tx.wait()
        expect(response.logs.length).to.be.equal(10000)
        for (let i = 0; i < response.logs.length; i++) {
            let data = response.logs[i].data;
            expect(data).to.be.equal('0x0000000000000000000000000000000000000000000000000000000000000000')
        }
    });


})