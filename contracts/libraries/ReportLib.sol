// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ReportLib
 * @notice Library for report validation and aggregation
 */
library ReportLib {
    error InvalidObservationCount();
    error StaleReport();
    error InvalidSignature();
    error InsufficientSigners();

    uint256 constant MIN_OBSERVATIONS = 3;
    uint256 constant MAX_STALENESS = 5 minutes;
    uint256 constant MIN_SIGNERS = 2; // 2/3 threshold

    /**
     * @notice Calculate median from observations
     * @dev Uses quickselect algorithm for O(n) average case
     */
    function median(int256[] memory observations) 
        internal 
        pure 
        returns (int256) 
    {
        if (observations.length == 0) revert InvalidObservationCount();
        
        // Sort observations (simple bubble sort for small arrays)
        for (uint256 i = 0; i < observations.length; i++) {
            for (uint256 j = i + 1; j < observations.length; j++) {
                if (observations[i] > observations[j]) {
                    int256 temp = observations[i];
                    observations[i] = observations[j];
                    observations[j] = temp;
                }
            }
        }
        
        uint256 mid = observations.length / 2;
        if (observations.length % 2 == 0) {
            return (observations[mid - 1] + observations[mid]) / 2;
        } else {
            return observations[mid];
        }
    }

    /**
     * @notice Validate report freshness
     */
    function validateFreshness(uint256 timestamp) internal view {
        if (block.timestamp - timestamp > MAX_STALENESS) {
            revert StaleReport();
        }
    }

    /**
     * @notice Count signers from bitmap
     */
    function countSigners(uint256 bitmap) internal pure returns (uint256) {
        uint256 count = 0;
        uint256 temp = bitmap;
        while (temp > 0) {
            count += temp & 1;
            temp >>= 1;
        }
        return count;
    }

    /**
     * @notice Validate minimum signer threshold
     */
    function validateSigners(uint256 signerBitmap, uint256 committeeSize) 
        internal 
        pure 
    {
        uint256 signerCount = countSigners(signerBitmap);
        uint256 threshold = (committeeSize * 2) / 3; // 2/3 threshold
        
        if (signerCount < threshold) {
            revert InsufficientSigners();
        }
    }

    /**
     * @notice Hash report for signature verification
     */
    function hashReport(
        bytes32 feedId,
        int256[] memory observations,
        uint256 timestamp,
        uint256 roundId,
        bytes32 merkleRoot
    ) internal pure returns (bytes32) {
        return keccak256(abi.encode(
            feedId,
            observations,
            timestamp,
            roundId,
            merkleRoot
        ));
    }
}
