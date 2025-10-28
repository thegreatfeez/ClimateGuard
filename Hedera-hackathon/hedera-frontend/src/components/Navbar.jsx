// src/components/Navbar.jsx - UPDATED VERSION
import { Bell, User, LogOut, ChevronDown, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';

function Navbar() {
  const { account, connectWallet, disconnectWallet, isConnecting } = useWeb3();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const currentHash = window.location.hash.slice(1) || 'landing';

  const navLinks = [
    { name: 'Dashboard', hash: 'dashboard' },
    { name: 'Alerts', hash: 'alerts' },
    { name: 'Carbon Tracker', hash: 'footprint' },
    { name: 'Rewards', hash: 'rewards' },
    { name: 'DAO', hash: 'dao' },
  ];

  return (
    <nav className="bg-[#0a1f1a] border-b border-[#1a3a2e] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <a href="#landing" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#22c55e] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">🌱</span>
              </div>
              <span className="text-white text-xl font-bold">ClimateGuard</span>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.hash}
                href={`#${link.hash}`}
                className={`transition ${
                  currentHash === link.hash
                    ? 'text-white font-semibold'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Notifications - Only show if connected */}
            {account && (
              <button className="text-gray-300 hover:text-white transition hidden md:block">
                <Bell size={20} />
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden text-gray-300 hover:text-white transition"
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Desktop Account / Connect Button */}
            <div className="hidden md:block">
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

                        <a
                          href="#profile"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center space-x-2 px-4 py-3 text-gray-300 hover:bg-[#1a3a2e] transition"
                        >
                          <User size={16} />
                          <span className="text-sm font-semibold">My Profile</span>
                        </a>

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

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-[#1a3a2e] py-4">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.hash}
                  href={`#${link.hash}`}
                  onClick={() => setShowMobileMenu(false)}
                  className={`transition px-4 py-2 rounded-lg ${
                    currentHash === link.hash
                      ? 'text-white font-semibold bg-[#153029]'
                      : 'text-gray-300 hover:text-white hover:bg-[#153029]'
                  }`}
                >
                  {link.name}
                </a>
              ))}

              {account && (
                <a
                  href="#profile"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-[#153029] rounded-lg transition"
                >
                  <User size={16} />
                  <span>My Profile</span>
                </a>
              )}

              <div className="border-t border-[#1a3a2e] pt-4">
                {account ? (
                  <>
                    <div className="px-4 py-2 mb-2">
                      <p className="text-gray-400 text-xs mb-1">Connected</p>
                      <p className="text-white text-sm font-mono">{formatAddress(account)}</p>
                    </div>
                    <button
                      onClick={() => {
                        disconnectWallet();
                        setShowMobileMenu(false);
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-red-500 hover:bg-[#153029] rounded-lg transition"
                    >
                      <LogOut size={16} />
                      <span className="font-semibold">Disconnect</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      connectWallet();
                      setShowMobileMenu(false);
                    }}
                    disabled={isConnecting}
                    className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50"
                  >
                    {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;