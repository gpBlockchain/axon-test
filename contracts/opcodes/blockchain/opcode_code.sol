pragma solidity ^0.8.6;

//extcodesize
//extcodecopy
//codecopy
contract opcode_code {
    bytes public a;
    bytes public b;

    function at(address addr) public view returns (bytes memory code) {
        assembly {
        // retrieve the size of the code, this needs assembly
            let size := extcodesize(addr)
        // allocate output byte array - this could also be done without assembly
        // by using code = new bytes(size)
            code := mload(0x40)
        // new "memory end" including padding
            mstore(0x40, add(code, and(add(add(size, 0x20), 0x1f), not(0x1f))))
        // store length in memory
            mstore(code, size)
        // actually retrieve the code, this needs assembly
            extcodecopy(addr, add(code, 0x20), 0, size)
        }
    }

    function ass(uint256 b2, uint256 cc1, uint256 cc2) public view returns (bytes memory a, bytes memory b){
        assembly {
            a := mload(0x40)
            b := add(a, b2)
            codecopy(a, cc1, cc2)
        }
    }


    function storeData(uint256 b2, uint256 cc1, uint256 cc2) public {
        (a, b) = ass(b2, cc1, cc2);
    }

    function getAB() public view returns (bytes memory, bytes memory){
        return (a, b);
    }
}
