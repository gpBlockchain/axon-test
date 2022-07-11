pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract selfdestructContractTest {
    event Deployed(address addr, uint salt);

    event deployAddr(address);
    event event_msg(uint256);

    function test_deploy() public payable returns (bool){
        selfdestructContract sc = new selfdestructContract{value : msg.value}(true, address(this));
        emit deployAddr(address(sc));
        require(address(this).balance == msg.value, "value not eq");
        require(address(sc).balance == 0, "value not eq");
        //        (,uint256 addr_balance,bytes memory addr_code,uint256 addr_code_length,bytes32 addr_codehash) = getOtherAddress(address(sc));
        //        require(addr_balance == 0,"");
        //        require(addr_code_length == 0,"code length != 0");
        //        require(addr_codehash == 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470,"code hash not eq");
        return true;
    }


    function test_invoke_destruct_address() public payable returns (bool){
        selfdestructContract sc = new selfdestructContract{value : msg.value}(false, address(this));
        emit deployAddr(address(sc));
        require(address(this).balance == 0, "value not eq");
        (,uint256 add_balance,bytes memory addr_code,uint256 addr_code_length,bytes32 addr_codehash) = getOtherAddress(address(sc));
        require(add_balance == msg.value, "value not eq");
        require(addr_code_length == 0, "code length != 0");
        sc.st(address(this));
        require(address(this).balance == msg.value, "value must eq after destruct contract");
        (, add_balance, addr_code, addr_code_length, addr_codehash) = getOtherAddress(address(sc));
        require(add_balance == 0, "");
        require(addr_code_length == 0, "code length != 0");
        return true;
    }



    // 测试 自毁 把部署之前的余额都转移出去
    function test_destruct_transfer() public payable {
        bytes memory bc = get_selfdestructContract_code(true, address(this));
        address destructAddr = getAddress(bc, 1);
        uint256 beforeTransferBalance = address(this).balance;
        payable(destructAddr).transfer(msg.value);
        require(address(this).balance != beforeTransferBalance, "this addr  balance  must transfer ");
        require(destructAddr.balance == msg.value, "must eq after transfer value.");
        address create2Address = deploy(bc, 1, 0);
        require(destructAddr == create2Address, "caculate addr must eq create2 addr");
        require(destructAddr.balance == 0, "must eq after creat2 .");
        require(address(this).balance == beforeTransferBalance, "");
    }

    function deploy(bytes memory bytecode, uint _salt, uint256 value) public payable returns (address){
        address addr;

        /*
        NOTE: How to call create2

        create2(v, p, n, s)
        create new contract with code at memory p to p + n
        and send v wei
        and return the new address
        where new address = first 20 bytes of keccak256(0xff + address(this) + s + keccak256(mem[p…(p+n)))
              s = big-endian 256-bit value
        */
        assembly {
            addr := create2(
            value, // wei sent with current call
            // Actual code starts after skipping the first 32 bytes
            add(bytecode, 0x20),
            mload(bytecode), // Load the size of code contained in the first 32 bytes
            _salt // Salt from function arguments
            )

        //            if iszero(extcodesize(addr)) {
        //                revert(0, 0)
        //            }
        }

        emit Deployed(addr, _salt);
        return addr;
    }


    function getAddress(bytes memory bytecode, uint _salt)
    public
    view
    returns (address)
    {
        bytes32 hash = keccak256(
            abi.encodePacked(bytes1(0xff), address(this), _salt, keccak256(bytecode))
        );
        return address(uint160(uint(hash)));
    }

    function get_selfdestructContract_code(bool selfdestructFlag, address addr) public view returns (bytes memory){
        bytes memory bytecode = type(selfdestructContract).creationCode;
        return abi.encodePacked(bytecode, abi.encode(selfdestructFlag, addr));
    }

    function getOtherAddress(address addr) public view returns (address, uint256, bytes memory, uint256, bytes32){
        return (addr, addr.balance, addr.code, addr.code.length, addr.codehash);
    }
}

contract selfdestructContract {

    constructor(bool selfdestructFlag, address addr) public payable{
        if (selfdestructFlag) {
            selfdestruct(payable(addr));
        }
    }

    function st(address addr) public {
        selfdestruct(payable(addr));
    }

}