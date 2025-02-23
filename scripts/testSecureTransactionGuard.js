const hre = require("hardhat");

async function main() {
    const [deployer, auditor] = await hre.ethers.getSigners();
    const contractAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6"; // Update this if redeploying

    console.log(`\n🚀 Using Deployed Contract at: ${contractAddress}\n`);

    const SecureTransactionGuard = await hre.ethers.getContractFactory("SecureTransactionGuard");
    const contract = await SecureTransactionGuard.attach(contractAddress);

    console.log(`✅ Owner: ${await contract.owner()}`);
    console.log(`✅ Auditor: ${await contract.auditor()}`);

    const transactionHash = "0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234";

    // Step 1: Store Transaction Hash (Using Deployer)
    console.log("\n📌 Storing transaction hash...");
    try {
        await contract.connect(deployer).storeTransactionHash(transactionHash);
        console.log("✅ Transaction hash stored successfully.");
    } catch (error) {
        console.error("❌ Error storing transaction hash:", error.reason);
    }

    // Step 2: Verify Transaction (Using Auditor)
    console.log("\n📌 Verifying transaction...");
    try {
        await contract.connect(auditor).verifyTransaction(deployer.address, transactionHash);
        console.log("✅ Transaction verified successfully.");
    } catch (error) {
        console.error("❌ Error verifying transaction:", error.reason);
    }

    // Step 3: Execute Transaction (Using Deployer)
    console.log("\n📌 Executing transaction...");
    try {
        await contract.connect(deployer).executeTransaction(transactionHash);
        console.log("✅ Transaction executed successfully.");
    } catch (error) {
        console.error("❌ Error executing transaction:", error.reason);
    }

    // Step 4: Check if Transaction is Verified
    console.log("\n📌 Checking verification status...");
    const isVerified = await contract.verifiedTxs(transactionHash);
    console.log(`🔍 Transaction Verified Status: ${isVerified}`);


    console.log(await contract.pendingTxHash("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"));


}

// Run the script
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
