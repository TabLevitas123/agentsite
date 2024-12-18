import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import DappApp from './DappApp';
import reportWebVitals from './reportWebVitals';
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';

function getLibrary(provider: any) {
  return new ethers.providers.BaseProvider(provider);
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <DappApp />
    </Web3ReactProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
