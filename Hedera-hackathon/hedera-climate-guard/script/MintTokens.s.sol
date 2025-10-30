// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {ClimateToken} from "../src/ClimateToken.sol";

contract MintTokens is Script {
    address constant TOKEN_ADDRESS = 0xFe3C05334d3383F75F54853962425E3DFF2DCa86;
    address constant RECIPIENT_ADDRESS = 0xB8cf8E77c2b92Ce0C0FB3efa4B04ceBFde557695; // Your wallet address

    function run() external {
        // Load the private key from the .env file
        uint256 deployerPrivateKey = vm.envUint("HEDERA_PRIVATE_KEY");
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Get the deployer's address
        address deployerAddress = vm.addr(deployerPrivateKey);

        console.log("==================================================");
        console.log("Minting CGT Tokens");
        console.log("==================================================");
        console.log("Token Address:", TOKEN_ADDRESS);
        console.log("Deployer Address:", deployerAddress);
        console.log("Recipient Address:", RECIPIENT_ADDRESS);
        console.log("");

        // Connect to token contract
        ClimateToken token = ClimateToken(TOKEN_ADDRESS);

        // Check current balance of recipient
        uint256 currentBalance = token.balanceOf(RECIPIENT_ADDRESS);
        console.log("Current recipient balance:", currentBalance / 1e18, "CGT");
        console.log("");

        // Mint 10,000 CGT tokens to the recipient address
        uint256 amountToMint = 30_000 * 10**18; // 30,000 CGT
        console.log("Minting:", amountToMint / 1e18, "CGT to", RECIPIENT_ADDRESS);
        token.mint(RECIPIENT_ADDRESS, amountToMint);
        console.log("Minting successful!");
        console.log("");

        // Check new balance of recipient
        uint256 newBalance = token.balanceOf(RECIPIENT_ADDRESS);
        console.log("New recipient balance:", newBalance / 1e18, "CGT");
        console.log("");

        // Stop broadcasting
        vm.stopBroadcast();

        console.log("==================================================");
        console.log("Done! Wallet", RECIPIENT_ADDRESS);
        console.log("now has enough CGT to become a verifier");
        console.log("(Required: 1000 CGT)");
        console.log("==================================================");
    }
}