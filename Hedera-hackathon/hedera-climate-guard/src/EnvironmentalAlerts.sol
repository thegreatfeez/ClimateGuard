// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "lib/openzeppelin-contracts/contracts/access/AccessControl.sol";
import "lib/openzeppelin-contracts/contracts/utils/Pausable.sol";

/**
 * @title EnvironmentalAlerts
 * @dev Stores environmental alert proofs on-chain
 */
contract EnvironmentalAlerts is AccessControl, Pausable {
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    
    enum AlertCategory {
        Storm,
        Flood,
        AirQuality,
        Heatwave,
        Drought,
        Wildfire,
        Other
    }
    
    enum Severity {
        Low,
        Medium,
        High,
        Critical
    }
    
    struct Alert {
        bytes32 dataHash;      // Hash of off-chain alert data
        AlertCategory category;
        Severity severity;
        string location;       // Geographic identifier (e.g., "TX-USA")
        uint256 timestamp;
        address submittedBy;
        bool isActive;
    }
    
    // Alert ID => Alert
    mapping(uint256 => Alert) public alerts;
    uint256 public alertCount;
    
    // Location => Alert IDs
    mapping(string => uint256[]) public alertsByLocation;
    
    // Category => Alert IDs
    mapping(AlertCategory => uint256[]) public alertsByCategory;
    
    // Events
    event AlertCreated(
        uint256 indexed alertId,
        bytes32 dataHash,
        AlertCategory category,
        Severity severity,
        string location,
        uint256 timestamp
    );
    
    event AlertDeactivated(uint256 indexed alertId, uint256 timestamp);
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ORACLE_ROLE, msg.sender);
    }
    
    /**
     * @dev Submit environmental alert proof
     */
    function submitAlert(
        bytes32 dataHash,
        AlertCategory category,
        Severity severity,
        string memory location
    ) external onlyRole(ORACLE_ROLE) whenNotPaused returns (uint256) {
        require(dataHash != bytes32(0), "Invalid data hash");
        require(bytes(location).length > 0, "Location required");
        
        uint256 alertId = alertCount++;
        
        alerts[alertId] = Alert({
            dataHash: dataHash,
            category: category,
            severity: severity,
            location: location,
            timestamp: block.timestamp,
            submittedBy: msg.sender,
            isActive: true
        });
        
        alertsByLocation[location].push(alertId);
        alertsByCategory[category].push(alertId);
        
        emit AlertCreated(alertId, dataHash, category, severity, location, block.timestamp);
        
        return alertId;
    }
    
    /**
     * @dev Deactivate an alert (when condition resolves)
     */
    function deactivateAlert(uint256 alertId) external onlyRole(ORACLE_ROLE) {
        require(alertId < alertCount, "Invalid alert ID");
        require(alerts[alertId].isActive, "Alert already inactive");
        
        alerts[alertId].isActive = false;
        
        emit AlertDeactivated(alertId, block.timestamp);
    }
    
    /**
     * @dev Get active alerts for a location
     */
    function getActiveAlertsByLocation(string memory location) 
        external 
        view 
        returns (uint256[] memory) 
    {
        uint256[] memory locationAlerts = alertsByLocation[location];
        
        // Count active alerts
        uint256 activeCount = 0;
        for (uint256 i = 0; i < locationAlerts.length; i++) {
            if (alerts[locationAlerts[i]].isActive) {
                activeCount++;
            }
        }
        
        // Create array of active alert IDs
        uint256[] memory activeAlerts = new uint256[](activeCount);
        uint256 index = 0;
        for (uint256 i = 0; i < locationAlerts.length; i++) {
            if (alerts[locationAlerts[i]].isActive) {
                activeAlerts[index++] = locationAlerts[i];
            }
        }
        
        return activeAlerts;
    }
    
    /**
     * @dev Verify alert data integrity
     */
    function verifyAlertData(uint256 alertId, bytes memory data) 
        external 
        view 
        returns (bool) 
    {
        require(alertId < alertCount, "Invalid alert ID");
        return keccak256(data) == alerts[alertId].dataHash;
    }
    
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }
    
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
}