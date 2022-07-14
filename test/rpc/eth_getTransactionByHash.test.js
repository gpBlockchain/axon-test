const {ethers} = require("hardhat");
const {expect} = require("chai");

describe("eth_getTransactionByHash", function () {

    it("getTransactionByHash not exist hash => null",async ()=>{
        let response = await ethers.provider.send("eth_getTransactionByHash",["0xb2fea9c4b24775af6990237aa90228e5e092c56bdaee74496992a53c208da1ee"])
        expect(response).to.be.equal(null)
    })
})