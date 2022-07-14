const {ethers} = require("hardhat");
const {sendTxToAddBlockNum} = require("../utils/rpc.js");
const {expect} = require("chai");
const {BigNumber} = require("ethers");

describe("newFilter", function () {
    this.timeout(600000)
    let fallbackAndReceiveContract;
    let logContract;
    before(async function () {
        fallbackAndReceiveContract = await ethers.getContractFactory("fallbackAndReceive");
        logContract = await ethers.getContractFactory("contracts/LogContract.sol:LogContract");
    });

    describe("newFilter",function (){

        it("demo", async ()=>{
            const filterId = await ethers.provider.send("eth_newFilter", [{}]);
            console.log(filterId);
            await sendTxToAddBlockNum(ethers.provider, 2)
            const logs = await ethers.provider.send("eth_getFilterChanges", [filterId]);
            let latestBlkNum = 0;
            let latestBlkIdx = 0;
            let latestLogIdx = 0;
            for (let i = 0; i < logs.length; i++) {
                console.log("blockNumber:", BigNumber.from(logs[i].blockNumber.toString()).toString(), "blkIdx:", logs[i].transactionIndex, "logIndex:", logs[i].logIndex)
                let nowBlkNum = BigNumber.from(logs[i].blockNumber);
                let nowBlkIdx = BigNumber.from(logs[i].transactionIndex);
                let nowLogIdx = BigNumber.from(logs[i].logIndex);
                expect(getCurrentIdx([nowBlkNum.toString(),nowBlkIdx.toString(),nowLogIdx.toString()],3)).to.be.gt(getCurrentIdx([latestBlkNum.toString(),latestBlkIdx.toString(),latestLogIdx.toString()],3));
                latestBlkNum = nowBlkNum;
                latestBlkIdx = nowBlkIdx;
                latestLogIdx = nowLogIdx;
            }
        })

        // it("test max",async() =>{
        //     //deploy contract
        //     const filterId = await ethers.provider.send("eth_newFilter", [{}]);
        //
        //     let contractInfo  = await ethers.getContractFactory("eventTestContract")
        //     let contract = await   contractInfo.deploy()
        //     for (let i = 0; i < 100; i++) {
        //         let tx = await contract.testLog(16000,{gasLimit:"0xb71b00"})
        //         // await getTxReceipt(ethers.provider,tx.hash,100)
        //     }
        //     const logs = await ethers.provider.send("eth_getFilterChanges", [filterId]);
        //
        //     console.log(logs)
        //
        // })

        // it("test max1",async() =>{
        //     //deploy contract
        //     const filterId = await ethers.provider.send("eth_newFilter", [{}]);
        //
        //     let contractInfo  = await ethers.getContractFactory("eventTestContract")
        //     let contract = await  contractInfo.deploy()
        //     await contract.deployed()
        //     for (let i = 0; i < 100; i++) {
        //         try {
        //             let tx = await contract.transferAttack(5000,{gasLimit:"0xb71b00"})
        //         }catch (e){}
        //     }
        //     const logs = await ethers.provider.send("eth_getFilterChanges", [filterId]);
        //     console.log(logs)
        //
        // })

    })



    describe("toBlock",function (){

    })

    describe("address",function (){

    })
    describe("topics",function (){

        it("[]",async ()=>{

        })

        it("[A]",async ()=>{

        })

        it("[null,b]",async ()=>{

        })

        it("[a,b]",async ()=>{

        })

        it("[[A, B], [A, B]]",async ()=>{
            let ret = getCurrentPrice(["1","0","1"],5)
            console.log('ret:',ret)
        })


    })


})

function getCurrentIdx(dataList,length){
    let ret = ""
    for (let i = 0; i < dataList.length; i++) {
        let data = "0000000000"+dataList[i].toString()
        let bb = data.substring(data.length-length,data.length)
        ret = ret+bb
    }
    ret = "1"+ ret
    return BigNumber.from(ret)
}