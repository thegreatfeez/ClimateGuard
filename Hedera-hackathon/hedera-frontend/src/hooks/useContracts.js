// src/hooks/useContracts.js - UPDATED
import { useMemo } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../context/Web3Context';
import { CONTRACT_ADDRESSES } from '../contracts/addresses';
import {
  ClimateTokenABI,
  CarbonFootprintTrackerABI,
  EnvironmentalAlertsABI,
  RewardDistributorABI,
  DAOVerifierABI
} from '../contracts/abis';

// Subscription ABI
const SubscriptionABI = [
  "function subscribe(uint8 tier) external payable",
  "function getUserTier(address user) external view returns (uint8)",
  "function isActive(address user) external view returns (bool)",
  "function premiumPrice() external view returns (uint256)",
  "function enterprisePrice() external view returns (uint256)",
  "function subscriptions(address user) external view returns (uint8 tier, uint256 expiresAt, bool autoRenew)"
];

export const useContracts = () => {
  const { provider, signer } = useWeb3();

  const contracts = useMemo(() => {
    if (!provider) return null;

    const signerOrProvider = signer || provider;

    return {
      climateToken: new ethers.Contract(
        CONTRACT_ADDRESSES.CLIMATE_TOKEN,
        ClimateTokenABI,
        signerOrProvider
      ),
      tracker: new ethers.Contract(
        CONTRACT_ADDRESSES.TRACKER,
        CarbonFootprintTrackerABI,
        signerOrProvider
      ),
      alerts: new ethers.Contract(
        CONTRACT_ADDRESSES.ALERTS,
        EnvironmentalAlertsABI,
        signerOrProvider
      ),
      distributor: new ethers.Contract(
        CONTRACT_ADDRESSES.DISTRIBUTOR,
        RewardDistributorABI,
        signerOrProvider
      ),
      subscription: CONTRACT_ADDRESSES.SUBSCRIPTION ? new ethers.Contract(
        CONTRACT_ADDRESSES.SUBSCRIPTION,
        SubscriptionABI,
        signerOrProvider
      ) : null,
      daoVerifier: CONTRACT_ADDRESSES.DAO_VERIFIER ? new ethers.Contract(
        CONTRACT_ADDRESSES.DAO_VERIFIER,
        DAOVerifierABI,
        signerOrProvider
      ) : null,
    };
  }, [provider, signer]);

  return contracts;
};