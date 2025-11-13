// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interfaces/IInsuranceVault.sol";

/**
 * @title InsuranceVault
 * @notice Compensates users affected by incorrect oracle data
 * @dev Implements actual user compensation, not just slashing
 */
contract InsuranceVault is IInsuranceVault {
    uint256 public claimCount;
    uint256 public constant MAX_PAYOUT_RATIO = 80; // 80% of loss
    uint256 public constant MIN_VAULT_RESERVE = 10 ether;
    
    mapping(uint256 => Claim) public claims;
    
    address public owner;
    address public disputeContract;
    address public dao;
    
    modifier onlyAuthorized() {
        require(
            msg.sender == owner || 
            msg.sender == disputeContract || 
            msg.sender == dao,
            "Not authorized"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Submit an insurance claim
     * @dev Users can claim compensation for losses due to bad oracle data
     */
    function submitClaim(
        bytes32 feedId,
        uint256 roundId,
        uint256 disputeId,
        uint256 lossAmount,
        string calldata description
    ) external override returns (uint256 claimId) {
        require(lossAmount > 0, "Invalid loss amount");
        require(bytes(description).length > 0, "Description required");
        
        claimId = ++claimCount;
        
        claims[claimId] = Claim({
            claimant: msg.sender,
            feedId: feedId,
            roundId: roundId,
            disputeId: disputeId,
            lossAmount: lossAmount,
            description: description,
            timestamp: block.timestamp,
            processed: false,
            approved: false,
            payoutAmount: 0
        });
        
        emit ClaimSubmitted(claimId, msg.sender, feedId, lossAmount);
        
        return claimId;
    }

    /**
     * @notice Process a claim (DAO/authorized only)
     * @dev Validates claim and pays out if approved
     */
    function processClaim(
        uint256 claimId,
        bool approve,
        uint256 payoutAmount
    ) external override onlyAuthorized {
        Claim storage claim = claims[claimId];
        
        require(!claim.processed, "Already processed");
        require(claim.claimant != address(0), "Invalid claim");
        
        claim.processed = true;
        claim.approved = approve;
        
        if (approve) {
            // Cap payout at MAX_PAYOUT_RATIO of loss
            uint256 maxPayout = (claim.lossAmount * MAX_PAYOUT_RATIO) / 100;
            uint256 actualPayout = payoutAmount > maxPayout 
                ? maxPayout 
                : payoutAmount;
            
            // Ensure vault has sufficient funds
            require(
                address(this).balance >= actualPayout + MIN_VAULT_RESERVE,
                "Insufficient vault balance"
            );
            
            claim.payoutAmount = actualPayout;
            payable(claim.claimant).transfer(actualPayout);
        }
        
        emit ClaimProcessed(claimId, approve, claim.payoutAmount);
    }

    /**
     * @notice Fund the insurance vault
     * @dev Anyone can contribute to the insurance pool
     */
    function fundVault() external payable override {
        require(msg.value > 0, "Invalid amount");
        emit VaultFunded(msg.sender, msg.value);
    }

    /**
     * @notice Get current vault balance
     */
    function getVaultBalance() external view override returns (uint256) {
        return address(this).balance;
    }

    /**
     * @notice Get claim details
     */
    function getClaim(uint256 claimId) 
        external 
        view 
        override
        returns (Claim memory) 
    {
        return claims[claimId];
    }

    /**
     * @notice Set dispute contract address
     */
    function setDisputeContract(address _dispute) external onlyAuthorized {
        require(_dispute != address(0), "Invalid address");
        disputeContract = _dispute;
    }

    /**
     * @notice Set DAO address
     */
    function setDAO(address _dao) external onlyAuthorized {
        require(_dao != address(0), "Invalid DAO");
        dao = _dao;
    }

    /**
     * @notice Withdraw excess funds (DAO only)
     */
    function withdrawExcess(uint256 amount) external onlyAuthorized {
        require(
            address(this).balance - amount >= MIN_VAULT_RESERVE,
            "Must maintain reserve"
        );
        payable(dao).transfer(amount);
        emit VaultWithdrawn(dao, amount);
    }

    receive() external payable {
        emit VaultFunded(msg.sender, msg.value);
    }
}
