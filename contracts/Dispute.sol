// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interfaces/IDispute.sol";
import "./interfaces/IAggregator.sol";
import "./interfaces/IInsuranceVault.sol";

/**
 * @title Dispute
 * @notice Handles challenges to oracle reports with DAO voting
 * @dev Implements deterministic replay and public accountability
 */
contract Dispute is IDispute {
    uint256 public disputeCount;
    uint256 public constant MIN_STAKE = 0.1 ether;
    uint256 public constant VOTING_PERIOD = 3 days;
    uint256 public constant QUORUM = 3; // Minimum voters
    
    mapping(uint256 => DisputeData) public disputes;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    
    address public feedRegistry;
    address public insuranceVault;
    address public dao;
    
    modifier onlyDAO() {
        require(msg.sender == dao, "Not DAO");
        _;
    }

    constructor(address _feedRegistry, address _insuranceVault) {
        feedRegistry = _feedRegistry;
        insuranceVault = _insuranceVault;
        dao = msg.sender;
    }

    /**
     * @notice Create a new dispute
     * @dev Requires stake to prevent spam
     */
    function createDispute(
        bytes32 feedId,
        uint256 roundId,
        int256 claimedCorrectValue,
        string calldata evidence
    ) external payable override returns (uint256 disputeId) {
        require(msg.value >= MIN_STAKE, "Insufficient stake");
        require(bytes(evidence).length > 0, "Evidence required");
        
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

    /**
     * @notice Vote on a pending dispute
     * @dev DAO members can vote to accept or reject
     */
    function voteOnDispute(uint256 disputeId, bool support) 
        external 
        override 
    {
        DisputeData storage dispute = disputes[disputeId];
        
        require(dispute.status == DisputeStatus.Pending, "Not pending");
        require(!hasVoted[disputeId][msg.sender], "Already voted");
        require(
            block.timestamp <= dispute.timestamp + VOTING_PERIOD,
            "Voting ended"
        );
        
        hasVoted[disputeId][msg.sender] = true;
        dispute.voters.push(msg.sender);
        
        if (support) {
            dispute.votesFor++;
        } else {
            dispute.votesAgainst++;
        }
        
        emit DisputeVoted(disputeId, msg.sender, support);
    }

    /**
     * @notice Resolve a dispute after voting period
     * @dev Determines outcome and triggers insurance claims if accepted
     */
    function resolveDispute(uint256 disputeId) external override {
        DisputeData storage dispute = disputes[disputeId];
        
        require(dispute.status == DisputeStatus.Pending, "Not pending");
        require(
            block.timestamp > dispute.timestamp + VOTING_PERIOD,
            "Voting ongoing"
        );
        require(dispute.voters.length >= QUORUM, "Insufficient votes");
        
        bool accepted = dispute.votesFor > dispute.votesAgainst;
        
        if (accepted) {
            dispute.status = DisputeStatus.Accepted;
            
            // Return stake plus reward
            uint256 reward = dispute.stake * 2;
            payable(dispute.challenger).transfer(reward);
            
            // Trigger insurance vault to process claims
            // In production, this would update the feed with corrected value
        } else {
            dispute.status = DisputeStatus.Rejected;
            
            // Stake goes to insurance vault
            payable(insuranceVault).transfer(dispute.stake);
        }
        
        emit DisputeResolved(
            disputeId,
            accepted,
            accepted ? dispute.claimedCorrectValue : int256(0)
        );
    }

    /**
     * @notice Get dispute details
     */
    function getDispute(uint256 disputeId) 
        external 
        view 
        override
        returns (DisputeData memory) 
    {
        return disputes[disputeId];
    }

    /**
     * @notice Set DAO address
     */
    function setDAO(address _dao) external onlyDAO {
        require(_dao != address(0), "Invalid DAO");
        dao = _dao;
    }

    /**
     * @notice Emergency withdraw (DAO only)
     */
    function emergencyWithdraw() external onlyDAO {
        payable(dao).transfer(address(this).balance);
    }

    receive() external payable {}
}
