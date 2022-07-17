pragma solidity ^0.7.3;
import "hardhat/console.sol";

contract typeU8{

    uint8 public u8;
    uint8[] public u8s;
    uint256 public u256;
    uint8[3] public uint8s3;
    event U8event(uint8, uint8[], uint8[3]);
    event U8eventIndex(uint8 indexed, uint8[] indexed, uint8[3] indexed);

    function typeUint8(uint8 p1, uint8[] memory p2, uint8[3] memory p3) public returns (uint8, uint8[] memory,  uint8[3] memory)
    {
        emit U8event(u8, u8s, uint8s3);
        emit U8eventIndex(u8, u8s, uint8s3);
        u8 = p1;
        u8s = p2;
        uint8s3 = p3;
        return getUint8WithEvent();
    }

    function getUint8WithEvent() public  returns (uint8, uint8[] memory,  uint8[3] memory)
    {
        emit U8event(u8, u8s, uint8s3);
        emit U8eventIndex(u8, u8s, uint8s3);
        return (u8, u8s, uint8s3);
    }

    function getUint8() public  view returns (uint8, uint8[] memory,  uint8[3] memory)
    {
        return (u8, u8s, uint8s3);
    }

    function setUint256(uint256 p) public
    {
        u256 = p;
    }

    function getUint256() public  view returns (uint256)
    {
        return u256;
    }

}

contract typeI8{

    int8 public i8;
    int8[] public i8s;
    int8[3] public i8s3;
    event Int8event(int8, int8[], int8[3]);
    event Int8eventIndex(int8 indexed, int8[] indexed, int8[3] indexed);

    function typeInt8(int8 p1, int8[] memory p2, int8[3] memory p3) public returns (int8, int8[] memory, int8[3] memory)
    {
        emit Int8event(i8, i8s, i8s3);
        emit Int8eventIndex(i8, i8s, i8s3);
        i8 = p1;
        i8s = p2;
        i8s3 = p3;
        return getInt8WithEvent();
    }

    function getInt8WithEvent() public  returns (int8, int8[] memory, int8[3] memory)
    {
        emit Int8event(i8, i8s, i8s3);
        emit Int8eventIndex(i8, i8s, i8s3);
        return (i8, i8s, i8s3);
    }

    function getInt8() public  view returns (int8, int8[] memory, int8[3] memory)
    {
        return (i8, i8s, i8s3);
    }

}

contract typeBool{

    bool public a = true;
    bool public b = false;
    bool public c = !a;
    bool public d = !b;

    function getBoolA() public  view  returns (bool )
    {
        return a;
    }

    function getBoolB() public  view  returns (bool)
    {
        return a;
    }

    function getBoolC() public  view  returns (bool)
    {
        return c;
    }

    function getOrBool() public view  returns(bool)
    {
      return  a || b;
    }

    function getAndBool() public view  returns(bool)
    {
        return  a  && b;
    }

}

contract typeAddress{

   address public address1 = 0x2710D026F5e3d115A8bfD1e705E4BF8D96750242;

   function getBalanceBb() public view returns (uint256)
    {
        console.log(address1.balance);
        return address1.balance;
    }

    function getContractBalance() public view returns(uint256)
    {
        return address(this).balance;
    }

}

contract  typeBytes{

    bytes1 bt1 = "a";
    bytes32 bt2 = "cccccccccccccccccccccccccccccccc";
    bytes  unFixedBytes = new bytes(2);

    function getbBytes() public view returns(bytes1){
        return bt1;
    }

    function getbBytes1Length() public view returns(uint){
        return bt1.length;
    }

    function getbBytes2Length() public view returns(uint){
        return bt2.length;
    }

    function testBytesMaxLength(string memory f) public pure returns(uint8){

        bytes32 result;
        assembly{
            result := mload(add(f,32))
        }
        return result.length;

    }

    // 设置字节数组的长度
//    function setUnFixedBytesLength(uint len) public view  {
//        unFixedBytes.length = len;
//    }

    function unFixedBytesLength() public view returns (uint) {

        return unFixedBytes.length;

    }

    function pushUnFixedAByte(byte b)  public  {
        for(int i = 0 ;i<=17953; i++)
        {
            unFixedBytes.push(b);
        }
    }

}

contract typeString{

    string  public name= "crptotest";

    function getName() view public returns( string memory){
        return name;
    }

    function setName(string memory _name ) public {
        name=_name;
    }

    function getLength() public view returns(uint){
        return bytes(name).length;
    }

    function changName() public {
        bytes(name)[0]='Z';
    }

    function getBytes() public view returns(bytes memory){
        return bytes(name);
    }
}

contract typeEmum{

    enum ActionChoices { GoLeft, GoRight, GoStraight, SitStill }

    ActionChoices choice;
    ActionChoices public  defaultChoice = ActionChoices.GoStraight;

    function setGoStraight() public {
        choice = ActionChoices.GoStraight;
    }

    function getChoice() public  returns (ActionChoices) {
        return choice;
    }

    function getDefaultChoice() public returns (ActionChoices) {
        return defaultChoice;
    }

}

contract typeFixedArray{

    uint[5] fixedArr = [1,2,3,4,5];
    uint[] unfixedArr = [1,2,3,4,5];

    function sum() public view returns (uint) {

        uint total = 0;
        for(uint i = 0; i < fixedArr.length; i++) {
            total += fixedArr[i];
        }
        return total;

    }

    function unsum() public view returns (uint) {
        uint total = 0;
        for(uint i = 0; i < unfixedArr.length; i++) {
            total += unfixedArr[i];
        }
        return total;
    }

    function unFixedArrPush()  public  returns(uint[] memory)
    {
        for(int i =1; i<=20; i++)
        {
            unfixedArr.push(1);

        }
        return unfixedArr;
    }
}
