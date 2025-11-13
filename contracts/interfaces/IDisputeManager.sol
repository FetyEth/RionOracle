// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IDisputeManager {
    enum DisputeStatus {
        Proposed,
        Evidence,
        Voting,
        Resolved,
        Rejected
    }

    struct Dispute {
        uint256 disputeId;
        bytes32 feedId;
        uint256 roundId;
        address challenger;
        int256 claimedValue;
        int256 actualValue;
        uint256 stake;
        DisputeStatus status;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 createdAt;
        uint256 resolvedAt;
    }

    event DisputeCreated(
        uint256 indexed disputeId,
        bytes32 indexed feedId,
        uint256 roundId,
        address challenger
    );

    event DisputeResolved(
        uint256 indexed disputeId,
        bool successful,
        address[] slashedProviders
    );

    event VoteCast(
        uint256 indexed disputeId,
        address indexed voter,
        bool support,
        uint256 weight
    );

    function createDispute(
        bytes32 feedId,
        uint256 roundId,
        int256 claimedValue,
        bytes calldata proof
    ) external payable returns (uint256 disputeId);

    function vote(uint256 disputeId, bool support) external;

    function resolveDispute(uint256 disputeId) external;

    function getDispute(uint256 disputeId) 
        external 
        view 
        returns (Dispute memory);
}
