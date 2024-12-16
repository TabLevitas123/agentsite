# Pre-Deployment Checklist for DApp

## 1. Web3 Provider Setup

### Infura Setup (Recommended)
1. Visit [infura.io](https://infura.io)
2. Sign up for a free account
3. Create a new project:
   - Click "Create New Project"
   - Select "Web3 API" as project type
   - Name it "AgentSite" or your preferred name
4. Get your credentials:
   - Copy Project ID
   - Save endpoints for different networks

### Alternative: Alchemy Setup
1. Visit [alchemy.com](https://alchemy.com)
2. Sign up for a free account
3. Create a new app:
   - Click "Create App"
   - Choose network (Ethereum)
   - Select environment (Development/Production)
4. Get your credentials:
   - Copy API Key
   - Save HTTP and WebSocket endpoints

## 2. Smart Contract Deployment

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
   # Deploy to testnet
   npx hardhat run scripts/deploy.js --network sepolia
   ```

4. Verify Contracts:
   ```bash
   # Verify on Etherscan
   npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
   ```

### Production Deployment (When Ready)
1. Ensure contracts are audited
2. Have sufficient ETH for deployment
3. Follow same process but use mainnet configuration

## 3. Environment Setup

Create .env file with obtained credentials:
```
# Web3 Provider
REACT_APP_INFURA_ID=your_infura_project_id
REACT_APP_CHAIN_ID=11155111  # Sepolia testnet

# Contract Addresses (after deployment)
REACT_APP_AGI_TOKEN_ADDRESS=your_agi_token_address
REACT_APP_AGENT_NFT_ADDRESS=your_agent_nft_address
```

## 4. Testing Checklist

### Local Testing
1. Test contract deployment:
   ```bash
   npx hardhat test
   ```

2. Test frontend with local network:
   ```bash
   npx hardhat node
   npx hardhat run scripts/deploy.js --network localhost
   npm start
   ```

### Testnet Testing
1. Verify contract interactions
2. Test all DApp functions:
   - Wallet connection
   - Token operations
   - NFT minting
   - Error handling

## 5. Documentation Updates

1. Update README.md with:
   - Deployed contract addresses
   - Network information
   - Setup instructions

2. Document any configuration changes in:
   - Frontend code
   - Smart contracts
   - Deployment scripts

## Next Steps

Once you've completed this checklist:
1. Follow RENDER_QUICKSTART.md for Render deployment
2. Use DOMAIN_TRANSFER_GUIDE.md if setting up a custom domain

## Cost Considerations

### Development/Testing
- Infura/Alchemy: Free tier available
- Testnet deployment: Only gas fees (free testnet ETH)
- Local testing: Free

### Production
- Smart Contract Deployment: 
  * Gas fees vary (check [etherscan.io/gastracker](https://etherscan.io/gastracker))
  * Typically $50-200 per contract
- Infura/Alchemy Production Tier:
  * Free tier limits: 100K requests/day
  * Growth tier: ~$49/month
- Render Hosting:
  * Free tier available
  * Business tier: $20/month if needed

## Security Reminders

1. Never commit private keys or environment variables
2. Use .gitignore to exclude sensitive files
3. Keep backup of deployment information
4. Document all deployed contract addresses
5. Store private keys securely

---

After completing this checklist, you'll be ready to deploy your site to Render. Each step is crucial for a successful deployment, so ensure everything is properly set up and tested before proceeding.
