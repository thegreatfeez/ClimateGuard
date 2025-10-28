// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "lib/openzeppelin-contracts/contracts/access/AccessControl.sol";
import "lib/openzeppelin-contracts/contracts/utils/Pausable.sol";

contract SubscriptionManager is AccessControl, Pausable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    
    enum Tier {
        Free,
        Premium,
        Enterprise
    }
    
    struct Subscription {
        Tier tier;
        uint256 expiresAt;
        bool autoRenew;
    }
    
    // Pricing (in wei)
    uint256 public premiumPrice = 0.01 ether; // ~$9.99 equivalent
    uint256 public enterprisePrice = 0.05 ether; // ~$49.99 equivalent
    
    mapping(address => Subscription) public subscriptions;
    
    event SubscriptionPurchased(address indexed user, Tier tier, uint256 expiresAt);
    event SubscriptionRenewed(address indexed user, Tier tier, uint256 expiresAt);
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }
    
    function subscribe(Tier tier) external payable whenNotPaused {
        require(tier != Tier.Free, "Use free tier by default");
        
        uint256 price = tier == Tier.Premium ? premiumPrice : enterprisePrice;
        require(msg.value >= price, "Insufficient payment");
        
        uint256 duration = 30 days;
        uint256 expiresAt = block.timestamp + duration;
        
        subscriptions[msg.sender] = Subscription({
            tier: tier,
            expiresAt: expiresAt,
            autoRenew: false
        });
        
        emit SubscriptionPurchased(msg.sender, tier, expiresAt);
        
        // Refund excess
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }
    }
    
    function getUserTier(address user) external view returns (Tier) {
        Subscription memory sub = subscriptions[user];
        
        if (sub.expiresAt < block.timestamp) {
            return Tier.Free;
        }
        
        return sub.tier;
    }
    
    function isActive(address user) external view returns (bool) {
        return subscriptions[user].expiresAt >= block.timestamp;
    }
    
    function withdraw() external onlyRole(ADMIN_ROLE) {
        payable(msg.sender).transfer(address(this).balance);
    }
    
    function setPricing(uint256 _premiumPrice, uint256 _enterprisePrice) 
        external 
        onlyRole(ADMIN_ROLE) 
    {
        premiumPrice = _premiumPrice;
        enterprisePrice = _enterprisePrice;
    }
    
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }
    
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }
}