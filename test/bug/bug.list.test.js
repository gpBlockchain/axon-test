const {ethers} = require("hardhat");
const {expect} = require("chai");


describe("bug", function () {
    this.timeout(600000)

    it.skip("opz(reverts with invalid signature)",async ()=>{

        // deploy contract
        let contractInfo = await ethers.getContractFactory("ECDSAMock");
        let contract = await contractInfo.deploy()
        await contract.deployed()

        // invoke revert
        const TEST_MESSAGE = ethers.utils.sha256('0x1234')
        const signature = '0x332ce75a821c982f9127538858900d87d3ec1f9f737338ad67cad133fa48feff48e6fa0c18abc62e42820f05943e47af3e9fbe306ce74d64094bdf1691ee53e01c';
        try {
           await contract.recover(TEST_MESSAGE, signature)

        }catch (e) {
            expect(e.toString()).to.be.include('ECDSA: invalid signature')
            return
        }
        expect('').to.be.equal('failed')
    })

})