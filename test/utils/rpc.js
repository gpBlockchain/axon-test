const {ethers} = require("hardhat");


async function eth_getTransactionCount(queryAddress) {
    let latestNonce = ethers.provider.getTransactionCount(queryAddress, 'latest')
    let pendingNonce = ethers.provider.getTransactionCount(queryAddress, 'pending')
    let earliestNonce = ethers.provider.getTransactionCount(queryAddress, 'earliest')
    return {'earliestNonce': await earliestNonce, 'pendingNonce': await pendingNonce, 'latestNonce': await latestNonce}
}

async function eth_getBalance(queryAddress) {
    let latestBalance = ethers.provider.getBalance(queryAddress, 'latest')
    let pendingBalance = ethers.provider.getBalance(queryAddress, 'pending')
    let earliestBalance = ethers.provider.getBalance(queryAddress, 'earliest')
    return {
        'earliestBalance': await earliestBalance,
        'pendingBalance': await pendingBalance,
        'latestBalance': await latestBalance
    }
}

async function eth_getBalance1(queryAddress, blockNum) {
    //todo
}

async function transferCkb(transferTo, value) {
    let nonceOfFrom = await getNonce(ethers.provider.getSigner(0).getAddress())
    let tx = await ethers.provider.getSigner(0).sendTransaction({
        to: transferTo,
        value: value,
        data: '0x',
        maxFeePerGas: '0xffffffff',
        maxPriorityFeePerGas: '0x1',
        nonce: nonceOfFrom
    })
    await tx.wait(1)
}

async function getDeployLogContractAddress() {
    let logContract = await ethers.getContractFactory("opcode_assembly_log");
    let nonceOfFrom = await getNonce(ethers.provider.getSigner(0).getAddress())
    let tx = await ethers.provider.getSigner(0).sendTransaction({
        data: logContract.bytecode,
        maxFeePerGas: '0xffff',
        maxPriorityFeePerGas: '0x1',
        nonce: nonceOfFrom
    })
    let response = await tx.wait(1)
    return response.contractAddress
}

async function getFallbackAndReceiveContractAddress() {
    let logContract = await ethers.getContractFactory("fallbackAndReceive");
    let nonceOfFrom = await getNonce(ethers.provider.getSigner(0).getAddress())
    let tx = await ethers.provider.getSigner(0).sendTransaction({
        data: logContract.bytecode,
        // maxFeePerGas: '0xffff',
        // maxPriorityFeePerGas: '0x1',
        // nonce: nonceOfFrom
    })
    let response = await tx.wait(1)
    return response.contractAddress
}

async function getNoFallbackAndReceiveContractAddress() {
    let logContract = await ethers.getContractFactory("NoFallbackAndReceive");
    let nonceOfFrom = await getNonce(ethers.provider.getSigner(0).getAddress())
    let tx = await ethers.provider.getSigner(0).sendTransaction({
        data: logContract.bytecode,
        // maxFeePerGas: '0xffff',
        // maxPriorityFeePerGas: '0x1',
        // nonce: nonceOfFrom
    })
    let response = await tx.wait(1)
    return response.contractAddress
}


async function deploySelfDestructContract() {
    let nonceOfFrom = await getNonce(ethers.provider.getSigner(0).getAddress())
    let selfDestructContractInfo = await ethers.getContractFactory("selfDestructContract");
    let selfDestructContract = await selfDestructContractInfo.deploy({
        maxFeePerGas: '0xffff',
        maxPriorityFeePerGas: '0x1',
        nonce: nonceOfFrom
    })
    await selfDestructContract.deployed()
    return selfDestructContract
}

async function invokeContract(contractAddress,payload) {
    let nonceOfFrom = await getNonce(ethers.provider.getSigner(0).getAddress())
    let tx = await ethers.provider.getSigner(0).sendTransaction({
        to:contractAddress,
        data: payload,
        maxFeePerGas: '0xffff',
        maxPriorityFeePerGas: '0x1',
        nonce: nonceOfFrom
    })
    let response = await tx.wait(1)
    return response
}

//axon
async function getNonce(from) {
    // bug
    let nonce = await ethers.provider.getTransactionCount(from, 'latest')
    return nonce + 1
}

module.exports = {
    eth_getTransactionCount,
    eth_getBalance,
    transferCkb,
    getDeployLogContractAddress,
    deploySelfDestructContract,
    invokeContract,
    getNonce,
    getFallbackAndReceiveContractAddress,
    getNoFallbackAndReceiveContractAddress,
}