// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {ClimateToken} from "../src/ClimateToken.sol";
import {EnvironmentalAlerts} from "../src/EnvironmentalAlerts.sol";
import {CarbonFootprintTracker} from "../src/CarbonFootprintTracker.sol";
import {RewardDistributor} from "../src/RewardDistributor.sol";

contract DeployClimateGuardian is Script {
    function run() external returns (address, address, address, address) {
        // Load the private key from the .env file
        uint256 deployerPrivateKey = vm.envUint("HEDERA_PRIVATE_KEY");
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Get the deployer's address
        address deployerAddress = vm.addr(deployerPrivateKey);

        console.log("==================================================");
        console.log("Deploying Climate Guardian DApp");
        console.log("==================================================");
        console.log("Deployer address:", deployerAddress);
        console.log("Deployer balance:", deployerAddress.balance);
        console.log("");

        // Step 1: Deploy ClimateToken
        console.log("Step 1: Deploying ClimateToken...");
        ClimateToken token = new ClimateToken();
        console.log("ClimateToken deployed at:", address(token));
        console.log("");

        // Step 2: Deploy EnvironmentalAlerts
        console.log("Step 2: Deploying EnvironmentalAlerts...");
        EnvironmentalAlerts alerts = new EnvironmentalAlerts();
        console.log("EnvironmentalAlerts deployed at:", address(alerts));
        console.log("");

        // Step 3: Deploy CarbonFootprintTracker
        console.log("Step 3: Deploying CarbonFootprintTracker...");
        CarbonFootprintTracker tracker = new CarbonFootprintTracker();
        console.log("CarbonFootprintTracker deployed at:", address(tracker));
        console.log("");

        // Step 4: Deploy RewardDistributor
        console.log("Step 4: Deploying RewardDistributor...");
        RewardDistributor distributor = new RewardDistributor(
            address(token),
            address(tracker)
        );
        console.log("RewardDistributor deployed at:", address(distributor));
        console.log("");

        // Step 5: Grant MINTER_ROLE to RewardDistributor
        console.log("Step 5: Configuring permissions...");
        bytes32 MINTER_ROLE = token.MINTER_ROLE();
        token.grantRole(MINTER_ROLE, address(distributor));
        console.log("MINTER_ROLE granted to RewardDistributor");
        console.log("");

        // Stop broadcasting
        vm.stopBroadcast();

        // Print deployment summary
        console.log("==================================================");
        console.log("Deployment Summary");
        console.log("==================================================");
        console.log("ClimateToken:", address(token));
        console.log("EnvironmentalAlerts:", address(alerts));
        console.log("CarbonFootprintTracker:", address(tracker));
        console.log("RewardDistributor:", address(distributor));
        console.log("");
        console.log("Save these to your .env:");
        console.log("CLIMATE_TOKEN_ADDRESS=%s", address(token));
        console.log("ALERTS_ADDRESS=%s", address(alerts));
        console.log("TRACKER_ADDRESS=%s", address(tracker));
        console.log("DISTRIBUTOR_ADDRESS=%s", address(distributor));
        console.log("==================================================");

        return (address(token), address(alerts), address(tracker), address(distributor));
    }
}