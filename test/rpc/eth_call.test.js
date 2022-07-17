const {ethers} = require("hardhat");
const {expect} = require("chai");
const {
    getDeployLogContractAddress,
    getFallbackAndReceiveContractAddress,
    getNoFallbackAndReceiveContractAddress,
    deployLogContractAddress,
    getTestLogSigByTimes,
    getContractAddress,
    getEthCallContract,
    getFailedTxContractAddress
} = require("../utils/rpc.js");
const {BigNumber} = require("ethers");


describe("eth_call", function () {
    this.timeout(600000)

    let normalEoaAddress = '0x0c1efcca2bcb65a532274f3ef24c044ef4ab6d73'
    let norExistAddress = '0x0c1efcca2bcb65a532274f3ef24c044ef4ab6d74'
    let outOfboundAddress = '0x0c1efcca2bcb65a532274f3ef24c044ef4ab6d7412345'
    let lowLengthAddress = '0x0c1efcca2bcb65a532274f3ef24c044ef4ab6'
    it("send tx without data,should return 0x", async () => {
        let ethCallData = await ethers.provider.send('eth_call',
            [{
                to: normalEoaAddress,
            }, 'latest'])
        expect(ethCallData).to.be.include('0x')
    })


    it("from have balance, data is method sign,should return error msg ", async () => {
        try {
            let ret = await ethers.provider.send('eth_call',
                [{
                    data: '0x9cb8a26a'
                }, 'latest'])
            console.log('ret:', ret)
        } catch (e) {
            return
        }
        expect("").to.be.equal('failed')
    })

    describe("from is contractAddress ", function () {

        let contractAddress;
        before(async function () {
            contractAddress = await getDeployLogContractAddress();
            console.log('contractAddress:', contractAddress)
        })

        it("to is normalEoaAddress,should return 0x ", async () => {
            let ret = await ethers.provider.send('eth_call',
                [{
                    from: contractAddress,
                    to: normalEoaAddress,
                    data: '0x'
                }, 'latest'])
            console.log('ret:', ret)
            expect(ret).to.be.include('0x')
        })

    })

    it("from is address that not send tx and not have balance, to is normalEoaAddress ,should return 0x", async () => {
        let ret = await ethers.provider.send('eth_call',
            [{
                from: norExistAddress,
                to: normalEoaAddress,
                data: '0x'
            }, 'latest'])
        console.log('ret:', ret)
        expect(ret).to.be.include('0x')
    })


    it("from is address that out of bound,should return error msg", async () => {
        try {

            let ret = await ethers.provider.send('eth_call',
                [{
                    from: outOfboundAddress,
                    to: normalEoaAddress,
                    data: '0x'
                }, 'latest'])
            console.log('ret:', ret)
        } catch (e) {
            return
        }
        expect("").to.be.include("failed")
    })

    it("from is address that length too low,should return error msg ", async () => {
        try {

            let ret = await ethers.provider.send('eth_call',
                [{
                    from: lowLengthAddress,
                    to: normalEoaAddress,
                    data: '0x'
                }])
            console.log('ret:', ret)
        } catch (e) {
            return
        }
        expect("").to.be.include("failed")

    })

    it("from is address that from is empty,should return error msg", async () => {
        // todo close Auto-fill parameters from
        let ret = await ethers.provider.send('eth_call',
            [{
                // from: lowLengthAddress,
                to: normalEoaAddress,
                data: '0x'
            }, 'latest'])
        console.log('ret:', ret)
    })

    describe("from have ckb", function () {
        let haveCkbAddress;

        let no0xAndUpperCaseAddress;
        let contractWithFallbackMethodAddress;
        let contractWithoutFallbackMethodAddress;
        before(async function () {
            haveCkbAddress = await ethers.provider.getSigner(0).getAddress()
            no0xAndUpperCaseAddress = normalEoaAddress.substring(2).toUpperCase()
            contractWithFallbackMethodAddress = await getFallbackAndReceiveContractAddress()
            contractWithoutFallbackMethodAddress = await getNoFallbackAndReceiveContractAddress()
        })

        it("to is address that on 0x and upperCase,should return 0x", async () => {
            //todo check axon result sync with eth ?
            //axon :succ
            // hardhat: Errors encountered in param 0: Invalid value "0C1EFCCA2BCB65A532274F3EF24C044EF4AB6D73" supplied to : RpcCallRequest/to: ADDRESS | undefined
            let ret = await ethers.provider.send('eth_call',
                [{
                    from: haveCkbAddress,
                    to: no0xAndUpperCaseAddress,
                    data: '0x'
                }, 'latest'])
            expect(ret).to.be.include('0x')
        })
        it("to is address that out of bound ,should return error msg", async () => {
            try {
                await ethers.provider.send('eth_call',
                    [{
                        from: haveCkbAddress,
                        to: outOfboundAddress,
                        data: '0x'
                    }, 'latest'])
            } catch (e) {
                return
            }
            expect("").to.be.include("failed")
        })

        it("to is empty ,should return 0x", async () => {
            let ret = await ethers.provider.send('eth_call',
                [{
                    from: haveCkbAddress,
                    data: '0x'
                }, 'latest'])
            expect(ret).to.be.include('0x')
        })

        it("to is null,should return 0x ", async () => {
            let ret = await ethers.provider.send('eth_call',
                [{
                    from: haveCkbAddress,
                    to: null,
                    data: '0x'
                }, 'latest'])
            expect(ret).to.be.include('0x')
        })

        it('to is contract that  have fallback method,should return 0x', async () => {
            let ret = await ethers.provider.send('eth_call',
                [{
                    from: haveCkbAddress,
                    to: contractWithFallbackMethodAddress,
                    data: '0x'
                }, 'latest'])
            expect(ret).to.be.include('0x')
        })

        it('to is contract that not have fallback method,should return error msg', async () => {
            try {
                let ret = await ethers.provider.send('eth_call',
                    [{
                        from: haveCkbAddress,
                        to: contractWithoutFallbackMethodAddress,
                        data: '0x'
                    }, 'latest'])
            } catch (e) {
                return
            }
            expect("").to.be.include("failed")
        })
    })
    describe("from have ckb(gas)", function () {
        let haveCkbAddress;
        before(async function () {
            haveCkbAddress = await ethers.provider.getSigner(0).getAddress()
        })
        it("gas without 0x,should return 0x", async () => {

            //todo axon :succ
            // hardhat failed
            await ethers.provider.send('eth_call',
                [{
                    from: haveCkbAddress,
                    to: normalEoaAddress,
                    data: '0x',
                    gas: '100000'
                }, 'latest'])
        })

        it("gas with 0x,should return 0x", async () => {

            let ret = await ethers.provider.send('eth_call',
                [{
                    from: haveCkbAddress,
                    to: normalEoaAddress,
                    data: '0x',
                    gas: '0x100000'
                }, 'latest'])
            expect(ret).to.be.include('0x')
        })

        it("gas is 0,should return error msg ", async () => {

            try {
                let ret = await ethers.provider.send('eth_call',
                    [{
                        from: haveCkbAddress,
                        to: normalEoaAddress,
                        data: '0x',
                        gas: '0x0'
                    }, 'latest'])
            } catch (e) {
                return
            }
            expect('').to.be.include('failed')

        })

        it("gas is eq estimateGas,should return 0x", async () => {
            let estimateGas = await ethers.provider.send('eth_estimateGas',
                [{
                    from: haveCkbAddress,
                    to: normalEoaAddress,
                    data: '0x',
                    gas: '0xfffff'
                }, 'latest'])

            let ret2 = await ethers.provider.send('eth_call',
                [{
                    from: haveCkbAddress,
                    to: normalEoaAddress,
                    data: '0x',
                    gas: estimateGas
                }, 'latest'])
            expect(ret2).to.be.include('0x')

        })

        it("gas is null,should return 0x ", async () => {

            let ret = await ethers.provider.send('eth_call',
                [{
                    from: haveCkbAddress,
                    to: normalEoaAddress,
                    data: '0x',
                    gas: null
                }, 'latest'])
            expect(ret).to.be.include('0x')
        })

        it("gas is empty,should return 0x  ", async () => {

            let ret = await ethers.provider.send('eth_call',
                [{
                    from: haveCkbAddress,
                    to: normalEoaAddress,
                    data: '0x',
                }, 'latest'])
            expect(ret).to.be.include('0x')
        })

        it("gas is very big ,should return error msg ", async () => {
            try {
                await ethers.provider.send('eth_call',
                    [{
                        from: haveCkbAddress,
                        to: normalEoaAddress,
                        data: '0x',
                        gas: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
                    }, 'latest'])
            } catch (e) {
                return
            }
            expect('').to.be.include('failed')
        })
    })

    describe("from have ckb(value)", function () {

        let haveCkbAddress;
        before(async function () {
            haveCkbAddress = await ethers.provider.getSigner(0).getAddress()
        })

        it('value without 0x,should return 0x', async () => {
            //todo
            // check axon succ
            // hardhat failed
            let ret = await ethers.provider.send('eth_call',
                [{
                    from: haveCkbAddress,
                    to: normalEoaAddress,
                    data: '0x',
                    value: '1'
                }, 'latest'])
            expect(ret).to.be.include('0x')
        })

        it('value with 0x,should return 0x', async () => {
            let ret = await ethers.provider.send('eth_call',
                [{
                    from: haveCkbAddress,
                    to: normalEoaAddress,
                    data: '0x',
                    value: '0x1'

                }, 'latest'])
            expect(ret).to.be.include('0x')
        })

        it('value is empty,should return 0x', async () => {
            let ret = await ethers.provider.send('eth_call',
                [{
                    from: haveCkbAddress,
                    to: normalEoaAddress,
                    data: '0x',
                }, 'latest'])
            expect(ret).to.be.include('0x')
        })

        it('value =  from balance,should return 0x ', async () => {
            let fromBalance = await ethers.provider.getBalance(haveCkbAddress)
            let ret = await ethers.provider.send('eth_call',
                [{
                    from: haveCkbAddress,
                    to: normalEoaAddress,
                    data: '0x',
                    value: fromBalance.toHexString().replace('0x0', '0x'),
                }, 'latest'])
            expect(ret).to.be.include('0x')
        })

        it('value >  from balance ,should return error msg', async () => {
            //todo  value
            let fromBalance = await ethers.provider.getBalance(haveCkbAddress)
            try {

                let ret = await ethers.provider.send('eth_call',
                    [{
                        from: haveCkbAddress,
                        to: normalEoaAddress,
                        data: '0x',
                        value: fromBalance.mul(BigNumber.from('1000000')).toHexString().replace('0x0', '0x'),
                    }, 'latest'])
            } catch (e) {
                return
            }
            expect('').to.be.equal('failed')
        })
        it('value is null ,should return 0x', async () => {
            //todo  value
            let ret = await ethers.provider.send('eth_call',
                [{
                    from: haveCkbAddress,
                    to: normalEoaAddress,
                    data: '0x',
                    value: null,

                }, 'latest'])
            expect(ret).to.be.include('0x')
        })
    })

    describe("from have ckb(data)", function () {
        let haveCkbAddress;
        before(async function () {
            haveCkbAddress = await ethers.provider.getSigner(0).getAddress()
        })

        it("data is 0x,should return 0x", async () => {
            let ret = await ethers.provider.send('eth_call',
                [{
                    from: haveCkbAddress,
                    to: normalEoaAddress,
                    data: '0x',
                }, 'latest'])
            expect(ret).to.be.include('0x')

        })

        it("data is '',should return 0x", async () => {
            //todo check axon succ
            // hardhat failed
            let ret = await ethers.provider.send('eth_call',
                [{
                    from: haveCkbAddress,
                    to: normalEoaAddress,
                    data: '',
                }, 'latest'])
            expect(ret).to.be.include('0x')
        })
        it("data is 0x0fff,should return 0x", async () => {
            let ret = await ethers.provider.send('eth_call',
                [{
                    from: haveCkbAddress,
                    to: normalEoaAddress,
                    data: '0x0fff',
                }, 'latest'])
            expect(ret).to.be.include('0x')
        })

        it("data is 0xfff,should return error msg", async () => {
            try {
                let ret = await ethers.provider.send('eth_call',
                    [{
                        from: haveCkbAddress,
                        to: normalEoaAddress,
                        data: '0xfff',
                    }, 'latest'])
                expect(ret).to.be.include('0x')
            } catch (e) {
                return
            }
            expect('').to.be.include('failed')

        })

        it("data is null,should return 0x", async () => {
            let ret = await ethers.provider.send('eth_call',
                [{
                    from: haveCkbAddress,
                    to: normalEoaAddress,
                    data: null,
                }, 'latest'])
            expect(ret).to.be.include('0x')
        })

        it("data is empty ,should return 0x", async () => {
            let ret = await ethers.provider.send('eth_call',
                [{
                    from: haveCkbAddress,
                    to: normalEoaAddress,
                }, 'latest'])
            expect(ret).to.be.include('0x')
        })
    })

    describe("from have ckb(gasPrice)", function () {
        let haveCkbAddress;
        before(async function () {
            haveCkbAddress = await ethers.provider.getSigner(0).getAddress()
        })

        it('gasPrice is 0x1,should return 0x ', async () => {
            //todo check
            let ret = await ethers.provider.send('eth_call',
                [{
                    from: haveCkbAddress,
                    to: normalEoaAddress,
                    data: '0x',
                    gasPrice: '0x1'
                }, 'latest'])
            expect(ret).to.be.include('0x')
        })

        it('gasPrice without 0x,should return 0x ', async () => {
            // todo check
            // axon succ
            // hardhat failed
            let ret = await ethers.provider.send('eth_call',
                [{
                    from: haveCkbAddress,
                    to: normalEoaAddress,
                    data: '0x',
                    gasPrice: '11'
                }, 'latest'])
            expect(ret).to.be.include('0x')
        })

        it('gasPrice > min gasPrice ,should return 0x  ', async () => {
            // todo check
            // axon succ
            // hardhat failed
            let ret = await ethers.provider.send('eth_call',
                [{
                    from: haveCkbAddress,
                    to: normalEoaAddress,
                    data: '0x',
                    gasPrice: '0xffffffffff'
                }, 'latest'])
            expect(ret).to.be.include('0x')
        })

        it.skip('gasPrice very big  (exceed MAX_INTEGER (2^256-1)),should return error msg ', async () => {
            // todo check
            // axon succ
            // hardhat failed
            try {
                let ret = await ethers.provider.send('eth_call',
                    [{
                        from: haveCkbAddress,
                        to: normalEoaAddress,
                        data: '0x',
                        gasPrice: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
                    }, 'latest'])
                expect(ret).to.be.include('0x')
            } catch (e) {
                return
            }
            expect('').to.be.include('failed')
        })

        it('gasPrice very very  big-1 ,should return error msg ', async () => {

            try {
                await ethers.provider.send('eth_call',
                    [{
                        from: haveCkbAddress,
                        to: normalEoaAddress,
                        data: '0x',
                        gasPrice: '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
                    }, 'latest'])
            } catch (e) {
                return
            }
            expect('').to.be.include('failed')
        })

        describe("from have ckb(gasPrice),to is contract,value >0", function () {

            let haveCkbAddress;

            let contractWithFallbackMethodAddress;
            let contractWithoutFallbackMethodAddress;
            //payableFunction
            let payableMethodSig = "0x4a6a7407"
            // getReceiptNum
            let notContainsPayableMethodSig = "0x82f2ad8c"
            // rand
            let notExistMethodSig = "0xffffffff"

            before(async function () {
                haveCkbAddress = await ethers.provider.getSigner(0).getAddress()
                contractWithFallbackMethodAddress = await getFallbackAndReceiveContractAddress()
                contractWithoutFallbackMethodAddress = await getNoFallbackAndReceiveContractAddress()
            })

            it('data is  method that contains payable tag  ,should return 0x', async () => {
                let ret = await ethers.provider.send('eth_call',
                    [{
                        from: haveCkbAddress,
                        to: contractWithFallbackMethodAddress,
                        data: payableMethodSig,
                        value: '0x12'
                    }, 'latest'])
                expect(ret).to.be.include('0x')
            })

            it('data is method that not contains payable tag ,should return error msg', async () => {
                try {
                    await ethers.provider.send('eth_call',
                        [{
                            from: haveCkbAddress,
                            to: contractWithFallbackMethodAddress,
                            data: notContainsPayableMethodSig,
                            value: '0x12'
                        }, 'latest'])
                } catch (e) {
                    return
                }
                expect('').to.be.include('failed')
            })


            it('data is method that not exist on contract(contract have payable fallback) ,should return 0x', async () => {
                let ret = await ethers.provider.send('eth_call',
                    [{
                        from: haveCkbAddress,
                        to: contractWithFallbackMethodAddress,
                        data: notExistMethodSig,
                        value: '0x12'
                    }, 'latest'])
                expect(ret).to.be.include('0x')

            })

            it('data is method that not exist on contract(contract have not payable fallback),should return error msg', async () => {
                try {
                    await ethers.provider.send('eth_call',
                        [{
                            from: haveCkbAddress,
                            to: contractWithoutFallbackMethodAddress,
                            data: notExistMethodSig,
                            value: '0x12'
                        }, 'latest'])
                } catch (e) {
                    return
                }
                expect('').to.be.include('failed')

            })

            it('data is null (contract have  payable fallback) ,should return 0x', async () => {
                let ret = await ethers.provider.send('eth_call',
                    [{
                        from: haveCkbAddress,
                        to: contractWithFallbackMethodAddress,
                        data: null,
                        value: '0x12'
                    }, 'latest'])
                expect(ret).to.be.include('0x')
            })
        })

    })


    describe("from have ckb(nonce)", function () {

        let haveCkbAddress;

        before(async function () {
            haveCkbAddress = await ethers.provider.getSigner(0).getAddress()
        })

        it('nonce is rand str,should return error msg', async () => {
            //todo
            // hardhat succ
            // eth failed
            // axon failed
            try {
                await ethers.provider.send('eth_call',
                    [{
                        from: haveCkbAddress,
                        to: normalEoaAddress,
                        data: '0x',
                        nonce: 'adnaldnaldawdaw'
                    }, 'latest'])
            } catch (e) {
                return
            }
            expect('').to.be.include('failed')

        })

        it('nonce is hex str,should return 0x', async () => {
            let ret = await ethers.provider.send('eth_call',
                [{
                    from: haveCkbAddress,
                    to: normalEoaAddress,
                    data: '0x',
                    nonce: '0x1234'
                }, 'latest'])
            expect(ret).to.be.include('0x')
        })
    })

    describe("from have ckb(failed tx)", function () {

        let haveCkbAddress;

        before(async function () {
            haveCkbAddress = await ethers.provider.getSigner(0).getAddress()
        })
        it('will out of gas tx,should return error msg ', async () => {

            //deploy logContract
            let logContractAddress = await deployLogContractAddress()

            // build out of gas tx data
            let log500000Sig = getTestLogSigByTimes(500000)

            // call out of gas tx
            try {
                let ret = await ethers.provider.send('eth_call',
                    [{
                        from: haveCkbAddress,
                        to: logContractAddress,
                        data: log500000Sig,
                    }, 'latest'])
            } catch (e) {
                console.log(e)
                expect(e.toString()).to.be.not.include('HeadersTimeoutError')
                return
            }
            expect('').to.be.include('failed')
        })

        it("revert tx,should return error msg", async () => {
            // deploy contract that contains revert method
            let contractAddress = await getFailedTxContractAddress();
            // invoke method that contains revert

            try {
                //FailedTx_assert()
                let revertSig = "0xa0f2f484";
                await ethers.provider.send('eth_call',
                    [{
                        from: haveCkbAddress,
                        to: contractAddress,
                        data: revertSig,
                    }, 'latest'])
            } catch (e) {
                console.log(e)
                return
            }
            expect("").to.be.include("failed")
        })
    })


    describe("from have ckb(msg,tx)", async function () {
        const getMsgFnSign = "0xb5fdeb23"
        let ethCallContractAddress
        let deployTxReceipt;
        let haveCkbAddress;

        before(async function () {
            haveCkbAddress = await ethers.provider.getSigner(0).getAddress()

            let contract = await getEthCallContract()
            ethCallContractAddress = await getContractAddress(contract);
            await getEthCallContract()
            await getEthCallContract()
            deployTxReceipt = await contract.deployTransaction.wait(2)
        })


        describe("latest", async () => {
            let eth_call_msg
            before(async function () {
                let result = await ethers.provider.send("eth_call", [{
                    "from": haveCkbAddress,
                    "to": ethCallContractAddress,
                    "data": getMsgFnSign
                }, "latest"])
                console.log("result:", result)
                eth_call_msg = decodeGetMsg(result)
                console.log(eth_call_msg)
            })
            it("msgSender should return from address", async () => {
                expect(eth_call_msg.msgSender).to.be.equal(haveCkbAddress)
            })

            it("msgValue should return 0", async () => {
                expect(eth_call_msg.msgValue.toString()).to.be.equal("0")
            })

            it("txOrigin should return from address", async () => {
                expect(eth_call_msg.txOrigin).to.be.equal(haveCkbAddress)
            })

            it("txGasPrice should return 1", async () => {
                expect(eth_call_msg.txGasPrice).to.be.equal("1")
            })

        })

        describe("pending", async () => {
            let eth_call_msg
            before(async function () {
                let result = await ethers.provider.send("eth_call", [{
                    "from": haveCkbAddress,
                    "to": ethCallContractAddress,
                    "data": getMsgFnSign
                }, "pending"])
                console.log("result:", result)
                eth_call_msg = decodeGetMsg(result)
                console.log(eth_call_msg)
            })

            it("msgSender should return from address", async () => {
                expect(eth_call_msg.msgSender).to.be.equal(haveCkbAddress)
            })

            it("msgValue should return 0", async () => {
                expect(eth_call_msg.msgValue.toString()).to.be.equal("0")
            })

            it("txOrigin should return from address", async () => {
                expect(eth_call_msg.txOrigin).to.be.equal(haveCkbAddress)
            })

            it("txGasPrice should return 1", async () => {
                expect(eth_call_msg.txGasPrice).to.be.equal("1")
            })

        })


        it("earliest", async () => {
            let ret = await ethers.provider.send("eth_call", [{
                "from": haveCkbAddress,
                "to": ethCallContractAddress,
                "data": getMsgFnSign
            }, "earliest"])
            expect(ret).to.be.equal('0x')
        })

        it("in deploy num", async () => {
            // deployTxReceipt
            let result = await ethers.provider.send("eth_call", [{
                "from": haveCkbAddress,
                "to": ethCallContractAddress,
                "data": getMsgFnSign
            }, BigNumber.from(deployTxReceipt.blockNumber).toHexString().replace('0x0', '0x')])

            let eth_call_msg = decodeGetMsg(result)
            console.log(eth_call_msg)
            expect(eth_call_msg.blockNumber.toHexString()).to.be.equal(BigNumber.from(deployTxReceipt.blockNumber).toHexString())
        })


        it("deploy  num +1,blockNumber should return deploy Num", async () => {
            let result = await ethers.provider.send("eth_call", [{
                "from": haveCkbAddress,
                "to": ethCallContractAddress,
                "data": getMsgFnSign
            }, BigNumber.from(deployTxReceipt.blockNumber + 1).toHexString().replace('0x0', '0x')])
            let eth_call_msg = decodeGetMsg(result)
            console.log(eth_call_msg)
            expect(eth_call_msg.blockNumber.toHexString()).to.be.equal(BigNumber.from(deployTxReceipt.blockNumber + 1).toHexString())

        })

        it("larger than the latest block,should return error msg", async () => {
            try {
                let num = await ethers.provider.getBlockNumber()
                await ethers.provider.send("eth_call", [{
                    "from": haveCkbAddress,
                    "to": ethCallContractAddress,
                    "data": getMsgFnSign
                }, BigNumber.from(num + 10000).toHexString()])
            } catch (e) {
                // expect(e.toString()).to.be.include("header not found")
                return
            }
            expect("").to.be.equal("failed")

        })

        it("value is 0x11 , msgValue should return 0x11", async () => {
            let result = await ethers.provider.send("eth_call", [{
                "from": haveCkbAddress,
                "to": ethCallContractAddress,
                "value": "0x11",
                "data": getMsgFnSign
            }, "latest"])
            console.log("result:", result)
            // ethCallContract.
            let eth_call_msg = decodeGetMsg(result)
            console.log(eth_call_msg)
            expect(eth_call_msg.msgValue.toHexString()).to.be.equal("0x11")
        })

        it("gas = 0xffff ,gasLimit should return 0xffff", async () => {
            let result = await ethers.provider.send("eth_call", [{
                "from": haveCkbAddress,
                "to": ethCallContractAddress,
                "value": "0x11",
                "gas": "0xffff",
                "data": getMsgFnSign
            }, "latest"])
            console.log("result:", result)
            // ethCallContract.
            let eth_call_msg = decodeGetMsg(result)
            console.log(eth_call_msg)
            expect(eth_call_msg.gasLimit.toString()).to.be.equal('65535')
        })

        it("gas - very big (godwoken-exceeds rpc gas limit of),should return error msg", async () => {
            try {
                let ret = await ethers.provider.send("eth_call", [{
                    "from": haveCkbAddress,
                    "to": ethCallContractAddress,
                    "value": "0x11",
                    "gas": "0xffffffffffff",
                    "data": getMsgFnSign
                }, "latest"])
                let decodeRet = decodeGetMsg(ret)
                console.log(decodeRet)
            } catch (e) {
                expect(e.toString()).to.be.include("exceeds rpc gas limit of")
                return
            }
            expect('').to.be.include('failed')
        })

        it("gas  = 0x11,should return error msg ( out of gas )", async () => {
            try {
                let ret = await ethers.provider.send("eth_call", [{
                    "from": haveCkbAddress,
                    "to": ethCallContractAddress,
                    "value": "0x11",
                    "gas": "0x11",
                    "data": getMsgFnSign
                }, "latest"])
                let decodeResult = decodeGetMsg(ret)
                console.log(decodeResult)
            } catch (e) {
                return
            }
            expect("").to.be.equal("failed")

        })

        it("gasPrice = 0x11 ,gasPrice should return 0x11", async () => {
            let result = await ethers.provider.send("eth_call", [{
                "from": haveCkbAddress,
                "to": ethCallContractAddress,
                "value": "0x11",
                "gasPrice": "0x11",
                "data": getMsgFnSign
            }, "latest"])
            console.log("result:", result)

            let eth_call_msg = decodeGetMsg(result)
            console.log(eth_call_msg)
            expect(eth_call_msg.txGasPrice.toString()).to.be.include('17')
        })
        it("gasPrice-very big,should return error msg", async () => {
            try {
                let ret = await ethers.provider.send("eth_call", [{
                    "from": haveCkbAddress,
                    "to": ethCallContractAddress,
                    "value": "0x11",
                    "gasPrice": "0x11111111111111111111111111111111111111111111111111111111111111111111111111111111111111",
                    "data": getMsgFnSign
                }, "latest"])
                let decodeResult = decodeGetMsg(ret)
                console.log('decodeResult:', decodeResult)
            } catch (e) {
                console.log("ex:", e)
                return
            }
            expect("").to.be.equal("failed")

        })
        // it("gasPrice- out of very big", async () => {
        //     try {
        //         await ethers.provider.send("eth_call", [{
        //             "from": haveCkbAddress,
        //             "to": ethCallContractAddress,
        //             "value": "0x11",
        //             "gasPrice": "0x11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111",
        //             "data": getMsgFnSign
        //         }, "latest"])
        //
        //     } catch (e) {
        //         expect(e.toString()).to.be.include("Insufficient balance")
        //         return
        //     }
        //     expect("").to.be.equal("failed")
        //
        // })

        function decodeGetMsg(decodeData) {
            console.log("decodeGetMsg:", decodeData)
            //  function getMsg() public payable returns(address msgSender,uint256 msgValue,uint256 gasLimit,uint256 blockNumber,uint256 txGasPrice,address txOrigin)
            let ret = ethers.utils.defaultAbiCoder.decode([
                    "address",
                    "uint256",
                    "uint256",
                    "uint256",
                    "uint256",
                    "address"],
                decodeData)
            console.log(ret)
            let msgSender = ret[0];
            let msgValue = ret[1];
            let gasLimit = ret[2];
            let blockNumber = ret[3];
            let txGasPrice = ret[4];
            let txOrigin = ret[5];
            return {msgSender, msgValue, gasLimit, blockNumber, txGasPrice, txOrigin}
        }

    })


})
