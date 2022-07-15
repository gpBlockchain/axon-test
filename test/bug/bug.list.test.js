// const {ethers} = require("hardhat");
//
//
// describe("bug", function () {
//     this.timeout(600000)
//
//
//     // 账户的第一笔交易 nonce 不能为0 =》预期可以为0
//     it("1",async ()=>{
//
//     })
//     //pending的nonce 和 latest 不一致
//     it("0",async ()=>{
//
//     })
//
//     // 发送nonce > 当前的交易 会直接上链 =》预期在pending交易池中等待
//     it("2",async ()=>{
//         const testAccountAddress = await ethers.provider.getSigner(0).getAddress()
//         console.log("test address:",testAccountAddress)
//         // 查询账户nonce
//         let nonce = await ethers.provider.getTransactionCount(testAccountAddress)
//
//
//             // send  tx that nonce+100
//         let sendNonce = nonce +100;
//         try {
//             let tx =  await ethers.provider.getSigner(0).sendTransaction( {
//                 to: "0x0c1efcca2bcb65a532274f3ef24c044ef4ab6d73",
//                 value: "0x1",
//                 data:'0x',
//                 maxFeePerGas:"0x1111",
//                 maxPriorityFeePerGas:"0x1",
//                 nonce:sendNonce,
//             });
//             let response = await tx.wait(1)
//             console.log(response)
//         }catch (e){
//             return
//         }
//         expect("").to.be.equal("failed")
//
//
//         // 再次查询nonce
//     })
//
//     // 查询不存在账户的nonce 会报错 => 预期为0
//     it("3",async ()=>{
//
//     })
//
//     // 查询不存在账户的余额 会报错=》 预期为0
//     it("4",async ()=>{
//
//     })
//     // 发送esGas 遇到非法交易 =》 没有报错
//     it("5",async ()=>{
//
//     })
//     // 发送特别多log事件 ，交易丢失，日志一直刷[2022-06-27T14:59:51.741235+08:00 ERROR jsonrpsee_core::server::helpers] Error serializing response: Error("Memory capacity exceeded", line: 0, column: 0)
//     it("6",async ()=>{
//         await ethers.provider.send('')
//     })
//
//     //jsonRpcRequest: {
//     //   jsonrpc: '2.0',
//     //   method: 'eth_estimateGas',
//     //   params: [
//     //     {
//     //       maxFeePerGas: '0xffff',
//     //       maxPriorityFeePerGas: '0x1',
//     //       from: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
//     //       data: '0x9cb8a26a'
//     //     }
//     //   ],
//     //   id: 55
//     // }
//     // jsonRpcResponse: { jsonrpc: '2.0', result: '0xffffffffffffffff', id: 55 }
//     //eth_estimateGas gas is bad
//     it("ddd",async ()=>{
//
//         //
//         let contractName = "fallbackAndReceive"
//         let contractInfo = await ethers.getContractFactory(contractName);
//         // let nonceOfFrom = await getNonce(ethers.provider.getSigner(0).getAddress())
//         await contractInfo.deploy({
//             // maxFeePerGas: '0xffff',
//             // maxPriorityFeePerGas: '0x1',
//             // nonce: nonceOfFrom
//         })
//         // nonceOfFrom = await getNonce(ethers.provider.getSigner(0).getAddress())
//         // console.log(nonceOfFrom)
//         await contractInfo.deploy({
//             // maxFeePerGas: '0xffff',
//             // maxPriorityFeePerGas: '0x1',
//             // nonce: nonceOfFrom
//         })
//
//     })
// })