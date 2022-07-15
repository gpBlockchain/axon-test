const {ethers} = require("hardhat");
const {expect} = require("chai");

// msg.data,
// msg.sig,
// msg.value,
// msg.sender,
// tx.gasprice,
// tx.origin
describe("opcodeTxWithMsg.js opcode -tx msg ", function () {
    this.timeout(100000)
    let contractWithValue;
    let contract2NoValue;
    before(async function () {
        const blockInfoContract = await ethers.getContractFactory("opcodeTxWithMsg");
        contractWithValue = await blockInfoContract.deploy({value: 10n, gasPrice: 91111n});
        const blockInfoContract2 = await ethers.getContractFactory("opcodeTxWithMsg");
        contract2NoValue = await blockInfoContract2.deploy({gasPrice: 91112n});
        await contractWithValue.deployed();
        await contract2NoValue.deployed();
    });

    describe('construct', function () {
        let receiptWithValue
        let msgDatWithValue
        let txDataWithValue

        let receiptNoValue
        let msgDatNoValue
        let txDataNoValue

        before(async function () {
            receiptWithValue = await contractWithValue.deployTransaction.wait();
            msgDatWithValue = await contractWithValue.msgData();
            txDataWithValue = await contractWithValue.txData();

            receiptNoValue = await contract2NoValue.deployTransaction.wait();
            msgDatNoValue = await contract2NoValue.msgData();
            txDataNoValue = await contract2NoValue.txData();

        })

        it("log_data eq eth_call data", async () => {
            expect(receiptNoValue.events[0].args[1].msgData).to.be.equal(msgDatNoValue.msgData);
            expect(receiptWithValue.events[0].args[1].msgData).to.be.equal(msgDatWithValue.msgData);
        })
        it('msg.data', async () => {
            expect(msgDatNoValue.msgData).to.be.equal("0x");
            expect(msgDatWithValue.msgData).to.be.equal("0x");
        })
        it('msg.sig', async () => {
            expect(msgDatNoValue.msgSig).to.be.equal("0x00000000");
            expect(msgDatWithValue.msgSig).to.be.equal("0x00000000");
        })
        it('msg.value', async () => {
            expect(msgDatNoValue.msgValue).to.be.equal(contract2NoValue.deployTransaction.value);
            expect(msgDatWithValue.msgValue).to.be.equal(contractWithValue.deployTransaction.value);
        })
        it('msg.sender', async () => {
            expect(msgDatNoValue.msgSender).to.be.equal(contract2NoValue.signer.address);
            expect(msgDatWithValue.msgSender).to.be.equal(contractWithValue.signer.address);
        })
        it('tx.gasPrice(https://github.com/nervosnetwork/godwoken-web3/issues/377)', async () => {
            expect(txDataNoValue.txGasPrice).to.be.equal(contract2NoValue.deployTransaction.gasPrice);
            expect(txDataWithValue.txGasPrice).to.be.equal(contractWithValue.deployTransaction.gasPrice);
        })
        it('tx.origin', async () => {
            expect(txDataNoValue.txOrigin).to.be.equal(contract2NoValue.signer.address);
            expect(txDataWithValue.txOrigin).to.be.equal(contractWithValue.signer.address);
        })
    });

    describe('invoke', function () {


        let receiptWithValue
        let txWithValue
        let msgDatWithValue
        let txDataWithValue

        let receiptNoValue
        let txWithNoValue
        let msgDatNoValue
        let txDataNoValue

        before(async function () {
            //todo check  no  mod gasLimit will pass
            txWithValue = await contractWithValue.updateMsgAndTxData({gasPrice: 91234,gasLimit:6000000});
            txWithNoValue = await contract2NoValue.updateMsgAndTxData({gasPrice: 90000,gasLimit:6000000});

            receiptWithValue = await txWithValue.wait();
            msgDatWithValue = await contractWithValue.msgData();
            txDataWithValue = await contractWithValue.txData();

            receiptNoValue = await txWithNoValue.wait();
            msgDatNoValue = await contract2NoValue.msgData();
            txDataNoValue = await contract2NoValue.txData();

        })

        it("log eq eth call ", async () => {
            expect(receiptWithValue.events[0].args[1].msgData).to.be.equal(msgDatWithValue.msgData);
            expect(receiptNoValue.events[0].args[1].msgData).to.be.equal(msgDatNoValue.msgData);
        })
        it('msg.data', async () => {
            expect(msgDatWithValue.msgData).to.be.equal(txWithValue.data);
            expect(msgDatNoValue.msgData).to.be.equal(txWithNoValue.data);
        })

        it('msg.sig', async () => {
            expect(msgDatWithValue.msgSig).to.be.equal(txWithValue.data.substring(0, 10));
            expect(msgDatNoValue.msgSig).to.be.equal(txWithNoValue.data.substring(0, 10));
        })
        it('msg.value', async () => {
            expect(msgDatWithValue.msgValue).to.be.equal(txWithValue.value);
            expect(msgDatNoValue.msgValue).to.be.equal(txWithNoValue.value);
        })
        it('msg.sender', async () => {
            expect(msgDatWithValue.msgSender).to.be.equal(contractWithValue.signer.address);
            expect(msgDatNoValue.msgSender).to.be.equal(contract2NoValue.signer.address);
        })
        it('tx.gasPrice(https://github.com/nervosnetwork/godwoken-web3/issues/377)', async () => {
            expect(txDataWithValue.txGasPrice).to.be.equal(txWithValue.gasPrice);
            expect(txDataNoValue.txGasPrice).to.be.equal(txWithNoValue.gasPrice);
        })
        it('tx.origin', async () => {
            expect(txDataWithValue.txOrigin).to.be.equal(contractWithValue.signer.address);
            expect(txDataNoValue.txOrigin).to.be.equal(contract2NoValue.signer.address);
        })
    });

    describe('cross call', function () {

        let receiptWithValue
        let tx
        let msgData
        let txData

        before(async function () {
            tx = await contractWithValue.call_updateMsgAndTxData(contract2NoValue.address, {
                gasLimit: 1000000,
                gasPrice: 9001112n
            })
            receiptWithValue = await tx.wait();
            msgData = await contract2NoValue.msgData();
            txData = await contract2NoValue.txData();


        })

        it("log eq eth call ", async () => {
            expect(receiptWithValue.events[0].args[1].msgData).to.be.equal(msgData.msgData);
        })

        it('msg.data', async () => {
            expect(msgData.msgData).to.be.equal("0xd46a58c5");
        })

        it('msg.sig', async () => {
            expect(msgData.msgSig).to.be.equal("0xd46a58c5");
        })
        it('msg.value', async () => {
            expect(msgData.msgValue).to.be.equal(tx.value);
        })
        it('msg.sender', async () => {
            expect(msgData.msgSender).to.be.equal(contractWithValue.address);
        })
        it('tx.gasPrice(https://github.com/nervosnetwork/godwoken-web3/issues/377)', async () => {
            expect(txData.txGasPrice).to.be.equal(tx.gasPrice);
        })
        it('tx.origin', async () => {
            expect(txData.txOrigin).to.be.equal(contractWithValue.signer.address);
        })
    })

})