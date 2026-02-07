import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  fetchWeatherPoint,
  fetchTideData,
  fetchMultipleLocations,
  SRI_LANKA_LOCATIONS
} from '../../services/stormglassService';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function StormglassMaritimePage() {
  const [allLocationsData, setAllLocationsData] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [tideData, setTideData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    fetchAllLocations();

    if (autoRefresh) {
      const interval = setInterval(fetchAllLocations, 5 * 60 * 1000); // 5 minutes
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const fetchAllLocations = async () => {
    setLoading(true);
    setError(null);

    try {
      const results = await fetchMultipleLocations();
      setAllLocationsData(results);

      // Select first location by default
      if (results.length > 0 && results[0].success) {
        setSelectedLocation(results[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = async (locationData) => {
    setSelectedLocation(locationData);

    // Fetch tide data for selected location
    try {
      const tides = await fetchTideData(locationData.location.lat, locationData.location.lng);
      if (tides.success) {
        setTideData(tides.data);
      }
    } catch (err) {
      console.error('Tide fetch error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold mb-4">Maritime Weather Conditions</h1>
            <p className="text-xl text-blue-100">
              Real-time wave heights, water temperature, and maritime forecasts powered by Stormglass API
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Data Controls</h3>
              <p className="text-sm text-gray-600">Select location and configure auto-refresh</p>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Auto-refresh (5 min)</span>
              </label>

              <button
                onClick={fetchAllLocations}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {loading ? 'Loading...' : 'Refresh Data'}
              </button>
            </div>
          </div>
        </motion.div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8">
            <p className="font-semibold">Error Loading Data</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Map Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Sri Lankan Maritime Locations</h2>

          <div className="h-96 rounded-lg overflow-hidden">
            <MapContainer
              center={[7.8731, 80.7718]}
              zoom={7}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {allLocationsData.map((locData, idx) => (
                <Marker
                  key={idx}
                  position={[locData.location.lat, locData.location.lng]}
                  eventHandlers={{
                    click: () => handleLocationSelect(locData)
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-lg">{locData.location.name}</h3>
                      {locData.success && locData.data?.current && (
                        <div className="mt-2 space-y-1 text-sm">
                          <p>Wave Height: {locData.data.current.waveHeight?.toFixed(2) || 'N/A'} m</p>
                          <p>Water Temp: {locData.data.current.waterTemperature?.toFixed(1) || 'N/A'} °C</p>
                          <p>Current Speed: {locData.data.current.currentSpeed?.toFixed(2) || 'N/A'} m/s</p>
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </motion.div>

        {/* Location Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {allLocationsData.map((locData, idx) => (
            <LocationCard
              key={idx}
              locationData={locData}
              isSelected={selectedLocation?.location.name === locData.location.name}
              onClick={() => handleLocationSelect(locData)}
            />
          ))}
        </div>

        {/* Detailed View for Selected Location */}
        {selectedLocation && selectedLocation.success && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              {selectedLocation.location.name} - Detailed Forecast
            </h2>

            {/* Current Conditions */}
            {selectedLocation.data?.current && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Current Conditions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard
                    label="Wave Height"
                    value={selectedLocation.data.current.waveHeight?.toFixed(2) || 'N/A'}
                    unit="meters"
                    icon="🌊"
                  />
                  <StatCard
                    label="Water Temperature"
                    value={selectedLocation.data.current.waterTemperature?.toFixed(1) || 'N/A'}
                    unit="°C"
                    icon="🌡️"
                  />
                  <StatCard
                    label="Current Speed"
                    value={selectedLocation.data.current.currentSpeed?.toFixed(2) || 'N/A'}
                    unit="m/s"
                    icon="💨"
                  />
                  <StatCard
                    label="Sea Level"
                    value={selectedLocation.data.current.seaLevel?.toFixed(2) || 'N/A'}
                    unit="meters"
                    icon="📊"
                  />
                </div>
              </div>
            )}

            {/* 24-Hour Forecast */}
            {selectedLocation.data?.forecast && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">24-Hour Forecast</h3>
                <div className="overflow-x-auto">
                  <ForecastTable forecast={selectedLocation.data.forecast.slice(0, 24)} />
                </div>
              </div>
            )}

            {/* Tide Information */}
            {tideData && (
              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Tide Schedule</h3>
                <TideSchedule tides={tideData.slice(0, 10)} />
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function LocationCard({ locationData, isSelected, onClick }) {
  const { location, success, data, error } = locationData;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`bg-white rounded-lg shadow-lg p-6 cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-blue-500 shadow-xl' : 'hover:shadow-xl'
      }`}
    >
      <h3 className="text-xl font-bold text-gray-800 mb-4">{location.name}</h3>

      {success && data?.current ? (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Wave Height</span>
            <span className="font-semibold text-blue-600">
              {data.current.waveHeight?.toFixed(2) || 'N/A'} m
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Water Temp</span>
            <span className="font-semibold text-orange-600">
              {data.current.waterTemperature?.toFixed(1) || 'N/A'} °C
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Current Speed</span>
            <span className="font-semibold text-cyan-600">
              {data.current.currentSpeed?.toFixed(2) || 'N/A'} m/s
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-4">
            Last updated: {new Date(data.current.time).toLocaleTimeString()}
          </div>
        </div>
      ) : (
        <div className="text-red-500 text-sm">
          {error || 'No data available'}
        </div>
      )}
    </motion.div>
  );
}

function StatCard({ label, value, unit, icon }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className="text-2xl font-bold text-gray-800">
        {value} <span className="text-sm font-normal text-gray-600">{unit}</span>
      </div>
    </div>
  );
}

function ForecastTable({ forecast }) {
  return (
    <table className="w-full text-sm">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-3 text-left text-gray-700 font-semibold">Time</th>
          <th className="px-4 py-3 text-left text-gray-700 font-semibold">Wave (m)</th>
          <th className="px-4 py-3 text-left text-gray-700 font-semibold">Temp (°C)</th>
          <th className="px-4 py-3 text-left text-gray-700 font-semibold">Current (m/s)</th>
          <th className="px-4 py-3 text-left text-gray-700 font-semibold">Wind (m/s)</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {forecast.map((item, idx) => (
          <tr key={idx} className="hover:bg-gray-50">
            <td className="px-4 py-3 text-gray-800">{new Date(item.time).toLocaleString()}</td>
            <td className="px-4 py-3 text-gray-800">{item.waveHeight?.toFixed(2) || 'N/A'}</td>
            <td className="px-4 py-3 text-gray-800">{item.waterTemperature?.toFixed(1) || 'N/A'}</td>
            <td className="px-4 py-3 text-gray-800">{item.currentSpeed?.toFixed(2) || 'N/A'}</td>
            <td className="px-4 py-3 text-gray-800">{item.windSpeed?.toFixed(2) || 'N/A'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TideSchedule({ tides }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tides.map((tide, idx) => (
        <div
          key={idx}
          className={`p-4 rounded-lg ${
            tide.type === 'high' ? 'bg-blue-100' : 'bg-cyan-100'
          }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <span className="font-semibold text-gray-800">
                {tide.type === 'high' ? '⬆️ High Tide' : '⬇️ Low Tide'}
              </span>
              <p className="text-sm text-gray-600 mt-1">
                {new Date(tide.time).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-gray-800">
                {tide.height?.toFixed(2) || 'N/A'}
              </span>
              <p className="text-xs text-gray-600">meters</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
