const hre = require("hardhat");

async function main() {
    const [deployer, auditor, attacker] = await hre.ethers.getSigners();
 
    const contractAddress = "0x4c5859f0F772848b2D91F1D83E2Fe57935348029";

    console.log(`\n🚀 Using Deployed Contract at: ${contractAddress}\n`);

    const SecureTransactionGuard = await hre.ethers.getContractFactory("SecureTransactionGuard");
    const contract = await SecureTransactionGuard.attach(contractAddress);

    console.log(`✅ Owner: ${await contract.owner()}`);
    console.log(`✅ Auditor: ${await contract.auditor()}`);

    const validTxHash = "0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234";
    const fakeTxHash = "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcd";

    // 🛑 TEST 1: Attacker tries to store a transaction for another user
    console.log("\n❌ Attempting unauthorized transaction storage...");
    try {
        await contract.connect(attacker).storeTransactionHash(validTxHash);
        console.log("❌ ERROR: Attacker was able to store a transaction for someone else! 🚨");
    } catch (error) {
        console.log("✅ Attack prevented: Unauthorized storage rejected.");
    }

    // ✅ Step 1: Store Transaction Hash (Legit User)
    console.log("\n📌 Storing transaction hash...");
    await contract.connect(deployer).storeTransactionHash(validTxHash);
    console.log("✅ Transaction hash stored successfully.");

    // 🛑 TEST 2: Attacker tries to verify an invalid transaction
    console.log("\n❌ Attempting fake verification...");
    try {
        await contract.connect(attacker).verifyTransaction(deployer.address, fakeTxHash);
        console.log("❌ ERROR: Attacker was able to verify a fake transaction! 🚨");
    } catch (error) {
        console.log("✅ Attack prevented: Unauthorized verification rejected.");
    }

    // ✅ Step 2: Verify Transaction (Legit Auditor)
    console.log("\n📌 Verifying transaction...");
    await contract.connect(auditor).verifyTransaction(deployer.address, validTxHash);
    console.log("✅ Transaction verified successfully.");

    // 🛑 TEST 3: Attacker tries to execute an unverified transaction
    console.log("\n❌ Attempting execution of unverified transaction...");
    try {
        await contract.connect(attacker).executeTransaction(fakeTxHash);
        console.log("❌ ERROR: Attacker was able to execute an unverified transaction! 🚨");
    } catch (error) {
        console.log("✅ Attack prevented: Unverified transaction execution rejected.");
    }

    // ✅ Step 3: Execute Transaction (Legit User)
    console.log("\n📌 Executing transaction...");
    await contract.connect(deployer).executeTransaction(validTxHash);
    console.log("✅ Transaction executed successfully.");

    // 🛑 TEST 4: Attacker tries to re-execute a transaction
    console.log("\n❌ Attempting to re-execute a completed transaction...");
    try {
        await contract.connect(deployer).executeTransaction(validTxHash);
        console.log("❌ ERROR: Transaction executed twice! 🚨");
    } catch (error) {
        console.log("✅ Attack prevented: Re-execution rejected.");
    }

    // ✅ Final Check: Verification Status & Pending Hash Should be Reset
    console.log("\n📌 Checking verification status after execution...");
    console.log(`🔍 Transaction Verified Status: ${await contract.verifiedTxs(validTxHash)}`);
    console.log(`🔍 Pending Transaction Hash: ${await contract.pendingTxHash(deployer.address)}`);
}

// Run the script
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
