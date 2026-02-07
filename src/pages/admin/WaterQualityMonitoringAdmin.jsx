/**
 * Real-Time Water Quality Monitoring Admin
 *
 * Admin panel for water quality monitoring system
 * Features:
 * - Sensor registration and management
 * - Real-time data visualization
 * - Alert threshold configuration
 * - Historical data analysis
 * - Trend identification
 * - Data export capabilities
 */

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Droplets,
  Activity,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  Bell,
  Settings,
  BarChart3,
  Database,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Thermometer,
  Zap,
  Wind,
  Waves
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import {
  sensorRegistryService,
  realTimeDataService,
  alertService,
  historicalDataService,
  analysisService,
  dashboardService,
  exportService
} from '../../services/waterQualityMonitoringService';

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const WaterQualityMonitoringAdmin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [sensors, setSensors] = useState([]);
  const [latestReadings, setLatestReadings] = useState([]);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [sensorReadings, setSensorReadings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms
  const [sensorForm, setSensorForm] = useState({
    sensorName: '',
    sensorType: 'multiparameter',
    location: { lat: 7.8731, lng: 80.7718 },
    deploymentDepth: '',
    manufacturer: '',
    model: ''
  });

  const [thresholdForm, setThresholdForm] = useState({
    sensorId: '',
    parameter: 'temperature',
    condition: 'above',
    value: '',
    minValue: '',
    maxValue: '',
    severity: 'medium'
  });

  const [readingForm, setReadingForm] = useState({
    sensorId: '',
    temperature: '',
    ph: '',
    dissolvedOxygen: '',
    salinity: '',
    turbidity: '',
    conductivity: ''
  });

  useEffect(() => {
    fetchAllData();
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAllData = async () => {
    setLoading(true);

    const [statsRes, sensorsRes, readingsRes, alertsRes] = await Promise.all([
      dashboardService.getStats(),
      sensorRegistryService.getAll(),
      realTimeDataService.getLatestReadings(),
      alertService.getActiveAlerts()
    ]);

    if (statsRes.data) setDashboardStats(statsRes.data);
    if (sensorsRes.data) setSensors(sensorsRes.data);
    if (readingsRes.data) setLatestReadings(readingsRes.data);
    if (alertsRes.data) setActiveAlerts(alertsRes.data);

    setLoading(false);
  };

  const fetchSensorReadings = async (sensorId) => {
    const { data } = await realTimeDataService.getReadingsBySensor(sensorId, 50);
    if (data) {
      // Convert timestamps and sort
      const formatted = data.map(r => ({
        ...r,
        time: r.timestamp?.toDate?.() || new Date(r.timestamp)
      })).sort((a, b) => a.time - b.time);
      setSensorReadings(formatted);
    }
  };

  // ========== HANDLERS ==========

  const handleRegisterSensor = async (e) => {
    e.preventDefault();

    const { data, error } = await sensorRegistryService.register(sensorForm);

    if (error) {
      alert('Error registering sensor: ' + error);
      return;
    }

    alert('Sensor registered successfully! Sensor ID: ' + data.sensorId);
    setSensorForm({
      sensorName: '',
      sensorType: 'multiparameter',
      location: { lat: 7.8731, lng: 80.7718 },
      deploymentDepth: '',
      manufacturer: '',
      model: ''
    });
    fetchAllData();
  };

  const handleSubmitReading = async (e) => {
    e.preventDefault();

    const readingData = {
      temperature: parseFloat(readingForm.temperature) || undefined,
      ph: parseFloat(readingForm.ph) || undefined,
      dissolvedOxygen: parseFloat(readingForm.dissolvedOxygen) || undefined,
      salinity: parseFloat(readingForm.salinity) || undefined,
      turbidity: parseFloat(readingForm.turbidity) || undefined,
      conductivity: parseFloat(readingForm.conductivity) || undefined
    };

    // Remove undefined values
    Object.keys(readingData).forEach(key =>
      readingData[key] === undefined && delete readingData[key]
    );

    const { data, error } = await realTimeDataService.submitReading(
      readingForm.sensorId,
      readingData
    );

    if (error) {
      alert('Error submitting reading: ' + error);
      return;
    }

    alert('Reading submitted successfully!');
    setReadingForm({
      sensorId: '',
      temperature: '',
      ph: '',
      dissolvedOxygen: '',
      salinity: '',
      turbidity: '',
      conductivity: ''
    });
    fetchAllData();
  };

  const handleCreateThreshold = async (e) => {
    e.preventDefault();

    const thresholdData = {
      ...thresholdForm,
      value: parseFloat(thresholdForm.value) || undefined,
      minValue: parseFloat(thresholdForm.minValue) || undefined,
      maxValue: parseFloat(thresholdForm.maxValue) || undefined
    };

    const { data, error } = await alertService.createThreshold(thresholdData);

    if (error) {
      alert('Error creating threshold: ' + error);
      return;
    }

    alert('Threshold created successfully! Threshold ID: ' + data.thresholdId);
    setThresholdForm({
      sensorId: '',
      parameter: 'temperature',
      condition: 'above',
      value: '',
      minValue: '',
      maxValue: '',
      severity: 'medium'
    });
  };

  const handleAcknowledgeAlert = async (alertId) => {
    const { error } = await alertService.acknowledgeAlert(alertId, 'Admin User');

    if (error) {
      alert('Error acknowledging alert: ' + error);
      return;
    }

    alert('Alert acknowledged successfully!');
    fetchAllData();
  };

  const handleUpdateSensorStatus = async (id, status) => {
    const { error } = await sensorRegistryService.updateStatus(id, status);

    if (error) {
      alert('Error updating sensor status: ' + error);
      return;
    }

    alert(`Sensor status updated to ${status}!`);
    fetchAllData();
  };

  const handleExportData = async (sensorId) => {
    const { data, error } = await exportService.exportCSV(sensorId, null, null);

    if (error) {
      alert('Error exporting data: ' + error);
      return;
    }

    const blob = new Blob([data.csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = data.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAnalyzeTrends = async (sensorId, parameter) => {
    const { data, error } = await analysisService.identifyTrends(sensorId, parameter);

    if (error) {
      alert('Error analyzing trends: ' + error);
      return;
    }

    alert(`Trend Analysis:\nTrend: ${data.trend}\nSlope: ${data.slope.toFixed(4)}\nSignificance: ${data.significance}`);
  };

  // ========== RENDER FUNCTIONS ==========

  const renderDashboard = () => {
    if (!dashboardStats) return null;

    return (
      <div className="p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <Activity className="w-8 h-8 text-blue-600" />
          Water Quality Monitoring Dashboard
        </h2>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <Droplets className="w-8 h-8" />
              <span className="text-3xl font-bold">{dashboardStats.totalSensors}</span>
            </div>
            <p className="text-blue-100">Total Sensors</p>
            <p className="text-sm text-blue-200 mt-2">{dashboardStats.activeSensors} active</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-8 h-8" />
              <span className="text-3xl font-bold">{dashboardStats.totalReadings.toLocaleString()}</span>
            </div>
            <p className="text-green-100">Total Readings</p>
            <p className="text-sm text-green-200 mt-2">All time</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle className="w-8 h-8" />
              <span className="text-3xl font-bold">{dashboardStats.activeAlerts}</span>
            </div>
            <p className="text-yellow-100">Active Alerts</p>
            <p className="text-sm text-yellow-200 mt-2">{dashboardStats.criticalAlerts} critical</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <Settings className="w-8 h-8" />
              <span className="text-3xl font-bold">{dashboardStats.maintenanceSensors}</span>
            </div>
            <p className="text-red-100">Maintenance</p>
            <p className="text-sm text-red-200 mt-2">{dashboardStats.offlineSensors} offline</p>
          </motion.div>
        </div>

        {/* Active Alerts */}
        {activeAlerts.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              Active Alerts
            </h3>

            <div className="space-y-3">
              {activeAlerts.slice(0, 10).map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    alert.severity === 'critical' ? 'bg-red-50 border-red-500' :
                    alert.severity === 'high' ? 'bg-orange-50 border-orange-500' :
                    'bg-yellow-50 border-yellow-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{alert.sensorName}</p>
                      <p className="text-sm text-gray-600">
                        {alert.parameter}: {alert.value} (threshold: {alert.thresholdValue})
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {alert.triggeredAt?.toDate?.().toLocaleString() || 'N/A'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAcknowledgeAlert(alert.alertId)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Acknowledge
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Real-Time Map */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-blue-600" />
            Sensor Locations & Latest Readings
          </h3>

          <div style={{ height: '500px' }}>
            <MapContainer center={[7.8731, 80.7718]} zoom={8} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />

              {sensors.map((sensor) => {
                if (!sensor.location) return null;

                const lat = sensor.location.latitude;
                const lng = sensor.location.longitude;

                const lastReading = latestReadings.find(r => r.sensorId === sensor.sensorId);

                return (
                  <Marker key={sensor.id} position={[lat, lng]}>
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-bold text-lg mb-2">{sensor.sensorName}</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>ID:</strong> {sensor.sensorId}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Status:</strong> <span className={`font-semibold ${
                            sensor.status === 'active' ? 'text-green-600' :
                            sensor.status === 'maintenance' ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>{sensor.status}</span>
                        </p>

                        {lastReading && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs font-semibold text-gray-700 mb-2">Latest Reading:</p>
                            {lastReading.temperature && (
                              <p className="text-xs text-gray-600">Temp: {lastReading.temperature}°C</p>
                            )}
                            {lastReading.ph && (
                              <p className="text-xs text-gray-600">pH: {lastReading.ph}</p>
                            )}
                            {lastReading.dissolvedOxygen && (
                              <p className="text-xs text-gray-600">DO: {lastReading.dissolvedOxygen} mg/L</p>
                            )}
                          </div>
                        )}

                        <button
                          onClick={() => {
                            setSelectedSensor(sensor);
                            setActiveTab('analysis');
                            fetchSensorReadings(sensor.sensorId);
                          }}
                          className="mt-3 w-full px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                        >
                          View Details
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </div>
      </div>
    );
  };

  const renderSensorManagement = () => {
    return (
      <div className="p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <Droplets className="w-8 h-8 text-blue-600" />
          Sensor Management
        </h2>

        {/* Register New Sensor */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Register New Sensor</h3>

          <form onSubmit={handleRegisterSensor} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sensor Name *</label>
              <input
                type="text"
                value={sensorForm.sensorName}
                onChange={(e) => setSensorForm({ ...sensorForm, sensorName: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Negombo Lagoon Sensor 1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sensor Type *</label>
              <select
                value={sensorForm.sensorType}
                onChange={(e) => setSensorForm({ ...sensorForm, sensorType: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="multiparameter">Multiparameter</option>
                <option value="temperature">Temperature Only</option>
                <option value="ph">pH Only</option>
                <option value="dissolved_oxygen">Dissolved Oxygen</option>
                <option value="conductivity">Conductivity</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Latitude *</label>
              <input
                type="number"
                step="0.000001"
                value={sensorForm.location.lat}
                onChange={(e) => setSensorForm({
                  ...sensorForm,
                  location: { ...sensorForm.location, lat: parseFloat(e.target.value) }
                })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Longitude *</label>
              <input
                type="number"
                step="0.000001"
                value={sensorForm.location.lng}
                onChange={(e) => setSensorForm({
                  ...sensorForm,
                  location: { ...sensorForm.location, lng: parseFloat(e.target.value) }
                })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deployment Depth (m)</label>
              <input
                type="number"
                value={sensorForm.deploymentDepth}
                onChange={(e) => setSensorForm({ ...sensorForm, deploymentDepth: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Manufacturer</label>
              <input
                type="text"
                value={sensorForm.manufacturer}
                onChange={(e) => setSensorForm({ ...sensorForm, manufacturer: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2">
              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <Droplets className="w-5 h-5" />
                Register Sensor
              </button>
            </div>
          </form>
        </div>

        {/* Sensors List */}
        <div className="grid grid-cols-1 gap-4">
          {sensors.map((sensor) => (
            <motion.div
              key={sensor.id}
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    sensor.status === 'active' ? 'bg-green-100' :
                    sensor.status === 'maintenance' ? 'bg-yellow-100' :
                    'bg-red-100'
                  }`}>
                    <Droplets className={`w-6 h-6 ${
                      sensor.status === 'active' ? 'text-green-600' :
                      sensor.status === 'maintenance' ? 'text-yellow-600' :
                      'text-red-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{sensor.sensorName}</h3>
                    <p className="text-sm text-gray-600">{sensor.sensorId}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateSensorStatus(sensor.id, 'maintenance')}
                    className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm"
                  >
                    Maintenance
                  </button>
                  <button
                    onClick={() => handleExportData(sensor.sensorId)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm flex items-center gap-1"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 font-medium">Type</p>
                  <p className="text-gray-900">{sensor.sensorType}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Status</p>
                  <p className={`font-semibold ${
                    sensor.status === 'active' ? 'text-green-600' :
                    sensor.status === 'maintenance' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>{sensor.status}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Total Readings</p>
                  <p className="text-gray-900">{(sensor.totalReadings || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Location</p>
                  <p className="text-gray-900 text-xs">
                    {sensor.location?.latitude?.toFixed(4)}, {sensor.location?.longitude?.toFixed(4)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderDataSubmission = () => {
    return (
      <div className="p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <Database className="w-8 h-8 text-blue-600" />
          Submit Sensor Reading
        </h2>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <form onSubmit={handleSubmitReading} className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Sensor *</label>
              <select
                value={readingForm.sensorId}
                onChange={(e) => setReadingForm({ ...readingForm, sensorId: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a sensor...</option>
                {sensors.filter(s => s.status === 'active').map(sensor => (
                  <option key={sensor.id} value={sensor.sensorId}>
                    {sensor.sensorName} ({sensor.sensorId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Thermometer className="w-4 h-4 inline mr-1" />
                Temperature (°C)
              </label>
              <input
                type="number"
                step="0.01"
                value={readingForm.temperature}
                onChange={(e) => setReadingForm({ ...readingForm, temperature: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="25.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">pH</label>
              <input
                type="number"
                step="0.01"
                value={readingForm.ph}
                onChange={(e) => setReadingForm({ ...readingForm, ph: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="7.8"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dissolved Oxygen (mg/L)</label>
              <input
                type="number"
                step="0.01"
                value={readingForm.dissolvedOxygen}
                onChange={(e) => setReadingForm({ ...readingForm, dissolvedOxygen: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="8.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Salinity (ppt)</label>
              <input
                type="number"
                step="0.01"
                value={readingForm.salinity}
                onChange={(e) => setReadingForm({ ...readingForm, salinity: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="35.0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Turbidity (NTU)</label>
              <input
                type="number"
                step="0.01"
                value={readingForm.turbidity}
                onChange={(e) => setReadingForm({ ...readingForm, turbidity: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="2.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Conductivity (μS/cm)</label>
              <input
                type="number"
                step="0.01"
                value={readingForm.conductivity}
                onChange={(e) => setReadingForm({ ...readingForm, conductivity: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="50000"
              />
            </div>

            <div className="col-span-2">
              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <Database className="w-5 h-5" />
                Submit Reading
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderAlertConfiguration = () => {
    return (
      <div className="p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <Bell className="w-8 h-8 text-yellow-600" />
          Alert Threshold Configuration
        </h2>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Create Alert Threshold</h3>

          <form onSubmit={handleCreateThreshold} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sensor (Optional)</label>
              <select
                value={thresholdForm.sensorId}
                onChange={(e) => setThresholdForm({ ...thresholdForm, sensorId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Sensors</option>
                {sensors.map(sensor => (
                  <option key={sensor.id} value={sensor.sensorId}>
                    {sensor.sensorName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Parameter *</label>
              <select
                value={thresholdForm.parameter}
                onChange={(e) => setThresholdForm({ ...thresholdForm, parameter: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="temperature">Temperature</option>
                <option value="ph">pH</option>
                <option value="dissolvedOxygen">Dissolved Oxygen</option>
                <option value="salinity">Salinity</option>
                <option value="turbidity">Turbidity</option>
                <option value="conductivity">Conductivity</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Condition *</label>
              <select
                value={thresholdForm.condition}
                onChange={(e) => setThresholdForm({ ...thresholdForm, condition: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="above">Above</option>
                <option value="below">Below</option>
                <option value="outside_range">Outside Range</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Severity *</label>
              <select
                value={thresholdForm.severity}
                onChange={(e) => setThresholdForm({ ...thresholdForm, severity: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            {thresholdForm.condition === 'outside_range' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Value *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={thresholdForm.minValue}
                    onChange={(e) => setThresholdForm({ ...thresholdForm, minValue: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Value *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={thresholdForm.maxValue}
                    onChange={(e) => setThresholdForm({ ...thresholdForm, maxValue: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            ) : (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Threshold Value *</label>
                <input
                  type="number"
                  step="0.01"
                  value={thresholdForm.value}
                  onChange={(e) => setThresholdForm({ ...thresholdForm, value: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div className="col-span-2">
              <button
                type="submit"
                className="w-full px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <Bell className="w-5 h-5" />
                Create Threshold
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderAnalysis = () => {
    if (!selectedSensor) {
      return (
        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Historical Data Analysis</h2>
          <p className="text-gray-600">Please select a sensor from the dashboard map to view analysis.</p>
        </div>
      );
    }

    return (
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            Analysis: {selectedSensor.sensorName}
          </h2>
          <button
            onClick={() => handleAnalyzeTrends(selectedSensor.sensorId, 'temperature')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Analyze Trends
          </button>
        </div>

        {/* Temperature Chart */}
        {sensorReadings.length > 0 && sensorReadings.some(r => r.temperature) && (
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Temperature Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sensorReadings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  tickFormatter={(time) => new Date(time).toLocaleTimeString()}
                />
                <YAxis label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  labelFormatter={(time) => new Date(time).toLocaleString()}
                />
                <Legend />
                <Line type="monotone" dataKey="temperature" stroke="#3b82f6" name="Temperature" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* pH Chart */}
        {sensorReadings.length > 0 && sensorReadings.some(r => r.ph) && (
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">pH Level Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sensorReadings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  tickFormatter={(time) => new Date(time).toLocaleTimeString()}
                />
                <YAxis label={{ value: 'pH', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  labelFormatter={(time) => new Date(time).toLocaleString()}
                />
                <Legend />
                <Line type="monotone" dataKey="ph" stroke="#10b981" name="pH" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Dissolved Oxygen Chart */}
        {sensorReadings.length > 0 && sensorReadings.some(r => r.dissolvedOxygen) && (
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Dissolved Oxygen Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={sensorReadings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  tickFormatter={(time) => new Date(time).toLocaleTimeString()}
                />
                <YAxis label={{ value: 'DO (mg/L)', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  labelFormatter={(time) => new Date(time).toLocaleString()}
                />
                <Legend />
                <Area type="monotone" dataKey="dissolvedOxygen" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} name="Dissolved Oxygen" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    );
  };

  // ========== MAIN RENDER ==========

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-xl">Loading Water Quality Monitoring System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Droplets className="w-8 h-8 text-blue-600" />
            Real-Time Water Quality Monitoring - Admin
          </h1>
          <p className="text-gray-600 mt-2">Monitor and manage water quality sensors and data</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Activity },
              { id: 'sensors', label: 'Sensors', icon: Droplets },
              { id: 'submit', label: 'Submit Data', icon: Database },
              { id: 'alerts', label: 'Alerts', icon: Bell },
              { id: 'analysis', label: 'Analysis', icon: BarChart3 }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium transition-colors flex items-center gap-2 border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'sensors' && renderSensorManagement()}
        {activeTab === 'submit' && renderDataSubmission()}
        {activeTab === 'alerts' && renderAlertConfiguration()}
        {activeTab === 'analysis' && renderAnalysis()}
      </AnimatePresence>
    </div>
  );
};

export default WaterQualityMonitoringAdmin;
