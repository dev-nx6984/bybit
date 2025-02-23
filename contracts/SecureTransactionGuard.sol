// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SecureTransactionGuard is ReentrancyGuard {
    
    address public owner;
    address public auditor;
    mapping(address => bytes32) public pendingTxHash;
    mapping(bytes32 => bool) public verifiedTxs;
    
    event TransactionHashStored(address indexed user, bytes32 txHash);
    event TransactionVerified(address indexed user, bytes32 txHash);
    event TransactionExecuted(address indexed user, bytes32 txHash);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier onlyAuditor() {
        require(msg.sender == auditor, "Not authorized");
        _;
    }

    constructor(address _auditor) {
        require(_auditor != address(0), "Invalid auditor address");
        owner = msg.sender;
        auditor = _auditor;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    // Step 1: Store the transaction hash before signing
    // function storeTransactionHash(bytes32 _txHash) external {
    //     require(pendingTxHash[msg.sender] == bytes32(0), "Pending transaction already exists");
    //     pendingTxHash[msg.sender] = _txHash;
    //     emit TransactionHashStored(msg.sender, _txHash);
    // }
//     function storeTransactionHash(bytes32 _txHash) external {
//     require(pendingTxHash[msg.sender] == bytes32(0), "Pending transaction already exists");
//     require(_txHash != bytes32(0), "Invalid transaction hash"); // Prevent empty hashes
//     pendingTxHash[msg.sender] = _txHash;
//     emit TransactionHashStored(msg.sender, _txHash);
// }
//     function storeTransactionHash(bytes32 _txHash) external {
//     require(pendingTxHash[msg.sender] == bytes32(0), "Pending transaction already exists");
//     require(_txHash != bytes32(0), "Invalid transaction hash"); // Prevent empty hashes

//     // ✅ Ensure only the sender can store their own transaction
//     require(msg.sender != address(0), "Invalid sender");

//     pendingTxHash[msg.sender] = _txHash;
//     emit TransactionHashStored(msg.sender, _txHash);
// }
// function storeTransactionHash(bytes32 _txHash) external {
//     require(pendingTxHash[msg.sender] == bytes32(0), "Pending transaction already exists");
//     require(_txHash != bytes32(0), "Invalid transaction hash"); // Prevent empty hashes

//     // ✅ NEW: Ensure the sender is storing their OWN transaction (prevents spoofing)
//     require(tx.origin == msg.sender, "Unauthorized transaction storage");

//     pendingTxHash[msg.sender] = _txHash;
//     emit TransactionHashStored(msg.sender, _txHash);
// }
// function storeTransactionHash(bytes32 _txHash) external {
//     require(pendingTxHash[msg.sender] == bytes32(0), "Pending transaction already exists");
//     require(_txHash != bytes32(0), "Invalid transaction hash"); // Prevent empty hashes

//     // ✅ NEW: Ensure the sender is not trying to store a hash for someone else
//     require(pendingTxHash[msg.sender] == bytes32(0), "Unauthorized: You already have a transaction pending");

//     // ✅ NEW: Prevent re-entrancy by checking sender directly
//     require(msg.sender == tx.origin, "Unauthorized: Contract calls not allowed");

//     pendingTxHash[msg.sender] = _txHash;
//     emit TransactionHashStored(msg.sender, _txHash);
// }
// function storeTransactionHash(bytes32 _txHash) external {
//     require(pendingTxHash[msg.sender] == bytes32(0), "Pending transaction already exists");
//     require(_txHash != bytes32(0), "Invalid transaction hash"); // Prevent empty hashes

//     // ✅ NEW: Ensure sender cannot store transactions for others
//     require(pendingTxHash[tx.origin] == bytes32(0), "Unauthorized: Transaction must be stored by the sender");

//     pendingTxHash[msg.sender] = _txHash;
//     emit TransactionHashStored(msg.sender, _txHash);
// }
function storeTransactionHash(bytes32 _txHash) external {
    require(pendingTxHash[msg.sender] == bytes32(0), "Pending transaction already exists");
    require(_txHash != bytes32(0), "Invalid transaction hash");

    // ✅ Ensure that msg.sender is ONLY modifying their own transactions
    require(pendingTxHash[tx.origin] == bytes32(0), "Unauthorized: Transaction must be stored by the sender");
    require(msg.sender == tx.origin, "Unauthorized: Contract calls not allowed");

    pendingTxHash[msg.sender] = _txHash;
    emit TransactionHashStored(msg.sender, _txHash);
}





    // Step 2: Auditor must verify the transaction before signing
    function verifyTransaction(address user, bytes32 _txHash) external onlyAuditor {
        require(pendingTxHash[user] != bytes32(0), "No pending transaction");
        require(pendingTxHash[user] == _txHash, "Transaction hash mismatch");
        verifiedTxs[_txHash] = true;
        emit TransactionVerified(user, _txHash);
    }

    // Step 3: Execute only if verified
//     function executeTransaction(bytes32 _txHash) external nonReentrant {
//     require(verifiedTxs[_txHash], "Transaction not verified");

//     emit TransactionExecuted(msg.sender, _txHash);

//     // ✅ Only delete the pending transaction hash, but keep the verification flag
//     delete pendingTxHash[msg.sender];
// }
//     function executeTransaction(bytes32 _txHash) external nonReentrant {
//     require(verifiedTxs[_txHash], "Transaction not verified");

//     emit TransactionExecuted(msg.sender, _txHash);

//     delete pendingTxHash[msg.sender]; // Remove pending transaction
//     delete verifiedTxs[_txHash]; // ✅ Prevents double execution
// }
    function executeTransaction(bytes32 _txHash) external nonReentrant {
    require(verifiedTxs[_txHash], "Transaction not verified");

    emit TransactionExecuted(msg.sender, _txHash);

    delete pendingTxHash[msg.sender];  // ✅ Remove pending transaction
    delete verifiedTxs[_txHash];       // ✅ Ensure transaction cannot be executed again
}



    // function executeTransaction(bytes32 _txHash) external nonReentrant {
    //     require(verifiedTxs[_txHash], "Transaction not verified");
        
    //     // Here, the actual transaction execution logic should be implemented
        
    //     emit TransactionExecuted(msg.sender, _txHash);
        
    //     // Ensure successful execution before deleting pending data
    //     if (verifiedTxs[_txHash]) {
    //         delete pendingTxHash[msg.sender];
    //         delete verifiedTxs[_txHash];
    //     }
    // }
}
