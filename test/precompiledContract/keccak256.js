const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("keccak256 ", function () {

    this.timeout(600000)
    let contract;

    beforeEach(async function () {
        const contractInfo = await ethers.getContractFactory("Keccak256Contract");
        contract = await contractInfo.deploy();
        await contract.deployed();
    });

    it("keccak256 demo ", async () => {
        let reuslt = await contract.callKeccak256Abc();
        expect(reuslt.toString()).to.be.equal("0xe1629b9dda060bb30c7908346f6af189c16773fa148d3366701fbaa35d54f3c8")
    })


});