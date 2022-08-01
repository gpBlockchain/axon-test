const {ethers} = require("hardhat");
const {sendTxToAddBlockNum} = require("../utils/rpc.js");
const {expect} = require("chai");
const {BigNumber} = require("ethers");

describe("newFilter", function () {
    this.timeout(600000)

    it("invoke eth_getFilterChanges 2 times, should seconde must be 0 ", async () => {
        const filterId = await ethers.provider.send("eth_newFilter", [{}]);
        console.log(filterId);
        await sendTxToAddBlockNum(ethers.provider, 3)
        let logs = await ethers.provider.send("eth_getFilterChanges", [filterId]);
        checkLogsIsSort(logs)
        logs = await ethers.provider.send("eth_getFilterChanges", [filterId]);
        expect(logs.toString()).to.be.equal('')
    })

    it("invoke eth_getFilterChanges 1 send tx,send eth_getFilterChanges again  , should second num = 1st num+1  ", async () => {
        const filterId = await ethers.provider.send("eth_newFilter", [{}]);
        console.log(filterId);
        await sendTxToAddBlockNum(ethers.provider, 2)
        let logs1 = await ethers.provider.send("eth_getFilterChanges", [filterId]);
        checkLogsIsSort(logs1)
        await sendTxToAddBlockNum(ethers.provider, 1)
        let logs2 = await ethers.provider.send("eth_getFilterChanges", [filterId]);
        console.log('---1---')
        checkLogsIsSort(logs1)
        console.log('---2---')
        checkLogsIsSort(logs2)
        if(logs1.length === 0 || logs2.length === 0){
            return
        }
        expect(BigNumber.from(logs1[logs1.length-1].blockNumber.toString()).add(1).toString()).to.be.equal(BigNumber.from(logs2[logs2.length-1].blockNumber.toString()))

    })

    it("0xffffffffffffffffffffffffffffff", async () => {
        const filterId = await ethers.provider.send("eth_newFilter", [{
            "fromBlock": "0xff"
        }]);
        console.log(filterId);
        await sendTxToAddBlockNum(ethers.provider, 3)
        let logs = await ethers.provider.send("eth_getFilterChanges", [filterId]);
        checkLogsIsSort(logs)
        logs = await ethers.provider.send("eth_getFilterChanges", [filterId]);
        expect(logs.toString()).to.be.equal('')
    })

    //topics
    describe("fromBlock toBlock", function () {
        let filterMsg;
        let blockHeight;

        before(async function () {
            blockHeight = await ethers.provider.getBlockNumber()
            filterMsg = await getFilterMsgByFilter(
                {
                    "fromBlock.earliest": {
                        'fromBlock': 'earliest'
                    },
                    "fromBlock.pending": {
                        'fromBlock': 'pending'
                    },
                    "fromBlock.latest": {
                        'fromBlock': 'latest'
                    },
                    "fromBlock.0x0": {
                        'fromBlock': '0x0'
                    },
                    "fromBlock.blockHeight": {
                        'fromBlock': BigNumber.from(blockHeight).toHexString().replace('0x0', '0x')
                    },
                    "fromBlock.blockHeight+2": {
                        'fromBlock': BigNumber.from(blockHeight).add(2).toHexString().replace('0x0', '0x')
                    },
                    "fromBlock.blockHeight+1000": {
                        'fromBlock': BigNumber.from(blockHeight).add(1000).toHexString().replace('0x0', '0x')
                    },
                    "fromBlock.0xffffffffffffffffffffffffffffff": {
                        'fromBlock': '0xffffffffffffffffffffffffffffff'
                    },
                    "toBlock.earliest": {
                        "toBlock": "earliest"
                    },
                    "toBlock.pending": {
                        "toBlock": "pending"
                    },
                    "toBlock.latest": {
                        "toBlock": "latest"
                    },
                    "toBlock.height-1": {
                        "fromBlock": '0x0',
                        "toBlock": BigNumber.from(blockHeight).sub(1).toHexString().replace('0x0', '0x')
                    },
                    "toBlock.height": {
                        "fromBlock": '0x0',
                        "toBlock": BigNumber.from(blockHeight).toHexString().replace('0x0', '0x')
                    },
                    "toBlock.height+1": {
                        "fromBlock": '0x0',
                        "toBlock": BigNumber.from(blockHeight).add(1).toHexString().replace('0x0', '0x')
                    },
                    "toBlock.height+10000": {
                        "fromBlock": '0x0',
                        "toBlock": BigNumber.from(blockHeight).add(10000).toHexString().replace('0x0', '0x')
                    },
                    "toBlock.0xffffffffffffffffffffffffffffffff": {
                        "fromBlock": '0x0',
                        "toBlock": "0xffffffffffffffffffffffffffffffff"
                    },
                }, 3)
        });


        describe("fromBlock", function () {

            it("earliest,should return all logs", async () => {
                console.log('block num:',)
                await checkLogsGteHeight(filterMsg["fromBlock.earliest"].logs, blockHeight)
                await checkLogsIsSort(filterMsg["fromBlock.earliest"].logs)
            })

            it("pending,should return error msg", async () => {
                //invalid from and to block combination: from > to
                expect(filterMsg["fromBlock.pending"].error).to.be.not.equal(undefined)

            })

            it("latest,should return all logs ", async () => {
                await checkLogsGteHeight(filterMsg["fromBlock.latest"].logs, blockHeight)
                await checkLogsIsSort(filterMsg["fromBlock.latest"].logs)
            })

            it("blockNumber(0x0),should return all logs", async () => {
                await checkLogsGteHeight(filterMsg["fromBlock.0x0"].logs, blockHeight)
                await checkLogsIsSort(filterMsg["fromBlock.0x0"].logs)
            })

            it("blockNumber(blockHeight),should return all logs ", async () => {
                await checkLogsGteHeight(filterMsg["fromBlock.blockHeight"].logs, blockHeight)
                await checkLogsIsSort(filterMsg["fromBlock.blockHeight"].logs)
            })

            it("blockNumber(blockHeight+2),should return (blockHeight+2)'s log", async () => {

                await checkLogsGteHeight(filterMsg["fromBlock.blockHeight+2"].logs, blockHeight + 2)
                await checkLogsIsSort(filterMsg["fromBlock.blockHeight+2"].logs)
            })
            it("blockNumber(blockHeight+1000),should return 0 log", async () => {

                expect(filterMsg["fromBlock.blockHeight+1000"].logs.length).to.be.equal(0)
            })
            it("blockNumber(0xffffffffffffffffffffffffffffff),should return error msg", async () => {
                //invalid argument 0: hex number > 64 bits
                console.log(filterMsg["fromBlock.0xffffffffffffffffffffffffffffff"].error)
                expect(filterMsg["fromBlock.0xffffffffffffffffffffffffffffff"].error).to.be.not.equal(undefined)
            })
        })

        describe("toBlock > fromBlock", function () {

            it("earliest,should return error msg", async () => {
                console.log(filterMsg["toBlock.earliest"])
                //invalid from and to block combination: from > to
                expect(filterMsg["toBlock.earliest"].error).to.be.not.equal(undefined)
            })

            it("pending,should return error msg", async () => {
                await checkLogsGteHeight(filterMsg["toBlock.pending"].logs, blockHeight)
                await checkLogsIsSort(filterMsg["toBlock.pending"].logs)
            })

            it("latest,should return all logs ", async () => {

                await checkLogsGteHeight(filterMsg["toBlock.latest"].logs, blockHeight)
                await checkLogsIsSort(filterMsg["toBlock.latest"].logs)
            })

            it("blockNumber(height-1),should return  0 log", async () => {
                expect(filterMsg["toBlock.height-1"].logs.length).to.be.equal(0)
            })

            it("blockNumber(height),should return 0 log", async () => {
                //todo check axon first block number
                console.log(filterMsg["toBlock.height"].filterMap)
                //invalid from and to block combination: from > to
                await checkLogsLteHeight(filterMsg["toBlock.height"].logs, blockHeight)
                expect(filterMsg["toBlock.height"].logs.length).to.be.equal(0)

            })

            it("blockNumber(height+1),should return 0 log", async () => {
                await checkLogsLteHeight(filterMsg["toBlock.height+1"].logs, blockHeight + 1)
                await checkLogsIsSort(filterMsg["toBlock.height+1"].logs)

            })

            it("blockNumber(height+10000),should return ", async () => {
                await checkLogsGteHeight(filterMsg["toBlock.latest"].logs, blockHeight)
                await checkLogsIsSort(filterMsg["toBlock.latest"].logs)
            })

            it("blockNumber(0xffffffffffffffffffffffffffffffff)", async () => {

                //"toBlock.0xffffffffffffffffffffffffffffffff"
                expect(filterMsg["toBlock.0xffffffffffffffffffffffffffffffff"].error).to.be.not.equal(undefined)

            })
        })


        it("fromBlock > toBLock", async () => {

        })

        it("from = pending ,to latest", async () => {

        })

    })

    describe("address topics", function () {

        // [] "anything"
        // [A] "A in first position (and anything after)"
        // [null, B] "anything in first position AND B in second position (and anything after)"
        // [A, B] "A in first position AND B in second position (and anything after)"
        // [[A, B], [A, B]] "(A OR B) in first position AND (A OR B) in second position (and anything after)"
        let contractAddress;

        let topic0="0x0000000000000000000000000000000000000000000000000000000000000001";
        let topic1="0x0000000000000000000000000000000000000000000000000000000000000002";
        let topic2="0x0000000000000000000000000000000000000000000000000000000000000003";
        let topic3="0x0000000000000000000000000000000000000000000000000000000000000004";
        let filterMsgMap;
        let eventContract;
        let blockHeight;

        before(async function () {
            blockHeight = await ethers.provider.getBlockNumber()
            filterMsgMap = {}
            //deploy contract
            let eventContractInfo = await ethers.getContractFactory("eventTestContract");
            eventContract = await eventContractInfo.deploy()
            await eventContract.deployed()
            contractAddress = eventContract.address
            let topicsMap = {
                "topics.[]": {
                    "topics": []
                },
                "topics.[A].yes": {
                    "topics": [topic0]
                },
                "topics.[A].no": {
                    "topics": [topic1]
                },
                "topic.[null,b].yes": {
                    "topics": [null, topic1]
                },
                "topic.[null,b].no": {
                    "topics": [null, topic2]
                },
                "topic.[a,b].yes": {
                    "topics": [topic0, topic1]
                },
                "topic.[a,b].no": {
                    "topics": [topic0, topic2]
                },
                "topic.[[A, B],[A, B]].yes": {
                    "topics": [[topic3, topic0], [null, null, topic2]]
                },
                "topic.[[A, B],[A, B]].no": {
                    "topics": [[topic0, topic2,topic3], [null, topic2],[topic1]]
                },

                "topic.address.exist":{
                    "address":[contractAddress]
                },
                "topic.address.no":{
                    "address":[await ethers.provider.getSigner().getAddress()]
                },
                "topic.address.no.notExist":{
                    "address":""
                },

            }

            // register filter Id
            for (const key in topicsMap) {
                filterMsgMap[key] = {}
                try {
                    filterMsgMap[key].filterId = await ethers.provider.send("eth_newFilter", [topicsMap[key]])
                }catch (e){
                    filterMsgMap[key].error = e
                }
            }
            let txList = []


            // send 100 tx
            // eventContract = eventContract.connect(await ethers.provider.getSigner(1));
            let nonce = await ethers.provider.getTransactionCount(eventContract.signer.address,"latest")

            // let address = await ethers.provider.getSigner(1).getAddress()
            //  nonce = await ethers.provider.send('eth_getTransactionCount',[address])
            for (let i = 0; i < 5; i++) {

                let tx = await eventContract.testLog4(500, {nonce: nonce})
                await sleep(50)
                nonce++
                txList.push(tx)
            }
            for (let i = 0; i < txList.length; i++) {
                await txList[i].wait()
            }

            for (const key in filterMsgMap) {
                console.log('key:',key)
                if(filterMsgMap[key].filterId === undefined){
                        continue
                }
                try {
                    filterMsgMap[key].logs = await ethers.provider.send("eth_getFilterChanges", [filterMsgMap[key].filterId])
                }catch (e){
                    filterMsgMap[key].error = e
                }
            }

        })

        describe("address", function () {
            it("address list exist ", async () => {
                //"topic.address.exist"
                await checkLogsGteHeight(filterMsgMap["topic.address.exist"].logs, blockHeight)
                await checkLogsIsSort(filterMsgMap["topic.address.exist"].logs)

            })
            it("address list no exist  ", async () => {

                //"topic.address.no"
                expect(filterMsgMap["topic.address.no"].logs.length).to.be.equal(0)

            })

        })

        describe("topics", function () {

            it("[]", async () => {
                console.log('---')
                await checkLogsGteHeight(filterMsgMap["topics.[]"].logs, blockHeight)
                await checkLogsIsSort(filterMsgMap["topics.[]"].logs)
            })

            it("[A].ok", async () => {
                console.log('')
                await checkLogsGteHeight(filterMsgMap["topics.[A].yes"].logs, blockHeight)
                await checkLogsIsSort(filterMsgMap["topics.[A].yes"].logs)
            })
            it("[A].no", async () => {
                console.log('')
                expect(filterMsgMap["topics.[A].no"].logs.length).to.be.equal(0)
            })

            it("[null,b].yes", async () => {
                await checkLogsGteHeight(filterMsgMap["topic.[null,b].yes"].logs, blockHeight)
                await checkLogsIsSort(filterMsgMap["topic.[null,b].yes"].logs)
            })

            it("[null,b].no", async () => {
                await checkLogsGteHeight(filterMsgMap["topic.[null,b].no"].logs, blockHeight)
                await checkLogsIsSort(filterMsgMap["topic.[null,b].no"].logs)
            })

            it("[a,b].yes", async () => {
                //"topic.[a,b].yes"
                await checkLogsGteHeight(filterMsgMap["topic.[a,b].yes"].logs, blockHeight)
                await checkLogsIsSort(filterMsgMap["topic.[a,b].yes"].logs)
            })

            it("[a,b].no", async () => {
                //"topic.[a,b].no"
                expect(filterMsgMap["topic.[a,b].no"].logs.length).to.be.equal(0)

            })

            it("[[A, B], [A, B]].yes", async () => {
                await checkLogsGteHeight(filterMsgMap["topic.[[A, B],[A, B]].yes"].logs, blockHeight)
                await checkLogsIsSort(filterMsgMap["topic.[[A, B],[A, B]].yes"].logs)
            })

            it("[[A, B], [A, B]].no", async () => {
                expect(filterMsgMap["topic.[[A, B],[A, B]].no"].logs.length).to.be.equal(0)

            })

        })

    })

})

// function

function getCurrentIdx(dataList, length) {
    let ret = ""
    for (let i = 0; i < dataList.length; i++) {
        let data = "0000000000" + dataList[i].toString()
        let bb = data.substring(data.length - length, data.length)
        ret = ret + bb
    }
    ret = "1" + ret
    return BigNumber.from(ret)
}

async function getFilterMsgByFilter(filterMap, sendBlkNum) {
    let FilterMsg = {}
    for (let key in filterMap) {
        console.log('key:', key)
        console.log('value:', filterMap[key])
        FilterMsg[key] = {}
        try {
            FilterMsg[key].filterMap = filterMap
            FilterMsg[key].filterId = await ethers.provider.send("eth_newFilter", [filterMap[key]])
        } catch (e) {
            FilterMsg[key].error = e
        }
    }
    await sendTxToAddBlockNum(ethers.provider, sendBlkNum)
    for (let key in FilterMsg) {
        try {
            if (FilterMsg[key].filterId === undefined) {
                continue
            }
            FilterMsg[key].logs = await ethers.provider.send("eth_getFilterChanges", [FilterMsg[key].filterId])
        } catch (e) {
            FilterMsg[key].error = e
        }
    }
    return FilterMsg
}

async function getTopicFilterMsgByFilter(filterMap, sendBlkNum) {
    let FilterMsg = {}
    for (let key in filterMap) {
        console.log('key:', key)
        console.log('value:', filterMap[key])
        FilterMsg[key] = {}
        try {
            FilterMsg[key].filterId = await ethers.provider.send("eth_newFilter", [filterMap[key]])
        } catch (e) {
            FilterMsg[key].error = e
        }
    }
    await sendTxToAddBlockNum(ethers.provider, sendBlkNum)
    for (let key in FilterMsg) {
        try {
            if (FilterMsg[key].filterId === undefined) {
                continue
            }
            FilterMsg[key].logs = await ethers.provider.send("eth_getFilterChanges", [FilterMsg[key].filterId])
        } catch (e) {
            FilterMsg[key].error = e
        }
    }
    return FilterMsg
}

async function checkLogsLteHeight(logs, blockHeight) {
    for (const log of logs) {
        expect(BigNumber.from(log.blockNumber)).to.be.lte(blockHeight)
    }
}

async function checkLogsGteHeight(logs, blockHeight) {
    for (const log of logs) {
        expect(BigNumber.from(log.blockNumber)).to.be.gte(blockHeight)
    }
}

function checkLogsIsSort(logs) {
    let latestBlkNum = 0;
    let latestBlkIdx = 0;
    let latestLogIdx = 0;
    for (let i = 0; i < logs.length; i++) {
        console.log("blockNumber:", BigNumber.from(logs[i].blockNumber.toString()).toString(), "blkIdx:", logs[i].transactionIndex, "logIndex:", logs[i].logIndex)
        let nowBlkNum = BigNumber.from(logs[i].blockNumber);
        let nowBlkIdx = BigNumber.from(logs[i].transactionIndex);
        let nowLogIdx = BigNumber.from(logs[i].logIndex);
        expect(getCurrentIdx([nowBlkNum.toString(), nowBlkIdx.toString(), nowLogIdx.toString()], 5)).to.be.gt(getCurrentIdx([latestBlkNum.toString(), latestBlkIdx.toString(), latestLogIdx.toString()], 5));
        latestBlkNum = nowBlkNum;
        latestBlkIdx = nowBlkIdx;
        latestLogIdx = nowLogIdx;
    }
}


async function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}
