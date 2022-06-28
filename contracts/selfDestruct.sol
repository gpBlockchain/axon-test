pragma solidity <0.6.0;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 */
contract selfDestructContract {
    constructor () public payable{}
    function selfDestruct() public {
        selfdestruct(msg.sender);
    }
}