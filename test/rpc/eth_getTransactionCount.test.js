const {ethers} = require("hardhat");
const {expect} = require("chai");
const {eth_getTransactionCount,eth_getBalance,transferCkb,getDeployLogContractAddress,getSelfDestructContractAddress,invokeContract} = require("../utils/rpc.js");


describe("eth_getTransactionCount", function () {
    this.timeout(600000)
    const unSendTxAddress = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92212"
    const unSendTxAndHaveCkbAddress = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92211"
    let  sendTxAndHaveCkbAddress
    let contractAddress = ""
    let  no0xAndUpperCaseAddress = ""
    let destructContractAddress
    before(async function(){
        // transfer ckb to unSendTxAndHaveCkbAddress
        await transferCkb(unSendTxAndHaveCkbAddress,'0x1')
        // init sendTxAndHaveCkbAddress
        sendTxAndHaveCkbAddress = await ethers.provider.getSigner(0).getAddress()
        no0xAndUpperCaseAddress = sendTxAndHaveCkbAddress.substring(2).toUpperCase()
        // init contract address
        contractAddress = await getDeployLogContractAddress()
        let destructContractAddress  = await getSelfDestructContractAddress()
        // let selfDestructPayload =  selfContract.methods.selfDestruct.encodeABI()
        let selfDestructPayload = "0x9cb8a26a"
        await invokeContract(destructContractAddress,selfDestructPayload)
        console.log('sendTxAndHaveCkbAddress:',sendTxAndHaveCkbAddress)
        console.log('contractAddress:',contractAddress)
        console.log('no0xAndUpperCaseAddress:',no0xAndUpperCaseAddress)
        console.log('destructContractAddress:',destructContractAddress)
    })

    it("query account that account not have 0x and upper",async function (){
        //please check
        // hardhat => supplied to : ADDRESS
        // eth => "invalid argument 0: json: cannot unmarshal hex string without 0x prefix into Go value of type common.Address"
        // axon => successful
        // must use send , if use eth_getTransactionCount will auto : no0xAndUpperCaseAddress => normal Address
        let nonceMap = await ethers.provider.send('eth_getTransactionCount',[no0xAndUpperCaseAddress,'latest'])
        expect(nonceMap.latestNonce).to.be.not.equal(0)
    })

    it("query account that not  send tx and not have ckb ", async function () {
        let nonceMap = await eth_getTransactionCount(unSendTxAddress)
        expect(nonceMap.earliestNonce).to.be.equal(0)
        expect(nonceMap.pendingNonce).to.be.equal(0)
        expect(nonceMap.latestNonce).to.be.equal(0)
    })

    it("query account that not send tx but have ckb ", async function () {
        // check address ckb > 0
        let balanceMap = await eth_getBalance(unSendTxAndHaveCkbAddress)
        expect(balanceMap.latestBalance).to.be.not.equal(0)
        // get nonce
        let nonceMap = await eth_getTransactionCount(unSendTxAndHaveCkbAddress)
        expect(nonceMap.earliestNonce).to.be.equal(0)
        expect(nonceMap.pendingNonce).to.be.equal(0)
        expect(nonceMap.latestNonce).to.be.equal(0)
    })

    it("query account that have ckb and send tx past ", async function () {
        let nonceMap = await eth_getTransactionCount(sendTxAndHaveCkbAddress)
        expect(nonceMap.earliestNonce).to.be.equal(0)
        expect(nonceMap.pendingNonce).to.be.not.equal(0)
        expect(nonceMap.latestNonce).to.be.not.equal(0)

    })

    it("query account that account is contractAddress", async function () {
        let nonceMap = await eth_getTransactionCount(contractAddress)
        expect(nonceMap.earliestNonce).to.be.equal(0)
        expect(nonceMap.pendingNonce).to.be.equal(0)
        expect(nonceMap.latestNonce).to.be.equal(0)
    })

    it("query account that account is destruct contractAddress", async function () {
        let nonceMap = await eth_getTransactionCount(destructContractAddress)
        expect(nonceMap.earliestNonce).to.be.equal(0)
        expect(nonceMap.pendingNonce).to.be.equal(0)
        expect(nonceMap.latestNonce).to.be.equal(0)
    })


})

