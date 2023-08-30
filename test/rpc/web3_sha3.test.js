const {ethers} = require("hardhat");
const {expect} = require("chai");


describe("web3_sha3", function () {

    it('no params ,should return failed(expected param 1)', async () => {
        try {
            await ethers.provider.send('web3_sha3', [])
        } catch (e) {
            console.log(e)
            return
        }
        expect('').to.be.include('failed')
    })

    it(' params 0x68656c6c6f20776f726c64 expected 0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad', async () => {
        let response = await ethers.provider.send('web3_sha3', ["0x68656c6c6f20776f726c64"])
        console.log(response)
        expect(response).to.be.equal('0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad')
    })
    it(' params is odd ,should failed ', async () => {
        try {
            await ethers.provider.send('web3_sha3', ["0x68656c6c6f20776f726c6"])
        } catch (e) {
            console.log('expected :', e)
            return
        }
        expect('').to.be.equal('failed')
    })
    it(' params is no 0x ,should failed ', async () => {
        try {
            await ethers.provider.send('web3_sha3', ["68656c6c6f20776f726c64"])
        } catch (error) {
            expect(error.message).to.include('invalid prefix');
        }
    })
})
