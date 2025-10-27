// src/pages/Rewards.jsx
import { useState, useEffect } from 'react';
import { Coins, Gift, Clock, TrendingUp, Award, Zap } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import { useContracts } from '../hooks/useContracts';
import { ethers } from 'ethers';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

function Rewards() {
  const { account, isCorrectNetwork } = useWeb3();
  const contracts = useContracts();
  
  const [tokenBalance, setTokenBalance] = useState('0');
  const [availablePoints, setAvailablePoints] = useState('0');
  const [claimableTokens, setClaimableTokens] = useState('0');
  const [totalClaimed, setTotalClaimed] = useState('0');
  const [lastClaimTime, setLastClaimTime] = useState(null);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [conversionRate, setConversionRate] = useState('100');
  const [minimumRedemption, setMinimumRedemption] = useState('1000');
  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [pointsToRedeem, setPointsToRedeem] = useState('');

  useEffect(() => {
    if (account && contracts && isCorrectNetwork) {
      loadRewardsData();
    }
  }, [account, contracts, isCorrectNetwork]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (lastClaimTime) {
        updateCooldown();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastClaimTime]);

  const loadRewardsData = async () => {
    if (!contracts) return;
    
    setLoading(true);
    try {
      // Get token balance
      const balance = await contracts.climateToken.balanceOf(account);
      setTokenBalance((Number(balance) / 1e18).toFixed(2));

      // Get user profile for points
      const profile = await contracts.tracker.userProfiles(account);
      setAvailablePoints(profile.totalPoints.toString());

      // Get total claimed
      const claimed = await contracts.distributor.totalClaimed(account);
      setTotalClaimed((Number(claimed) / 1e18).toFixed(2));

      // Get last claim time
      const lastClaim = await contracts.distributor.lastClaimTime(account);
      setLastClaimTime(Number(lastClaim));

      // Get claimable tokens
      const claimable = await contracts.distributor.getClaimableTokens(account);
      setClaimableTokens((Number(claimable) / 1e18).toFixed(2));

      // Get conversion rate and minimum
      const rate = await contracts.distributor.conversionRate();
      setConversionRate((Number(rate) / 1e18).toString());
      
      const minRedemption = await contracts.distributor.minimumRedemption();
      setMinimumRedemption(minRedemption.toString());

    } catch (error) {
      console.error('Error loading rewards data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCooldown = () => {
    const cooldownPeriod = 24 * 60 * 60; // 24 hours in seconds
    const now = Math.floor(Date.now() / 1000);
    const nextClaimTime = lastClaimTime + cooldownPeriod;
    const remaining = Math.max(0, nextClaimTime - now);
    setCooldownRemaining(remaining);
  };

  const handleClaimRewards = async () => {
    if (!contracts || !pointsToRedeem) {
      alert('Please enter points to redeem');
      return;
    }

    const points = parseInt(pointsToRedeem);
    
    if (points < parseInt(minimumRedemption)) {
      alert(`Minimum redemption is ${minimumRedemption} points`);
      return;
    }

    if (points > parseInt(availablePoints)) {
      alert('Insufficient points');
      return;
    }

    if (cooldownRemaining > 0) {
      alert('Claim cooldown is still active');
      return;
    }

    setClaiming(true);
    try {
      const tx = await contracts.distributor.claimRewards(points);
      await tx.wait();
      
      alert('Rewards claimed successfully!');
      setPointsToRedeem('');
      await loadRewardsData();
    } catch (error) {
      console.error('Error claiming rewards:', error);
      alert('Failed to claim rewards: ' + (error.reason || error.message));
    } finally {
      setClaiming(false);
    }
  };

  const calculateTokens = (points) => {
    if (!points || isNaN(points)) return '0';
    const tokens = points / parseFloat(conversionRate);
    return tokens.toFixed(4);
  };

  const formatCooldown = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  if (!account || !isCorrectNetwork) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0a1f1a] flex items-center justify-center">
          <div className="text-center">
            <Coins className="text-[#22c55e] mx-auto mb-4" size={48} />
            <h2 className="text-white text-2xl font-bold mb-2">
              {!account ? 'Wallet Not Connected' : 'Wrong Network'}
            </h2>
            <p className="text-gray-400">
              {!account ? 'Please connect your wallet to view rewards' : 'Please switch to Hedera Testnet'}
            </p>
          </div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0a1f1a] flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0a1f1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-white text-4xl font-bold mb-2">Token Incentives & Rewards</h1>
            <p className="text-gray-400">Earn tokens for participating in eco-friendly activities and initiatives</p>
          </div>

          {/* Balance Overview */}
          <div className="bg-gradient-to-br from-[#153029] to-[#0a1f1a] rounded-xl p-8 mb-8 border border-[#22c55e]/30">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-gray-400 text-sm mb-2">Your CGT Balance</h2>
                <div className="flex items-center space-x-3">
                  <Coins className="text-[#22c55e]" size={40} />
                  <p className="text-white text-5xl font-bold">{tokenBalance}</p>
                  <span className="text-gray-400 text-2xl">CGT</span>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-gray-400 text-sm mb-1">Total Claimed</p>
                <p className="text-white text-2xl font-bold">{totalClaimed} CGT</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-[#1a3a2e]">
              <div>
                <p className="text-gray-400 text-sm mb-1">Available Points</p>
                <p className="text-white text-xl font-bold">{availablePoints}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Conversion Rate</p>
                <p className="text-white text-xl font-bold">{conversionRate} pts = 1 CGT</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Claimable Tokens</p>
                <p className="text-[#22c55e] text-xl font-bold">{claimableTokens} CGT</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Claim Rewards Section */}
            <div className="bg-[#153029] rounded-xl p-6 border border-[#1a3a2e]">
              <h2 className="text-white text-2xl font-bold mb-6">Claim Rewards</h2>
              
              {cooldownRemaining > 0 ? (
                <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-6 text-center mb-6">
                  <Clock className="text-yellow-500 mx-auto mb-3" size={40} />
                  <h3 className="text-white font-bold mb-2">Cooldown Active</h3>
                  <p className="text-yellow-500 text-2xl font-bold mb-2">
                    {formatCooldown(cooldownRemaining)}
                  </p>
                  <p className="text-gray-400 text-sm">Next claim available in</p>
                </div>
              ) : (
                <div className="bg-[#22c55e]/10 border border-[#22c55e] rounded-lg p-4 mb-6">
                  <p className="text-[#22c55e] text-sm text-center">
                    ✓ You can claim rewards now!
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    Points to Redeem (Min: {minimumRedemption})
                  </label>
                  <input
                    type="number"
                    value={pointsToRedeem}
                    onChange={(e) => setPointsToRedeem(e.target.value)}
                    placeholder={`Enter points (available: ${availablePoints})`}
                    className="w-full bg-[#0a1f1a] text-white px-4 py-3 rounded-lg border border-[#1a3a2e] focus:border-[#22c55e] focus:outline-none transition"
                  />
                </div>

                {pointsToRedeem && (
                  <div className="bg-[#0a1f1a] rounded-lg p-4 border border-[#1a3a2e]">
                    <p className="text-gray-400 text-sm mb-1">You will receive:</p>
                    <p className="text-[#22c55e] text-2xl font-bold">
                      {calculateTokens(pointsToRedeem)} CGT
                    </p>
                  </div>
                )}

                <button
                  onClick={handleClaimRewards}
                  disabled={claiming || cooldownRemaining > 0 || !pointsToRedeem || parseInt(pointsToRedeem) < parseInt(minimumRedemption)}
                  className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {claiming ? 'Claiming...' : 'Claim Rewards'}
                </button>

                <div className="bg-[#0a1f1a] rounded-lg p-4 border border-[#1a3a2e]">
                  <p className="text-gray-400 text-sm">
                    ℹ️ There is a 24-hour cooldown between claims to prevent abuse.
                  </p>
                </div>
              </div>
            </div>

            {/* How to Earn Section */}
            <div className="space-y-6">
              <div className="bg-[#153029] rounded-xl p-6 border border-[#1a3a2e]">
                <h2 className="text-white text-2xl font-bold mb-6">How to Earn Points</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#22c55e]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🌳</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-bold mb-1">Tree Planting</h3>
                      <p className="text-gray-400 text-sm mb-2">
                        Plant trees and earn bonus points with 3x multiplier
                      </p>
                      <span className="text-[#22c55e] text-sm font-semibold">3x Points</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#22c55e]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">☀️</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-bold mb-1">Renewable Energy</h3>
                      <p className="text-gray-400 text-sm mb-2">
                        Use renewable energy sources for higher rewards
                      </p>
                      <span className="text-[#22c55e] text-sm font-semibold">2.5x Points</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#22c55e]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">♻️</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-bold mb-1">Recycling</h3>
                      <p className="text-gray-400 text-sm mb-2">
                        Log your recycling activities for steady points
                      </p>
                      <span className="text-[#22c55e] text-sm font-semibold">1.5x Points</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#22c55e]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">💧</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-bold mb-1">Water Conservation</h3>
                      <p className="text-gray-400 text-sm mb-2">
                        Save water and earn points for conservation efforts
                      </p>
                      <span className="text-[#22c55e] text-sm font-semibold">1.2x Points</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Token Usage Info */}
              <div className="bg-[#153029] rounded-xl p-6 border border-[#1a3a2e]">
                <h2 className="text-white text-xl font-bold mb-4">How to Use Your CGT Tokens</h2>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <span className="text-[#22c55e] mt-1">•</span>
                    <p className="text-gray-400">
                      Support environmental projects and carbon offset initiatives
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-[#22c55e] mt-1">•</span>
                    <p className="text-gray-400">
                      Trade tokens on supported exchanges for other cryptocurrencies
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-[#22c55e] mt-1">•</span>
                    <p className="text-gray-400">
                      Purchase sustainable products from partner merchants
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-[#22c55e] mt-1">•</span>
                    <p className="text-gray-400">
                      Participate in governance and vote on platform decisions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Rewards;