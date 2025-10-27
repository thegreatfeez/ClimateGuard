// src/App.jsx
import { useState, useEffect } from 'react';
import { Web3Provider } from './context/Web3Context';
import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import CarbonFootprint from './pages/CarbonFootprint';
import Rewards from './pages/Rewards';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash) setCurrentPage(hash);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <Web3Provider>
      {currentPage === 'alerts' && <Alerts />}
      {currentPage === 'footprint' && <CarbonFootprint />}
      {currentPage === 'rewards' && <Rewards />}
      {currentPage === 'dashboard' && <Dashboard />}
      {!['alerts', 'footprint', 'rewards', 'dashboard'].includes(currentPage) && <Dashboard />}
    </Web3Provider>
  );
}

export default App;