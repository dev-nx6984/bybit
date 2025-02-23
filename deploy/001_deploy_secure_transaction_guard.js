module.exports = async ({ deployments, getNamedAccounts }) => {
    const { deploy } = deployments;
    const accounts = await ethers.getSigners();
  
    const deployer = accounts[0].address;  // First account as deployer
    const auditor = accounts[1].address;   // Second account as auditor
  
    console.log(`Deploying SecureTransactionGuard...`);
    console.log(`Deployer: ${deployer}`);
    console.log(`Auditor: ${auditor}`);
  
    const contract = await deploy("SecureTransactionGuard", {
      from: deployer,
      args: [auditor],  // Now using a valid auditor address
      log: true,
    });
  
    console.log(`SecureTransactionGuard deployed at: ${contract.address}`);
  };
  
  module.exports.tags = ["SecureTransactionGuard"];
  

// module.exports = async ({ deployments, getNamedAccounts }) => {
//     const { deploy } = deployments;
//     const { deployer } = await getNamedAccounts();
  
//     console.log("Deploying SecureTransactionGuard...");
  
//     const contract = await deploy("SecureTransactionGuard", {
//       from: deployer,
//       args: ["0xYourAuditorAddress"], // Replace with actual auditor address
//       log: true,
//     });
  
//     console.log(`SecureTransactionGuard deployed at: ${contract.address}`);
//   };
  
//   module.exports.tags = ["SecureTransactionGuard"];
  