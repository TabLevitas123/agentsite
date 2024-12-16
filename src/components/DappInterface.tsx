import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import XSwap from './XSwap';

interface NFT {
  id: number;
  name: string;
  image: string;
  skills: string[];
  timestamp: number;
}

const PREDEFINED_SKILLS = [
  'Web Browsing',
  'Google Search',
  'PC Control',
  'Mac Control',
  'Android Phone Control',
  'Android Tablet Control',
  'iPhone Control',
  'iPad Control',
  'Ubuntu Control',
  'Debian Control',
  'Kali Linux Control',
  'RedHat Linux Control',
  'Natural Language Processing',
  'Synthetic Voice',
  'Voice Cloning',
  'Weather Lookup',
  'GPS Object Tracking',
  'Media File Conversion',
  'Document File Conversion',
  'Amazon Shopping',
  'Temu Shopping',
  'Walmart Shopping',
  'JCPenney Shopping'
];

type SkillCardProps = {
  name: string;
  selected: boolean;
  onClick: () => void;
}

function SkillCard({ name, selected, onClick }: SkillCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
        selected 
          ? 'bg-gradient-to-r from-accent-green to-accent-violet border-none'
          : 'bg-dark-surface border border-accent-green/20 hover:border-accent-violet/40'
      }`}
    >
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-sm text-gray-400 mt-2">
        {selected ? 'Selected' : 'Click to select'}
      </p>
    </motion.div>
  );
}

const injected = new InjectedConnector({
  supportedChainIds: [1, 5, 11155111] // Mainnet, Goerli, Sepolia
});

function DappInterface() {
  const [activeTab, setActiveTab] = useState<'create' | 'swap'>('create');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [agentName, setAgentName] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [recentNFTs, setRecentNFTs] = useState<NFT[]>([]);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const { account, activate } = useWeb3React();

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size must be less than 10MB');
        return;
      }
      setSelectedImage(file);
      setError(null);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateAgent = async () => {
    if (!account) {
      setError('Please connect your wallet first');
      return;
    }

    if (!agentName || !selectedImage || selectedSkills.length === 0) {
      setError('Please fill in all required fields');
      return;
    }

    if (selectedSkills.length > 50) {
      setError('Maximum 50 skills allowed');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      // Create new NFT object
      const newNFT: NFT = {
        id: Date.now(),
        name: agentName,
        image: imagePreviewUrl || '',
        skills: selectedSkills,
        timestamp: Date.now()
      };

      // Add to recent NFTs, keeping only the 10 most recent
      setRecentNFTs(prev => [newNFT, ...prev].slice(0, 10));

      // Reset form
      setAgentName('');
      setSelectedImage(null);
      setSelectedSkills([]);
      setImagePreviewUrl(null);
      
      // Show success popup
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error('Creation error:', err);
      setError(err instanceof Error ? err.message : 'Error creating agent');
    } finally {
      setIsCreating(false);
    }
  };

  const handleConnectWallet = async () => {
    try {
      await activate(injected);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setError('Failed to connect wallet. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with Tab Navigation */}
        <div className="flex flex-col mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold gradient-text">AgentX Platform</h1>
            <div className="flex space-x-4">
              <a href="https://X.com/AgentXAI_ETH" target="_blank" rel="noopener noreferrer">
                <img src="/x-logo.svg" alt="X" className="w-8 h-8 rounded-full bg-dark-surface p-1.5" />
              </a>
              <a href="https://t.me/AgentXAIOnETH" target="_blank" rel="noopener noreferrer">
                <img src="/telegram-logo.svg" alt="Telegram" className="w-8 h-8 rounded-full bg-dark-surface p-1.5" />
              </a>
            </div>
          </div>
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('create')}
              className={`px-6 py-3 rounded-xl text-lg font-bold shadow-lg ${
                activeTab === 'create'
                  ? 'bg-gradient-to-r from-accent-green to-accent-violet'
                  : 'bg-dark-surface hover:bg-dark-surface/80'
              }`}
            >
              Create Agent
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('swap')}
              className={`px-6 py-3 rounded-xl text-lg font-bold shadow-lg ${
                activeTab === 'swap'
                  ? 'bg-gradient-to-r from-accent-green to-accent-violet'
                  : 'bg-dark-surface hover:bg-dark-surface/80'
              } flex flex-col items-center`}
            >
              <span>AGENT DEX</span>
              <span className="text-sm">BUY $AGENTX NOW</span>
            </motion.button>
          </div>
        </div>

        {/* Connect Wallet Button */}
        {!account && (
          <div className="mb-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConnectWallet}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-accent-green to-accent-violet text-lg font-bold shadow-lg"
            >
              Connect Wallet
            </motion.button>
          </div>
        )}

        {/* Connected Account Display */}
        {account && (
          <div className="mb-6 p-4 bg-dark-surface rounded-lg">
            <p className="text-sm text-gray-400">
              Connected: {account.slice(0, 6)}...{account.slice(-4)}
            </p>
          </div>
        )}

        {activeTab === 'create' ? (
          <>
            {/* Top Agents Section */}
            <div className="mb-8 bg-dark-surface p-6 rounded-xl">
              <h2 className="text-2xl font-bold text-accent-green mb-4">TOP AGENTS</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentNFTs.map((nft) => (
                  <div key={nft.id} className="bg-dark-bg p-4 rounded-lg border border-accent-green/20">
                    <img 
                      src={nft.image} 
                      alt={nft.name} 
                      className="w-full h-48 object-cover rounded-lg mb-3"
                    />
                    <h3 className="text-lg font-semibold mb-2">{nft.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {nft.skills.slice(0, 3).map((skill, i) => (
                        <span 
                          key={i}
                          className="text-xs px-2 py-1 rounded-full bg-accent-violet/20 text-accent-violet"
                        >
                          {skill}
                        </span>
                      ))}
                      {nft.skills.length > 3 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-accent-green/20 text-accent-green">
                          +{nft.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-500">
                {error}
              </div>
            )}

            {/* Agent Details Section */}
            <div className="mb-12 bg-dark-surface p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-6 text-accent-green">Agent Details</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Agent Name</label>
                  <input
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-dark-bg border border-accent-green/20 focus:border-accent-violet/40 focus:outline-none"
                    placeholder="Enter agent name"
                    maxLength={100}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Agent Image</label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => document.getElementById('imageInput')?.click()}
                      className="px-4 py-2 rounded-lg bg-dark-bg border border-accent-green/20 hover:border-accent-violet/40 transition-all duration-300"
                    >
                      Choose Image
                    </button>
                    {selectedImage && (
                      <span className="text-sm text-gray-400">
                        {selectedImage.name}
                      </span>
                    )}
                    <input
                      id="imageInput"
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </div>
                  {imagePreviewUrl && (
                    <img 
                      src={imagePreviewUrl} 
                      alt="Preview" 
                      className="mt-4 max-w-xs rounded-lg"
                    />
                  )}
                  <p className="text-xs text-gray-400 mt-2">Maximum file size: 10MB</p>
                </div>
              </div>
            </div>

            {/* Skills Selection Section */}
            <div className="mb-12 bg-dark-surface p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-6 text-accent-green">Select Skills</h2>
              <p className="text-gray-400 mb-4">Each skill costs the equivalent of 20 USDT. Custom skill requests cost 100 USDT. Be inventive! Agents can accomplish almost anything as long as it's within the digital world.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {PREDEFINED_SKILLS.map((skill) => (
                  <SkillCard
                    key={skill}
                    name={skill}
                    selected={selectedSkills.includes(skill)}
                    onClick={() => handleSkillToggle(skill)}
                  />
                ))}
              </div>
            </div>

            {/* Create Button */}
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateAgent}
                disabled={isCreating || !agentName || !selectedImage || selectedSkills.length === 0}
                className="px-12 py-4 rounded-xl bg-gradient-to-r from-accent-green to-accent-violet text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? 'Creating...' : 'Create Agent'}
              </motion.button>
            </div>
          </>
        ) : (
          <div className="bg-dark-surface p-6 rounded-xl">
            <XSwap />
          </div>
        )}
      </div>

      {/* Success Popup */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 bg-accent-green text-white px-6 py-4 rounded-lg shadow-lg"
          >
            NFT Successfully Created!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DappInterface;
