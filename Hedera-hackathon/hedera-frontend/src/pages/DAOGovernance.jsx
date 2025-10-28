// src/pages/DAOGovernance.jsx
import { useState } from 'react';
import { Users, ThumbsUp, ThumbsDown, TrendingUp, Clock, CheckCircle, Award } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import Navbar from '../components/Navbar';

function DAOGovernance() {
  const { account } = useWeb3();
  const [votedProposals, setVotedProposals] = useState(new Set());
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);

  const proposals = [
    {
      id: 1,
      title: 'Fund Tree Planting Initiative in Lagos',
      description: 'Allocate 50,000 CGT tokens to plant 5,000 trees across Lagos communities. This will offset approximately 25 tons of CO₂ annually and create green jobs.',
      author: '0x7a9f...3c2d',
      created: '2 days ago',
      deadline: '5 days left',
      status: 'active',
      votesFor: 12450,
      votesAgainst: 3210,
      totalVotes: 15660,
      requiredVotes: 20000,
      category: 'Environment',
      impact: 'High'
    },
    {
      id: 2,
      title: 'Launch Flood Awareness Campaign',
      description: 'Create educational materials and workshops to prepare communities for flood season. Budget: 30,000 CGT for materials, trainer fees, and community outreach.',
      author: '0x4b2a...8f1e',
      created: '5 days ago',
      deadline: '2 days left',
      status: 'active',
      votesFor: 18920,
      votesAgainst: 5430,
      totalVotes: 24350,
      requiredVotes: 20000,
      category: 'Education',
      impact: 'Medium'
    },
    {
      id: 3,
      title: 'Upgrade AI Weather Prediction Model',
      description: 'Invest in advanced ML models for more accurate 14-day forecasts. This will improve alert precision by 25% and reduce false positives.',
      author: '0x9d4e...7a6b',
      created: '1 week ago',
      deadline: 'Voting ended',
      status: 'passed',
      votesFor: 25340,
      votesAgainst: 4120,
      totalVotes: 29460,
      requiredVotes: 20000,
      category: 'Technology',
      impact: 'High'
    },
    {
      id: 4,
      title: 'Partner with Local Schools for Climate Education',
      description: 'Develop curriculum and provide resources for climate education in 50 schools. Budget: 40,000 CGT for materials and teacher training.',
      author: '0x1c8f...2b9a',
      created: '10 days ago',
      deadline: 'Voting ended',
      status: 'rejected',
      votesFor: 8500,
      votesAgainst: 15200,
      totalVotes: 23700,
      requiredVotes: 20000,
      category: 'Education',
      impact: 'Medium'
    },
    {
      id: 5,
      title: 'Increase Tree Planting Reward Multiplier',
      description: 'Raise tree planting activity multiplier from 3x to 5x to incentivize more reforestation efforts. This will boost community participation.',
      author: '0x6e3d...4c7f',
      created: '3 days ago',
      deadline: '6 days left',
      status: 'active',
      votesFor: 9870,
      votesAgainst: 4320,
      totalVotes: 14190,
      requiredVotes: 20000,
      category: 'Rewards',
      impact: 'Medium'
    }
  ];

  const handleVote = (proposal, voteType) => {
    if (votedProposals.has(proposal.id)) {
      alert('You have already voted on this proposal');
      return;
    }

    setSelectedProposal({ ...proposal, voteType });
    setShowVoteModal(true);
  };

  const confirmVote = () => {
    if (selectedProposal) {
      const newVoted = new Set(votedProposals);
      newVoted.add(selectedProposal.id);
      setVotedProposals(newVoted);
      setShowVoteModal(false);
      
      // Simulate vote recording
      setTimeout(() => {
        alert(`✅ Vote recorded successfully!\n\nYour ${selectedProposal.voteType === 'yes' ? 'YES' : 'NO'} vote for "${selectedProposal.title}" has been recorded on-chain.`);
      }, 500);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-blue-500/10 text-blue-400 border-blue-500';
      case 'passed':
        return 'bg-green-500/10 text-green-400 border-green-500';
      case 'rejected':
        return 'bg-red-500/10 text-red-400 border-red-500';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Environment':
        return 'bg-green-500/10 text-green-400';
      case 'Education':
        return 'bg-purple-500/10 text-purple-400';
      case 'Technology':
        return 'bg-blue-500/10 text-blue-400';
      case 'Rewards':
        return 'bg-yellow-500/10 text-yellow-400';
      default:
        return 'bg-gray-500/10 text-gray-400';
    }
  };

  const getVotePercentage = (votesFor, votesAgainst) => {
    const total = votesFor + votesAgainst;
    return total > 0 ? ((votesFor / total) * 100).toFixed(1) : 0;
  };

  const getProgressPercentage = (totalVotes, requiredVotes) => {
    return Math.min((totalVotes / requiredVotes) * 100, 100);
  };

  if (!account) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0a1f1a] flex items-center justify-center">
          <div className="text-center">
            <Users className="text-[#22c55e] mx-auto mb-4" size={48} />
            <h2 className="text-white text-2xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-gray-400">Please connect your wallet to participate in DAO governance</p>
          </div>
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
            <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-6 py-2 mb-4">
              <Users className="text-purple-400" size={20} />
              <span className="text-purple-400 font-semibold">ClimaQ DAO</span>
            </div>
            <h1 className="text-white text-4xl font-bold mb-2">DAO Governance</h1>
            <p className="text-gray-400">Vote on proposals and shape the future of ClimateGuard</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#153029] rounded-xl p-6 border border-[#1a3a2e]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-400 text-sm">Active Proposals</h3>
                <TrendingUp className="text-blue-400" size={20} />
              </div>
              <p className="text-white text-3xl font-bold">
                {proposals.filter(p => p.status === 'active').length}
              </p>
            </div>

            <div className="bg-[#153029] rounded-xl p-6 border border-[#1a3a2e]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-400 text-sm">Your Votes</h3>
                <CheckCircle className="text-[#22c55e]" size={20} />
              </div>
              <p className="text-white text-3xl font-bold">{votedProposals.size}</p>
            </div>

            <div className="bg-[#153029] rounded-xl p-6 border border-[#1a3a2e]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-400 text-sm">Passed Proposals</h3>
                <Award className="text-yellow-400" size={20} />
              </div>
              <p className="text-white text-3xl font-bold">
                {proposals.filter(p => p.status === 'passed').length}
              </p>
            </div>

            <div className="bg-[#153029] rounded-xl p-6 border border-[#1a3a2e]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-400 text-sm">Total Participants</h3>
                <Users className="text-purple-400" size={20} />
              </div>
              <p className="text-white text-3xl font-bold">1,834</p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Users size={24} className="text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold mb-2">How DAO Governance Works</h3>
                <p className="text-gray-400 text-sm mb-3">
                  Your voting power is proportional to your CGT token holdings. Each proposal requires a minimum quorum of 20,000 votes to pass. All decisions are recorded transparently on the Hedera blockchain.
                </p>
                <div className="flex items-center space-x-2 text-purple-400 text-sm">
                  <CheckCircle size={16} />
                  <span>Powered by Hedera Consensus Service</span>
                </div>
              </div>
            </div>
          </div>

          {/* Proposals List */}
          <div className="space-y-6">
            {proposals.map((proposal) => {
              const votePercentage = getVotePercentage(proposal.votesFor, proposal.votesAgainst);
              const progressPercentage = getProgressPercentage(proposal.totalVotes, proposal.requiredVotes);
              const hasVoted = votedProposals.has(proposal.id);

              return (
                <div
                  key={proposal.id}
                  className="bg-[#153029] rounded-xl p-6 border border-[#1a3a2e] hover:border-[#22c55e] transition-all duration-300"
                >
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(proposal.status)}`}>
                          {proposal.status.toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(proposal.category)}`}>
                          {proposal.category}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400">
                          {proposal.impact} Impact
                        </span>
                      </div>
                      <h3 className="text-white text-xl font-bold mb-2">{proposal.title}</h3>
                      <p className="text-gray-400 text-sm">{proposal.description}</p>
                    </div>
                    
                    {proposal.status === 'active' && (
                      <div className="flex items-center space-x-2 text-yellow-500 text-sm">
                        <Clock size={16} />
                        <span className="font-semibold">{proposal.deadline}</span>
                      </div>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <span>By {proposal.author}</span>
                    <span>•</span>
                    <span>{proposal.created}</span>
                  </div>

                  {/* Voting Stats */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-400">
                        {proposal.totalVotes.toLocaleString()} / {proposal.requiredVotes.toLocaleString()} votes
                      </span>
                      <span className="text-white font-semibold">{votePercentage}% in favor</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-[#0a1f1a] rounded-full h-3 mb-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#22c55e] to-[#16a34a] transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>

                    {/* Vote Breakdown */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/30">
                        <div className="flex items-center justify-between">
                          <span className="text-green-400 text-sm font-semibold">YES</span>
                          <ThumbsUp size={16} className="text-green-400" />
                        </div>
                        <p className="text-white text-xl font-bold mt-1">
                          {proposal.votesFor.toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/30">
                        <div className="flex items-center justify-between">
                          <span className="text-red-400 text-sm font-semibold">NO</span>
                          <ThumbsDown size={16} className="text-red-400" />
                        </div>
                        <p className="text-white text-xl font-bold mt-1">
                          {proposal.votesAgainst.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Vote Buttons */}
                  {proposal.status === 'active' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleVote(proposal, 'yes')}
                        disabled={hasVoted}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        <ThumbsUp size={20} />
                        <span>{hasVoted ? 'Voted' : 'Vote YES'}</span>
                      </button>
                      
                      <button
                        onClick={() => handleVote(proposal, 'no')}
                        disabled={hasVoted}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        <ThumbsDown size={20} />
                        <span>{hasVoted ? 'Voted' : 'Vote NO'}</span>
                      </button>
                    </div>
                  )}

                  {hasVoted && proposal.status === 'active' && (
                    <div className="mt-3 bg-[#22c55e]/10 border border-[#22c55e]/30 rounded-lg p-3 text-center">
                      <p className="text-[#22c55e] text-sm font-semibold">
                        ✓ You have voted on this proposal
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Vote Confirmation Modal */}
      {showVoteModal && selectedProposal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a1f1a] rounded-2xl max-w-md w-full border border-[#22c55e]/30 p-6">
            <h3 className="text-white text-2xl font-bold mb-4">Confirm Your Vote</h3>
            
            <div className="bg-[#153029] rounded-lg p-4 mb-6 border border-[#1a3a2e]">
              <p className="text-gray-400 text-sm mb-2">You are voting:</p>
              <p className={`text-2xl font-bold ${
                selectedProposal.voteType === 'yes' ? 'text-green-400' : 'text-red-400'
              }`}>
                {selectedProposal.voteType === 'yes' ? 'YES' : 'NO'}
              </p>
              <p className="text-white font-semibold mt-3 mb-1">{selectedProposal.title}</p>
              <p className="text-gray-500 text-sm">Proposal #{selectedProposal.id}</p>
            </div>

            <p className="text-gray-400 text-sm mb-6">
              This action will be recorded on the Hedera blockchain and cannot be undone. Your vote will be publicly visible.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowVoteModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmVote}
                className="flex-1 bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold py-3 px-6 rounded-lg transition"
              >
                Confirm Vote
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DAOGovernance;