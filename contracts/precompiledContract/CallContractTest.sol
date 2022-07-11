pragma solidity ^0.6.6;
pragma experimental ABIEncoderV2;

contract CallContractTest{

    event hashResult(bytes32);

    event hashResult(address,bytes);

    event execResult(bool,bytes);

    event resultExe(bytes);

    function sha256hashTest(string memory input) public returns(bytes32) {
        uint256 time = 123;
        bytes32 id = sha256(abi.encodePacked(input, time));

        emit hashResult(id);
        return id;

    }


    function testCalls(address[] memory addrs,bytes[] memory invokeSigns,bytes[] memory expected) public returns(bool){

        for(uint i=0;i<addrs.length;i++){
            testCall(addrs[i],invokeSigns[i],expected[i]);
        }
        return true;

    }

    function testCall(address  addrs,bytes memory invokeSigns,bytes memory expected) public  returns(bool){

        emit hashResult(addrs,invokeSigns);
        (bool success, bytes memory returnData) = addrs.call(invokeSigns);
        emit execResult(success,returnData);
        if(keccak256(returnData) != keccak256(expected)){
            string memory s1 = string(abi.encodePacked("exec faild :",returnData,"###",expected));
            revert(s1);
        }
        return true;

    }

    function testCallEvent(address  addrs,bytes memory invokeSigns,bytes memory expected) public returns(bool){
        (bool success, bytes memory returnData) = addrs.call(invokeSigns);
        emit resultExe(returnData);
        return true;

    }


    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }


    function recover(bytes32 dataHash, bytes memory sig) internal pure returns (address) {
        bytes32 hash = dataHash; // keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", dataHash));

        bytes32 r;
        bytes32 s;
        uint8 v;

        // Check the signature length
        if (sig.length != 65) {
            return address(0x0);
        }

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }

        return ecrecover(hash, v, r, s);
    }

}