// src/App.jsx - FINAL VERSION
import { useState, useEffect } from 'react';
import { Web3Provider } from './context/Web3Context';

// Existing pages
import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import CarbonFootprint from './pages/CarbonFootprint';
import Rewards from './pages/Rewards';

// New pages
import LandingPage from './pages/LandingPage';
import DAOGovernance from './pages/DAOGovernance';
import ProfilePage from './pages/ProfilePage';

// Components
import AIAssistant from './components/AIAssistant';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [showAI, setShowAI] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        setCurrentPage(hash);
      } else {
        setCurrentPage('landing');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderPage = () => {
    switch(currentPage) {
      case 'landing':
        return <LandingPage />;
      
      case 'dashboard':
        return <Dashboard />;
      
      case 'alerts':
        return <Alerts />;
      
      case 'footprint':
        return <CarbonFootprint />;
      
      case 'rewards':
        return <Rewards />;
      
      case 'dao':
        return <DAOGovernance />;
      
      case 'profile':
        return <ProfilePage />;
      
      default:
        return <LandingPage />;
    }
  };

  return (
    <Web3Provider>
      {renderPage()}
      
      {/* AI Assistant Modal */}
      <AIAssistant isOpen={showAI} onClose={() => setShowAI(false)} />
      
      {/* Floating AI Button (appears on all pages except landing) */}
      {currentPage !== 'landing' && (
        <button
          onClick={() => setShowAI(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-[#22c55e] to-[#16a34a] rounded-full shadow-2xl shadow-[#22c55e]/50 flex items-center justify-center hover:scale-110 transition-transform z-40 animate-pulse"
          title="Ask ClimateGuard AI"
        >
          <span className="text-3xl">🤖</span>
        </button>
      )}
    </Web3Provider>
  );
}

export default App;