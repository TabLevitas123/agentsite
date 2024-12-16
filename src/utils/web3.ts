import { InjectedConnector } from '@web3-react/injected-connector';

// Supported chain IDs
const SUPPORTED_CHAIN_IDS = [1, 5]; // Ethereum Mainnet and Goerli

// Initialize injected (MetaMask) connector
export const injected = new InjectedConnector({
  supportedChainIds: SUPPORTED_CHAIN_IDS,
});

// Helper function to get wallet name
export const getWalletName = (connector: any): string => {
  if (connector instanceof InjectedConnector) return 'MetaMask';
  return 'Unknown Wallet';
};

// Helper function to handle wallet connection errors
export const getErrorMessage = (error: Error): string => {
  if (error.message.includes('No Ethereum provider')) {
    return 'No Ethereum wallet found. Please install MetaMask.';
  }
  if (error.message.includes('User rejected')) {
    return 'Please authorize this website to access your Ethereum account.';
  }
  return 'An error occurred. Please try again later.';
};
