pragma solidity =0.8.6;


interface EIP20Interface {

    function totalSupply() external view returns (uint256);

    function balanceOf(address _owner) external view returns (uint256 balance);


    function transfer(address _to, uint256 _value) external returns (bool success);

    function transferFrom(address _from, address _to, uint256 _value) external returns (bool success);


    function approve(address _spender, uint256 _value) external returns (bool success);


    function allowance(address _owner, address _spender) external view returns (uint256 remaining);

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
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

contract Temp {
    uint256 data1;

    function modData1(uint256 data) public {
        data1 = data;
    }
}

contract FailedTxContract {
    bytes public  tempData;
    uint256[] public normalUint256Array;
    uint256 public normalDataLatestUpdateTime;
    uint256  public normalIdx;
    string public normalData;
    mapping(uint256 => string) normalStrMap;

    uint256[] popErrorArray;

    uint256 public BridgeTransferLatestUpdateTime;

    uint256 public Create2LatestUpdateTime;

    error error1();

    // FailedTxContract
    enum ModDataStyle{
        NORMAL, //0: mod int int[] string map  data
        CROSS_NORMAL, //1: mod cross contract's int int[] string map data
        BRIDGE_TRANSFER, //2: mod proxy ckb token data
        SELF_DESTRUCT, //3: self destruct
        CREATE2, //4: deploy new contract use create2
        DELEGATE_CALL, //5: delegate call mod self int int[] string map data
        CLS_DESTRUCT     //6: mod other contract data use cross call
    }
    //     https://blog.soliditylang.org/2020/12/16/solidity-v0.8.0-release-announcement/
    //     notice : only support > 0.8.0
    enum FailedStyle{
        NO, // 0: normal tx
        REQUIRE_1, // 1: failed for require(false)
        ASSERT01, // 2: 0x01: assert false
        ASSERT11, // 3: 0x11: If an arithmetic operation results in underflow or overflow
        ASSERT12, // 4: 0x12: divide or divide modulo by zero
        ASSERT21, // 5: 0x21: If you convert a value that is too big or negative into an enum type.
        ASSERT22, // 6: 0x22: If you access a storage byte array that is incorrectly encoded.
        ASSERT31, // 7: 0x31: If you call .pop() on an empty array.
        ASSERT32, // 8: 0x32: If you access an array, bytesN or an array slice at an out-of-bounds or negative index (i.e. x[i] where i >= x.length or i < 0).
        ASSERT41, // 9: 0x41: If you allocate too much memory or create an array that is too large.
        ASSERT51, // 10: todo:0x51: If you call a zero-initialized variable of internal function type.
        Error1     // 11: error
    }

    FailedTxContract public failedTxContract;
    FailedTxContract public destructFailedTxContract;

    EIP20Interface public erc20Token;
    FactoryAssembly public factoryAssemblyContract;
    constructor() public {
        factoryAssemblyContract = new FactoryAssembly();
    }

    function prepare(address failedTxContractAddress, address destructContractAddress, address erc20Address) public payable {
        failedTxContract = FailedTxContract(failedTxContractAddress);
        erc20Token = EIP20Interface(erc20Address);
        destructFailedTxContract = FailedTxContract(destructContractAddress);
        erc20Token.transfer(destructContractAddress, address(this).balance / 2);
    }


    function test(ModDataStyle[] memory modDataStyles, FailedStyle failedStyle) public {
        for (uint256 i = 0; i < modDataStyles.length; i++) {
            modData(modDataStyles[i]);
        }
        FailedTx(failedStyle);
    }

    function getModHash(ModDataStyle modDataStyle) public view returns (bytes32 sha3Hash){
        if (modDataStyle == ModDataStyle.NORMAL) {
            (sha3Hash,,,,,,) = getNormalData();
            return sha3Hash;
        }
        if (modDataStyle == ModDataStyle.CROSS_NORMAL) {
            (sha3Hash,,,,,,) = getCrossNormalData();
            return sha3Hash;
        }
        if (modDataStyle == ModDataStyle.BRIDGE_TRANSFER) {
            (sha3Hash,,) = getBridgeData();
        }
        if (modDataStyle == ModDataStyle.SELF_DESTRUCT) {
            sha3Hash = getModSelfDestruct();
        }
        if (modDataStyle == ModDataStyle.CLS_DESTRUCT) {
            sha3Hash = getModCrossSelfDestruct();
        }
        if (modDataStyle == ModDataStyle.CREATE2) {
            (sha3Hash,) = getModCreate2Data();
        }
        if (modDataStyle == ModDataStyle.DELEGATE_CALL) {
            (sha3Hash,,,,,,) = getCrossNormalData();
        }

    }

    function modData(ModDataStyle modDataStyle) public {
        if (modDataStyle == ModDataStyle.NORMAL) {
            modNormalData();
            return;
        }
        if (modDataStyle == ModDataStyle.CROSS_NORMAL) {
            modCrossNormalData();
            return;

        }
        if (modDataStyle == ModDataStyle.BRIDGE_TRANSFER) {
            modBridgeTransferData();
            return;

        }
        if (modDataStyle == ModDataStyle.SELF_DESTRUCT) {
            modSelfDestruct();
            return;
        }
        if (modDataStyle == ModDataStyle.CLS_DESTRUCT) {
            modCrossSelfDestruct();
            return;
        }
        if (modDataStyle == ModDataStyle.CREATE2) {
            modCreate2();
            return;

        }
        if (modDataStyle == ModDataStyle.DELEGATE_CALL) {
            modDeletegateData();
            return;

        }
        require(false, "not fould ModDataStyle");
    }

    function FailedTx(FailedStyle failedStyle) public {
        if (failedStyle == FailedStyle.NO) {
            return;
        }
        if (failedStyle == FailedStyle.REQUIRE_1) {
            FailedTx_require1();
            return;

        }
        if (failedStyle == FailedStyle.ASSERT01) {
            FailedTx_assert();
            return;

        }
        if (failedStyle == FailedStyle.ASSERT11) {
            FailedTx_assert11();
            return;

        }
        if (failedStyle == FailedStyle.ASSERT12) {
            FailedTx_assert12();
            return;

        }
        if (failedStyle == FailedStyle.ASSERT21) {
            FailedTx_assert21();
            return;

        }
        if (failedStyle == FailedStyle.ASSERT22) {
            FailedTx_assert22();
            return;

        }
        if (failedStyle == FailedStyle.ASSERT31) {
            FailedTx_assert31();
            return;

        }
        if (failedStyle == FailedStyle.ASSERT32) {
            FailedTx_assert32();
            return;

        }

        if (failedStyle == FailedStyle.ASSERT41) {
            FailedTx_assert41();
            return;

        }

        if (failedStyle == FailedStyle.ASSERT51) {
            FailedTx_assert51();
            return;

        }
        if (failedStyle == FailedStyle.Error1) {
            FailedTx_Error1();
            return;
        }

        require(false, "not found style");
    }

    function FailedTx_require1() public {
        require(false, "FailedStyle.REQUIRE_1");
    }

    function FailedTx_assert() public {
        assert(false);
    }

    function FailedTx_assert11() public {
        uint256 data = type(uint256).max + 100;
    }

    function FailedTx_assert12() public {
        uint256 data1 = 0;
        uint256 data = 23 / data1;
    }

    function FailedTx_assert21() public {
        uint256 data = type(uint256).max;
        getModHash(ModDataStyle(data));
    }

    event eventTest(bytes bt);

    function FailedTx_assert22() public {
        //de
        Temp t1 = new Temp();
        address(t1).delegatecall(abi.encodeWithSignature("modData1(uint256)", 1));
        emit eventTest(tempData);
    }

    function FailedTx_assert31() public {
        for (uint256 i = 0; i < 100; i++) {
            popErrorArray.pop();

        }
    }

    function FailedTx_assert32() public {
        uint256 temp1 = popErrorArray[100];
    }

    function FailedTx_assert41() public {
        uint256[] memory temp = new uint256[](type(uint256).max);
    }

    function FailedTx_assert51() public {
        //todo support
        // ASSERT51    // 调用内部函数类型的初始化为0的变量
        assert(false);
    }

    function FailedTx_Error1() public {
        revert error1();

    }



    // mod function
    //
    // 普通调用 修改map,字符串，uint
    event modNormalDataEvent(uint256 modTime, uint256 modIdx, string modData);

    function modNormalData() public {
        normalDataLatestUpdateTime = block.timestamp;
        normalIdx++;
        normalUint256Array.push(block.timestamp);
        normalData = string(abi.encodePacked(normalData, "1"));
        normalStrMap[normalIdx] = normalData;
        emit modNormalDataEvent(normalDataLatestUpdateTime, normalIdx, normalData);
    }

    function getNormalData() public view returns (bytes32 dataHash, uint256, uint256, string memory idxMapData, string memory nextMapData, uint256[] memory, string memory){
        uint256 nextIdx = normalIdx + 1;
        bytes32 normalHash = keccak256(abi.encodePacked
            (
                normalDataLatestUpdateTime,
                normalIdx,
                normalStrMap[normalIdx],
                normalStrMap[nextIdx],
                normalUint256Array,
                normalData
            )
        );
        return (normalHash, normalDataLatestUpdateTime, normalIdx, normalStrMap[normalIdx], normalStrMap[nextIdx], normalUint256Array, normalData);
    }

    event modBridgeTransferDataEvent(uint256 modTime, uint256 sudtId, uint256 modBalance);

    function modBridgeTransferData() public {
        erc20Token.transfer(address(failedTxContract), 1);
        BridgeTransferLatestUpdateTime = block.timestamp;
        emit modBridgeTransferDataEvent(BridgeTransferLatestUpdateTime, 0, erc20Token.balanceOf(address(failedTxContract)));
    }

    function getBridgeData() public view returns (bytes32, uint256, uint256){
        bytes32 bridgeTransferHash = keccak256(abi.encodePacked
            (
                BridgeTransferLatestUpdateTime,
                erc20Token.balanceOf(address(this)),
                erc20Token.balanceOf(address(failedTxContract))
            )
        );
        return (bridgeTransferHash, erc20Token.balanceOf(address(this)), erc20Token.balanceOf(address(failedTxContract)));
    }


    // 通过普通跨合约调用修改
    event modCrossNormalDataEvent(uint256 modTime, uint256 modIdx, string modData);

    function modCrossNormalData() public {
        failedTxContract.modNormalData();
        emit modCrossNormalDataEvent(failedTxContract.normalDataLatestUpdateTime(), failedTxContract.normalIdx(), failedTxContract.normalData());

    }

    function getCrossNormalData() public view returns (bytes32 dataHash, uint256, uint256, string memory idxMapData, string memory nextMapData, uint256[] memory, string memory){
        return failedTxContract.getNormalData();
    }


    // 通过委托调用修改账本数据
    event modDeleCrossDataEvent(uint256 modTime, uint256 modIdx, string modData);

    function modDeletegateData() public {
        address(failedTxContract).delegatecall(abi.encodeWithSignature("modCrossNormalData()"));
        emit modDeleCrossDataEvent(normalDataLatestUpdateTime, normalIdx, normalData);
    }

    function getDeletegateData() public view returns (bytes32 dataHash, uint256, uint256, string memory idxMapData, string memory nextMapData, uint256[] memory, string memory){
        return getNormalData();
    }

    // 自毁合约
    event modSelfDestructEvent(uint256 modTime, address contractAddress);
    event beforeModSelfDestructEvent(uint256 modTime, address contractAddress);

    function modSelfDestruct() public {
        emit beforeModSelfDestructEvent(block.timestamp, address(this));
        selfdestruct(payable(msg.sender));
        emit modSelfDestructEvent(block.timestamp, address(this));
    }

    function getModSelfDestruct() public view returns (bytes32){
        bytes32 modSelfDestructHash = keccak256(abi.encodePacked
            (
                address(this).balance
            )
        );
        return (modSelfDestructHash);
    }

    event modCrossSelfDestructEvent(uint256 modTime, address contractAddress);
    // cls 自毁
    function modCrossSelfDestruct() public {
        uint256 blanceOfdestruct = (address(destructFailedTxContract).balance);
        uint256 balanceOfThisAddress = address(this).balance;
        destructFailedTxContract.modSelfDestruct();
        emit modCrossSelfDestructEvent(block.timestamp, address(this));
        uint256 afterSelfDestructBalance = address(this).balance;
        require(afterSelfDestructBalance == balanceOfThisAddress + blanceOfdestruct, "blance pro");
    }

    function getModCrossSelfDestruct() public view returns (bytes32){
        return destructFailedTxContract.getModSelfDestruct();
    }

    // 创建新合约
    event modCreate2Event(uint256 modTime, address createAddress);

    function modCreate2() public {

        bytes memory codeBytes = factoryAssemblyContract.getBytecode(msg.sender, Create2LatestUpdateTime);
        address addr = factoryAssemblyContract.deploy(codeBytes, Create2LatestUpdateTime);
        emit modCreate2Event(Create2LatestUpdateTime, addr);
        Create2LatestUpdateTime = block.timestamp;
    }

    function getModCreate2Data() public view returns (bytes32, address){
        bytes memory codeBytes = factoryAssemblyContract.getBytecode(msg.sender, Create2LatestUpdateTime);

        address create2_address = factoryAssemblyContract.getAddress(codeBytes, Create2LatestUpdateTime);
        bytes32 create2Hash = keccak256(abi.encodePacked
            (
                create2_address
            )
        );
        return (create2Hash, create2_address);
    }

}