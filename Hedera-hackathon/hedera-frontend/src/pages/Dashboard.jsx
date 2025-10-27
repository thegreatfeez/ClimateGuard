// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Leaf, AlertTriangle, TrendingUp, Coins, Crown } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import { useContracts } from '../hooks/useContracts';
import { useSubscription } from '../hooks/useSubscription';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';
import FeatureCard from '../components/FeatureCard';
import LoadingSpinner from '../components/LoadingSpinner';
import QuickStartGuide from '../components/QuickStartGuide';
import SubscriptionModal from '../components/SubscriptionModal';

function Dashboard() {
  const { account, isCorrectNetwork } = useWeb3();
  const contracts = useContracts();
  const { tier, isActive } = useSubscription();
  
  const [userStats, setUserStats] = useState({
    tokenBalance: '0',
    totalPoints: '0',
    carbonImpact: '0',
    activityCount: '0',
  });
  const [loading, setLoading] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  useEffect(() => {
    if (account && contracts && isCorrectNetwork) {
      loadUserData();
    }
  }, [account, contracts, isCorrectNetwork]);

  const loadUserData = async () => {
    if (!contracts) return;
    
    setLoading(true);
    try {
      // Get token balance
      const balance = await contracts.climateToken.balanceOf(account);
      
      // Get user profile from tracker
      const profile = await contracts.tracker.userProfiles(account);
      
      setUserStats({
        tokenBalance: (Number(balance) / 1e18).toFixed(2),
        totalPoints: profile.totalPoints.toString(),
        carbonImpact: (Number(profile.totalCarbonImpact) / 1000).toFixed(2), // Convert to kg
        activityCount: profile.activityCount.toString(),
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!account) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0a1f1a] flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🌍</div>
            <h2 className="text-white text-3xl font-bold mb-4">Welcome to Climate Guardian</h2>
            <p className="text-gray-400 mb-8">Connect your wallet to start tracking your environmental impact</p>
          </div>
        </div>
      </>
    );
  }

  if (!isCorrectNetwork) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0a1f1a] flex items-center justify-center">
          <div className="bg-[#153029] border border-yellow-500 rounded-xl p-8 max-w-md">
            <AlertTriangle className="text-yellow-500 mx-auto mb-4" size={48} />
            <h2 className="text-white text-xl font-bold mb-2 text-center">Wrong Network</h2>
            <p className="text-gray-400 text-center">Please switch to Hedera Testnet to continue</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0a1f1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header with Subscription Status */}
          <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-white text-4xl font-bold mb-2">Dashboard</h1>
              <div className="flex items-center space-x-3">
                <p className="text-gray-400">Track your environmental impact and earn rewards</p>
                {tier !== 'Free' && isActive && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center space-x-1 ${
                    tier === 'Enterprise' 
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500'
                      : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500'
                  }`}>
                    <Crown size={14} />
                    <span>{tier} Member</span>
                  </span>
                )}
              </div>
            </div>
            
            {/* Upgrade Button - Show only for Free tier */}
            {tier === 'Free' && (
              <button
                onClick={() => setShowSubscriptionModal(true)}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold px-6 py-3 rounded-lg transition shadow-lg"
              >
                <Crown size={20} />
                <span>Upgrade to Premium</span>
              </button>
            )}

            {/* Manage Subscription - Show for paid tiers */}
            {tier !== 'Free' && isActive && (
              <div className="flex items-center space-x-3">
                <div className={`px-4 py-2 rounded-lg border ${
                  tier === 'Enterprise'
                    ? 'border-purple-500/30 bg-purple-500/10'
                    : 'border-yellow-500/30 bg-yellow-500/10'
                }`}>
                  <p className="text-gray-400 text-xs">Current Plan</p>
                  <p className={`font-bold ${
                    tier === 'Enterprise' ? 'text-purple-400' : 'text-yellow-400'
                  }`}>{tier}</p>
                </div>
                <button
                  onClick={() => setShowSubscriptionModal(true)}
                  className="text-gray-400 hover:text-white text-sm transition"
                >
                  Upgrade Plan
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <LoadingSpinner size="lg" className="my-12" />
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                  title="CGT Balance"
                  value={userStats.tokenBalance}
                  subtitle="Climate Guardian Tokens"
                  icon={Coins}
                  trend="up"
                  trendValue="+12.5%"
                />
                <StatsCard
                  title="Total Points"
                  value={userStats.totalPoints}
                  subtitle="Reward Points Earned"
                  icon={TrendingUp}
                />
                <StatsCard
                  title="Carbon Impact"
                  value={`${userStats.carbonImpact} kg`}
                  subtitle="CO₂ Offset This Month"
                  icon={Leaf}
                  trend="up"
                  trendValue="+8.2%"
                />
                <StatsCard
                  title="Activities"
                  value={userStats.activityCount}
                  subtitle="Verified Actions"
                  icon={AlertTriangle}
                />
              </div>

              {/* Premium Features Banner */}
              {tier === 'Free' && (
                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-6 mb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white text-xl font-bold mb-2">
                        🚀 Unlock Premium Features
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Get 14-day forecasts, unlimited logging, 2x rewards, and more!
                      </p>
                    </div>
                    <button
                      onClick={() => setShowSubscriptionModal(true)}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold px-6 py-3 rounded-lg transition whitespace-nowrap"
                    >
                      View Plans
                    </button>
                  </div>
                </div>
              )}

              {/* Feature Cards */}
              <div className="space-y-6">
                <FeatureCard
                  title="Weather & Environmental Alerts"
                  description={
                    tier === 'Free' 
                      ? "Stay informed about critical weather updates (3-day forecast). Upgrade for 14-day forecasts!"
                      : "Stay informed with extended 14-day weather forecasts and environmental alerts."
                  }
                  buttonText="View Alerts"
                  onClick={() => window.location.hash = '#alerts'}
                />
                
                <FeatureCard
                  title="Personal Carbon Footprint"
                  description={
                    tier === 'Free'
                      ? "Track your carbon footprint (5 activities/month). Upgrade for unlimited logging!"
                      : "Track unlimited eco-activities with priority verification and advanced analytics."
                  }
                  buttonText="Track Footprint"
                  onClick={() => window.location.hash = '#footprint'}
                />
                
                <FeatureCard
                  title="Token Incentives & Rewards"
                  description={
                    tier === 'Free'
                      ? "Earn tokens for eco-friendly activities. Premium members get 2x-5x multipliers!"
                      : `Earn tokens with ${tier === 'Enterprise' ? '5x' : '2x'} multiplier for verified activities.`
                  }
                  buttonText="View Rewards"
                  onClick={() => window.location.hash = '#rewards'}
                />
              </div>
            </>
          )}
        </div>
        
        {/* Modals */}
        <QuickStartGuide />
        <SubscriptionModal 
          isOpen={showSubscriptionModal}
          onClose={() => setShowSubscriptionModal(false)}
          contracts={contracts}
        />
      </div>
    </>
  );
}

export default Dashboard;