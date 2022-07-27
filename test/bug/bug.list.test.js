const {ethers} = require("hardhat");
const {expect} = require("chai");


describe("bug", function () {
    this.timeout(600000)

    it.skip("opz(reverts with invalid signature)", async () => {

        // deploy contract
        let contractInfo = await ethers.getContractFactory("ECDSAMock");
        let contract = await contractInfo.deploy()
        await contract.deployed()

        // invoke revert
        const TEST_MESSAGE = ethers.utils.sha256('0x1234')
        const signature = '0x332ce75a821c982f9127538858900d87d3ec1f9f737338ad67cad133fa48feff48e6fa0c18abc62e42820f05943e47af3e9fbe306ce74d64094bdf1691ee53e01c';
        try {
            await contract.recover(TEST_MESSAGE, signature)

        } catch (e) {
            expect(e.toString()).to.be.include('ECDSA: invalid signature')
            return
        }
        expect('').to.be.equal('failed')
    })


    describe('type test', function () {

        it.skip('Legacy tx ,should return type 0', async () => {

            // send Legacy tx
            let tx = await ethers.provider.getSigner().sendTransaction({
                gasPrice: "0xff"
            })
            let response = await tx.wait()

            // Legacy tx type = 0
            expect(response.type).to.be.equal(0)
        })

        it('1559 tx,should return type 2 ', async () => {

            // send 1559 tx
            let tx = await ethers.provider.getSigner().sendTransaction({
                maxFeePerGas: "0x8",
                maxPriorityFeePerGas: "0x1"
            })
            let response = await tx.wait()

            // Legacy tx type = 0
            expect(response.type).to.be.equal(2)
        })

        it.skip('type 2 maxPriorityFeePerGas:0x0 ,should return successful tx', async () => {

            // send 1559 tx
            let tx = await ethers.provider.getSigner().sendTransaction({
                maxFeePerGas: "0x8",
                maxPriorityFeePerGas: "0x0"
            })
            let response = await tx.wait()
            expect(response.type).to.be.equal(2)
        })
    });

    it.skip("v3-core(proxy cannot call the method that calls a private method with the modifier)", async () => {
        // deploy NoDelegateCallTest
        let noDelegateCallTestContractInfo = await ethers.getContractFactory("NoDelegateCallTest");
        let noDelegateCallTestContract = await noDelegateCallTestContractInfo.deploy()
        await noDelegateCallTestContract.deployed()

        // deploy CloneFactory
        let cloneFactoryContractInfo = await ethers.getContractFactory("CloneFactory");
        let cloneFactoryContract = await cloneFactoryContractInfo.deploy()

        await cloneFactoryContract.deployed()

        // create proxy contract
        let tx = await cloneFactoryContract.createClone(noDelegateCallTestContract.address)
        await tx.wait()
        let proxyAddress = await cloneFactoryContract.addressMap(noDelegateCallTestContract.address)
        console.log('proxy address:', proxyAddress)
        let proxyDelegateCallContract = await noDelegateCallTestContractInfo.attach(proxyAddress)

        // proxy invoke normal  method =>   invoke success
        let callResult = await proxyDelegateCallContract.getGasCostOfCanBeDelegateCalled()
        console.log('getGasCostOfCanBeDelegateCalled:', callResult)
        expect(callResult).to.be.gt("1")

        // proxy invoke failed method => expected :execution reverted
        try {
            await proxyDelegateCallContract.callsIntoNoDelegateCallFunction()
        } catch (e) {
            return
        }

        // failed reason:
        //eth
        //jsonRpcResponse: {
        //   jsonrpc: '2.0',
        //   id: 71,
        //   error: { code: -32000, message: 'execution reverted' }
        // }
        // axon
        //
        //jsonRpcResponse: {
        //   jsonrpc: '2.0',
        //   error: { code: -32015, message: 'execution reverted: ', data: '0x' },
        //   id: 53
        // }
        expect('').to.be.include('failed')

    })


})