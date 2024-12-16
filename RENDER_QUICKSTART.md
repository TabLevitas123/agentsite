# Quick Start Guide: Deploying Your DApp to Render

This guide explains how to deploy the AgentX AI platform across two domains:
- Landing page at agentxai.io
- Dapp interface at agentxai.app

## Pre-Deployment Checklist

1. **Ensure Smart Contracts are Deployed**
   - Note down the deployed contract addresses for:
     * AGI Token: (from AGIToken.sol)
     * Agent NFT: (from AgentNFT.sol)

2. **Get Web3 Provider Keys**
   - Create an Infura or Alchemy account
   - Create a new project
   - Copy the project ID/key

## Step-by-Step Deployment

### 1. Push Code to GitHub
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Create Render Account
1. Visit [render.com](https://render.com)
2. Click "Sign Up"
3. Choose "Sign up with GitHub"
4. Authorize Render to access your repositories

### 3. Deploy Landing Page (agentxai.io)
1. In Render dashboard, click "New +"
2. Select "Static Site"
3. Choose your repository
4. Configure the following settings:

   ```
   Name: agentxai-landing (or your preferred name)
   Branch: main
   Root Directory: (leave empty)
   Build Command: npm install && npm run build
   Publish Directory: build
   ```

### 4. Deploy Dapp Interface (agentxai.app)
1. In Render dashboard, click "New +"
2. Select "Static Site"
3. Choose your repository
4. Configure the following settings:

   ```
   Name: agentxai-dapp (or your preferred name)
   Branch: main
   Root Directory: (leave empty)
   Build Command: npm install && npm run build:dapp
   Publish Directory: build
   ```

### 5. Environment Variables
Add these in Render dashboard (Settings → Environment) for **both** sites:

Required:
```
REACT_APP_INFURA_ID=your_infura_project_id
REACT_APP_CHAIN_ID=1
REACT_APP_AGI_TOKEN_ADDRESS=your_deployed_token_address
REACT_APP_AGENT_NFT_ADDRESS=your_deployed_nft_address
```

Optional (based on your needs):
```
REACT_APP_MAINNET_RPC_URL=https://mainnet.infura.io/v3/your_infura_id
REACT_APP_TESTNET_RPC_URL=https://sepolia.infura.io/v3/your_infura_id
REACT_APP_DEFAULT_NETWORK=mainnet
```

### 6. Advanced Build Settings
In the Render dashboard for **both** sites:
1. Go to your site's settings
2. Under "Build & Deploy":
   - Auto-Deploy: Yes
   - Build Command Timeout: 15 minutes
   - Pull Request Previews: Enable

## Testing Deployment

1. After deployment completes, Render will provide URLs:
   - Landing page: `https://your-landing-site.onrender.com`
   - Dapp interface: `https://your-dapp-site.onrender.com`
2. Test the following:
   - Both websites load correctly
   - Wallet connection works on the dapp
   - Smart contract interactions on the dapp
   - All components render properly

## Common Issues & Solutions

1. **Build Fails**
   - Check build logs in Render dashboard
   - Verify all environment variables are set
   - Ensure Node.js version is compatible (we've set >=16.0.0)

2. **Web3 Connection Issues**
   - Verify Infura/Alchemy key is correct
   - Check contract addresses are correct
   - Ensure chain ID matches your network

3. **Blank Page After Deploy**
   - Check browser console for errors
   - Verify build output in Render logs
   - Test locally with `npm run build && serve -s build` (for landing page)
   - Test locally with `npm run build:dapp && serve -s build` (for dapp)

## Next Steps

1. **Monitor Your Sites**
   - Check Render dashboard for build status
   - Monitor Web3 provider dashboard for API usage
   - Test on different networks (mainnet/testnet)

2. **Custom Domain (Optional)**
   - Follow the DOMAIN_TRANSFER_GUIDE.md for domain setup
   - Render provides free SSL certificates

3. **Scaling (If Needed)**
   - Start with free tier
   - Upgrade to Business plan ($20/month) if you need:
     * More build minutes
     * Faster builds
     * Priority support

## Support Resources
- Render Status: [status.render.com](https://status.render.com)
- Render Docs: [render.com/docs](https://render.com/docs)
- Discord: [render.com/discord](https://render.com/discord)

Remember: Keep your environment variables secure and never commit them to your repository. Use .env.example for documentation only.
