import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Thermometer,
  Wind,
  Waves,
  Droplets,
  Calendar,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Database,
  Map,
  TrendingUp
} from 'lucide-react';
import TemperatureHeatmap from './components/TemperatureHeatmap';
import OceanCurrentsVector from './components/OceanCurrentsVector';
import WaveConditionsDisplay from './components/WaveConditionsDisplay';
import SalinityDisplay from './components/SalinityDisplay';
import { checkBackendHealth, formatDate } from '../../services/copernicusService';

const LiveOceanDataView = () => {
  const [activeTab, setActiveTab] = useState('temperature');
  const [selectedDate, setSelectedDate] = useState(formatDate());
  const [depth, setDepth] = useState(0);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Check backend health on mount
  useEffect(() => {
    checkHealth();
  }, []);

  // Auto-refresh every 5 minutes if enabled
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastUpdated(new Date());
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const checkHealth = async () => {
    try {
      setBackendStatus('checking');
      await checkBackendHealth();
      setBackendStatus('healthy');
    } catch (error) {
      console.error('Backend health check failed:', error);
      setBackendStatus('error');
    }
  };

  const handleRefresh = () => {
    setLastUpdated(new Date());
  };

  const tabs = [
    {
      id: 'temperature',
      label: 'Temperature',
      icon: Thermometer,
      color: 'from-orange-500 to-red-500',
      description: 'Sea surface temperature heatmap'
    },
    {
      id: 'currents',
      label: 'Ocean Currents',
      icon: Wind,
      color: 'from-blue-500 to-cyan-500',
      description: 'Current velocity and direction'
    },
    {
      id: 'waves',
      label: 'Wave Conditions',
      icon: Waves,
      color: 'from-indigo-500 to-blue-500',
      description: 'Wave height, direction, and period'
    },
    {
      id: 'salinity',
      label: 'Salinity',
      icon: Droplets,
      color: 'from-teal-500 to-emerald-500',
      description: 'Sea water salinity (PSU)'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white py-12 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-4">
              <Database className="w-12 h-12 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Live Ocean Data
              </h1>
            </div>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Real-time ocean data from Copernicus Marine Service for Sri Lanka's maritime zones
            </p>

            {/* Backend Status Indicator */}
            <div className="mt-6 flex items-center justify-center gap-3">
              {backendStatus === 'healthy' && (
                <>
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span className="text-green-200 text-sm">Backend Connected</span>
                </>
              )}
              {backendStatus === 'checking' && (
                <>
                  <RefreshCw className="w-5 h-5 text-yellow-300 animate-spin" />
                  <span className="text-yellow-200 text-sm">Connecting to backend...</span>
                </>
              )}
              {backendStatus === 'error' && (
                <>
                  <AlertCircle className="w-5 h-5 text-red-300" />
                  <span className="text-red-200 text-sm">Backend Offline</span>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Date Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={formatDate()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              />
            </div>

            {/* Depth Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Depth (meters)
              </label>
              <select
                value={depth}
                onChange={(e) => setDepth(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              >
                <option value={0} className="text-gray-900">Surface (0m)</option>
                <option value={10} className="text-gray-900">10 meters</option>
                <option value={20} className="text-gray-900">20 meters</option>
                <option value={50} className="text-gray-900">50 meters</option>
                <option value={100} className="text-gray-900">100 meters</option>
              </select>
            </div>

            {/* Auto Refresh Toggle */}
            <div className="flex flex-col justify-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-3 text-sm font-semibold text-gray-700">
                  Auto-refresh (5 min)
                </span>
              </label>
              {lastUpdated && (
                <p className="text-xs text-gray-500 mt-1 ml-8">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>

            {/* Manual Refresh Button */}
            <div className="flex items-end">
              <button
                onClick={handleRefresh}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Data
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-2 mb-6"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative p-4 rounded-lg transition-all duration-300
                  ${activeTab === tab.id
                    ? 'bg-gradient-to-r ' + tab.color + ' text-white shadow-lg scale-105'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }
                `}
              >
                <div className="flex flex-col items-center space-y-2">
                  <tab.icon className="w-6 h-6" />
                  <span className="text-sm font-semibold">{tab.label}</span>
                </div>

                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-lg border-2 border-white"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Description */}
          <div className="mt-4 px-4 py-2 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 text-center">
              {tabs.find(t => t.id === activeTab)?.description}
            </p>
          </div>
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {backendStatus === 'healthy' ? (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'temperature' && (
                <TemperatureHeatmap
                  date={selectedDate}
                  depth={depth}
                  refreshTrigger={lastUpdated}
                />
              )}

              {activeTab === 'currents' && (
                <OceanCurrentsVector
                  date={selectedDate}
                  depth={depth}
                  refreshTrigger={lastUpdated}
                />
              )}

              {activeTab === 'waves' && (
                <WaveConditionsDisplay
                  date={selectedDate}
                  refreshTrigger={lastUpdated}
                />
              )}

              {activeTab === 'salinity' && (
                <SalinityDisplay
                  date={selectedDate}
                  depth={depth}
                  refreshTrigger={lastUpdated}
                />
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-lg p-12 text-center"
            >
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Backend Connection Error
              </h3>
              <p className="text-gray-600 mb-4">
                Unable to connect to the Copernicus Marine API backend.
              </p>
              <button
                onClick={checkHealth}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Retry Connection
              </button>
              <div className="mt-6 text-sm text-gray-500">
                <p>Make sure the backend server is running at:</p>
                <code className="bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
                  http://localhost:5000
                </code>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Map className="w-8 h-8 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Coverage Area</h4>
              <p className="text-sm text-blue-100">Sri Lanka EEZ (5°N-10°N, 79°E-82°E)</p>
            </div>
            <div className="text-center">
              <Database className="w-8 h-8 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Data Source</h4>
              <p className="text-sm text-blue-100">Copernicus Marine Service (CMEMS)</p>
            </div>
            <div className="text-center">
              <RefreshCw className="w-8 h-8 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Update Frequency</h4>
              <p className="text-sm text-blue-100">Daily (Temperature, Currents, Salinity) / 3-hourly (Waves)</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LiveOceanDataView;
