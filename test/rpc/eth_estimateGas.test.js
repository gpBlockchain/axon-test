const {ethers} = require("hardhat");
const {expect} = require("chai");
const {
    getDeployLogContractAddress, getFallbackAndReceiveContractAddress,
    getNoFallbackAndReceiveContractAddress, deployLogContractAddress, getTestLogSigByTimes,
    getFailedTxContractAddress
} = require("../utils/rpc");
const {BigNumber} = require("ethers");


describe("eth_estimateGas", function () {
    this.timeout(600000)

    let normalEoaAddress = '0x0c1efcca2bcb65a532274f3ef24c044ef4ab6d73'
    let norExistAddress = '0x0c1efcca2bcb65a532274f3ef24c044ef4ab6d74'
    let outOfboundAddress = '0x0c1efcca2bcb65a532274f3ef24c044ef4ab6d7412345'
    let lowLengthAddress = '0x0c1efcca2bcb65a532274f3ef24c044ef4ab6'
    it("send tx without data,should return gasCost", async () => {
        let estimateGas = await ethers.provider.send('eth_estimateGas',
            [{
                to: normalEoaAddress,
            }])
        expect(estimateGas).to.be.include('0x')
    })


    it("from have balance, data is method sign,should return revert", async () => {
        try {
            let estimateGas = await ethers.provider.send('eth_estimateGas',
                [{
                    data: '0x9cb8a26a'
                }])
            console.log('estimateGas:', estimateGas)
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

        it("to is normalEoaAddress ", async () => {
            let estimateGas = await ethers.provider.send('eth_estimateGas',
                [{
                    from: contractAddress,
                    to: normalEoaAddress,
                    data: '0x'
                }])
            console.log('estimateGas:', estimateGas)
            expect(estimateGas).to.be.include('0x')
        })

    })

    it("from is address that not send tx and not have balance, to is normalEoaAddress,should return gasCost", async () => {
        let estimateGas = await ethers.provider.send('eth_estimateGas',
            [{
                from: norExistAddress,
                to: normalEoaAddress,
                data: '0x'
            }])
        console.log('estimateGas:', estimateGas)
        expect(estimateGas).to.be.include('0x')
    })


    it("from is address that out of bound,should return error msg", async () => {
        try {

            let estimateGas = await ethers.provider.send('eth_estimateGas',
                [{
                    from: outOfboundAddress,
                    to: normalEoaAddress,
                    data: '0x'
                }])
            console.log('estimateGas:', estimateGas)
        } catch (e) {
            return
        }
        expect("").to.be.include("failed")
    })

    it("from is address that length too low,should return err msg ", async () => {
        try {

            let estimateGas = await ethers.provider.send('eth_estimateGas',
                [{
                    from: lowLengthAddress,
                    to: normalEoaAddress,
                    data: '0x'
                }])
            console.log('estimateGas:', estimateGas)
        } catch (e) {
            return
        }
        expect("").to.be.include("failed")

    })

    it("from is address that from is empty,should return error msg ", async () => {
        // todo close Auto-fill parameters from
        let estimateGas = await ethers.provider.send('eth_estimateGas',
            [{
                // from: lowLengthAddress,
                to: normalEoaAddress,
                data: '0x'
            }])
        console.log('estimateGas:', estimateGas)
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

        it("to is address that no 0x and upperCase,should return gasCost", async () => {
            //todo check axon result sync with eth ?
            //axon :succ
            // hardhat: Errors encountered in param 0: Invalid value "0C1EFCCA2BCB65A532274F3EF24C044EF4AB6D73" supplied to : RpcCallRequest/to: ADDRESS | undefined
            let estimateGas = await ethers.provider.send('eth_estimateGas',
                [{
                    from: haveCkbAddress,
                    to: no0xAndUpperCaseAddress,
                    data: '0x'
                }])
            expect(estimateGas).to.be.include('0x')
        })
        it("to is address that out of bound ,should return error msg", async () => {
            try {
                await ethers.provider.send('eth_estimateGas',
                    [{
                        from: haveCkbAddress,
                        to: outOfboundAddress,
                        data: '0x'
                    }])
            } catch (e) {
                return
            }
            expect("").to.be.include("failed")
        })

        it("to is empty ,should return gasCost", async () => {
            let estimateGas = await ethers.provider.send('eth_estimateGas',
                [{
                    from: haveCkbAddress,
                    data: '0x'
                }])
            expect(estimateGas).to.be.include('0x')
        })

        it("to is null,should return gasCost", async () => {
            let estimateGas = await ethers.provider.send('eth_estimateGas',
                [{
                    from: haveCkbAddress,
                    to: null,
                    data: '0x'
                }])
            expect(estimateGas).to.be.include('0x')
        })

        it('to is contract that  have fallback method,should return gasCost', async () => {
            await ethers.provider.send('eth_estimateGas',
                [{
                    from: haveCkbAddress,
                    to: contractWithFallbackMethodAddress,
                    data: '0x'
                }])
        })

        it('to is contract that not have fallback method,should return error msg', async () => {
            try {
                await ethers.provider.send('eth_estimateGas',
                    [{
                        from: haveCkbAddress,
                        to: contractWithoutFallbackMethodAddress,
                        data: '0x'
                    }])
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
        it("gas without 0x ,should return gasCost", async () => {

            //todo axon :succ
            // hardhat failed
            await ethers.provider.send('eth_estimateGas',
                [{
                    from: haveCkbAddress,
                    to: normalEoaAddress,
                    data: '0x',
                    gas: '100000'
                }])
        })

        it("gas with 0x,should return gasCost", async () => {

            let estimateGas = await ethers.provider.send('eth_estimateGas',
                [{
                    from: haveCkbAddress,
                    to: normalEoaAddress,
                    data: '0x',
                    gas: '0x100000'
                }])
            expect(estimateGas).to.be.include('0x')
        })

        it("gas is 0,should return error msg", async () => {

            try {
                await ethers.provider.send('eth_estimateGas',
                    [{
                        from: haveCkbAddress,
                        to: normalEoaAddress,
                        data: '0x',
                        gas: '0x0'
                    }])
            } catch (e) {
                return
            }
            expect('').to.be.include('failed')

        })

        it("gas is eq estimateGas,should return gasCost,gas =estimateGas  ", async () => {
            let estimateGas = await ethers.provider.send('eth_estimateGas',
                [{
                    from: haveCkbAddress,
                    to: normalEoaAddress,
                    data: '0x',
                    gas: '0xfffff'
                }])

            let estimateGas2 = await ethers.provider.send('eth_estimateGas',
                [{
                    from: haveCkbAddress,
                    to: normalEoaAddress,
                    data: '0x',
                    gas: estimateGas
                }])
            expect(estimateGas).to.be.include(estimateGas2)
        })

        it("gas is null,should return gasCost", async () => {

            await ethers.provider.send('eth_estimateGas',
                [{
                    from: haveCkbAddress,
                    to: normalEoaAddress,
                    data: '0x',
                    gas: null
                }])
        })

        it("gas is empty ,should return gasCost ", async () => {

            await ethers.provider.send('eth_estimateGas',
                [{
                    from: haveCkbAddress,
                    to: normalEoaAddress,
                    data: '0x',
                }])
        })

        it("gas is very big,should return error msg", async () => {
            try {
                await ethers.provider.send('eth_estimateGas',
                    [{
                        from: haveCkbAddress,
                        to: normalEoaAddress,
                        data: '0x',
                        gas: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
                    }])
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

        it('value without 0x,should return gas Cost ', async () => {
            //todo
            // check axon succ
            // hardhat failed
            let estimateGas = await ethers.provider.send('eth_estimateGas',
                [{
                    from: haveCkbAddress,
                    to: normalEoaAddress,
                    data: '0x',
                    value: '1'
                }])
            expect(estimateGas).to.be.include('0x')
        })

        it('value with 0x,should return gasCost', async () => {
            let estimateGas = await ethers.provider.send('eth_estimateGas',
                [{
                    from: haveCkbAddress,
                    to: normalEoaAddress,
                    data: '0x',
                    value: '0x1'

                }])
            expect(estimateGas).to.be.include('0x')
        })

        it('value is empty,should return gas Cost', async () => {
            let estimateGas = await ethers.provider.send('eth_estimateGas',
                [{
                    from: haveCkbAddress,
                    to: normalEoaAddress,
                    data: '0x',
                }])
            expect(estimateGas).to.be.include('0x')
        })

        it('value =  from balance,should return gasCost ', async () => {
            let fromBalance = await ethers.provider.getBalance(haveCkbAddress)
            let estimateGas = await ethers.provider.send('eth_estimateGas',
                [{
                    from: haveCkbAddress,
                    to: normalEoaAddress,
                    data: '0x',
                    value: fromBalance.toHexString().replace('0x0', '0x'),
                }])
            expect(estimateGas).to.be.include('0x')
        })

        it('value >  from balance,should return gas cost', async () => {
            //todo check  should return error or return gas cost ?
            let fromBalance = await ethers.provider.getBalance(haveCkbAddress)
            try {

                await ethers.provider.send('eth_estimateGas',
                    [{
                        from: haveCkbAddress,
                        to: normalEoaAddress,
                        data: '0x',
                        value: fromBalance.mul(BigNumber.from('1000000')).toHexString().replace('0x0', '0x'),
                    }])
            } catch (e) {
                return
            }
            expect('').to.be.include('0x')
        })
        it('value is null,should return gas cost', async () => {
            //todo  value
            let estimateGas = await ethers.provider.send('eth_estimateGas',
                [{
                    from: haveCkbAddress,
                    to: normalEoaAddress,
                    data: '0x',
                    value: null,

                }])
            expect(estimateGas).to.be.include('0x')
        })
    })

    describe("from have ckb(data)", function () {
        let haveCkbAddress;
        before(async function () {
            haveCkbAddress = await ethers.provider.getSigner(0).getAddress()
        })

        it("data is 0x,should return gas cost", async () => {
            let estimateGas = await ethers.provider.send('eth_estimateGas',
                [{
                    from: haveCkbAddress,
                    to: normalEoaAddress,
                    data: '0x',
                }])
            expect(estimateGas).to.be.include('0x')

        })

        it("data is '',should return gas cost", async () => {
            try {
                await ethers.provider.send('eth_estimateGas',
                    [{
                        from: haveCkbAddress,
                        to: normalEoaAddress,
                        data: '',
                    }])
            } catch (error) {
                expect(error.message).to.include('Hex should start with 0x');
            }
        })
        it("data is 0x0fff,should return gas cost", async () => {
            let estimateGas = await ethers.provider.send('eth_estimateGas',
                [{
                    from: haveCkbAddress,
                    to: normalEoaAddress,
                    data: '0x0fff',
                }])
            expect(estimateGas).to.be.include('0x')
        })

        it("data is 0xfff,should return error msg", async () => {
            try {
                let estimateGas = await ethers.provider.send('eth_estimateGas',
                    [{
                        from: haveCkbAddress,
                        to: normalEoaAddress,
                        data: '0xfff',
                    }])
                expect(estimateGas).to.be.include('0x')
            } catch (e) {
                return
            }
            expect('').to.be.include('failed')

        })

        it("data is null,should return gas cost", async () => {
            let estimateGas = await ethers.provider.send('eth_estimateGas',
                [{
                    from: haveCkbAddress,
                    to: normalEoaAddress,
                    data: null,
                }])
            expect(estimateGas).to.be.include('0x')
        })

        it("data is empty, should return gas cost ", async () => {
            let estimateGas = await ethers.provider.send('eth_estimateGas',
                [{
                    from: haveCkbAddress,
                    to: normalEoaAddress,
                }])
            expect(estimateGas).to.be.include('0x')
        })
    })

    describe("from have ckb(gasPrice)", function () {
        let haveCkbAddress;
        before(async function () {
            haveCkbAddress = await ethers.provider.getSigner(0).getAddress()
        })

        it('gasPrice is 0x1,should return gas cost', async () => {
            //todo check
            let estimateGas = await ethers.provider.send('eth_estimateGas',
                [{
                    from: haveCkbAddress,
                    to: normalEoaAddress,
                    data: '0x',
                    gasPrice: '0x1'
                }])
            expect(estimateGas).to.be.include('0x')
        })

        it('gasPrice without 0x,should return gas cost ', async () => {
            // todo check
            // axon succ
            // hardhat failed
            let estimateGas = await ethers.provider.send('eth_estimateGas',
                [{
                    from: haveCkbAddress,
                    to: normalEoaAddress,
                    data: '0x',
                    gasPrice: '11'
                }])
            expect(estimateGas).to.be.include('0x')
        })

        it('gasPrice > min gasPrice ,should return gas cost', async () => {
            // todo check
            // axon succ
            // hardhat failed
            let estimateGas = await ethers.provider.send('eth_estimateGas',
                [{
                    from: haveCkbAddress,
                    to: normalEoaAddress,
                    data: '0x',
                    gasPrice: '0xffffffffff'
                }])
            expect(estimateGas).to.be.include('0x')
        })

        it('gasPrice very big  (exceed MAX_INTEGER (2^256-1)),should return error msg  ', async () => {
            // todo check
            // axon succ
            // hardhat failed
            try {
                let estimateGas = await ethers.provider.send('eth_estimateGas',
                    [{
                        from: haveCkbAddress,
                        to: normalEoaAddress,
                        data: '0x',
                        gasPrice: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
                    }])
                expect(estimateGas).to.be.include('0x')
            } catch (e) {
                return
            }
            expect('').to.be.include('failed')
        })

        it.skip('gasPrice very very  big-1 ,should return gas cost', async () => {

            try {
                await ethers.provider.send('eth_estimateGas',
                    [{
                        from: haveCkbAddress,
                        to: normalEoaAddress,
                        data: '0x',
                        gasPrice: '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
                    }])
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

            it('data is  method that contains payable tag , should return gas cost', async () => {
                let estimateGas = await ethers.provider.send('eth_estimateGas',
                    [{
                        from: haveCkbAddress,
                        to: contractWithFallbackMethodAddress,
                        data: payableMethodSig,
                        value: '0x12'
                    }])
                expect(estimateGas).to.be.include('0x')
            })

            it('data is method that not contains payable tag,should return error msg  ', async () => {
                try {
                    await ethers.provider.send('eth_estimateGas',
                        [{
                            from: haveCkbAddress,
                            to: contractWithFallbackMethodAddress,
                            data: notContainsPayableMethodSig,
                            value: '0x12'
                        }])
                } catch (e) {
                    return
                }
                expect('').to.be.include('failed')
            })


            it('data is method that not exist on contract(contract have payable fallback),should return gas cost ', async () => {
                let estimateGas = await ethers.provider.send('eth_estimateGas',
                    [{
                        from: haveCkbAddress,
                        to: contractWithFallbackMethodAddress,
                        data: notExistMethodSig,
                        value: '0x12'
                    }])
                expect(estimateGas).to.be.include('0x')

            })

            it('data is method that not exist on contract(contract have not payable fallback),should return error msg ', async () => {
                try {
                    await ethers.provider.send('eth_estimateGas',
                        [{
                            from: haveCkbAddress,
                            to: contractWithoutFallbackMethodAddress,
                            data: notExistMethodSig,
                            value: '0x12'
                        }])
                } catch (e) {
                    return
                }
                expect('').to.be.include('failed')

            })

            it('data is null (contract have  payable fallback),should return gas cost', async () => {
                let estimateGas = await ethers.provider.send('eth_estimateGas',
                    [{
                        from: haveCkbAddress,
                        to: contractWithFallbackMethodAddress,
                        data: null,
                        value: '0x12'
                    }])
                expect(estimateGas).to.be.include('0x')
            })
        })

    })


    describe("from have ckb(nonce)", function () {

        let haveCkbAddress;

        before(async function () {
            haveCkbAddress = await ethers.provider.getSigner(0).getAddress()
        })

        it('nonce is rand str, should return error msg ', async () => {
            try {
                await ethers.provider.send('eth_estimateGas',
                    [{
                        from: haveCkbAddress,
                        to: normalEoaAddress,
                        data: '0x',
                        nonce: 'adnaldnaldawdaw'
                    }])
            } catch (e) {
                return
            }
            expect('').to.be.include('failed')

        })

        it('nonce is hex str,should return gas cost ', async () => {
            // todo check Whether the nonce affects the interface that name is eth_estimateGas
            let estimateGas = await ethers.provider.send('eth_estimateGas',
                [{
                    from: haveCkbAddress,
                    to: normalEoaAddress,
                    data: '0x',
                    nonce: '0x1234'
                }])
            expect(estimateGas).to.be.include('0x')
        })
    })

    describe("from have ckb(failed tx)", function () {

        let haveCkbAddress;

        before(async function () {
            haveCkbAddress = await ethers.provider.getSigner(0).getAddress()
        })
        it('will out of gas tx,return error msg ', async () => {

            //deploy logContract
            let logContractAddress = await deployLogContractAddress()

            // build out of gas tx data
            let log500000Sig = getTestLogSigByTimes(500000)

            // call out of gas tx
            try {
                await ethers.provider.send('eth_estimateGas',
                    [{
                        from: haveCkbAddress,
                        to: logContractAddress,
                        data: log500000Sig,
                    }])
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
                await ethers.provider.send('eth_estimateGas',
                    [{
                        from: haveCkbAddress,
                        to: contractAddress,
                        data: revertSig,
                    }])
            } catch (e) {
                return
            }
            expect("").to.be.include("failed")
        })
    })

})
