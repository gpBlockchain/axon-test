const {ethers} = require("hardhat");
const {BigNumber} = require("ethers");


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
    let contract = await deployContractByContractName("opcode_assembly_log")
    return await getContractAddress(contract)
}

async function getFallbackAndReceiveContractAddress() {
    let contract = await deployContractByContractName("fallbackAndReceive")
    return await getContractAddress(contract)
}

async function getNoFallbackAndReceiveContractAddress() {
    let contract = await deployContractByContractName("NoFallbackAndReceive")
    return await getContractAddress(contract)
}

async function getFailedTxContractAddress(){
    let contract = await deployContractByContractName("FailedTxContract")
    return await getContractAddress(contract)
}

async function getEthCallContractAddress(){
    //ethCallContract
    let contract = await deployContractByContractName("ethCallContract")
    return await getContractAddress(contract)
}

async function getEthCallContract(){
    //ethCallContract
    return  await deployContractByContractName("ethCallContract")
}

async function deploySelfDestructContract() {
    return deployContractByContractName("selfDestructContract")
}

async function deployLogContractAddress() {
    return await getContractAddress(await deployContractByContractName("LogContract"))
}

async function deployContractByContractName(contractName){
    let nonceOfFrom = await getNonce(ethers.provider.getSigner(0).getAddress())
    let contractInfo = await ethers.getContractFactory(contractName);
    return await contractInfo.deploy({
        maxFeePerGas: '0xffff',
        maxPriorityFeePerGas: '0x1',
        nonce: nonceOfFrom
    })
}


async function getContractAddress(contract){
    return (await contract.deployTransaction.wait()).contractAddress

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

async function getAxonParam(){
    let nonceOfFrom = await getNonce(ethers.provider.getSigner(0).getAddress())
    return {
        maxFeePerGas: '0xffff',
        maxPriorityFeePerGas: '0x1',
        nonce: nonceOfFrom
    }
}


/**
 * contract : LogContract
 * method : testLog(uint256 logCount)
 * get testLog(uint256 logCount) sig
 * @param number logCount
 * @returns {string} hexSig
 */
function getTestLogSigByTimes(number) {
    // contract : LogContract
    //    function testLog(uint256 logCount) public returns (uint256){
    let logSig = "0x5ac1b16a" + ethers.utils.defaultAbiCoder.encode(['uint256'],[BigNumber.from(number)]).substring(2)
    return logSig;
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
    deployLogContractAddress,
    getTestLogSigByTimes,
    getFailedTxContractAddress,
    getEthCallContractAddress,
    getEthCallContract,
    getContractAddress
}