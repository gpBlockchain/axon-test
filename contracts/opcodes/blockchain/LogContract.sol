pragma solidity ^0.8.4;

contract LogContract {
    // log0
    event LogMessage(uint256);
    constructor() public payable{
        emit LogMessage(1);
    }

    receive() external payable {
    }

    fallback() external {
    }

    event log0Uint8(uint8);
    event log0int8(int8);

    event log0Uint16(uint16);
    event log0int16(int16);

    event log0Uint24(uint24);
    event log0int24(int24);

    event log0Uint32(uint32);
    event log0int32(int32);

    event log0Uint40(uint40);
    event log0int40(int40);

    event log0Uint48(uint48);
    event log0int48(int48);

    event log0Uint56(uint56);
    event log0int56(int56);

    event log0Uint64(uint64);
    event log0int64(int64);

    event log0Uint72(uint72);
    event log0int72(int72);

    event log0Uint80(uint80);
    event log0int80(int80);

    event log0Uint88(uint88);
    event log0int88(int88);

    event log0Uint96(uint96);
    event log0int96(int96);

    event log0Uint104(uint104);
    event log0int104(int104);

    event log0Uint112(uint112);
    event log0int112(int112);

    event log0Uint120(uint120);
    event log0int120(int120);

    event log0Uint128(uint128);
    event log0int128(int128);

    event log0Uint136(uint136);
    event log0int136(int136);

    event log0Uint144(uint144);
    event log0int144(int144);

    event log0Uint152(uint152);
    event log0int152(int152);

    event log0Uint160(uint160);
    event log0int160(int160);

    event log0Uint168(uint168);
    event log0int168(int168);

    event log0Uint176(uint176);
    event log0int176(int176);

    event log0Uint184(uint184);
    event log0int184(int184);

    event log0Uint192(uint192);
    event log0int192(int192);

    event log0Uint200(uint200);
    event log0int200(int200);

    event log0Uint208(uint208);
    event log0int208(int208);

    event log0Uint216(uint216);
    event log0int216(int216);

    event log0Uint224(uint224);
    event log0int224(int224);

    event log0Uint232(uint232);
    event log0int232(int232);

    event log0Uint240(uint240);
    event log0int240(int240);

    event log0Uint248(uint248);
    event log0int248(int248);

    event log0Uint256(uint256);
    event log0int256(int256);

    // log1
    // log2
    //log3
    //log4


    event log0Byte1(bytes1);
    event log0Byte2(bytes2);
    event log0Byte3(bytes3);
    event log0Byte4(bytes4);
    event log0Byte5(bytes5);
    event log0Byte6(bytes6);
    event log0Byte7(bytes7);
    event log0Byte8(bytes8);
    event log0Byte9(bytes9);
    event log0Byte10(bytes10);
    event log0Byte11(bytes11);
    event log0Byte12(bytes12);
    event log0Byte13(bytes13);
    event log0Byte14(bytes14);
    event log0Byte15(bytes15);
    event log0Byte16(bytes16);
    event log0Byte17(bytes17);
    event log0Byte18(bytes18);
    event log0Byte19(bytes19);
    event log0Byte20(bytes20);
    event log0Byte21(bytes21);
    event log0Byte22(bytes22);
    event log0Byte23(bytes23);
    event log0Byte24(bytes24);
    event log0Byte25(bytes25);
    event log0Byte26(bytes26);
    event log0Byte27(bytes27);
    event log0Byte28(bytes28);
    event log0Byte29(bytes29);
    event log0Byte30(bytes30);
    event log0Byte31(bytes31);
    event log0Byte32(bytes32);
    event log0Bytes(bytes);

    // bytes4(keccak256(bytes('approve(address,uint256)')));

    function log0Byte(string memory data) public {
        emit log0Byte1(bytes1(bytes(data)));
        emit log0Byte2(bytes2(bytes(data)));
        emit log0Byte3(bytes3(bytes(data)));
        emit log0Byte4(bytes4(bytes(data)));
        emit log0Byte5(bytes5(bytes(data)));
        emit log0Byte6(bytes6(bytes(data)));
        emit log0Byte7(bytes7(bytes(data)));
        emit log0Byte8(bytes8(bytes(data)));
        emit log0Byte9(bytes9(bytes(data)));
        emit log0Byte10(bytes10(bytes(data)));
        emit log0Byte11(bytes11(bytes(data)));
        emit log0Byte12(bytes12(bytes(data)));
        emit log0Byte13(bytes13(bytes(data)));
        emit log0Byte14(bytes14(bytes(data)));
        emit log0Byte15(bytes15(bytes(data)));
        emit log0Byte16(bytes16(bytes(data)));
        emit log0Byte17(bytes17(bytes(data)));
        emit log0Byte18(bytes18(bytes(data)));
        emit log0Byte19(bytes19(bytes(data)));
        emit log0Byte20(bytes20(bytes(data)));
        emit log0Byte21(bytes21(bytes(data)));
        emit log0Byte22(bytes22(bytes(data)));
        emit log0Byte23(bytes23(bytes(data)));
        emit log0Byte24(bytes24(bytes(data)));
        emit log0Byte25(bytes25(bytes(data)));
        emit log0Byte26(bytes26(bytes(data)));
        emit log0Byte27(bytes27(bytes(data)));
        emit log0Byte28(bytes28(bytes(data)));
        emit log0Byte29(bytes29(bytes(data)));
        emit log0Byte30(bytes30(bytes(data)));
        emit log0Byte31(bytes31(bytes(data)));
        emit log0Byte32(bytes32(bytes(data)));
        emit log0Bytes(bytes(data));
    }


    function log0Int() public {
        emit log0int8(type(int8).min);
        emit log0int8(type(int8).max);
        emit log0Uint8(type(uint8).min);
        emit log0Uint8(type(uint8).max);

        emit log0int8(type(int8).min);
        emit log0int8(type(int8).max);
        emit log0Uint8(type(uint8).min);
        emit log0Uint8(type(uint8).max);


        emit log0int16(type(int16).min);
        emit log0int16(type(int16).max);
        emit log0Uint16(type(uint16).min);
        emit log0Uint16(type(uint16).max);


        emit log0int24(type(int24).min);
        emit log0int24(type(int24).max);
        emit log0Uint24(type(uint24).min);
        emit log0Uint24(type(uint24).max);


        emit log0int32(type(int32).min);
        emit log0int32(type(int32).max);
        emit log0Uint32(type(uint32).min);
        emit log0Uint32(type(uint32).max);


        emit log0int40(type(int40).min);
        emit log0int40(type(int40).max);
        emit log0Uint40(type(uint40).min);
        emit log0Uint40(type(uint40).max);


        emit log0int48(type(int48).min);
        emit log0int48(type(int48).max);
        emit log0Uint48(type(uint48).min);
        emit log0Uint48(type(uint48).max);


        emit log0int56(type(int56).min);
        emit log0int56(type(int56).max);
        emit log0Uint56(type(uint56).min);
        emit log0Uint56(type(uint56).max);


        emit log0int64(type(int64).min);
        emit log0int64(type(int64).max);
        emit log0Uint64(type(uint64).min);
        emit log0Uint64(type(uint64).max);


        emit log0int72(type(int72).min);
        emit log0int72(type(int72).max);
        emit log0Uint72(type(uint72).min);
        emit log0Uint72(type(uint72).max);


        emit log0int80(type(int80).min);
        emit log0int80(type(int80).max);
        emit log0Uint80(type(uint80).min);
        emit log0Uint80(type(uint80).max);


        emit log0int88(type(int88).min);
        emit log0int88(type(int88).max);
        emit log0Uint88(type(uint88).min);
        emit log0Uint88(type(uint88).max);


        emit log0int96(type(int96).min);
        emit log0int96(type(int96).max);
        emit log0Uint96(type(uint96).min);
        emit log0Uint96(type(uint96).max);


        emit log0int104(type(int104).min);
        emit log0int104(type(int104).max);
        emit log0Uint104(type(uint104).min);
        emit log0Uint104(type(uint104).max);


        emit log0int112(type(int112).min);
        emit log0int112(type(int112).max);
        emit log0Uint112(type(uint112).min);
        emit log0Uint112(type(uint112).max);


        emit log0int120(type(int120).min);
        emit log0int120(type(int120).max);
        emit log0Uint120(type(uint120).min);
        emit log0Uint120(type(uint120).max);


        emit log0int128(type(int128).min);
        emit log0int128(type(int128).max);
        emit log0Uint128(type(uint128).min);
        emit log0Uint128(type(uint128).max);


        emit log0int136(type(int136).min);
        emit log0int136(type(int136).max);
        emit log0Uint136(type(uint136).min);
        emit log0Uint136(type(uint136).max);


        emit log0int144(type(int144).min);
        emit log0int144(type(int144).max);
        emit log0Uint144(type(uint144).min);
        emit log0Uint144(type(uint144).max);


        emit log0int152(type(int152).min);
        emit log0int152(type(int152).max);
        emit log0Uint152(type(uint152).min);
        emit log0Uint152(type(uint152).max);


        emit log0int160(type(int160).min);
        emit log0int160(type(int160).max);
        emit log0Uint160(type(uint160).min);
        emit log0Uint160(type(uint160).max);


        emit log0int168(type(int168).min);
        emit log0int168(type(int168).max);
        emit log0Uint168(type(uint168).min);
        emit log0Uint168(type(uint168).max);


        emit log0int176(type(int176).min);
        emit log0int176(type(int176).max);
        emit log0Uint176(type(uint176).min);
        emit log0Uint176(type(uint176).max);


        emit log0int184(type(int184).min);
        emit log0int184(type(int184).max);
        emit log0Uint184(type(uint184).min);
        emit log0Uint184(type(uint184).max);


        emit log0int192(type(int192).min);
        emit log0int192(type(int192).max);
        emit log0Uint192(type(uint192).min);
        emit log0Uint192(type(uint192).max);


        emit log0int200(type(int200).min);
        emit log0int200(type(int200).max);
        emit log0Uint200(type(uint200).min);
        emit log0Uint200(type(uint200).max);


        emit log0int208(type(int208).min);
        emit log0int208(type(int208).max);
        emit log0Uint208(type(uint208).min);
        emit log0Uint208(type(uint208).max);


        emit log0int216(type(int216).min);
        emit log0int216(type(int216).max);
        emit log0Uint216(type(uint216).min);
        emit log0Uint216(type(uint216).max);


        emit log0int224(type(int224).min);
        emit log0int224(type(int224).max);
        emit log0Uint224(type(uint224).min);
        emit log0Uint224(type(uint224).max);


        emit log0int232(type(int232).min);
        emit log0int232(type(int232).max);
        emit log0Uint232(type(uint232).min);
        emit log0Uint232(type(uint232).max);


        emit log0int240(type(int240).min);
        emit log0int240(type(int240).max);
        emit log0Uint240(type(uint240).min);
        emit log0Uint240(type(uint240).max);


        emit log0int248(type(int248).min);
        emit log0int248(type(int248).max);
        emit log0Uint248(type(uint248).min);
        emit log0Uint248(type(uint248).max);

        emit log0int256(type(int256).min);
        emit log0int256(type(int256).max);
        emit log0Uint256(type(uint256).min);
        emit log0Uint256(type(uint256).max);
    }
}