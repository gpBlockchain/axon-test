pragma solidity ^0.6.10;


contract CrossCallTest {

    CrossCall cc;
    CrossCall cc1;

    constructor () public {
        cc = new CrossCall();
        cc1 = new CrossCall();
        cc.setOtherAddress(address(cc1));
        cc1.setOtherAddress(address(cc));
    }
    event throwTestResult(uint256 idx, bool result, bytes bts);

    function call_throwTest_1() public {
        cc.modType(1);
        bytes memory bb;
        try cc.throwTest() returns (bool result){
            // emit throwTestResult(0,true,bb);
            require(false, "cc.throwTest() returns(bool result)");
        } catch Error(string memory bt1){
            // emit throwTestResult(1,true,bytes(bt1));
            require(false, "cc.throwTest() returns(bool result)");
        }catch(bytes memory bt2){
            emit throwTestResult(2, false, bt2);
        }
    }

    function call_throwTest_2() public {
        cc.modType(2);
        bytes memory bb;
        try cc.throwTest() returns (bool result){
            // emit throwTestResult(0,true,bb);
            require(false, "cc.throwTest() returns(bool result)");
        } catch Error(string memory bt1){
            // emit throwTestResult(1,true,bytes(bt1));
            require(keccak256(bytes(bt1)) == keccak256("require throw test"), "require throw test");
        }catch(bytes memory bt2){
            require(false, "cc.throwTest(2) returns(bool result)");
        }
    }

    function call_throwTest_3() public {
        cc.modType(3);
        bytes memory bb;
        try cc.throwTest() returns (bool result){
            // emit throwTestResult(0,true,bb);
            require(result == true, "cc.throwTest(3) returns(bool result)");
        } catch Error(string memory bt1){
            // emit throwTestResult(1,true,bytes(bt1));
            require(keccak256(bytes(bt1)) == keccak256("require throw test"), "require throw test");

        }catch(bytes memory bt2){
            require(false, "cc.throwTest(2) returns(bool result)");
        }
    }

    function call_throwTest_4() public {
        cc.modType(4);
        bytes memory bb;
        try cc.throwTest() returns (bool result){
            // emit throwTestResult(0,true,bb);
            require(false, "exec failed");
        } catch Error(string memory bt1){
            // emit throwTestResult(1,true,bytes(bt1));
            require(keccak256(bytes(bt1)) == keccak256("require throw test"), "chatch 1");

        }catch(bytes memory bt2){
            // require(false,"cc.throwTest(4) catch 2");
        }
    }

    function call_throwTest_5() public {
        cc.modType(5);
        bytes memory bb;
        try cc.throwTest() returns (bool result){
            // emit throwTestResult(0,true,bb);
            require(true, "exec failed");
        } catch Error(string memory bt1){
            // emit throwTestResult(1,true,bytes(bt1));
            require(keccak256(bytes(bt1)) == keccak256("require throw test"), "chatch 1");

        }catch(bytes memory bt2){
            require(false, "cc.throwTest(5) catch 2");
        }
    }

    function call_1() public returns (bool){
        uint256 beginSize = cc1.getType1();
        cc.callTestFunc(address(cc1), 500000000, 0, "addModType()");
        require(cc1.getType1() == beginSize + 1, "addModType failed");
        return true;
    }

    function call_stack(uint stackSize) public returns (uint256){
        return cc.call_stack(stackSize - 1) + stackSize;
    }


    function call_out_of_gas() public returns (bool){
        uint256 beginSize = cc1.getType1();
        try cc.callTestFunc(address(cc1), 5, 0, "addModType()") returns (bool result, bytes memory bts){
            require(!result, "can't do this");
        }catch{}
        require(cc1.getType1() == beginSize, "addModType failed");
        return true;
    }


    function call_delegatecallFunc() public returns (bool){
        uint256 beginSize = cc.getType1();
        cc.delegatecallFunc(address(cc1), 500000000, "addModType()");
        require(cc.getType1() == beginSize + 1, "addModType failed");
        return true;
    }


    function call_staticcallFunc() public returns (bool){
        uint256 beginSize = cc.getType1();
        uint256 cc1BeginSize = cc1.getType1();
        try cc.staticcallFunc(address(cc1), 500000000, "addModType()") returns (bool result){
            require(!result, "exec must failed");

        }catch {

        }
        require(cc1.getType1() == beginSize, "type must not mod ");
        require(cc.getType1() == beginSize, "type must not mod ");
        return true;
    }


    function call_throwTest(uint idx) public {
        cc.modType(idx);
        bytes memory bb;
        try cc.throwTest() returns (bool result){

            emit throwTestResult(0, true, bb);

        }catch Error(string memory bt1) {
            // This is executed in case
            // revert was called inside getData
            // and a reason string was provided.
            require(keccak256(bytes(bt1)) == keccak256("require throw test"), "require throw test");
            emit throwTestResult(1, true, bytes(bt1));

        }  catch (bytes memory bt2) {
            // This is executed in case revert() was used.
            emit throwTestResult(2, false, bt2);
        }

    }


}

contract CrossCall {

    address payable otherAddress;

    function setOtherAddress(address payable addr) public {
        otherAddress = addr;
    }

    event typeModMsg(uint256);

    uint256 public  type1;

    function getType1() public returns (uint256){
        return type1;
    }

    function callTestFunc(address addr, uint256 useGas, uint valuedata, string memory func) public payable returns (bool, bytes memory){
        return addr.call{value : valuedata, gas : useGas}(abi.encodeWithSignature(func));
    }


    function call_stack(uint stackSize) public returns (uint256){
        CrossCall cc = CrossCall(otherAddress);
        if (stackSize <= 0) {
            return 1;
        }
        try cc.call_stack(stackSize - 1) returns (uint256 num){
            return num + stackSize;
        }catch {
            return cc.call_stack{gas : 100000}(stackSize - 1);
        }
    }

    //todo add callcode
    // function callcodeFunc(address addr,uint256 useGas,uint valuedata,string memory func) public payable returns (bool,bytes memory){
    // return addr.callcode.value(valuedata).gas(useGas)(bytes4(keccak256(func)));
    // return  addr.callcode{value:valuedata,gas:useGas}(abi.encodeWithSignature(func));
    // }

    function delegatecallFunc(address addr, uint256 useGas, string memory func) public payable returns (bool, bytes memory){
        // return addr.delegatecall.gas(useGas)(bytes4(keccak256(func)));
        return addr.delegatecall{gas : useGas}(abi.encodeWithSignature(func));

    }

    function staticcallFunc(address addr, uint256 useGas, string memory func) public payable returns (bool){
        bool success;
        bytes4 sig = bytes4(keccak256(bytes(func)));

        assembly{
            let x := mload(0x40)   //Find empty storage location using "free memory pointer"
            mstore(x, sig) //Place signature at begining of empty storage

            success := staticcall(
            useGas, //5k gas
            addr, //To addr
            x, // Inputs are at location x
            0x40, //Inputs size two padded, so 68 bytes
            x, //Store output over input
            0x00) //Output is 32 bytes long        }

        }
        return success;
    }

    uint public test_count = 1;

    function callTest(address addr, uint256 useGas, uint valuedata) public payable returns (bool){
        // return addr.call.value(valuedata).gas(useGas)(bytes4(keccak256("test()")));
        (bool successed,) = addr.call{value : valuedata, gas : useGas}(abi.encodeWithSignature("test()"));
        return successed;
    }

    function newTest(bool isThrow) public returns (bool){
        A a = new A(isThrow);
        return true;
    }


    receive() external payable {

    }

    // function() payable{}

    function getType() public view returns (uint256) {
        return type1;
    }

    function addModType() public returns (bool){
        type1 += 1;
        emit typeModMsg(type1);
    }

    function modType(uint256 intdata) public returns (uint256){
        type1 = intdata;
        emit typeModMsg(type1);

        return type1;
    }

    function throwTest() public payable returns (bool){
        RollBackContract contract1 = new RollBackContract();
        if (type1 == 1) {
            contract1.assertThrow();
        }
        if (type1 == 2) {
            contract1.requiteThrow();
        }
        if (type1 == 3) {
            contract1.blanceNotEnough();
        }
        if (type1 == 4) {
            contract1.invalOpCode();
        }
        if (type1 == 5) {
            contract1.stop();
        }
        return true;
    }

}


contract RollBackContract {
    event time(uint256);

    constructor() public payable {
        A a = new A(true);
    }
    function new_throw(uint256 idx) public payable {

        A a = new A(false);
        a.test(msg.sender, address(this));

        check_throw(idx);
    }

    function suicide_throw(uint256 idx) public returns (bool){
        A a = new A(true);
        a.test1(msg.sender);
        check_throw(idx);
        return true;
    }

    function check_throw(uint256 idx) internal {
        // time(now);
        if (idx % 10 > 7) {
            assert(false);
        }
        if (idx % 10 < 2) {
            require(false, "time is too smill");
        }
    }

    function assertThrow() public payable {
        emit time(100);
        assert(false);
    }

    function requiteThrow() public payable {
        emit time(100);
        require(false, "require throw test");

    }

    function blanceNotEnough() public payable returns (bool){
        return msg.sender.send(10);
    }

    function invalOpCode() public payable {

        assembly{invalid()}

    }

    function stop() public payable {
        assembly{stop()}
    }


}

contract A {
    event logKV(address key, address value);

    mapping(address => address) hashMap;
    bool isThrow;
    constructor(bool isThrow) public payable{
        logKV(msg.sender, msg.sender);
        isThrow = isThrow;
        require(isThrow, "time is too smill");

    }

    function test(address key, address value) public returns (address){
        hashMap[key] = value;
        logKV(key, value);
        return value;
    }

    function test1(address addr) public {
        selfdestruct(payable(addr));
    }


}