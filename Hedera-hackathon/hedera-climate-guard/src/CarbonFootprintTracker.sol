// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "lib/openzeppelin-contracts/contracts/access/AccessControl.sol";
import "lib/openzeppelin-contracts/contracts/utils/Pausable.sol";
import "lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";

/**
 * @title CarbonFootprintTracker
 * @dev Track user carbon footprint activities and points
 */
contract CarbonFootprintTracker is AccessControl, Pausable, ReentrancyGuard {
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    
    enum ActivityType {
        EnergyUsage,
        Transportation,
        Recycling,
        TreePlanting,
        RenewableEnergy,
        WaterConservation,
        WasteReduction,
        Other
    }
    
    struct Activity {
        bytes32 dataHash;       // Hash of activity details
        ActivityType activityType;
        int256 carbonImpact;    // Positive = emission, Negative = offset (grams CO2)
        uint256 points;         // Reward points earned
        uint256 timestamp;
        bool verified;
        address verifiedBy;
    }
    
    struct UserProfile {
        int256 totalCarbonImpact;  // Net carbon impact (grams CO2)
        uint256 totalPoints;       // Total points earned
        uint256 activityCount;
        uint256 joinedAt;
        bool isActive;
    }
    
    // User address => Profile
    mapping(address => UserProfile) public userProfiles;
    
    // User address => Activity ID => Activity
    mapping(address => mapping(uint256 => Activity)) public userActivities;
    
    // Points multiplier per activity type (basis points, 10000 = 1x)
    mapping(ActivityType => uint256) public activityMultipliers;
    
    // Total users
    uint256 public totalUsers;
    
    // Events
    event ActivityLogged(
        address indexed user,
        uint256 indexed activityId,
        bytes32 dataHash,
        ActivityType activityType,
        int256 carbonImpact,
        uint256 timestamp
    );
    
    event ActivityVerified(
        address indexed user,
        uint256 indexed activityId,
        uint256 pointsAwarded,
        address verifier
    );
    
    event UserRegistered(address indexed user, uint256 timestamp);
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
        
        // Set default multipliers (10000 = 1x)
        activityMultipliers[ActivityType.TreePlanting] = 30000;      // 3x
        activityMultipliers[ActivityType.RenewableEnergy] = 25000;   // 2.5x
        activityMultipliers[ActivityType.Recycling] = 15000;         // 1.5x
        activityMultipliers[ActivityType.WaterConservation] = 12000; // 1.2x
        activityMultipliers[ActivityType.WasteReduction] = 12000;    // 1.2x
        activityMultipliers[ActivityType.EnergyUsage] = 10000;       // 1x
        activityMultipliers[ActivityType.Transportation] = 10000;    // 1x
        activityMultipliers[ActivityType.Other] = 10000;             // 1x
    }
    
    /**
     * @dev Register a new user
     */
    function registerUser() external whenNotPaused {
        require(!userProfiles[msg.sender].isActive, "User already registered");
        
        userProfiles[msg.sender] = UserProfile({
            totalCarbonImpact: 0,
            totalPoints: 0,
            activityCount: 0,
            joinedAt: block.timestamp,
            isActive: true
        });
        
        totalUsers++;
        
        emit UserRegistered(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Log a carbon footprint activity
     */
    function logActivity(
        bytes32 dataHash,
        ActivityType activityType,
        int256 carbonImpact
    ) external whenNotPaused returns (uint256) {
        require(userProfiles[msg.sender].isActive, "User not registered");
        require(dataHash != bytes32(0), "Invalid data hash");
        
        UserProfile storage profile = userProfiles[msg.sender];
        uint256 activityId = profile.activityCount++;
        
        userActivities[msg.sender][activityId] = Activity({
            dataHash: dataHash,
            activityType: activityType,
            carbonImpact: carbonImpact,
            points: 0,
            timestamp: block.timestamp,
            verified: false,
            verifiedBy: address(0)
        });
        
        emit ActivityLogged(
            msg.sender,
            activityId,
            dataHash,
            activityType,
            carbonImpact,
            block.timestamp
        );
        
        return activityId;
    }
    
    /**
     * @dev Verify activity and award points
     */
    function verifyActivity(
        address user,
        uint256 activityId,
        uint256 basePoints
    ) external onlyRole(VERIFIER_ROLE) whenNotPaused {
        require(userProfiles[user].isActive, "User not registered");
        require(activityId < userProfiles[user].activityCount, "Invalid activity ID");
        
        Activity storage activity = userActivities[user][activityId];
        require(!activity.verified, "Activity already verified");
        
        // Calculate points with multiplier
        uint256 multiplier = activityMultipliers[activity.activityType];
        uint256 finalPoints = (basePoints * multiplier) / 10000;
        
        activity.points = finalPoints;
        activity.verified = true;
        activity.verifiedBy = msg.sender;
        
        UserProfile storage profile = userProfiles[user];
        profile.totalPoints += finalPoints;
        profile.totalCarbonImpact += activity.carbonImpact;
        
        emit ActivityVerified(user, activityId, finalPoints, msg.sender);
    }
    
    /**
     * @dev Get user's verified activities
     */
    function getUserVerifiedActivities(address user) 
        external 
        view 
        returns (uint256[] memory) 
    {
        UserProfile memory profile = userProfiles[user];
        
        uint256 verifiedCount = 0;
        for (uint256 i = 0; i < profile.activityCount; i++) {
            if (userActivities[user][i].verified) {
                verifiedCount++;
            }
        }
        
        uint256[] memory verifiedActivities = new uint256[](verifiedCount);
        uint256 index = 0;
        for (uint256 i = 0; i < profile.activityCount; i++) {
            if (userActivities[user][i].verified) {
                verifiedActivities[index++] = i;
            }
        }
        
        return verifiedActivities;
    }
    
    /**
     * @dev Verify activity data integrity
     */
    function verifyActivityData(
        address user,
        uint256 activityId,
        bytes memory data
    ) external view returns (bool) {
        require(activityId < userProfiles[user].activityCount, "Invalid activity ID");
        return keccak256(data) == userActivities[user][activityId].dataHash;
    }
    
    /**
     * @dev Update activity multiplier
     */
    function setActivityMultiplier(ActivityType activityType, uint256 multiplier) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        require(multiplier >= 5000 && multiplier <= 50000, "Invalid multiplier");
        activityMultipliers[activityType] = multiplier;
    }
    
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }
    
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
}