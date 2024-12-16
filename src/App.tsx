import React, { useState, useEffect } from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { ExternalProvider } from '@ethersproject/providers';
import DappInterface from './components/DappInterface';
import LandingPage from './components/LandingPage';
import Complex3DLoader from './components/Complex3DLoader';
import './App.css';

function getLibrary(provider: ExternalProvider): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [showDapp, setShowDapp] = useState(false);

  const handleLaunch = () => {
    setShowLanding(false);
    setShowLoading(true);
    
    // Ensure loading screen shows for at least 10 seconds
    setTimeout(() => {
      setShowLoading(false);
      setShowDapp(true);
    }, 10000);
  };

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      {showLanding && <LandingPage onLaunch={handleLaunch} />}
      {showLoading && <Complex3DLoader />}
      {showDapp && <DappInterface />}
    </Web3ReactProvider>
  );
}

export default App;
