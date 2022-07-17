const {ethers} = require("hardhat");
const {getTxReceipt} = require("../utils/rpc.js");
const {expect} = require("chai");
// FailedTxContract
//  enum ModDataStyle{
//         NORMAL,          //0: mod int int[] string map  data
//         CROSS_NORMAL,    //1: mod cross contract's int int[] string map data
//         BRIDGE_TRANSFER, //2: mod proxy ckb token data
//         SELF_DESTRUCT,   //3: self destruct
//         CREATE2,         //4: deploy new contract use create2
//         DELEGATE_CALL,   //5: delegate call mod self int int[] string map data
//         CLS_DESTRUCT     //6: mod other contract data use cross call
//     }
//     https://blog.soliditylang.org/2020/12/16/solidity-v0.8.0-release-announcement/
//     notice : only support > 0.8.0
//     enum FailedStyle{
//         NO,         // 0: normal tx
//         REQUIRE_1,  // 1: failed for require(false)
//         ASSERT01,   // 2: 0x01: assert false
//         ASSERT11,   // 3: 0x11: If an arithmetic operation results in underflow or overflow
//         ASSERT12,   // 4: 0x12: divide or divide modulo by zero
//         ASSERT21,   // 5: 0x21: If you convert a value that is too big or negative into an enum type.
//         ASSERT22,   // 6: 0x22: If you access a storage byte array that is incorrectly encoded.
//         ASSERT31,   // 7: 0x31: If you call .pop() on an empty array.
//         ASSERT32,   // 8: 0x32: If you access an array, bytesN or an array slice at an out-of-bounds or negative index (i.e. x[i] where i >= x.length or i < 0).
//         ASSERT41,   // 9: 0x41: If you allocate too much memory or create an array that is too large.
//         ASSERT51,   // 10: todo:0x51: If you call a zero-initialized variable of internal function type.
//         Error1,     // 11: error
//     }
describe("Failed commit tx", function () {
    this.timeout(10000000)
    let failedContract070;
    let failedContract080;

    before(async function () {
        console.log('070')
        failedContract070 = await prepareFailedTxContract("contracts/failedTx/failedTxContract0.7.0.sol:FailedTxContract")
        console.log('080')
        failedContract080 = await prepareFailedTxContract("contracts/failedTx/failedTxContract.0.8.4.sol:FailedTxContract")

    });

    it("normal tx will change the world(0.7.0)", async () => {
        console.log('-------')
        let response1 = await invoke_before_test_after(failedContract070, [0], 0, false, true, 2)
        for (let i = 0; i < response1.afterModArray.length; i++) {
            expect(response1.afterModArray[i]).to.be.not.equal(response1.beforeModArray[i])
        }

    })

    it("normal tx will change the world(0.8.0)", async () => {
        let response1 = await invoke_before_test_after(failedContract080, [0, 1, 4, 5], 0, false, true, 2)
        for (let i = 0; i < response1.afterModArray.length; i++) {
            expect(response1.afterModArray[i]).to.be.not.equal(response1.beforeModArray[i])
        }

    })

    it("deploy the contract without the payable construct method", async () => {
        let txHash = await ethers.provider.send("eth_sendTransaction", [{
            "gas": "0x2fa000",
            "value": "0x11",
            "data": "0x608060405234801561001057600080fd5b50610cc5806100206000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c806320039f1f14610051578063806b3bc914610081578063a31eddf4146100b1578063a6d6ff4c146100e1575b600080fd5b61006b60048036038101906100669190610763565b610111565b6040516100789190610a30565b60405180910390f35b61009b60048036038101906100969190610624565b6101ce565b6040516100a891906109e5565b60405180910390f35b6100cb60048036038101906100c691906106a3565b610337565b6040516100d891906109e5565b60405180910390f35b6100fb60048036038101906100f69190610624565b6103a6565b60405161010891906109e5565b60405180910390f35b600080607b905060006002848360405160200161012f929190610953565b60405160208183030381529060405260405161014b919061093c565b602060405180830381855afa158015610168573d6000803e3d6000fd5b5050506040513d601f19601f8201168201806040525081019061018b919061073a565b90507f206c99af80077bd66fda00313ef6a84748262ff79fed184db845e6d9e0f0b607816040516101bc9190610a30565b60405180910390a18092505050919050565b60007fd062abfcb02dc166d9c06a70c6044c60a13ba31dd286f60e5b97e66ec9417e6284846040516102019291906109b5565b60405180910390a1600060608573ffffffffffffffffffffffffffffffffffffffff1685604051610232919061093c565b6000604051808303816000865af19150503d806000811461026f576040519150601f19603f3d011682016040523d82523d6000602084013e610274565b606091505b50915091507f55c40295a06df6d08f98e75808b8364f546dc7217f1dc12c5611fb676d63635382826040516102aa929190610a00565b60405180910390a1838051906020012081805190602001201461032a57606081856040516020016102dc92919061097b565b6040516020818303038152906040529050806040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103219190610a6d565b60405180910390fd5b6001925050509392505050565b600080600090505b845181101561039a5761038c85828151811061035757fe5b602002602001015185838151811061036b57fe5b602002602001015185848151811061037f57fe5b60200260200101516101ce565b50808060010191505061033f565b50600190509392505050565b60008060608573ffffffffffffffffffffffffffffffffffffffff16856040516103d0919061093c565b6000604051808303816000865af19150503d806000811461040d576040519150601f19603f3d011682016040523d82523d6000602084013e610412565b606091505b50915091507fb58566e6210f411973b0f957e0f1582860e35f22636c98faf436de09f6b38177816040516104469190610a4b565b60405180910390a16001925050509392505050565b60008135905061046a81610c61565b92915050565b600082601f83011261048157600080fd5b813561049461048f82610abc565b610a8f565b915081818352602084019350602081019050838560208402820111156104b957600080fd5b60005b838110156104e957816104cf888261045b565b8452602084019350602083019250506001810190506104bc565b5050505092915050565b600082601f83011261050457600080fd5b813561051761051282610ae4565b610a8f565b9150818183526020840193506020810190508360005b8381101561055d5781358601610543888261057c565b84526020840193506020830192505060018101905061052d565b5050505092915050565b60008151905061057681610c78565b92915050565b600082601f83011261058d57600080fd5b81356105a061059b82610b0c565b610a8f565b915080825260208301602083018583830111156105bc57600080fd5b6105c7838284610c04565b50505092915050565b600082601f8301126105e157600080fd5b81356105f46105ef82610b38565b610a8f565b9150808252602083016020830185838301111561061057600080fd5b61061b838284610c04565b50505092915050565b60008060006060848603121561063957600080fd5b60006106478682870161045b565b935050602084013567ffffffffffffffff81111561066457600080fd5b6106708682870161057c565b925050604084013567ffffffffffffffff81111561068d57600080fd5b6106998682870161057c565b9150509250925092565b6000806000606084860312156106b857600080fd5b600084013567ffffffffffffffff8111156106d257600080fd5b6106de86828701610470565b935050602084013567ffffffffffffffff8111156106fb57600080fd5b610707868287016104f3565b925050604084013567ffffffffffffffff81111561072457600080fd5b610730868287016104f3565b9150509250925092565b60006020828403121561074c57600080fd5b600061075a84828501610567565b91505092915050565b60006020828403121561077557600080fd5b600082013567ffffffffffffffff81111561078f57600080fd5b61079b848285016105d0565b91505092915050565b6107ad81610bb2565b82525050565b6107bc81610bc4565b82525050565b6107cb81610bd0565b82525050565b60006107dc82610b64565b6107e68185610b7a565b93506107f6818560208601610c13565b6107ff81610c50565b840191505092915050565b600061081582610b64565b61081f8185610b8b565b935061082f818560208601610c13565b80840191505092915050565b600061084682610b6f565b6108508185610b96565b9350610860818560208601610c13565b61086981610c50565b840191505092915050565b600061087f82610b6f565b6108898185610ba7565b9350610899818560208601610c13565b80840191505092915050565b60006108b2600c83610ba7565b91507f65786563206661696c64203a00000000000000000000000000000000000000006000830152600c82019050919050565b60006108f2600383610ba7565b91507f23232300000000000000000000000000000000000000000000000000000000006000830152600382019050919050565b61093661093182610bfa565b610c46565b82525050565b6000610948828461080a565b915081905092915050565b600061095f8285610874565b915061096b8284610925565b6020820191508190509392505050565b6000610986826108a5565b9150610992828561080a565b915061099d826108e5565b91506109a9828461080a565b91508190509392505050565b60006040820190506109ca60008301856107a4565b81810360208301526109dc81846107d1565b90509392505050565b60006020820190506109fa60008301846107b3565b92915050565b6000604082019050610a1560008301856107b3565b8181036020830152610a2781846107d1565b90509392505050565b6000602082019050610a4560008301846107c2565b92915050565b60006020820190508181036000830152610a6581846107d1565b905092915050565b60006020820190508181036000830152610a87818461083b565b905092915050565b6000604051905081810181811067ffffffffffffffff82111715610ab257600080fd5b8060405250919050565b600067ffffffffffffffff821115610ad357600080fd5b602082029050602081019050919050565b600067ffffffffffffffff821115610afb57600080fd5b602082029050602081019050919050565b600067ffffffffffffffff821115610b2357600080fd5b601f19601f8301169050602081019050919050565b600067ffffffffffffffff821115610b4f57600080fd5b601f19601f8301169050602081019050919050565b600081519050919050565b600081519050919050565b600082825260208201905092915050565b600081905092915050565b600082825260208201905092915050565b600081905092915050565b6000610bbd82610bda565b9050919050565b60008115159050919050565b6000819050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b82818337600083830152505050565b60005b83811015610c31578082015181840152602081019050610c16565b83811115610c40576000848401525b50505050565b6000819050919050565b6000601f19601f8301169050919050565b610c6a81610bb2565b8114610c7557600080fd5b50565b610c8181610bd0565b8114610c8c57600080fd5b5056fea2646970667358221220203db93b05c0eb2a631d08893702c2d7c6cd5b48aa97633b506b71dfabf2881b64736f6c634300060c0033"
        }]);
        await checkResponseOfFailedTx(txHash, false)
    })
    describe("failed tx does not change the world", function () {

        it("1. ModDataStyle.NORMAL 2.FailedStyle.ASSERT01", async () => {
            let response = await invoke_before_test_after(failedContract070, [0], 2, true, true)
            expect(response.beforeModArray.toString()).to.be.equal(response.afterModArray.toString())
        })
        it("1.ModDataStyle.NORMAL, ModDataStyle.CROSS_NORMAL 2.FailedStyle.ASSERT01", async () => {
            let response = await invoke_before_test_after(failedContract070, [0, 1], 2, true, true)
            expect(response.beforeModArray.toString()).to.be.equal(response.afterModArray.toString())
        })


        // it("自毁合约", async () => {
        //     //no
        //     // let response = await invoke_before_test_after(contract,[0,1,2],2,true,true)
        //     // expect(response.beforeModArray.toString()).to.be.equal(response.afterModArray.toString())
        // })

        it("1. ModDataStyle.NORMAL, ModDataStyle.CROSS_NORMAL ModDataStyle.BRIDGE_TRANSFER,ModDataStyle.CREATE2 ModDataStyle. 2.FailedStyle.ASSERT01", async () => {
            let response = await invoke_before_test_after(failedContract070, [0, 1, 4], 2, true, true)
            expect(response.beforeModArray.toString()).to.be.equal(response.afterModArray.toString())
        })

        it("1. ModDataStyle.NORMAL, ModDataStyle.CROSS_NORMAL ModDataStyle.BRIDGE_TRANSFER,ModDataStyle.CREATE2,ModDataStyle.DELEGATE_CALL 2.FailedStyle.ASSERT01", async () => {
            let response = await invoke_before_test_after(failedContract070, [0, 1, 4, 5], 2, true, true)
            expect(response.beforeModArray.toString()).to.be.equal(response.afterModArray.toString())

        })

        it("1. ModDataStyle.NORMAL, ModDataStyle.CROSS_NORMAL ModDataStyle.BRIDGE_TRANSFER,ModDataStyle.CREATE2,ModDataStyle.DELEGATE_CALL,ModDataStyle.CLS_DESTRUCT 2.FailedStyle.ASSERT01", async () => {
            let response = await invoke_before_test_after(failedContract070, [0, 1,  4, 5, 6], 2, true, true)
            expect(response.beforeModArray.toString()).to.be.equal(response.afterModArray.toString())
        })
    })

    describe("Revert", function () {
        it("require", async () => {
            console.log("deploy contains require method contract")
            let contractInfo = await ethers.getContractFactory("contracts/failedTx/failedTxContract.0.8.4.sol:FailedTxContract");
            let contract = await contractInfo.deploy()
            await contract.deployed()
            console.log("invoke require method ")
            await invoke_before_test_after(contract, [0], 1, true, false)
        })

        it("out of gas tx(max cycles exceeded) (https://github.com/RetricSu/godwoken-kicker/issues/279)", async () => {
            let eventTestContractInfo = await ethers.getContractFactory("eventTestContract");
            contract = await eventTestContractInfo.deploy()
            await contract.deployed()
            let tx = await contract.testEvent(2, 7, 1, 17500, {gasLimit: "0x989680"})
            let response = await getTxReceipt(ethers.provider, tx.hash, 10)
            expect(response.status).to.be.equal(0)
        }).timeout(100000)

        it("out of gas(handle message failed)", async () => {
            let eventTestContractInfo = await ethers.getContractFactory("eventTestContract");
            let contract = await eventTestContractInfo.deploy()
            await contract.deployed()
            let tx = await contract.testLog(300000, {gasLimit: "0x989680"})
            let response = await getTxReceipt(ethers.provider, tx.hash, 100)
            expect(response.status).to.be.equal(0)
        }).timeout(60000)
    })

    describe("Assert(0.8.0)", function () {
        //Revert on assertion failures and similar conditions instead of using the invalid opcode.

        it("Revert 0x01", async () => {
            let response = await invoke_before_test_after(failedContract080, [0, 1,  4, 5, 6], 2, true, false)
            expect(response.beforeModArray.toString()).to.be.equal(response.afterModArray.toString())
        })

        it("Revert 0x11", async () => {
            let response = await invoke_before_test_after(failedContract080, [0, 1,  4, 5, 6], 3, true, false)
            expect(response.beforeModArray.toString()).to.be.equal(response.afterModArray.toString())
        })

        it("Revert 0x12", async () => {
            let response = await invoke_before_test_after(failedContract080, [0, 1,  4, 5, 6], 4, true, false)
            expect(response.beforeModArray.toString()).to.be.equal(response.afterModArray.toString())
        })

        it("Revert 0x21", async () => {
            let response = await invoke_before_test_after(failedContract080, [0, 1,  4, 5, 6], 5, true, false)
            expect(response.beforeModArray.toString()).to.be.equal(response.afterModArray.toString())

        })

        it("Revert 0x22", async () => {
            let response = await invoke_before_test_after(failedContract080, [0, 1, 4, 5, 6], 6, true, false)
            expect(response.beforeModArray.toString()).to.be.equal(response.afterModArray.toString())

        })

        it("Revert 0x31", async () => {
            let response = await invoke_before_test_after(failedContract080, [0, 1,  4, 5, 6], 7, true, false)
            expect(response.beforeModArray.toString()).to.be.equal(response.afterModArray.toString())
        })

        it("Revert 0x32", async () => {
            let response = await invoke_before_test_after(failedContract080, [0, 1,  4, 5, 6], 8, true, false)
            expect(response.beforeModArray.toString()).to.be.equal(response.afterModArray.toString())
        })

        it("Revert 0x41", async () => {
            let response = await invoke_before_test_after(failedContract080, [0, 1,  4, 5, 6], 9, true, false)
            expect(response.beforeModArray.toString()).to.be.equal(response.afterModArray.toString())
        })

        it("Revert 0x51", async () => {
            //todo
            let response = await invoke_before_test_after(failedContract080, [0, 1,  4, 5, 6], 10, true, false)
            expect(response.beforeModArray.toString()).to.be.equal(response.afterModArray.toString())
        })
    })


})


async function checkResponseOfFailedTx(txHash, isLow080Panic) {
    // check status = 0
    console.log("--------------checkResponseOfFailedTx--------------")
    let txReceipt = await getTxReceipt(ethers.provider, txHash, 100)
    expect(txReceipt.status).to.be.equal(0);
    let txInfo = await ethers.provider.getTransaction(txHash)
    console.log("txInfo:", txInfo)
    //check nonce +1
    let nonce = await ethers.provider.getTransactionCount(txInfo.from)
    expect(nonce - txInfo.nonce).to.be.equal(1)
    if (isLow080Panic) {
        // gasLimit == gasUsed
        expect(txInfo.gasLimit.toString()).to.be.equal(txReceipt.gasUsed.toString())
        return
    }
    // gasUsed > gasLimit
    expect(txInfo.gasLimit - txReceipt.gasUsed >= 0).to.be.equal(true)
}


async function prepareFailedTxContract(solFailedTxContractPath) {
    let contractInfo = await ethers.getContractFactory(solFailedTxContractPath);
    let contractInfo1 = await ethers.getContractFactory(solFailedTxContractPath);
    let contractInfo2 = await ethers.getContractFactory(solFailedTxContractPath);

    let contract1 = await contractInfo1.deploy()
    let contract = await contractInfo.deploy()
    let contract2 = await contractInfo2.deploy()
    await contract2.deployed();
    await contract.deployed();
    await contract1.deployed();
    //deploy ckb proxy address
    //invoke prepare method
    await contract.prepare(contract1.address, contract2.address, {"value": "0x123450"})
    return contract;
}

async function invoke_before_test_after(contract, modTypeArray, illStyle, expectedIsFailedTx, expectedIsLow080Panic, waitBlockNum = 1) {
    let beforeModArray = []
    let afterModArray = []
    console.log("check data before invoke failed tx")
    for (let i = 0; i < modTypeArray.length; i++) {
        let beforeMod = await contract.getModHash(modTypeArray[i])
        beforeModArray.push(beforeMod)
    }
    if (expectedIsFailedTx) {
        let txHashResponse = await contract.test(modTypeArray, illStyle, {"gasLimit": "0x1e8480"});
        await checkResponseOfFailedTx(txHashResponse.hash, expectedIsLow080Panic)
    } else {
        let txHash = await contract.test(modTypeArray, illStyle);
        await txHash.wait()
    }
    console.log("check data after invoke failed tx")
    for (let i = 0; i < modTypeArray.length; i++) {
        try {
            let afterMod = await contract.getModHash(modTypeArray[i])
            afterModArray.push(afterMod)
        } catch (e) {
            afterModArray.push(e.toString())
        }

    }
    console.log("before data:", beforeModArray)
    console.log("after data", afterModArray)
    return {beforeModArray, afterModArray}
}