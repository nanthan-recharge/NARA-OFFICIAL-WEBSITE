import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import {
  Wind,
  Loader,
  AlertCircle,
  Info,
  Navigation,
  Gauge
} from 'lucide-react';
import { fetchLiveCurrents } from '../../../services/copernicusService';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const OceanCurrentsVector = ({ date, depth, refreshTrigger }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentsData, setCurrentsData] = useState(null);
  const [vectorPoints, setVectorPoints] = useState([]);
  const [stats, setStats] = useState({ minSpeed: null, maxSpeed: null, meanSpeed: null });

  const sriLankaCenter = [7.5, 80.5];
  const sriLankaBounds = [
    [5.0, 79.0],
    [10.0, 82.0]
  ];

  useEffect(() => {
    loadCurrentsData();
  }, [date, depth, refreshTrigger]);

  const loadCurrentsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchLiveCurrents({ date, depth });

      if (response.success && response.data) {
        setCurrentsData(response.data);

        // Process data for vector visualization
        const vectors = processVectorData(response.data);
        setVectorPoints(vectors);

        // Extract statistics
        if (response.data.speed) {
          setStats({
            minSpeed: response.data.speed.min?.toFixed(3),
            maxSpeed: response.data.speed.max?.toFixed(3),
            meanSpeed: response.data.speed.mean?.toFixed(3)
          });
        }
      } else {
        setError('No currents data available for the selected date and depth');
      }
    } catch (err) {
      console.error('Error loading currents data:', err);
      setError(err.message || 'Failed to fetch currents data');
    } finally {
      setLoading(false);
    }
  };

  const processVectorData = (data) => {
    if (!data.coordinates || !data.speed || !data.direction) {
      return [];
    }

    const { latitude, longitude } = data.coordinates;
    const speedValues = data.speed.values;
    const directionValues = data.direction.values;

    const vectors = [];

    // Determine shape from the actual data structure
    // API returns 4D array: [1][depth][lat][lon]
    const shape = speedValues && Array.isArray(speedValues)
      ? [speedValues.length, speedValues[0]?.length || 0, speedValues[0]?.[0]?.length || 0, speedValues[0]?.[0]?.[0]?.length || 0]
      : [];

    // Sample every Nth point to avoid overcrowding (adjust sampling rate)
    const sampleRate = 3;

    if (shape.length === 4) {
      // 4D array: [time, depth, lat, lon]
      const [timeSteps, depthSteps, latPoints, lonPoints] = shape;

      for (let i = 0; i < latPoints; i += sampleRate) {
        for (let j = 0; j < lonPoints; j += sampleRate) {
          const speed = speedValues[0]?.[0]?.[i]?.[j];
          const direction = directionValues[0]?.[0]?.[i]?.[j];

          if (speed !== null && speed !== undefined && !isNaN(speed) &&
              direction !== null && direction !== undefined && !isNaN(direction)) {
            const lat = latitude[i];
            const lon = longitude[j];

            // Calculate vector end point
            const vectorLength = speed * 0.5; // Scale factor for visualization
            const { endLat, endLon } = calculateVectorEndPoint(lat, lon, direction, vectorLength);

            vectors.push({
              startLat: lat,
              startLon: lon,
              endLat,
              endLon,
              speed,
              direction,
              color: getSpeedColor(speed, data.speed.min, data.speed.max)
            });
          }
        }
      }
    } else if (shape.length === 3) {
      // 3D array: [time, lat, lon]
      const [, latPoints, lonPoints] = shape;

      for (let i = 0; i < latPoints; i += sampleRate) {
        for (let j = 0; j < lonPoints; j += sampleRate) {
          const speed = speedValues[0]?.[i]?.[j];
          const direction = directionValues[0]?.[i]?.[j];

          if (speed !== null && speed !== undefined && !isNaN(speed) &&
              direction !== null && direction !== undefined && !isNaN(direction)) {
            const lat = latitude[i];
            const lon = longitude[j];

            const vectorLength = speed * 0.5;
            const { endLat, endLon } = calculateVectorEndPoint(lat, lon, direction, vectorLength);

            vectors.push({
              startLat: lat,
              startLon: lon,
              endLat,
              endLon,
              speed,
              direction,
              color: getSpeedColor(speed, data.speed.min, data.speed.max)
            });
          }
        }
      }
    } else if (shape.length === 2) {
      // 2D array: [lat, lon]
      const [latPoints, lonPoints] = shape;

      for (let i = 0; i < latPoints; i += sampleRate) {
        for (let j = 0; j < lonPoints; j += sampleRate) {
          const speed = speedValues[i]?.[j];
          const direction = directionValues[i]?.[j];

          if (speed !== null && speed !== undefined && !isNaN(speed) &&
              direction !== null && direction !== undefined && !isNaN(direction)) {
            const lat = latitude[i];
            const lon = longitude[j];

            const vectorLength = speed * 0.5;
            const { endLat, endLon } = calculateVectorEndPoint(lat, lon, direction, vectorLength);

            vectors.push({
              startLat: lat,
              startLon: lon,
              endLat,
              endLon,
              speed,
              direction,
              color: getSpeedColor(speed, data.speed.min, data.speed.max)
            });
          }
        }
      }
    }

    return vectors;
  };

  const calculateVectorEndPoint = (lat, lon, direction, length) => {
    // Convert direction from degrees to radians
    const dirRad = (direction * Math.PI) / 180;

    // Calculate end point (simplified, not accounting for Earth's curvature)
    const endLat = lat + (length * Math.cos(dirRad));
    const endLon = lon + (length * Math.sin(dirRad));

    return { endLat, endLon };
  };

  const getSpeedColor = (speed, min, max) => {
    const normalized = (speed - min) / (max - min);

    if (normalized < 0.2) return '#3b82f6'; // blue
    if (normalized < 0.4) return '#22c55e'; // green
    if (normalized < 0.6) return '#eab308'; // yellow
    if (normalized < 0.8) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  const getDirectionLabel = (degrees) => {
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
        <p className="text-gray-600 font-semibold">Loading ocean currents data...</p>
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
          onClick={loadCurrentsData}
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
            <Wind className="w-8 h-8" />
            <Gauge className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold mb-1">Minimum Speed</p>
          <p className="text-3xl font-bold">{stats.minSpeed || '--'} m/s</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <Wind className="w-8 h-8" />
            <Gauge className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold mb-1">Maximum Speed</p>
          <p className="text-3xl font-bold">{stats.maxSpeed || '--'} m/s</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <Wind className="w-8 h-8" />
            <Gauge className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold mb-1">Average Speed</p>
          <p className="text-3xl font-bold">{stats.meanSpeed || '--'} m/s</p>
        </motion.div>
      </div>

      {/* Map Container with Vector Display */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 px-6 py-4">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Wind className="w-6 h-6 mr-2" />
            Ocean Currents Vector Field
          </h3>
          <p className="text-sm text-white/90 mt-1">
            {date} • Depth: {depth}m • {vectorPoints.length} vectors
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

            {/* Render current vectors as lines/arrows */}
            {vectorPoints.map((vector, index) => (
              <React.Fragment key={index}>
                <Polyline
                  positions={[
                    [vector.startLat, vector.startLon],
                    [vector.endLat, vector.endLon]
                  ]}
                  color={vector.color}
                  weight={2}
                  opacity={0.7}
                >
                  <Popup>
                    <div className="text-sm">
                      <p className="font-semibold">Ocean Current</p>
                      <p>Speed: {vector.speed.toFixed(3)} m/s</p>
                      <p>Direction: {vector.direction.toFixed(0)}° ({getDirectionLabel(vector.direction)})</p>
                      <p>Location: {vector.startLat.toFixed(3)}°N, {vector.startLon.toFixed(3)}°E</p>
                    </div>
                  </Popup>
                </Polyline>

                {/* Arrow head (simplified) */}
                <Marker
                  position={[vector.endLat, vector.endLon]}
                  icon={L.divIcon({
                    className: 'current-arrow',
                    html: `<div style="
                      width: 0;
                      height: 0;
                      border-left: 4px solid transparent;
                      border-right: 4px solid transparent;
                      border-bottom: 8px solid ${vector.color};
                      transform: rotate(${vector.direction}deg);
                    "></div>`,
                    iconSize: [8, 8],
                    iconAnchor: [4, 4]
                  })}
                />
              </React.Fragment>
            ))}
          </MapContainer>
        </div>

        {/* Legend */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-700 mb-2">Current Speed (m/s)</p>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-600">{stats.minSpeed}</span>
                <div className="flex-1 h-6 rounded-lg bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500"></div>
                <span className="text-xs text-gray-600">{stats.maxSpeed}</span>
              </div>
              <div className="mt-2 flex items-center space-x-4 text-xs text-gray-600">
                <div className="flex items-center">
                  <Navigation className="w-4 h-4 mr-1" />
                  <span>Arrow shows direction</span>
                </div>
                <div className="flex items-center">
                  <Gauge className="w-4 h-4 mr-1" />
                  <span>Color shows speed</span>
                </div>
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
              Ocean current velocity data from Copernicus Marine Service (CMEMS)
              Global Ocean Physics Analysis and Forecast.
              U (eastward) and V (northward) velocity components combined to show current speed and direction.
              Spatial resolution: ~9km (0.083°).
              Updated daily with 10-day forecast.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OceanCurrentsVector;
