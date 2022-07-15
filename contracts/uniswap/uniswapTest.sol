pragma solidity =0.6.6;

import './UniswapV2Router02.sol';
import './WETH.sol';
import './ERC20.sol';

contract  UniswapTest{
    using SafeMath for uint;
    WETH9 public weth;
    IUniswapV2Factory public factory;
    UniswapV2Router02 public uniswapRouter2;
    address[] public erc20s;
    IUniswapV2Pair[] public pairs;
    constructor(address _factory) public {
        factory = IUniswapV2Factory(_factory);
    }

    function initEnv() public {
        weth = new WETH9();
        erc20s.push(address(weth));
        newRouterV2();
    }



    function initERC20(string memory name,string memory symple,uint256 size) public {
        ERC20 erc = new ERC20(name,symple,size);
        erc20s.push(address(erc));
    }



    function setFactory(address _addr) public{
        factory = IUniswapV2Factory(_addr);
    }

    function newRouterV2() public {
        uniswapRouter2 = new UniswapV2Router02(address(factory),address(weth));
    }


    function addLiquidity(uint256 token1Idx,uint256 token2Idx) public returns(uint amountA, uint amountB, uint liquidity){
        address tokenA = erc20s[token1Idx];
        address tokenB = erc20s[token2Idx];
        TransferHelper.safeApprove(tokenA, address(uniswapRouter2), ~uint256(0));
        TransferHelper.safeApprove(tokenB, address(uniswapRouter2), ~uint256(0));
        return uniswapRouter2.addLiquidity(tokenA,tokenB,100000,100000,1,1,address(this),block.timestamp);
    }

    function addLiquidityByAddress(address tokenA,address tokenB) public returns(uint amountA, uint amountB, uint liquidity){
        TransferHelper.safeApprove(tokenA, address(uniswapRouter2), ~uint256(0));
        TransferHelper.safeApprove(tokenB, address(uniswapRouter2), ~uint256(0));
        return uniswapRouter2.addLiquidity(tokenA,tokenB,100000 * 10 **18 ,100000 * 10 **18 ,1,1,address(this),block.timestamp);
    }


    function buyToken(uint256 token1Idx,uint256 token2Idx,uint256 buySize) public returns(uint[] memory amounts){
        address tokenA = erc20s[token1Idx];
        address tokenB = erc20s[token2Idx];
        address[] memory path =  new  address[](2);
        path[0] = tokenA;
        path[1] = tokenB;
        return uniswapRouter2.swapExactTokensForTokens(buySize,1,path,address(this),block.timestamp);
    }

    function buyTokenByAddress(address tokenA,address tokenB,uint256 buySize) public returns(uint[] memory amounts){
        address[] memory path =  new  address[](2);
        path[0] = tokenA;
        path[1] = tokenB;
        return uniswapRouter2.swapExactTokensForTokens(buySize,1,path,address(this),block.timestamp);
    }



    function removeLiquidity(uint256 token1Idx,uint256 token2Idx) public returns(uint amountA, uint amountB){
        address tokenA = erc20s[token1Idx];
        address tokenB = erc20s[token2Idx];
        address _pairAddr = factory.getPair(tokenA,tokenB);
        IUniswapV2Pair pair = IUniswapV2Pair(_pairAddr);
        uint256 liquidity = pair.balanceOf(address(this));

        TransferHelper.safeApprove(_pairAddr, address(uniswapRouter2), ~(uint256(0)));
        return uniswapRouter2.removeLiquidity(tokenA,tokenB,liquidity,1,1,address(this),block.timestamp);
    }

    function removeLiquidityByAddress(address tokenA,address tokenB) public returns(uint amountA, uint amountB){
        address _pairAddr = factory.getPair(tokenA,tokenB);
        IUniswapV2Pair pair = IUniswapV2Pair(_pairAddr);
        uint256 liquidity = pair.balanceOf(address(this));

        TransferHelper.safeApprove(_pairAddr, address(uniswapRouter2), ~(uint256(0)));
        return uniswapRouter2.removeLiquidity(tokenA,tokenB,liquidity,1,1,address(this),block.timestamp);
    }

    function getTokenBalance(uint256 token1Idx) public view returns(uint256 balanceOf){
        address tokenA = erc20s[token1Idx];
        ERC20 erc20 = ERC20(tokenA);
        return erc20.balanceOf(address(this));
    }

    function getlpBalance(uint256 token1Idx,uint256 token2Idx) public view  returns(uint256 balanceOf){
        address tokenA = erc20s[token1Idx];
        address tokenB = erc20s[token2Idx];
        address pairAddr = factory.getPair(tokenA,tokenB);
        IUniswapV2Pair pair = IUniswapV2Pair(pairAddr);
        uint256 liquidity = pair.balanceOf(address(this));
        return liquidity;
    }

    function getTokenPrice(uint256 token1Idx,uint256 token2Idx) public view returns(uint){
        address tokenA = erc20s[token1Idx];
        address tokenB = erc20s[token2Idx];
        address pairAddr = factory.getPair(tokenA,tokenB);
        IUniswapV2Pair pair = IUniswapV2Pair(pairAddr);
        (uint reserve0, uint reserve1,) = pair.getReserves();
        return reserve0.mul(1000).div(reserve1);
    }

    function createPair(uint256 token1Idx, uint256 token2Idx) public returns(address){
        address tokenA = erc20s[token1Idx];
        address tokenB = erc20s[token2Idx];
        address pairAddr = factory.createPair(tokenA,tokenB);
        return pairAddr;
    }

    function getPairAddress(uint256 token1Idx,uint256 token2Idx) public returns(address){
        address tokenA = erc20s[token1Idx];
        address tokenB = erc20s[token2Idx];
        (address token0, address token1) = sortTokens(tokenA, tokenB);
        address  pair = address(uint(keccak256(abi.encodePacked(
                hex'ff',
                address(factory),
                keccak256(abi.encodePacked(token0, token1)),
                hex'499b772baa37f5e67a63ba6fed54dfb82b9c7ecca22ab4f25a6896e7f6782734' // init code hash
            ))));
        return pair;
    }

    function sortTokens(address tokenA, address tokenB) internal pure returns (address token0, address token1) {
        require(tokenA != tokenB, 'UniswapV2Library: IDENTICAL_ADDRESSES');
        (token0, token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), 'UniswapV2Library: ZERO_ADDRESS');
    }

    function init() public {
        initERC20("AAA1","aaa1",10000000000000000000);
        initERC20("AAA2","aaa2",10000000000000000000);
        initERC20("AAA3","aaa3",10000000000000000000);
        initERC20("AAA4","aaa4",10000000000000000000);
        initERC20("AAA5","aaa5",10000000000000000000);
        initERC20("AAA6","aaa6",10000000000000000000);
        initERC20("AAA7","aaa7",10000000000000000000);
        initERC20("AAA8","aaa8",10000000000000000000);
        initERC20("AAA9","aaa9",10000000000000000000);
        initERC20("AAA10","aaa10",10000000000000000000);
    }

    // add liquity
    function test0() public returns(bool){
        (uint amountA, uint amountB, uint liquidity) = addLiquidity(0,1);
        require(amountA == 100000,"amount not eq!");
        return true;
    }

    // buy token
    function test1() public returns(bool){
        uint[] memory amounts = buyToken(0,1,100000);
        require(amounts[0]==100000,"buy token not eq!");
        uint[] memory amount2s = buyToken(1,0,100000);
        require(amount2s[0] == 100000,"buy token not eq!");
        return true;
    }

    function test2() public returns(bool){
        uint price1 = getTokenPrice(0,1);
        buyToken(0,1,100000);
        uint price2 = getTokenPrice(0,1);
        require(price1 != price2,"price must not eq!");
        return true;
    }

    // remove lq
    function test3()public returns(bool){
        uint pre_b1 = getTokenBalance(0);
        uint pre_b2 = getTokenBalance(1);
        (uint amountA, uint amountB) = removeLiquidity(0,1);

        uint cur_b1 = getTokenBalance(0);
        uint cur_b2 = getTokenBalance(1);
        require(pre_b1.add(amountA) == cur_b1,"token1 not eq!");
        require(pre_b2.add(amountB) == cur_b2,"token2 not eq!");
        return true;
    }

}