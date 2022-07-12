pragma solidity ^0.6.12;

contract StorageContract {
    uint pos0;
    mapping(address => uint) pos1;

    function StoragePos0(uint putPos0,uint putPos1) public {
        pos0 = putPos0;
        pos1[msg.sender] = putPos1;
    }



    function destruct() public{
        selfdestruct(msg.sender);
    }
}