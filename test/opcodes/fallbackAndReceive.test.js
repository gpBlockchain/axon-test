const {ethers} = require("hardhat");
const {expect} = require("chai");
const {getTxReceipt} = require("../utils/rpc");
const {BigNumber} = require("ethers");

//fallback
// receive
receiveLogSig = "0x26002f13cda87336975286da772958298bec2da9e741d7e196bee6d11e1a4cc2"
fallbackLogSig = "0x2ed95b708d6d6c8bf930186255cc1fa24903be080fd4f7161f6fd607014af13d"
describe("fallback and receive", function () {
    this.timeout(100000)


    describe("fallbackAndReceive", function () {

        let fallbackAndReceiveContract
        before(async function () {
            const contractInfo = await ethers.getContractFactory("fallbackAndReceive");
            fallbackAndReceiveContract = await contractInfo.deploy();
            await fallbackAndReceiveContract.deployed();
        });


        it("0x with value=>receive(https://github.com/nervosnetwork/godwoken-web3/issues/335)", async () => {
            //eth_estimateGas return 0x0
            let result = await ethers.provider.send("eth_estimateGas", [{
                "to": fallbackAndReceiveContract.address, "data": "0x", "value": "0x11",
            }])
            expect(BigNumber.from(result)).to.be.gte('100')
        })

        it("0x, no value=>receive(eth_call return 0x0)", async () => {
            //eth_estimateGas return 0x0
            let result = await ethers.provider.send("eth_call", [{
                "to": fallbackAndReceiveContract.address, "data": "0x", "value": "0x11",
            }, "latest"])
            console.log(result)
        })

        it("0x ,with value=>receive", async () => {
            //eth_estimateGas return 0x0
            const beforeBalanceOfContract = await ethers.provider.getBalance(fallbackAndReceiveContract.address)
            let result = await ethers.provider.send("eth_sendTransaction", [{
                "to": fallbackAndReceiveContract.address, "data": "0x", "gas": "0xffffff", "value": "0x11",
            }])

            // check receipt contains receiveLogSig log
            const receipt = await getTxReceipt(ethers.provider, result, 10)
            expect(checkTxContainsLog(receipt, receiveLogSig)).to.be.equal(true)

            // check transfer pass
            const balanceOfContract = await ethers.provider.getBalance(fallbackAndReceiveContract.address)
            expect(balanceOfContract.sub(beforeBalanceOfContract).toHexString()).to.be.equal("0x11")

        })

        it("0x ,no value => receive", async () => {

            let result = await ethers.provider.send("eth_sendTransaction", [{
                "to": fallbackAndReceiveContract.address, "data": "0x", "gas": "0xffffff",
            }])

            // check receipt contains receiveLogSig log
            const receipt = await getTxReceipt(ethers.provider, result, 10)
            expect(checkTxContainsLog(receipt, receiveLogSig)).to.be.equal(true)

        })

        it("0xffffffff,no value => fallback", async () => {
            let result = await ethers.provider.send("eth_sendTransaction", [{
                "to": fallbackAndReceiveContract.address, "data": "0xffffffff", "gas": "0xffffff",
            }])

            const receipt = await getTxReceipt(ethers.provider, result, 10)
            expect(checkTxContainsLog(receipt, fallbackLogSig)).to.be.equal(true)

        })

        it("0xffffffff,with value => fallback", async () => {
            let result = await ethers.provider.send("eth_sendTransaction", [{
                "to": fallbackAndReceiveContract.address, "data": "0xffffffff", "gas": "0xffffff", "value": "0x11",
            }])
            const receipt = await getTxReceipt(ethers.provider, result, 20)
            expect(receipt.status).to.be.not.equal(0)
            expect(receipt.logs[0].topics[0]).to.be.equal('0x2ed95b708d6d6c8bf930186255cc1fa24903be080fd4f7161f6fd607014af13d')
        })

    })

    describe("OnlyHaveFallback", function () {

        let fallbackAndReceiveOnlyHaveFallbackContract;
        before(async function () {

            const fallbackAndReceiveOnlyHaveFallbackContractInfo = await ethers.getContractFactory("fallbackAndReceiveOnlyHaveFallback");
            fallbackAndReceiveOnlyHaveFallbackContract = await fallbackAndReceiveOnlyHaveFallbackContractInfo.deploy()
            await fallbackAndReceiveOnlyHaveFallbackContract.deployed();

        });

        it("0x, no value => fallback(bug)", async () => {
            let result = await ethers.provider.send("eth_sendTransaction", [{
                "to": fallbackAndReceiveOnlyHaveFallbackContract.address, "data": "0x", "gas": "0xffffff",
            }])
            const receipt = await getTxReceipt(ethers.provider, result, 10)

            // check invoke fallback
            expect(checkTxContainsLog(receipt, fallbackLogSig)).to.be.equal(true)

        })
        it("0x with value => fallback", async () => {
            let result = await ethers.provider.send("eth_sendTransaction", [{
                "to": fallbackAndReceiveOnlyHaveFallbackContract.address,
                "data": "0xffffffff",
                "gas": "0xffffff",
                "value": "0x11",
            }])
            const receipt = await getTxReceipt(ethers.provider, result, 20)

            // check is
            expect(checkTxContainsLog(receipt, fallbackLogSig)).to.be.equal(true)

        })

        it("0xffffffff，no value => fallback", async () => {
            let result = await ethers.provider.send("eth_sendTransaction", [{
                "to": fallbackAndReceiveOnlyHaveFallbackContract.address, "data": "0xffffffff", "gas": "0xffffff",
            }])
            const receipt = await getTxReceipt(ethers.provider, result, 10)

            // check invoke fallback
            expect(checkTxContainsLog(receipt, fallbackLogSig)).to.be.equal(true)

        })

        it("0xffffff ,with value => fallback", async () => {
            let result = await ethers.provider.send("eth_sendTransaction", [{
                "to": fallbackAndReceiveOnlyHaveFallbackContract.address,
                "data": "0xffffffff",
                "gas": "0xffffff",
                "value": "0x11",
            }])
            const receipt = await getTxReceipt(ethers.provider, result, 10)

            // check invoke fallback
            expect(checkTxContainsLog(receipt, fallbackLogSig)).to.be.equal(true)

        })
    })

    describe("NoFallbackAndReceive", function () {
        let noFallbackAndReceive
        before(async function () {

            const NoFallbackAndReceiveInfo = await ethers.getContractFactory("contracts/fallbackAndReceive.sol:NoFallbackAndReceive")
            noFallbackAndReceive = await NoFallbackAndReceiveInfo.deploy()
            await noFallbackAndReceive.deployed();
        });
        it("0x ,with value", async () => {
            let result = await ethers.provider.send("eth_sendTransaction", [{
                "to": noFallbackAndReceive.address, "data": "0x", "gas": "0xffffff", "value": "0x11",
            }])
            const receipt = await getTxReceipt(ethers.provider, result, 20)

            // check tx is failed
            expect(receipt.status).to.be.equal(0)

        })

        it("0x,no value", async () => {
            let result = await ethers.provider.send("eth_sendTransaction", [{
                "to": noFallbackAndReceive.address, "data": "0x", "gas": "0xffffff",
            }])
            const receipt = await getTxReceipt(ethers.provider, result, 10)

            // check tx is failed
            expect(receipt.status).to.be.equal(0)
        })

        it("0xffffffff,value", async () => {
            let result = await ethers.provider.send("eth_sendTransaction", [{
                "to": noFallbackAndReceive.address, "data": "0xffffffff", "gas": "0xffffff", "value": "0x11",
            }])
            const receipt = await getTxReceipt(ethers.provider, result, 20)

            // check tx is failed
            expect(receipt.status).to.be.equal(0)
        })

        it("0xffffffff,no value", async () => {
            let result = await ethers.provider.send("eth_sendTransaction", [{
                "to": noFallbackAndReceive.address, "data": "0xffffffff", "gas": "0xffffff",
            }])
            const receipt = await getTxReceipt(ethers.provider, result, 20)

            // check tx is failed
            expect(receipt.status).to.be.equal(0)
        })

    })

})

function checkTxContainsLog(txReceipt, topicLogSig) {
    return txReceipt.logs.filter(log => log.topics[0] === topicLogSig).length >= 1
}
