import React from 'react';
import { motion } from 'framer-motion';

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
        {selected ? 'Selected' : `${presalePrice} ETH`}
      </p>
    </motion.div>
  );
}

const presalePrice = 0.002;
const bundlePrice = 0.1;
const customSkillPrice = 0.1;

function DappInterface() {
  const [selectedSkills, setSelectedSkills] = React.useState<string[]>([]);
  const [customSkill, setCustomSkill] = React.useState('');
  const [agentName, setAgentName] = React.useState('');
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isMinting, setIsMinting] = React.useState(false);

  const handleSkillToggle = React.useCallback((skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  }, []);

  const handleImageSelect = (event: { target: HTMLInputElement }) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const calculateTotalCost = () => {
    if (selectedSkills.length === PREDEFINED_SKILLS.length) {
      return bundlePrice;
    }
    return selectedSkills.length * presalePrice;
  };

  const handleMint = async () => {
    if (!agentName || !selectedImage || selectedSkills.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    setIsMinting(true);
    try {
      // Simulated minting process
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Agent minted successfully!');
    } catch (error) {
      console.error('Minting error:', error);
      alert('Error minting agent');
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 gradient-text">Create Your Agent</h1>

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
            </div>
          </div>
        </div>

        {/* Skills Selection Section */}
        <div className="mb-12 bg-dark-surface p-6 rounded-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-accent-green">Select Skills</h2>
            <div className="text-right">
              <p className="text-sm text-gray-400">Selected: {selectedSkills.length}</p>
              <p className="text-lg font-bold gradient-text">
                Total: {calculateTotalCost()} ETH
              </p>
            </div>
          </div>

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

          {selectedSkills.length === PREDEFINED_SKILLS.length && (
            <div className="text-center p-4 bg-accent-green/10 rounded-lg">
              <p className="text-accent-green font-bold">
                Bundle discount applied! All skills for just {bundlePrice} ETH
              </p>
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
            
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-400">
                Custom skills are currently {customSkillPrice} ETH during presale
              </p>
              <button
                onClick={() => {
                  if (customSkill) {
                    alert('Custom skill request submitted!');
                    setCustomSkill('');
                  }
                }}
                disabled={!customSkill}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-accent-violet to-accent-green disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Request Custom Skill
              </button>
            </div>
          </div>
        </div>

        {/* Mint Button */}
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleMint}
            disabled={isMinting || !agentName || !selectedImage || selectedSkills.length === 0}
            className="px-12 py-4 rounded-xl bg-gradient-to-r from-accent-green to-accent-violet text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isMinting ? 'Minting...' : 'Mint Agent'}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default DappInterface;
