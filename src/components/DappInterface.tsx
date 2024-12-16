import React from 'react';
import { motion } from 'framer-motion';
import { useWeb3React } from '@web3-react/core';
import { getWeb3, getAgentNFTContract, getAGITokenContract, uploadToIPFS } from '../utils/web3';
import Web3 from 'web3';

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

function DappInterface() {
  const { account, active } = useWeb3React<Web3>();
  const [selectedSkills, setSelectedSkills] = React.useState<string[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  const [customSkill, setCustomSkill] = React.useState('');
  const [agentName, setAgentName] = React.useState('');
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [isCreating, setIsCreating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = React.useState<string | null>(null);
  const [isApproved, setIsApproved] = React.useState(false);

  const handleSkillToggle = React.useCallback((skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  }, []);

  const handleItemToggle = React.useCallback((item: string) => {
    setSelectedItems(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  }, []);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size must be less than 10MB');
        return;
      }
      setSelectedImage(file);
      setError(null);
    }
  };

  const handleApproveAGI = async () => {
    if (!active || !account) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      const web3 = getWeb3();
      const agiContract = getAGITokenContract(web3);
      const agentContract = getAgentNFTContract(web3);

      // Calculate required AGI amount (0.01 ETH equivalent per item)
      const agiAmount = web3.utils.toWei(
        (selectedItems.length * 0.01).toString(),
        'ether'
      );

      setUploadProgress('Approving AGI token spending...');
      await agiContract.methods
        .approve(agentContract.options.address, agiAmount)
        .send({ from: account });

      setIsApproved(true);
      setUploadProgress('AGI token spending approved!');
    } catch (err) {
      console.error('Approval error:', err);
      setError(err instanceof Error ? err.message : 'Error approving AGI token');
    }
  };

  const handleCreateAgent = async () => {
    if (!active || !account) {
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

    if (!isApproved) {
      setError('Please approve AGI token spending first');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      // Upload image to IPFS
      setUploadProgress('Uploading image to IPFS...');
      const imageURI = await uploadToIPFS(selectedImage);

      // Get Web3 instance and contract
      setUploadProgress('Preparing transaction...');
      const web3 = getWeb3();
      const contract = getAgentNFTContract(web3);

      // Calculate ETH cost (0.03 ETH for custom skills)
      const ethCost = Web3.utils.toWei('0.03', 'ether');

      // Mint the agent NFT
      setUploadProgress('Waiting for wallet confirmation...');
      const tx = await contract.methods
        .mintAgent(agentName, imageURI, selectedSkills, selectedItems)
        .send({ 
          from: account, 
          value: ethCost,
          gas: '500000'
        });

      setUploadProgress('Transaction confirmed!');
      console.log('Transaction hash:', tx.transactionHash);

      // Reset form
      setAgentName('');
      setSelectedImage(null);
      setSelectedSkills([]);
      setSelectedItems([]);
      setCustomSkill('');
      setIsApproved(false);
      
      alert('Agent created successfully!');
    } catch (err) {
      console.error('Creation error:', err);
      setError(err instanceof Error ? err.message : 'Error creating agent');
    } finally {
      setIsCreating(false);
      setUploadProgress(null);
    }
  };

  const handleCustomSkillRequest = async () => {
    if (!active || !account) {
      setError('Please connect your wallet first');
      return;
    }

    if (!customSkill) {
      setError('Please describe your custom skill');
      return;
    }

    try {
      const web3 = getWeb3();
      const contract = getAgentNFTContract(web3);
      
      // Custom skill cost is 0.03 ETH
      const requestCost = Web3.utils.toWei('0.03', 'ether');

      await contract.methods
        .requestCustomSkill(customSkill)
        .send({
          from: account,
          value: requestCost,
          gas: '200000'
        });

      alert('Custom skill request submitted successfully!');
      setCustomSkill('');
    } catch (err) {
      console.error('Custom skill request error:', err);
      setError(err instanceof Error ? err.message : 'Error submitting custom skill request');
    }
  };

  const displayAddress = account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Not Connected';

  return (
    <div className="min-h-screen bg-dark-bg text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold gradient-text">Create Your Agent</h1>
          <div className="text-accent-green">
            {active ? `Connected: ${displayAddress}` : 'Not Connected'}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-500">
            {error}
          </div>
        )}

        {uploadProgress && (
          <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500 rounded-lg text-blue-500">
            {uploadProgress}
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
              <p className="text-xs text-gray-400 mt-2">Maximum file size: 10MB</p>
            </div>
          </div>
        </div>

        {/* Skills Selection Section */}
        <div className="mb-12 bg-dark-surface p-6 rounded-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-accent-green">Select Skills & Items</h2>
            <div className="text-sm text-gray-400">
              <p>Selected Items: {selectedItems.length} (Cost: {(selectedItems.length * 0.01).toFixed(3)} ETH in AGI)</p>
              <p>Custom Skills: 0.03 ETH</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {PREDEFINED_SKILLS.map((skill) => (
              <SkillCard
                key={skill}
                name={skill}
                selected={selectedItems.includes(skill)}
                onClick={() => handleItemToggle(skill)}
              />
            ))}
          </div>

          {selectedItems.length > 0 && !isApproved && (
            <div className="text-center mt-6">
              <button
                onClick={handleApproveAGI}
                disabled={isCreating}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-accent-violet to-accent-green disabled:opacity-50"
              >
                Approve AGI Token Spending
              </button>
            </div>
          )}
        </div>

        {/* Custom Skill Section */}
        <div className="mb-12 bg-dark-surface p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-6 text-accent-violet">Request Custom Skill</h2>
          
          <div className="space-y-4">
            <textarea
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-dark-bg border border-accent-violet/20 focus:border-accent-violet/40 focus:outline-none h-32"
              placeholder="Describe your custom skill requirement..."
            />
            
            <div className="flex justify-end">
              <button
                onClick={handleCustomSkillRequest}
                disabled={!customSkill || !active || isCreating}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-accent-violet to-accent-green disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Request Custom Skill (0.03 ETH)
              </button>
            </div>
          </div>
        </div>

        {/* Create Button */}
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateAgent}
            disabled={isCreating || !active || !agentName || !selectedImage || selectedItems.length === 0 || !isApproved}
            className="px-12 py-4 rounded-xl bg-gradient-to-r from-accent-green to-accent-violet text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? uploadProgress || 'Creating...' : 'Create Agent'}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default DappInterface;
