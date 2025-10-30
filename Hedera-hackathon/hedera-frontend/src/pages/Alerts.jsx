import { useState, useEffect } from 'react';
import { Search, Cloud, Droplets, Wind, Sun, Flame, AlertTriangle, MapPin, RefreshCw, Info } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import { getCurrentWeather, getForecast, generateAlerts, getSmartLocation, getLocationName } from '../services/weatherService';
import Navbar from '../components/Navbar';
import AlertBadge from '../components/AlertBadge';
import LoadingSpinner from '../components/LoadingSpinner';

function Alerts() {
  const { account, isCorrectNetwork } = useWeb3();
  
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [locationMethod, setLocationMethod] = useState(''); // 'gps' or 'ip'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [timeFilter, setTimeFilter] = useState('All');
  const [error, setError] = useState(null);

  const categories = ['All', 'Storm', 'Flood', 'AirQuality', 'Heatwave', 'Drought', 'Wildfire', 'Other'];
  const severities = ['All', 'Low', 'Medium', 'High', 'Critical'];
  const timeFilters = ['All', 'Future', 'Current', 'Past'];

  const categoryIcons = {
    Storm: Cloud,
    Flood: Droplets,
    AirQuality: Wind,
    Heatwave: Sun,
    Drought: Sun,
    Wildfire: Flame,
    Other: AlertTriangle,
  };

  // Get user location on mount
  useEffect(() => {
    console.log('🔍 Alerts page mounted - detecting location...');
    detectUserLocation();
  }, []);

  // Load weather data when location changes
  useEffect(() => {
    if (userLocation && account && isCorrectNetwork) {
      console.log('📍 Location changed, loading weather:', userLocation);
      loadWeatherData();
    }
  }, [userLocation, account, isCorrectNetwork]);

  // Filter alerts when filters change
  useEffect(() => {
    filterAlerts();
  }, [alerts, searchQuery, selectedCategory, selectedSeverity, timeFilter]);

  const detectUserLocation = async () => {
    setLocationLoading(true);
    setError(null);
    
    console.log('🌍 Starting smart location detection...');
    
    try {
      // Use smart location (GPS with IP fallback)
      const location = await getSmartLocation();
      
      console.log('✅ Location obtained:', location);
      setUserLocation({ lat: location.lat, lon: location.lon });
      setLocationMethod(location.method);
      
      console.log('🏙️ Getting location name...');
      const name = await getLocationName(location.lat, location.lon);
      
      console.log('✅ Location name:', name);
      setLocationName(name);
      
      if (location.method === 'ip') {
        setError('Using IP-based location (less accurate). For precise alerts, enable GPS in browser settings.');
      }
      
    } catch (error) {
      console.error('❌ Location detection completely failed:', error);
      setError(error.message || 'Could not determine your location.');
      
      // NO DEFAULT FALLBACK - Show error state
      setUserLocation(null);
      setLocationName('');
      setLocationMethod('failed');
      
      console.log('🚫 No location available - alerts cannot be displayed');
    } finally {
      setLocationLoading(false);
    }
  };

  const loadWeatherData = async () => {
    if (!userLocation) {
      console.warn('⚠️ No location available, skipping weather load');
      return;
    }
    
    setLoading(true);
    
    console.log('☁️ Loading weather data for:', userLocation);
    
    try {
      // Fetch current weather
      console.log('🌡️ Fetching current weather...');
      const weather = await getCurrentWeather(userLocation.lat, userLocation.lon);
      console.log('✅ Current weather:', weather);
      setCurrentWeather(weather);

      // Fetch forecast
      console.log('📅 Fetching forecast...');
      const forecast = await getForecast(userLocation.lat, userLocation.lon);
      console.log('✅ Forecast data:', forecast);

      // Generate alerts from weather data
      console.log('⚠️ Generating alerts...');
      const weatherAlerts = generateAlerts(weather, forecast);
      console.log('✅ Generated alerts:', weatherAlerts);
      
      setAlerts(weatherAlerts);
      
      // Clear error only if IP-based warning is showing
      if (locationMethod !== 'ip') {
        setError(null);
      }
      
    } catch (error) {
      console.error('❌ Weather loading error:', error);
      setError(`Failed to load weather: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filterAlerts = () => {
    let filtered = [...alerts];

    if (searchQuery) {
      filtered = filtered.filter(alert =>
        alert.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(alert => alert.category === selectedCategory);
    }

    if (selectedSeverity !== 'All') {
      filtered = filtered.filter(alert => alert.severity === selectedSeverity);
    }

    if (timeFilter !== 'All') {
      filtered = filtered.filter(alert => alert.type === timeFilter.toLowerCase());
    }

    setFilteredAlerts(filtered);
  };

  const getTimeDisplay = (date, type) => {
    const now = new Date();
    const diffMs = date - now;
    const diffDays = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60));
    
    if (type === 'future') {
      if (diffDays === 0) return '🔮 Later today';
      if (diffDays === 1) return '🔮 Tomorrow';
      return `🔮 ${diffDays} days from now`;
    } else if (type === 'current') {
      if (diffHours < 1) return '🌟 Active now';
      return '🌟 Today';
    } else {
      if (diffDays === 0) return '📅 Earlier today';
      if (diffDays === 1) return '📅 Yesterday';
      return `📅 ${diffDays} days ago`;
    }
  };

  if (!account || !isCorrectNetwork) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0a1f1a] flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="text-[#22c55e] mx-auto mb-4" size={48} />
            <h2 className="text-white text-2xl font-bold mb-2">
              {!account ? 'Wallet Not Connected' : 'Wrong Network'}
            </h2>
            <p className="text-gray-400">
              {!account ? 'Please connect your wallet to view alerts' : 'Please switch to Hedera Testnet'}
            </p>
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
            <h1 className="text-white text-4xl font-bold mb-2">Weather & Environmental Alerts</h1>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <p className="text-gray-400">Real-time weather predictions for your location</p>
              {locationName && (
                <div className="flex items-center space-x-2">
                  <MapPin size={20} className="text-[#22c55e]" />
                  <span className="text-white font-semibold">{locationName}</span>
                  {locationMethod === 'ip' && (
                    <span className="text-yellow-500 text-xs bg-yellow-500/10 px-2 py-1 rounded">
                      IP-based
                    </span>
                  )}
                  {locationMethod === 'gps' && (
                    <span className="text-[#22c55e] text-xs bg-[#22c55e]/10 px-2 py-1 rounded">
                      GPS
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Location Info Bar */}
          <div className="bg-[#153029] rounded-xl p-4 mb-6 border border-[#1a3a2e] flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              {locationLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <MapPin className="text-[#22c55e]" size={24} />
              )}
              <div>
                <p className="text-white font-semibold">
                  {locationLoading ? 'Detecting location...' : locationName || 'Location unavailable'}
                </p>
                {currentWeather && (
                  <p className="text-gray-400 text-sm">
                    {currentWeather.temp}°C, {currentWeather.description} • Wind: {currentWeather.windSpeed} km/h • Humidity: {currentWeather.humidity}%
                  </p>
                )}
              </div>
            </div>
            
            <button
              onClick={() => {
                console.log('🔄 Manual refresh');
                detectUserLocation();
              }}
              disabled={loading || locationLoading}
              className="flex items-center space-x-2 bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold px-4 py-2 rounded-lg transition disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading || locationLoading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Error/Info Display */}
          {error && (
            <div className={`rounded-xl p-4 mb-6 flex items-start space-x-3 ${
              locationMethod === 'ip' 
                ? 'bg-blue-500/10 border border-blue-500' 
                : 'bg-yellow-500/10 border border-yellow-500'
            }`}>
              <Info className={locationMethod === 'ip' ? 'text-blue-500' : 'text-yellow-500'} size={24} />
              <div className="flex-1">
                <p className={`font-semibold mb-1 ${locationMethod === 'ip' ? 'text-blue-500' : 'text-yellow-500'}`}>
                  {locationMethod === 'ip' ? 'Info' : 'Warning'}
                </p>
                <p className={locationMethod === 'ip' ? 'text-blue-400' : 'text-yellow-400'}>{error}</p>
                {locationMethod === 'ip' && (
                  <p className="text-gray-400 text-sm mt-2">
                    💡 Enable GPS in browser settings for more accurate weather alerts
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div className="bg-[#153029] rounded-xl p-6 mb-6 border border-[#1a3a2e]">
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0a1f1a] text-white pl-12 pr-4 py-3 rounded-lg border border-[#1a3a2e] focus:border-[#22c55e] focus:outline-none transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Time Period</label>
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="w-full bg-[#0a1f1a] text-white px-4 py-2 rounded-lg border border-[#1a3a2e] focus:border-[#22c55e] focus:outline-none transition"
                >
                  {timeFilters.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-[#0a1f1a] text-white px-4 py-2 rounded-lg border border-[#1a3a2e] focus:border-[#22c55e] focus:outline-none transition"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">Severity</label>
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="w-full bg-[#0a1f1a] text-white px-4 py-2 rounded-lg border border-[#1a3a2e] focus:border-[#22c55e] focus:outline-none transition"
                >
                  {severities.map(sev => (
                    <option key={sev} value={sev}>{sev}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#153029] rounded-lg p-4 border border-[#1a3a2e]">
              <p className="text-gray-400 text-sm mb-1">Future Forecasts</p>
              <p className="text-[#22c55e] text-2xl font-bold">
                {alerts.filter(a => a.type === 'future').length}
              </p>
            </div>
            <div className="bg-[#153029] rounded-lg p-4 border border-[#1a3a2e]">
              <p className="text-gray-400 text-sm mb-1">Active Alerts</p>
              <p className="text-yellow-500 text-2xl font-bold">
                {alerts.filter(a => a.type === 'current').length}
              </p>
            </div>
            <div className="bg-[#153029] rounded-lg p-4 border border-[#1a3a2e]">
              <p className="text-gray-400 text-sm mb-1">Past Events</p>
              <p className="text-gray-400 text-2xl font-bold">
                {alerts.filter(a => a.type === 'past').length}
              </p>
            </div>
          </div>

          {/* Alerts List */}
          {loading ? (
            <div className="text-center py-12">
              <LoadingSpinner size="lg" />
              <p className="text-gray-400 mt-4">Loading weather data...</p>
            </div>
          ) : !userLocation ? (
            <div className="bg-red-500/10 border border-red-500 rounded-xl p-12 text-center">
              <AlertTriangle className="text-red-500 mx-auto mb-4" size={64} />
              <h3 className="text-white text-2xl font-bold mb-4">Location Required</h3>
              <p className="text-red-400 mb-6 max-w-md mx-auto">
                {error || 'Unable to detect your location. Weather alerts cannot be displayed without location access.'}
              </p>
              
              <div className="bg-[#0a1f1a] rounded-lg p-6 max-w-lg mx-auto text-left mb-6">
                <h4 className="text-white font-bold mb-3">🔧 Troubleshooting Steps:</h4>
                <ol className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start">
                    <span className="text-[#22c55e] mr-2 font-bold">1.</span>
                    <span>Click the 🔒 padlock icon in your browser's address bar</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#22c55e] mr-2 font-bold">2.</span>
                    <span>Change "Location" permission to <strong className="text-white">"Allow"</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#22c55e] mr-2 font-bold">3.</span>
                    <span>Make sure you're using <strong className="text-white">localhost</strong> (not IP address)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#22c55e] mr-2 font-bold">4.</span>
                    <span>Click the "Refresh Location" button above</span>
                  </li>
                </ol>
              </div>

              <button
                onClick={detectUserLocation}
                disabled={locationLoading}
                className="bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold px-8 py-3 rounded-lg transition disabled:opacity-50"
              >
                {locationLoading ? 'Detecting...' : 'Try Again'}
              </button>
              
              <p className="text-gray-500 text-sm mt-4">
                Your location data stays private and is only used for weather alerts.
              </p>
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="bg-[#153029] rounded-xl p-12 text-center border border-[#1a3a2e]">
              <AlertTriangle className="text-gray-500 mx-auto mb-4" size={48} />
              <h3 className="text-white text-xl font-bold mb-2">
                {alerts.length === 0 ? '✅ No Active Alerts' : 'No Matching Alerts'}
              </h3>
              <p className="text-gray-400">
                {alerts.length === 0 
                  ? 'Weather conditions are normal for your location!' 
                  : 'Try adjusting your filters.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-400">
                Showing <span className="text-white font-semibold">{filteredAlerts.length}</span> alert{filteredAlerts.length !== 1 ? 's' : ''}
              </p>
              
              {filteredAlerts.map((alert) => {
                const Icon = categoryIcons[alert.category] || AlertTriangle;
                return (
                  <div 
                    key={alert.id}
                    className={`bg-[#153029] rounded-xl p-6 border transition ${
                      alert.type === 'future' ? 'border-blue-500/30' :
                      alert.type === 'current' ? 'border-yellow-500/30' :
                      'border-[#1a3a2e]'
                    } hover:border-[#22c55e]`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        alert.severity === 'Critical' ? 'bg-red-500/10' :
                        alert.severity === 'High' ? 'bg-orange-500/10' :
                        alert.severity === 'Medium' ? 'bg-yellow-500/10' :
                        'bg-blue-500/10'
                      }`}>
                        <Icon size={24} className={
                          alert.severity === 'Critical' ? 'text-red-500' :
                          alert.severity === 'High' ? 'text-orange-500' :
                          alert.severity === 'Medium' ? 'text-yellow-500' :
                          'text-blue-500'
                        } />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-white text-lg font-bold">{alert.category}</h3>
                            <p className="text-gray-400 text-sm">{getTimeDisplay(alert.timestamp, alert.type)}</p>
                          </div>
                          <AlertBadge severity={alert.severity} />
                        </div>

                        <p className="text-gray-300 mb-3">{alert.details}</p>

                        {alert.tips && alert.tips.length > 0 && (
                          <div className="bg-[#0a1f1a] rounded-lg p-3 mb-3 border border-[#1a3a2e]">
                            <p className="text-[#22c55e] text-sm font-semibold mb-2">💡 Safety Tips:</p>
                            <ul className="space-y-1">
                              {alert.tips.map((tip, idx) => (
                                <li key={idx} className="text-gray-400 text-sm flex items-start">
                                  <span className="text-[#22c55e] mr-2">•</span>
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">📍 {alert.location}</span>
                          <span className="text-gray-500 text-xs">
                            {alert.timestamp.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Alerts;