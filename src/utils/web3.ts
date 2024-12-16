import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { AgentNFTAbi, AGENT_NFT_ADDRESS } from '../contracts/AgentNFT';
import { AGITokenAbi, AGI_TOKEN_ADDRESS } from '../contracts/AGIToken';

// Supported chain IDs
const SUPPORTED_CHAIN_IDS = [1, 5]; // Ethereum Mainnet and Goerli

if (!process.env.REACT_APP_INFURA_ID) {
  throw new Error('Missing INFURA_ID environment variable');
}

if (!AGENT_NFT_ADDRESS) {
  throw new Error('Missing AGENT_NFT_ADDRESS environment variable');
}

if (!AGI_TOKEN_ADDRESS) {
  throw new Error('Missing AGI_TOKEN_ADDRESS environment variable');
}

// RPC URLs
const RPC_URLS: { [chainId: number]: string } = {
  1: `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`,
  5: `https://goerli.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`,
};

// MetaMask connector
export const injected = new InjectedConnector({
  supportedChainIds: SUPPORTED_CHAIN_IDS,
});

// WalletConnect connector
export const walletconnect = new WalletConnectConnector({
  rpc: RPC_URLS,
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
});

// Web3 instance
export const getWeb3 = () => {
  return new Web3(Web3.givenProvider || RPC_URLS[1]);
};

// Contract instances
export const getAgentNFTContract = (web3: Web3) => {
  return new web3.eth.Contract(
    AgentNFTAbi as AbiItem[],
    AGENT_NFT_ADDRESS
  );
};

export const getAGITokenContract = (web3: Web3) => {
  return new web3.eth.Contract(
    AGITokenAbi as AbiItem[],
    AGI_TOKEN_ADDRESS
  );
};

// Helper function to upload to IPFS
export const uploadToIPFS = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.REACT_APP_PINATA_JWT}`
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error('Failed to upload to IPFS');
  }

  const data = await response.json();
  return `ipfs://${data.IpfsHash}`;
};
