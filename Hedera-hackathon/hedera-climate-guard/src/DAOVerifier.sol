// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CarbonFootprintTracker.sol";
import "./ClimateToken.sol";

/**
 * @title DAOVerifier
 * @dev DAO members vote to verify user activities on-chain
 */
contract DAOVerifier {
    CarbonFootprintTracker public tracker;
    ClimateToken public token;
    
    // Minimum CGT tokens required to become a verifier
    uint256 public constant MIN_VERIFIER_STAKE = 1000 * 10**18;
    
    // Minimum votes required to approve verification
    uint256 public constant MIN_VOTES_REQUIRED = 3;
    
    struct VerificationRequest {
        address user;
        uint256 activityId;
        uint256 proposedPoints;
        uint256 votesFor;
        uint256 votesAgainst;
        mapping(address => bool) hasVoted;
        bool executed;
        uint256 createdAt;
    }
    
    // Mapping of verifiers
    mapping(address => bool) public isVerifier;
    uint256 public verifierCount;
    
    // Verification requests
    mapping(uint256 => VerificationRequest) public verificationRequests;
    uint256 public requestCount;
    
    // Events
    event VerifierAdded(address indexed verifier);
    event VerifierRemoved(address indexed verifier);
    event VerificationRequested(
        uint256 indexed requestId,
        address indexed user,
        uint256 activityId,
        uint256 proposedPoints
    );
    event VoteCast(
        uint256 indexed requestId,
        address indexed verifier,
        bool vote
    );
    event VerificationExecuted(
        uint256 indexed requestId,
        address indexed user,
        uint256 activityId,
        bool approved
    );
    
    constructor(address _tracker, address _token) {
        tracker = CarbonFootprintTracker(_tracker);
        token = ClimateToken(_token);
    }
    
    modifier onlyVerifier() {
        require(isVerifier[msg.sender], "Not a verifier");
        _;
    }
    
    /**
     * @dev Become a verifier by staking tokens
     */
    function becomeVerifier() external {
        require(!isVerifier[msg.sender], "Already a verifier");
        require(
            token.balanceOf(msg.sender) >= MIN_VERIFIER_STAKE,
            "Insufficient CGT tokens"
        );
        
        isVerifier[msg.sender] = true;
        verifierCount++;
        
        emit VerifierAdded(msg.sender);
    }
    
    /**
     * @dev Remove yourself as verifier
     */
    function removeVerifier() external {
        require(isVerifier[msg.sender], "Not a verifier");
        
        isVerifier[msg.sender] = false;
        verifierCount--;
        
        emit VerifierRemoved(msg.sender);
    }
    
    /**
     * @dev Request verification for a user's activity
     */
    function requestVerification(
        address user,
        uint256 activityId,
        uint256 proposedPoints
    ) external onlyVerifier returns (uint256) {
        require(proposedPoints > 0, "Points must be > 0");
        
        uint256 requestId = requestCount++;
        VerificationRequest storage request = verificationRequests[requestId];
        
        request.user = user;
        request.activityId = activityId;
        request.proposedPoints = proposedPoints;
        request.votesFor = 0;
        request.votesAgainst = 0;
        request.executed = false;
        request.createdAt = block.timestamp;
        
        emit VerificationRequested(requestId, user, activityId, proposedPoints);
        
        return requestId;
    }
    
    /**
     * @dev Vote on a verification request
     */
    function vote(uint256 requestId, bool approve) external onlyVerifier {
        VerificationRequest storage request = verificationRequests[requestId];
        
        require(!request.executed, "Already executed");
        require(!request.hasVoted[msg.sender], "Already voted");
        require(
            block.timestamp < request.createdAt + 7 days,
            "Voting period expired"
        );
        
        request.hasVoted[msg.sender] = true;
        
        if (approve) {
            request.votesFor++;
        } else {
            request.votesAgainst++;
        }
        
        emit VoteCast(requestId, msg.sender, approve);
        
        // Auto-execute if minimum votes reached
        if (request.votesFor >= MIN_VOTES_REQUIRED) {
            executeVerification(requestId);
        } else if (request.votesAgainst >= MIN_VOTES_REQUIRED) {
            request.executed = true;
            emit VerificationExecuted(requestId, request.user, request.activityId, false);
        }
    }
    
    /**
     * @dev Execute verification if approved
     */
    function executeVerification(uint256 requestId) internal {
        VerificationRequest storage request = verificationRequests[requestId];
        
        require(!request.executed, "Already executed");
        require(request.votesFor >= MIN_VOTES_REQUIRED, "Not enough votes");
        
        request.executed = true;
        
        // Call tracker to verify activity
        tracker.verifyActivity(
            request.user,
            request.activityId,
            request.proposedPoints
        );
        
        emit VerificationExecuted(requestId, request.user, request.activityId, true);
    }
    
    /**
     * @dev Get verification request details
     */
    function getVerificationRequest(uint256 requestId) 
        external 
        view 
        returns (
            address user,
            uint256 activityId,
            uint256 proposedPoints,
            uint256 votesFor,
            uint256 votesAgainst,
            bool executed,
            uint256 createdAt
        ) 
    {
        VerificationRequest storage request = verificationRequests[requestId];
        return (
            request.user,
            request.activityId,
            request.proposedPoints,
            request.votesFor,
            request.votesAgainst,
            request.executed,
            request.createdAt
        );
    }
    
    /**
     * @dev Check if verifier has voted
     */
    function hasVoted(uint256 requestId, address verifier) 
        external 
        view 
        returns (bool) 
    {
        return verificationRequests[requestId].hasVoted[verifier];
    }
}