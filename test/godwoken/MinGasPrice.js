const { expect } = require("chai");
const { ethers } = require("hardhat");

const expectedValue = 10;
let ethCallContract;


const expectThrowsAsync = async (method, errMsgKeyWords, noErrMsgKeyWord) => {
  let error = null;
  try {
    await method();
  } catch (err) {
    error = err;
  }
  expect(error).to.be.an("Error");
  console.log(error.message);
  if (errMsgKeyWords) {
    for (keyWord of errMsgKeyWords) {
      expect(error.message).to.include(keyWord);
    }
  }
  if (noErrMsgKeyWord) {
    for (keyWord of noErrMsgKeyWord) {
      expect(error.message).to.not.include(keyWord);
    }
  }
};

describe("MIN GAS PRICE Test", function () {
  this.timeout(600000)

  before("Deploy and Set", async () => {
    const contractFact = await ethers.getContractFactory("CallTest");
    ethCallContract = await contractFact.deploy();
    await ethCallContract.deployed();
  });

  it("Eth_sendRawTransaction with no special gasPrice setting", async () => {
    const tx = await ethCallContract.set(expectedValue);
    await tx.wait();
    const receipt = await ethCallContract.provider.getTransactionReceipt(
      tx.hash
    );
    expect(receipt.status).to.equal(1);
  });

  it("Eth_sendRawTransaction with lower gasPrice", async () => {
    const p = new Array(1).fill(1).map(async () => {
      const errMsg = [
        "The transaction gas price is zero",
      ];
      const method = async () => {
        const tx = await ethCallContract.set(expectedValue, { gasPrice: 0 });
        await tx.wait();
      };
      await expectThrowsAsync(method, errMsg);
    });
    const ps = Promise.all(p);
    await ps;
  });
});

/**
 * How to run this?
 * > npx hardhat test test/EthCall --network gw_devnet_v1
 */
