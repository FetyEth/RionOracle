// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interfaces/IDisputeManager.sol";
import "./interfaces/IAggregator.sol";
import "./interfaces/IInsuranceVault.sol";

/**
 * @title DisputeManager
 * @notice Handles disputes over incorrect oracle data
 * @dev Implements 5-phase dispute resolution with slashing
 */
contract DisputeManager is IDisputeManager {
    uint256 public disputeCount;
    uint256 public constant MIN_STAKE = 0.1 ether;
    uint256 public constant EVIDENCE_PERIOD = 1 hours;
    uint256 public constant VOTING_PERIOD = 2 hours;
    uint256 public constant SLASH_AMOUNT = 1 ether;
    
    mapping(uint256 => Dispute) public disputes;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => mapping(address => uint256)) public voteWeight;
    
    address public feedRegistry;
    address public insuranceVault;
    address public owner;
    address public dao;
    
    modifier onlyAuthorized() {
        require(
            msg.sender == owner || msg.sender == dao,
            "Not authorized"
        );
        _;
    }

    constructor(address _feedRegistry, address _insuranceVault) {
        feedRegistry = _feedRegistry;
        insuranceVault = _insuranceVault;
        owner = msg.sender;
    }

    /**
     * @notice Create a new dispute
     * @dev Anyone can challenge oracle data by staking BNB
     */
    function createDispute(
        bytes32 feedId,
        uint256 roundId,
        int256 claimedValue,
        bytes calldata proof
    ) external payable override returns (uint256 disputeId) {
        require(msg.value >= MIN_STAKE, "Insufficient stake");
        require(proof.length > 0, "Proof required");
        
        disputeId = ++disputeCount;
        
        disputes[disputeId] = Dispute({
            disputeId: disputeId,
            feedId: feedId,
            roundId: roundId,
            challenger: msg.sender,
            claimedValue: claimedValue,
            actualValue: 0, // Will be determined
            stake: msg.value,
            status: DisputeStatus.Proposed,
            votesFor: 0,
            votesAgainst: 0,
            createdAt: block.timestamp,
            resolvedAt: 0
        });
        
        emit DisputeCreated(disputeId, feedId, roundId, msg.sender);
        
        return disputeId;
    }

    /**
     * @notice Vote on a dispute
     * @dev Token holders vote on whether the dispute is valid
     */
    function vote(uint256 disputeId, bool support) external override {
        Dispute storage dispute = disputes[disputeId];
        
        require(dispute.status == DisputeStatus.Voting, "Not in voting phase");
        require(!hasVoted[disputeId][msg.sender], "Already voted");
        require(
            block.timestamp < dispute.createdAt + EVIDENCE_PERIOD + VOTING_PERIOD,
            "Voting period ended"
        );
        
        // In production, this would check token balance
        uint256 weight = 1 ether; // Simplified: 1 vote per address
        
        hasVoted[disputeId][msg.sender] = true;
        voteWeight[disputeId][msg.sender] = weight;
        
        if (support) {
            dispute.votesFor += weight;
        } else {
            dispute.votesAgainst += weight;
        }
        
        emit VoteCast(disputeId, msg.sender, support, weight);
    }

    /**
     * @notice Resolve a dispute
     * @dev Determines outcome and slashes providers if necessary
     */
    function resolveDispute(uint256 disputeId) external override {
        Dispute storage dispute = disputes[disputeId];
        
        require(
            dispute.status == DisputeStatus.Voting,
            "Not ready to resolve"
        );
        require(
            block.timestamp >= dispute.createdAt + EVIDENCE_PERIOD + VOTING_PERIOD,
            "Voting period not ended"
        );
        
        // Determine outcome
        bool disputeSuccessful = dispute.votesFor > dispute.votesAgainst;
        
        address[] memory slashedProviders = new address[](0);
        
        if (disputeSuccessful) {
            // Dispute was valid - slash providers and pay challenger
            dispute.status = DisputeStatus.Resolved;
            
            // Return stake + reward to challenger
            uint256 reward = dispute.stake + SLASH_AMOUNT;
            payable(dispute.challenger).transfer(reward);
            
            // Trigger insurance payouts
            // In production, this would identify and slash specific providers
            slashedProviders = new address[](1);
            slashedProviders[0] = address(0); // Placeholder
            
        } else {
            // Dispute was invalid - challenger loses stake
            dispute.status = DisputeStatus.Rejected;
            
            // Send stake to insurance vault
            payable(insuranceVault).transfer(dispute.stake);
        }
        
        dispute.resolvedAt = block.timestamp;
        
        emit DisputeResolved(disputeId, disputeSuccessful, slashedProviders);
    }

    /**
     * @notice Advance dispute to evidence phase
     */
    function advanceToEvidence(uint256 disputeId) external onlyAuthorized {
        Dispute storage dispute = disputes[disputeId];
        require(dispute.status == DisputeStatus.Proposed, "Invalid status");
        dispute.status = DisputeStatus.Evidence;
    }

    /**
     * @notice Advance dispute to voting phase
     */
    function advanceToVoting(uint256 disputeId) external onlyAuthorized {
        Dispute storage dispute = disputes[disputeId];
        require(dispute.status == DisputeStatus.Evidence, "Invalid status");
        require(
            block.timestamp >= dispute.createdAt + EVIDENCE_PERIOD,
            "Evidence period not ended"
        );
        dispute.status = DisputeStatus.Voting;
    }

    /**
     * @notice Get dispute details
     */
    function getDispute(uint256 disputeId) 
        external 
        view 
        override
        returns (Dispute memory) 
    {
        return disputes[disputeId];
    }

    /**
     * @notice Set DAO address
     */
    function setDAO(address _dao) external onlyAuthorized {
        require(_dao != address(0), "Invalid DAO");
        dao = _dao;
    }

    /**
     * @notice Update insurance vault
     */
    function setInsuranceVault(address _vault) external onlyAuthorized {
        require(_vault != address(0), "Invalid vault");
        insuranceVault = _vault;
    }

    receive() external payable {}
}
