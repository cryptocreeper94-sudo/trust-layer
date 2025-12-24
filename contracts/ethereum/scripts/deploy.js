const hre = require("hardhat");

async function main() {
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("  Deploying wDWC to", hre.network.name);
  console.log("═══════════════════════════════════════════════════════════════\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Balance:", hre.ethers.formatEther(balance), "ETH\n");

  const WDWC = await hre.ethers.getContractFactory("WDWC");
  const wdwc = await WDWC.deploy(deployer.address);
  await wdwc.waitForDeployment();

  const address = await wdwc.getAddress();
  
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("  Deployment Complete");
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("Contract Address:", address);
  console.log("Bridge Operator:", deployer.address);
  console.log("\nSet this in Replit Secrets:");
  console.log(`  WDWC_ETHEREUM_ADDRESS=${address}`);
  console.log("\nVerify on Etherscan:");
  console.log(`  https://sepolia.etherscan.io/address/${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
