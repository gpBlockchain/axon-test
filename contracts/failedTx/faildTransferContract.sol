pragma solidity =0.7.5;
interface EIP20Interface {

    function  totalSupply()external view returns(uint256);

    function balanceOf(address _owner) external view returns (uint256 balance);


    function transfer(address _to, uint256 _value) external returns (bool success);

    function transferFrom(address _from, address _to, uint256 _value) external returns (bool success);


    function approve(address _spender, uint256 _value) external returns (bool success);


    function allowance(address _owner, address _spender) external view returns (uint256 remaining);

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}

contract failedTransferContract{

    function transfer_success_other_failed(address proxyErc20Address) public payable{
        EIP20Interface erc20Contract = EIP20Interface(proxyErc20Address);
        erc20Contract.transfer(address(proxyErc20Address),1);
        require(false,"failed");
    }
}
