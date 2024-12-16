import React from 'react';
import { Web3ReactProvider, useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { ExternalProvider } from '@ethersproject/providers';
import { injected, getErrorMessage } from './utils/web3';
import DappInterface from './components/DappInterface';
import './App.css';

function getLibrary(provider: ExternalProvider): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function ConnectWallet() {
  const { activate, active, account } = useWeb3React();
  const [error, setError] = React.useState<string | null>(null);

  const connectWallet = async () => {
    try {
      await activate(injected);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err as Error));
    }
  };

  if (!active) {
    return (
      <div className="min-h-screen bg-dark-bg text-white flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-bold gradient-text mb-8">AgentX Platform</h1>
        {error && (
          <div className="text-red-500 bg-red-500/10 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}
        <button
          onClick={connectWallet}
          className="px-12 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 text-xl font-bold shadow-lg"
        >
          Connect MetaMask
        </button>
      </div>
    );
  }

  return <DappInterface />;
}

function DappApp() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ConnectWallet />
    </Web3ReactProvider>
  );
}

export default DappApp;
