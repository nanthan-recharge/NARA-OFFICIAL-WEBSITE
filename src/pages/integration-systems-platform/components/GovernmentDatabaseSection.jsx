import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Plus, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Settings,
  Trash2,
  Edit,
  Activity,
  Globe,
  Shield,
  Zap
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { governmentConnectionsService } from '../../../services/integrationService';

const GovernmentDatabaseSection = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingConnection, setEditingConnection] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    connection_url: '',
    data_format: 'json',
    security_level: 'internal',
    sync_frequency_hours: 24
  });
  const { t } = useTranslation('integration');
  const common = t('common', { returnObjects: true });
  const strings = t('government', { returnObjects: true });

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    try {
      const data = await governmentConnectionsService?.getAll();
      setConnections(data || []);
    } catch (error) {
      console.error('Error loading connections:', error);
      setConnections([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    try {
      if (editingConnection) {
        // Update existing connection logic would go here
        console.log('Updating connection:', formData);
      } else {
        await governmentConnectionsService?.create(formData);
      }
      
      setFormData({
        name: '',
        description: '',
        connection_url: '',
        data_format: 'json',
        security_level: 'internal',
        sync_frequency_hours: 24
      });
      setShowAddModal(false);
      setEditingConnection(null);
      loadConnections();
    } catch (error) {
      console.error('Error saving connection:', error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await governmentConnectionsService?.updateStatus(id, newStatus);
      loadConnections();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this connection?')) {
      try {
        await governmentConnectionsService?.delete(id);
        loadConnections();
      } catch (error) {
        console.error('Error deleting connection:', error);
      }
    }
  };

  const getStatusIcon = (status) => {
    const normalized = (status || '').toLowerCase();
    const labels = t('common.statuses', { returnObjects: true });
    const options = {
      active: { Icon: CheckCircle, className: 'text-green-500' },
      error: { Icon: AlertCircle, className: 'text-red-500' },
      maintenance: { Icon: Clock, className: 'text-yellow-500' },
      inactive: { Icon: Activity, className: 'text-gray-500' },
      pending: { Icon: Clock, className: 'text-blue-500' }
    };
    const { Icon, className } = options[normalized] || options.pending;
    const label =
      labels?.[normalized] ||
      labels?.default ||
      normalized.toUpperCase();

    return (
      <span className="inline-flex items-center justify-center rounded-full bg-slate-100 p-1.5" title={label} aria-label={label}>
        <Icon className={`h-4 w-4 ${className}`} />
      </span>
    );
  };

  const getSecurityBadge = (level) => {
    const colors = {
      'public': 'bg-green-100 text-green-800',
      'internal': 'bg-blue-100 text-blue-800',
      'confidential': 'bg-yellow-100 text-yellow-800',
      'classified': 'bg-red-100 text-red-800'
    };
    const securityLabels = t('common.securityLevels', { returnObjects: true });
    const label =
      securityLabels?.[level] ||
      securityLabels?.default ||
      level?.toUpperCase();
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors?.[level] || colors?.internal}`}>
        <Shield className="w-3 h-3 mr-1" />
        {label}
      </span>
    );
  };

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
          <Database className="w-6 h-6 text-blue-600 mr-3" />
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
          {strings?.actions?.add}
        </button>
      </div>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center">
            <Globe className="w-8 h-8 text-blue-600 mr-3" />
              <div>
              <p className="text-sm text-blue-600 font-medium">{strings?.stats?.total}</p>
              <p className="text-2xl font-bold text-blue-900">{connections?.length || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-green-600 font-medium">{strings?.stats?.active}</p>
              <p className="text-2xl font-bold text-green-900">
                {connections?.filter(c => c?.connection_status === 'active')?.length || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm text-yellow-600 font-medium">{strings?.stats?.pending}</p>
              <p className="text-2xl font-bold text-yellow-900">
                {connections?.filter(c => c?.connection_status === 'pending')?.length || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center">
            <Zap className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-purple-600 font-medium">{strings?.stats?.formats}</p>
              <p className="text-2xl font-bold text-purple-900">
                {[...new Set(connections?.map(c => c?.data_format))]?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Connections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {connections?.map((connection) => (
          <div key={connection?.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  {getStatusIcon(connection?.connection_status)}
                  <h3 className="text-lg font-semibold text-gray-900 ml-2">{connection?.name}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-3">{connection?.description}</p>
                <div className="flex items-center space-x-3 text-xs">
                  {getSecurityBadge(connection?.security_level)}
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {connection?.data_format?.toUpperCase()}
                  </span>
                  <span className="text-gray-500">
                    {t('common.labels.syncShort', { value: connection?.sync_frequency_hours })}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => {
                    setEditingConnection(connection);
                    setFormData({
                      name: connection?.name,
                      description: connection?.description || '',
                      connection_url: connection?.connection_url,
                      data_format: connection?.data_format,
                      security_level: connection?.security_level,
                      sync_frequency_hours: connection?.sync_frequency_hours
                    });
                    setShowAddModal(true);
                  }}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  title={strings?.actions?.edit}
                  aria-label={strings?.actions?.edit}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(connection?.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title={strings?.actions?.delete}
                  aria-label={strings?.actions?.delete}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between text-sm">
                <div className="text-gray-500">
                  <p>
                    {strings?.labels?.url}{' '}
                    {connection?.connection_url}
                  </p>
                  {connection?.last_sync_at && (
                    <p className="mt-1">
                      {strings?.labels?.lastSync}{' '}
                      {new Date(connection.last_sync_at)?.toLocaleDateString()}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {connection?.connection_status === 'active' && (
                    <button
                      onClick={() => handleStatusChange(connection?.id, 'inactive')}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs hover:bg-red-200 transition-colors"
                    >
                      {strings?.actions?.deactivate}
                    </button>
                  )}
                  {connection?.connection_status === 'inactive' && (
                    <button
                      onClick={() => handleStatusChange(connection?.id, 'active')}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs hover:bg-green-200 transition-colors"
                    >
                      {strings?.actions?.activate}
                    </button>
                  )}
                  <button
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title={strings?.actions?.configure}
                    aria-label={strings?.actions?.configure}
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {connections?.length === 0 && (
        <div className="text-center py-12">
          <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{strings?.empty?.title}</h3>
          <p className="text-gray-500 mb-4">{strings?.empty?.description}</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            {strings?.empty?.cta}
          </button>
        </div>
      )}
      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingConnection ? strings?.modal?.editTitle : strings?.modal?.createTitle}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {common?.fields?.name}
                </label>
                <input
                  type="text"
                  required
                  value={formData?.name}
                  onChange={(e) => setFormData({...formData, name: e?.target?.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={strings?.modal?.placeholders?.name}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {common?.fields?.description}
                </label>
                <textarea
                  value={formData?.description}
                  onChange={(e) => setFormData({...formData, description: e?.target?.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder={strings?.modal?.placeholders?.description}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {common?.fields?.apiUrl}
                </label>
                <input
                  type="url"
                  required
                  value={formData?.connection_url}
                  onChange={(e) => setFormData({...formData, connection_url: e?.target?.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={strings?.modal?.placeholders?.apiUrl}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {common?.fields?.dataFormat}
                  </label>
                  <select
                    value={formData?.data_format}
                    onChange={(e) => setFormData({...formData, data_format: e?.target?.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="json">{common?.dataFormats?.json}</option>
                    <option value="xml">{common?.dataFormats?.xml}</option>
                    <option value="csv">{common?.dataFormats?.csv}</option>
                    <option value="binary">{common?.dataFormats?.binary}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {common?.fields?.securityLevel}
                  </label>
                  <select
                    value={formData?.security_level}
                    onChange={(e) => setFormData({...formData, security_level: e?.target?.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="public">{common?.securityLevels?.public}</option>
                    <option value="internal">{common?.securityLevels?.internal}</option>
                    <option value="confidential">{common?.securityLevels?.confidential}</option>
                    <option value="classified">{common?.securityLevels?.classified}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {strings?.modal?.fields?.syncFrequency}
                </label>
                <input
                  type="number"
                  min="1"
                  max="168"
                  value={formData?.sync_frequency_hours}
                  onChange={(e) => setFormData({...formData, sync_frequency_hours: parseInt(e?.target?.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingConnection(null);
                    setFormData({
                      name: '',
                      description: '',
                      connection_url: '',
                      data_format: 'json',
                      security_level: 'internal',
                      sync_frequency_hours: 24
                    });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {common?.actions?.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingConnection ? strings?.modal?.actions?.update : strings?.modal?.actions?.create}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GovernmentDatabaseSection;
