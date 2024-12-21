# Landing Page Deployment Guide

## Prerequisites
- A Render account (create one at render.com if you haven't already)
- A Namecheap account with your domain
- Your project's GitHub repository

## Step 1: Prepare Your Repository

1. Ensure your repository contains:
   - All source code
   - `package.json` with build script
   - Built files in the `/build` directory

2. Push your latest changes to GitHub:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

## Step 2: Deploy to Render

1. Log in to your Render dashboard (dashboard.render.com)

2. Click "New +" and select "Static Site"

3. Connect your GitHub repository:
   - Select the repository containing your landing page
   - Click "Connect"

4. Configure your static site:
   - **Name**: Choose a name (e.g., "bitcoin-ai-landing")
   - **Branch**: main
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
   - **Environment Variables**: None required for landing page

5. Click "Create Static Site"

6. Wait for the initial deployment to complete (you can monitor the build logs)

## Step 3: Configure Custom Domain on Render

1. Once deployed, go to your site's settings in Render

2. Navigate to the "Custom Domains" section

3. Click "Add Custom Domain"

4. Enter your domain name (e.g., bitcoinai.io)

5. Copy the provided DNS records. You'll typically see:
   - Type: `CNAME`
   - Name: `www` or `@`
   - Value: `[your-site].onrender.com`

## Step 4: Configure Namecheap DNS

1. Log in to your Namecheap account

2. Go to "Domain List" and click "Manage" next to your domain

3. Go to the "Advanced DNS" tab

4. Remove any existing A or CNAME records for @ and www

5. Add the following records:
   - For root domain (@):
     - Type: `ALIAS` or `A`
     - Host: `@`
     - Value: `[your-site].onrender.com`
     - TTL: Automatic

   - For www subdomain:
     - Type: `CNAME`
     - Host: `www`
     - Value: `[your-site].onrender.com`
     - TTL: Automatic

6. Add URL Redirect Record (optional):
   - If you want www to redirect to non-www or vice versa:
     - Type: `URL Redirect`
     - Host: `www`
     - Value: `http://yourdomain.com`
     - Redirect Type: Permanent (301)

## Step 5: Verify Deployment

1. Wait for DNS propagation (can take up to 48 hours, but usually much faster)

2. Test your domain:
   - Visit your domain (e.g., bitcoinai.io)
   - Check that HTTPS is working
   - Verify all assets load correctly
   - Test social media links
   - Ensure the DEX button works

## Troubleshooting

### DNS Issues
- Use a DNS checker tool to verify propagation
- Ensure all old DNS records are removed
- Double-check Render's DNS settings match Namecheap

### SSL/HTTPS Issues
- Render automatically provisions SSL certificates
- Wait up to 24 hours for SSL to be fully provisioned
- Verify your domain's DNS is properly configured

### Asset Loading Issues
- Check the browser console for 404 errors
- Verify all asset paths are relative
- Ensure all assets are included in the build directory

## Speed Optimization

### Fast Launch Steps
1. **Pre-build Locally**:
   ```bash
   # Build locally first
   npm run build
   
   # Commit the build folder
   git add build/
   git commit -m "Add production build"
   git push origin main
   ```

2. **Quick Deploy Configuration**:
   - In Render, modify build settings:
     - Build Command: `[ -d "build" ] && exit 0 || npm install && npm run build`
     - This skips build if `/build` exists, making deployment instant
   - Enable auto-publish

3. **DNS Speed Up**:
   - Use Namecheap's FastDNS (Premium DNS)
   - Set lower TTL values temporarily:
     - Set to 300 seconds (5 minutes) during launch
     - Increase to default after verification
   - Add both www and @ records simultaneously

4. **Verify Before DNS Switch**:
   - Test on Render URL first (yoursite.onrender.com)
   - Prepare all DNS records in advance
   - Switch DNS only after successful Render deployment

### Launch Checklist (Speed Optimized)
1. ✓ Build locally and push to GitHub with build folder
2. ✓ Create Render static site with quick deploy config
3. ✓ Test on Render URL
4. ✓ Prepare DNS records in Namecheap
5. ✓ Switch DNS and verify

## Maintenance

### Updating the Site
1. Push changes to your GitHub repository
2. Render will automatically rebuild and deploy

### Monitoring
- Use Render's dashboard to:
  - Monitor build status
  - View deployment logs
  - Check site metrics

### Support
- Render Documentation: docs.render.com
- Namecheap Support: support.namecheap.com

---

Remember to keep your GitHub repository up to date with any local changes. Render will automatically deploy new changes when you push to the main branch.