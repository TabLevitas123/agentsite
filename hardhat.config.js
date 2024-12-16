require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");
require("hardhat-abi-exporter");
require("dotenv").config();

const config = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337
    }
  },
  paths: {
    sources: "./src/contracts",
    artifacts: "./src/contracts/artifacts",
    cache: "./src/contracts/cache",
    tests: "./src/contracts/test"
  },
  abiExporter: {
    path: './src/contracts',
    runOnCompile: true,
    clear: true,
    flat: true,
    only: ['AgentNFT', 'AGIToken'],
    spacing: 2,
    format: "json",
  }
};

module.exports = config;
