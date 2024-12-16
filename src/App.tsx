import React, { useState, useEffect } from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { ExternalProvider } from '@ethersproject/providers';
import DappInterface from './components/DappInterface';
import LandingPage from './components/LandingPage';
import Complex3DLoader from './components/Complex3DLoader';
import NeuralBrainAnimation from './components/NeuralBrainAnimation';
import './App.css';

function getLibrary(provider: ExternalProvider): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [showInitialLoading, setShowInitialLoading] = useState(true);
  const [showDappLoading, setShowDappLoading] = useState(false);
  const [showDapp, setShowDapp] = useState(false);

  // Initial page load animation (minimum 15 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInitialLoading(false);
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  const handleLaunch = () => {
    setShowLanding(false);
    setShowDappLoading(true);
    
    // Ensure dapp loading screen shows for at least 15 seconds
    setTimeout(() => {
      setShowDappLoading(false);
      setShowDapp(true);
    }, 15000);
  };

  // Show initial loading animation for first 15 seconds
  if (showInitialLoading) {
    return <Complex3DLoader />;
  }

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      {showLanding && <LandingPage onLaunch={handleLaunch} />}
      {showDappLoading && <NeuralBrainAnimation />}
      {showDapp && <DappInterface />}
    </Web3ReactProvider>
  );
}

export default App;
