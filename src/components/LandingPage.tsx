import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeb3React } from '@web3-react/core';
import { injected, getErrorMessage } from '../utils/web3';
import XSwap from './XSwap';
import NeuralBrainAnimation from './NeuralBrainAnimation';

const LandingPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { activate, active, account } = useWeb3React();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
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
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50"
          >
            <NeuralBrainAnimation />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="min-h-screen bg-dark-bg text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center p-6 min-h-screen relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-accent-red/10 to-transparent" />
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255, 0, 0, 0.1) 0%, transparent 50%)',
              animation: 'pulse 4s ease-in-out infinite'
            }}
          />
        </div>

        <div className="text-center mb-12 relative z-10">
          <motion.img
            src={`/logo.jpg?v=${Date.now()}`}
            alt="Bitcoin AI Logo"
            className="w-32 h-32 mx-auto mb-6 rounded-full shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          />
          <motion.h1 
            className="text-7xl font-bold mb-4 text-accent-red"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Bitcoin AI
          </motion.h1>
          <motion.p 
            className="text-2xl text-gray-400"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            The Future of Decentralized Bitcoin Intelligence
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

          <motion.div className="flex flex-col items-center gap-4">
            {!active && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={connectWallet}
                className="px-12 py-4 rounded-xl bg-gradient-to-r from-accent-red to-accent-crimson text-xl font-bold shadow-lg"
              >
                Connect MetaMask
              </motion.button>
            )}

            <motion.p
              className="text-lg text-gray-300 text-center mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              100% Fair Launch - 90% of Supply Locked in Uniswap V2
            </motion.p>

            <motion.button
              onClick={() => setShowSwapModal(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-800 text-xl font-bold shadow-lg shadow-red-500/20 flex flex-col items-center"
            >
              <span>BitcoinAI DEX</span>
              <span className="text-sm">BUY $BTCAI NOW</span>
            </motion.button>
          </motion.div>
          <div className="flex space-x-4 mt-4">
            <a href="https://X.com/BitcoinAI_ETH" target="_blank" rel="noopener noreferrer">
              <img src="/x-logo.svg" alt="X" className="w-8 h-8 rounded-full bg-dark-surface p-1.5" />
            </a>
            <a href="https://t.me/BitcoinAIOnETH" target="_blank" rel="noopener noreferrer">
              <img src="/telegram-logo.svg" alt="Telegram" className="w-8 h-8 rounded-full bg-dark-surface p-1.5" />
            </a>
            <a href="https://www.dextools.io/app/ether/pair-explorer/0xB1cA1e144d1e17911882a7c130f12839E8BCC313" target="_blank" rel="noopener noreferrer">
              <img src="/dextools-logo.svg" alt="Dextools" className="w-8 h-8 rounded-full bg-dark-surface p-1.5" />
            </a>
          </div>
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

      {/* Swap Modal */}
      <AnimatePresence>
        {showSwapModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-dark-surface p-6 rounded-xl max-w-md w-full relative"
            >
              <button
                onClick={() => setShowSwapModal(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <XSwap />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
    </>
  );
};

export default LandingPage;
