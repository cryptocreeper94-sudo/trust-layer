const hre = require("hardhat");

async function main() {
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("  Deploying wDWT to", hre.network.name);
  console.log("═══════════════════════════════════════════════════════════════\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Balance:", hre.ethers.formatEther(balance), "ETH\n");

  const WDWT = await hre.ethers.getContractFactory("WDWT");
  const wdwt = await WDWT.deploy(deployer.address);
  await wdwt.waitForDeployment();

  const address = await wdwt.getAddress();
  
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("  Deployment Complete");
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("Contract Address:", address);
  console.log("Bridge Operator:", deployer.address);
  console.log("\nSet this in Replit Secrets:");
  console.log(`  WDWT_ETHEREUM_ADDRESS=${address}`);
  console.log("\nVerify on Etherscan:");
  console.log(`  https://sepolia.etherscan.io/address/${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
