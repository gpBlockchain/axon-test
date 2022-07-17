const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("type  max min data test",function (){
    //todo check receipt log
    this.timeout(600000)
    describe("typeU8 ", function () {
        let contract;

        before(async function () {
            const contractInfo = await ethers.getContractFactory("typeU8");
            contract = await contractInfo.deploy();
            console.log("deployTransaction:",contract.deployTransaction.hash);
            console.log("address:",await contract.address);
            await contract.deployed();

        });

        it("typeU8 max:", async () => {
            contract.on("U8eventIndex",(u8,u8s,uint8s3) => {
                // Emitted on every block change
                console.log("---event---begin --")
                console.log("u8",u8);
                console.log("u8s",u8s);
                console.log("uint8s3",uint8s3);
                console.log("---event---end--")
            })
            contract.on("U8event",(u8,u8s,uint8s3) => {

                // Emitted on every block change
                console.log("---event---begin --")
                console.log("u8",u8);
                console.log("u8s",u8s);
                console.log("uint8s3",uint8s3);
                console.log("---event---end--");
            })
            let tx = await contract.typeUint8(255,[255,255,255],[255,255,255]);
            console.log("typeUint8 hash :",tx.hash);
            let reusltGetUint8 =await contract.getUint8();
            //expected log
            expect(reusltGetUint8.toString()).to.be.equal('255,255,255,255,255,255,255')
            // await new Promise(r => setTimeout(r, 200000));
        })

        it("typeU8 beyond 255:", async () => {
            try {
                let tx = await contract.typeUint8(256,[256,256,256],[256,256,256]);
                console.log("typeUint8 hash :",tx.hash);
                await tx.wait();
                let reusltGetUint8 = await contract.getUint8();
                expect(reusltGetUint8.toString()).to.throw(Error)
            } catch (error) {
                expect(error.toString()).to.be.contains('out-of-bounds')
            }
        })

        it("typeU8 minest 0: ", async () => {
            let tx = await contract.typeUint8(0,[0,0,0],[0,0,0]);
            console.log("typeUint8 hash :",tx.hash);
            await tx.wait();
            let reusltGetUint8 = await contract.getUint8();
            expect(reusltGetUint8.toString()).to.be.equal('0,0,0,0,0,0,0')
        })

        it("typeU8 below 0: ", async () => {
            try
            {
                let tx = await contract.typeUint8(-1,[0,0,0],[0,0,0]);
                await tx.wait();
            }
            catch (e) {
                expect(e.toString()).to.be.contains('out-of-bounds')
            }
        })

        it("typeU256 max: ", async () => {
            await contract.setUint256(65535);
            let x =await contract.getUint256();
            expect(x).to.be.equal(65535)
        })

        it("typeU256 beyond max: ", async () => {
            try {
                await contract.setUint256(965536111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111);
                await contract.getUint256();
            }
            catch(e)
            {
                expect(e.toString()).to.be.contains('overflow')
            }

        }).timeout(30000)


    });

    describe("typeI8 ", function () {

        let contract;

        before(async function () {

            const contractInfo = await ethers.getContractFactory("typeI8");
            contract = await contractInfo.deploy();
            console.log("deployTransaction:", await contract.deployTransaction.hash);
            console.log("address:",await contract.address);
            await contract.deployed();

        });

        it("typeI8 max 127 ", async () => {

            let tx = await contract.typeInt8(127,[127,127,127],[127,127,127]);
            console.log("typeI8 hash :",tx.hash);
            await tx.wait();
            let reusltGetInt8 = await contract.getInt8();
            expect(reusltGetInt8.toString()).to.be.equal('127,127,127,127,127,127,127');

        })

        it("typeI8 max beyond 127 ", async () => {
            try {

                let tx = await contract.typeInt8(128,[128,128,128],[128,128,128]);
                console.log("typeI8 hash :",tx.hash);
                await tx.wait();
                let reusltGetInt8 = await contract.getInt8();
                expect(reusltGetInt8.toString()).to.throw(Error);

            } catch (error) {

            }
        })
    });


    describe("typeBool", function (){

        let contract;

        before(async function () {

            const contractInfo = await ethers.getContractFactory("typeBool");
            contract = await contractInfo.deploy();
            console.log("deployTransaction:",await contract.deployTransaction.hash);
            console.log("address:",await contract.address);
            await contract.deployed();

        });

        it("typeBool1", async () => {

            let a = await contract.getBoolA()
            expect(a).to.be.true;
        })

        it("typeBool2", async () => {

            let b = await contract.getBoolB();
            expect(b).to.be.true;
        })

        it("typeBool3", async () => {

            let c = await contract.getOrBool();
            expect(c).to.be.true;
        })

        it("typeBool4", async () => {

            let c = await contract.getAndBool();
            expect(c).to.be.false;
        })

        it("typeBool5", async () => {

            let c = await contract.getBoolC();
            expect(c).to.be.false;

        })

    });

    describe("typeAddress", function (){

        let contract;

        before(async function () {
            console.log("Start to test:");
        });


        it("typeAddress get addr1 balance:", async () => {
            const contractInfo = await ethers.getContractFactory("typeAddress");
            contract = await contractInfo.deploy();
            console.log("deployTransaction:",contract.deployTransaction.hash);
            console.log("address:",contract.address);
            await contract.deployed();
            let tx = await contract.getBalanceBb();
            console.log("The addr1 balance is:",tx);
            expect(tx.toString()).to.equal("0")
        });

        it("typeAddress get contract balance:", async () => {

            let tx = await contract.getContractBalance();
            console.log("The contract balance is:",tx);
            //expect(tx.toString()).to.equal(0)
        })
    });

    describe("typeBytes", function (){

        let contract;

        before(async function () {

            const contractInfo = await ethers.getContractFactory("typeBytes");
            contract = await contractInfo.deploy();
            console.log("deployTransaction:", contract.deployTransaction.hash);
            console.log("adress:",await contract.address);
            await contract.deployed();

        });

        it("typeBytes  1:", async () => {

            let bytes1Length = await contract.getbBytes1Length();
            console.log("The Bytes min length is :",bytes1Length);
            expect(bytes1Length).to.equal(1)

        }).timeout(24500)

        it("typeBytes 2:", async () => {
            try {
                await contract.pushUnFixedAByte(1);
                console.log("The Bytes min length is :",await contract.getbBytes2Length());
            }catch (e){
                return
            }
            expect('').to.be.equal('failed')
        }).timeout(145000)

        it("typeBytes 3:", async () => {

            let bytes2Length = await contract.getbBytes2Length();
            console.log("The Bytes max length is :",bytes2Length);
            expect(bytes2Length).to.equal(32)

        }).timeout(145000)

        it("typeBytes 4:", async () => {

            let bytes3Length = await contract.testBytesMaxLength("cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc");
            console.log("The Bytes max length is :",bytes3Length);
            expect(bytes3Length).to.equal(32)

        }).timeout(14500)

        it("typeBytes 5:", async () => {

            let unFixedBytesLength = await contract.unFixedBytesLength();
            console.log("The Bytes length is :",unFixedBytesLength);
            expect(unFixedBytesLength).to.equal(2)

        }).timeout(14500)

    });


    describe("typeString", function (){

        let contract;

        before(async function () {

            const contractInfo = await ethers.getContractFactory("typeString");
            contract = await contractInfo.deploy();
            console.log("deployTransaction:",contract.deployTransaction.hash);
            console.log("adress:",contract.address);
            await contract.deployed();

        });

        it("typeString:", async () => {

            let stringLength = await contract.getLength();
            console.log("The string length is :",stringLength);
            expect(stringLength).to.equal(9)

        })

        it("typeString:", async () => {

            await contract.changName();
            console.log("The new string  is :", await contract.getName());
            expect(await contract.getName()).to.equal("Zrptotest")

        })

    });


    describe("typeEmum", function (){

        let contract;

        before(async function () {

            const contractInfo = await ethers.getContractFactory("typeEmum");
            contract = await contractInfo.deploy();
            console.log("deployTransaction:",contract.deployTransaction.hash);
            console.log("adress:",contract.address);
            await contract.deployed();

        });

        it("typeEmum:", async () => {

            await contract.setGoStraight();
            let printSeason = await contract.getChoice();
            console.log(printSeason);
            //expect(printSeason).to.equal(contract.ActionChoices)
            let printSeason2 = await contract.getDefaultChoice();
            console.log(printSeason2);

        }).timeout(200000)

    });


    describe("typeFixedArray", function (){

        let contract;

        before(async function () {

            const contractInfo = await ethers.getContractFactory("typeFixedArray");
            contract = await contractInfo.deploy();
            console.log("deployTransaction:",contract.deployTransaction.hash);
            console.log("adress:",contract.address);
            await contract.deployed();

        });

        it("typeFixedArray:", async () => {

            let sum = await  contract.sum();
            console.log(sum);
            expect(sum).to.equal(15)
        })

        it("typeUnFixedArray:", async () => {

            let sum = await  contract.unsum();
            console.log(sum);
            expect(sum).to.equal(15)
        })

        it("typeUnFixedArray Push:", async () => {

            let unfixedArr = await  contract.unFixedArrPush();
            console.log(unfixedArr);

        })

    });



});