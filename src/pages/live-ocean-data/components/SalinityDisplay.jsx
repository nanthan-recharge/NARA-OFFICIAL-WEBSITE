import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import {
  Droplets,
  Loader,
  AlertCircle,
  Info,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { fetchLiveSalinity } from '../../../services/copernicusService';
import 'leaflet/dist/leaflet.css';

const SalinityDisplay = ({ date, depth, refreshTrigger }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [salinityData, setSalinityData] = useState(null);
  const [salinityPoints, setSalinityPoints] = useState([]);
  const [stats, setStats] = useState({ min: null, max: null, mean: null });

  const sriLankaCenter = [7.5, 80.5];
  const sriLankaBounds = [
    [5.0, 79.0],
    [10.0, 82.0]
  ];

  useEffect(() => {
    loadSalinityData();
  }, [date, depth, refreshTrigger]);

  const loadSalinityData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchLiveSalinity({ date, depth });

      if (response.success && response.data) {
        setSalinityData(response.data);

        // Process data for visualization
        const points = processSalinityData(response.data);
        setSalinityPoints(points);

        // Extract statistics
        if (response.data.so) {
          setStats({
            min: response.data.so.min?.toFixed(2),
            max: response.data.so.max?.toFixed(2),
            mean: response.data.so.mean?.toFixed(2)
          });
        }
      } else {
        setError('No salinity data available for the selected date and depth');
      }
    } catch (err) {
      console.error('Error loading salinity data:', err);
      setError(err.message || 'Failed to fetch salinity data');
    } finally {
      setLoading(false);
    }
  };

  const processSalinityData = (data) => {
    if (!data.coordinates || !data.so) {
      return [];
    }

    const { latitude, longitude } = data.coordinates;
    const salinityValues = data.so.values;

    const points = [];
    const shape = data.so.shape;

    // Sample rate to reduce number of markers
    const sampleRate = 2;

    if (shape.length === 3) {
      // 3D array: [time, lat, lon]
      const [timeSteps, latPoints, lonPoints] = shape;

      for (let i = 0; i < latPoints; i += sampleRate) {
        for (let j = 0; j < lonPoints; j += sampleRate) {
          const salinity = salinityValues[0]?.[i]?.[j];

          if (salinity !== null && salinity !== undefined && !isNaN(salinity)) {
            points.push({
              lat: latitude[i],
              lon: longitude[j],
              salinity,
              color: getSalinityColor(salinity),
              radius: getMarkerRadius(salinity, data.so.min, data.so.max)
            });
          }
        }
      }
    } else if (shape.length === 2) {
      // 2D array: [lat, lon]
      const [latPoints, lonPoints] = shape;

      for (let i = 0; i < latPoints; i += sampleRate) {
        for (let j = 0; j < lonPoints; j += sampleRate) {
          const salinity = salinityValues[i]?.[j];

          if (salinity !== null && salinity !== undefined && !isNaN(salinity)) {
            points.push({
              lat: latitude[i],
              lon: longitude[j],
              salinity,
              color: getSalinityColor(salinity),
              radius: getMarkerRadius(salinity, data.so.min, data.so.max)
            });
          }
        }
      }
    }

    return points;
  };

  const getSalinityColor = (salinity) => {
    // Typical ocean salinity range: 33-37 PSU
    // Lower salinity (freshwater influence) = lighter blue
    // Higher salinity (evaporation/high salt) = darker blue
    if (salinity < 33) return '#7dd3fc'; // light blue
    if (salinity < 34) return '#38bdf8'; // sky blue
    if (salinity < 35) return '#0ea5e9'; // blue
    if (salinity < 36) return '#0284c7'; // dark blue
    return '#0c4a6e'; // very dark blue
  };

  const getMarkerRadius = (salinity, min, max) => {
    const normalized = (salinity - min) / (max - min);
    return 5 + (normalized * 10); // 5-15 pixels
  };

  const getSalinityCategory = (salinity) => {
    if (salinity < 30) return 'Brackish';
    if (salinity < 33) return 'Low Salinity';
    if (salinity < 35) return 'Normal';
    if (salinity < 37) return 'High Salinity';
    return 'Very High';
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-lg p-12 text-center"
      >
        <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 font-semibold">Loading salinity data...</p>
        <p className="text-sm text-gray-500 mt-2">Fetching from Copernicus Marine Service</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-lg p-12 text-center"
      >
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Data</h3>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={loadSalinityData}
          className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Retry
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <Droplets className="w-8 h-8" />
            <TrendingDown className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold mb-1">Minimum Salinity</p>
          <p className="text-3xl font-bold">{stats.min || '--'} PSU</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <Droplets className="w-8 h-8" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold mb-1">Maximum Salinity</p>
          <p className="text-3xl font-bold">{stats.max || '--'} PSU</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <Droplets className="w-8 h-8" />
            <Info className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold mb-1">Average Salinity</p>
          <p className="text-3xl font-bold">{stats.mean || '--'} PSU</p>
        </motion.div>
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-teal-500 to-blue-600 px-6 py-4">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Droplets className="w-6 h-6 mr-2" />
            Sea Water Salinity Map
          </h3>
          <p className="text-sm text-white/90 mt-1">
            {date} • Depth: {depth}m • {salinityPoints.length} data points
          </p>
        </div>

        <div className="h-[600px] relative">
          <MapContainer
            center={sriLankaCenter}
            zoom={7}
            bounds={sriLankaBounds}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Render salinity markers */}
            {salinityPoints.map((point, index) => (
              <CircleMarker
                key={index}
                center={[point.lat, point.lon]}
                radius={point.radius}
                fillColor={point.color}
                color={point.color}
                weight={1}
                opacity={0.8}
                fillOpacity={0.6}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-semibold text-lg mb-2">Sea Water Salinity</p>
                    <div className="space-y-1">
                      <p><strong>Salinity:</strong> {point.salinity.toFixed(2)} PSU</p>
                      <p><strong>Category:</strong> {getSalinityCategory(point.salinity)}</p>
                      <p className="text-xs text-gray-500 pt-1">
                        {point.lat.toFixed(3)}°N, {point.lon.toFixed(3)}°E
                      </p>
                      <p className="text-xs text-gray-500">
                        Depth: {depth}m
                      </p>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        {/* Legend */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Salinity Categories (PSU)</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#7dd3fc' }}></div>
                  <span className="text-xs text-gray-600">Brackish (&lt;30)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#38bdf8' }}></div>
                  <span className="text-xs text-gray-600">Low (30-33)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#0ea5e9' }}></div>
                  <span className="text-xs text-gray-600">Normal (33-35)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#0284c7' }}></div>
                  <span className="text-xs text-gray-600">High (35-37)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#0c4a6e' }}></div>
                  <span className="text-xs text-gray-600">Very High (&gt;37)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <div className="text-xs text-gray-600">
                <p className="font-semibold mb-1">PSU = Practical Salinity Units</p>
                <p>Typical ocean salinity: 33-37 PSU • Freshwater: &lt;0.5 PSU</p>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Info className="w-4 h-4" />
                <span>Data: Copernicus Marine Service</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">About This Data</p>
            <p>
              Sea water salinity data from Copernicus Marine Service (CMEMS)
              Global Ocean Physics Analysis and Forecast.
              Salinity measured in PSU (Practical Salinity Units).
              Lower salinity near river mouths and coasts (freshwater influence).
              Higher salinity in open ocean (evaporation exceeds precipitation).
              Spatial resolution: ~9km (0.083°).
              Updated daily with 10-day forecast.
            </p>
          </div>
        </div>
      </div>

      {/* Educational Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <Droplets className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-cyan-800">
              <p className="font-semibold mb-1">Low Salinity Factors</p>
              <ul className="list-disc list-inside space-y-1">
                <li>River discharge (freshwater input)</li>
                <li>Heavy rainfall</li>
                <li>Ice melting</li>
                <li>Coastal proximity</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <Droplets className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-indigo-800">
              <p className="font-semibold mb-1">High Salinity Factors</p>
              <ul className="list-disc list-inside space-y-1">
                <li>High evaporation rates</li>
                <li>Low precipitation</li>
                <li>Strong sun exposure</li>
                <li>Deep ocean waters</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SalinityDisplay;
