// src/context/Web3Context.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { HEDERA_TESTNET } from '../contracts/addresses';

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider');
  }
  return context;
};

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Check if wallet is already connected
  useEffect(() => {
    checkConnection();
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        
        if (accounts.length > 0) {
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          const network = await provider.getNetwork();
          
          setProvider(provider);
          setSigner(signer);
          setAccount(address);
          setChainId(Number(network.chainId));
        }
      } catch (err) {
        console.error('Error checking connection:', err);
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask or a compatible wallet');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();

      setProvider(provider);
      setSigner(signer);
      setAccount(address);
      setChainId(Number(network.chainId));

      // Check if on correct network
      if (Number(network.chainId) !== HEDERA_TESTNET.chainId) {
        await switchNetwork();
      }
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${HEDERA_TESTNET.chainId.toString(16)}` }],
      });
    } catch (switchError) {
      // Chain not added, try to add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${HEDERA_TESTNET.chainId.toString(16)}`,
                chainName: HEDERA_TESTNET.name,
                rpcUrls: [HEDERA_TESTNET.rpcUrl],
                blockExplorerUrls: [HEDERA_TESTNET.blockExplorer],
                nativeCurrency: {
                  name: 'HBAR',
                  symbol: 'HBAR',
                  decimals: 18,
                },
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding network:', addError);
          setError('Failed to add Hedera Testnet');
        }
      }
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setChainId(null);
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      setAccount(accounts[0]);
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const isCorrectNetwork = chainId === HEDERA_TESTNET.chainId;

  const value = {
    account,
    provider,
    signer,
    chainId,
    isConnecting,
    error,
    isCorrectNetwork,
    connectWallet,
    disconnectWallet,
    switchNetwork,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};