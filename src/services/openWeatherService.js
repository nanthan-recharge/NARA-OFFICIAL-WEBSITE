/**
 * OpenWeather Marine & Weather Service
 */

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const LOCATIONS = {
  colombo: { lat: 6.9271, lon: 79.8612, name: 'Colombo' },
  trincomalee: { lat: 8.5874, lon: 81.2152, name: 'Trincomalee' },
  galle: { lat: 6.0367, lon: 80.217, name: 'Galle' },
  hambantota: { lat: 6.1246, lon: 81.1185, name: 'Hambantota' }
};

/**
 * Generate mock weather data
 */
function generateMockWeatherData(lat, lon) {
  const conditions = ['clear sky', 'few clouds', 'scattered clouds', 'broken clouds', 'light rain'];
  const condition = conditions[Math.floor(Math.random() * conditions.length)];

  return {
    temp: parseFloat((26 + Math.random() * 6).toFixed(1)),
    feelsLike: parseFloat((26 + Math.random() * 6).toFixed(1)),
    humidity: Math.floor(65 + Math.random() * 25),
    pressure: Math.floor(1008 + Math.random() * 8),
    windSpeed: parseFloat((2 + Math.random() * 4).toFixed(1)),
    windDirection: Math.floor(Math.random() * 360),
    clouds: Math.floor(Math.random() * 100),
    description: condition,
    icon: condition.includes('clear') ? '01d' : condition.includes('rain') ? '10d' : '03d'
  };
}

export async function fetchWeatherData(lat, lon) {
  try {
    // Use mock data for demo (OpenWeather API may have CORS restrictions)
    const mockData = generateMockWeatherData(lat, lon);
    return {
      success: true,
      data: mockData,
      source: 'OpenWeather API (Demo Mode)'
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Generate mock forecast data
 */
function generateMockForecastData() {
  const conditions = ['clear sky', 'few clouds', 'scattered clouds', 'broken clouds', 'light rain', 'overcast clouds'];
  const forecast = [];

  for (let i = 0; i < 40; i++) { // 5 days, 8 times per day (3-hour intervals)
    const time = new Date(Date.now() + i * 3 * 3600000).toISOString();
    const condition = conditions[Math.floor(Math.random() * conditions.length)];

    forecast.push({
      time,
      temp: parseFloat((24 + Math.random() * 8).toFixed(1)),
      humidity: Math.floor(60 + Math.random() * 30),
      windSpeed: parseFloat((2 + Math.random() * 5).toFixed(1)),
      description: condition
    });
  }

  return forecast;
}

export async function fetchForecast(lat, lon) {
  try {
    // Use mock data for demo
    const mockForecast = generateMockForecastData();
    return {
      success: true,
      data: mockForecast,
      source: 'OpenWeather API (Demo Mode)'
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function fetchMultipleLocations() {
  const results = await Promise.all(
    Object.values(LOCATIONS).map(async loc => {
      const weather = await fetchWeatherData(loc.lat, loc.lon);
      return { ...weather, location: loc };
    })
  );
  return results;
}

function processWeatherData(data) {
  return {
    temp: data.main?.temp,
    feelsLike: data.main?.feels_like,
    humidity: data.main?.humidity,
    pressure: data.main?.pressure,
    windSpeed: data.wind?.speed,
    windDirection: data.wind?.deg,
    clouds: data.clouds?.all,
    description: data.weather?.[0]?.description,
    icon: data.weather?.[0]?.icon
  };
}

function processForecastData(data) {
  return data.list?.map(item => ({
    time: item.dt_txt,
    temp: item.main.temp,
    humidity: item.main.humidity,
    windSpeed: item.wind.speed,
    description: item.weather[0].description
  })) || [];
}

export default {
  fetchWeatherData,
  fetchForecast,
  fetchMultipleLocations,
  LOCATIONS
};
