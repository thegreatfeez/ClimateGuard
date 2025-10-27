// src/hooks/useSubscription.js
import { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { useContracts } from './useContracts';

export const useSubscription = () => {
  const { account } = useWeb3();
  const contracts = useContracts();
  const [tier, setTier] = useState('Free');
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (account && contracts?.subscription) {
      loadSubscription();
    }
  }, [account, contracts]);

  const loadSubscription = async () => {
    if (!contracts?.subscription) return;
    
    setLoading(true);
    try {
      const userTier = await contracts.subscription.getUserTier(account);
      const active = await contracts.subscription.isActive(account);
      
      const tierNames = ['Free', 'Premium', 'Enterprise'];
      setTier(tierNames[Number(userTier)] || 'Free');
      setIsActive(active);
    } catch (error) {
      console.error('Error loading subscription:', error);
      setTier('Free');
      setIsActive(false);
    } finally {
      setLoading(false);
    }
  };

  return { tier, isActive, loading, reload: loadSubscription };
};