import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  fetchOceanColorData,
  fetchChlorophyllData,
  fetchSSTData
} from '../../services/nasaOceanService';
import { MapContainer, TileLayer, Rectangle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function NASAOceanColorPage() {
  const [dataType, setDataType] = useState('SST'); // 'SST' or 'CHLOR_A'
  const [oceanData, setOceanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchData();

    if (autoRefresh) {
      const interval = setInterval(fetchData, 10 * 60 * 1000); // 10 minutes
      return () => clearInterval(interval);
    }
  }, [dataType, autoRefresh]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      let result;
      if (dataType === 'SST') {
        result = await fetchSSTData();
      } else {
        result = await fetchChlorophyllData();
      }

      if (result.success) {
        setOceanData(result);
        calculateStats(result.data);
      } else {
        setError(result.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    if (!data || data.length === 0) return;

    const values = data.map(d => d.value).filter(v => v != null);
    setStats({
      min: Math.min(...values),
      max: Math.max(...values),
      mean: values.reduce((a, b) => a + b, 0) / values.length,
      count: values.length
    });
  };

  const getColorForValue = (value, min, max) => {
    if (dataType === 'SST') {
      // Temperature color scale: blue (cold) to red (hot)
      const normalized = (value - min) / (max - min);
      const hue = (1 - normalized) * 240; // 240 = blue, 0 = red
      return `hsl(${hue}, 80%, 50%)`;
    } else {
      // Chlorophyll color scale: blue (low) to green (high)
      const normalized = (value - min) / (max - min);
      const hue = normalized * 120; // 0 = red, 120 = green
      return `hsl(${hue + 180}, 70%, 45%)`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-green-600 text-white py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-4 mb-4">
              <img
                src="https://www.nasa.gov/sites/all/themes/custom/nasatwo/images/nasa-logo.svg"
                alt="NASA"
                className="h-16 w-16 bg-white rounded-full p-2"
              />
              <div>
                <h1 className="text-4xl font-bold">NASA Ocean Color Data</h1>
                <p className="text-xl text-blue-100 mt-2">
                  Sea Surface Temperature & Chlorophyll-a Observations
                </p>
              </div>
            </div>
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Data Selection</h3>
              <div className="flex space-x-4">
                <button
                  onClick={() => setDataType('SST')}
                  className={`px-6 py-2 rounded-lg transition-all ${
                    dataType === 'SST'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Sea Surface Temperature
                </button>
                <button
                  onClick={() => setDataType('CHLOR_A')}
                  className={`px-6 py-2 rounded-lg transition-all ${
                    dataType === 'CHLOR_A'
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Chlorophyll-a
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Auto-refresh (10 min)</span>
              </label>

              <button
                onClick={fetchData}
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

        {/* Statistics Cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <StatCard
              label="Minimum"
              value={stats.min.toFixed(2)}
              unit={dataType === 'SST' ? '°C' : 'mg/m³'}
              color="blue"
            />
            <StatCard
              label="Maximum"
              value={stats.max.toFixed(2)}
              unit={dataType === 'SST' ? '°C' : 'mg/m³'}
              color="red"
            />
            <StatCard
              label="Average"
              value={stats.mean.toFixed(2)}
              unit={dataType === 'SST' ? '°C' : 'mg/m³'}
              color="green"
            />
            <StatCard
              label="Data Points"
              value={stats.count.toLocaleString()}
              unit="samples"
              color="purple"
            />
          </motion.div>
        )}

        {/* Data Info Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8"
        >
          <div className="flex items-start space-x-4">
            <div className="text-4xl">ℹ️</div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                {dataType === 'SST' ? 'Sea Surface Temperature' : 'Chlorophyll-a Concentration'}
              </h3>
              <p className="text-sm text-blue-800 mb-2">
                {oceanData?.source || 'NASA Ocean Color'}
              </p>
              <p className="text-sm text-gray-700">
                {dataType === 'SST'
                  ? 'Sea surface temperature affects marine ecosystems, weather patterns, and ocean circulation. Higher temperatures can indicate El Niño events or climate change impacts.'
                  : 'Chlorophyll-a is a key indicator of phytoplankton abundance. Higher concentrations indicate productive waters with more marine life, while lower levels suggest nutrient-poor conditions.'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Map Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {dataType === 'SST' ? 'Temperature' : 'Chlorophyll'} Distribution Map
          </h2>

          <div className="h-[600px] rounded-lg overflow-hidden relative">
            {loading ? (
              <div className="h-full flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading ocean data...</p>
                </div>
              </div>
            ) : oceanData?.data ? (
              <MapContainer
                center={[7.5, 80.5]}
                zoom={7}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* Render data grid */}
                {stats && oceanData.data.map((point, idx) => {
                  const color = getColorForValue(point.value, stats.min, stats.max);
                  const cellSize = 0.25; // degrees

                  return (
                    <Rectangle
                      key={idx}
                      bounds={[
                        [point.lat, point.lng],
                        [point.lat + cellSize, point.lng + cellSize]
                      ]}
                      pathOptions={{
                        color: color,
                        fillColor: color,
                        fillOpacity: 0.6,
                        weight: 0.5
                      }}
                    />
                  );
                })}

                {/* Color scale legend */}
                <ColorScaleLegend
                  dataType={dataType}
                  min={stats?.min}
                  max={stats?.max}
                  getColor={getColorForValue}
                />
              </MapContainer>
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-100">
                <p className="text-gray-600">No data available</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Data Grid View */}
        {oceanData?.data && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Data Grid</h2>
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-700 font-semibold">Latitude</th>
                    <th className="px-4 py-3 text-left text-gray-700 font-semibold">Longitude</th>
                    <th className="px-4 py-3 text-left text-gray-700 font-semibold">
                      {dataType === 'SST' ? 'Temperature (°C)' : 'Chlorophyll-a (mg/m³)'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {oceanData.data.slice(0, 50).map((point, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{point.lat}</td>
                      <td className="px-4 py-3">{point.lng}</td>
                      <td className="px-4 py-3 font-semibold">{point.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {oceanData.data.length > 50 && (
                <p className="text-center text-gray-500 text-sm py-4">
                  Showing 50 of {oceanData.data.length} data points
                </p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, unit, color }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    red: 'from-red-500 to-red-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`bg-gradient-to-br ${colorClasses[color]} rounded-lg p-6 text-white shadow-lg`}
    >
      <div className="text-sm opacity-90 mb-2">{label}</div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm opacity-75">{unit}</div>
    </motion.div>
  );
}

function ColorScaleLegend({ dataType, min, max, getColor }) {
  const MapControl = () => {
    const map = useMap();

    useEffect(() => {
      const legend = L.control({ position: 'bottomright' });

      legend.onAdd = () => {
        const div = L.DomUtil.create('div', 'info legend');
        div.style.background = 'white';
        div.style.padding = '10px';
        div.style.borderRadius = '8px';
        div.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';

        const steps = 10;
        const step = (max - min) / steps;

        let html = `<h4 style="margin: 0 0 8px 0; font-weight: bold;">${
          dataType === 'SST' ? 'Temperature (°C)' : 'Chlorophyll-a (mg/m³)'
        }</h4>`;

        for (let i = steps; i >= 0; i--) {
          const value = min + step * i;
          const color = getColor(value, min, max);
          html += `
            <div style="display: flex; align-items: center; margin: 2px 0;">
              <div style="width: 20px; height: 20px; background: ${color}; margin-right: 8px; border: 1px solid #999;"></div>
              <span style="font-size: 12px;">${value.toFixed(2)}</span>
            </div>
          `;
        }

        div.innerHTML = html;
        return div;
      };

      legend.addTo(map);

      return () => {
        legend.remove();
      };
    }, [dataType, min, max]);

    return null;
  };

  return <MapControl />;
}
