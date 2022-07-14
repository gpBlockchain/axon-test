const {ethers} = require("hardhat");
const {expect} = require("chai");
const {getGasPrice, getTxReceipt, BigInterToHexString} = require("../utils/rpc.js");
const {BigNumber} = require("ethers");

describe("eth_sendRawTransaction ", function () {

    this.timeout(600000)
    let contract;
    let fallbackAndReceiveContract;
    let logContract;
    before(async function () {
        fallbackAndReceiveContract = await ethers.getContractFactory("fallbackAndReceive");
        logContract = await ethers.getContractFactory("contracts/LogContract.sol:LogContract");
    });

    describe("to", async function () {
        it("to is EOA Address, should return hash", async () => {
            let gasPrice = await getGasPrice(ethers.provider);
            console.log("gasPrice:", gasPrice)
            let tx = await ethers.provider.send("eth_sendTransaction", [{
                "to": "0x0c1efcca2bcb65a532274f3ef24c044ef4ab6d73",
                "gas": "0x76c000",
                "gasPrice": gasPrice,
                "value": "0x9184e72a",
                "data": "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675"
            }]);
            expect(tx).to.be.include('0x')
            await getTxReceipt(ethers.provider,tx,100)
        }).timeout(5000)

        it("to is not exist Address,should return txHash", async () => {
            let tx = await ethers.provider.send("eth_sendTransaction", [{
                "to": "0x0c1efcca2bcb65a532274f3ef24c044ef4ab6d72",
                "gas": "0xffffff",
            }]);
            expect(tx).to.be.include('0x')
            await getTxReceipt(ethers.provider,tx,100)
        }).timeout(5000)

        it("to is  contract Address and contains fallback ,should return hash", async () => {
            // deploy contains fallback contract
            contract = await fallbackAndReceiveContract.deploy();
            await contract.deployed();
            // send token to fallback contract
            console.log('deploy success:',contract.address)
            let tx = await ethers.provider.send("eth_sendTransaction", [{
                "to": contract.address,
                "value": "0x1",
            }]);
            let response = await getTxReceipt(ethers.provider, tx, 100)
            console.log("response:", response)
            expect(response.status).to.be.equal(1)
            let balanceOfContract = await ethers.provider.getBalance(contract.address)
            expect(balanceOfContract).to.be.equal(1)
        })

        it("to is null => deploy tx,should tx receipt\'s contract must not null", async () => {
            let tx = await ethers.provider.send("eth_sendTransaction", [{
                "gas": "0x76c000",
                "data": fallbackAndReceiveContract.bytecode
            }]);
            let response = await getTxReceipt(ethers.provider, tx, 100)
            console.log("response:", response)
            expect(response.to).to.be.equal(null)
            expect(response.contractAddress).to.be.contains("0x")
        }).timeout(50000)

        it("to is 0x0 ,should like transfer tx ", async () => {
                let tx = await ethers.provider.send("eth_sendTransaction", [{
                    "to": "0x0000000000000000000000000000000000000000",
                    "gas": "0x76c000",
                    "data": fallbackAndReceiveContract.bytecode
                }]);
                let response = await getTxReceipt(ethers.provider, tx, 100)
                expect(response.contractAddress).to.be.equal(null)
                expect(response.to).to.be.equal('0x0000000000000000000000000000000000000000')
        }).timeout(50000)
    })

    describe("gasLimit", function () {

        it("gasLimit default,should  invoke successful", async () => {
            let tx = await ethers.provider.send("eth_sendTransaction", [{
                "data": fallbackAndReceiveContract.bytecode
            }]);
            let response = await getTxReceipt(ethers.provider, tx, 100)
            console.log("tx:", tx)
            console.log("response:", response)
            expect(response.status).to.be.equal(1)
        })

        it("gasLimit very min => out of gas(https://github.com/nervosnetwork/godwoken-web3/issues/382)", async () => {
            try {
                let tx = await ethers.provider.send("eth_sendTransaction", [{
                    "gas": "0x1",
                    "data": fallbackAndReceiveContract.bytecode
                }]);
                let response = await getTxReceipt(ethers.provider,tx,100)
                let txMsg = await ethers.provider.getTransaction(tx)
                console.log('response:',response)
                console.log('txMsg:',txMsg)
            } catch (e) {
                return
            }
            expect("").to.be.include("expected throw out of gas")
        }).timeout(50000)

        it("gasLimit is 1 => out of gas(https://github.com/nervosnetwork/godwoken-web3/issues/382)", async () => {
            try {
                let tx = await ethers.provider.send("eth_sendTransaction", [{
                    "gas": "0x1",
                    "data": fallbackAndReceiveContract.bytecode
                }]);
                let response = await getTxReceipt(ethers.provider,tx)
                let txMsg = await ethers.provider.getTransaction(tx)
                console.log('response:',response)
                console.log('tx msg:',txMsg)
            } catch (e) {
                return
            }
            expect("").to.be.include("expected throw out of gas")
        }).timeout(50000)

        it("gasLimit is 0 => out of gas", async () => {

            try {
                let tx = await ethers.provider.send("eth_sendTransaction", [{
                    "gas": "0x0",
                    "data": fallbackAndReceiveContract.bytecode
                }]);
            } catch (e) {
                expect(e.toString()).to.be.contains("gas")
                return
            }
            expect("").to.be.contains("expected throw out of gas")
        }).timeout(50000)

        it("gasLimit very large => exceeds  gas limit(https://github.com/nervosnetwork/godwoken-web3/issues/259)", async () => {
            let gasPrice = await getGasPrice(ethers.provider);
            console.log("begin")
            try {
                await ethers.provider.send("eth_sendTransaction", [{
                    "gas": "0xffffffffff",
                    "gasPrice": gasPrice,
                    "data": fallbackAndReceiveContract.bytecode
                }]);
            } catch (e) {
                return
            }
            expect("").to.be.contains("expected throw out of gas ：https://github.com/nervosnetwork/godwoken-web3/issues/259")
        }).timeout(50000)


    })

    describe("gasPrice", function () {

        it("gasPrice is zero => to do( wait ) invoke success", async () => {
            try {
                let tx = await ethers.provider.send("eth_sendTransaction", [{
                    "gasPrice": "0x0",
                    "data": fallbackAndReceiveContract.bytecode
                }]);

                let response = await getTxReceipt(ethers.provider,tx,100)
                let txMsg = await ethers.provider.getTransaction(tx);
                console.log('tx msg:',txMsg)
            } catch (e) {
                return
            }
            expect('').to.be.equal('failed')
        })

        it("gasPrice is very max  => sender doesn't have enough funds to send tx", async () => {
            try {
                let tx = await ethers.provider.send("eth_sendTransaction", [{
                    "gasPrice": "0xfffffffffffffffff",
                    "data": fallbackAndReceiveContract.bytecode,
                    'gas':"0xffffff",
                }]);
                console.log("tx:", tx)
                let response = await getTxReceipt(ethers.provider, tx, 100)
                console.log("response :", response)
                let txInfo = await ethers.provider.getTransaction(tx)
                console.log("txInfo:", txInfo)
            } catch (e) {
                return
            }
            expect("").to.be.contains("expected throw out of gas")
        }).timeout(50000)

    })

    describe("value", function () {

        it("value is 0=> normal tx", async () => {
            let account0Address = await ethers.provider.getSigner(0).getAddress()
            let beforeDeployBalance = await ethers.provider.getBalance(account0Address)
            let tx = await ethers.provider.send("eth_sendTransaction", [{
                "data": fallbackAndReceiveContract.bytecode,
                "value": null,
            }]);
            let response = await getTxReceipt(ethers.provider, tx, 20)
            let txMsg = await ethers.provider.getTransaction(tx)
            let afterDeployBalance = await ethers.provider.getBalance(account0Address)
            expect(beforeDeployBalance.sub(response.gasUsed.mul(txMsg.gasPrice))).to.be.equal(afterDeployBalance);
        })

        it("value is 500 =>  to+500 ,from -500", async () => {
            let account0Address = await ethers.provider.getSigner(0).getAddress();
            let beforeDeployBalance = await ethers.provider.getBalance(account0Address)
            let tx = await ethers.provider.send("eth_sendTransaction", [{
                "data": logContract.bytecode,
                "value": "0x5",
            }]);
            let response = await getTxReceipt(ethers.provider, tx, 100)
            let afterDeployBalance = await ethers.provider.getBalance(account0Address)
            let contractBalance = await ethers.provider.getBalance(response.contractAddress)
            expect(beforeDeployBalance.sub(BigNumber.from("0x5"))).to.be.gte(afterDeployBalance);
            expect(contractBalance).to.be.equal(BigNumber.from("0x5"));
        })


        it("value > from balance => faild tx:sender doesn't have enough funds to send tx", async () => {
            try {
                await ethers.provider.send("eth_sendTransaction", [{
                    "data": fallbackAndReceiveContract.bytecode,
                    "value": "0x5000000000000000000000000000000",
                    "gas":"0xfffff"
                }]);
            } catch (e) {
                return
            }
            expect('').to.be.equal('failed')

        })
    })
    describe("value gas gasPrice", function () {
        it("balance = balance-value-gasPrice*gasUsed", async () => {

            let beforeDeployBalance = await ethers.provider.getBalance(ethers.provider.getSigner(0).getAddress())
            let tx = await ethers.provider.send("eth_sendTransaction", [{
                "data": logContract.bytecode,
                "value": "0x11",
            }]);
            let response = await getTxReceipt(ethers.provider, tx, 10)
            let txMsg = await ethers.provider.getTransaction(tx)
            let afterDeployBalance = await ethers.provider.getBalance(ethers.provider.getSigner(0).getAddress())
            expect(beforeDeployBalance.sub(txMsg.gasPrice.mul(response.gasUsed)).sub(txMsg.value)).to.be.equal(afterDeployBalance);
        })

    })

    describe("data ,to ", function () {
        it("to has fallback func,data is 0x", async () => {
            let contract = await fallbackAndReceiveContract.deploy();
            await contract.deployed()
            console.log("address:", contract.address)
            let tx = await ethers.provider.send("eth_sendTransaction", [{
                "to": contract.address,
                "data": null,
            }]);
            let response = await getTxReceipt(ethers.provider, tx, 100)
            console.log("response:", response)
        })

        it("data payload to is null=> deploy", async () => {
            let tx = await ethers.provider.send("eth_sendTransaction", [{
                "to": null,
                "data": logContract.bytecode,
            }])
            let response = await getTxReceipt(ethers.provider, tx, 100)
            console.log("response:", response)
        })

        describe("nonce", function () {
            it("tx is normal  => return nonce eq between pending and  latest ", async () => {

                let currentAddress = await ethers.provider.getSigner().getAddress();
                let sendBeforeNonces = await getTxCount(currentAddress);
                let penddingNonce = await ethers.provider.getTransactionCount(ethers.provider.getSigner().getAddress(), "pending")
                await ethers.provider.getSigner().sendTransaction({
                    "to": null,
                    "nonce": penddingNonce,
                    "data": logContract.bytecode,
                })
                let sendReturnHashNonces = await getTxCount(currentAddress);
                expect(sendBeforeNonces[0]).to.be.equal(sendBeforeNonces[1])
                expect(sendReturnHashNonces[0]).to.be.equal(sendReturnHashNonces[1])
                expect(sendBeforeNonces[0] + 1).to.be.equal(sendReturnHashNonces[1])
            })

            it("tx is failed tx => pending and  latest  update ", async () => {

                let currentAddress = await ethers.provider.getSigner().getAddress();
                let sendBeforeNonces = await getTxCount(currentAddress);
                let penddingNonce = await ethers.provider.getTransactionCount(ethers.provider.getSigner().getAddress(), "pending")
                let beforeBalance = await ethers.provider.getBalance(currentAddress)
                let tx = await ethers.provider.send("eth_sendTransaction", [{
                    "to": null,
                    "gas": "0xffffff",
                    "nonce": BigInterToHexString(BigNumber.from(penddingNonce)),
                    "data": "0x12122121121211212211",
                }])
                let receipt = await getTxReceipt(ethers.provider, tx, 100)
                let txMsg = await ethers.provider.getTransaction(tx);
                let afterBalance = await ethers.provider.getBalance(currentAddress)
                let sendReturnHashNonces = await getTxCount(currentAddress)
                expect(sendBeforeNonces[0]).to.be.equal(sendBeforeNonces[1])
                expect(sendReturnHashNonces[0]).to.be.equal(sendReturnHashNonces[1])
                expect(sendBeforeNonces[0] + 1).to.be.equal(sendReturnHashNonces[1])

                // after balance = before - gasUsed* gasPrice
                let calcAfterBalance = beforeBalance.sub(txMsg.gasPrice.mul(receipt.gasUsed))
                expect(afterBalance).to.be.equal(calcAfterBalance)
            })

            async function getTxCount(address) {
                let pendingNonce = ethers.provider.getTransactionCount(address, "pending")
                let latestNonce = ethers.provider.getTransactionCount(address, "latest")
                console.log("pending:", await pendingNonce, ",latest:", await latestNonce)
                // await new Promise(r => setTimeout(r, 100));
                let nonces = []
                nonces.push(await pendingNonce);
                nonces.push(await latestNonce)
                return nonces;
            }


            it("nonce is too low  => invalid nonce ", async () => {
                let penddingNonce = await ethers.provider.getTransactionCount(ethers.provider.getSigner().getAddress(), "pending")
                console.log("pendding:", penddingNonce)
                try {
                    await ethers.provider.getSigner().sendTransaction({
                        "to": null,
                        "nonce": penddingNonce - 1,
                        "data": logContract.bytecode,
                    })
                } catch (e) {
                    return
                }
                expect("").to.be.equal("failed")
            })

            it("nonce is too max   => invalid nonce ", async () => {
                let penddingNonce = await ethers.provider.getTransactionCount(ethers.provider.getSigner().getAddress(), "pending")
                console.log("pendding:", penddingNonce)
                try {
                    let tx = await ethers.provider.getSigner().sendTransaction({
                        "to": null,
                        "nonce": penddingNonce + 100,
                        "data": logContract.bytecode,
                    })
                    console.log("tx:", tx)
                } catch (e) {
                    return
                }
                expect("").to.be.equal("failed")
            })
        })

    })

    describe("nonce gasprice", function () {

        it.skip("send 10 tx  that  nonce are same and  gasPrice  0 -> 10", async () => {
            let txs = []
            let pendingNonce = await ethers.provider.getTransactionCount(ethers.provider.getSigner().getAddress(), "pending")
            let gasPrice = BigNumber.from("0x11")
            for (let i = 0; i < 2; i++) {
                try {
                    gasPrice = gasPrice.add(BigNumber.from("0x11"))
                    console.log("gasPrice:", gasPrice.toString())

                    let tx = ethers.provider.getSigner().sendTransaction({
                        "to": null,
                        "nonce": pendingNonce,
                        "gasPrice": gasPrice.add(BigNumber.from("0x1")).toHexString(),
                        "data": logContract.bytecode,
                    })
                    txs.push(tx)
                } catch (e) {
                    console.log(e)
                }
            }
            console.log("--------")
            let responses = []
            for (let i = 0; i < txs.length; i++) {
                try {
                    let tx = await txs[i];
                    console.log("tx:", tx)
                    let response = await getTxReceipt(ethers.provider, tx.hash, 10)
                    responses.push(response)
                } catch (e) {
                    console.log("idx:", i, ",e:", e)
                }
            }
            console.log("print response ")
            for (let i = 0; i < responses.length; i++) {
                console.log("response:", responses[i])

            }
        }).timeout(100000)
    })
})