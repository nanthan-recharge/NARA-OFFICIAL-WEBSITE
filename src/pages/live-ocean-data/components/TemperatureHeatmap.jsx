import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { HeatmapLayer } from 'react-leaflet-heatmap-layer-v3';
import {
  Thermometer,
  Loader,
  AlertCircle,
  Info,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { fetchLiveTemperature } from '../../../services/copernicusService';
import 'leaflet/dist/leaflet.css';

const TemperatureHeatmap = ({ date, depth, refreshTrigger }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [temperatureData, setTemperatureData] = useState(null);
  const [heatmapPoints, setHeatmapPoints] = useState([]);
  const [stats, setStats] = useState({ min: null, max: null, mean: null });

  // Sri Lanka center coordinates
  const sriLankaCenter = [7.5, 80.5];
  const sriLankaBounds = [
    [5.0, 79.0],  // Southwest corner
    [10.0, 82.0]  // Northeast corner
  ];

  useEffect(() => {
    loadTemperatureData();
  }, [date, depth, refreshTrigger]);

  const loadTemperatureData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchLiveTemperature({ date, depth });

      if (response.success && response.data) {
        setTemperatureData(response.data);

        // Process data for heatmap
        const points = processHeatmapData(response.data);
        setHeatmapPoints(points);

        // Extract statistics
        if (response.data.thetao) {
          setStats({
            min: response.data.thetao.min?.toFixed(2),
            max: response.data.thetao.max?.toFixed(2),
            mean: response.data.thetao.mean?.toFixed(2)
          });
        }
      } else {
        setError('No temperature data available for the selected date and depth');
      }
    } catch (err) {
      console.error('Error loading temperature data:', err);
      setError(err.message || 'Failed to fetch temperature data');
    } finally {
      setLoading(false);
    }
  };

  const processHeatmapData = (data) => {
    if (!data.coordinates || !data.thetao) {
      return [];
    }

    const { latitude, longitude } = data.coordinates;
    const temperatureValues = data.thetao.values;

    const points = [];

    // Assuming 3D array: [time, lat, lon]
    const shape = data.thetao.shape;

    if (shape.length === 3) {
      const [timeSteps, latPoints, lonPoints] = shape;
      const latValues = latitude;
      const lonValues = longitude;

      // Use most recent time step (index 0)
      for (let i = 0; i < latPoints; i++) {
        for (let j = 0; j < lonPoints; j++) {
          const temp = temperatureValues[0]?.[i]?.[j];
          if (temp !== null && temp !== undefined && !isNaN(temp)) {
            points.push({
              lat: latValues[i],
              lng: lonValues[j],
              intensity: normalizeIntensity(temp, data.thetao.min, data.thetao.max)
            });
          }
        }
      }
    } else if (shape.length === 2) {
      // 2D array: [lat, lon]
      const [latPoints, lonPoints] = shape;
      const latValues = latitude;
      const lonValues = longitude;

      for (let i = 0; i < latPoints; i++) {
        for (let j = 0; j < lonPoints; j++) {
          const temp = temperatureValues[i]?.[j];
          if (temp !== null && temp !== undefined && !isNaN(temp)) {
            points.push({
              lat: latValues[i],
              lng: lonValues[j],
              intensity: normalizeIntensity(temp, data.thetao.min, data.thetao.max)
            });
          }
        }
      }
    }

    return points;
  };

  const normalizeIntensity = (value, min, max) => {
    if (min === max) return 0.5;
    return (value - min) / (max - min);
  };

  const getTemperatureColor = (temp) => {
    if (temp < 24) return 'text-blue-600';
    if (temp < 26) return 'text-cyan-600';
    if (temp < 28) return 'text-yellow-600';
    if (temp < 30) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-lg p-12 text-center"
      >
        <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 font-semibold">Loading temperature data...</p>
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
          onClick={loadTemperatureData}
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
          className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <Thermometer className="w-8 h-8" />
            <TrendingDown className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold mb-1">Minimum Temperature</p>
          <p className="text-3xl font-bold">{stats.min || '--'}°C</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <Thermometer className="w-8 h-8" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold mb-1">Maximum Temperature</p>
          <p className="text-3xl font-bold">{stats.max || '--'}°C</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <Thermometer className="w-8 h-8" />
            <Info className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold mb-1">Average Temperature</p>
          <p className="text-3xl font-bold">{stats.mean || '--'}°C</p>
        </motion.div>
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Thermometer className="w-6 h-6 mr-2" />
            Sea Surface Temperature Heatmap
          </h3>
          <p className="text-sm text-white/90 mt-1">
            {date} • Depth: {depth}m • {heatmapPoints.length} data points
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
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {heatmapPoints.length > 0 && (
              <HeatmapLayer
                points={heatmapPoints}
                longitudeExtractor={(point) => point.lng}
                latitudeExtractor={(point) => point.lat}
                intensityExtractor={(point) => point.intensity}
                radius={25}
                blur={15}
                max={1.0}
                gradient={{
                  0.0: 'blue',
                  0.2: 'cyan',
                  0.4: 'lime',
                  0.6: 'yellow',
                  0.8: 'orange',
                  1.0: 'red'
                }}
              />
            )}
          </MapContainer>
        </div>

        {/* Legend */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-700 mb-2">Temperature Scale (°C)</p>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-600">{stats.min}</span>
                <div className="flex-1 h-6 rounded-lg bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500"></div>
                <span className="text-xs text-gray-600">{stats.max}</span>
              </div>
            </div>

            <div className="ml-8 flex items-center space-x-2 text-sm text-gray-600">
              <Info className="w-4 h-4" />
              <span>Data: Copernicus Marine Service</span>
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
              Sea surface temperature data from Copernicus Marine Service (CMEMS)
              Global Ocean Physics Analysis and Forecast.
              Spatial resolution: ~9km (0.083°).
              Updated daily with 10-day forecast.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TemperatureHeatmap;
