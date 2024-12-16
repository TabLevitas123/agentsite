# AgentX Platform

An Ethereum-based NFT platform for creating and managing agent NFTs with customizable capabilities.

## Project Structure

The project consists of two main interfaces:
- Landing page (agentxai.io)
- Dapp interface (agentxai.app)

## Smart Contract Features

The platform is built on Ethereum and includes:

### AgentNFT Contract
- ERC721 implementation for NFT functionality
- Skill management system (up to 50 skills per agent)
- Custom skill request system (up to 20 custom skills)
- Chainlink price feed integration for ETH/USD conversion
- Built-in marketplace functionality for future implementation

### Pricing
- Custom skill requests: 0.03 ETH
- Items: 0.01 ETH (paid in AGI tokens)
- Marketplace fee: 15%

## Frontend Components

### DappInterface
- Agent creation interface with name and image upload
- Predefined skill selection system
- Recent NFTs display
- Wallet connection integration

### XSwap
- Integrated Uniswap widget for token swapping
- Supports multiple token lists
- Custom dark theme implementation
- ETH/Token trading pairs

### Additional Components
- Complex3DLoader: Loading animation component
- NeuralBrainAnimation: Visual effects
- LandingPage: Main marketing interface

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
- Copy `.env.example` to `.env`
- Add required API keys and contract addresses

3. Run development server:
```bash
# For landing page
npm run dev

# For dapp interface
npm run dev:dapp
```

## Deployment

Refer to `DEPLOYMENT_GUIDE.md` for detailed deployment instructions using Render.com.

## Technical Stack

- Frontend: React with TypeScript
- Smart Contracts: Solidity 0.8.17
- Development: Hardhat
- UI: Tailwind CSS
- Web3: ethers.js, web3-react
- DEX Integration: Uniswap Widget

## Security Features

The smart contract includes:
- ReentrancyGuard for transaction safety
- Pausable functionality for emergency stops
- Owner-only administrative functions
- Emergency withdrawal capabilities

## Current Implementation Status

1. Smart Contract
- Full ERC721 implementation
- Complete skill management system
- Marketplace structure ready for future expansion

2. Frontend
- Complete UI implementation
- Local state management for NFT creation
- Uniswap integration for token swapping
- Wallet connection support

3. Deployment
- Dual deployment setup (landing + dapp)
- Render.com configuration
- Domain management for both interfaces
