import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Plus, 
  CheckCircle, 
  AlertCircle,
  Activity, 
  BarChart3, 
  Shield,
  Zap,
  Globe,
  Clock,
  TrendingUp,
  Eye,
  ToggleLeft,
  ToggleRight,
  Filter
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { apiManagementService } from '../../../services/integrationService';

const APIManagementSection = () => {
  const [endpoints, setEndpoints] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [activeTab, setActiveTab] = useState('endpoints');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState('');
  const [dateRange, setDateRange] = useState('7d');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    endpoint_url: '',
    method: 'GET',
    authentication_type: 'bearer_token',
    rate_limit_per_minute: 100,
    timeout_seconds: 30,
    integration_type: 'api_gateway'
  });
  const { t } = useTranslation('integration');
  const strings = t('api', { returnObjects: true });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (activeTab === 'analytics') {
      loadAnalytics();
    }
  }, [activeTab, selectedEndpoint, dateRange]);

  const loadData = async () => {
    try {
      const endpointsData = await apiManagementService?.getAllEndpoints();
      setEndpoints(endpointsData || []);
    } catch (error) {
      console.error('Error loading API endpoints:', error);
      setEndpoints([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const startDate = getStartDate(dateRange);
      const analyticsData = await apiManagementService?.getUsageAnalytics(
        selectedEndpoint || null, 
        startDate, 
        new Date()?.toISOString()
      );
      setAnalytics(analyticsData || []);
    } catch (error) {
      console.error('Error loading analytics:', error);
      setAnalytics([]);
    }
  };

  const getStartDate = (range) => {
    const now = new Date();
    switch (range) {
      case '24h':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000)?.toISOString();
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)?.toISOString();
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)?.toISOString();
      default:
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)?.toISOString();
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    try {
      await apiManagementService?.createEndpoint(formData);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error creating endpoint:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      endpoint_url: '',
      method: 'GET',
      authentication_type: 'bearer_token',
      rate_limit_per_minute: 100,
      timeout_seconds: 30,
      integration_type: 'api_gateway'
    });
    setShowAddModal(false);
  };

  const toggleEndpointStatus = async (id, currentStatus) => {
    try {
      await apiManagementService?.toggleEndpointStatus(id, !currentStatus);
      loadData();
    } catch (error) {
      console.error('Error toggling endpoint status:', error);
    }
  };

  const getMethodBadge = (method) => {
    const colors = {
      'GET': 'bg-green-100 text-green-800',
      'POST': 'bg-blue-100 text-blue-800',
      'PUT': 'bg-yellow-100 text-yellow-800',
      'DELETE': 'bg-red-100 text-red-800',
      'PATCH': 'bg-purple-100 text-purple-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors?.[method] || colors?.GET}`}>
        {method}
      </span>
    );
  };

  const getIntegrationTypeBadge = (type) => {
    const colors = {
      'government': 'bg-blue-100 text-blue-800',
      'research': 'bg-purple-100 text-purple-800',
      'satellite': 'bg-green-100 text-green-800',
      'api_gateway': 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors?.[type] || colors?.api_gateway}`}>
        {type?.replace('_', ' ')?.toUpperCase()}
      </span>
    );
  };

  const calculateAnalyticsStats = () => {
    if (analytics?.length === 0) return { totalRequests: 0, avgResponseTime: 0, successRate: 0, errorCount: 0 };

    const totalRequests = analytics?.length;
    const avgResponseTime = Math.round(
      analytics?.reduce((sum, item) => sum + (item?.response_time_ms || 0), 0) / totalRequests
    );
    const successCount = analytics?.filter(item => item?.status_code >= 200 && item?.status_code < 300)?.length;
    const successRate = Math.round((successCount / totalRequests) * 100);
    const errorCount = analytics?.filter(item => item?.status_code >= 400)?.length;

    return { totalRequests, avgResponseTime, successRate, errorCount };
  };

  const stats = calculateAnalyticsStats();

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Settings className="w-6 h-6 text-blue-600 mr-3" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{strings?.title}</h2>
            <p className="text-sm text-gray-600">{strings?.subtitle}</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          {strings?.actions?.addEndpoint}
        </button>
      </div>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center">
            <Globe className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Endpoints</p>
              <p className="text-2xl font-bold text-blue-900">{endpoints?.length || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-green-600 font-medium">Active Endpoints</p>
              <p className="text-2xl font-bold text-green-900">
                {endpoints?.filter(e => e?.is_active)?.length || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm text-yellow-600 font-medium">Requests ({dateRange})</p>
              <p className="text-2xl font-bold text-yellow-900">{stats?.totalRequests || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-purple-600 font-medium">Avg Response</p>
              <p className="text-2xl font-bold text-purple-900">{stats?.avgResponseTime || 0}ms</p>
            </div>
          </div>
        </div>
      </div>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('endpoints')}
            className={`${
              activeTab === 'endpoints' ?'border-blue-500 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <Settings className="w-4 h-4 mr-2" />
            Endpoints ({endpoints?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`${
              activeTab === 'analytics' ?'border-blue-500 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </button>
        </nav>
      </div>
      {/* Endpoints Tab */}
      {activeTab === 'endpoints' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {endpoints?.map((endpoint) => (
            <div key={endpoint?.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className={`w-3 h-3 rounded-full mr-2 ${endpoint?.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <h3 className="text-lg font-semibold text-gray-900">{endpoint?.name}</h3>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    {getMethodBadge(endpoint?.method)}
                    {getIntegrationTypeBadge(endpoint?.integration_type)}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">{endpoint?.description}</p>
                  
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <code className="text-sm text-gray-700 break-all">{endpoint?.endpoint_url}</code>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Shield className="w-3 h-3 mr-2" />
                    Auth: {endpoint?.authentication_type?.replace('_', ' ')}
                  </span>
                  <span className="flex items-center">
                    <Zap className="w-3 h-3 mr-2" />
                    {endpoint?.rate_limit_per_minute}/min
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-2" />
                    Timeout: {endpoint?.timeout_seconds}s
                  </span>
                  <span className="text-xs text-gray-500">
                    Created: {new Date(endpoint?.created_at)?.toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleEndpointStatus(endpoint?.id, endpoint?.is_active)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        endpoint?.is_active 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200' :'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {endpoint?.is_active ? (
                        <>
                          <ToggleRight className="w-3 h-3 mr-1" />
                          Disable
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-3 h-3 mr-1" />
                          Enable
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedEndpoint(endpoint?.id);
                        setActiveTab('analytics');
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="View Analytics"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors" title="Edit Endpoint">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Analytics Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endpoint</label>
                <select
                  value={selectedEndpoint}
                  onChange={(e) => setSelectedEndpoint(e?.target?.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Endpoints</option>
                  {endpoints?.map((endpoint) => (
                    <option key={endpoint?.id} value={endpoint?.id}>
                      {endpoint?.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e?.target?.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>
              </div>
            </div>
            
            <button
              onClick={loadAnalytics}
              className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Filter className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>

          {/* Analytics Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center">
                <Activity className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Requests</p>
                  <p className="text-xl font-bold text-gray-900">{stats?.totalRequests || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center">
                <Clock className="w-6 h-6 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Avg Response Time</p>
                  <p className="text-xl font-bold text-gray-900">{stats?.avgResponseTime || 0}ms</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-xl font-bold text-gray-900">{stats?.successRate || 0}%</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Error Count</p>
                  <p className="text-xl font-bold text-gray-900">{stats?.errorCount || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Requests */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Requests</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Response Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analytics?.slice(0, 10)?.map((request, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(request?.request_timestamp)?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request?.endpoint?.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          request?.status_code >= 200 && request?.status_code < 300
                            ? 'bg-green-100 text-green-800'
                            : request?.status_code >= 400
                            ? 'bg-red-100 text-red-800' :'bg-yellow-100 text-yellow-800'
                        }`}>
                          {request?.status_code}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request?.response_time_ms || 0}ms
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Math.round((request?.response_size_bytes || 0) / 1024)}KB
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* Empty States */}
      {activeTab === 'endpoints' && endpoints?.length === 0 && (
        <div className="text-center py-12">
          <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No API endpoints</h3>
          <p className="text-gray-500 mb-4">Create your first API endpoint to start managing integrations.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Endpoint
          </button>
        </div>
      )}
      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add API Endpoint</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={formData?.name}
                  onChange={(e) => setFormData({...formData, name: e?.target?.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ocean Data Retrieval API"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData?.description}
                  onChange={(e) => setFormData({...formData, description: e?.target?.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="2"
                  placeholder="Retrieve real-time ocean monitoring data"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endpoint URL</label>
                <input
                  type="text"
                  required
                  value={formData?.endpoint_url}
                  onChange={(e) => setFormData({...formData, endpoint_url: e?.target?.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="/api/v1/ocean-data"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
                  <select
                    value={formData?.method}
                    onChange={(e) => setFormData({...formData, method: e?.target?.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                    <option value="PATCH">PATCH</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Integration Type</label>
                  <select
                    value={formData?.integration_type}
                    onChange={(e) => setFormData({...formData, integration_type: e?.target?.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="government">Government</option>
                    <option value="research">Research</option>
                    <option value="satellite">Satellite</option>
                    <option value="api_gateway">API Gateway</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Authentication Type</label>
                <select
                  value={formData?.authentication_type}
                  onChange={(e) => setFormData({...formData, authentication_type: e?.target?.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="bearer_token">Bearer Token</option>
                  <option value="api_key">API Key</option>
                  <option value="oauth2">OAuth 2.0</option>
                  <option value="basic_auth">Basic Auth</option>
                  <option value="none">None</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rate Limit (req/min)</label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={formData?.rate_limit_per_minute}
                    onChange={(e) => setFormData({...formData, rate_limit_per_minute: parseInt(e?.target?.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timeout (seconds)</label>
                  <input
                    type="number"
                    min="1"
                    max="300"
                    value={formData?.timeout_seconds}
                    onChange={(e) => setFormData({...formData, timeout_seconds: parseInt(e?.target?.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Endpoint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default APIManagementSection;
