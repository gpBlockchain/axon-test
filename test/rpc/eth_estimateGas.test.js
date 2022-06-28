const {ethers} = require("hardhat");
const {expect} = require("chai");


describe("eth_estimateGas", function () {

    it("failed tx", async () => {

        try {
            let estimateGas = await ethers.provider.send('eth_estimateGas',
                [{
                    data: '0x9cb8a26a'
                }])
            console.log('estimateGas:',estimateGas)
        }catch (e){
            return
        }
        expect("").to.be.equal('failed')



    })

})
