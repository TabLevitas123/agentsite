import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeb3React } from '@web3-react/core';
import { injected, walletconnect } from '../utils/web3';
import Complex3DLoader from './Complex3DLoader';

function LandingPage({ onLaunch }: { onLaunch: () => void }) {
  const { activate, active, account, deactivate } = useWeb3React();
  const [connecting, setConnecting] = React.useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Hide loader after 3 seconds
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const connectWallet = async (connector: any) => {
    try {
      setConnecting(true);
      await activate(connector);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = () => {
    try {
      deactivate();
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <>
      <AnimatePresence>
        {showLoader && <Complex3DLoader />}
      </AnimatePresence>
      
      <motion.div 
        className="min-h-screen bg-dark-bg text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: showLoader ? 0 : 1 }}
        transition={{ duration: 1 }}
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
            <motion.h1 
              className="text-7xl font-bold mb-4 gradient-text"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 3.2, duration: 0.8 }}
            >
              Agentic General Intelligence
            </motion.h1>
            <motion.p 
              className="text-2xl text-gray-400"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 3.4, duration: 0.8 }}
            >
              The Future of Decentralized AI Agents
            </motion.p>
          </div>

          <motion.div 
            className="flex flex-col items-center gap-6 relative z-10"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 3.6, duration: 0.8 }}
          >
            {!active ? (
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => connectWallet(injected)}
                  disabled={connecting}
                  className="px-8 py-3 rounded-lg bg-gradient-to-r from-accent-green to-accent-violet font-bold disabled:opacity-50 shadow-lg shadow-accent-green/20"
                >
                  Connect MetaMask
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => connectWallet(walletconnect)}
                  disabled={connecting}
                  className="px-8 py-3 rounded-lg bg-gradient-to-r from-accent-violet to-accent-green font-bold disabled:opacity-50 shadow-lg shadow-accent-violet/20"
                >
                  WalletConnect
                </motion.button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-accent-green font-mono">
                    {account?.slice(0, 6)}...{account?.slice(-4)}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={disconnectWallet}
                    className="px-4 py-2 rounded-lg bg-dark-surface border border-accent-violet/40 font-bold glass"
                  >
                    Disconnect
                  </motion.button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onLaunch}
                  className="px-12 py-4 rounded-xl bg-gradient-to-r from-accent-green to-accent-violet text-xl font-bold shadow-lg shadow-accent-green/20"
                >
                  Launch Dapp
                </motion.button>
              </div>
            )}
            
            <motion.a
              href="https://app.uniswap.org/#/swap"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-4 mt-8 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-xl font-bold shadow-lg shadow-purple-500/20"
            >
              BUY NOW
            </motion.a>
          </motion.div>
        </div>

        {/* Rest of the sections with enhanced styling */}
        <motion.section 
          id="about" 
          className="py-20 px-6 bg-dark-surface relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-accent-green/5 to-accent-violet/5" />
          <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="text-5xl font-bold mb-8 gradient-text">What is $AGI?</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              Agentic General Intelligence ($AGI) is a revolutionary project at the intersection of blockchain technology and artificial intelligence. Our platform enables the creation and deployment of autonomous AI agents in a decentralized ecosystem, powered by the $AGI token. These agents can perform complex tasks, learn from interactions, and evolve over time, all while maintaining decentralization and user sovereignty.
            </p>
          </div>
        </motion.section>

        {/* Why $AGI Section */}
        <motion.section 
          id="why" 
          className="py-20 px-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold mb-8 gradient-text">Why $AGI?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div 
                className="bg-dark-surface p-8 rounded-lg glass card-hover"
                whileHover={{ y: -5 }}
              >
                <h3 className="text-2xl font-bold mb-4 gradient-text">Decentralized AI</h3>
                <p className="text-gray-300">Break free from centralized AI systems and embrace true ownership of your AI agents.</p>
              </motion.div>
              <motion.div 
                className="bg-dark-surface p-8 rounded-lg glass card-hover"
                whileHover={{ y: -5 }}
              >
                <h3 className="text-2xl font-bold mb-4 gradient-text">Community Governed</h3>
                <p className="text-gray-300">DAO activation at 20M USDT market cap ensures community-driven development.</p>
              </motion.div>
              <motion.div 
                className="bg-dark-surface p-8 rounded-lg glass card-hover"
                whileHover={{ y: -5 }}
              >
                <h3 className="text-2xl font-bold mb-4 gradient-text">Secure Architecture</h3>
                <p className="text-gray-300">Multi-signature setup and robust smart contracts protect your assets.</p>
              </motion.div>
              <motion.div 
                className="bg-dark-surface p-8 rounded-lg glass card-hover"
                whileHover={{ y: -5 }}
              >
                <h3 className="text-2xl font-bold mb-4 gradient-text">Fair Distribution</h3>
                <p className="text-gray-300">Balanced token allocation ensures long-term sustainability and growth.</p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Tokenomics Section */}
        <motion.section 
          id="tokenomics" 
          className="py-20 px-6 bg-dark-surface"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold mb-8 gradient-text">Tokenomics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-dark-bg p-8 rounded-lg glass">
                <h3 className="text-2xl font-bold mb-4 gradient-text">Token Distribution</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent-green"></span>
                    Team: 15%
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent-violet"></span>
                    Marketing: 10%
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                    Liquidity: 25%
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    User Rewards: 20%
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Staking: 20%
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    Open Sale: 10%
                  </li>
                </ul>
              </div>
              <div className="bg-dark-bg p-8 rounded-lg glass">
                <h3 className="text-2xl font-bold mb-4 gradient-text">Transaction Tax (3.5%)</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent-green"></span>
                    Marketing: 1%
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent-violet"></span>
                    Development: 1%
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                    Liquidity: 1%
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    Burn: 0.5%
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-dark-bg p-8 rounded-lg glass">
              <h3 className="text-2xl font-bold mb-4 gradient-text">Limits</h3>
              <p className="text-gray-300 space-y-2">
                <span className="block">Maximum transaction: 1,000,000 $AGI</span>
                <span className="block">Maximum wallet: 2,000,000 $AGI</span>
                <span className="block">Total Supply: 100,000,000 $AGI</span>
              </p>
            </div>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section 
          id="faq" 
          className="py-20 px-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold mb-8 gradient-text">FAQ</h2>
            <div className="space-y-6">
              <motion.div 
                className="bg-dark-surface p-8 rounded-lg glass card-hover"
                whileHover={{ y: -5 }}
              >
                <h3 className="text-2xl font-bold mb-2 gradient-text">What is the DAO activation threshold?</h3>
                <p className="text-gray-300">The DAO becomes active once we reach a market cap of 20,000,000 USDT.</p>
              </motion.div>
              <motion.div 
                className="bg-dark-surface p-8 rounded-lg glass card-hover"
                whileHover={{ y: -5 }}
              >
                <h3 className="text-2xl font-bold mb-2 gradient-text">How is ownership managed?</h3>
                <p className="text-gray-300">Through a secure multi-signature setup ensuring decentralized control.</p>
              </motion.div>
              <motion.div 
                className="bg-dark-surface p-8 rounded-lg glass card-hover"
                whileHover={{ y: -5 }}
              >
                <h3 className="text-2xl font-bold mb-2 gradient-text">What are the transaction limits?</h3>
                <p className="text-gray-300">Maximum 1,000,000 $AGI per transaction and 2,000,000 $AGI per wallet.</p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Contact Form */}
        <motion.section 
          id="contact" 
          className="py-20 px-6 bg-dark-surface"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold mb-8 gradient-text">Contact Us</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 rounded-lg bg-dark-bg border border-accent-violet/40 text-white glass focus:border-accent-green focus:ring-1 focus:ring-accent-green transition-colors"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 rounded-lg bg-dark-bg border border-accent-violet/40 text-white glass focus:border-accent-green focus:ring-1 focus:ring-accent-green transition-colors"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-dark-bg border border-accent-violet/40 text-white glass focus:border-accent-green focus:ring-1 focus:ring-accent-green transition-colors"
                  required
                ></textarea>
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-accent-green to-accent-violet font-bold shadow-lg shadow-accent-green/20"
              >
                Send Message
              </motion.button>
            </form>
          </div>
        </motion.section>
      </motion.div>
    </>
  );
}

export default LandingPage;
