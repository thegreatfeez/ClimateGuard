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
import NGOVerifierPortal from './pages/NGOVerifierPortal';

// Components
import AIAssistant from './components/AIAssistant';

// Weather service
import { getCurrentWeather, getForecast, getUserLocation } from './services/weatherService';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [showAI, setShowAI] = useState(false);
  
  // Weather context for AI
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [weatherLoading, setWeatherLoading] = useState(false);

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

  // Load weather data for AI context (only once on mount)
  useEffect(() => {
    loadWeatherForAI();
  }, []);

  const loadWeatherForAI = async () => {
    setWeatherLoading(true);
    try {
      // Get user location
      const location = await getUserLocation().catch(() => {
        // Fallback to Lagos if geolocation fails
        return { lat: 6.5244, lon: 3.3792 };
      });

      // Fetch weather data
      const [weather, forecast] = await Promise.all([
        getCurrentWeather(location.lat, location.lon),
        getForecast(location.lat, location.lon)
      ]);

      setWeatherData(weather);
      setForecastData(forecast);

      // Generate basic alerts from weather (optional - can be empty array)
      // We'll let the Alerts page handle full alert generation
      setAlerts([]);
      
    } catch (error) {
      console.error('Error loading weather for AI:', error);
      // AI can still work without weather data
      setWeatherData(null);
      setForecastData(null);
      setAlerts([]);
    } finally {
      setWeatherLoading(false);
    }
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'landing':
        return <LandingPage />;
      
      // USER PORTAL ROUTES
      case 'user-dashboard':
        return <Dashboard />;
      
      case 'alerts':
        return <Alerts />;
      
      case 'footprint':
        return <CarbonFootprint />;
      
      case 'rewards':
        return <Rewards />;
      
      case 'profile':
        return <ProfilePage />;
      
      // STAKEHOLDER PORTAL ROUTES
      case 'stakeholder-dashboard':
        return <DAOGovernance />;
      
      case 'verifier':
        return <NGOVerifierPortal />;
      
      default:
        return <LandingPage />;
    }
  };

  return (
    <Web3Provider>
      {renderPage()}
      
      {/* AI Assistant Modal with Weather Context */}
      <AIAssistant 
        isOpen={showAI} 
        onClose={() => setShowAI(false)}
        weatherData={weatherData}
        forecastData={forecastData}
        alerts={alerts}
      />
      
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