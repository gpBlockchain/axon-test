const {ethers} = require("hardhat");
const {BigNumber} = require("ethers");


async function eth_getTransactionCount(queryAddress) {
    console.log('address:',queryAddress)
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
    // let nonceOfFrom = await getNonce(ethers.provider.getSigner(0).getAddress())
    let tx = await ethers.provider.getSigner(0).sendTransaction({
        to: transferTo,
        value: value,
        data: '0x',
        // maxFeePerGas: '0xffffffff',
        // maxPriorityFeePerGas: '0x1',
        // nonce: nonceOfFrom
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
    let contract = await deployContractByContractName("contracts/noFallbackAndReceive.sol:NoFallbackAndReceive")
    return await getContractAddress(contract)
}

async function getFailedTxContractAddress(){
    let contract = await deployContractByContractName("contracts/failedTxContract.0.8.4.sol:FailedTxContract")
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

async function getSelfDestructContractAddress() {
    return await getContractAddress(await deployContractByContractName("selfDestructContract"))
}

async function deployLogContractAddress() {
    return await getContractAddress(await deployContractByContractName("contracts/LogContract.sol:LogContract"))
}

async function deployContractByContractName(contractName){
    // let nonceOfFrom = await getNonce(ethers.provider.getSigner(0).getAddress())
    let contractInfo = await ethers.getContractFactory(contractName);
    return await contractInfo.deploy({
        // maxFeePerGas: '0xffff',
        // maxPriorityFeePerGas: '0x1',
        // nonce: nonceOfFrom
    })
}


async function getContractAddress(contract){
    return (await contract.deployTransaction.wait()).contractAddress

}

async function invokeContract(contractAddress,payload) {
    // let nonceOfFrom = await getNonce(ethers.provider.getSigner(0).getAddress())
    let tx = await ethers.provider.getSigner(0).sendTransaction({
        to:contractAddress,
        data: payload,
        // maxFeePerGas: '0xffff',
        // maxPriorityFeePerGas: '0x1',
        // nonce: nonceOfFrom
    })
    let response = await tx.wait(1)
    return response
}

//axon
async function getNonce(from) {
    // bug
    let nonce = await ethers.provider.getTransactionCount(from, 'latest')
    return nonce+1
}

async function getAxonParam(){
    let nonceOfFrom = await getNonce(ethers.provider.getSigner(0).getAddress())
    return {
        maxFeePerGas: '0xffff',
        maxPriorityFeePerGas: '0x1',
        nonce: nonceOfFrom
    }
}

async function getTxReceipt(provider, txHash, count) {
    let response
    for (let i = 0; i < count; i++) {
        response = await provider.getTransactionReceipt(txHash);
        if (response == null) {
            await sleep(2000)
            continue;
        }
        if (response.confirmations >= 1) {
            return response
        }
        await sleep(2000)
    }
    return response
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

async function sleep(timeOut){
    await new Promise(r => setTimeout(r, timeOut));
}

async function getGasPrice(provider) {
    let gasPrice = await provider.getGasPrice();
    if (gasPrice < 16) {
        return "0x" + gasPrice._hex.toLowerCase().replaceAll("0x0", "");
    }
    return gasPrice.toHexString().replaceAll("0x0", "0x");
}


async function sendTxToAddBlockNum(provider, blockNum) {

    let endNum = await provider.getBlockNumber() + blockNum;
    let currentNum = await provider.getBlockNumber();
    console.log("currentNum:", currentNum, " end:", endNum)
    let contractAddress = await ethers.provider.getSigner(0).getAddress()
    while (currentNum < endNum) {
        let txCount = provider.getTransactionCount(contractAddress);
        console.log(contractAddress, " count:", await txCount)
        await sendRandomTx(provider)
        currentNum = await provider.getBlockNumber();
        console.log("currentNum:", currentNum, " end:", endNum)
    }
    console.log("curren block num:", endNum)
}


async function sendRandomTx(provider) {
    let logContract = await ethers.getContractFactory("eventDeployLogContract");
    try {
        await provider.send("eth_sendTransaction", [{
            "from":(await ethers.getSigner(1)).address,
            "data": logContract.bytecode
        }]);
    } catch (e) {
    }
}




function BigInterToHexString(bn) {
    if (bn < 16) {
        return "0x" + bn.toHexString().replaceAll("0x0", "");
    }
    return bn.toHexString().replaceAll("0x0", "0x");
}

module.exports = {
    eth_getTransactionCount,
    eth_getBalance,
    transferCkb,
    getDeployLogContractAddress,
    getSelfDestructContractAddress,
    invokeContract,
    getNonce,
    getFallbackAndReceiveContractAddress,
    getNoFallbackAndReceiveContractAddress,
    deployLogContractAddress,
    getTestLogSigByTimes,
    getFailedTxContractAddress,
    getEthCallContract,
    getContractAddress,
    getTxReceipt,
    deployContractByContractName,
    BigInterToHexString,
    getGasPrice,
    sendTxToAddBlockNum
}