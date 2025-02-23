
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners(); // Get first signer as deployer
  const auditor = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; // Use real auditor address

  console.log(`Deploying SecureTransactionGuard with auditor: ${auditor}`);

  const SecureTransactionGuard = await hre.ethers.getContractFactory("SecureTransactionGuard");
  const contract = await SecureTransactionGuard.deploy(auditor);

  await contract.waitForDeployment();
  
  console.log(`SecureTransactionGuard deployed at: ${await contract.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});



// const { deployments, getNamedAccounts } = require("hardhat");

// async function main() {
//   const { deployer } = await getNamedAccounts();
//   const { deploy } = deployments;

//   console.log("Deploying SecureTransactionGuard...");

//   const contract = await deploy("SecureTransactionGuard", {
//     from: deployer,
//     args: ["0xYourAuditorAddress"], // Replace with an actual auditor address
//     log: true,
//   });

//   console.log(`Contract deployed at: ${contract.address}`);
// }

// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });


// const hre = require("hardhat");

// async function main() {
//   const [owner, auditor] = await hre.ethers.getSigners();
//   const SecureTransactionGuard = await hre.ethers.getContractFactory("SecureTransactionGuard");

//   console.log("Deploying SecureTransactionGuard...");
//   const contract = await SecureTransactionGuard.deploy(auditor.address);
//   await contract.waitForDeployment();


//    // Fix: Log the contract address correctly for Ethers v6
//    console.log(`Contract deployed at: ${await contract.getAddress()}`);
// }

// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });
