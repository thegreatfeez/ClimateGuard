// src/pages/Alerts.jsx
import { useState, useEffect } from 'react';
import { Search, Cloud, Droplets, Wind, Sun, Flame, AlertTriangle } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import Navbar from '../components/Navbar';
import AlertBadge from '../components/AlertBadge';
import LoadingSpinner from '../components/LoadingSpinner';

function Alerts() {
  const { account, isCorrectNetwork } = useWeb3();
  
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [timeFilter, setTimeFilter] = useState('All'); // All, Past, Current, Future

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

  // Dummy data - Personal weather timeline
  const dummyAlerts = [
    // FUTURE FORECASTS
    {
      id: 1,
      category: 'Storm',
      severity: 'Critical',
      location: '24 Ijede Street, Ikorodu, Lagos, Nigeria',
      details: 'Severe weather alert! Tropical storm approaching your area. Wind gusts up to 100 km/h possible. Prepare emergency supplies.',
      timestamp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      type: 'future'
    },
    {
      id: 2,
      category: 'AirQuality',
      severity: 'Medium',
      location: '24 Ijede Street, Ikorodu, Lagos, Nigeria',
      details: 'Air quality forecast shows elevated pollution levels. Sensitive groups should limit outdoor activities.',
      timestamp: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      type: 'future'
    },
    {
      id: 3,
      category: 'Flood',
      severity: 'Medium',
      location: '24 Ijede Street, Ikorodu, Lagos, Nigeria',
      details: 'Flood watch issued for your location. Moderate rainfall predicted. Monitor local conditions.',
      timestamp: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      type: 'future'
    },
    {
      id: 4,
      category: 'Storm',
      severity: 'High',
      location: '24 Ijede Street, Ikorodu, Lagos, Nigeria',
      details: 'Severe thunderstorm forecast for your area. Heavy rain and winds up to 75 km/h expected. Plan accordingly.',
      timestamp: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      type: 'future'
    },
    {
      id: 5,
      category: 'Heatwave',
      severity: 'High',
      location: '24 Ijede Street, Ikorodu, Lagos, Nigeria',
      details: 'Heat wave forecast. Temperatures expected to reach 39°C. Stay hydrated and avoid prolonged sun exposure.',
      timestamp: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
      type: 'future'
    },

    // CURRENT
    {
      id: 6,
      category: 'AirQuality',
      severity: 'High',
      location: '24 Ijede Street, Ikorodu, Lagos, Nigeria',
      details: 'Air quality alert active now. High levels of PM2.5 detected at your location. AQI: 165. Consider staying indoors.',
      timestamp: new Date(), // Today
      type: 'current'
    },

    // PAST HISTORY
    {
      id: 7,
      category: 'Heatwave',
      severity: 'High',
      location: '24 Ijede Street, Ikorodu, Lagos, Nigeria',
      details: 'Heat wave recorded. Temperature reached 38°C with high humidity at your location.',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
      type: 'past'
    },
    {
      id: 8,
      category: 'Storm',
      severity: 'High',
      location: '24 Ijede Street, Ikorodu, Lagos, Nigeria',
      details: 'Thunderstorm event recorded. Heavy rainfall with winds up to 65 km/h affected your area.',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      type: 'past'
    },
    {
      id: 9,
      category: 'Flood',
      severity: 'Medium',
      location: '24 Ijede Street, Ikorodu, Lagos, Nigeria',
      details: 'Minor flooding occurred in your neighborhood. Street-level water accumulation reported.',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      type: 'past'
    },
    {
      id: 10,
      category: 'AirQuality',
      severity: 'Medium',
      location: '24 Ijede Street, Ikorodu, Lagos, Nigeria',
      details: 'Elevated air pollution recorded at your location. AQI reached 142 due to traffic and industrial activity.',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      type: 'past'
    },
    {
      id: 11,
      category: 'Heatwave',
      severity: 'Critical',
      location: '24 Ijede Street, Ikorodu, Lagos, Nigeria',
      details: 'Extreme heat event recorded. Temperature peaked at 41°C. Multiple heat-related incidents reported in area.',
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      type: 'past'
    },
    {
      id: 12,
      category: 'Storm',
      severity: 'Critical',
      location: '24 Ijede Street, Ikorodu, Lagos, Nigeria',
      details: 'Severe storm event. Damaging winds (95 km/h) and torrential rain caused power outages in your area.',
      timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
      type: 'past'
    },
    {
      id: 13,
      category: 'Flood',
      severity: 'High',
      location: '24 Ijede Street, Ikorodu, Lagos, Nigeria',
      details: 'Flash flooding event. Significant water accumulation affected roads near your location.',
      timestamp: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000), // 18 days ago
      type: 'past'
    },
    {
      id: 14,
      category: 'Drought',
      severity: 'Medium',
      location: '24 Ijede Street, Ikorodu, Lagos, Nigeria',
      details: 'Dry spell recorded. 15 consecutive days without rainfall affected water supply in your area.',
      timestamp: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
      type: 'past'
    },
    {
      id: 15,
      category: 'AirQuality',
      severity: 'High',
      location: '24 Ijede Street, Ikorodu, Lagos, Nigeria',
      details: 'Poor air quality event. Harmattan dust combined with emissions caused AQI of 188 at your location.',
      timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
      type: 'past'
    }
  ];

  useEffect(() => {
    if (account && isCorrectNetwork) {
      loadAlerts();
    }
  }, [account, isCorrectNetwork]);

  useEffect(() => {
    filterAlerts();
  }, [alerts, searchQuery, selectedCategory, selectedSeverity, timeFilter]);

  const loadAlerts = () => {
    setLoading(true);
    // Simulate loading
    setTimeout(() => {
      setAlerts(dummyAlerts);
      setLoading(false);
    }, 500);
  };

  const filterAlerts = () => {
    let filtered = [...alerts];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(alert =>
        alert.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(alert => alert.category === selectedCategory);
    }

    // Filter by severity
    if (selectedSeverity !== 'All') {
      filtered = filtered.filter(alert => alert.severity === selectedSeverity);
    }

    // Filter by time
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
            <p className="text-gray-400">Your personal weather timeline - Past history, current conditions, and future forecasts for your location</p>
          </div>

          {/* Search and Filters */}
          <div className="bg-[#153029] rounded-xl p-6 mb-6 border border-[#1a3a2e]">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search alerts by location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0a1f1a] text-white pl-12 pr-4 py-3 rounded-lg border border-[#1a3a2e] focus:border-[#22c55e] focus:outline-none transition"
              />
            </div>

            {/* Filter Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Time Filter */}
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

              {/* Category Filter */}
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

              {/* Severity Filter */}
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

          {/* Stats Summary */}
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

          {/* Alert Count */}
          <div className="mb-4">
            <p className="text-gray-400">
              Showing <span className="text-white font-semibold">{filteredAlerts.length}</span> alert{filteredAlerts.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Alerts List */}
          {loading ? (
            <LoadingSpinner size="lg" className="my-12" />
          ) : filteredAlerts.length === 0 ? (
            <div className="bg-[#153029] rounded-xl p-12 text-center border border-[#1a3a2e]">
              <AlertTriangle className="text-gray-500 mx-auto mb-4" size={48} />
              <h3 className="text-white text-xl font-bold mb-2">No Alerts Found</h3>
              <p className="text-gray-400">
                {alerts.length === 0 
                  ? 'There are no alerts at this time.' 
                  : 'No alerts match your current filters.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAlerts.map((alert) => {
                const Icon = categoryIcons[alert.category] || AlertTriangle;
                
                return (
                  <div 
                    key={alert.id}
                    className={`bg-[#153029] rounded-xl p-6 border transition-all duration-300 ${
                      alert.type === 'future' ? 'border-blue-500/30 hover:border-blue-500' :
                      alert.type === 'current' ? 'border-yellow-500/30 hover:border-yellow-500' :
                      'border-[#1a3a2e] hover:border-[#22c55e]'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
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

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-white text-lg font-bold">
                              {alert.category} {alert.type === 'future' ? 'Forecast' : alert.type === 'current' ? 'Alert' : 'Event'}
                            </h3>
                            <p className="text-gray-400 text-sm">{getTimeDisplay(alert.timestamp, alert.type)}</p>
                          </div>
                          <AlertBadge severity={alert.severity} />
                        </div>

                        <p className="text-gray-300 mb-3">{alert.details}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-gray-400">
                              📍 <span className="text-white">{alert.location}</span>
                            </span>
                          </div>
                          
                          <span className="text-gray-500 text-xs">
                            {alert.timestamp.toLocaleDateString()}
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