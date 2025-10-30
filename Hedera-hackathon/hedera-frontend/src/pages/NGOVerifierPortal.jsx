import { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, Clock, Users, Award, TrendingUp, AlertTriangle } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import { useContracts } from '../hooks/useContracts';
import { ethers } from 'ethers';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

function NGOVerifierPortal() {
  const { account, isCorrectNetwork } = useWeb3();
  const contracts = useContracts();
  
  const [isVerifier, setIsVerifier] = useState(false);
  const [verifierStats, setVerifierStats] = useState({
    totalVerifiers: 0,
    minStake: '0',
    minVotes: 0,
    userTokenBalance: '0'
  });
  const [pendingRequests, setPendingRequests] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pending'); 

  const activityTypes = [
    'Energy Usage', 'Transportation', 'Recycling', 'Tree Planting',
    'Renewable Energy', 'Water Conservation', 'Waste Reduction', 'Other'
  ];

  useEffect(() => {
    if (account && contracts?.daoVerifier && isCorrectNetwork) {
      loadVerifierData();
    }
  }, [account, contracts, isCorrectNetwork]);

  const loadVerifierData = async () => {
    if (!contracts?.daoVerifier) {
      console.error('DAO Verifier contract not available');
      return;
    }

    setLoading(true);
    try {
      // Check if user is verifier
      const verifier = await contracts.daoVerifier.isVerifier(account);
      setIsVerifier(verifier);

      // Get verifier stats
      const [totalVerifiers, minStake, minVotes, tokenBalance] = await Promise.all([
        contracts.daoVerifier.verifierCount(),
        contracts.daoVerifier.MIN_VERIFIER_STAKE(),
        contracts.daoVerifier.MIN_VOTES_REQUIRED(),
        contracts.climateToken.balanceOf(account)
      ]);

      setVerifierStats({
        totalVerifiers: Number(totalVerifiers),
        minStake: ethers.formatEther(minStake),
        minVotes: Number(minVotes),
        userTokenBalance: ethers.formatEther(tokenBalance)
      });

      // Load verification requests
      if (verifier) {
        await loadRequests();
      }
    } catch (error) {
      console.error('Error loading verifier data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRequests = async () => {
    if (!contracts?.daoVerifier || !contracts?.tracker) return;

    try {
      const requestCount = await contracts.daoVerifier.requestCount();
      const requests = [];

      for (let i = 0; i < Number(requestCount); i++) {
        const request = await contracts.daoVerifier.getVerificationRequest(i);
        const activity = await contracts.tracker.userActivities(request.user, request.activityId);
        const hasVoted = await contracts.daoVerifier.hasVoted(i, account);

        requests.push({
          id: i,
          user: request.user,
          activityId: Number(request.activityId),
          proposedPoints: Number(request.proposedPoints),
          votesFor: Number(request.votesFor),
          votesAgainst: Number(request.votesAgainst),
          executed: request.executed,
          createdAt: new Date(Number(request.createdAt) * 1000),
          hasVoted: hasVoted,
          activity: {
            type: Number(activity.activityType),
            carbonImpact: Number(activity.carbonImpact),
            timestamp: new Date(Number(activity.timestamp) * 1000),
            verified: activity.verified
          }
        });
      }

      // Separate pending and completed
      setPendingRequests(requests.filter(r => !r.executed));
      setCompletedRequests(requests.filter(r => r.executed));
    } catch (error) {
      console.error('Error loading requests:', error);
    }
  };

  const handleBecomeVerifier = async () => {
    if (!contracts?.daoVerifier) return;

    setActionLoading(true);
    try {
      const tx = await contracts.daoVerifier.becomeVerifier();
      await tx.wait();
      
      alert('✅ Successfully became a verifier!');
      await loadVerifierData();
    } catch (error) {
      console.error('Error becoming verifier:', error);
      alert('Failed to become verifier: ' + (error.reason || error.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestVerification = async (userAddress, activityId, points) => {
    if (!contracts?.daoVerifier) return;

    setActionLoading(true);
    try {
      const tx = await contracts.daoVerifier.requestVerification(
        userAddress,
        activityId,
        points
      );
      await tx.wait();
      
      alert('✅ Verification request created!');
      await loadRequests();
    } catch (error) {
      console.error('Error requesting verification:', error);
      alert('Failed to create request: ' + (error.reason || error.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleVote = async (requestId, approve) => {
    if (!contracts?.daoVerifier) return;

    setActionLoading(true);
    try {
      const tx = await contracts.daoVerifier.vote(requestId, approve);
      await tx.wait();
      
      alert(`✅ Vote ${approve ? 'APPROVED' : 'REJECTED'} successfully!`);
      await loadRequests();
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to vote: ' + (error.reason || error.message));
    } finally {
      setActionLoading(false);
    }
  };

  if (!account || !isCorrectNetwork) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0a1f1a] flex items-center justify-center">
          <div className="text-center">
            <Shield className="text-[#22c55e] mx-auto mb-4" size={48} />
            <h2 className="text-white text-2xl font-bold mb-2">
              {!account ? 'Wallet Not Connected' : 'Wrong Network'}
            </h2>
            <p className="text-gray-400">
              {!account ? 'Connect your wallet to access verifier portal' : 'Switch to Hedera Testnet'}
            </p>
          </div>
        </div>
      </>
    );
  }

  if (!contracts?.daoVerifier) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0a1f1a] flex items-center justify-center">
          <div className="bg-yellow-500/10 border border-yellow-500 rounded-xl p-8 max-w-md text-center">
            <AlertTriangle className="text-yellow-500 mx-auto mb-4" size={48} />
            <h2 className="text-white text-xl font-bold mb-2">DAO Contract Not Deployed</h2>
            <p className="text-gray-400 mb-4">
              The DAO Verifier contract address is missing. Please deploy the contract and update addresses.js
            </p>
            <code className="bg-[#0a1f1a] text-[#22c55e] px-4 py-2 rounded text-sm block">
              CONTRACT_ADDRESSES.DAO_VERIFIER = 'your_address'
            </code>
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

  if (!isVerifier) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0a1f1a]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-[#153029] rounded-2xl p-8 border border-[#1a3a2e] text-center">
              <div className="w-20 h-20 bg-[#22c55e]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield size={40} className="text-[#22c55e]" />
              </div>

              <h1 className="text-white text-3xl font-bold mb-4">Become a Verifier</h1>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Join the ClimateGuard DAO as a verifier to review and approve eco-activities. Help build trust in our climate action community.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#0a1f1a] rounded-lg p-6 border border-[#1a3a2e]">
                  <Users className="text-[#22c55e] mx-auto mb-3" size={32} />
                  <p className="text-white font-bold text-2xl mb-1">{verifierStats.totalVerifiers}</p>
                  <p className="text-gray-400 text-sm">Active Verifiers</p>
                </div>

                <div className="bg-[#0a1f1a] rounded-lg p-6 border border-[#1a3a2e]">
                  <Award className="text-yellow-400 mx-auto mb-3" size={32} />
                  <p className="text-white font-bold text-2xl mb-1">{verifierStats.minStake} CGT</p>
                  <p className="text-gray-400 text-sm">Required Stake</p>
                </div>

                <div className="bg-[#0a1f1a] rounded-lg p-6 border border-[#1a3a2e]">
                  <TrendingUp className="text-blue-400 mx-auto mb-3" size={32} />
                  <p className="text-white font-bold text-2xl mb-1">{verifierStats.minVotes}</p>
                  <p className="text-gray-400 text-sm">Votes to Approve</p>
                </div>
              </div>

              <div className="bg-[#0a1f1a] rounded-lg p-6 border border-[#1a3a2e] mb-8">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-gray-400 text-sm mb-1">Your CGT Balance</p>
                    <p className="text-white text-2xl font-bold">{verifierStats.userTokenBalance} CGT</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm mb-1">Required</p>
                    <p className="text-white text-2xl font-bold">{verifierStats.minStake} CGT</p>
                  </div>
                </div>

                {parseFloat(verifierStats.userTokenBalance) < parseFloat(verifierStats.minStake) && (
                  <div className="mt-4 bg-red-500/10 border border-red-500 rounded-lg p-4">
                    <p className="text-red-400 text-sm">
                      ⚠️ Insufficient balance. You need {verifierStats.minStake} CGT to become a verifier.
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={handleBecomeVerifier}
                disabled={actionLoading || parseFloat(verifierStats.userTokenBalance) < parseFloat(verifierStats.minStake)}
                className="bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold px-8 py-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? 'Processing...' : 'Become a Verifier'}
              </button>

              <p className="text-gray-500 text-sm mt-4">
                By becoming a verifier, you agree to review activities fairly and honestly.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  const displayRequests = activeTab === 'pending' ? pendingRequests : completedRequests;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0a1f1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-[#22c55e]/10 rounded-full flex items-center justify-center">
                <Shield size={24} className="text-[#22c55e]" />
              </div>
              <div>
                <h1 className="text-white text-4xl font-bold">NGO/Verifier Portal</h1>
                <p className="text-[#22c55e] font-semibold">✓ Verified Member</p>
              </div>
            </div>
            <p className="text-gray-400">Review and verify user eco-activities on the blockchain</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#153029] rounded-xl p-6 border border-[#1a3a2e]">
              <Clock className="text-yellow-500 mb-3" size={24} />
              <p className="text-white text-3xl font-bold mb-1">{pendingRequests.length}</p>
              <p className="text-gray-400 text-sm">Pending Reviews</p>
            </div>

            <div className="bg-[#153029] rounded-xl p-6 border border-[#1a3a2e]">
              <CheckCircle className="text-[#22c55e] mb-3" size={24} />
              <p className="text-white text-3xl font-bold mb-1">{completedRequests.filter(r => r.votesFor >= verifierStats.minVotes).length}</p>
              <p className="text-gray-400 text-sm">Approved</p>
            </div>

            <div className="bg-[#153029] rounded-xl p-6 border border-[#1a3a2e]">
              <XCircle className="text-red-500 mb-3" size={24} />
              <p className="text-white text-3xl font-bold mb-1">{completedRequests.filter(r => r.votesAgainst >= verifierStats.minVotes).length}</p>
              <p className="text-gray-400 text-sm">Rejected</p>
            </div>

            <div className="bg-[#153029] rounded-xl p-6 border border-[#1a3a2e]">
              <Users className="text-blue-400 mb-3" size={24} />
              <p className="text-white text-3xl font-bold mb-1">{verifierStats.totalVerifiers}</p>
              <p className="text-gray-400 text-sm">Total Verifiers</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === 'pending'
                  ? 'bg-[#22c55e] text-white'
                  : 'bg-[#153029] text-gray-400 hover:text-white'
              }`}
            >
              Pending ({pendingRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === 'completed'
                  ? 'bg-[#22c55e] text-white'
                  : 'bg-[#153029] text-gray-400 hover:text-white'
              }`}
            >
              Completed ({completedRequests.length})
            </button>
          </div>

          {/* Requests List */}
          {displayRequests.length === 0 ? (
            <div className="bg-[#153029] rounded-xl p-12 text-center border border-[#1a3a2e]">
              <Clock className="text-gray-500 mx-auto mb-4" size={48} />
              <h3 className="text-white text-xl font-bold mb-2">
                {activeTab === 'pending' ? 'No Pending Requests' : 'No Completed Requests'}
              </h3>
              <p className="text-gray-400">
                {activeTab === 'pending' 
                  ? 'All activities have been reviewed!' 
                  : 'No verification history yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-[#153029] rounded-xl p-6 border border-[#1a3a2e] hover:border-[#22c55e] transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-white text-lg font-bold mb-1">
                        Request #{request.id}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Submitted {request.createdAt.toLocaleDateString()} at {request.createdAt.toLocaleTimeString()}
                      </p>
                    </div>
                    {request.executed && (
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                        request.votesFor >= verifierStats.minVotes
                          ? 'bg-[#22c55e]/20 text-[#22c55e]'
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {request.votesFor >= verifierStats.minVotes ? 'APPROVED' : 'REJECTED'}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-[#0a1f1a] rounded-lg p-4 border border-[#1a3a2e]">
                      <p className="text-gray-400 text-sm mb-2">User Activity</p>
                      <p className="text-white font-semibold mb-1">
                        {activityTypes[request.activity.type]}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Impact: {(request.activity.carbonImpact / 1000).toFixed(2)} kg CO₂
                      </p>
                      <p className="text-gray-400 text-sm">
                        User: {request.user.slice(0, 6)}...{request.user.slice(-4)}
                      </p>
                    </div>

                    <div className="bg-[#0a1f1a] rounded-lg p-4 border border-[#1a3a2e]">
                      <p className="text-gray-400 text-sm mb-2">Proposed Reward</p>
                      <p className="text-[#22c55e] text-2xl font-bold mb-1">
                        {request.proposedPoints} pts
                      </p>
                      <p className="text-gray-400 text-sm">Activity ID: #{request.activityId}</p>
                    </div>
                  </div>

                  {/* Voting Stats */}
                  <div className="bg-[#0a1f1a] rounded-lg p-4 border border-[#1a3a2e] mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">Voting Progress</span>
                      <span className="text-white font-semibold">
                        {request.votesFor + request.votesAgainst} / {verifierStats.minVotes} votes
                      </span>
                    </div>

                    <div className="flex gap-2 mb-3">
                      <div className="flex-1 bg-[#153029] rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-[#22c55e] h-full transition-all"
                          style={{ width: `${(request.votesFor / verifierStats.minVotes) * 100}%` }}
                        />
                      </div>
                      <div className="flex-1 bg-[#153029] rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-red-500 h-full transition-all"
                          style={{ width: `${(request.votesAgainst / verifierStats.minVotes) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-[#22c55e] font-semibold">
                        ✓ {request.votesFor} Approve
                      </span>
                      <span className="text-red-500 font-semibold">
                        ✗ {request.votesAgainst} Reject
                      </span>
                    </div>
                  </div>

                  {/* Vote Buttons */}
                  {!request.executed && (
                    <div className="flex gap-4">
                      {request.hasVoted ? (
                        <div className="w-full bg-yellow-500/10 border border-yellow-500 rounded-lg p-4 text-center">
                          <p className="text-yellow-500 font-semibold">
                            ✓ You have voted on this request
                          </p>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleVote(request.id, true)}
                            disabled={actionLoading}
                            className="flex-1 bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold py-3 px-6 rounded-lg transition disabled:opacity-50 flex items-center justify-center space-x-2"
                          >
                            <CheckCircle size={20} />
                            <span>Approve</span>
                          </button>

                          <button
                            onClick={() => handleVote(request.id, false)}
                            disabled={actionLoading}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition disabled:opacity-50 flex items-center justify-center space-x-2"
                          >
                            <XCircle size={20} />
                            <span>Reject</span>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default NGOVerifierPortal;