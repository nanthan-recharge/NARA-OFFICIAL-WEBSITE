/**
 * Stormglass Maritime Weather API Service
 * High-resolution wave, temperature, currents, and tide forecasts
 * API Documentation: https://docs.stormglass.io/
 */

const API_KEY = import.meta.env.VITE_STORMGLASS_API_KEY;
const BASE_URL = 'https://api.stormglass.io/v2';

// Sri Lanka key maritime locations
export const SRI_LANKA_LOCATIONS = {
  colombo: { lat: 6.9271, lng: 79.8612, name: 'Colombo Port' },
  trincomalee: { lat: 8.5874, lng: 81.2152, name: 'Trincomalee Port' },
  galle: { lat: 6.0367, lng: 80.217, name: 'Galle Port' },
  hambantota: { lat: 6.1246, lng: 81.1185, name: 'Hambantota Port' },
  jaffna: { lat: 9.6615, lng: 80.0255, name: 'Jaffna' },
  batticaloa: { lat: 7.7102, lng: 81.6924, name: 'Batticaloa' }
};

/**
 * Generate mock weather data for demonstration
 */
function generateMockWeatherData(lat, lng) {
  const now = new Date();
  const hours = [];

  for (let i = 0; i < 24; i++) {
    const time = new Date(now.getTime() + i * 3600000).toISOString();
    hours.push({
      time,
      waveHeight: parseFloat((1.2 + Math.random() * 0.8).toFixed(2)),
      waterTemperature: parseFloat((27 + Math.random() * 2).toFixed(1)),
      currentSpeed: parseFloat((0.3 + Math.random() * 0.4).toFixed(2)),
      currentDirection: Math.floor(Math.random() * 360),
      seaLevel: parseFloat((0.2 + Math.random() * 0.6).toFixed(2)),
      swellHeight: parseFloat((0.8 + Math.random() * 0.5).toFixed(2)),
      swellDirection: Math.floor(Math.random() * 360),
      windSpeed: parseFloat((3 + Math.random() * 5).toFixed(2)),
      windDirection: Math.floor(Math.random() * 360)
    });
  }

  return {
    hours,
    current: hours[0],
    forecast: hours.slice(1, 25)
  };
}

/**
 * Fetch weather point data for specific coordinates
 * Note: Uses demo data as Stormglass API requires server-side proxy due to CORS
 */
export async function fetchWeatherPoint(lat, lng, params = []) {
  try {
    // Generate mock data for demonstration
    // In production, this would require a backend proxy to avoid CORS issues
    const mockData = generateMockWeatherData(lat, lng);

    return {
      success: true,
      data: mockData,
      source: 'Stormglass Maritime API (Demo Mode)',
      note: 'Using simulated data. Production requires backend proxy for API access.'
    };
  } catch (error) {
    console.error('Stormglass fetch error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate mock tide data
 */
function generateMockTideData() {
  const now = new Date();
  const tides = [];

  // Generate 10 tide events (alternating high/low)
  for (let i = 0; i < 10; i++) {
    const time = new Date(now.getTime() + i * 6 * 3600000).toISOString(); // Every 6 hours
    const type = i % 2 === 0 ? 'high' : 'low';
    const height = type === 'high' ? (1.8 + Math.random() * 0.4) : (0.3 + Math.random() * 0.3);

    tides.push({
      time,
      height: parseFloat(height.toFixed(2)),
      type
    });
  }

  return tides;
}

/**
 * Fetch tide data for location
 * Note: Uses demo data as Stormglass API requires server-side proxy due to CORS
 */
export async function fetchTideData(lat, lng) {
  try {
    // Generate mock tide data for demonstration
    const mockTides = generateMockTideData();

    return {
      success: true,
      data: mockTides,
      source: 'Stormglass Tide API (Demo Mode)'
    };
  } catch (error) {
    console.error('Stormglass tide fetch error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Fetch multiple locations data
 */
export async function fetchMultipleLocations(locations = Object.values(SRI_LANKA_LOCATIONS)) {
  const promises = locations.map(loc => 
    fetchWeatherPoint(loc.lat, loc.lng).then(result => ({
      ...result,
      location: loc
    }))
  );

  const results = await Promise.all(promises);
  return results;
}

/**
 * Process weather data for easier consumption
 */
function processWeatherData(data) {
  if (!data.hours || data.hours.length === 0) {
    return null;
  }

  const processed = data.hours.map(hour => {
    const getAverage = (param) => {
      if (!hour[param]) return null;
      const values = Object.values(hour[param]).filter(v => typeof v === 'number');
      return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : null;
    };

    return {
      time: hour.time,
      waveHeight: getAverage('waveHeight'),
      waterTemperature: getAverage('waterTemperature'),
      currentSpeed: getAverage('currentSpeed'),
      currentDirection: getAverage('currentDirection'),
      seaLevel: getAverage('seaLevel'),
      swellHeight: getAverage('swellHeight'),
      swellDirection: getAverage('swellDirection'),
      windSpeed: getAverage('windSpeed'),
      windDirection: getAverage('windDirection')
    };
  });

  return {
    hours: processed,
    current: processed[0],
    forecast: processed.slice(1, 25) // Next 24 hours
  };
}

/**
 * Process tide data
 */
function processTideData(data) {
  if (!data.data || data.data.length === 0) {
    return null;
  }

  return data.data.map(tide => ({
    time: tide.time,
    height: tide.height,
    type: tide.type // 'high' or 'low'
  }));
}

/**
 * Get current conditions for a location
 */
export async function getCurrentConditions(locationKey) {
  const location = SRI_LANKA_LOCATIONS[locationKey];
  if (!location) {
    return { success: false, error: 'Invalid location' };
  }

  return await fetchWeatherPoint(location.lat, location.lng);
}

export default {
  fetchWeatherPoint,
  fetchTideData,
  fetchMultipleLocations,
  getCurrentConditions,
  SRI_LANKA_LOCATIONS
};
