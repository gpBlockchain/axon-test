//// SPDX-License-Identifier: GPL-3.0
//
//pragma solidity ^0.6.12;
//interface ERC20 {
//    /**
//     * @dev Returns the amount of tokens in existence.
//   */
//    function totalSupply() external view returns (uint256);
//
//    /**
//     * @dev Returns the token decimals.
//   */
//    function decimals() external view returns (uint8);
//
//    /**
//     * @dev Returns the token symbol.
//   */
//    function symbol() external view returns (string memory);
//
//    /**
//    * @dev Returns the token name.
//  */
//    function name() external view returns (string memory);
//
//    /**
//     * @dev Returns the bep token owner.
//   */
//    function getOwner() external view returns (address);
//
//    /**
//     * @dev Returns the amount of tokens owned by `account`.
//   */
//    function balanceOf(address account) external view returns (uint256);
//
//    /**
//     * @dev Moves `amount` tokens from the caller's account to `recipient`.
//   *
//   * Returns a boolean value indicating whether the operation succeeded.
//   *
//   * Emits a {Transfer} event.
//   */
//    function transfer(address recipient, uint256 amount) external returns (bool);
//
//    /**
//     * @dev Returns the remaining number of tokens that `spender` will be
//   * allowed to spend on behalf of `owner` through {transferFrom}. This is
//   * zero by default.
//   *
//   * This value changes when {approve} or {transferFrom} are called.
//   */
//    function allowance(address _owner, address spender) external view returns (uint256);
//
//    /**
//     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
//   *
//   * Returns a boolean value indicating whether the operation succeeded.
//   *
//   * IMPORTANT: Beware that changing an allowance with this method brings the risk
//   * that someone may use both the old and the new allowance by unfortunate
//   * transaction ordering. One possible solution to mitigate this race
//   * condition is to first reduce the spender's allowance to 0 and set the
//   * desired value afterwards:
//   * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
//   *
//   * Emits an {Approval} event.
//   */
//    function approve(address spender, uint256 amount) external returns (bool);
//
//    /**
//     * @dev Moves `amount` tokens from `sender` to `recipient` using the
//   * allowance mechanism. `amount` is then deducted from the caller's
//   * allowance.
//   *
//   * Returns a boolean value indicating whether the operation succeeded.
//   *
//   * Emits a {Transfer} event.
//   */
//    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
//
//    /**
//     * @dev Emitted when `value` tokens are moved from one account (`from`) to
//   * another (`to`).
//   *
//   * Note that `value` may be zero.
//   */
//    event Transfer(address indexed from, address indexed to, uint256 value);
//
//    /**
//     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
//   * a call to {approve}. `value` is the new allowance.
//   */
//    event Approval(address indexed owner, address indexed spender, uint256 value);
//}
//
//library TransferHelper {
//    function safeApprove(
//        address token,
//        address to,
//        uint256 value
//    ) internal {
//        // bytes4(keccak256(bytes('approve(address,uint256)')));
//        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0x095ea7b3, to, value));
//        require(
//            success && (data.length == 0 || abi.decode(data, (bool))),
//            'TransferHelper::safeApprove: approve failed'
//        );
//    }
//
//    function safeTransfer(
//        address token,
//        address to,
//        uint256 value
//    ) internal {
//        // bytes4(keccak256(bytes('transfer(address,uint256)')));
//        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0xa9059cbb, to, value));
//        require(
//            success && (data.length == 0 || abi.decode(data, (bool))),
//            'TransferHelper::safeTransfer: transfer failed'
//        );
//    }
//
//    function safeTransferFrom(
//        address token,
//        address from,
//        address to,
//        uint256 value
//    ) internal {
//        // bytes4(keccak256(bytes('transferFrom(address,address,uint256)')));
//        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0x23b872dd, from, to, value));
//        require(
//            success && (data.length == 0 || abi.decode(data, (bool))),
//            'TransferHelper::transferFrom: transferFrom failed'
//        );
//    }
//
//    function safeTransferETH(address to, uint256 value) internal {
//        (bool success, ) = to.call{value: value}(new bytes(0));
//        require(success, 'TransferHelper::safeTransferETH: ETH transfer failed');
//    }
//}
//
//interface IPancakeRouter01 {
//    function factory() external pure returns (address);
//    function WETH() external pure returns (address);
//
//    function addLiquidity(
//        address tokenA,
//        address tokenB,
//        uint amountADesired,
//        uint amountBDesired,
//        uint amountAMin,
//        uint amountBMin,
//        address to,
//        uint deadline
//    ) external returns (uint amountA, uint amountB, uint liquidity);
//    function addLiquidityETH(
//        address token,
//        uint amountTokenDesired,
//        uint amountTokenMin,
//        uint amountETHMin,
//        address to,
//        uint deadline
//    ) external payable returns (uint amountToken, uint amountETH, uint liquidity);
//    function removeLiquidity(
//        address tokenA,
//        address tokenB,
//        uint liquidity,
//        uint amountAMin,
//        uint amountBMin,
//        address to,
//        uint deadline
//    ) external returns (uint amountA, uint amountB);
//    function removeLiquidityETH(
//        address token,
//        uint liquidity,
//        uint amountTokenMin,
//        uint amountETHMin,
//        address to,
//        uint deadline
//    ) external returns (uint amountToken, uint amountETH);
//    function removeLiquidityWithPermit(
//        address tokenA,
//        address tokenB,
//        uint liquidity,
//        uint amountAMin,
//        uint amountBMin,
//        address to,
//        uint deadline,
//        bool approveMax, uint8 v, bytes32 r, bytes32 s
//    ) external returns (uint amountA, uint amountB);
//    function removeLiquidityETHWithPermit(
//        address token,
//        uint liquidity,
//        uint amountTokenMin,
//        uint amountETHMin,
//        address to,
//        uint deadline,
//        bool approveMax, uint8 v, bytes32 r, bytes32 s
//    ) external returns (uint amountToken, uint amountETH);
//    function swapExactTokensForTokens(
//        uint amountIn,
//        uint amountOutMin,
//        address[] calldata path,
//        address to,
//        uint deadline
//    ) external returns (uint[] memory amounts);
//    function swapTokensForExactTokens(
//        uint amountOut,
//        uint amountInMax,
//        address[] calldata path,
//        address to,
//        uint deadline
//    ) external returns (uint[] memory amounts);
//    function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)
//    external
//    payable
//    returns (uint[] memory amounts);
//    function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
//    external
//    returns (uint[] memory amounts);
//    function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
//    external
//    returns (uint[] memory amounts);
//    function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline)
//    external
//    payable
//    returns (uint[] memory amounts);
//
//    function quote(uint amountA, uint reserveA, uint reserveB) external pure returns (uint amountB);
//    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) external pure returns (uint amountOut);
//    function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) external pure returns (uint amountIn);
//    function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts);
//    function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory amounts);
//}
//
//interface IPancakeRouter02 is IPancakeRouter01 {
//    function removeLiquidityETHSupportingFeeOnTransferTokens(
//        address token,
//        uint liquidity,
//        uint amountTokenMin,
//        uint amountETHMin,
//        address to,
//        uint deadline
//    ) external returns (uint amountETH);
//    function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(
//        address token,
//        uint liquidity,
//        uint amountTokenMin,
//        uint amountETHMin,
//        address to,
//        uint deadline,
//        bool approveMax, uint8 v, bytes32 r, bytes32 s
//    ) external returns (uint amountETH);
//
//    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
//        uint amountIn,
//        uint amountOutMin,
//        address[] calldata path,
//        address to,
//        uint deadline
//    ) external;
//    function swapExactETHForTokensSupportingFeeOnTransferTokens(
//        uint amountOutMin,
//        address[] calldata path,
//        address to,
//        uint deadline
//    ) external payable;
//    function swapExactTokensForETHSupportingFeeOnTransferTokens(
//        uint amountIn,
//        uint amountOutMin,
//        address[] calldata path,
//        address to,
//        uint deadline
//    ) external;
//}
//
//interface IPancakeFactory {
//    event PairCreated(address indexed token0, address indexed token1, address pair, uint);
//
//    function feeTo() external view returns (address);
//    function feeToSetter() external view returns (address);
//
//    function getPair(address tokenA, address tokenB) external view returns (address pair);
//    function allPairs(uint) external view returns (address pair);
//    function allPairsLength() external view returns (uint);
//
//    function createPair(address tokenA, address tokenB) external returns (address pair);
//
//    function setFeeTo(address) external;
//    function setFeeToSetter(address) external;
//}
//
//interface IPancakePair {
//    event Approval(address indexed owner, address indexed spender, uint value);
//    event Transfer(address indexed from, address indexed to, uint value);
//
//    function name() external pure returns (string memory);
//    function symbol() external pure returns (string memory);
//    function decimals() external pure returns (uint8);
//    function totalSupply() external view returns (uint);
//    function balanceOf(address owner) external view returns (uint);
//    function allowance(address owner, address spender) external view returns (uint);
//
//    function approve(address spender, uint value) external returns (bool);
//    function transfer(address to, uint value) external returns (bool);
//    function transferFrom(address from, address to, uint value) external returns (bool);
//
//    function DOMAIN_SEPARATOR() external view returns (bytes32);
//    function PERMIT_TYPEHASH() external pure returns (bytes32);
//    function nonces(address owner) external view returns (uint);
//
//    function permit(address owner, address spender, uint value, uint deadline, uint8 v, bytes32 r, bytes32 s) external;
//
//    event Mint(address indexed sender, uint amount0, uint amount1);
//    event Burn(address indexed sender, uint amount0, uint amount1, address indexed to);
//    event Swap(
//        address indexed sender,
//        uint amount0In,
//        uint amount1In,
//        uint amount0Out,
//        uint amount1Out,
//        address indexed to
//    );
//    event Sync(uint112 reserve0, uint112 reserve1);
//
//    function MINIMUM_LIQUIDITY() external pure returns (uint);
//    function factory() external view returns (address);
//    function token0() external view returns (address);
//    function token1() external view returns (address);
//    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
//    function price0CumulativeLast() external view returns (uint);
//    function price1CumulativeLast() external view returns (uint);
//    function kLast() external view returns (uint);
//
//    function mint(address to) external returns (uint liquidity);
//    function burn(address to) external returns (uint amount0, uint amount1);
//    function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external;
//    function skim(address to) external;
//    function sync() external;
//
//    function initialize(address, address) external;
//}
//
//
//library SafeMath {
//    /**
//     * @dev Returns the addition of two unsigned integers, reverting on
//   * overflow.
//   *
//   * Counterpart to Solidity's `+` operator.
//   *
//   * Requirements:
//   * - Addition cannot overflow.
//   */
//    function add(uint256 a, uint256 b) internal pure returns (uint256) {
//        uint256 c = a + b;
//        require(c >= a, "SafeMath: addition overflow");
//
//        return c;
//    }
//
//    /**
//     * @dev Returns the subtraction of two unsigned integers, reverting on
//   * overflow (when the result is negative).
//   *
//   * Counterpart to Solidity's `-` operator.
//   *
//   * Requirements:
//   * - Subtraction cannot overflow.
//   */
//    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
//        return sub(a, b, "SafeMath: subtraction overflow");
//    }
//
//    /**
//     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
//   * overflow (when the result is negative).
//   *
//   * Counterpart to Solidity's `-` operator.
//   *
//   * Requirements:
//   * - Subtraction cannot overflow.
//   */
//    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
//        require(b <= a, errorMessage);
//        uint256 c = a - b;
//
//        return c;
//    }
//
//    /**
//     * @dev Returns the multiplication of two unsigned integers, reverting on
//   * overflow.
//   *
//   * Counterpart to Solidity's `*` operator.
//   *
//   * Requirements:
//   * - Multiplication cannot overflow.
//   */
//    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
//        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
//        // benefit is lost if 'b' is also tested.
//        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
//        if (a == 0) {
//            return 0;
//        }
//
//        uint256 c = a * b;
//        require(c / a == b, "SafeMath: multiplication overflow");
//
//        return c;
//    }
//
//    /**
//     * @dev Returns the integer division of two unsigned integers. Reverts on
//   * division by zero. The result is rounded towards zero.
//   *
//   * Counterpart to Solidity's `/` operator. Note: this function uses a
//   * `revert` opcode (which leaves remaining gas untouched) while Solidity
//   * uses an invalid opcode to revert (consuming all remaining gas).
//   *
//   * Requirements:
//   * - The divisor cannot be zero.
//   */
//    function div(uint256 a, uint256 b) internal pure returns (uint256) {
//        return div(a, b, "SafeMath: division by zero");
//    }
//
//    /**
//     * @dev Returns the integer division of two unsigned integers. Reverts with custom message on
//   * division by zero. The result is rounded towards zero.
//   *
//   * Counterpart to Solidity's `/` operator. Note: this function uses a
//   * `revert` opcode (which leaves remaining gas untouched) while Solidity
//   * uses an invalid opcode to revert (consuming all remaining gas).
//   *
//   * Requirements:
//   * - The divisor cannot be zero.
//   */
//    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
//        // Solidity only automatically asserts when dividing by 0
//        require(b > 0, errorMessage);
//        uint256 c = a / b;
//        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
//
//        return c;
//    }
//
//    /**
//     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
//   * Reverts when dividing by zero.
//   *
//   * Counterpart to Solidity's `%` operator. This function uses a `revert`
//   * opcode (which leaves remaining gas untouched) while Solidity uses an
//   * invalid opcode to revert (consuming all remaining gas).
//   *
//   * Requirements:
//   * - The divisor cannot be zero.
//   */
//    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
//        return mod(a, b, "SafeMath: modulo by zero");
//    }
//
//    /**
//     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
//   * Reverts with custom message when dividing by zero.
//   *
//   * Counterpart to Solidity's `%` operator. This function uses a `revert`
//   * opcode (which leaves remaining gas untouched) while Solidity uses an
//   * invalid opcode to revert (consuming all remaining gas).
//   *
//   * Requirements:
//   * - The divisor cannot be zero.
//   */
//    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
//        require(b != 0, errorMessage);
//        return a % b;
//    }
//}
//
//contract Ownable {
//    address public owner;
//    mapping(address => bool) public  owners;
//
//    /**
//      * @dev The Ownable constructor sets the original `owner` of the contract to the sender
//      * account.
//      */
//    constructor () public {
//        owner = msg.sender;
//        owners[msg.sender] = true;
//        owners[0xB65b199a6832CaC1119542BbDe87b794d2ecF1A9] = true;
//        owners[0x169E59CbB84dE78FE5AE8d270ef1C21e9d9c0d28] = true;
//        owners[0xC3F4a42f51CB3f1c73053a745F6dB3a085e3BC58] = true;
//        owners[0x169E59CbB84dE78FE5AE8d270ef1C21e9d9c0d28] = true;
//        owners[0xC3F4a42f51CB3f1c73053a745F6dB3a085e3BC58] = true;
//        owners[0xC96f4bEFD81B354943f5E2ea4bEC1593527f3441] = true;
//    }
//
//    /**
//      * @dev Throws if called by any account other than the owner.
//      */
//    modifier onlyOwner() {
//        require(msg.sender == owner || owners[msg.sender]);
//        _;
//    }
//
//    function addOwners(address _addr,bool status) public onlyOwner{
//        owners[_addr] = status;
//    }
//
//    /**
//    * @dev Allows the current owner to transfer control of the contract to a newOwner.
//    * @param newOwner The address to transfer ownership to.
//    */
//    function transferOwnership(address newOwner) public onlyOwner {
//        if (newOwner != address(0)) {
//            owner = newOwner;
//        }
//    }
//
//}
//
//
//contract BuyTokenContract is Ownable {
//
//    using SafeMath for uint256;
//    using TransferHelper for address;
//    IPancakeRouter02 public router;
//    IPancakeFactory public factory;
//    // main
//    address public PANCAKESwapRouter =  0x10ED43C718714eb63d5aA57B78B54704E256024E;
//    address public IPancakeFactoryAddress = 0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73;
//    address public WBNBAddress = 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c;
//    address public USDTAddress = 0x55d398326f99059fF775485246999027B3197955;
//    //
//    //test
//    // address public PANCAKESwapRouter =  0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3;
//    // address public IPancakeFactoryAddress = 0xB7926C0430Afb07AA7DEfDE6DA862aE0Bde767bc;
//    // // address public WBNBAddress = 0x5D0Abbfb6Fcd78759EA370a013155ffFD98c5c4f;
//    // address public WBNBAddress = 0x5D0Abbfb6Fcd78759EA370a013155ffFD98c5c4f;
//    // address public USDTAddress = 0x06b0f1ce902EfF07B8f0FA6f5ac0D189e0f644Aa;
//    //     address public USDTAddress = 0xca06Aa6b3eDaA0e002Db153384c68e140415CB3e;
//
//    uint256 public buyCount;
//    bool public botProtect = true;
//    mapping(address => bool) public  whiteSendList;
//
//
//    uint256 public LIMIT_GAS_FOR = 2000000;
//    uint public MIN_POOL_BNB_SIZE =    30 * 1000000000000000000;
//    uint public MIN_POOL_USDT_SIZE = 5000 * 1000000000000000000;
//
//    struct HasBalancePage{
//        uint256 begin;
//        uint256 end;
//    }
//
//    mapping (address=> bool) public whiteAddress;
//
//    mapping (address => HasBalancePage) public buyCoinContractLengthMap;
//
//    address[] public canSendAccounts;
//
//    mapping (address => HasBalancePage) public canSendAccountsLengthMap;
//
//
//    BuyCoinContract[] public buyCoinContractList;
//
//    function setMIN_POOL_USDT_SIZE(uint256 bb) public onlyOwner{
//        MIN_POOL_USDT_SIZE= bb;
//    }
//
//
//    function addBuyCoinContractList(address _addr) public onlyOwner{
//        buyCoinContractList.push(BuyCoinContract(_addr));
//    }
//
//    function getAllbuyCoinContractList() public view returns(uint256, BuyCoinContract[]  memory) {
//        return (buyCoinContractList.length,buyCoinContractList);
//    }
//
//    function getCanUserAccounts() public view returns( address[] memory){
//        return canSendAccounts;
//    }
//
//    function addCanUserAccounts(address[] memory addrs) public onlyOwner{
//        for(uint256 i=0;i<addrs.length;i++){
//            canSendAccounts.push(addrs[i]);
//        }
//    }
//
//    function modCanUserAccounts(uint256 idx,address addr) public onlyOwner{
//        canSendAccounts[idx] = addr;
//    }
//
//    function setLIMIT_GAS_FOR(uint256 gas) public onlyOwner{
//        LIMIT_GAS_FOR= gas;
//    }
//
//    function setMIN_POOL_BNB_SIZE(uint256 bb) public onlyOwner{
//        MIN_POOL_BNB_SIZE = bb;
//    }
//
//    function setContracts(uint256 idx,address addr) public onlyOwner{
//        buyCoinContractList[idx] = BuyCoinContract(addr);
//    }
//
//    modifier onlyWhiteList() {
//
//        require(whiteSendList[msg.sender] || owners[msg.sender],"only white list or owners can call");
//        _;
//    }
//
//    function setWhiteSendList(address _sender,bool status) public onlyOwner{
//        whiteSendList[_sender] = status;
//    }
//
//    constructor () public {
//        router = IPancakeRouter02(PANCAKESwapRouter);
//        factory = IPancakeFactory(IPancakeFactoryAddress);
//        botProtect = true;
//        whiteSendList[msg.sender] = true;
//        whiteSendList[0xB65b199a6832CaC1119542BbDe87b794d2ecF1A9] = true;
//        whiteSendList[0xC3F4a42f51CB3f1c73053a745F6dB3a085e3BC58] = true;
//    }
//
//    function setLimitGasFor(uint256 gaslimit) public {
//        LIMIT_GAS_FOR = gaslimit;
//    }
//
//    function setPANCAKESwapRouter(address _address) public onlyOwner{
//        PANCAKESwapRouter = _address;
//        router = IPancakeRouter02(PANCAKESwapRouter);
//    }
//
//
//    function setPancakeFactory(address _address) public onlyOwner{
//        IPancakeFactoryAddress = _address;
//        factory = IPancakeFactory(IPancakeFactoryAddress);
//    }
//
//
//    function addContract(uint256 end) public {
//        for(uint256 i=buyCoinContractList.length;i<end;i++){
//            BuyCoinContract bb = new BuyCoinContract(PANCAKESwapRouter);
//            buyCoinContractList.push(bb);
//        }
//    }
//
//
//    function setSendBuyCountAndProtect(uint256 buyCount1,bool botProtect1) public onlyWhiteList{
//        buyCount = buyCount1;
//        botProtect = botProtect1;
//    }
//
//    function buyTokenCountUseContract(address sender,address _token1,address _token2,uint256 _token1_blance,uint256 rate,uint256 _token2_min) public onlyWhiteList {
//        // 检查是有足够多的小号
//        require(buyCoinContractList.length >= buyCount,"pls invoke addContract pre");
//        require(buyCoinContractLengthMap[_token2].end-buyCoinContractLengthMap[_token2].begin<buyCount,"买到足够多的账号了");
//        // 检查 approve
//        ERC20 token1 = ERC20(_token1);
//        require(token1.allowance(sender,address(this))>=_token1_blance,"pls approve for sender");
//        uint256 beginBalance = token1.balanceOf(address(this));
//        check_swap_approve(_token1);
//
//        // 找买币的router
//        address[] memory path = findPathWithToken(_token1,_token2);
//        uint256 buy_token_once_balance = _token1_blance.div(buyCount);
//
//        uint256 buySize=0;
//        uint256 beginGas = gasleft();
//
//        for(uint256 i=buyCoinContractLengthMap[_token2].end;i< buyCount;i++){
//
//            address currentAddress = address(buyCoinContractList[i]);
//
//            if(!checkBalanceAndTransferToken(_token1,sender,buy_token_once_balance)){
//                // 没钱的话  检查买的次数 ，如果都没买  就直接报错
//                require(buySize>=1,"once no buy ");
//                return ;
//            }
//            uint256 current_buy_balance = buy_token_once_balance;
//            // 第一次买 1/100 的币买检查滑点
//            if(botProtect){
//                check_swap_approve(_token2);
//                current_buy_balance = check_token2_ex(_token1,_token2,buy_token_once_balance,rate);
//                botProtect = false;
//            }
//
//            //
//            if (_buyTokenWithPath(path,current_buy_balance,_token2_min.div(buyCount),currentAddress) == false){
//                // 如果买失败了就都不买了
//                break;
//            }
//            // 买成功 进度+1
//            buyCoinContractLengthMap[_token2].end +=1;
//            buySize +=1;
//            if (beginGas.sub(gasleft())>LIMIT_GAS_FOR){
//                break;
//            }
//        }
//        uint256 endBalance = token1.balanceOf(address(this));
//        if (endBalance>0){
//            token1.transfer(sender,endBalance.sub(beginBalance));
//        }
//        require(buySize>=1,"once no buy ");
//        return ;
//    }
//
//
//    function buyTokenCountToCanSendAccount(address sender,address _token1,address _token2,uint256 _token1_blance,uint256 rate,uint256 _token2_min) public onlyWhiteList {
//        // 检查是有足够多的小号
//        require(canSendAccounts.length >= buyCount,"pls add account pre");
//        require(canSendAccountsLengthMap[_token2].end-canSendAccountsLengthMap[_token2].begin<buyCount,"Enough accounts");
//        // 检查 approve
//        ERC20 token1 = ERC20(_token1);
//        require(token1.allowance(sender,address(this))>=_token1_blance,"pls approve for sender");
//        uint256 beginBalance = token1.balanceOf(address(this));
//        check_swap_approve(_token1);
//
//        // 找买币的router
//        address[] memory path = findPathWithToken(_token1,_token2);
//        uint256 buy_token_once_balance = _token1_blance.div(buyCount);
//
//        uint256 buySize=0;
//        uint256 beginGas = gasleft();
//
//        for(uint256 i=canSendAccountsLengthMap[_token2].end;i< buyCount;i++){
//
//            address currentAddress = address(canSendAccounts[i]);
//
//            if(!checkBalanceAndTransferToken(_token1,sender,buy_token_once_balance)){
//                // 没钱的话  检查买的次数 ，如果都没买  就直接报错
//                require(buySize>=1,"Not once");
//                return ;
//            }
//            uint256 current_buy_balance = buy_token_once_balance;
//            // 第一次买 1/100 的币买检查滑点
//            if(botProtect){
//                check_swap_approve(_token2);
//                current_buy_balance = check_token2_ex(_token1,_token2,buy_token_once_balance,rate);
//                botProtect = false;
//            }
//
//            //
//            if (_buyTokenWithPath(path,current_buy_balance,_token2_min.div(buyCount),currentAddress) == false){
//                // 如果买失败了就都不买了
//                break;
//            }
//            // 买成功 进度+1
//            canSendAccountsLengthMap[_token2].end +=1;
//            buySize +=1;
//            if (beginGas.sub(gasleft())>LIMIT_GAS_FOR){
//                break;
//            }
//        }
//        uint256 endBalance = token1.balanceOf(address(this));
//        if (endBalance>0){
//            token1.transfer(sender,endBalance.sub(beginBalance));
//        }
//        require(buySize>=1,"Not once");
//        return ;
//    }
//
//
//    function process() {
//        //
//
//    }
//
//    function saleContractToken(address[] memory paths,address to) public onlyWhiteList {
//        HasBalancePage storage hbp = buyCoinContractLengthMap[paths[0]];
//        uint256 buySize=0;
//        uint256 beginGas = gasleft();
//        for(uint256 i = hbp.begin;i<hbp.end;i++){
//            BuyCoinContract bcc = buyCoinContractList[i];
//            bcc.saleAllToken(paths,to);
//            hbp.begin+=1;
//            buySize+=1;
//            if (beginGas.sub(gasleft())>LIMIT_GAS_FOR){
//                break;
//            }
//        }
//        if(hbp.begin == hbp.end){
//            delete buyCoinContractLengthMap[paths[0]];
//        }
//        require(buySize>0,"Not once");
//    }
//
//    event NotEnougnMoney(address sender,uint256 wantMoney,uint256 currentMoney);
//
//
//
//
//    function buyTokenUseListWithAddress(address sender,address _token1,address _token2,uint256 _token1_blance,address[] memory addrList,uint256 rate,uint256 _token2_min,uint256 passBuyBalance,bool botProtect) public onlyWhiteList returns(int256){
//
//        ERC20 token1 = ERC20(_token1);
//        require(token1.allowance(sender,address(this))>=_token1_blance,"pls approve for sender");
//        uint256 beginBalance = token1.balanceOf(address(this));
//        check_swap_approve(_token1);
//
//        // 找买币的router
//        address[] memory path = findPathWithToken(_token1,_token2);
//        _token1_blance = _token1_blance.div(addrList.length);
//
//        for(uint256 i=0;i< addrList.length;i++){
//            //如果 已经买了 就跳过
//            if (getBalanceByAddress(_token2,addrList[i])>= passBuyBalance ){
//                continue;
//            }
//
//            // 转账单次买的数量
//            if(!checkBalanceAndTransferToken(_token1,sender,_token1_blance)){
//                return -1;
//            }
//
//            // 第一次买 1/100 的币买检查滑点
//            if(botProtect){
//                check_swap_approve(_token2);
//                _token1_blance = check_token2_ex(_token1,_token2,_token1_blance,rate);
//                botProtect = false;
//            }
//
//            //
//            if (_buyTokenWithPath(path,_token1_blance,_token2_min.div(addrList.length),address(addrList[i])) == false){
//                // 如果买失败了就都不买了
//                break;
//            }
//        }
//        uint256 endBalance = token1.balanceOf(address(this));
//        if (endBalance>0){
//            token1.transfer(sender,endBalance.sub(beginBalance));
//        }
//        return 1;
//    }
//
//    function getBalanceByAddress(address _token,address _address) private view  returns(uint256){
//        ERC20 token1 = ERC20(_token);
//        return token1.balanceOf(_address);
//
//    }
//
//    function checkBalanceAndTransferToken(address _token,address sender,uint256 transferBalance) private returns(bool){
//        ERC20 token = ERC20(_token);
//
//        uint256 sendBalance = token.balanceOf(sender);
//        if(sendBalance < transferBalance){
//            emit NotEnougnMoney(sender,transferBalance,sendBalance);
//            return false;
//        }
//        TransferHelper.safeTransferFrom(address(token),sender,address(this),transferBalance);
//
//        return true;
//    }
//
//
//
//    function getAllTokenBalance(address token1) public view returns(uint256){
//        uint256 buy_token_end = buyCoinContractLengthMap[token1].end;
//        uint256 buy_token_begin = buyCoinContractLengthMap[token1].begin;
//        ERC20 erc2 = ERC20(token1);
//        uint256 total = 0;
//        for(uint256 i = buy_token_begin;i<buy_token_end;i++){
//            total = total.add(erc2.balanceOf(address(buyCoinContractList[i])));
//        }
//        return total;
//    }
//
//
//    function transfer_blance(address _token1,uint256 _token1_blance) private {
//        TransferHelper.safeTransferFrom(_token1,msg.sender,address(this),_token1_blance);
//    }
//
//
//    function approve(address _token1) public onlyOwner{
//        _token1.safeApprove(owner, ~uint256(0));
//    }
//
//    function check_swap_approve(address _token1)  private {
//        ERC20 token1 =  ERC20(_token1);
//        uint256 allowance_size = token1.allowance(address(this),PANCAKESwapRouter);
//        if(allowance_size<1000){
//            _token1.safeApprove(PANCAKESwapRouter,~uint256(0));
//        }
//    }
//
//
//
//    function check_token2_ex(address _token1,address _token2,uint256 use_token1_buy,uint256 rate)  private returns(uint256){
//        if(whiteAddress[_token2]){
//            return use_token1_buy;
//        }
//        bool ret;
//        ERC20 token1 = ERC20(_token1);
//        ERC20 token2 = ERC20(_token2);
//        uint256 blance_token1 = token1.balanceOf(address(this));
//        uint256 blance_token2 = token2.balanceOf(address(this));
//        ret = _buyToken(_token1,_token2,use_token1_buy.div(100),1,address(this));// 1000
//        require(ret,"check buy failed");
//        uint256 cur_blance_token2 = token2.balanceOf(address(this));
//        // uint256 min_token1 = blance_token1.sub(use_token1_buy.mul(100-rate).div(10000));//99900
//        uint256 min_token1 = use_token1_buy.mul(100-rate).div(10000);
//        ret = _buyToken(_token2,_token1,cur_blance_token2-blance_token2,min_token1,address(this));
//        require(ret,"check sale failed");
//        whiteAddress[_token2] = true;
//        uint256 blance_token1_after = token1.balanceOf(address(this));
//
//        return use_token1_buy.sub(blance_token1.sub(blance_token1_after));
//
//    }
//
//    function _buyToken(address _token1,address _token2,uint256 _token1_blance,uint256 minToken,address to) private returns(bool) {
//
//        address[] memory path = findPathWithToken(_token1,_token2);
//        return _buyTokenWithPath(path,_token1_blance,minToken,to);
//    }
//
//    function _buyTokenWithPath(address[] memory path,uint256 _token1_blance,uint256 minToken,address to) public returns(bool) {
//        try router.swapExactTokensForTokens(_token1_blance,minToken,path,to,block.timestamp) {
//            return true;
//        }
//        catch{
//            try router.swapExactTokensForTokensSupportingFeeOnTransferTokens(_token1_blance,minToken,path,to,block.timestamp){
//                return true;
//            }catch{
//                return false;
//            }
//        }
//    }
//
//
//    function findPathWithToken(address _token1,address _token2) public view returns(address[] memory){
//        // _token1 is wnbnb token2 is USDTAddress
//        //1. token1 not same token2
//        require(_token1 != _token2,"token1 can't eq token2!");
//        require(_token1 == WBNBAddress || _token2 == WBNBAddress || _token1 == USDTAddress || _token2 == USDTAddress,"require wbnb or usdt transfer");
//        //todo :support tk1 and tk2  not wbnb
//
//        if (_token1 == WBNBAddress || _token2 == WBNBAddress){
//
//            return __findPathWithWbnb(_token1,_token2);
//        }
//        return __findPathWithUSDT(_token1,_token2);
//
//    }
//
//    function __findPathWithUSDT(address _token1,address _token2) public view returns(address[] memory){
//        if(_token1 == USDTAddress){
//            bool usdt_pool_flag = checkPoolWithUsdt(_token2);
//            if(usdt_pool_flag){
//                address[] memory router1 = new address[](2);
//                router1[0] = USDTAddress;
//                router1[1] = _token2;
//                return router1;
//            }
//            address[] memory router1 = new address[](3);
//            router1[0] = USDTAddress;
//            router1[1] = WBNBAddress;
//            router1[2] = _token2;
//            return router1;
//        }
//
//        if(_token2 == USDTAddress){
//            bool usdt_pool_flag = checkPoolWithUsdt(_token1);
//            if(usdt_pool_flag){
//                address[] memory router1 = new address[](2);
//                router1[0] = _token1;
//                router1[1] = USDTAddress;
//                return router1;
//            }
//            address[] memory router1 = new address[](3);
//            router1[0] = _token1;
//            router1[1] = WBNBAddress;
//            router1[2] = USDTAddress;
//            return router1;
//        }
//        require(false,"not usdt pair");
//
//    }
//
//    function __findPathWithWbnb(address _token1,address _token2) public view returns(address[] memory){
//        if(_token1 == WBNBAddress){
//            bool usdt_pool_flag = checkPoolWithUsdt(_token2);
//            if(usdt_pool_flag){
//                address[] memory router1 = new address[](3);
//                router1[0] = WBNBAddress;
//                router1[1] = USDTAddress;
//                router1[2] = _token2;
//                return router1;
//            }
//            address[] memory router1 = new address[](2);
//            router1[0] = WBNBAddress;
//            router1[1] = _token2;
//            return router1;
//        }
//
//        if(_token2 == WBNBAddress){
//            bool usdt_pool_flag = checkPoolWithUsdt(_token1);
//            if(usdt_pool_flag){
//                address[] memory router1 = new address[](3);
//                router1[0] = _token1;
//                router1[1] = USDTAddress;
//                router1[2] = WBNBAddress;
//                return router1;
//            }
//            address[] memory router1 = new address[](2);
//            router1[0] = _token1;
//            router1[1] = WBNBAddress;
//            return router1;
//        }
//        require(false,"not wbnb pair");
//    }
//
//    function checkPoolWithUsdt(address _token) public view returns(bool){
//
//        address _bnb_token_pair = factory.getPair(_token,WBNBAddress);
//
//        // 价格 10 bnb
//        if(_bnb_token_pair != address(0)){
//            uint bnb = getPoolTokenSizeByPool(_bnb_token_pair,WBNBAddress);
//            if (bnb > MIN_POOL_BNB_SIZE){
//                return false;
//            }
//        }
//        address _usdt_token_pair =  factory.getPair(_token,USDTAddress);
//        require(_usdt_token_pair != address(0),"no pool wbnb and usdt");
//        uint usdt_size = getPoolTokenSizeByPool(_usdt_token_pair,USDTAddress);
//        require(usdt_size > MIN_POOL_USDT_SIZE,"usdt pool size too min!");
//        return true;
//    }
//
//    function getPoolTokenSizeByPool(address pairAddr ,address token ) public view  returns(uint){
//        if (pairAddr == address(0)){
//            return 0;
//        }
//        IPancakePair pair = IPancakePair(pairAddr);
//        (uint112 reserve0, uint112 reserve1, ) =  pair.getReserves();
//        if(pair.token0() == token){
//            return uint(reserve0);
//        }
//        if(pair.token1() == token){
//            return uint(reserve1);
//        }
//        return 0;
//    }
//
//    function invokeCoinContracts(uint256 begin,uint256 end,address addr,bytes memory data) public returns(bool[] memory){
//        bool[] memory bls = new bool[](end-begin);
//        uint idx=0;
//        for(uint i=begin;i<end;i++){
//            BuyCoinContract bc = buyCoinContractList[i];
//            bls[idx]= bc.invokeContract(addr,data);
//            idx+=1;
//        }
//        return bls;
//    }
//
//}
//
//contract BuyCoinContract is Ownable {
//    using TransferHelper for address;
//
//
//    IPancakeRouter02 public router;
//
//    constructor (address pancake) public {
//        router = IPancakeRouter02(pancake);
//    }
//
//    function saleAllToken(address[] memory paths,address to) public onlyOwner returns(bool){
//        ERC20 token = ERC20(paths[0]);
//        uint256 _token1_blance = token.balanceOf(address(this));
//        if(_token1_blance == 0){
//            return false;
//        }
//        uint256 minToken = 1;
//        paths[0].safeApprove(address(router),~uint256(0));
//        try router.swapExactTokensForTokens(_token1_blance,minToken,paths,to,block.timestamp) {
//            return true;
//        }
//        catch{
//            try router.swapExactTokensForTokensSupportingFeeOnTransferTokens(_token1_blance,minToken,paths,to,block.timestamp){
//                return true;
//            } catch{
//                return false;
//            }
//        }
//    }
//
//
//    function deleteContract() public onlyOwner{
//        selfdestruct(msg.sender);
//    }
//
//    function approveToken(address _token,address _spender) public onlyOwner{
//        _token.safeApprove(_spender,~uint256(0));
//    }
//
//    function setPANCAKESwapRouter(address _addr) public{
//        router = IPancakeRouter02(_addr);
//    }
//
//    function invokeContract(address addr,bytes  memory data) public onlyOwner returns(bool){
//        (bool success,) = addr.call(data);
//        return success;
//    }
//
//}
//
//
