// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title MerkleProof
 * @notice Library for verifying Merkle proofs
 * @dev Based on OpenZeppelin's implementation
 */
library MerkleProof {
    /**
     * @notice Verify a Merkle proof
     * @param proof Array of sibling hashes
     * @param root The Merkle root
     * @param leaf The leaf to verify
     * @return bool True if proof is valid
     */
    function verify(
        bytes32[] memory proof,
        bytes32 root,
        bytes32 leaf
    ) internal pure returns (bool) {
        return processProof(proof, leaf) == root;
    }

    /**
     * @notice Process a Merkle proof
     * @param proof Array of sibling hashes
     * @param leaf The starting leaf
     * @return bytes32 The computed root
     */
    function processProof(
        bytes32[] memory proof,
        bytes32 leaf
    ) internal pure returns (bytes32) {
        bytes32 computedHash = leaf;
        
        for (uint256 i = 0; i < proof.length; i++) {
            computedHash = _hashPair(computedHash, proof[i]);
        }
        
        return computedHash;
    }

    /**
     * @notice Hash a pair of nodes
     * @dev Sorts hashes to ensure deterministic ordering
     */
    function _hashPair(bytes32 a, bytes32 b) private pure returns (bytes32) {
        return a < b ? _efficientHash(a, b) : _efficientHash(b, a);
    }

    /**
     * @notice Efficient hash of two bytes32 values
     */
    function _efficientHash(bytes32 a, bytes32 b) 
        private 
        pure 
        returns (bytes32 value) 
    {
        assembly {
            mstore(0x00, a)
            mstore(0x20, b)
            value := keccak256(0x00, 0x40)
        }
    }

    /**
     * @notice Verify a multi-proof (more efficient for multiple leaves)
     * @param proof Array of proof hashes
     * @param proofFlags Boolean flags for proof processing
     * @param root The Merkle root
     * @param leaves Array of leaves to verify
     */
    function multiProofVerify(
        bytes32[] memory proof,
        bool[] memory proofFlags,
        bytes32 root,
        bytes32[] memory leaves
    ) internal pure returns (bool) {
        return processMultiProof(proof, proofFlags, leaves) == root;
    }

    /**
     * @notice Process a multi-proof
     */
    function processMultiProof(
        bytes32[] memory proof,
        bool[] memory proofFlags,
        bytes32[] memory leaves
    ) internal pure returns (bytes32 merkleRoot) {
        uint256 leavesLen = leaves.length;
        uint256 totalHashes = proofFlags.length;

        require(
            leavesLen + proof.length - 1 == totalHashes,
            "Invalid multi-proof"
        );

        bytes32[] memory hashes = new bytes32[](totalHashes);
        uint256 leafPos = 0;
        uint256 hashPos = 0;
        uint256 proofPos = 0;

        for (uint256 i = 0; i < totalHashes; i++) {
            bytes32 a = leafPos < leavesLen 
                ? leaves[leafPos++] 
                : hashes[hashPos++];
            bytes32 b = proofFlags[i]
                ? (leafPos < leavesLen ? leaves[leafPos++] : hashes[hashPos++])
                : proof[proofPos++];
            hashes[i] = _hashPair(a, b);
        }

        return hashes[totalHashes - 1];
    }
}
