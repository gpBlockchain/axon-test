pragma solidity ^0.8.4;

contract sha256Contract {

    bytes32 public result;

    event opKeccak256Log(string _word, bytes32 result);

    function opKeccak256WithLog(string memory _word, bytes32 exResult) public {
        bytes32 bts32 = opKeccak256(_word);
        emit opKeccak256Log(_word, bts32);
        result = bts32;
        require(result == exResult, string(abi.encodePacked("result not eq :", result, ",result", exResult)));
    }

    function opKeccak256(string memory _word) public pure returns (bytes32 result){
        return keccak256(abi.encodePacked(_word));
    }


}