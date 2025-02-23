require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy"); // Ensure this is required

module.exports = {
  solidity: "0.8.20",
  namedAccounts: {
    deployer: {
      default: 0, // The first account in the Hardhat node
    },
  },
};


// require("@nomicfoundation/hardhat-toolbox");
// require("hardhat-deploy"); // Required for deployments

// module.exports = {
//   solidity: "0.8.20",
//   namedAccounts: {
//     deployer: {
//       default: 0, // The first account in the list of signers
//     },
//   },
// };

// require("@nomicfoundation/hardhat-toolbox");
// require("hardhat-deploy"); // Add this line

// module.exports = {
//   solidity: "0.8.20",
//   namedAccounts: {
//     deployer: {
//       default: 0, // First account in Hardhat node
//     },
//   },
// };


// // require("@nomicfoundation/hardhat-toolbox");

// // module.exports = {
// //   solidity: "0.8.20",
// // };


// // // /** @type import('hardhat/config').HardhatUserConfig */
// // // module.exports = {
// // //   solidity: "0.8.28",
// // // };
