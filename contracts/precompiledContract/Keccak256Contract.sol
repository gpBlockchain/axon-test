pragma solidity ^0.8.4;

contract Keccak256Contract {

    function callKeccak256(bytes memory data) public pure returns(bytes32 result){
        return keccak256(data);
    }

    function callKeccak2561(bytes memory data) public pure returns(bytes32 result){
        return keccak256(data);
    }

    function callKeccak256Abc() public pure returns(bytes32 result){
        return keccak256("ABC");
    }

}