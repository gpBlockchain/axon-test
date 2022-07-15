const {ethers} = require("hardhat");
const {expect} = require("chai");

//create2
describe("create2_test.js ", function () {

    this.timeout(600000)
    let contract;

    before(async function () {
        const blockInfoContract = await ethers.getContractFactory("create2_test");
        contract = await blockInfoContract.deploy();
        await contract.deployed();
        console.log("contractAddress:", contract.address);
    });

    it("demo", async () => {
        let tx = await contract.testCreate();
        let receipt = await tx.wait();
        expect(receipt.events[0].data).to.be.equal("0x0000000000000000000000000000000000000000000000000000000000000001");
    })

    //test_create2_destruct_creat2
    it("create2 invoke same contract in 1tx", async () => {
        let tx = await contract.test_create2_deploy_2_same_contract({gasLimit:10000000});
        let receipt = await tx.wait();
        expect(receipt.events[2].args[1]).to.be.not.equal("0x0000000000000000000000000000000000000000")
        expect(receipt.events[4].args[1]).to.be.equal("0x0000000000000000000000000000000000000000")
    })

    it("create2 invoke same contract in diff tx(https://github.com/nervosnetwork/godwoken-web3/issues/245) ", async () => {
        let tx = await contract.test_create2_destruct();
        let receipt = await tx.wait();
        console.log("-1---")
        expect(receipt.events[2].args[1].toString()).to.be.not.equal("0x0000000000000000000000000000000000000000")
        tx = await contract.test_create2_destruct();
        receipt = await tx.wait();
        console.log("-2---")
        expect(receipt.events[2].args[1].toString()).to.be.not.equal("0x0000000000000000000000000000000000000000")
    })


    it("create2 self destruct in 1tx ", async () => {
        let tx = await contract.test_create2_selfDestruct_create2();
        await tx.wait();
    })

    it("create2 invoke same contract in diff tx  again", async () => {
        let tx = await contract.test_create2_destruct();
        await tx.wait();
    })
})
