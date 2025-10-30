
const OPENWEATHER_API_KEY = '579377576879717ba6d659fd240accb8';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Get user's location using browser geolocation with detailed error handling
 */
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      const error = new Error('GEOLOCATION_NOT_SUPPORTED');
      error.details = 'Your browser does not support geolocation';
      reject(error);
      return;
    }

    // Check if we're on a secure context
    const isSecure = window.isSecureContext || window.location.protocol === 'https:' || window.location.hostname === 'localhost';
    
    if (!isSecure) {
      console.warn('⚠️ Geolocation may not work on insecure HTTP connections');
      console.warn('💡 Try accessing via localhost or HTTPS');
    }

    console.log('📍 Requesting geolocation with options...');
    
    const options = {
      enableHighAccuracy: true,  // Try to get best accuracy
      timeout: 10000,            // Wait up to 10 seconds
      maximumAge: 0              // Don't use cached position
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('✅ Geolocation successful!');
        console.log('📍 Coordinates:', {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          accuracy: `${Math.round(position.coords.accuracy)}m`
        });
        
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (error) => {
        console.error('❌ Geolocation error:', error);
        
        // Provide detailed error messages
        let userMessage = '';
        let errorType = '';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorType = 'PERMISSION_DENIED';
            userMessage = 'Location access was denied. Please enable location permissions in your browser settings.';
            console.error('🚫 User denied location permission');
            console.log('💡 Fix: Click the padlock icon in address bar → Location → Allow');
            break;
            
          case error.POSITION_UNAVAILABLE:
            errorType = 'POSITION_UNAVAILABLE';
            userMessage = 'Location information is unavailable. Check your device settings.';
            console.error('📍 Location unavailable - GPS/network issue');
            break;
            
          case error.TIMEOUT:
            errorType = 'TIMEOUT';
            userMessage = 'Location request timed out. Please try again.';
            console.error('⏱️ Geolocation request timed out');
            break;
            
          default:
            errorType = 'UNKNOWN';
            userMessage = 'An unknown error occurred while getting your location.';
            console.error('❓ Unknown geolocation error');
        }
        
        const customError = new Error(userMessage);
        customError.type = errorType;
        customError.originalError = error;
        reject(customError);
      },
      options
    );
  });
};

/**
 * Alternative: Get location by IP address (less accurate but works everywhere)
 */
export const getLocationByIP = async () => {
  try {
    console.log('🌐 Trying IP-based geolocation...');
    
    // Using ipapi.co (free, no API key needed)
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    if (data.latitude && data.longitude) {
      console.log('✅ IP location found:', {
        city: data.city,
        country: data.country_name,
        lat: data.latitude,
        lon: data.longitude
      });
      
      return {
        lat: data.latitude,
        lon: data.longitude,
        city: data.city,
        country: data.country_name,
        method: 'ip'
      };
    }
    
    throw new Error('IP geolocation failed');
  } catch (error) {
    console.error('❌ IP geolocation error:', error);
    throw error;
  }
};

/**
 * Smart location detector - tries GPS first, falls back to IP
 */
export const getSmartLocation = async () => {
  try {
    console.log('🎯 Attempting smart location detection...');
    
    // Try GPS first
    try {
      const gpsLocation = await getUserLocation();
      console.log('✅ Using GPS location');
      return { ...gpsLocation, method: 'gps' };
    } catch (gpsError) {
      console.warn('⚠️ GPS failed, trying IP location...', gpsError.type);
      
      // If GPS fails, try IP-based location
      const ipLocation = await getLocationByIP();
      console.log('✅ Using IP-based location (less accurate)');
      return ipLocation;
    }
  } catch (error) {
    console.error('❌ All location methods failed');
    throw new Error('Could not determine your location. Please check your settings and try again.');
  }
};

/**
 * Get location name from coordinates (reverse geocoding)
 */
export const getLocationName = async (lat, lon) => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return `${data.name}, ${data.sys.country}`;
  } catch (error) {
    console.error('Error getting location name:', error);
    return 'Unknown Location';
  }
};

/**
 * Get current weather by coordinates
 */
export const getCurrentWeather = async (lat, lon) => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
    );
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your OpenWeather API key.');
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      pressure: data.main.pressure,
      visibility: Math.round(data.visibility / 1000),
      icon: data.weather[0].icon,
      location: `${data.name}, ${data.sys.country}`
    };
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw error;
  }
};

/**
 * Get 5-day forecast by coordinates
 */
export const getForecast = async (lat, lon) => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
    );
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your OpenWeather API key.');
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Group by day
    const dailyData = {};
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!dailyData[date]) {
        dailyData[date] = {
          temps: [],
          conditions: [],
          rain: 0,
          wind: 0,
          date: item.dt
        };
      }
      dailyData[date].temps.push(item.main.temp);
      dailyData[date].conditions.push(item.weather[0].main);
      dailyData[date].wind = Math.max(dailyData[date].wind, item.wind.speed * 3.6);
      if (item.rain) {
        dailyData[date].rain += (item.rain['3h'] || 0);
      }
    });
    
    // Convert to array and calculate daily stats
    const forecast = Object.values(dailyData).slice(0, 7).map(day => {
      const maxTemp = Math.round(Math.max(...day.temps));
      const minTemp = Math.round(Math.min(...day.temps));
      const condition = getMostFrequent(day.conditions);
      
      return {
        date: new Date(day.date * 1000),
        high: maxTemp,
        low: minTemp,
        condition: condition,
        rain: Math.round(day.rain),
        wind: Math.round(day.wind),
        icon: getWeatherIcon(condition)
      };
    });
    
    return forecast;
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
};

/**
 * Generate alerts based on weather conditions
 */
export const generateAlerts = (currentWeather, forecast) => {
  const alerts = [];
  const now = new Date();
  
  // === CURRENT ALERTS ===
  
  // Extreme heat alert
  if (currentWeather.temp >= 35) {
    alerts.push({
      id: `heat-current-${now.getTime()}`,
      category: 'Heatwave',
      severity: currentWeather.temp >= 40 ? 'Critical' : currentWeather.temp >= 38 ? 'High' : 'Medium',
      location: currentWeather.location,
      details: `Extreme heat alert! Current temperature: ${currentWeather.temp}°C (Feels like: ${currentWeather.feelsLike}°C). ${currentWeather.temp >= 40 ? 'CRITICAL - Life-threatening conditions.' : 'High risk of heat exhaustion.'}`,
      timestamp: now,
      type: 'current',
      tips: [
        'Stay hydrated - drink water every 15-20 minutes',
        'Avoid outdoor activities between 12 PM - 4 PM',
        'Check on elderly neighbors and vulnerable individuals',
        'Never leave children or pets in vehicles'
      ]
    });
  }
  
  // High humidity + heat
  if (currentWeather.temp >= 28 && currentWeather.humidity >= 70) {
    alerts.push({
      id: `humidity-current-${now.getTime()}`,
      category: 'Heatwave',
      severity: currentWeather.temp >= 32 ? 'High' : 'Medium',
      location: currentWeather.location,
      details: `High heat index! Temp ${currentWeather.temp}°C with ${currentWeather.humidity}% humidity. Feels much hotter.`,
      timestamp: now,
      type: 'current',
      tips: [
        'Stay in air-conditioned spaces',
        'Reduce physical activity',
        'Watch for heat illness signs'
      ]
    });
  }

  // Strong winds
  if (currentWeather.windSpeed >= 40) {
    alerts.push({
      id: `wind-current-${now.getTime()}`,
      category: 'Storm',
      severity: currentWeather.windSpeed >= 60 ? 'High' : 'Medium',
      location: currentWeather.location,
      details: `Strong winds: ${currentWeather.windSpeed} km/h. ${currentWeather.windSpeed >= 60 ? 'Damaging winds possible.' : 'Exercise caution.'}`,
      timestamp: now,
      type: 'current',
      tips: [
        'Secure loose outdoor items',
        'Avoid parking under trees',
        'Drive carefully'
      ]
    });
  }

  // Thunderstorms
  if (currentWeather.condition === 'Thunderstorm') {
    alerts.push({
      id: `storm-current-${now.getTime()}`,
      category: 'Storm',
      severity: 'High',
      location: currentWeather.location,
      details: `Active thunderstorm! Lightning, heavy rain, and strong winds present.`,
      timestamp: now,
      type: 'current',
      tips: [
        'Stay indoors',
        'Unplug electronics',
        'Avoid windows',
        'Wait 30 min after last thunder'
      ]
    });
  }

  // === FUTURE ALERTS ===
  forecast.forEach((day, index) => {
    const forecastDate = day.date;
    
    // Heavy rain
    if (day.rain > 50) {
      alerts.push({
        id: `rain-future-${forecastDate.getTime()}`,
        category: day.rain > 100 ? 'Flood' : 'Storm',
        severity: day.rain > 100 ? 'High' : 'Medium',
        location: currentWeather.location,
        details: `Heavy rain forecast: ${day.rain}mm in ${index} day${index !== 1 ? 's' : ''}. ${day.rain > 100 ? 'Severe flooding possible.' : 'Moderate flooding risk.'}`,
        timestamp: forecastDate,
        type: 'future',
        tips: [
          'Clear drainage systems',
          'Prepare emergency supplies',
          'Avoid flood-prone areas'
        ]
      });
    }
    
    // Storms
    if (day.condition === 'Thunderstorm') {
      alerts.push({
        id: `storm-future-${forecastDate.getTime()}`,
        category: 'Storm',
        severity: day.wind > 60 ? 'High' : 'Medium',
        location: currentWeather.location,
        details: `Thunderstorm forecast in ${index} day${index !== 1 ? 's' : ''}. Heavy rain and winds expected.`,
        timestamp: forecastDate,
        type: 'future',
        tips: [
          'Secure outdoor items',
          'Charge devices',
          'Prepare flashlights'
        ]
      });
    }
  });
  
  return alerts;
};

// Helper functions
const getMostFrequent = (arr) => {
  const frequency = {};
  arr.forEach(item => {
    frequency[item] = (frequency[item] || 0) + 1;
  });
  return Object.keys(frequency).reduce((a, b) => 
    frequency[a] > frequency[b] ? a : b
  );
};

const getWeatherIcon = (condition) => {
  const icons = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '❄️',
    'Mist': '🌫️',
    'Fog': '🌫️'
  };
  return icons[condition] || '🌤️';
};