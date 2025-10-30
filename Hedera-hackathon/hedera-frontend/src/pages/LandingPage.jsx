import { useState } from 'react';
import { Cloud, Shield, Coins, Users, TrendingUp, ArrowRight, Leaf, Zap, Globe, Award } from 'lucide-react';

function LandingPage() {
  const [stats] = useState({
    ecoActions: 5247,
    co2Saved: 203,
    activeUsers: 1834,
    tokensEarned: 45620
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1f1a] via-[#0d2621] to-[#0a1f1a]">
      {/* Simple Top Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 bg-[#0a1f1a]/80 backdrop-blur-sm border-b border-[#1a3a2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Cloud className="text-[#22c55e]" size={28} />
              <span className="text-white text-xl font-bold">ClimateGuard</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-[#22c55e]/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Logo Animation */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-[#22c55e] to-[#16a34a] rounded-2xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300 shadow-2xl shadow-[#22c55e]/50">
                <Cloud size={48} className="text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-bounce">
                <Zap size={16} className="text-white" />
              </div>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-[#22c55e] to-white bg-clip-text text-transparent">
            Predict. Prepare. Protect.
          </h1>
          
          <p className="text-2xl md:text-3xl text-[#22c55e] font-semibold mb-8">
            Earn with ClimateGuard
          </p>

          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            AI-powered climate resilience platform combining real-time weather predictions, 
            personalized alerts, and blockchain rewards for eco-friendly actions.
          </p>

          {/* DUAL PORTAL BUTTONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
            
            {/* USER PORTAL */}
            <div className="bg-gradient-to-br from-[#22c55e] to-[#16a34a] rounded-2xl p-8 text-left transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-[#22c55e]/30">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Leaf size={28} className="text-white" />
                </div>
                <h2 className="text-white text-2xl font-bold">User Portal</h2>
              </div>
              
              <p className="text-white/90 mb-6 text-sm">
                Track your carbon footprint, receive weather alerts, and earn CGT tokens for eco-friendly activities.
              </p>

              <ul className="space-y-2 mb-6">
                <li className="flex items-center space-x-2 text-white text-sm">
                  <span className="text-white">✓</span>
                  <span>Real-time weather alerts</span>
                </li>
                <li className="flex items-center space-x-2 text-white text-sm">
                  <span className="text-white">✓</span>
                  <span>Carbon footprint tracking</span>
                </li>
                <li className="flex items-center space-x-2 text-white text-sm">
                  <span className="text-white">✓</span>
                  <span>Earn CGT token rewards</span>
                </li>
                <li className="flex items-center space-x-2 text-white text-sm">
                  <span className="text-white">✓</span>
                  <span>AI climate assistant</span>
                </li>
              </ul>

              <button
                onClick={() => window.location.hash = '#user-dashboard'}
                className="w-full bg-white text-[#22c55e] hover:bg-gray-100 font-bold px-6 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
              >
                <span>Enter User Portal</span>
                <ArrowRight size={20} />
              </button>
            </div>

            {/* STAKEHOLDER PORTAL */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 text-left transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-purple-500/30">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Shield size={28} className="text-white" />
                </div>
                <h2 className="text-white text-2xl font-bold">Stakeholder Portal</h2>
              </div>
              
              <p className="text-white/90 mb-6 text-sm">
                For NGOs, investors, and DAO members. Verify activities, vote on proposals, and govern the platform.
              </p>

              <ul className="space-y-2 mb-6">
                <li className="flex items-center space-x-2 text-white text-sm">
                  <span className="text-white">✓</span>
                  <span>Verify eco-activities</span>
                </li>
                <li className="flex items-center space-x-2 text-white text-sm">
                  <span className="text-white">✓</span>
                  <span>Vote on DAO proposals</span>
                </li>
                <li className="flex items-center space-x-2 text-white text-sm">
                  <span className="text-white">✓</span>
                  <span>Platform governance</span>
                </li>
                <li className="flex items-center space-x-2 text-white text-sm">
                  <span className="text-white">✓</span>
                  <span>Community oversight</span>
                </li>
              </ul>

              <button
                onClick={() => window.location.hash = '#stakeholder-dashboard'}
                className="w-full bg-white text-purple-600 hover:bg-gray-100 font-bold px-6 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
              >
                <span>Enter Stakeholder Portal</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          {/* AI Illustration */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-[#153029]/80 to-[#0a1f1a]/80 backdrop-blur-lg rounded-2xl p-8 border border-[#22c55e]/30 shadow-2xl">
              <div className="flex items-center justify-center space-x-8">
                <div className="text-6xl animate-bounce">🌍</div>
                <div className="text-4xl">→</div>
                <div className="text-6xl animate-pulse">🤖</div>
                <div className="text-4xl">→</div>
                <div className="text-6xl animate-bounce" style={{animationDelay: '0.3s'}}>☀️</div>
              </div>
              <p className="text-gray-400 mt-6 text-sm">
                AI analyzing global weather patterns in real-time
              </p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-[#22c55e] rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-[#22c55e] rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Live Stats Bar */}
      <section className="bg-[#153029] border-y border-[#22c55e]/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Leaf className="text-[#22c55e]" size={24} />
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                {stats.ecoActions.toLocaleString()}+
              </p>
              <p className="text-gray-400 text-sm">Eco Actions</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Cloud className="text-blue-400" size={24} />
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                {stats.co2Saved} tons
              </p>
              <p className="text-gray-400 text-sm">CO₂ Saved</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="text-purple-400" size={24} />
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                {stats.activeUsers.toLocaleString()}+
              </p>
              <p className="text-gray-400 text-sm">Active Users</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Coins className="text-yellow-400" size={24} />
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                {stats.tokensEarned.toLocaleString()}
              </p>
              <p className="text-gray-400 text-sm">Tokens Earned</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose ClimateGuard?
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Comprehensive climate resilience powered by cutting-edge technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#153029] rounded-2xl p-8 border border-[#1a3a2e] hover:border-[#22c55e] transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-[#22c55e]/10 rounded-xl flex items-center justify-center mb-6">
                <Cloud className="text-[#22c55e]" size={32} />
              </div>
              <h3 className="text-white text-2xl font-bold mb-4">AI Weather Predictions</h3>
              <p className="text-gray-400 leading-relaxed">
                Get hyper-local weather forecasts powered by advanced AI models. 
                Receive early warnings for extreme weather events up to 14 days in advance.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#153029] rounded-2xl p-8 border border-[#1a3a2e] hover:border-[#22c55e] transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
                <Shield className="text-blue-400" size={32} />
              </div>
              <h3 className="text-white text-2xl font-bold mb-4">Blockchain Security</h3>
              <p className="text-gray-400 leading-relaxed">
                Your data and rewards are secured on Hedera blockchain. 
                Transparent, immutable, and decentralized climate action tracking.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#153029] rounded-2xl p-8 border border-[#1a3a2e] hover:border-[#22c55e] transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-6">
                <Coins className="text-yellow-400" size={32} />
              </div>
              <h3 className="text-white text-2xl font-bold mb-4">Earn Rewards</h3>
              <p className="text-gray-400 leading-relaxed">
                Get rewarded with CGT tokens for eco-friendly actions. 
                Convert points to tokens and participate in the green economy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DAO Section */}
      <section className="py-20 bg-gradient-to-br from-[#153029] to-[#0a1f1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-6 py-2 mb-6">
              <Users className="text-purple-400" size={20} />
              <span className="text-purple-400 font-semibold">Community Governed</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Decentralized Climate Action
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Platform decisions are made by stakeholders through transparent on-chain voting
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#0a1f1a]/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
              <h3 className="text-white text-xl font-bold mb-4">Community Governance</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start space-x-2">
                  <span className="text-purple-400 mt-1">✓</span>
                  <span>Vote on climate project funding</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-400 mt-1">✓</span>
                  <span>Propose new eco initiatives</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-400 mt-1">✓</span>
                  <span>Participate in platform decisions</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#0a1f1a]/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
              <h3 className="text-white text-xl font-bold mb-4">Transparent Operations</h3>
              <p className="text-gray-400 mb-6">
                All decisions, verifications, and token distributions are recorded on-chain. 
                Complete transparency builds trust in our climate action community.
              </p>
              <button 
                onClick={() => window.location.hash = '#stakeholder-dashboard'}
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Join as Stakeholder
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a1f1a] border-t border-[#1a3a2e] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Cloud className="text-[#22c55e]" size={24} />
              <span className="text-white font-bold text-xl">ClimateGuard</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2025 ClimateGuard. Powered by Hedera & AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;