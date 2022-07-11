pragma solidity ^0.8.4;

contract BlockMsgContract {

    bytes32 public blockHash;
    uint256 public chainid;
    address public coinbase;
    uint256 public difficulty;
    uint256 public gaslimit;
    uint256 public number;
    uint256 public timestamp;

    event blockHashEvent(bytes32);


    function getBlockHashEventTopre256() public {
        uint256 beginNum = block.number + 1;
        for (uint256 i = 0; i < 260; i++) {
            if (i > beginNum) {
                return;
            }
            emit blockHashEvent(blockhash(beginNum - i));
        }
    }

    function getBlockHashView(uint256 number) public view returns (bytes32){
        return blockhash(number);
    }

    function getBlockHashEventTopre256View() public view returns (bytes32[] memory blkHashs,uint256 blockNumber){
        bytes32[] memory blkHashs = new bytes32[](260);
        uint256 beginNum = block.number + 1;
        for (uint256 i = 0; i < 260; i++) {
            if (i > beginNum) {
                break;
            }
            blkHashs[i] = blockhash(beginNum - i);
        }
        return (blkHashs,block.number);
    }

    function getBlockHash(uint256 number) public {
        emit blockHashEvent(blockhash(number));
    }

    function update_block_msg() public {
        (blockHash, chainid, coinbase, difficulty, gaslimit, number, timestamp) = getBlockMsgView(block.number - 1);
    }


    function get_block_data() public view returns (bytes32, uint256, address, uint256, uint256, uint256, uint256){
        return (blockHash, chainid, coinbase, difficulty, gaslimit, number, timestamp);
    }

    function getBlockMsgView(uint256 number) public view returns (bytes32, uint256, address payable, uint256, uint256, uint256, uint256){
        return getBlockMsg(number);
    }

    function getBlockMsgForPre(uint256 number) public view returns (bytes32, uint256, address payable, uint256, uint256, uint256, uint256){
        uint256 num = block.number - number;
        return getBlockMsg(num);
    }

    function getBlockMsg(uint256 number) public view returns (bytes32, uint256, address payable, uint256, uint256, uint256, uint256){
        return (blockhash(number), block.chainid, block.coinbase, block.difficulty, block.gaslimit, block.number, block.timestamp);
    }

    function call_block_msg(address _call, uint256 num, uint256 gas) public view returns (bytes32, uint256, address payable, uint256, uint256, uint256, uint256){
        BlockMsgContract bmc = BlockMsgContract(_call);
        return bmc.getBlockMsg{gas : gas}(num);
    }

}