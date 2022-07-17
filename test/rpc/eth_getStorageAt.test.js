const {ethers} = require("hardhat");
const {expect} = require("chai");
const {BigNumber} = require("ethers");

describe("eth_getStorageAt", function () {
    this.timeout(600000)
    let notExistAddress = '0xacb5b53f9f193b99bcd8ef8544ddf4c398de24a4'
    it('not exist address slot , should return 0x0', async () => {
        let data = await ethers.provider.send('eth_getStorageAt', [notExistAddress, '0x0', 'latest'])
        expect(data).to.be.include('0x')
    })

    it('not exist address very large idx  , should return error msg', async () => {
        //todo check axon result return failed or return 0x
        try {
            await ethers.provider.send('eth_getStorageAt', [notExistAddress, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', 'latest'])

        }catch (e){
            return
        }
        expect('').to.be.equal('failed')
    })

    it('eoa address, should return 0x0', async () => {
        let address = (await ethers.getSigners())[0].address
        await ethers.provider.send('eth_getStorageAt', [address, '0x0', 'latest'])
    })

    describe('contract address', function () {

        let StorageContract;
        before(async () => {
            let contractInfo = await ethers.getContractFactory("StorageContract")
            StorageContract = await contractInfo.deploy()
            await StorageContract.deployed()
        })

        it('query empty data slot,should return 0x0 ', async () => {
            let slot00Data = await ethers.provider.send('eth_getStorageAt', [StorageContract.address, '0x0', 'latest'])
            console.log('slot 0:', slot00Data)
            expect(slot00Data).to.be.equal('0x0000000000000000000000000000000000000000000000000000000000000000')
        })

        it('exist slot ,should return data', async () => {
            let tx = await StorageContract.StoragePos0(1234, 5678)
            await tx.wait()
            let slot00Data = await ethers.provider.send('eth_getStorageAt', [StorageContract.address, '0x0', 'latest'])
            expect(slot00Data).to.be.equal('0x00000000000000000000000000000000000000000000000000000000000004d2')
        })

        it('exist slot ,query in pending time,should return data eq latest', async () => {
            // axon need mod gasLimit
            let tx = await StorageContract.StoragePos0(1234, 5678,{gasLimit:6000000})
            await tx.wait()
            let slot00DataLatest = await ethers.provider.send('eth_getStorageAt', [StorageContract.address, '0x0', 'latest'])
            let slot00DataPending = await ethers.provider.send('eth_getStorageAt', [StorageContract.address, '0x0', 'pending'])
            expect(slot00DataPending).to.be.equal(slot00DataLatest)
        })

        it('earliest time ,should return 0x0', async () => {
            let tx = await StorageContract.StoragePos0(1234, 5678,{gasLimit:6000000})
            await tx.wait()
            let slot00DataLatest = await ethers.provider.send('eth_getStorageAt', [StorageContract.address, '0x0', 'latest'])
            let slot00DataEarliest = await ethers.provider.send('eth_getStorageAt', [StorageContract.address, '0x0', 'earliest'])
            expect(slot00DataLatest).to.be.not.equal('0x0000000000000000000000000000000000000000000000000000000000000000')
            expect(slot00DataEarliest).to.be.equal('0x0000000000000000000000000000000000000000000000000000000000000000')
        })

        it('query block height = max blockHeight ,should return error msg  ', async () => {
            let tx = await StorageContract.StoragePos0(1235, 5678,{gasLimit:6000000})
            await tx.wait()
            let height = await ethers.provider.getBlockNumber()
            let response = await ethers.provider.send('eth_getStorageAt', [StorageContract.address, '0x0', BigNumber.from(height).toHexString().replace('0x0','0x')])
            expect(response).to.be.equal('0x00000000000000000000000000000000000000000000000000000000000004d3')
        })


        it('query block height > max blockHeight ,should return error msg  ', async () => {
            let height = await ethers.provider.getBlockNumber()
            try {
                await ethers.provider.send('eth_getStorageAt', [StorageContract.address, '0x0', BigNumber.from(height + 1000).toHexString()])
            } catch (e) {
                return
            }
            expect('').to.be.equal('failed')
        })

        it('query block height very large ,should return error msg  ', async () => {
            try {
                await ethers.provider.send('eth_getStorageAt', [StorageContract.address, '0x0', '0xffffffffffffffffffffffffffffff'])
            } catch (e) {
                console.log('e:', e)
                return
            }
            expect('').to.be.equal('failed')
        })

        it('destruct contract , query  slot that existed before  ,should return 0x0 ',async ()=>{
            //deploy contract
            let contractInfo = await ethers.getContractFactory("StorageContract")
            let StorageContract1 = await contractInfo.deploy()
            await StorageContract1.deployed()

            // put data slot1
            let tx = await StorageContract1.StoragePos0(1235, 5678)
            let storeReceipt = await tx.wait()
            // query slot 1 must not 0x0
            let response = await ethers.provider.send('eth_getStorageAt', [StorageContract1.address, '0x0000000000000000000000000000000000000000000000000000000000000000', 'latest'])
            expect(response).to.be.not.equal('0x0000000000000000000000000000000000000000000000000000000000000000')

            // destruct contract
            let destructTx = await StorageContract1.destruct()
            let receipt = await destructTx.wait()

            // query slot 1 must 0x0
            response = await ethers.provider.send('eth_getStorageAt', [StorageContract1.address, '0x0000000000000000000000000000000000000000000000000000000000000000', 'latest'])
            expect(response).to.be.equal('0x0000000000000000000000000000000000000000000000000000000000000000')
        })
        it('mod slot data ,query diff block height ,should return diff data',async ()=>{
            // mod 0,10
            let txReceiptList = []
            for (let i = 0; i < 3; i++) {
                let tx = await StorageContract.StoragePos0(1235+i, 5678,{gasLimit:6000000})
                let receipt = await tx.wait()
                txReceiptList.push(receipt)
            }

            // query slot list  with mod tx.number
            let currentData = ''
            for (let i = 0; i < txReceiptList.length; i++) {
                let response = await ethers.provider.send('eth_getStorageAt', [StorageContract.address, '0x0000000000000000000000000000000000000000000000000000000000000000', BigNumber.from(txReceiptList[i].blockNumber).toHexString()])
                expect(response).to.be.not.equal(currentData)
                currentData = response
            }
        })

        it('query slot ,block height is 10 decimal,should return error ',async ()=>{
            try {
                await ethers.provider.send('eth_getStorageAt', [StorageContract.address, '0x0000000000000000000000000000000000000000000000000000000000000000', 100])
            }catch (e){
                return
            }
            expect('').to.be.equal('failed')
        })
    });

})