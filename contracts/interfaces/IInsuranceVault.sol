// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IInsuranceVault
 * @notice Interface for user compensation system
 */
interface IInsuranceVault {
    struct Claim {
        address claimant;
        bytes32 feedId;
        uint256 roundId;
        uint256 disputeId;
        uint256 lossAmount;
        string description;
        uint256 timestamp;
        bool processed;
        bool approved;
        uint256 payoutAmount;
    }

    event ClaimSubmitted(
        uint256 indexed claimId,
        address indexed claimant,
        bytes32 indexed feedId,
        uint256 lossAmount
    );
    
    event ClaimProcessed(
        uint256 indexed claimId,
        bool approved,
        uint256 payoutAmount
    );
    
    event VaultFunded(address indexed funder, uint256 amount);
    
    event VaultWithdrawn(address indexed recipient, uint256 amount);

    function submitClaim(
        bytes32 feedId,
        uint256 roundId,
        uint256 disputeId,
        uint256 lossAmount,
        string calldata description
    ) external returns (uint256 claimId);

    function processClaim(uint256 claimId, bool approve, uint256 payoutAmount) 
        external;

    function fundVault() external payable;

    function getVaultBalance() external view returns (uint256);

    function getClaim(uint256 claimId) external view returns (Claim memory);
}
