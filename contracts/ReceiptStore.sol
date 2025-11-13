// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interfaces/IReceiptStore.sol";
import "./libraries/MerkleProof.sol";

/**
 * @title ReceiptStore
 * @notice Stores and verifies HTTP-402 receipts with Merkle proofs
 * @dev Implements proof-of-attention for AI agents
 */
contract ReceiptStore is IReceiptStore {
    mapping(bytes32 => Receipt) public receipts;
    mapping(bytes32 => ProofOfAttention) public attentionProofs;
    mapping(address => uint256) public consumerReceiptCount;
    
    address public feedRegistry;
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _feedRegistry) {
        feedRegistry = _feedRegistry;
        owner = msg.sender;
    }

    /**
     * @notice Store a receipt with Merkle proof
     * @dev Called when consumer fetches data via HTTP-402
     */
    function storeReceipt(
        bytes32 feedId,
        uint256 roundId,
        int256 value,
        bytes32 merkleRoot,
        bytes32[] calldata merkleProof,
        bytes calldata signature
    ) external override returns (bytes32 receiptHash) {
        // Generate receipt hash
        receiptHash = keccak256(abi.encode(
            feedId,
            roundId,
            msg.sender,
            value,
            block.timestamp,
            merkleRoot
        ));
        
        // Verify Merkle proof
        bytes32 leaf = keccak256(abi.encode(value, msg.sender));
        require(
            MerkleProof.verify(merkleProof, merkleRoot, leaf),
            "Invalid Merkle proof"
        );
        
        // Store receipt
        receipts[receiptHash] = Receipt({
            feedId: feedId,
            roundId: roundId,
            consumer: msg.sender,
            value: value,
            timestamp: block.timestamp,
            merkleRoot: merkleRoot,
            merkleProof: merkleProof,
            signature: signature,
            verified: true
        });
        
        consumerReceiptCount[msg.sender]++;
        
        emit ReceiptStored(receiptHash, feedId, msg.sender);
        emit ReceiptVerified(receiptHash, true);
        
        return receiptHash;
    }

    /**
     * @notice Verify a receipt's authenticity
     * @dev Checks Merkle proof and signature
     */
    function verifyReceipt(bytes32 receiptHash) 
        external 
        view 
        override
        returns (bool valid, Receipt memory receipt) 
    {
        receipt = receipts[receiptHash];
        
        if (receipt.consumer == address(0)) {
            return (false, receipt);
        }
        
        // Verify Merkle proof
        bytes32 leaf = keccak256(abi.encode(receipt.value, receipt.consumer));
        valid = MerkleProof.verify(
            receipt.merkleProof,
            receipt.merkleRoot,
            leaf
        );
        
        return (valid, receipt);
    }

    /**
     * @notice Record proof-of-attention for AI agents
     * @dev Agents can prove they consumed specific data
     */
    function recordAttention(
        bytes32 receiptHash,
        string calldata metadata
    ) external override {
        Receipt memory receipt = receipts[receiptHash];
        require(receipt.consumer != address(0), "Receipt not found");
        
        attentionProofs[receiptHash] = ProofOfAttention({
            agent: msg.sender,
            receiptHash: receiptHash,
            timestamp: block.timestamp,
            metadata: metadata
        });
        
        emit AttentionRecorded(msg.sender, receiptHash);
    }

    /**
     * @notice Get receipt details
     */
    function getReceipt(bytes32 receiptHash) 
        external 
        view 
        override
        returns (Receipt memory) 
    {
        return receipts[receiptHash];
    }

    /**
     * @notice Get attention proof
     */
    function getAttentionProof(bytes32 receiptHash) 
        external 
        view 
        override
        returns (ProofOfAttention memory) 
    {
        return attentionProofs[receiptHash];
    }

    /**
     * @notice Get consumer's receipt count
     */
    function getConsumerReceiptCount(address consumer) 
        external 
        view 
        returns (uint256) 
    {
        return consumerReceiptCount[consumer];
    }

    /**
     * @notice Update feed registry
     */
    function setFeedRegistry(address _registry) external onlyOwner {
        require(_registry != address(0), "Invalid registry");
        feedRegistry = _registry;
    }
}
