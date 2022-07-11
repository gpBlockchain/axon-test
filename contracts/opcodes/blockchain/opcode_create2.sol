pragma solidity ^0.8.6;

contract create2_test {

    Factory factory;
    FactoryAssembly factoryAssembly;

    event GasCost(uint256 gasCost);
    event DeployContract(uint256 idx, address deployAddress);
    constructor() public {
        factory = new Factory();
        factoryAssembly = new FactoryAssembly();
    }

    function testCreate() public returns (bool){
        bytes memory codeBytes = factoryAssembly.getBytecode(msg.sender, 1);
        address calculateAddress = factoryAssembly.getAddress(codeBytes, 1);
        address deployAddress = factoryAssembly.deploy(codeBytes, 1);
        //        console.log(calculateAddress);
        //        console.log(deployAddress);
        require(calculateAddress == deployAddress, "address is not eq");
        TestContract tc = TestContract(deployAddress);
        require(tc.getFoo() == 1, "foo must eq");
    }

    //    function test_create2_destruct_creat2() public {
    //        bytes memory  codeBytes = factoryAssembly.getBytecode(msg.sender,1);
    //        address calculateAddress = factoryAssembly.getAddress(codeBytes,1);
    //        address deployAddress = factoryAssembly.deploy(codeBytes,1);
    //        require(calculateAddress == deployAddress,"address is not eq");
    //        TestContract tc = TestContract(deployAddress);
    //        tc.selfDestruct();
    //        console.log("111");
    //        deployAddress = factoryAssembly.deploy(codeBytes,1);
    //        console.log("222");
    //        require(calculateAddress == deployAddress,"address is not eq after selfDestruct");
    //    }

    function test_create2_deploy_2_same_contract() public {
        bytes memory codeBytes = factoryAssembly.getBytecode(msg.sender, 1);
        address addr = factoryAssembly.deploy(codeBytes, 12313123);
        emit DeployContract(1, addr);
        address addr2 = factoryAssembly.deploy(codeBytes, 12313123);
        emit DeployContract(2, addr2);
        require(addr2 == address(0), "add2 eq 0x0");
    }

    function getDeployAddress(uint256 idx) public view returns (address){
        bytes memory codeBytes = factoryAssembly.getBytecode(msg.sender, idx);
        address addr1 = factoryAssembly.getAddress(codeBytes, 12313123);
        return addr1;
    }

    function deployContract(uint256 idx) public {
        bytes memory codeBytes = factoryAssembly.getBytecode(msg.sender, idx);
        address addr = factoryAssembly.deploy(codeBytes, 12313123);
        emit DeployContract(1, addr);
    }


    function test_create2_destruct() public {
        bytes memory codeBytes = factoryAssembly.getBytecode(msg.sender, 1);
        address deployAddress = factoryAssembly.deploy(codeBytes, 1312312313131);
        TestContract tc = TestContract(deployAddress);
        tc.selfDestruct();
        emit DeployContract(3, deployAddress);
        require(address(tc) != address(0), "addr must not eq 0");
    }


    function test_create2_selfDestruct_create2() public {
        bytes memory codeBytes = factoryAssembly.getBytecode(msg.sender, 1);
        address deployAddress = factoryAssembly.deploy(codeBytes, 13123123131312);
        TestContract tc = TestContract(deployAddress);
        tc.selfDestruct();
        address next_deployAddress = factoryAssembly.deploy(codeBytes, 13123123131312);
        //        console.log(tc.getFoo());
        require(next_deployAddress == address(0), "self destruct deploy will be 0x0");
    }

}

contract Factory {
    // Returns the address of the newly deployed contract
    function deploy(
        address _owner,
        uint _foo,
        bytes32 _salt
    ) public payable returns (address) {
        // This syntax is a newer way to invoke create2 without assembly, you just need to pass salt
        // https://docs.soliditylang.org/en/latest/control-structures.html#salted-contract-creations-create2
        return address(new TestContract{salt : _salt}(_owner, _foo));
    }
}

// This is the older way of doing it using assembly
contract FactoryAssembly {
    event Deployed(address addr, uint salt);

    // 1. Get bytecode of contract to be deployed
    // NOTE: _owner and _foo are arguments of the TestContract's constructor
    function getBytecode(address _owner, uint _foo) public pure returns (bytes memory) {
        bytes memory bytecode = type(TestContract).creationCode;

        return abi.encodePacked(bytecode, abi.encode(_owner, _foo));
    }

    // 2. Compute the address of the contract to be deployed
    // NOTE: _salt is a random number used to create an address
    function getAddress(bytes memory bytecode, uint _salt)
    public
    view
    returns (address)
    {
        bytes32 hash = keccak256(
            abi.encodePacked(bytes1(0xff), address(this), _salt, keccak256(bytecode))
        );

        // NOTE: cast last 20 bytes of hash to address
        return address(uint160(uint(hash)));
    }

    // 3. Deploy the contract
    // NOTE:
    // Check the event log Deployed which contains the address of the deployed TestContract.
    // The address in the log should equal the address computed from above.
    function deploy(bytes memory bytecode, uint _salt) public payable returns (address){
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
            callvalue(), // wei sent with current call
            // Actual code starts after skipping the first 32 bytes
            add(bytecode, 0x20),
            mload(bytecode), // Load the size of code contained in the first 32 bytes
            _salt // Salt from function arguments
            )
        }
        //        console.log("deploy succ");
        //        console.log(addr);
        //        assembly{
        //            if iszero(extcodesize(addr)) {
        //                revert(0, 0)
        //            }
        //        }

        emit Deployed(addr, _salt);
        return addr;
    }
}

contract TestContract {
    address public owner;
    uint public foo = 3;

    event T(uint256 idx);
    constructor(address _owner, uint _foo) payable {
        owner = _owner;
        foo = _foo;
        emit  T(1);
    }

    function getFoo() public view returns (uint){
        return foo;
    }


    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function selfDestruct() public {
        selfdestruct(payable(msg.sender));
    }
}