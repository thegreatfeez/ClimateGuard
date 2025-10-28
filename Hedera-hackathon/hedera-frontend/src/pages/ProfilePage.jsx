// src/pages/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { User, Award, TrendingUp, Leaf, Calendar, Share2, Copy, Check } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import { useContracts } from '../hooks/useContracts';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

function ProfilePage() {
  const { account } = useWeb3();
  const contracts = useContracts();
  
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const achievements = [
    {
      id: 'first-activity',
      title: 'First Steps',
      description: 'Logged your first eco-activity',
      icon: '🌱',
      unlocked: true
    },
    {
      id: 'tree-planter',
      title: 'Tree Planter',
      description: 'Planted 10+ trees',
      icon: '🌳',
      unlocked: true
    },
    {
      id: 'carbon-warrior',
      title: 'Carbon Warrior',
      description: 'Offset 50kg of CO₂',
      icon: '💪',
      unlocked: false,
      progress: 38
    },
    {
      id: 'early-adopter',
      title: 'Early Adopter',
      description: 'Joined in the first 1000 users',
      icon: '⭐',
      unlocked: true
    },
    {
      id: 'consistent',
      title: 'Consistency King',
      description: 'Logged activities 30 days in a row',
      icon: '🔥',
      unlocked: false,
      progress: 12
    },
    {
      id: 'dao-voter',
      title: 'DAO Participant',
      description: 'Voted on 5 DAO proposals',
      icon: '🗳️',
      unlocked: false,
      progress: 2
    }
  ];

  useEffect(() => {
    if (account && contracts) {
      loadUserData();
    }
  }, [account, contracts]);

  const loadUserData = async () => {
    if (!contracts) return;
    
    setLoading(true);
    try {
      // Get token balance
      const balance = await contracts.climateToken.balanceOf(account);
      
      // Get user profile
      const profile = await contracts.tracker.userProfiles(account);
      
      // Get activities
      const activityCount = Number(profile.activityCount);
      let verifiedCount = 0;
      
      if (activityCount > 0) {
        for (let i = 0; i < activityCount; i++) {
          const activity = await contracts.tracker.userActivities(account, i);
          if (activity.verified) {
            verifiedCount++;
          }
        }
      }

      // Calculate level based on points
      const totalPoints = Number(profile.totalPoints);
      const level = Math.floor(totalPoints / 100) + 1;
      const nextLevelPoints = level * 100;
      const progressToNextLevel = ((totalPoints % 100) / 100) * 100;

      // Determine rank based on points
      let rank = 'Eco Novice';
      if (totalPoints >= 1000) rank = 'Climate Guardian';
      else if (totalPoints >= 500) rank = 'Green Champion';
      else if (totalPoints >= 200) rank = 'Eco Warrior';
      else if (totalPoints >= 50) rank = 'Earth Defender';

      setUserData({
        tokenBalance: (Number(balance) / 1e18).toFixed(2),
        totalPoints: totalPoints,
        carbonImpact: (Number(profile.totalCarbonImpact) / 1000).toFixed(2),
        activityCount: activityCount,
        verifiedCount: verifiedCount,
        joinedAt: new Date(Number(profile.joinedAt) * 1000),
        level: level,
        nextLevelPoints: nextLevelPoints,
        progressToNextLevel: progressToNextLevel,
        rank: rank
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareProfile = () => {
    const shareUrl = `${window.location.origin}/#profile?user=${account}`;
    const shareText = `Check out my ClimateGuard profile! I've earned ${userData?.totalPoints} points and offset ${Math.abs(parseFloat(userData?.carbonImpact))} kg of CO₂. Join me in fighting climate change!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My ClimateGuard Profile',
        text: shareText,
        url: shareUrl
      }).catch(() => {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareUrl);
        alert('Profile link copied to clipboard!');
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Profile link copied to clipboard!');
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 'Climate Guardian':
        return 'text-purple-400';
      case 'Green Champion':
        return 'text-yellow-400';
      case 'Eco Warrior':
        return 'text-blue-400';
      case 'Earth Defender':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 'Climate Guardian':
        return '👑';
      case 'Green Champion':
        return '🏆';
      case 'Eco Warrior':
        return '⚔️';
      case 'Earth Defender':
        return '🛡️';
      default:
        return '🌱';
    }
  };

  if (!account) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0a1f1a] flex items-center justify-center">
          <div className="text-center">
            <User className="text-[#22c55e] mx-auto mb-4" size={48} />
            <h2 className="text-white text-2xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-gray-400">Please connect your wallet to view your profile</p>
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
      <div className="min-h-screen bg-[#0a1f1a] pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-white text-4xl font-bold mb-2">My Profile</h1>
            <p className="text-gray-400">Your climate guardian journey and achievements</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-[#153029] rounded-2xl p-6 border border-[#1a3a2e] sticky top-8">
                {/* Avatar */}
                <div className="relative mb-6">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#22c55e] to-[#16a34a] rounded-full flex items-center justify-center text-6xl border-4 border-[#0a1f1a]">
                    {getRankIcon(userData?.rank)}
                  </div>
                  <div className="absolute bottom-0 right-1/2 transform translate-x-16 translate-y-2 bg-[#22c55e] text-white text-sm font-bold px-3 py-1 rounded-full border-2 border-[#0a1f1a]">
                    Lv. {userData?.level}
                  </div>
                </div>

                {/* User Info */}
                <div className="text-center mb-6">
                  <h2 className={`text-2xl font-bold mb-1 ${getRankColor(userData?.rank)}`}>
                    {userData?.rank}
                  </h2>
                  <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm mb-4">
                    <span className="font-mono">{account?.slice(0, 6)}...{account?.slice(-4)}</span>
                    <button
                      onClick={copyAddress}
                      className="text-[#22c55e] hover:text-[#16a34a] transition"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm">
                    <Calendar size={16} />
                    <span>Joined {userData?.joinedAt?.toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Level Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">Level Progress</span>
                    <span className="text-white font-semibold">
                      {userData?.totalPoints % 100}/{userData?.nextLevelPoints - (userData?.level - 1) * 100}
                    </span>
                  </div>
                  <div className="w-full bg-[#0a1f1a] rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#22c55e] to-[#16a34a] transition-all duration-500"
                      style={{ width: `${userData?.progressToNextLevel}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-500 text-xs mt-2 text-center">
                    {100 - (userData?.totalPoints % 100)} points to Level {userData?.level + 1}
                  </p>
                </div>

                {/* Share Button */}
                <button
                  onClick={shareProfile}
                  className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center space-x-2"
                >
                  <Share2 size={20} />
                  <span>Share Profile</span>
                </button>
              </div>
            </div>

            {/* Right Column - Stats & Achievements */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#153029] rounded-xl p-6 border border-[#1a3a2e]">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-400 text-sm">Total Points</h3>
                    <TrendingUp className="text-[#22c55e]" size={20} />
                  </div>
                  <p className="text-white text-4xl font-bold mb-1">{userData?.totalPoints}</p>
                  <p className="text-gray-500 text-sm">Reward points earned</p>
                </div>

                <div className="bg-[#153029] rounded-xl p-6 border border-[#1a3a2e]">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-400 text-sm">CGT Balance</h3>
                    <Award className="text-yellow-400" size={20} />
                  </div>
                  <p className="text-white text-4xl font-bold mb-1">{userData?.tokenBalance}</p>
                  <p className="text-gray-500 text-sm">Climate Guardian Tokens</p>
                </div>

                <div className="bg-[#153029] rounded-xl p-6 border border-[#1a3a2e]">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-400 text-sm">Carbon Impact</h3>
                    <Leaf className={parseFloat(userData?.carbonImpact) < 0 ? 'text-[#22c55e]' : 'text-red-500'} size={20} />
                  </div>
                  <p className={`text-4xl font-bold mb-1 ${parseFloat(userData?.carbonImpact) < 0 ? 'text-[#22c55e]' : 'text-red-500'}`}>
                    {Math.abs(parseFloat(userData?.carbonImpact || 0)).toFixed(1)} kg
                  </p>
                  <p className="text-gray-500 text-sm">
                    {parseFloat(userData?.carbonImpact) < 0 ? 'CO₂ Offset' : 'CO₂ Emissions'}
                  </p>
                </div>

                <div className="bg-[#153029] rounded-xl p-6 border border-[#1a3a2e]">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-400 text-sm">Activities</h3>
                    <Calendar className="text-blue-400" size={20} />
                  </div>
                  <p className="text-white text-4xl font-bold mb-1">{userData?.verifiedCount}</p>
                  <p className="text-gray-500 text-sm">
                    of {userData?.activityCount} verified
                  </p>
                </div>
              </div>

              {/* Achievements Section */}
              <div className="bg-[#153029] rounded-xl p-6 border border-[#1a3a2e]">
                <h2 className="text-white text-2xl font-bold mb-6">Achievements</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`rounded-lg p-4 border transition-all duration-300 ${
                        achievement.unlocked
                          ? 'bg-[#22c55e]/10 border-[#22c55e] hover:bg-[#22c55e]/20'
                          : 'bg-[#0a1f1a] border-[#1a3a2e] opacity-60'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`text-4xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-bold mb-1">{achievement.title}</h3>
                          <p className="text-gray-400 text-sm mb-2">{achievement.description}</p>
                          
                          {achievement.unlocked ? (
                            <div className="flex items-center space-x-2 text-[#22c55e] text-sm font-semibold">
                              <Award size={16} />
                              <span>Unlocked</span>
                            </div>
                          ) : achievement.progress !== undefined ? (
                            <div>
                              <div className="w-full bg-[#1a3a2e] rounded-full h-2 mb-1 overflow-hidden">
                                <div
                                  className="h-full bg-gray-600 transition-all duration-500"
                                  style={{ width: `${(achievement.progress / (achievement.id === 'carbon-warrior' ? 50 : achievement.id === 'consistent' ? 30 : 5)) * 100}%` }}
                                ></div>
                              </div>
                              <p className="text-gray-500 text-xs">
                                {achievement.progress}/{achievement.id === 'carbon-warrior' ? 50 : achievement.id === 'consistent' ? 30 : 5}
                              </p>
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm">Locked</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Referral Section */}
              <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Share2 size={24} className="text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white text-xl font-bold mb-2">Invite Friends & Earn Rewards</h3>
                    <p className="text-gray-400 mb-4">
                      Share ClimateGuard with friends and earn 50 bonus points for each friend who joins and completes their first activity!
                    </p>
                    <button
                      onClick={shareProfile}
                      className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-6 py-3 rounded-lg transition"
                    >
                      Get Referral Link
                    </button>
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

export default ProfilePage;