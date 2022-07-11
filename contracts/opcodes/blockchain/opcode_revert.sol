pragma solidity ^0.8.4;

contract RevertContract {

    function revert1() public {
        revert("1234");
    }

    function revert1View() public view returns (uint256) {
        revert("12341123411234112341123411234112341123411234112341123411234112341123411234112341123411234112341123411234112341123411234112341123411234112341123411234112341123411234112341");
        return 1;
    }

    function revertMsg(string memory msg) public view returns (uint256){
        revert(msg);
        return 1;
    }


    function requireTest() public {
        require(false, "require");
    }

    function testRequireBalance() public {
        require(false, "ERC20: transfer amount exceeds balance");
    }

    function testRequireBalanceView() public view {
        require(false, "ERC20: transfer amount exceeds balance");
    }
}