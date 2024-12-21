import React from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { ExternalProvider } from '@ethersproject/providers';
import LandingPage from './components/LandingPage';
import './App.css';

function getLibrary(provider: ExternalProvider): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <LandingPage />
    </Web3ReactProvider>
  );
}

export default App;
