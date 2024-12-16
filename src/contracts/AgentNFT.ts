import { AbiItem } from 'web3-utils';

export const AGENT_NFT_ADDRESS = process.env.REACT_APP_AGENT_NFT_ADDRESS;

export const AgentNFTAbi: AbiItem[] = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_agiToken",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_devWallet",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_ethUsdPriceFeed",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string[]",
        "name": "selectedItems",
        "type": "string[]"
      }
    ],
    "name": "AgentMinted",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "imageURI",
        "type": "string"
      },
      {
        "internalType": "string[]",
        "name": "initialSkills",
        "type": "string[]"
      },
      {
        "internalType": "string[]",
        "name": "selectedItems",
        "type": "string[]"
      }
    ],
    "name": "mintAgent",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "string[]",
        "name": "newSkills",
        "type": "string[]"
      }
    ],
    "name": "addSkills",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "skillDescription",
        "type": "string"
      }
    ],
    "name": "requestCustomSkill",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getAgent",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "imageURI",
        "type": "string"
      },
      {
        "internalType": "string[]",
        "name": "skills",
        "type": "string[]"
      },
      {
        "internalType": "string[]",
        "name": "customSkills",
        "type": "string[]"
      },
      {
        "internalType": "string[]",
        "name": "selectedItems",
        "type": "string[]"
      },
      {
        "internalType": "bool",
        "name": "isListed",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "leasePrice",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "currentLessee",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getEthUsdPrice",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "ethValue",
        "type": "uint256"
      }
    ],
    "name": "calculateAgiAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
