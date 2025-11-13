// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../contracts/DisputeManager.sol";
import "../contracts/FeedRegistry.sol";
import "../contracts/InsuranceVault.sol";

contract DisputeManagerTest is Test {
    DisputeManager public disputeManager;
    FeedRegistry public feedRegistry;
    InsuranceVault public insuranceVault;
    
    bytes32 constant FEED_ID = keccak256("BNB/USD");
    uint256 constant ROUND_ID = 1;
    
    address challenger = address(1);
    address voter1 = address(2);
    address voter2 = address(3);
    
    function setUp() public {
        feedRegistry = new FeedRegistry();
        insuranceVault = new InsuranceVault();
        disputeManager = new DisputeManager(
            address(feedRegistry),
            address(insuranceVault)
        );
        
        // Fund test accounts
        vm.deal(challenger, 10 ether);
        vm.deal(voter1, 10 ether);
        vm.deal(voter2, 10 ether);
    }
    
    function testCreateDispute() public {
        vm.prank(challenger);
        uint256 disputeId = disputeManager.createDispute{value: 0.1 ether}(
            FEED_ID,
            ROUND_ID,
            50000, // claimed value
            hex"00" // Empty proof placeholder
        );
        
        assertEq(disputeId, 1);
        
        IDisputeManager.Dispute memory dispute = disputeManager.getDispute(disputeId);
        assertEq(dispute.challenger, challenger);
        assertEq(dispute.feedId, FEED_ID);
        assertEq(dispute.roundId, ROUND_ID);
        assertEq(dispute.stake, 0.1 ether);
    }
    
    function testCannotCreateDisputeWithInsufficientStake() public {
        vm.prank(challenger);
        vm.expectRevert("Insufficient stake");
        disputeManager.createDispute{value: 0.01 ether}(
            FEED_ID,
            ROUND_ID,
            50000,
            hex"00"
        );
    }
    
    function testVoteOnDispute() public {
        // Create dispute
        vm.prank(challenger);
        uint256 disputeId = disputeManager.createDispute{value: 0.1 ether}(
            FEED_ID,
            ROUND_ID,
            50000,
            hex"00"
        );
        
        // Advance to voting phase
        disputeManager.advanceToEvidence(disputeId);
        vm.warp(block.timestamp + 1 hours);
        disputeManager.advanceToVoting(disputeId);
        
        // Vote
        vm.prank(voter1);
        disputeManager.vote(disputeId, true);
        
        IDisputeManager.Dispute memory dispute = disputeManager.getDispute(disputeId);
        assertEq(dispute.votesFor, 1 ether);
    }
    
    function testCannotVoteTwice() public {
        vm.prank(challenger);
        uint256 disputeId = disputeManager.createDispute{value: 0.1 ether}(
            FEED_ID,
            ROUND_ID,
            50000,
            hex"00"
        );
        
        disputeManager.advanceToEvidence(disputeId);
        vm.warp(block.timestamp + 1 hours);
        disputeManager.advanceToVoting(disputeId);
        
        vm.startPrank(voter1);
        disputeManager.vote(disputeId, true);
        
        vm.expectRevert("Already voted");
        disputeManager.vote(disputeId, true);
        vm.stopPrank();
    }
}
