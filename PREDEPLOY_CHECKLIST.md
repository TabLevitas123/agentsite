# Pre-Deployment Checklist for AgentX Platform

## 1. Smart Contract Deployment

### Test Network Deployment (Recommended First)
1. Get test ETH:
   - Visit [sepoliafaucet.com](https://sepoliafaucet.com) for Sepolia testnet
   - Or [goerlifaucet.com](https://goerlifaucet.com) for Goerli testnet

2. Configure Hardhat:
   ```javascript
   // Update hardhat.config.js with your network settings
   networks: {
     sepolia: {
       url: `https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID`,
       accounts: [`0x${YOUR_PRIVATE_KEY}`]
     }
   }
   ```

3. Deploy Contracts:
   ```bash
   # Deploy AGI Token first
   npx hardhat run scripts/deploy.js --network sepolia
   
   # Note the deployed AGI token address
   
   # Deploy Agent NFT with AGI token address
   # Update deploy script with AGI token address before running
   npx hardhat run scripts/deploy.js --network sepolia
   ```

4. Verify Contracts:
   ```bash
   # Verify AGI Token
   npx hardhat verify --network sepolia AGI_TOKEN_ADDRESS
   
   # Verify Agent NFT
   npx hardhat verify --network sepolia AGENT_NFT_ADDRESS AGI_TOKEN_ADDRESS DEV_WALLET_ADDRESS ETH_USD_PRICE_FEED_ADDRESS
   ```

## 2. Web3 Provider Setup

### Infura Setup
1. Visit [infura.io](https://infura.io)
2. Create a new project for AgentX
3. Get your Project ID and endpoints
4. Save Mainnet and Testnet RPC URLs

## 3. Environment Variables

Create .env file with:
```bash
# Web3 Provider
REACT_APP_INFURA_ID=your_infura_project_id
REACT_APP_CHAIN_ID=1  # Mainnet: 1, Sepolia: 11155111

# Smart Contract Addresses
REACT_APP_AGI_TOKEN_ADDRESS=your_agi_token_contract_address
REACT_APP_AGENT_NFT_ADDRESS=your_agent_nft_contract_address

# RPC URLs
REACT_APP_MAINNET_RPC_URL=https://mainnet.infura.io/v3/your_infura_id
REACT_APP_TESTNET_RPC_URL=https://sepolia.infura.io/v3/your_infura_id

# Network Configuration
REACT_APP_DEFAULT_NETWORK=mainnet
REACT_APP_FALLBACK_NETWORK=sepolia

# IPFS Configuration
REACT_APP_IPFS_GATEWAY=https://ipfs.io/ipfs/

# Feature Flags
REACT_APP_ENABLE_TESTNET=true
REACT_APP_ENABLE_WALLET_CONNECT=true
```

## 4. Component Testing

### Smart Contract Testing
1. Test AGI Token contract:
   - Token minting
   - Token transfers
   - Allowances

2. Test Agent NFT contract:
   - NFT minting
   - Skill management
   - Custom skill requests
   - Price feed integration
   - AGI token integration

### Frontend Testing
1. DappInterface Component:
   - Wallet connection
   - Agent creation form
   - Image upload
   - Skill selection
   - Error handling
   - Success notifications

2. XSwap Component:
   - Uniswap widget loading
   - Token selection
   - Price quotes
   - Transaction handling

3. Visual Components:
   - Complex3DLoader animation
   - NeuralBrainAnimation
   - Responsive design
   - Dark mode styling

## 5. Build Testing

### Landing Page
```bash
npm run build
# Verify build output in build/
```

### Dapp Interface
```bash
npm run build:dapp
# Verify build output in build/
```

## 6. Final Checks

### Contract Verification
1. Verify all contract functions work as expected
2. Check contract addresses are correct in .env
3. Ensure price feeds are working
4. Verify AGI token integration

### Frontend Verification
1. Test wallet connections
2. Verify all images and assets load
3. Check Uniswap widget integration
4. Test responsive design
5. Verify all links and social media icons

### Security Checks
1. Environment variables are properly set
2. No private keys in codebase
3. Contract permissions are correct
4. Error handling is robust

## 7. Documentation Updates

1. Update contract addresses in documentation
2. Document any configuration changes
3. Update deployment guides if needed
4. Verify README accuracy

## Next Steps

After completing this checklist:
1. Follow DEPLOYMENT_GUIDE.md for Render deployment
2. Configure both domains (agentxai.io and agentxai.app)
3. Set up SSL certificates
4. Monitor initial deployment

## Cost Considerations

### Smart Contract Deployment
- AGI Token deployment: ~$50-100
- Agent NFT deployment: ~$100-200
- Contract verification: ~$5-10

### Infrastructure
- Infura: Free tier initially
- Render: Free tier available
- Domain names: ~$20-30/year each

## Security Reminders

1. Secure all private keys
2. Keep backup of deployment information
3. Document all contract addresses
4. Monitor contract events
5. Keep deployment credentials secure

---

Complete all items in this checklist before proceeding with deployment. Each component is critical for the platform's functionality.
