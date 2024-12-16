# Deployment Guide for AgentX AI Platform

This guide explains how to deploy the AgentX AI platform across two domains:
- Landing page at agentxai.io
- Dapp interface at agentxai.app

## Prerequisites

1. Namecheap account with both domains (agentxai.io and agentxai.app)
2. Render.com account
3. Node.js and npm installed locally
4. Infura account for Web3 provider
5. Deployed smart contracts (AGI Token and Agent NFT)

## Environment Setup

Create a `.env` file with the following variables:

### Required Variables
```
# Web3 Provider
REACT_APP_INFURA_ID=your_infura_project_id
REACT_APP_CHAIN_ID=1

# Smart Contract Addresses
REACT_APP_AGI_TOKEN_ADDRESS=your_agi_token_contract_address
REACT_APP_AGENT_NFT_ADDRESS=your_agent_nft_contract_address
```

### Optional Variables
```
# RPC URLs
REACT_APP_MAINNET_RPC_URL=https://mainnet.infura.io/v3/your_infura_id
REACT_APP_TESTNET_RPC_URL=https://sepolia.infura.io/v3/your_infura_id

# Network configurations
REACT_APP_DEFAULT_NETWORK=mainnet
REACT_APP_FALLBACK_NETWORK=sepolia

# IPFS Configuration
REACT_APP_IPFS_GATEWAY=https://ipfs.io/ipfs/

# Feature flags
REACT_APP_ENABLE_TESTNET=true
REACT_APP_ENABLE_WALLET_CONNECT=true
```

## Building the Projects

### Landing Page (agentxai.io)

1. Build the landing page:
```bash
npm run build
```
This will create a production build in the `build` directory.

### Dapp (agentxai.app)

1. Build the dapp:
```bash
npm run build:dapp
```
This will create a production build in the `build` directory optimized for the dapp interface.

## Deploying to Render

### Landing Page Deployment

1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Configure the build settings:
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`
4. Add environment variables from your `.env` file
5. Click "Create Static Site"

### Dapp Deployment

1. Create another Static Site on Render
2. Connect the same GitHub repository
3. Configure the build settings:
   - Build Command: `npm install && npm run build:dapp`
   - Publish Directory: `build`
4. Add environment variables from your `.env` file
5. Click "Create Static Site"

## Domain Configuration

### Namecheap DNS Settings for agentxai.io

1. Log in to your Namecheap account
2. Go to Domain List and select agentxai.io
3. Click "Manage"
4. Go to "Advanced DNS"
5. Add/Update these records:
   - Type: CNAME
   - Host: @
   - Value: [your-render-url].onrender.com
   - TTL: Automatic
6. Add another record:
   - Type: CNAME
   - Host: www
   - Value: [your-render-url].onrender.com
   - TTL: Automatic

### Namecheap DNS Settings for agentxai.app

1. Log in to your Namecheap account
2. Go to Domain List and select agentxai.app
3. Click "Manage"
4. Go to "Advanced DNS"
5. Add/Update these records:
   - Type: CNAME
   - Host: @
   - Value: [your-dapp-render-url].onrender.com
   - TTL: Automatic
6. Add another record:
   - Type: CNAME
   - Host: www
   - Value: [your-dapp-render-url].onrender.com
   - TTL: Automatic

## Render Domain Configuration

### For Landing Page (agentxai.io)

1. In your Render dashboard, select the landing page static site
2. Go to "Settings"
3. Scroll to "Custom Domains"
4. Click "Add Custom Domain"
5. Enter: agentxai.io
6. Follow Render's verification steps
7. Repeat for www.agentxai.io

### For Dapp (agentxai.app)

1. In your Render dashboard, select the dapp static site
2. Go to "Settings"
3. Scroll to "Custom Domains"
4. Click "Add Custom Domain"
5. Enter: agentxai.app
6. Follow Render's verification steps
7. Repeat for www.agentxai.app

## SSL Configuration

Render automatically provisions SSL certificates for your domains. Wait for the SSL certificates to be issued and active (this may take a few minutes).

## Verification

1. Visit https://agentxai.io to verify the landing page is working
2. Visit https://agentxai.app to verify the dapp is working
3. Test the "Launch Dapp" button on the landing page to ensure it correctly redirects to agentxai.app
4. Test wallet connection on agentxai.app
5. Verify Uniswap widget loads correctly in the DEX section
6. Test NFT creation interface functionality

## Troubleshooting

### DNS Issues
- DNS changes can take up to 48 hours to propagate
- Use https://dnschecker.org to verify DNS propagation
- Ensure all CNAME records are correctly set in Namecheap

### Build Issues
- Check Render build logs for any errors
- Verify environment variables are correctly set
- Ensure all dependencies are properly installed
- Check for any Web3 connection issues

### Smart Contract Issues
- Verify contract addresses are correct in environment variables
- Ensure contracts are deployed to the correct network
- Check for any ABI mismatches

### SSL Issues
- Wait for SSL certificates to be fully provisioned
- Verify DNS settings are correct
- Check for mixed content warnings in browser console

## Maintenance

### Updating the Sites

1. Push changes to your GitHub repository
2. Render will automatically rebuild and deploy both sites

### Monitoring

1. Use Render's built-in monitoring to track:
   - Build status
   - Deploy status
   - Site health
   - SSL certificate status

### Backup

1. Ensure your GitHub repository is regularly backed up
2. Keep local copies of all environment variables and configuration
3. Document any custom domain or DNS settings
4. Maintain backups of smart contract addresses and ABIs
