pragma solidity ^0.6.10;

contract ethCallContract{

    function getMsg() public payable returns(address msgSender,uint256 msgValue,uint256 gasLimit,uint256 blockNumber,uint256 txGasPrice,address txOrigin){
        msgSender = msg.sender;
        msgValue = msg.value;
        gasLimit = block.gaslimit;
        blockNumber = block.number;
        txGasPrice = tx.gasprice;
        txOrigin = tx.origin;
    }


}