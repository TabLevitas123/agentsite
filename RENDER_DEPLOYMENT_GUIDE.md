# Comprehensive Guide to Deploying DApp on Render

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Cost Breakdown](#cost-breakdown)
3. [Repository Preparation](#repository-preparation)
4. [Render Account Setup](#render-account-setup)
5. [Deployment Process](#deployment-process)
6. [Environment Configuration](#environment-configuration)
7. [Post-Deployment Steps](#post-deployment-steps)
8. [Maintenance & Monitoring](#maintenance--monitoring)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Tools
- Git installed locally
- Node.js version 16+ installed
- npm or yarn package manager
- A GitHub/GitLab account
- Smart contracts already deployed to desired network
- Web3 provider (e.g., Infura/Alchemy) account and API keys

### Local Testing
Before deploying, ensure:
1. Run `npm install` successfully completes
2. `npm run build` creates a working build
3. All environment variables are documented
4. Smart contract ABIs are included in the build

## Cost Breakdown

### Free Tier Includes
- Static site hosting
- SSL certificate
- Global CDN
- Unlimited bandwidth
- 100 GB/month storage
- Automatic deployments from Git
- Custom domains
- DDoS protection

### Paid Features (Business Plan - $20/month)
- Increased build minutes (400 mins/month vs 100 mins/month on free tier)
- Priority support
- Larger teams support
- Advanced security features
- Zero-downtime deploys

### Additional Costs to Consider
1. Domain name (if custom domain needed): $10-15/year
2. Web3 Infrastructure:
   - Infura/Alchemy costs for API calls
   - Gas fees for contract deployment/interaction
3. IPFS hosting (if used): 
   - Pinata: $20/month for 50GB
   - Or Infura IPFS: Free tier available

## Repository Preparation

### 1. Build Configuration
Ensure package.json has correct scripts:
\`\`\`json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
\`\`\`

### 2. Environment Variables
1. Create a `.env.example` file:
\`\`\`
REACT_APP_INFURA_ID=your_infura_id
REACT_APP_CHAIN_ID=1
REACT_APP_AGI_TOKEN_ADDRESS=your_token_address
REACT_APP_AGENT_NFT_ADDRESS=your_nft_address
\`\`\`

### 3. Git Configuration
1. Update `.gitignore`:
\`\`\`
node_modules/
build/
.env
.env.local
.DS_Store
coverage/
\`\`\`

2. Ensure all changes are committed:
\`\`\`bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
\`\`\`

## Render Account Setup

### 1. Account Creation
1. Visit [render.com](https://render.com)
2. Click "Sign Up"
3. Choose "Sign up with GitHub" (recommended) or email
4. Verify email if using email signup
5. Complete 2FA setup (recommended)

### 2. Billing Setup (Optional for Free Tier)
1. Navigate to Billing Settings
2. Add payment method
3. Select desired plan (Free tier is sufficient to start)

## Deployment Process

### 1. New Site Creation
1. Click "New +" in dashboard
2. Select "Static Site"
3. Connect GitHub/GitLab repository
   - Grant necessary permissions
   - Select repository

### 2. Configuration Settings
Configure the following exactly:

1. **Name**: Choose a unique name (will be part of your URL)
2. **Branch**: main (or your default branch)
3. **Root Directory**: Leave empty if project is at root
4. **Build Command**: `npm run build`
5. **Publish Directory**: `build`
6. **Auto-Deploy**: Enable

### 3. Advanced Settings
1. Set Node version:
   - Add "engines" to package.json:
   \`\`\`json
   {
     "engines": {
       "node": ">=16.0.0"
     }
   }
   \`\`\`

2. Build Settings:
   - Build Command Timeout: 15 minutes (default)
   - Auto-Deploy: Yes
   - Pull Request Previews: Enable

## Environment Configuration

### 1. Environment Variables Setup
Add these in Render dashboard:
1. `REACT_APP_INFURA_ID`
2. `REACT_APP_CHAIN_ID`
3. `REACT_APP_AGI_TOKEN_ADDRESS`
4. `REACT_APP_AGENT_NFT_ADDRESS`

### 2. Domain Configuration
Free subdomain: `[your-site-name].onrender.com`

For custom domain:
1. Click "Custom Domain"
2. Add your domain
3. Configure DNS:
   - Type: CNAME
   - Name: www
   - Value: `[your-site-name].onrender.com`
   - TTL: 3600

## Post-Deployment Steps

### 1. Verification
1. Check build logs for errors
2. Verify site loads at provided URL
3. Test Web3 connectivity:
   - Wallet connection
   - Contract interactions
   - Transaction signing

### 2. Performance Testing
1. Run Lighthouse audit
2. Check page load times
3. Verify CDN distribution

### 3. Security Verification
1. SSL certificate status
2. CORS settings
3. Environment variables visibility

## Maintenance & Monitoring

### 1. Regular Checks
- Monitor build logs weekly
- Check deployment status after pushes
- Review usage metrics monthly

### 2. Updates
- Keep dependencies updated
- Monitor smart contract changes
- Update environment variables as needed

### 3. Backup Strategy
- Maintain local backups
- Document configuration
- Keep deployment logs

## Troubleshooting

### Common Issues

1. Build Failures
   - Check Node version
   - Verify dependencies
   - Review build logs
   - Check environment variables

2. Performance Issues
   - Review bundle size
   - Check image optimization
   - Verify CDN usage

3. Web3 Connection Issues
   - Verify RPC endpoints
   - Check contract addresses
   - Monitor API rate limits

### Support Resources
- Render Documentation: [docs.render.com](https://docs.render.com)
- Discord Community: [render.com/discord](https://render.com/discord)
- Email Support: support@render.com

---

## Monthly Cost Summary

### Minimum Setup (Free Tier)
- Static Site Hosting: $0
- SSL Certificate: $0
- CDN: $0
- Build Minutes (100/month): $0
- Total: $0/month

### Recommended Setup (Business Tier)
- Business Plan: $20/month
- Custom Domain: ~$1/month (yearly payment)
- Web3 Infrastructure:
  * Infura Growth Plan: $49/month
  * Or Alchemy Growth Plan: $49/month
- IPFS (Optional):
  * Pinata: $20/month
  * Or Infura IPFS: $0 (free tier)
- Total: $70-90/month

### Enterprise Setup
- Enterprise Plan: Custom pricing
- Dedicated Support
- SLA guarantees
- Custom build minutes
- Contact Render sales for quote
