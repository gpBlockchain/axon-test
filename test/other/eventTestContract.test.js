const {ethers} = require("hardhat");
const {expect} = require("chai");


describe("eventTestContract", function () {
    this.timeout(600000)

    let contract;

    before(async function () {
        const contractInfo = await ethers.getContractFactory("eventTestContract");
        contract = await contractInfo.deploy();
        await contract.deployed();
        console.log("contractAddress:", contract.address);
    });

    it("emit 10000 log ,should return 100000 log msg ", async () => {
        let tx = await contract.testLog(10000,{gasLimit:25000000});
        let response = await tx.wait()
        expect(response.logs.length).to.be.equal(10000)
        for (let i = 0; i < response.logs.length; i++) {
            let data = response.logs[i].data;
            expect(data).to.be.equal('0x0000000000000000000000000000000000000000000000000000000000000000')
        }
    });

    it("log1 2,should return 2 log msg", async () => {
        let tx = await contract.testLog1(2,{gasLimit:25000000});
        let response = await tx.wait()
        expect(response.logs.length).to.be.equal(2)
        for (let i = 0; i < response.logs.length; i++) {
            let data = response.logs[i].data;
            expect(data).to.be.equal('0x0000000000000000000000000000000000000000000000000000000000000000')
        }
    });

    it("log2 2,should return 2 log msg", async () => {
        let tx = await contract.testLog2(2,{gasLimit:25000000});
        let response = await tx.wait()
        expect(response.logs.length).to.be.equal(2)
        for (let i = 0; i < response.logs.length; i++) {
            let data = response.logs[i].data;
            expect(data).to.be.equal('0x0000000000000000000000000000000000000000000000000000000000000000')
        }
    });

    it("log3 2,should return 2 log msg", async () => {
        let tx = await contract.testLog3(2,{gasLimit:25000000});
        let response = await tx.wait()
        expect(response.logs.length).to.be.equal(2)
        for (let i = 0; i < response.logs.length; i++) {
            let data = response.logs[i].data;
            expect(data).to.be.equal('0x0000000000000000000000000000000000000000000000000000000000000000')
        }
    });

    it("log4 2,should return 2 log msg ", async () => {
        let tx = await contract.testLog4(2,{gasLimit:25000000});
        let response = await tx.wait()
        expect(response.logs.length).to.be.equal(2)
        for (let i = 0; i < response.logs.length; i++) {
            let data = response.logs[i].data;
            expect(data).to.be.equal('0x0000000000000000000000000000000000000000000000000000000000000000')
        }
    });


    it("event  ", async () => {
        //    function testEvent(uint256 begin,uint rd,uint256 mid ,uint end) public {
        let tx = await contract.testEvent(3,10,0,0,{gasLimit:25000000});
        let response = await tx.wait()
        expect(response.logs.length).to.be.equal(3)
        for (let i = 0; i < response.logs.length; i++) {
            let data = response.logs[i].data;
            expect(data).to.be.equal('0x0000000000000000000000000000000000000000000000000000000000000000')
        }
    });

    //function testEvent(uint256 begin,uint rd,uint256 mid ,uint end) public {
    //
    //         for(uint256 i=0;i<begin;i++){
    //             emit blockHashEvent(bytes32(0));
    //         }
    //
    //         for(uint256 i=rd;i<rd+mid;i++){
    //             emit blockHashEvent(sha256(abi.encode(i)));
    //         }
    //         for(uint256 i=0;i<end;i++){
    //             emit blockHashEvent(bytes32(0));
    //         }
    //     }


})