/**
 * Data Center Integration Hub Admin
 *
 * Admin panel for managing data center integrations
 * Features:
 * - Data source registry and management
 * - API integration configuration
 * - Sync job monitoring and execution
 * - Data transformation rules
 * - Data quality validation
 * - Integration dashboard with analytics
 * - Webhook management
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  Server,
  RefreshCw,
  Settings,
  CheckCircle,
  XCircle,
  Activity,
  Play,
  Pause,
  BarChart3,
  Clock,
  AlertCircle,
  Link,
  Code,
  Shield,
  Zap,
  Globe,
  ArrowRight,
  Download,
  Upload,
  Filter
} from 'lucide-react';

import {
  dataSourceRegistryService,
  apiIntegrationService,
  dataSyncService,
  transformService,
  dataQualityService,
  integrationDashboardService,
  webhookService
} from '../../services/dataCenterIntegrationService';
import { getIntegrationMockData } from '../../utils/mockIntegrationData';

const DataCenterIntegrationAdmin = () => {
  const USE_MOCK = import.meta?.env?.VITE_USE_INTEGRATION_ADMIN_MOCK === 'true';
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [dataSources, setDataSources] = useState([]);
  const [syncJobs, setSyncJobs] = useState([]);
  const [apiIntegrations, setApiIntegrations] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(USE_MOCK);

  // Forms
  const [sourceForm, setSourceForm] = useState({
    sourceName: '',
    sourceType: 'api',
    endpoint: '',
    authMethod: 'api_key',
    syncFrequency: 'daily',
    description: ''
  });

  const [apiIntegrationForm, setApiIntegrationForm] = useState({
    integrationName: '',
    apiEndpoint: '',
    method: 'GET',
    authMethod: 'bearer',
    apiKey: '',
    headers: ''
  });

  const [transformRuleForm, setTransformRuleForm] = useState({
    ruleName: '',
    transformationType: 'field_mapping',
    sourceField: '',
    targetField: '',
    description: ''
  });

  useEffect(() => {
    fetchAllData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyMockData = () => {
    const mock = getIntegrationMockData();
    setDashboardStats(mock.dashboardStats);
    setDataSources(mock.dataSources);
    setSyncJobs(mock.syncJobs);
    setApiIntegrations(mock.apiIntegrations);
    setRecentActivity(mock.recentActivity);
    setUsingMock(true);
    setLoading(false);
  };

  const fetchAllData = async () => {
    if (USE_MOCK) {
      applyMockData();
      return;
    }

    setLoading(true);
    try {
      const [statsRes, sourcesRes, jobsRes, integrationsRes, activityRes] = await Promise.all([
        integrationDashboardService.getStats(),
        dataSourceRegistryService.getAll(),
        dataSyncService.getAllJobs(),
        apiIntegrationService.getAll(),
        integrationDashboardService.getRecentActivity()
      ]);

      if (statsRes.error || sourcesRes.error || jobsRes.error || integrationsRes.error || activityRes.error) {
        throw new Error('Integration services returned an error');
      }

      if (statsRes.data) setDashboardStats(statsRes.data);
      if (sourcesRes.data) setDataSources(sourcesRes.data);
      if (jobsRes.data) setSyncJobs(jobsRes.data);
      if (integrationsRes.data) setApiIntegrations(integrationsRes.data);
      if (activityRes.data) setRecentActivity(activityRes.data);
      setUsingMock(false);
      setLoading(false);
    } catch (error) {
      console.error('[DataCenterIntegrationAdmin] Falling back to mock data:', error);
      applyMockData();
    }
  };

  // ========== HANDLERS ==========

  const handleRegisterSource = async (e) => {
    e.preventDefault();

    const { data, error } = await dataSourceRegistryService.register(sourceForm);

    if (error) {
      alert('Error registering data source: ' + error);
      return;
    }

    alert('Data source registered successfully! Source ID: ' + data.sourceId);
    setSourceForm({
      sourceName: '',
      sourceType: 'api',
      endpoint: '',
      authMethod: 'api_key',
      syncFrequency: 'daily',
      description: ''
    });
    fetchAllData();
  };

  const handleActivateSource = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const { error } = await dataSourceRegistryService.updateStatus(id, newStatus);

    if (error) {
      alert('Error updating source status: ' + error);
      return;
    }

    alert(`Data source ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
    fetchAllData();
  };

  const handleTestConnection = async (id) => {
    const { data, error } = await dataSourceRegistryService.testConnection(id);

    if (error) {
      alert('Connection test failed: ' + error);
      return;
    }

    alert(`Connection successful! Response time: ${data.responseTime}ms`);
  };

  const handleCreateSyncJob = async (sourceId) => {
    const syncConfig = {
      syncType: 'full',
      batchSize: 100
    };

    const { data, error } = await dataSyncService.createSyncJob(sourceId, syncConfig);

    if (error) {
      alert('Error creating sync job: ' + error);
      return;
    }

    alert('Sync job created! Job ID: ' + data.jobId);
    fetchAllData();
  };

  const handleExecuteSyncJob = async (jobId) => {
    const { data, error } = await dataSyncService.executeSyncJob(jobId);

    if (error) {
      alert('Error executing sync job: ' + error);
      return;
    }

    alert(`Sync completed! Processed: ${data.recordsProcessed}, Succeeded: ${data.recordsSucceeded}, Failed: ${data.recordsFailed}`);
    fetchAllData();
  };

  const handleCreateApiIntegration = async (e) => {
    e.preventDefault();

    const { data, error } = await apiIntegrationService.create(apiIntegrationForm);

    if (error) {
      alert('Error creating API integration: ' + error);
      return;
    }

    alert('API integration created successfully! Integration ID: ' + data.integrationId);
    setApiIntegrationForm({
      integrationName: '',
      apiEndpoint: '',
      method: 'GET',
      authMethod: 'bearer',
      apiKey: '',
      headers: ''
    });
    fetchAllData();
  };

  const handleTestApiIntegration = async (id) => {
    const { data, error } = await apiIntegrationService.makeRequest(id, {});

    if (error) {
      alert('API request failed: ' + error);
      return;
    }

    alert(`API request successful! Status: ${data.statusCode}, Response time: ${data.responseTime}ms`);
    fetchAllData();
  };

  const handleCreateTransformRule = async (e) => {
    e.preventDefault();

    const ruleData = {
      ...transformRuleForm,
      mapping: {
        [transformRuleForm.targetField]: transformRuleForm.sourceField
      }
    };

    const { data, error } = await transformService.createRule(ruleData);

    if (error) {
      alert('Error creating transformation rule: ' + error);
      return;
    }

    alert('Transformation rule created successfully! Rule ID: ' + data.ruleId);
    setTransformRuleForm({
      ruleName: '',
      transformationType: 'field_mapping',
      sourceField: '',
      targetField: '',
      description: ''
    });
  };

  // ========== RENDER FUNCTIONS ==========

  const renderDashboard = () => {
    if (!dashboardStats) return null;

    return (
      <div className="p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <Activity className="w-8 h-8 text-blue-600" />
          Integration Dashboard
        </h2>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <Database className="w-8 h-8" />
              <span className="text-3xl font-bold">{dashboardStats.totalSources}</span>
            </div>
            <p className="text-blue-100">Total Data Sources</p>
            <p className="text-sm text-blue-200 mt-2">{dashboardStats.activeSources} active</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="w-8 h-8" />
              <span className="text-3xl font-bold">{dashboardStats.completedJobs}</span>
            </div>
            <p className="text-green-100">Completed Sync Jobs</p>
            <p className="text-sm text-green-200 mt-2">{dashboardStats.runningJobs} running</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-8 h-8" />
              <span className="text-3xl font-bold">{dashboardStats.totalRecordsSynced.toLocaleString()}</span>
            </div>
            <p className="text-purple-100">Records Synced</p>
            <p className="text-sm text-purple-200 mt-2">All time</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <Globe className="w-8 h-8" />
              <span className="text-3xl font-bold">{dashboardStats.averageSuccessRate}%</span>
            </div>
            <p className="text-orange-100">Avg Success Rate</p>
            <p className="text-sm text-orange-200 mt-2">API Integrations</p>
          </motion.div>
        </div>

        {/* API Integration Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-700">Total API Requests</h3>
              <Server className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalApiRequests.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-700">Successful Requests</h3>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-green-600">{dashboardStats.successfulRequests.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-700">Failed Requests</h3>
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-red-600">{dashboardStats.failedRequests.toLocaleString()}</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-600" />
            Recent Sync Activity
          </h3>

          <div className="space-y-3">
            {recentActivity.slice(0, 10).map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.status === 'completed' ? 'bg-green-500' :
                    activity.status === 'failed' ? 'bg-red-500' :
                    activity.status === 'running' ? 'bg-blue-500 animate-pulse' :
                    'bg-gray-400'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900">{activity.jobId}</p>
                    <p className="text-sm text-gray-600">
                      {activity.recordsSucceeded || 0} records synced
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                  activity.status === 'failed' ? 'bg-red-100 text-red-800' :
                  activity.status === 'running' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderDataSources = () => {
    return (
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Database className="w-8 h-8 text-blue-600" />
            Data Source Registry
          </h2>
          <button
            onClick={fetchAllData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Register New Source Form */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Register New Data Source</h3>

          <form onSubmit={handleRegisterSource} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Source Name *</label>
              <input
                type="text"
                value={sourceForm.sourceName}
                onChange={(e) => setSourceForm({ ...sourceForm, sourceName: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="NOAA Ocean Data"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Source Type *</label>
              <select
                value={sourceForm.sourceType}
                onChange={(e) => setSourceForm({ ...sourceForm, sourceType: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="api">REST API</option>
                <option value="database">Database</option>
                <option value="file">File Upload</option>
                <option value="ftp">FTP Server</option>
                <option value="webhook">Webhook</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Endpoint/Connection String *</label>
              <input
                type="text"
                value={sourceForm.endpoint}
                onChange={(e) => setSourceForm({ ...sourceForm, endpoint: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://api.example.com/data"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Authentication Method *</label>
              <select
                value={sourceForm.authMethod}
                onChange={(e) => setSourceForm({ ...sourceForm, authMethod: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="api_key">API Key</option>
                <option value="oauth">OAuth 2.0</option>
                <option value="basic">Basic Auth</option>
                <option value="bearer">Bearer Token</option>
                <option value="none">None</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sync Frequency *</label>
              <select
                value={sourceForm.syncFrequency}
                onChange={(e) => setSourceForm({ ...sourceForm, syncFrequency: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="manual">Manual Only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <input
                type="text"
                value={sourceForm.description}
                onChange={(e) => setSourceForm({ ...sourceForm, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ocean temperature and salinity data"
              />
            </div>

            <div className="col-span-2">
              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <Database className="w-5 h-5" />
                Register Data Source
              </button>
            </div>
          </form>
        </div>

        {/* Data Sources List */}
        <div className="grid grid-cols-1 gap-4">
          {dataSources.map((source) => (
            <motion.div
              key={source.id}
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    source.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Database className={`w-6 h-6 ${
                      source.status === 'active' ? 'text-green-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{source.sourceName}</h3>
                    <p className="text-sm text-gray-600">{source.sourceId}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleActivateSource(source.id, source.status)}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      source.status === 'active'
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {source.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {source.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>

                  <button
                    onClick={() => handleTestConnection(source.id)}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    Test
                  </button>

                  <button
                    onClick={() => handleCreateSyncJob(source.id)}
                    className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Sync Now
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 font-medium">Type</p>
                  <p className="text-gray-900">{source.sourceType}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Sync Frequency</p>
                  <p className="text-gray-900">{source.syncFrequency}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Records Synced</p>
                  <p className="text-gray-900">{(source.totalRecordsSynced || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Last Sync</p>
                  <p className="text-gray-900">{source.lastSync ? new Date(source.lastSync).toLocaleDateString() : 'Never'}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderSyncJobs = () => {
    return (
      <div className="p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <RefreshCw className="w-8 h-8 text-blue-600" />
          Sync Jobs Monitor
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {syncJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{job.jobId}</h3>
                  <p className="text-sm text-gray-600">Source: {job.sourceId}</p>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    job.status === 'completed' ? 'bg-green-100 text-green-800' :
                    job.status === 'failed' ? 'bg-red-100 text-red-800' :
                    job.status === 'running' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {job.status}
                  </span>

                  {job.status === 'pending' && (
                    <button
                      onClick={() => handleExecuteSyncJob(job.jobId)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Execute
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Processed</p>
                  <p className="text-xl font-bold text-gray-900">{job.recordsProcessed || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Succeeded</p>
                  <p className="text-xl font-bold text-green-600">{job.recordsSucceeded || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Failed</p>
                  <p className="text-xl font-bold text-red-600">{job.recordsFailed || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Created</p>
                  <p className="text-sm text-gray-900">
                    {job.createdAt ? new Date(job.createdAt.seconds * 1000).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderApiIntegrations = () => {
    return (
      <div className="p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <Globe className="w-8 h-8 text-blue-600" />
          API Integrations
        </h2>

        {/* API Integration Form */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Create API Integration</h3>

          <form onSubmit={handleCreateApiIntegration} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Integration Name *</label>
              <input
                type="text"
                value={apiIntegrationForm.integrationName}
                onChange={(e) => setApiIntegrationForm({ ...apiIntegrationForm, integrationName: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">API Endpoint *</label>
              <input
                type="url"
                value={apiIntegrationForm.apiEndpoint}
                onChange={(e) => setApiIntegrationForm({ ...apiIntegrationForm, apiEndpoint: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">HTTP Method *</label>
              <select
                value={apiIntegrationForm.method}
                onChange={(e) => setApiIntegrationForm({ ...apiIntegrationForm, method: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Auth Method *</label>
              <select
                value={apiIntegrationForm.authMethod}
                onChange={(e) => setApiIntegrationForm({ ...apiIntegrationForm, authMethod: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="bearer">Bearer Token</option>
                <option value="api_key">API Key</option>
                <option value="basic">Basic Auth</option>
                <option value="none">None</option>
              </select>
            </div>

            <div className="col-span-2">
              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <Globe className="w-5 h-5" />
                Create API Integration
              </button>
            </div>
          </form>
        </div>

        {/* API Integrations List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {apiIntegrations.map((integration) => (
            <motion.div
              key={integration.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{integration.integrationName}</h3>
                  <p className="text-sm text-gray-600">{integration.integrationId}</p>
                </div>

                <button
                  onClick={() => handleTestApiIntegration(integration.id)}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm flex items-center gap-1"
                >
                  <Zap className="w-4 h-4" />
                  Test
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <p className="text-gray-600 font-medium">Total Requests</p>
                  <p className="text-gray-900 font-bold">{integration.totalRequests || 0}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Success Rate</p>
                  <p className="text-green-600 font-bold">
                    {integration.totalRequests > 0
                      ? Math.round((integration.successfulRequests / integration.totalRequests) * 100)
                      : 0}%
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 break-all">{integration.apiEndpoint}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderTransformations = () => {
    return (
      <div className="p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <Code className="w-8 h-8 text-blue-600" />
          Data Transformations
        </h2>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Create Transformation Rule</h3>

          <form onSubmit={handleCreateTransformRule} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rule Name *</label>
              <input
                type="text"
                value={transformRuleForm.ruleName}
                onChange={(e) => setTransformRuleForm({ ...transformRuleForm, ruleName: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Transformation Type *</label>
              <select
                value={transformRuleForm.transformationType}
                onChange={(e) => setTransformRuleForm({ ...transformRuleForm, transformationType: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="field_mapping">Field Mapping</option>
                <option value="data_normalization">Data Normalization</option>
                <option value="data_enrichment">Data Enrichment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Source Field *</label>
              <input
                type="text"
                value={transformRuleForm.sourceField}
                onChange={(e) => setTransformRuleForm({ ...transformRuleForm, sourceField: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="original_field_name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Field *</label>
              <input
                type="text"
                value={transformRuleForm.targetField}
                onChange={(e) => setTransformRuleForm({ ...transformRuleForm, targetField: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="transformed_field_name"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={transformRuleForm.description}
                onChange={(e) => setTransformRuleForm({ ...transformRuleForm, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Describe this transformation..."
              />
            </div>

            <div className="col-span-2">
              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <Code className="w-5 h-5" />
                Create Transformation Rule
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderPlaybook = () => {
    return (
      <div className="p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <Link className="w-8 h-8 text-blue-600" />
          Integration Playbook
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Issue partner credentials</h3>
            <p className="text-sm text-gray-600 mb-4">
              Use the <strong>API Integrations</strong> tab to create a sandbox connection for new
              partners. Generate scoped API keys and share them securely through the partner channel.
            </p>
            <div className="rounded-xl bg-white text-slate-800 text-xs font-mono p-4 overflow-x-auto border border-slate-200">
              <pre className="whitespace-pre-wrap">
{`curl -X POST https://partners.nara.lk/api/v1/tides \\
  -H "Authorization: ApiKey <partner-key>" \\
  -H "NARA-Environment: sandbox"`}
              </pre>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Tip: Share the OpenAPI spec and SDK starter pack so partners can prototype within
              minutes.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Configure sync automation</h3>
            <p className="text-sm text-gray-600 mb-4">
              Align partner data pulls with the source sync frequency. Track quota utilisation and
              health signals from the dashboard to know when to scale.
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                Match cron jobs with the <em>Sync Jobs</em> cadence (e.g. hourly ocean data, nightly
                fisheries submissions).
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                Enable webhook callbacks for alert-level events (incidents, advisories, compliance).
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                Promote to production once success rate exceeds 95% for seven consecutive runs.
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Monitor &amp; govern access</h3>
            <p className="text-sm text-gray-600 mb-4">
              The dashboard surfaces anomalies automatically. Lock credentials when failure rate or
              latency breaches thresholds to safeguard national systems.
            </p>
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-700">
              <p className="font-semibold text-gray-900 mb-2">Recommended guardrails</p>
              <ul className="space-y-1">
                <li>• Rotate API keys every 90 days (30 days for restricted datasets).</li>
                <li>• Enable rate limiting: default 5,000 requests / hour per partner.</li>
                <li>• Audit log export to GovCERT every weekend.</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Hand-off to production</h3>
            <p className="text-sm text-gray-600 mb-4">
              Once the integration is steady, switch partner endpoints to the production gateway and
              share the incident escalation matrix.
            </p>
            <div className="rounded-xl bg-white text-slate-800 text-xs font-mono p-4 overflow-x-auto border border-slate-200">
              <pre className="whitespace-pre-wrap">
{`PATCH /admin/integrations/API-FORECAST-004
{
  "environment": "production",
  "webhooks": ["incident.alert", "quota.low"],
  "contacts": ["ops@nara.lk", "partner-support@nara.lk"]
}`}
              </pre>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Document the go-live in the mission log so policy, research, and compliance can track
              downstream impacts.
            </p>
          </div>
        </div>
      </div>
    );
  };

  // ========== MAIN RENDER ==========

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-xl">Loading Integration Hub...</p>
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
            <Server className="w-8 h-8 text-blue-600" />
            Data Center Integration Hub - Admin
          </h1>
          <p className="text-gray-600 mt-2">Manage data sources, integrations, and synchronization</p>
          {usingMock && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-700">
              <AlertCircle className="w-4 h-4" />
              Previewing mock integration data. Connect Firebase services to see live metrics.
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Activity },
              { id: 'sources', label: 'Data Sources', icon: Database },
              { id: 'sync', label: 'Sync Jobs', icon: RefreshCw },
              { id: 'api', label: 'API Integrations', icon: Globe },
              { id: 'transform', label: 'Transformations', icon: Code },
              { id: 'playbook', label: 'Integration Playbook', icon: Link }
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
        {activeTab === 'sources' && renderDataSources()}
        {activeTab === 'sync' && renderSyncJobs()}
        {activeTab === 'api' && renderApiIntegrations()}
        {activeTab === 'transform' && renderTransformations()}
        {activeTab === 'playbook' && renderPlaybook()}
      </AnimatePresence>
    </div>
  );
};

export default DataCenterIntegrationAdmin;
