/**
 * NARA Copernicus Marine Data Service
 * Fetches live ocean data from Python Flask backend
 */

const BACKEND_URL = import.meta.env.VITE_COPERNICUS_BACKEND_URL || 'http://localhost:5000';

/**
 * Fetch live sea surface temperature
 * @param {Object} options - Query options
 * @param {string} options.date - Date in YYYY-MM-DD format
 * @param {number} options.depth - Depth in meters (default 0)
 * @returns {Promise<Object>} Temperature data
 */
export async function fetchLiveTemperature(options = {}) {
  try {
    const params = new URLSearchParams();
    if (options.date) params.append('date', options.date);
    if (options.depth !== undefined) params.append('depth', options.depth);

    const response = await fetch(`${BACKEND_URL}/api/ocean/temperature/live?${params}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching temperature data:', error);
    throw error;
  }
}

/**
 * Fetch live ocean currents
 * @param {Object} options - Query options
 * @param {string} options.date - Date in YYYY-MM-DD format
 * @param {number} options.depth - Depth in meters (default 0)
 * @returns {Promise<Object>} Ocean currents data (U/V components, speed, direction)
 */
export async function fetchLiveCurrents(options = {}) {
  try {
    const params = new URLSearchParams();
    if (options.date) params.append('date', options.date);
    if (options.depth !== undefined) params.append('depth', options.depth);

    const response = await fetch(`${BACKEND_URL}/api/ocean/currents/live?${params}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching currents data:', error);
    throw error;
  }
}

/**
 * Fetch live wave conditions
 * @param {Object} options - Query options
 * @param {string} options.date - Date in YYYY-MM-DD format
 * @returns {Promise<Object>} Wave data (height, direction, period)
 */
export async function fetchLiveWaves(options = {}) {
  try {
    const params = new URLSearchParams();
    if (options.date) params.append('date', options.date);

    const response = await fetch(`${BACKEND_URL}/api/ocean/waves/live?${params}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching waves data:', error);
    throw error;
  }
}

/**
 * Fetch live salinity data
 * @param {Object} options - Query options
 * @param {string} options.date - Date in YYYY-MM-DD format
 * @param {number} options.depth - Depth in meters (default 0)
 * @returns {Promise<Object>} Salinity data
 */
export async function fetchLiveSalinity(options = {}) {
  try {
    const params = new URLSearchParams();
    if (options.date) params.append('date', options.date);
    if (options.depth !== undefined) params.append('depth', options.depth);

    const response = await fetch(`${BACKEND_URL}/api/ocean/salinity/live?${params}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching salinity data:', error);
    throw error;
  }
}

/**
 * Fetch historical ocean data
 * @param {Object} options - Query options
 * @param {string} options.dataset - Dataset type: temperature, currents, waves, salinity
 * @param {string} options.startDate - Start date YYYY-MM-DD
 * @param {string} options.endDate - End date YYYY-MM-DD
 * @param {number} options.depth - Depth in meters
 * @returns {Promise<Object>} Historical data
 */
export async function fetchHistoricalData(options = {}) {
  try {
    const params = new URLSearchParams();
    if (options.dataset) params.append('dataset', options.dataset);
    if (options.startDate) params.append('start_date', options.startDate);
    if (options.endDate) params.append('end_date', options.endDate);
    if (options.depth !== undefined) params.append('depth', options.depth);

    const response = await fetch(`${BACKEND_URL}/api/ocean/historical?${params}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw error;
  }
}

/**
 * Fetch data for a specific station/location
 * @param {Object} options - Query options
 * @param {number} options.lat - Latitude
 * @param {number} options.lon - Longitude
 * @param {string} options.date - Date YYYY-MM-DD
 * @param {string[]} options.datasets - Array of dataset types
 * @returns {Promise<Object>} Station data
 */
export async function fetchStationData(options = {}) {
  try {
    const params = new URLSearchParams();
    if (options.lat !== undefined) params.append('lat', options.lat);
    if (options.lon !== undefined) params.append('lon', options.lon);
    if (options.date) params.append('date', options.date);
    if (options.datasets) params.append('datasets', options.datasets.join(','));

    const response = await fetch(`${BACKEND_URL}/api/ocean/station?${params}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching station data:', error);
    throw error;
  }
}

/**
 * List all available datasets
 * @returns {Promise<Object>} Dataset information
 */
export async function listDatasets() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/datasets`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error listing datasets:', error);
    throw error;
  }
}

/**
 * Check backend health status
 * @returns {Promise<Object>} Health status
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/health`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Backend health check failed:', error);
    throw error;
  }
}

/**
 * Format date to YYYY-MM-DD
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
export function formatDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get date range for historical queries
 * @param {number} daysBack - Number of days to go back
 * @returns {Object} Start and end dates
 */
export function getDateRange(daysBack = 7) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysBack);

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate)
  };
}

export default {
  fetchLiveTemperature,
  fetchLiveCurrents,
  fetchLiveWaves,
  fetchLiveSalinity,
  fetchHistoricalData,
  fetchStationData,
  listDatasets,
  checkBackendHealth,
  formatDate,
  getDateRange,
  BACKEND_URL
};
