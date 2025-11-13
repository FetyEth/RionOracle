// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IReceiptStore
 * @notice Interface for HTTP-402 receipt verification and storage
 */
interface IReceiptStore {
    struct Receipt {
        bytes32 feedId;
        uint256 roundId;
        address consumer;
        int256 value;
        uint256 timestamp;
        bytes32 merkleRoot;
        bytes32[] merkleProof;
        bytes signature;
        bool verified;
    }

    struct ProofOfAttention {
        address agent;
        bytes32 receiptHash;
        uint256 timestamp;
        string metadata;
    }

    event ReceiptStored(
        bytes32 indexed receiptHash,
        bytes32 indexed feedId,
        address indexed consumer
    );
    
    event ReceiptVerified(
        bytes32 indexed receiptHash,
        bool valid
    );
    
    event AttentionRecorded(
        address indexed agent,
        bytes32 indexed receiptHash
    );

    function storeReceipt(
        bytes32 feedId,
        uint256 roundId,
        int256 value,
        bytes32 merkleRoot,
        bytes32[] calldata merkleProof,
        bytes calldata signature
    ) external returns (bytes32 receiptHash);

    function verifyReceipt(bytes32 receiptHash) 
        external 
        view 
        returns (bool valid, Receipt memory receipt);

    function recordAttention(
        bytes32 receiptHash,
        string calldata metadata
    ) external;

    function getReceipt(bytes32 receiptHash) 
        external 
        view 
        returns (Receipt memory);

    function getAttentionProof(bytes32 receiptHash) 
        external 
        view 
        returns (ProofOfAttention memory);
}
