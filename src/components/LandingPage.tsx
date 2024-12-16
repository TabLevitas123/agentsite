import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeb3React } from '@web3-react/core';
import { injected, getErrorMessage } from '../utils/web3';

function LandingPage({ onLaunch }: { onLaunch: () => void }) {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { activate, active, account } = useWeb3React();

  useEffect(() => {
    // Track page load state
    const handleLoad = () => setPageLoaded(true);
    if (document.readyState === 'complete') {
      setPageLoaded(true);
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  const connectWallet = async () => {
    try {
      await activate(injected);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err as Error));
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-dark-bg text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    >
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center p-6 min-h-screen relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-accent-violet/10 to-transparent" />
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(74, 222, 128, 0.1) 0%, transparent 50%)',
              animation: 'pulse 4s ease-in-out infinite'
            }}
          />
        </div>

        <div className="text-center mb-12 relative z-10">
          <motion.img
            src="/logo.jpg"
            alt="Agent X AI Logo"
            className="w-32 h-32 mx-auto mb-6 rounded-full shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          />
          <motion.h1 
            className="text-7xl font-bold mb-4 gradient-text"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Agent X AI
          </motion.h1>
          <motion.p 
            className="text-2xl text-gray-400"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            The Future of Decentralized AI Agents
          </motion.p>
        </div>

        <motion.div 
          className="flex flex-col items-center gap-6 relative z-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          {error && (
            <div className="text-red-500 bg-red-500/10 p-4 rounded-lg mb-4">
              {error}
            </div>
          )}

          {!active ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={connectWallet}
              className="px-12 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 text-xl font-bold shadow-lg"
            >
              Connect MetaMask
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLaunch}
              className="px-12 py-4 rounded-xl bg-gradient-to-r from-accent-green to-accent-violet text-xl font-bold shadow-lg shadow-accent-green/20"
            >
              Launch Dapp
            </motion.button>
          )}

          <motion.a
            href="https://app.uniswap.org/#/swap"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-4 mt-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-xl font-bold shadow-lg shadow-purple-500/20"
          >
            BUY NOW ON  AI SWAP v2.0 
          </motion.a>
        </motion.div>

        {active && account && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-sm text-gray-400"
          >
            Connected: {account.slice(0, 6)}...{account.slice(-4)}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default LandingPage;
