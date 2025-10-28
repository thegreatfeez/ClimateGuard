// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "lib/openzeppelin-contracts/contracts/access/AccessControl.sol";
import "lib/openzeppelin-contracts/contracts/utils/Pausable.sol";
import "lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";
import "./ClimateToken.sol";
import "./CarbonFootprintTracker.sol";

/**
 * @title RewardDistributor
 * @dev Manages token rewards for verified activities
 */
contract RewardDistributor is AccessControl, Pausable, ReentrancyGuard {
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");
    
    ClimateToken public climateToken;
    CarbonFootprintTracker public footprintTracker;
    
    // Points to token conversion rate (points per 1 token, scaled by 1e18)
    uint256 public conversionRate = 100 * 10**18; // 100 points = 1 token
    
    // Minimum points required for redemption
    uint256 public minimumRedemption = 1000; // 1000 points minimum
    
    // User address => total tokens claimed
    mapping(address => uint256) public totalClaimed;
    
    // User address => last claim timestamp
    mapping(address => uint256) public lastClaimTime;
    
    // Cooldown period between claims (in seconds)
    uint256 public claimCooldown = 24 hours;
    
    // Events
    event RewardsClaimed(
        address indexed user,
        uint256 pointsRedeemed,
        uint256 tokensReceived,
        uint256 timestamp
    );
    
    event ConversionRateUpdated(uint256 oldRate, uint256 newRate);
    
    constructor(
        address _climateToken,
        address _footprintTracker
    ) {
        require(_climateToken != address(0), "Invalid token address");
        require(_footprintTracker != address(0), "Invalid tracker address");
        
        climateToken = ClimateToken(_climateToken);
        footprintTracker = CarbonFootprintTracker(_footprintTracker);
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(DISTRIBUTOR_ROLE, msg.sender);
    }
    
    /**
     * @dev Claim token rewards for accumulated points
     */
    function claimRewards(uint256 pointsToRedeem) 
        external 
        whenNotPaused 
        nonReentrant 
    {
        require(pointsToRedeem >= minimumRedemption, "Below minimum redemption");
        require(
            block.timestamp >= lastClaimTime[msg.sender] + claimCooldown,
            "Claim cooldown active"
        );
        
        (int256 totalImpact, uint256 availablePoints, , , ) = 
            footprintTracker.userProfiles(msg.sender);
        
        require(availablePoints >= pointsToRedeem, "Insufficient points");
        
        // Calculate tokens to mint
        uint256 tokensToMint = (pointsToRedeem * 10**18) / conversionRate;
        require(tokensToMint > 0, "Amount too small");
        
        // Mint tokens to user
        climateToken.mint(msg.sender, tokensToMint);
        
        // Update claim records
        totalClaimed[msg.sender] += tokensToMint;
        lastClaimTime[msg.sender] = block.timestamp;
        
        emit RewardsClaimed(msg.sender, pointsToRedeem, tokensToMint, block.timestamp);
    }
    
    /**
     * @dev Calculate claimable tokens for a user
     */
    function getClaimableTokens(address user) external view returns (uint256) {
        (, uint256 availablePoints, , , ) = footprintTracker.userProfiles(user);
        
        if (availablePoints < minimumRedemption) return 0;
        if (block.timestamp < lastClaimTime[user] + claimCooldown) return 0;
        
        return (availablePoints * 10**18) / conversionRate;
    }
    
    /**
     * @dev Update conversion rate
     */
    function setConversionRate(uint256 newRate) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        require(newRate > 0, "Invalid rate");
        uint256 oldRate = conversionRate;
        conversionRate = newRate;
        emit ConversionRateUpdated(oldRate, newRate);
    }
    
    /**
     * @dev Update minimum redemption amount
     */
    function setMinimumRedemption(uint256 amount) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        minimumRedemption = amount;
    }
    
    /**
     * @dev Update claim cooldown period
     */
    function setClaimCooldown(uint256 cooldown) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        require(cooldown >= 1 hours && cooldown <= 7 days, "Invalid cooldown");
        claimCooldown = cooldown;
    }
    
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }
    
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
}