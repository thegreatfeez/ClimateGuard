import { Bell, User, LogOut, ChevronDown, Menu, X, Shield, Leaf } from 'lucide-react';
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

  // Determine which portal we're in
  const isUserPortal = ['user-dashboard', 'alerts', 'footprint', 'rewards', 'profile'].includes(currentHash);
  const isStakeholderPortal = ['stakeholder-dashboard', 'verifier'].includes(currentHash);

  // Define navigation links based on portal
  const userNavLinks = [
    { name: 'Dashboard', hash: 'user-dashboard' },
    { name: 'Alerts', hash: 'alerts' },
    { name: 'Carbon Tracker', hash: 'footprint' },
    { name: 'Rewards', hash: 'rewards' },
  ];

  const stakeholderNavLinks = [
    { name: 'DAO Governance', hash: 'stakeholder-dashboard' },
    { name: 'Verifier Portal', hash: 'verifier' },
  ];

  const navLinks = isStakeholderPortal ? stakeholderNavLinks : userNavLinks;
  const portalType = isStakeholderPortal ? 'stakeholder' : 'user';
  const portalColor = isStakeholderPortal ? 'purple' : 'green';

  return (
    <nav className="bg-[#0a1f1a] border-b border-[#1a3a2e] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo with Portal Indicator */}
          <div className="flex items-center space-x-3">
            <a href="#landing" className="flex items-center space-x-2">
              <div className={`w-8 h-8 ${
                isStakeholderPortal 
                  ? 'bg-purple-500' 
                  : 'bg-[#22c55e]'
              } rounded-lg flex items-center justify-center`}>
                {isStakeholderPortal ? (
                  <Shield size={20} className="text-white" />
                ) : (
                  <Leaf size={20} className="text-white" />
                )}
              </div>
              <span className="text-white text-xl font-bold">ClimateGuard</span>
            </a>
            
            {(isUserPortal || isStakeholderPortal) && (
              <span className={`hidden md:block px-3 py-1 rounded-full text-xs font-bold ${
                isStakeholderPortal
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500'
                  : 'bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]'
              }`}>
                {isStakeholderPortal ? '🛡️ Stakeholder' : '🌱 User'} Portal
              </span>
            )}
          </div>

          {/* Desktop Navigation Links */}
          {(isUserPortal || isStakeholderPortal) && (
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
          )}

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Portal Switcher - Only show if in a portal */}
            {(isUserPortal || isStakeholderPortal) && (
              <a
                href={isStakeholderPortal ? '#user-dashboard' : '#stakeholder-dashboard'}
                className={`hidden md:flex items-center space-x-2 px-4 py-2 rounded-lg border transition ${
                  isStakeholderPortal
                    ? 'border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e] hover:text-white'
                    : 'border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white'
                }`}
              >
                {isStakeholderPortal ? (
                  <>
                    <Leaf size={16} />
                    <span className="text-sm font-semibold">Switch to User</span>
                  </>
                ) : (
                  <>
                    <Shield size={16} />
                    <span className="text-sm font-semibold">Switch to Stakeholder</span>
                  </>
                )}
              </a>
            )}

            {/* Notifications - Only show if connected and in portal */}
            {account && (isUserPortal || isStakeholderPortal) && (
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
                      <div className={`w-2 h-2 rounded-full ${
                        isStakeholderPortal ? 'bg-purple-400' : 'bg-[#22c55e]'
                      }`}></div>
                      <span className="text-white text-sm font-mono">
                        {formatAddress(account)}
                      </span>
                    </div>
                    <ChevronDown size={16} className="text-gray-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowDropdown(false)}
                      ></div>

                      <div className="absolute right-0 mt-2 w-48 bg-[#153029] rounded-lg border border-[#1a3a2e] shadow-xl z-20">
                        <div className="p-3 border-b border-[#1a3a2e]">
                          <p className="text-gray-400 text-xs mb-1">Connected Account</p>
                          <p className="text-white text-sm font-mono">{formatAddress(account)}</p>
                        </div>

                        {isUserPortal && (
                          <a
                            href="#profile"
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center space-x-2 px-4 py-3 text-gray-300 hover:bg-[#1a3a2e] transition"
                          >
                            <User size={16} />
                            <span className="text-sm font-semibold">My Profile</span>
                          </a>
                        )}

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
                  className={`font-semibold px-6 py-2 rounded-lg transition disabled:opacity-50 ${
                    isStakeholderPortal
                      ? 'bg-purple-500 hover:bg-purple-600 text-white'
                      : 'bg-[#22c55e] hover:bg-[#16a34a] text-white'
                  }`}
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
              {/* Portal Switcher - Mobile */}
              {(isUserPortal || isStakeholderPortal) && (
                <a
                  href={isStakeholderPortal ? '#user-dashboard' : '#stakeholder-dashboard'}
                  onClick={() => setShowMobileMenu(false)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg border transition ${
                    isStakeholderPortal
                      ? 'border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e] hover:text-white'
                      : 'border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white'
                  }`}
                >
                  {isStakeholderPortal ? (
                    <>
                      <Leaf size={16} />
                      <span className="text-sm font-semibold">Switch to User Portal</span>
                    </>
                  ) : (
                    <>
                      <Shield size={16} />
                      <span className="text-sm font-semibold">Switch to Stakeholder Portal</span>
                    </>
                  )}
                </a>
              )}

              {/* Navigation Links - Mobile */}
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

              {account && isUserPortal && (
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
                    className={`w-full font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50 ${
                      isStakeholderPortal
                        ? 'bg-purple-500 hover:bg-purple-600 text-white'
                        : 'bg-[#22c55e] hover:bg-[#16a34a] text-white'
                    }`}
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