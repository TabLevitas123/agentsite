import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Complex3DLoader from './components/Complex3DLoader';
import DappInterface from './components/DappInterface';

function LandingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLaunchClick = () => {
    setIsLoading(true);
    // Simulate loading for demo
    setTimeout(() => {
      window.location.href = '/dapp';
    }, 3000);
  };

  const parallaxOffset = scrollPosition * 0.5;

  return (
    <div className="min-h-screen bg-dark-bg text-white overflow-x-hidden">
      {isLoading && <Complex3DLoader />}
      
      {/* Hero Section with Animated Background */}
      <div className="relative h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-green/10 via-transparent to-accent-violet/10 animate-pulse-slow" />
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(74, 222, 128, 0.1) 0%, transparent 50%)',
              transform: `translateY(${parallaxOffset}px)`
            }}
          />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-center gradient-text transform transition-all duration-700 hover:scale-105">
          Create Your AI Agent
        </h1>
        
        <p className="text-xl md:text-2xl mb-12 text-center max-w-3xl text-gray-300 leading-relaxed">
          Mint unique AI agents with customizable skills and capabilities. 
          Join the future of AI-powered NFTs on Solana.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 z-10">
          <button
            onClick={handleLaunchClick}
            className="px-12 py-6 bg-gradient-to-r from-accent-green to-accent-violet rounded-2xl text-2xl font-bold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-accent-green/20 relative overflow-hidden group"
          >
            <span className="relative z-10">LAUNCH DAPP</span>
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
          
          <button
            onClick={() => window.open('https://raydium.io', '_blank')}
            className="px-12 py-6 bg-dark-surface border-2 border-accent-green/30 rounded-2xl text-2xl font-bold transform hover:scale-105 transition-all duration-300 hover:border-accent-violet/50 relative overflow-hidden group"
          >
            <span className="relative z-10">Buy $AGI Now</span>
            <div className="absolute inset-0 bg-gradient-to-r from-accent-green/10 to-accent-violet/10 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>
        </div>
      </div>

      {/* Presale Benefits Section */}
      <div className="py-24 px-4 bg-dark-surface relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-violet/5 to-transparent" />
        <div className="max-w-7xl mx-auto relative">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center gradient-text">
            Limited Time Presale Benefits
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-dark-bg border-2 border-accent-green/20 hover:border-accent-green/40 transition-all duration-500 transform hover:-translate-y-2 group">
              <div className="flex flex-col h-full">
                <h3 className="text-3xl font-bold mb-4 text-accent-green group-hover:glow">Early Bird Pricing</h3>
                <p className="text-gray-300 mb-6 flex-grow">Get agent skills for just 0.002 ETH during presale, compared to 0.005 ETH at launch.</p>
                <div className="text-2xl font-bold text-accent-green/90">Save 60%</div>
              </div>
            </div>
            
            <div className="p-8 rounded-2xl bg-dark-bg border-2 border-accent-violet/20 hover:border-accent-violet/40 transition-all duration-500 transform hover:-translate-y-2 group">
              <div className="flex flex-col h-full">
                <h3 className="text-3xl font-bold mb-4 text-accent-violet group-hover:glow-violet">Bundle Discount</h3>
                <p className="text-gray-300 mb-6 flex-grow">Get all 23 pre-made skills for just 0.1 ETH - massive savings compared to individual pricing!</p>
                <div className="text-2xl font-bold text-accent-violet/90">Save 80%</div>
              </div>
            </div>
            
            <div className="p-8 rounded-2xl bg-dark-bg border-2 border-accent-green/20 hover:border-accent-green/40 transition-all duration-500 transform hover:-translate-y-2 group">
              <div className="flex flex-col h-full">
                <h3 className="text-3xl font-bold mb-4 text-accent-green group-hover:glow">Custom Skills</h3>
                <p className="text-gray-300 mb-6 flex-grow">Request custom skills for 0.1 ETH now, before price increases to 0.15 ETH at launch.</p>
                <div className="text-2xl font-bold text-accent-green/90">Save 33%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Showcase */}
      <div className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center gradient-text">
            Available Agent Skills
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              'Web Browsing', 'Google Search', 'PC Control', 'Mac Control',
              'Android Control', 'iPhone Control', 'iPad Control', 'Ubuntu Control',
              'Debian Control', 'Kali Linux Control', 'RedHat Control', 'NLP',
              'Synthetic Voice', 'Voice Cloning', 'Weather Lookup', 'GPS Tracking',
              'Media Conversion', 'Document Conversion', 'Amazon Shopping', 'Temu Shopping',
              'Walmart Shopping', 'JCPenny Shopping', 'Custom Skills'
            ].map((skill) => (
              <div key={skill} className="p-4 rounded-xl bg-dark-surface border border-accent-green/20 hover:border-accent-violet/30 transition-all duration-300 transform hover:-translate-y-1">
                <p className="text-center text-gray-300">{skill}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Marketplace Preview */}
      <div className="py-24 px-4 bg-dark-surface relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-accent-green/5 to-transparent" />
        <div className="max-w-7xl mx-auto relative">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center gradient-text">
            Coming Soon: Agent Marketplace
          </h2>
          
          <div className="p-10 rounded-2xl bg-dark-bg border-2 border-accent-violet/20 hover:border-accent-violet/40 transition-all duration-500">
            <h3 className="text-3xl font-bold mb-8 text-accent-violet">Lease Your Agents</h3>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  Generate passive income by leasing your custom-built agents to others. 
                  Keep 85% of all earnings while our platform handles the rest.
                </p>
                <ul className="space-y-4 text-gray-300">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent-violet rounded-full mr-3" />
                    Set your own rental rates
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent-violet rounded-full mr-3" />
                    Automated payments
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent-violet rounded-full mr-3" />
                    Secure agent deployment
                  </li>
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold text-accent-violet mb-4">85%</div>
                  <p className="text-gray-300">Revenue Share</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Token Distribution */}
      <div className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center gradient-text">
            Token Distribution
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="p-8 rounded-2xl bg-dark-surface border-2 border-accent-green/20 hover:border-accent-green/40 transition-all duration-500">
              <h3 className="text-3xl font-bold mb-6 text-accent-green">$AGI Token</h3>
              <p className="text-gray-300 text-lg mb-8">
                Agentic General Intelligence ($AGI) is the governance and utility token powering our ecosystem.
              </p>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent-green rounded-full mr-3" />
                  Total Supply: 100,000,000 $AGI
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent-green rounded-full mr-3" />
                  Initial Market Cap: TBA
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent-green rounded-full mr-3" />
                  Liquidity Lock: 90 days after 10M USDT mcap
                </li>
              </ul>
            </div>
            
            <div className="p-8 rounded-2xl bg-dark-surface border-2 border-accent-violet/20 hover:border-accent-violet/40 transition-all duration-500">
              <h3 className="text-3xl font-bold mb-6 text-accent-violet">Distribution</h3>
              <div className="space-y-6">
                {[
                  { label: 'Public Sale', value: '40%' },
                  { label: 'Development', value: '20%' },
                  { label: 'Marketing', value: '15%' },
                  { label: 'Team', value: '15%' },
                  { label: 'Advisors', value: '5%' },
                  { label: 'Community Rewards', value: '5%' }
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-gray-300">{item.label}</span>
                    <span className="text-xl font-bold text-accent-violet">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dapp" element={<DappInterface />} />
      </Routes>
    </Router>
  );
}

export default App;
