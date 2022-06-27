require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
// var initHre = require("./hardhat/hardhat").initHre;

const INFURA_PROJECT_ID = "719d739434254b88ac95d53e2b6ac997";
/**
 * @type import('hardhat/config').HardhatUserConfig
 *
 * */
module.exports = {
    networks: {

        hardhat: {
            loggingEnabled: true,
            allowUnlimitedContractSize: true
        },

        axon_test: {
            url: 'http://127.0.0.1:8000',
            accounts: {
                mnemonic: "test test test test test test test test test test test junk",
                path: "m/44'/60'/0'/0",
                initialIndex: 0,
                count: 20,
                passphrase: "",
            },
        },
    },
    //bsc_test
    defaultNetwork:"axon_test",
    // defaultNetwork: "gw_alphanet_v1", //gw_local_kit_net_v1 gw_testnet_v11
    // defaultNetwork: "rinkeby",
    // defaultNetwork: "gw_local_kit_net_v1",
    solidity: {
        compilers: [
            { // for polyjuice contracts
                version: "0.6.6",
                settings: {}
            },
            {version: "0.4.24"},
            {version: "0.5.14"},
            {version: "0.6.12"},
            {version: "0.7.3"},
            {version: "0.7.5"},
            {version: "0.8.4"},
            {version: "0.8.6"}

        ], overrides: {},
        settings: {
            optimizer: {
                enabled: true,
                runs: 2000
            }
        },
        allowUnlimitedContractSize :true
    },
    mocha: {
        /** Reporter name or constructor. */
        reporter: "mochawesome"
        // timeout: 5000000,
        // /** Reporter settings object. */
        // reporterOptions: {
        //     output: "test-results-1.json"
        // },
        // reporterOptions: {
        //     reportFilename: "[status]_[datetime]-[name]-report",
        //     timestamp: "longDate"
        // }
        // mochawesome:{
        //     reporterOptions: {
        //         reportFilename: "[status]_[datetime]-[name]-report",
        //         timestamp: "longDate"
        //     }
        // }

    }
};