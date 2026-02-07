import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import ChangeView from '../../components/ChangeView';
import { MapContainer, TileLayer, Circle, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  bathymetryDatasetService,
  surveyMissionService,
  depthContourService,
  visualizationService,
  bathymetryDashboardService,
  bathymetryExportService
} from '../../services/bathymetryService';

const BathymetryAdmin = () => {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'datasets' | 'missions' | 'upload' | 'visualize'
  const [dashboardStats, setDashboardStats] = useState(null);
  const [datasets, setDatasets] = useState([]);
  const [missions, setMissions] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [selectedMission, setSelectedMission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Upload Form
  const [uploadForm, setUploadForm] = useState({
    surveyName: '',
    surveyArea: '',
    surveyDate: '',
    vesselName: '',
    equipment: '',
    dataFormat: 'xyz',
    description: '',
    coordinates: {
      latitude: 7.8731,
      longitude: 80.7718
    }
  });

  const [uploadFile, setUploadFile] = useState(null);

  // Mission Form
  const [missionForm, setMissionForm] = useState({
    missionName: '',
    surveyArea: '',
    plannedStartDate: '',
    plannedEndDate: '',
    vesselAssigned: '',
    crewMembers: '',
    objectives: '',
    surveyBounds: {
      northeast: { lat: 8.0, lng: 81.0 },
      southwest: { lat: 7.0, lng: 80.0 }
    }
  });

  // Visualization Config
  const [vizConfig, setVizConfig] = useState({
    colorScheme: 'viridis',
    opacity: 0.8,
    contourLines: true,
    contourInterval: 10
  });

  useEffect(() => {
    loadDashboardStats();
    loadDatasets();
    loadMissions();
  }, []);

  const loadDashboardStats = async () => {
    const { data } = await bathymetryDashboardService.getStatistics();
    if (data) setDashboardStats(data);
  };

  const loadDatasets = async () => {
    setLoading(true);
    const { data } = await bathymetryDatasetService.getAll();
    if (data) setDatasets(data);
    setLoading(false);
  };

  const loadMissions = async () => {
    const { data } = await surveyMissionService.getAll();
    if (data) setMissions(data);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      alert('Please select a file to upload');
      return;
    }

    setLoading(true);
    setUploadProgress(10);

    const datasetInfo = {
      surveyName: uploadForm.surveyName,
      surveyArea: uploadForm.surveyArea,
      surveyDate: uploadForm.surveyDate,
      vesselName: uploadForm.vesselName,
      equipment: uploadForm.equipment,
      dataFormat: uploadForm.dataFormat,
      description: uploadForm.description,
      coordinates: uploadForm.coordinates
    };

    setUploadProgress(50);

    const { data, error } = await bathymetryDatasetService.upload(datasetInfo, uploadFile);

    setUploadProgress(100);

    if (error) {
      alert('Error uploading dataset: ' + error.message);
    } else {
      alert('Dataset uploaded successfully! ID: ' + data.datasetId);
      resetUploadForm();
      loadDatasets();
      loadDashboardStats();
      setActiveTab('datasets');
    }

    setLoading(false);
    setUploadProgress(0);
  };

  const handleProcessDataset = async (datasetId) => {
    setLoading(true);

    // Simulate processing (in production, this would trigger Cloud Functions)
    await bathymetryDatasetService.updateProcessingStatus(datasetId, 'processing');

    // Simulate successful processing after 2 seconds
    setTimeout(async () => {
      // Generate mock depth data
      const mockDepthData = generateMockDepthData(100);

      await bathymetryDatasetService.storeDepthData(datasetId, mockDepthData);
      await bathymetryDatasetService.updateProcessingStatus(datasetId, 'completed', {
        dataPoints: mockDepthData.length
      });

      alert('Dataset processed successfully!');
      loadDatasets();
      setLoading(false);
    }, 2000);
  };

  const generateMockDepthData = (count) => {
    const data = [];
    const baseLat = 7.8731;
    const baseLon = 80.7718;

    for (let i = 0; i < count; i++) {
      data.push({
        lat: baseLat + (Math.random() - 0.5) * 0.5,
        lon: baseLon + (Math.random() - 0.5) * 0.5,
        depth: Math.random() * 100 + 10 // 10-110 meters
      });
    }

    return data;
  };

  const handleGenerateContours = async (datasetId) => {
    const { data, error } = await depthContourService.generateContours(datasetId, vizConfig.contourInterval);
    if (error) {
      alert('Error generating contours: ' + error.message);
    } else {
      alert(`Contours generated successfully! ${data.levels.length} levels created.`);
      loadDatasets();
    }
  };

  const handleExportCSV = async (datasetId) => {
    const { data, error } = await bathymetryExportService.exportCSV(datasetId);
    if (error) {
      alert('Error exporting CSV: ' + error.message);
    } else {
      // Download CSV
      const blob = new Blob([data.csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.filename;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const handleExportGeoJSON = async (datasetId) => {
    const { data, error } = await bathymetryExportService.exportGeoJSON(datasetId);
    if (error) {
      alert('Error exporting GeoJSON: ' + error.message);
    } else {
      // Download GeoJSON
      const blob = new Blob([data.geojson], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.filename;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const handleCreateMission = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await surveyMissionService.create(missionForm);
    if (error) {
      alert('Error creating mission: ' + error.message);
    } else {
      alert('Mission created successfully! ID: ' + data.missionId);
      resetMissionForm();
      loadMissions();
      setActiveTab('missions');
    }

    setLoading(false);
  };

  const resetUploadForm = () => {
    setUploadForm({
      surveyName: '',
      surveyArea: '',
      surveyDate: '',
      vesselName: '',
      equipment: '',
      dataFormat: 'xyz',
      description: '',
      coordinates: {
        latitude: 7.8731,
        longitude: 80.7718
      }
    });
    setUploadFile(null);
  };

  const resetMissionForm = () => {
    setMissionForm({
      missionName: '',
      surveyArea: '',
      plannedStartDate: '',
      plannedEndDate: '',
      vesselAssigned: '',
      crewMembers: '',
      objectives: '',
      surveyBounds: {
        northeast: { lat: 8.0, lng: 81.0 },
        southwest: { lat: 7.0, lng: 80.0 }
      }
    });
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      processing: 'bg-yellow-100 text-yellow-700',
      ready: 'bg-green-100 text-green-700',
      error: 'bg-red-100 text-red-700',
      planned: 'bg-blue-100 text-blue-700',
      in_progress: 'bg-purple-100 text-purple-700',
      completed: 'bg-green-100 text-green-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Dashboard Tab
  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-600 to-cyan-700 text-white rounded-xl p-8">
        <Icons.Waves className="w-12 h-12 mb-3 opacity-90" />
        <h1 className="text-3xl font-bold mb-2">Bathymetry Data Center</h1>
        <p className="text-blue-100">Ocean Depth Mapping & Survey Data Management</p>
      </div>

      {dashboardStats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={Icons.Database}
              label="Total Datasets"
              value={dashboardStats.datasets.total}
              color="blue"
            />
            <StatCard
              icon={Icons.CheckCircle}
              label="Ready for Viz"
              value={dashboardStats.datasets.ready}
              color="green"
            />
            <StatCard
              icon={Icons.MapPin}
              label="Data Points"
              value={dashboardStats.coverage.totalDataPoints.toLocaleString()}
              color="purple"
            />
            <StatCard
              icon={Icons.Ship}
              label="Survey Missions"
              value={dashboardStats.missions.total}
              color="cyan"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Dataset Status</h2>
              <div className="space-y-3">
                <StatusRow label="Ready" count={dashboardStats.datasets.ready} color="green" />
                <StatusRow label="Processing" count={dashboardStats.datasets.processing} color="yellow" />
                <StatusRow label="Error" count={dashboardStats.datasets.error} color="red" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Mission Status</h2>
              <div className="space-y-3">
                <StatusRow label="Planned" count={dashboardStats.missions.planned} color="blue" />
                <StatusRow label="In Progress" count={dashboardStats.missions.in_progress} color="purple" />
                <StatusRow label="Completed" count={dashboardStats.missions.completed} color="green" />
              </div>
            </div>
          </div>

          {dashboardStats.coverage.averageDepth > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Coverage Statistics</h2>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {dashboardStats.coverage.totalDataPoints.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">Total Data Points</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-600">
                    {Math.round(dashboardStats.coverage.averageDepth)}m
                  </div>
                  <div className="text-sm text-gray-600 mt-2">Average Depth</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {Math.round(dashboardStats.coverage.totalAreaCovered)} km²
                  </div>
                  <div className="text-sm text-gray-600 mt-2">Area Covered</div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => setActiveTab('upload')}
          className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-xl p-8 hover:shadow-2xl transition-all"
        >
          <Icons.Upload className="w-12 h-12 mb-3" />
          <h3 className="text-xl font-bold mb-2">Upload Dataset</h3>
          <p className="text-green-100">Upload bathymetric survey data</p>
        </button>
        <button
          onClick={() => setActiveTab('datasets')}
          className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl p-8 hover:shadow-2xl transition-all"
        >
          <Icons.Database className="w-12 h-12 mb-3" />
          <h3 className="text-xl font-bold mb-2">Manage Datasets</h3>
          <p className="text-blue-100">View and process datasets</p>
        </button>
        <button
          onClick={() => setActiveTab('missions')}
          className="bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-xl p-8 hover:shadow-2xl transition-all"
        >
          <Icons.Ship className="w-12 h-12 mb-3" />
          <h3 className="text-xl font-bold mb-2">Survey Missions</h3>
          <p className="text-purple-100">Plan and track missions</p>
        </button>
      </div>
    </div>
  );

  // Datasets Tab
  const renderDatasets = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Bathymetry Datasets</h2>
          <button
            onClick={() => setActiveTab('upload')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Icons.Upload className="w-5 h-5" />
            Upload Dataset
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {datasets.map((dataset) => (
              <div key={dataset.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-sm text-gray-500">{dataset.datasetId}</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeColor(dataset.status)}`}>
                        {dataset.status.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{dataset.surveyName}</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {dataset.surveyArea} • {new Date(dataset.surveyDate).toLocaleDateString()}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Vessel:</span>
                        <p className="font-medium text-gray-800">{dataset.vesselName}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Format:</span>
                        <p className="font-medium text-gray-800">{dataset.dataFormat.toUpperCase()}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">File Size:</span>
                        <p className="font-medium text-gray-800">{formatFileSize(dataset.fileSize)}</p>
                      </div>
                      {dataset.dataPoints && (
                        <div>
                          <span className="text-gray-500">Data Points:</span>
                          <p className="font-medium text-gray-800">{dataset.dataPoints.toLocaleString()}</p>
                        </div>
                      )}
                    </div>

                    {dataset.status === 'ready' && dataset.minDepth && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Min Depth:</span>
                            <p className="font-bold text-blue-600">{Math.round(dataset.minDepth)}m</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Max Depth:</span>
                            <p className="font-bold text-red-600">{Math.round(dataset.maxDepth)}m</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Avg Depth:</span>
                            <p className="font-bold text-purple-600">{Math.round(dataset.averageDepth)}m</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {dataset.status === 'processing' && (
                      <button
                        onClick={() => handleProcessDataset(dataset.id)}
                        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"
                        title="Process Dataset"
                      >
                        <Icons.Play className="w-5 h-5" />
                      </button>
                    )}
                    {dataset.status === 'ready' && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedDataset(dataset);
                            setActiveTab('visualize');
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Visualize"
                        >
                          <Icons.Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleGenerateContours(dataset.id)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                          title="Generate Contours"
                        >
                          <Icons.Layers className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleExportCSV(dataset.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          title="Export CSV"
                        >
                          <Icons.FileDown className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleExportGeoJSON(dataset.id)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                          title="Export GeoJSON"
                        >
                          <Icons.Map className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Upload Tab
  const renderUpload = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Bathymetry Dataset</h2>

        <form onSubmit={handleFileUpload} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Survey Name*</label>
              <input
                type="text"
                required
                value={uploadForm.surveyName}
                onChange={(e) => setUploadForm({ ...uploadForm, surveyName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Survey Area*</label>
              <input
                type="text"
                required
                value={uploadForm.surveyArea}
                onChange={(e) => setUploadForm({ ...uploadForm, surveyArea: e.target.value })}
                placeholder="e.g., Gulf of Mannar, Trincomalee Bay"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Survey Date*</label>
              <input
                type="date"
                required
                value={uploadForm.surveyDate}
                onChange={(e) => setUploadForm({ ...uploadForm, surveyDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vessel Name*</label>
              <input
                type="text"
                required
                value={uploadForm.vesselName}
                onChange={(e) => setUploadForm({ ...uploadForm, vesselName: e.target.value })}
                placeholder="e.g., RV Samudrika"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Equipment Used</label>
              <input
                type="text"
                value={uploadForm.equipment}
                onChange={(e) => setUploadForm({ ...uploadForm, equipment: e.target.value })}
                placeholder="e.g., Single-beam echosounder"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Format*</label>
              <select
                required
                value={uploadForm.dataFormat}
                onChange={(e) => setUploadForm({ ...uploadForm, dataFormat: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="xyz">XYZ (Lat, Lon, Depth)</option>
                <option value="csv">CSV</option>
                <option value="geojson">GeoJSON</option>
                <option value="netcdf">NetCDF</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={3}
                value={uploadForm.description}
                onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Data File*</label>
              <input
                type="file"
                required
                accept=".xyz,.csv,.json,.geojson,.nc"
                onChange={(e) => setUploadFile(e.target.files[0])}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {uploadFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {uploadFile.name} ({formatFileSize(uploadFile.size)})
                </p>
              )}
            </div>
          </div>

          {uploadProgress > 0 && (
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-blue-700">Uploading...</span>
                <span className="text-sm font-semibold text-blue-700">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Upload Dataset'}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('datasets');
                resetUploadForm();
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Visualization Tab
  const renderVisualization = () => {
    if (!selectedDataset) return null;

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Bathymetry Visualization</h2>
              <p className="text-gray-600 mt-1">{selectedDataset.surveyName}</p>
            </div>
            <button
              onClick={() => {
                setSelectedDataset(null);
                setActiveTab('datasets');
              }}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Back to Datasets
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Visualization Controls */}
            <div className="lg:col-span-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color Scheme</label>
                <select
                  value={vizConfig.colorScheme}
                  onChange={(e) => setVizConfig({ ...vizConfig, colorScheme: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="viridis">Viridis</option>
                  <option value="plasma">Plasma</option>
                  <option value="inferno">Inferno</option>
                  <option value="cool">Cool</option>
                  <option value="warm">Warm</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Opacity: {vizConfig.opacity}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={vizConfig.opacity}
                  onChange={(e) => setVizConfig({ ...vizConfig, opacity: parseFloat(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={vizConfig.contourLines}
                    onChange={(e) => setVizConfig({ ...vizConfig, contourLines: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-gray-700">Show Contour Lines</span>
                </label>
              </div>

              {vizConfig.contourLines && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contour Interval: {vizConfig.contourInterval}m
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={vizConfig.contourInterval}
                    onChange={(e) => setVizConfig({ ...vizConfig, contourInterval: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-2">Dataset Info</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Data Points:</span>
                    <p className="font-medium">{selectedDataset.dataPoints?.toLocaleString() || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Depth Range:</span>
                    <p className="font-medium">
                      {selectedDataset.minDepth ? `${Math.round(selectedDataset.minDepth)}m - ${Math.round(selectedDataset.maxDepth)}m` : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="lg:col-span-3">
              <div className="h-[600px] rounded-lg overflow-hidden border-2 border-gray-200">
                <MapContainer
                  style={{ height: '100%', width: '100%' }}
                >
                  <ChangeView center={[selectedDataset.coordinates.latitude, selectedDataset.coordinates.longitude]} zoom={10} />
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                  />

                  {/* Render depth data points as circles */}
                  {selectedDataset.depthData && selectedDataset.depthData.map((point, idx) => {
                    const depthPercent = (point.depth - selectedDataset.minDepth) / (selectedDataset.maxDepth - selectedDataset.minDepth);
                    const color = getDepthColor(depthPercent, vizConfig.colorScheme);

                    return (
                      <Circle
                        key={idx}
                        center={[point.lat, point.lon]}
                        radius={50}
                        pathOptions={{
                          color: color,
                          fillColor: color,
                          fillOpacity: vizConfig.opacity,
                          weight: 1
                        }}
                      >
                        <Popup>
                          <div>
                            <strong>Depth:</strong> {Math.round(point.depth)}m<br />
                            <strong>Location:</strong> {point.lat.toFixed(4)}, {point.lon.toFixed(4)}
                          </div>
                        </Popup>
                      </Circle>
                    );
                  })}
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Missions Tab
  const renderMissions = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Survey Missions</h2>
          <button
            onClick={() => setActiveTab('create-mission')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Icons.Plus className="w-5 h-5" />
            New Mission
          </button>
        </div>

        <div className="space-y-4">
          {missions.map((mission) => (
            <div key={mission.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm text-gray-500">{mission.missionId}</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeColor(mission.status)}`}>
                      {mission.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{mission.missionName}</h3>
                  <p className="text-gray-600 text-sm mb-3">{mission.surveyArea}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Vessel:</span>
                      <p className="font-medium">{mission.vesselAssigned}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Start Date:</span>
                      <p className="font-medium">{new Date(mission.plannedStartDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">End Date:</span>
                      <p className="font-medium">{new Date(mission.plannedEndDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Datasets:</span>
                      <p className="font-medium">{mission.datasets?.length || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="mb-8 flex gap-4 border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('datasets')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'datasets'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Datasets
          </button>
          <button
            onClick={() => setActiveTab('missions')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'missions'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Missions
          </button>
          {selectedDataset && activeTab === 'visualize' && (
            <button
              className="px-6 py-3 font-medium border-b-2 border-blue-600 text-blue-600 whitespace-nowrap"
            >
              Visualization
            </button>
          )}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'datasets' && renderDatasets()}
          {activeTab === 'upload' && renderUpload()}
          {activeTab === 'visualize' && renderVisualization()}
          {activeTab === 'missions' && renderMissions()}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Helper function to get color based on depth percentage
const getDepthColor = (percent, scheme) => {
  // Simplified color mapping
  if (scheme === 'viridis') {
    if (percent < 0.25) return '#440154';
    if (percent < 0.5) return '#31688e';
    if (percent < 0.75) return '#35b779';
    return '#fde724';
  }
  // Default blue gradient
  const blue = Math.floor(255 * (1 - percent));
  const red = Math.floor(255 * percent);
  return `rgb(${red}, 0, ${blue})`;
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    cyan: 'from-[#003366] to-[#0066CC]'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} text-white rounded-xl p-6 shadow-lg`}>
      <Icon className="w-10 h-10 mb-3 opacity-90" />
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm opacity-90">{label}</div>
    </div>
  );
};

// Status Row Component
const StatusRow = ({ label, count, color }) => {
  const colorClasses = {
    gray: 'bg-gray-100 text-gray-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    purple: 'bg-purple-100 text-purple-700'
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colorClasses[color]}`}>
        {count}
      </span>
    </div>
  );
};

export default BathymetryAdmin;
