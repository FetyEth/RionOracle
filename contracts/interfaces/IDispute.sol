// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./IAggregator.sol";

/**
 * @title IDispute
 * @notice Interface for challenging oracle reports
 */
interface IDispute {
    enum DisputeStatus {
        Pending,
        Accepted,
        Rejected,
        Resolved
    }

    struct DisputeData {
        bytes32 feedId;
        uint256 roundId;
        address challenger;
        int256 claimedCorrectValue;
        string evidence;
        uint256 stake;
        uint256 timestamp;
        DisputeStatus status;
        address[] voters;
        uint256 votesFor;
        uint256 votesAgainst;
    }

    event DisputeCreated(
        uint256 indexed disputeId,
        bytes32 indexed feedId,
        uint256 indexed roundId,
        address challenger
    );
    
    event DisputeVoted(
        uint256 indexed disputeId,
        address indexed voter,
        bool support
    );
    
    event DisputeResolved(
        uint256 indexed disputeId,
        bool accepted,
        int256 correctedValue
    );

    function createDispute(
        bytes32 feedId,
        uint256 roundId,
        int256 claimedCorrectValue,
        string calldata evidence
    ) external payable returns (uint256 disputeId);

    function voteOnDispute(uint256 disputeId, bool support) external;

    function resolveDispute(uint256 disputeId) external;

    function getDispute(uint256 disputeId) 
        external 
        view 
        returns (DisputeData memory);
}
