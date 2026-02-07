import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import {
  Waves,
  Loader,
  AlertCircle,
  Info,
  Clock,
  Navigation2
} from 'lucide-react';
import { fetchLiveWaves } from '../../../services/copernicusService';
import 'leaflet/dist/leaflet.css';

const WaveConditionsDisplay = ({ date, refreshTrigger }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [waveData, setWaveData] = useState(null);
  const [wavePoints, setWavePoints] = useState([]);
  const [stats, setStats] = useState({
    minHeight: null,
    maxHeight: null,
    meanHeight: null,
    meanPeriod: null
  });

  const sriLankaCenter = [7.5, 80.5];
  const sriLankaBounds = [
    [5.0, 79.0],
    [10.0, 82.0]
  ];

  useEffect(() => {
    loadWaveData();
  }, [date, refreshTrigger]);

  const loadWaveData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchLiveWaves({ date });

      if (response.success && response.data) {
        setWaveData(response.data);

        // Process data for visualization
        const points = processWaveData(response.data);
        setWavePoints(points);

        // Extract statistics
        const newStats = {
          minHeight: response.data.VHM0?.min?.toFixed(2),
          maxHeight: response.data.VHM0?.max?.toFixed(2),
          meanHeight: response.data.VHM0?.mean?.toFixed(2),
          meanPeriod: response.data.VTPK?.mean?.toFixed(1)
        };
        setStats(newStats);
      } else {
        setError('No wave data available for the selected date');
      }
    } catch (err) {
      console.error('Error loading wave data:', err);
      setError(err.message || 'Failed to fetch wave data');
    } finally {
      setLoading(false);
    }
  };

  const processWaveData = (data) => {
    if (!data.coordinates || !data.VHM0) {
      return [];
    }

    const { latitude, longitude } = data.coordinates;
    const waveHeightValues = data.VHM0.values;
    const waveDirectionValues = data.VMDR?.values;
    const wavePeriodValues = data.VTPK?.values;

    const points = [];
    const shape = data.VHM0.shape;

    // Sample rate to reduce number of markers
    const sampleRate = 2;

    if (shape.length === 3) {
      // 3D array: [time, lat, lon]
      const [timeSteps, latPoints, lonPoints] = shape;

      for (let i = 0; i < latPoints; i += sampleRate) {
        for (let j = 0; j < lonPoints; j += sampleRate) {
          const height = waveHeightValues[0]?.[i]?.[j];
          const direction = waveDirectionValues?.[0]?.[i]?.[j];
          const period = wavePeriodValues?.[0]?.[i]?.[j];

          if (height !== null && height !== undefined && !isNaN(height)) {
            points.push({
              lat: latitude[i],
              lon: longitude[j],
              height,
              direction,
              period,
              color: getWaveHeightColor(height),
              radius: getMarkerRadius(height, data.VHM0.min, data.VHM0.max)
            });
          }
        }
      }
    } else if (shape.length === 2) {
      // 2D array: [lat, lon]
      const [latPoints, lonPoints] = shape;

      for (let i = 0; i < latPoints; i += sampleRate) {
        for (let j = 0; j < lonPoints; j += sampleRate) {
          const height = waveHeightValues[i]?.[j];
          const direction = waveDirectionValues?.[i]?.[j];
          const period = wavePeriodValues?.[i]?.[j];

          if (height !== null && height !== undefined && !isNaN(height)) {
            points.push({
              lat: latitude[i],
              lon: longitude[j],
              height,
              direction,
              period,
              color: getWaveHeightColor(height),
              radius: getMarkerRadius(height, data.VHM0.min, data.VHM0.max)
            });
          }
        }
      }
    }

    return points;
  };

  const getWaveHeightColor = (height) => {
    if (height < 1.0) return '#22c55e'; // green - calm
    if (height < 2.0) return '#eab308'; // yellow - moderate
    if (height < 3.0) return '#f97316'; // orange - rough
    if (height < 4.0) return '#ef4444'; // red - very rough
    return '#991b1b'; // dark red - high
  };

  const getMarkerRadius = (height, min, max) => {
    const normalized = (height - min) / (max - min);
    return 5 + (normalized * 15); // 5-20 pixels
  };

  const getWaveCondition = (height) => {
    if (height < 1.0) return 'Calm';
    if (height < 2.0) return 'Moderate';
    if (height < 3.0) return 'Rough';
    if (height < 4.0) return 'Very Rough';
    return 'High';
  };

  const getDirectionLabel = (degrees) => {
    if (degrees === null || degrees === undefined) return 'N/A';
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-lg p-12 text-center"
      >
        <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 font-semibold">Loading wave conditions data...</p>
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
          onClick={loadWaveData}
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <Waves className="w-8 h-8" />
          </div>
          <p className="text-sm font-semibold mb-1">Min Wave Height</p>
          <p className="text-3xl font-bold">{stats.minHeight || '--'} m</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-red-500 to-rose-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <Waves className="w-8 h-8" />
          </div>
          <p className="text-sm font-semibold mb-1">Max Wave Height</p>
          <p className="text-3xl font-bold">{stats.maxHeight || '--'} m</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <Waves className="w-8 h-8" />
          </div>
          <p className="text-sm font-semibold mb-1">Avg Wave Height</p>
          <p className="text-3xl font-bold">{stats.meanHeight || '--'} m</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8" />
          </div>
          <p className="text-sm font-semibold mb-1">Avg Wave Period</p>
          <p className="text-3xl font-bold">{stats.meanPeriod || '--'} s</p>
        </motion.div>
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 px-6 py-4">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Waves className="w-6 h-6 mr-2" />
            Wave Conditions Map
          </h3>
          <p className="text-sm text-white/90 mt-1">
            {date} • {wavePoints.length} data points • Updated every 3 hours
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

            {/* Render wave condition markers */}
            {wavePoints.map((point, index) => (
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
                    <p className="font-semibold text-lg mb-2">Wave Conditions</p>
                    <div className="space-y-1">
                      <p><strong>Height:</strong> {point.height.toFixed(2)} m</p>
                      <p><strong>Condition:</strong> {getWaveCondition(point.height)}</p>
                      {point.direction !== null && point.direction !== undefined && (
                        <p><strong>Direction:</strong> {point.direction.toFixed(0)}° ({getDirectionLabel(point.direction)})</p>
                      )}
                      {point.period !== null && point.period !== undefined && (
                        <p><strong>Period:</strong> {point.period.toFixed(1)} s</p>
                      )}
                      <p className="text-xs text-gray-500 pt-1">
                        {point.lat.toFixed(3)}°N, {point.lon.toFixed(3)}°E
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
              <p className="text-sm font-semibold text-gray-700 mb-3">Wave Height Categories</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-600">Calm (&lt;1.0m)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-yellow-500"></div>
                  <span className="text-xs text-gray-600">Moderate (1-2m)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-orange-500"></div>
                  <span className="text-xs text-gray-600">Rough (2-3m)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-red-500"></div>
                  <span className="text-xs text-gray-600">Very Rough (3-4m)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-red-900"></div>
                  <span className="text-xs text-gray-600">High (&gt;4m)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <div className="flex items-center space-x-4 text-xs text-gray-600">
                <div className="flex items-center">
                  <Navigation2 className="w-4 h-4 mr-1" />
                  <span>Marker size = wave height</span>
                </div>
                <div className="flex items-center">
                  <Waves className="w-4 h-4 mr-1" />
                  <span>Color = wave condition</span>
                </div>
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
              Wave condition data from Copernicus Marine Service (CMEMS) Global Ocean Waves Analysis and Forecast.
              <strong> VHM0:</strong> Significant wave height (m),
              <strong> VMDR:</strong> Wave direction (degrees from north),
              <strong> VTPK:</strong> Wave peak period (seconds).
              Spatial resolution: ~9km (0.083°).
              Updated every 3 hours with 10-day forecast.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WaveConditionsDisplay;
