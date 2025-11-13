// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../contracts/InsuranceVault.sol";

contract InsuranceVaultTest is Test {
    InsuranceVault public vault;
    
    address owner = address(1);
    address claimant = address(2);
    
    bytes32 constant FEED_ID = keccak256("BNB/USD");
    
    function setUp() public {
        vm.prank(owner);
        vault = new InsuranceVault();
        
        // Fund vault
        vm.deal(address(vault), 100 ether);
    }
    
    function testSubmitClaim() public {
        vm.prank(claimant);
        uint256 claimId = vault.submitClaim(
            FEED_ID,
            1, // roundId
            1, // disputeId
            5 ether, // loss amount
            "Lost funds due to bad oracle data"
        );
        
        assertEq(claimId, 1);
        
        IInsuranceVault.Claim memory claim = vault.getClaim(claimId);
        assertEq(claim.claimant, claimant);
        assertEq(claim.lossAmount, 5 ether);
        assertFalse(claim.processed);
    }
    
    function testProcessClaimApproved() public {
        vm.prank(claimant);
        uint256 claimId = vault.submitClaim(
            FEED_ID,
            1,
            1,
            5 ether,
            "Lost funds"
        );
        
        uint256 balanceBefore = claimant.balance;
        
        vm.prank(owner);
        vault.processClaim(claimId, true, 4 ether);
        
        IInsuranceVault.Claim memory claim = vault.getClaim(claimId);
        assertTrue(claim.processed);
        assertTrue(claim.approved);
        assertEq(claim.payoutAmount, 4 ether);
        assertEq(claimant.balance, balanceBefore + 4 ether);
    }
    
    function testProcessClaimRejected() public {
        vm.prank(claimant);
        uint256 claimId = vault.submitClaim(
            FEED_ID,
            1,
            1,
            5 ether,
            "Lost funds"
        );
        
        vm.prank(owner);
        vault.processClaim(claimId, false, 0);
        
        IInsuranceVault.Claim memory claim = vault.getClaim(claimId);
        assertTrue(claim.processed);
        assertFalse(claim.approved);
        assertEq(claim.payoutAmount, 0);
    }
    
    function testFundVault() public {
        uint256 balanceBefore = address(vault).balance;
        
        vm.deal(address(3), 10 ether);
        vm.prank(address(3));
        vault.fundVault{value: 5 ether}();
        
        assertEq(address(vault).balance, balanceBefore + 5 ether);
    }
}
