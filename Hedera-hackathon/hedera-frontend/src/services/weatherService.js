const OPENWEATHER_API_KEY = 'YOUR_API_KEY_HERE'; // Get free key from openweathermap.org
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Get user's location using browser geolocation
 */
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
};

/**
 * Get location name from coordinates (reverse geocoding)
 */
export const getLocationName = async (lat, lon) => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`
    );
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
          date: item.dt
        };
      }
      dailyData[date].temps.push(item.main.temp);
      dailyData[date].conditions.push(item.weather[0].main);
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
  
  // High temperature alert
  if (currentWeather.temp >= 35) {
    alerts.push({
      id: Date.now() + 1,
      category: 'Heatwave',
      severity: currentWeather.temp >= 38 ? 'Critical' : 'High',
      location: currentWeather.location,
      details: `Extreme heat alert! Temperature at ${currentWeather.temp}°C. Stay hydrated and avoid outdoor activities during peak hours.`,
      timestamp: new Date(),
      type: 'current',
      tips: [
        'Drink water regularly',
        'Stay indoors between 12-3 PM',
        'Check on vulnerable individuals'
      ]
    });
  }
  
  // High humidity + heat
  if (currentWeather.temp >= 30 && currentWeather.humidity >= 70) {
    alerts.push({
      id: Date.now() + 2,
      category: 'AirQuality',
      severity: 'Medium',
      location: currentWeather.location,
      details: `High humidity (${currentWeather.humidity}%) combined with heat. Uncomfortable conditions expected.`,
      timestamp: new Date(),
      type: 'current',
      tips: [
        'Use air conditioning if available',
        'Stay in well-ventilated areas',
        'Reduce physical exertion'
      ]
    });
  }
  
  // Heavy rain forecast
  forecast.forEach((day, index) => {
    if (day.rain > 50) {
      const daysFromNow = index;
      alerts.push({
        id: Date.now() + 10 + index,
        category: 'Flood',
        severity: day.rain > 100 ? 'High' : 'Medium',
        location: currentWeather.location,
        details: `Heavy rainfall forecast (${day.rain}mm) in ${daysFromNow} day${daysFromNow !== 1 ? 's' : ''}. Flooding possible in low-lying areas.`,
        timestamp: day.date,
        type: 'future',
        tips: [
          'Clear drainage systems',
          'Move valuables to higher ground',
          'Avoid driving through water'
        ]
      });
    }
  });
  
  // Storm warning
  forecast.forEach((day, index) => {
    if (day.condition === 'Thunderstorm') {
      const daysFromNow = index;
      alerts.push({
        id: Date.now() + 20 + index,
        category: 'Storm',
        severity: 'High',
        location: currentWeather.location,
        details: `Thunderstorm forecast in ${daysFromNow} day${daysFromNow !== 1 ? 's' : ''}. Heavy rain and strong winds expected.`,
        timestamp: day.date,
        type: 'future',
        tips: [
          'Secure loose outdoor items',
          'Stay away from windows',
          'Unplug sensitive electronics'
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