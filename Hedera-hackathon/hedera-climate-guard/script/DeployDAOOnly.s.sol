// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {DAOVerifier} from "../src/DAOVerifier.sol";
import {CarbonFootprintTracker} from "../src/CarbonFootprintTracker.sol";

contract DeployDAOOnly is Script {
    
    address constant TRACKER_ADDRESS = 0xa55B89e5dB076F8699EB7F781252a7C6ceD52b0a;
    address constant TOKEN_ADDRESS = 0xFe3C05334d3383F75F54853962425E3DFF2DCa86;

    function run() external returns (address) {
        // Load the private key from the .env file
        uint256 deployerPrivateKey = vm.envUint("HEDERA_PRIVATE_KEY");
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Get the deployer's address
        address deployerAddress = vm.addr(deployerPrivateKey);

        console.log("==================================================");
        console.log("Deploying ONLY DAOVerifier");
        console.log("==================================================");
        console.log("Deployer address:", deployerAddress);
        console.log("Deployer balance:", deployerAddress.balance);
        console.log("");
        console.log("Using existing contracts:");
        console.log("  CarbonFootprintTracker:", TRACKER_ADDRESS);
        console.log("  ClimateToken:", TOKEN_ADDRESS);
        console.log("");

        // Deploy DAOVerifier
        console.log("Deploying DAOVerifier...");
        DAOVerifier daoVerifier = new DAOVerifier(
            TRACKER_ADDRESS,
            TOKEN_ADDRESS
        );
        console.log("DAOVerifier deployed at:", address(daoVerifier));
        console.log("");

        // Grant VERIFIER_ROLE to DAOVerifier
        console.log("Granting VERIFIER_ROLE to DAOVerifier...");
        CarbonFootprintTracker tracker = CarbonFootprintTracker(TRACKER_ADDRESS);
        bytes32 VERIFIER_ROLE = tracker.VERIFIER_ROLE();
        tracker.grantRole(VERIFIER_ROLE, address(daoVerifier));
        console.log("VERIFIER_ROLE granted successfully!");
        console.log("");

        // Stop broadcasting
        vm.stopBroadcast();

        // Print deployment summary
        console.log("==================================================");
        console.log("Deployment Complete!");
        console.log("==================================================");
        console.log("DAOVerifier Address:", address(daoVerifier));
        console.log("");
        console.log("Update your frontend addresses.js:");
        console.log("==================================================");
        console.log("export const CONTRACT_ADDRESSES = {");
        console.log("  CLIMATE_TOKEN: '0xFe3C05334d3383F75F54853962425E3DFF2DCa86',");
        console.log("  ALERTS: '0x60398DeE3F3424aebA2a4357b0C7bDDA65b0b46F',");
        console.log("  TRACKER: '0xa55B89e5dB076F8699EB7F781252a7C6ceD52b0a',");
        console.log("  DISTRIBUTOR: '0x45240bBb4b5fb7Cc515c67E68525DA28f7D9DCA1',");
        console.log("  DAO_VERIFIER: '%s', // NEW!", address(daoVerifier));
        console.log("  SUBSCRIPTION: '',");
        console.log("};");
        console.log("==================================================");

        return address(daoVerifier);
    }
}