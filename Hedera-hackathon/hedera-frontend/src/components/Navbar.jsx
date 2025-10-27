// src/components/Navbar.jsx
import { Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';

function Navbar() {
  const { account, connectWallet, disconnectWallet, isConnecting } = useWeb3();
  const [showDropdown, setShowDropdown] = useState(false);

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="bg-[#0a1f1a] border-b border-[#1a3a2e] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#22c55e] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">🌱</span>
            </div>
            <span className="text-white text-xl font-bold">Climate Guardian</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="#dashboard" 
              className={`transition ${window.location.hash === '#dashboard' || !window.location.hash ? 'text-white' : 'text-gray-300 hover:text-white'}`}
            >
              Dashboard
            </a>
            <a 
              href="#alerts" 
              className={`transition ${window.location.hash === '#alerts' ? 'text-white' : 'text-gray-300 hover:text-white'}`}
            >
              Alerts
            </a>
            <a 
              href="#footprint" 
              className={`transition ${window.location.hash === '#footprint' ? 'text-white' : 'text-gray-300 hover:text-white'}`}
            >
              Carbon Tracker
            </a>
            <a 
              href="#rewards" 
              className={`transition ${window.location.hash === '#rewards' ? 'text-white' : 'text-gray-300 hover:text-white'}`}
            >
              Rewards
            </a>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-300 hover:text-white transition">
              <Bell size={20} />
            </button>

            {account ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-3 bg-[#153029] px-4 py-2 rounded-lg hover:bg-[#1a3a2e] transition"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#22c55e] rounded-full"></div>
                    <span className="text-white text-sm font-mono">
                      {formatAddress(account)}
                    </span>
                  </div>
                  <ChevronDown size={16} className="text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowDropdown(false)}
                    ></div>
                    
                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-48 bg-[#153029] rounded-lg border border-[#1a3a2e] shadow-xl z-20">
                      <div className="p-3 border-b border-[#1a3a2e]">
                        <p className="text-gray-400 text-xs mb-1">Connected Account</p>
                        <p className="text-white text-sm font-mono">{formatAddress(account)}</p>
                      </div>
                      
                      <button
                        onClick={() => {
                          disconnectWallet();
                          setShowDropdown(false);
                        }}
                        className="w-full flex items-center space-x-2 px-4 py-3 text-red-500 hover:bg-[#1a3a2e] transition"
                      >
                        <LogOut size={16} />
                        <span className="text-sm font-semibold">Disconnect</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold px-6 py-2 rounded-lg transition disabled:opacity-50"
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;