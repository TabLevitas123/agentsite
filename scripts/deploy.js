const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy AGIToken first
  const AGIToken = await hre.ethers.getContractFactory("AGIToken");
  const mockPriceFeed = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"; // Using mainnet ETH/USD price feed address for testing
  const marketingWallet = deployer.address;
  const devWallet = deployer.address;
  const liquidityWallet = deployer.address;
  const teamWallet1 = deployer.address;
  const teamWallet2 = deployer.address;
  const userRewardsWallet = deployer.address;
  const stakingRewardsWallet = deployer.address;
  const openSaleWallet = deployer.address;

  const agiToken = await AGIToken.deploy(
    mockPriceFeed,
    marketingWallet,
    devWallet,
    liquidityWallet,
    teamWallet1,
    teamWallet2,
    userRewardsWallet,
    stakingRewardsWallet,
    openSaleWallet
  );

  await agiToken.waitForDeployment();
  const agiTokenAddress = await agiToken.getAddress();
  console.log("AGIToken deployed to:", agiTokenAddress);

  // Deploy AgentNFT
  const AgentNFT = await hre.ethers.getContractFactory("AgentNFT");
  const agentNFT = await AgentNFT.deploy(
    agiTokenAddress,
    devWallet,
    mockPriceFeed
  );

  await agentNFT.waitForDeployment();
  const agentNFTAddress = await agentNFT.getAddress();
  console.log("AgentNFT deployed to:", agentNFTAddress);

  // Enable trading on AGIToken
  await agiToken.setTradingStatus(true);
  console.log("Trading enabled on AGIToken");

  console.log("\nDeployment complete!");
  console.log("AGIToken:", agiTokenAddress);
  console.log("AgentNFT:", agentNFTAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
