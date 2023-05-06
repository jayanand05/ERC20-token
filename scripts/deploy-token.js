const ethers = require("hardhat");
const hre = require("hardhat");

async function main() {
  const dogeTokenFactory = await hre.ethers.getContractFactory("DogeToken");
  console.log("Deploying............");
  const dogeToken = await dogeTokenFactory.deploy(100000000, 50);
  await dogeToken.deployed();
  console.log(`Deployed contract at : ${dogeToken.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
