// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../interfaces/IDispute.sol";

/**
 * @title MockDispute
 * @notice Mock dispute contract for testing
 */
contract MockDispute is IDispute {
    uint256 public disputeCount;
    mapping(uint256 => DisputeData) public disputes;

    function createDispute(
        bytes32 feedId,
        uint256 roundId,
        int256 claimedCorrectValue,
        string calldata evidence
    ) external payable override returns (uint256 disputeId) {
        disputeId = ++disputeCount;
        
        disputes[disputeId] = DisputeData({
            feedId: feedId,
            roundId: roundId,
            challenger: msg.sender,
            claimedCorrectValue: claimedCorrectValue,
            evidence: evidence,
            stake: msg.value,
            timestamp: block.timestamp,
            status: DisputeStatus.Pending,
            voters: new address[](0),
            votesFor: 0,
            votesAgainst: 0
        });
        
        emit DisputeCreated(disputeId, feedId, roundId, msg.sender);
        return disputeId;
    }

    function voteOnDispute(uint256 disputeId, bool support) external override {
        disputes[disputeId].voters.push(msg.sender);
        if (support) {
            disputes[disputeId].votesFor++;
        } else {
            disputes[disputeId].votesAgainst++;
        }
        emit DisputeVoted(disputeId, msg.sender, support);
    }

    function resolveDispute(uint256 disputeId) external override {
        disputes[disputeId].status = DisputeStatus.Resolved;
        emit DisputeResolved(disputeId, true, disputes[disputeId].claimedCorrectValue);
    }

    function getDispute(uint256 disputeId) 
        external 
        view 
        override
        returns (DisputeData memory) 
    {
        return disputes[disputeId];
    }
}
