// src/pages/CarbonFootprint.jsx
import { useState, useEffect } from 'react';
import { Leaf, TrendingUp, TrendingDown, Calendar, CheckCircle, Clock } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import { useContracts } from '../hooks/useContracts';
import { ethers } from 'ethers';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

function CarbonFootprint() {
  const { account, isCorrectNetwork } = useWeb3();
  const contracts = useContracts();
  
  const [userProfile, setUserProfile] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    activityType: '0',
    carbonImpact: '',
    details: '',
    date: new Date().toISOString().split('T')[0],
  });

  const activityTypes = [
    { value: '0', label: 'Energy Usage', icon: '⚡' },
    { value: '1', label: 'Transportation', icon: '🚗' },
    { value: '2', label: 'Recycling', icon: '♻️' },
    { value: '3', label: 'Tree Planting', icon: '🌳' },
    { value: '4', label: 'Renewable Energy', icon: '☀️' },
    { value: '5', label: 'Water Conservation', icon: '💧' },
    { value: '6', label: 'Waste Reduction', icon: '🗑️' },
    { value: '7', label: 'Other', icon: '📋' },
  ];

  useEffect(() => {
    if (account && contracts && isCorrectNetwork) {
      checkRegistration();
    }
  }, [account, contracts, isCorrectNetwork]);

  const checkRegistration = async () => {
    if (!contracts) return;
    
    setLoading(true);
    try {
      const profile = await contracts.tracker.userProfiles(account);
      setIsRegistered(profile.isActive);
      
      if (profile.isActive) {
        setUserProfile({
          totalCarbonImpact: Number(profile.totalCarbonImpact),
          totalPoints: Number(profile.totalPoints),
          activityCount: Number(profile.activityCount),
          joinedAt: new Date(Number(profile.joinedAt) * 1000),
        });
        
        await loadActivities(Number(profile.activityCount));
      }
    } catch (error) {
      console.error('Error checking registration:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadActivities = async (activityCount) => {
    if (!contracts || activityCount === 0) return;
    
    try {
      const activitiesData = [];
      
      for (let i = 0; i < activityCount; i++) {
        const activity = await contracts.tracker.userActivities(account, i);
        
        activitiesData.push({
          id: i,
          activityType: Number(activity.activityType),
          carbonImpact: Number(activity.carbonImpact),
          points: Number(activity.points),
          timestamp: new Date(Number(activity.timestamp) * 1000),
          verified: activity.verified,
          verifiedBy: activity.verifiedBy,
        });
      }
      
      // Sort by timestamp (newest first)
      activitiesData.sort((a, b) => b.timestamp - a.timestamp);
      setActivities(activitiesData);
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  };

  const handleRegister = async () => {
    if (!contracts) return;
    
    setSubmitting(true);
    try {
      const tx = await contracts.tracker.registerUser();
      await tx.wait();
      
      alert('Successfully registered! You can now start logging activities.');
      await checkRegistration();
    } catch (error) {
      console.error('Error registering:', error);
      alert('Failed to register: ' + (error.reason || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitActivity = async (e) => {
    e.preventDefault();
    
    if (!contracts || !formData.details || !formData.carbonImpact) {
      alert('Please fill in all fields');
      return;
    }
    
    setSubmitting(true);
    try {
      // Create data hash from activity details
      const activityData = JSON.stringify({
        type: activityTypes[formData.activityType].label,
        details: formData.details,
        date: formData.date,
        carbonImpact: formData.carbonImpact,
      });
      
      const dataHash = ethers.keccak256(ethers.toUtf8Bytes(activityData));
      
      // Convert carbon impact to grams (assuming input is in kg)
      const carbonImpactGrams = Math.floor(parseFloat(formData.carbonImpact) * 1000);
      
      const tx = await contracts.tracker.logActivity(
        dataHash,
        parseInt(formData.activityType),
        carbonImpactGrams
      );
      
      await tx.wait();
      
      alert('Activity logged successfully! Waiting for verification.');
      
      // Reset form
      setFormData({
        activityType: '0',
        carbonImpact: '',
        details: '',
        date: new Date().toISOString().split('T')[0],
      });
      
      // Reload activities
      await checkRegistration();
    } catch (error) {
      console.error('Error logging activity:', error);
      alert('Failed to log activity: ' + (error.reason || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const getActivityTypeName = (typeIndex) => {
    return activityTypes[typeIndex]?.label || 'Unknown';
  };

  const getActivityIcon = (typeIndex) => {
    return activityTypes[typeIndex]?.icon || '📋';
  };

  const formatCarbonImpact = (grams) => {
    const kg = grams / 1000;
    return kg >= 0 ? `+${kg.toFixed(2)} kg CO₂` : `${kg.toFixed(2)} kg CO₂`;
  };

  const getImpactColor = (grams) => {
    return grams >= 0 ? 'text-red-500' : 'text-[#22c55e]';
  };

  if (!account || !isCorrectNetwork) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0a1f1a] flex items-center justify-center">
          <div className="text-center">
            <Leaf className="text-[#22c55e] mx-auto mb-4" size={48} />
            <h2 className="text-white text-2xl font-bold mb-2">
              {!account ? 'Wallet Not Connected' : 'Wrong Network'}
            </h2>
            <p className="text-gray-400">
              {!account ? 'Please connect your wallet to track your carbon footprint' : 'Please switch to Hedera Testnet'}
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

  if (!isRegistered) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0a1f1a] flex items-center justify-center">
          <div className="bg-[#153029] rounded-xl p-8 max-w-md border border-[#1a3a2e]">
            <div className="text-6xl text-center mb-4">🌱</div>
            <h2 className="text-white text-2xl font-bold mb-4 text-center">Welcome to Carbon Tracker</h2>
            <p className="text-gray-400 mb-6 text-center">
              Register to start tracking your carbon footprint and earn rewards for eco-friendly activities.
            </p>
            <button
              onClick={handleRegister}
              disabled={submitting}
              className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold py-3 px-6 rounded-lg transition disabled:opacity-50"
            >
              {submitting ? 'Registering...' : 'Register Now'}
            </button>
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
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-white text-4xl font-bold mb-2">Carbon Footprint Tracker</h1>
            <p className="text-gray-400">Log your eco-actions and track your environmental impact</p>
          </div>

          {/* Stats Overview */}
          {userProfile && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-[#153029] rounded-xl p-6 border border-[#1a3a2e]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-400 text-sm">Total Impact</h3>
                  {userProfile.totalCarbonImpact < 0 ? (
                    <TrendingDown className="text-[#22c55e]" size={20} />
                  ) : (
                    <TrendingUp className="text-red-500" size={20} />
                  )}
                </div>
                <p className={`text-3xl font-bold ${getImpactColor(userProfile.totalCarbonImpact)}`}>
                  {formatCarbonImpact(userProfile.totalCarbonImpact)}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  {userProfile.totalCarbonImpact < 0 ? 'Carbon offset' : 'Carbon emissions'}
                </p>
              </div>

              <div className="bg-[#153029] rounded-xl p-6 border border-[#1a3a2e]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-400 text-sm">Total Points</h3>
                  <Leaf className="text-[#22c55e]" size={20} />
                </div>
                <p className="text-white text-3xl font-bold">{userProfile.totalPoints}</p>
                <p className="text-gray-500 text-sm mt-1">Reward points earned</p>
              </div>

              <div className="bg-[#153029] rounded-xl p-6 border border-[#1a3a2e]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-400 text-sm">Activities Logged</h3>
                  <Calendar className="text-[#22c55e]" size={20} />
                </div>
                <p className="text-white text-3xl font-bold">{userProfile.activityCount}</p>
                <p className="text-gray-500 text-sm mt-1">Total activities</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Log Activity Form */}
            <div className="bg-[#153029] rounded-xl p-6 border border-[#1a3a2e]">
              <h2 className="text-white text-2xl font-bold mb-6">Log Your Eco-Actions</h2>
              
              <form onSubmit={handleSubmitActivity} className="space-y-4">
                {/* Activity Type */}
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Select Activity Type</label>
                  <select
                    value={formData.activityType}
                    onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
                    className="w-full bg-[#0a1f1a] text-white px-4 py-3 rounded-lg border border-[#1a3a2e] focus:border-[#22c55e] focus:outline-none transition"
                  >
                    {activityTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full bg-[#0a1f1a] text-white px-4 py-3 rounded-lg border border-[#1a3a2e] focus:border-[#22c55e] focus:outline-none transition"
                  />
                </div>

                {/* Carbon Impact */}
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    Carbon Impact (kg CO₂)
                    <span className="text-gray-500 ml-2 text-xs">
                      Use negative values for offsets (e.g., -5 for tree planting)
                    </span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.carbonImpact}
                    onChange={(e) => setFormData({ ...formData, carbonImpact: e.target.value })}
                    placeholder="e.g., -5 or 10"
                    className="w-full bg-[#0a1f1a] text-white px-4 py-3 rounded-lg border border-[#1a3a2e] focus:border-[#22c55e] focus:outline-none transition"
                    required
                  />
                </div>

                {/* Details */}
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    Details (e.g., energy consumption, commuting distance)
                  </label>
                  <textarea
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    placeholder="Describe your activity..."
                    rows={4}
                    className="w-full bg-[#0a1f1a] text-white px-4 py-3 rounded-lg border border-[#1a3a2e] focus:border-[#22c55e] focus:outline-none transition resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold py-3 px-6 rounded-lg transition disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Activity'}
                </button>
              </form>

              <div className="mt-4 p-4 bg-[#0a1f1a] rounded-lg border border-[#1a3a2e]">
                <p className="text-gray-400 text-sm">
                  ℹ️ Activities will be verified by our team before points are awarded.
                </p>
              </div>
            </div>

            {/* Activity History */}
            <div className="bg-[#153029] rounded-xl p-6 border border-[#1a3a2e]">
              <h2 className="text-white text-2xl font-bold mb-6">Activity History</h2>
              
              {activities.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="text-gray-500 mx-auto mb-4" size={48} />
                  <p className="text-gray-400">No activities logged yet</p>
                  <p className="text-gray-500 text-sm mt-2">Start by logging your first eco-action!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="bg-[#0a1f1a] rounded-lg p-4 border border-[#1a3a2e] hover:border-[#22c55e] transition"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{getActivityIcon(activity.activityType)}</span>
                          <div>
                            <h4 className="text-white font-semibold">
                              {getActivityTypeName(activity.activityType)}
                            </h4>
                            <p className="text-gray-500 text-xs">
                              {activity.timestamp.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        {activity.verified ? (
                          <CheckCircle className="text-[#22c55e]" size={20} />
                        ) : (
                          <Clock className="text-yellow-500" size={20} />
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <span className={`text-sm font-semibold ${getImpactColor(activity.carbonImpact)}`}>
                          {formatCarbonImpact(activity.carbonImpact)}
                        </span>
                        
                        {activity.verified ? (
                          <span className="text-[#22c55e] text-sm font-semibold">
                            +{activity.points} points
                          </span>
                        ) : (
                          <span className="text-yellow-500 text-sm">
                            Pending verification
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CarbonFootprint;