import React, { useState, useEffect } from 'react';
import { 
  Satellite, 
  Plus, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Play, 
  Pause, 
  Activity,
  Image,
  MapPin,
  Zap,
  TrendingUp,
  Filter,
  Calendar,
  Download
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { satelliteDataService } from '../../../services/integrationService';

const SatelliteDataSection = () => {
  const [dataSources, setDataSources] = useState([]);
  const [processingJobs, setProcessingJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('sources');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState('source'); // 'source' or 'job'
  const [formData, setFormData] = useState({
    satellite_name: '',
    satellite_type: 'earth_observation',
    operator_organization: '',
    data_feed_url: '',
    api_endpoint: '',
    resolution_meters: '',
    coverage_area: '',
    update_frequency_minutes: 60
  });

  const [jobFormData, setJobFormData] = useState({
    job_name: '',
    data_source_id: '',
    processing_type: '',
    input_parameters: {}
  });
  const { t } = useTranslation('integration');
  const strings = t('satellite', { returnObjects: true });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sourcesData, jobsData] = await Promise.all([
        satelliteDataService?.getAllSources(),
        satelliteDataService?.getProcessingJobs()
      ]);
      setDataSources(sourcesData || []);
      setProcessingJobs(jobsData || []);
    } catch (error) {
      console.error('Error loading satellite data:', error);
      setDataSources([]);
      setProcessingJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSource = async (e) => {
    e?.preventDefault();
    try {
      // Create new data source logic would go here
      console.log('Creating data source:', formData);
      resetForms();
      loadData();
    } catch (error) {
      console.error('Error creating data source:', error);
    }
  };

  const handleSubmitJob = async (e) => {
    e?.preventDefault();
    try {
      await satelliteDataService?.createProcessingJob(jobFormData);
      resetForms();
      loadData();
    } catch (error) {
      console.error('Error creating processing job:', error);
    }
  };

  const resetForms = () => {
    setFormData({
      satellite_name: '',
      satellite_type: 'earth_observation',
      operator_organization: '',
      data_feed_url: '',
      api_endpoint: '',
      resolution_meters: '',
      coverage_area: '',
      update_frequency_minutes: 60
    });
    setJobFormData({
      job_name: '',
      data_source_id: '',
      processing_type: '',
      input_parameters: {}
    });
    setShowAddModal(false);
  };

  const updateJobStatus = async (id, status) => {
    try {
      await satelliteDataService?.updateProcessingStatus(id, status);
      loadData();
    } catch (error) {
      console.error('Error updating job status:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': case'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <Activity className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'queued':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSatelliteTypeIcon = (type) => {
    switch (type) {
      case 'earth_observation':
        return <MapPin className="w-4 h-4 text-green-600" />;
      case 'weather':
        return <Activity className="w-4 h-4 text-blue-600" />;
      case 'communication':
        return <Zap className="w-4 h-4 text-purple-600" />;
      case 'scientific':
        return <TrendingUp className="w-4 h-4 text-indigo-600" />;
      default:
        return <Satellite className="w-4 h-4 text-gray-600" />;
    }
  };

  const getSatelliteTypeBadge = (type) => {
    const colors = {
      'earth_observation': 'bg-green-100 text-green-800',
      'weather': 'bg-blue-100 text-blue-800',
      'communication': 'bg-purple-100 text-purple-800',
      'scientific': 'bg-indigo-100 text-indigo-800',
      'navigation': 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors?.[type] || colors?.earth_observation}`}>
        {getSatelliteTypeIcon(type)}
        <span className="ml-1">{type?.replace('_', ' ')?.toUpperCase()}</span>
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
          <Satellite className="w-6 h-6 text-blue-600 mr-3" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{strings?.title}</h2>
            <p className="text-sm text-gray-600">{strings?.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setModalType('job');
              setShowAddModal(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Play className="w-4 h-4 mr-2" />
            {strings?.actions?.newJob}
          </button>
          <button
            onClick={() => {
              setModalType('source');
              setShowAddModal(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            {strings?.actions?.addSource}
          </button>
        </div>
      </div>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center">
            <Satellite className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-blue-600 font-medium">Data Sources</p>
              <p className="text-2xl font-bold text-blue-900">{dataSources?.length || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-green-600 font-medium">Active Sources</p>
              <p className="text-2xl font-bold text-green-900">
                {dataSources?.filter(s => s?.connection_status === 'active')?.length || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center">
            <Play className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-purple-600 font-medium">Processing Jobs</p>
              <p className="text-2xl font-bold text-purple-900">{processingJobs?.length || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm text-yellow-600 font-medium">Completed Jobs</p>
              <p className="text-2xl font-bold text-yellow-900">
                {processingJobs?.filter(j => j?.processing_status === 'completed')?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('sources')}
            className={`${
              activeTab === 'sources' ?'border-blue-500 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <Satellite className="w-4 h-4 mr-2" />
            Data Sources ({dataSources?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`${
              activeTab === 'jobs' ?'border-blue-500 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <Play className="w-4 h-4 mr-2" />
            Processing Jobs ({processingJobs?.length || 0})
          </button>
        </nav>
      </div>
      {/* Data Sources Tab */}
      {activeTab === 'sources' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {dataSources?.map((source) => (
            <div key={source?.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    {getStatusIcon(source?.connection_status)}
                    <h3 className="text-lg font-semibold text-gray-900 ml-2">{source?.satellite_name}</h3>
                  </div>
                  <div className="flex items-center space-x-2 mb-3">
                    {getSatelliteTypeBadge(source?.satellite_type)}
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{source?.operator_organization}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                {source?.resolution_meters && (
                  <p className="flex items-center">
                    <Image className="w-3 h-3 mr-2" />
                    Resolution: {source?.resolution_meters}m
                  </p>
                )}
                {source?.coverage_area && (
                  <p className="flex items-center">
                    <MapPin className="w-3 h-3 mr-2" />
                    Coverage: {source?.coverage_area}
                  </p>
                )}
                <p className="flex items-center">
                  <Clock className="w-3 h-3 mr-2" />
                  Updates: Every {source?.update_frequency_minutes || 60}min
                </p>
                {source?.last_data_received_at && (
                  <p className="flex items-center">
                    <Activity className="w-3 h-3 mr-2" />
                    Last data: {new Date(source.last_data_received_at)?.toLocaleString()}
                  </p>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    Processing jobs: {source?.processing_jobs?.length || 0}
                  </p>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors" title="View Details">
                      <Filter className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-green-600 transition-colors" title="Download Data">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Processing Jobs Tab */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          {processingJobs?.map((job) => (
            <div key={job?.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    {getStatusIcon(job?.processing_status)}
                    <h3 className="text-lg font-semibold text-gray-900 ml-2">{job?.job_name}</h3>
                    <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      job?.processing_status === 'completed' ? 'bg-green-100 text-green-800' :
                      job?.processing_status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      job?.processing_status === 'error'? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {job?.processing_status?.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <p className="flex items-center">
                      <Satellite className="w-3 h-3 mr-1" />
                      {job?.data_source?.satellite_name}
                    </p>
                    <p className="flex items-center">
                      <Play className="w-3 h-3 mr-1" />
                      {job?.processing_type}
                    </p>
                    {job?.started_at && (
                      <p className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Started: {new Date(job.started_at)?.toLocaleDateString()}
                      </p>
                    )}
                    {job?.processing_time_seconds && (
                      <p className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Duration: {job?.processing_time_seconds}s
                      </p>
                    )}
                  </div>

                  {job?.error_message && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                      <p className="text-sm text-red-800">{job?.error_message}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {job?.processing_status === 'queued' && (
                    <button
                      onClick={() => updateJobStatus(job?.id, 'processing')}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 transition-colors"
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Start
                    </button>
                  )}
                  {job?.processing_status === 'processing' && (
                    <button
                      onClick={() => updateJobStatus(job?.id, 'paused')}
                      className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs hover:bg-yellow-200 transition-colors"
                    >
                      <Pause className="w-3 h-3 mr-1" />
                      Pause
                    </button>
                  )}
                  {job?.processing_status === 'completed' && job?.output_file_path && (
                    <button className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs hover:bg-green-200 transition-colors">
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Empty States */}
      {activeTab === 'sources' && dataSources?.length === 0 && (
        <div className="text-center py-12">
          <Satellite className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No satellite data sources</h3>
          <p className="text-gray-500 mb-4">Add your first satellite data source to begin processing.</p>
          <button
            onClick={() => {
              setModalType('source');
              setShowAddModal(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Data Source
          </button>
        </div>
      )}
      {activeTab === 'jobs' && processingJobs?.length === 0 && (
        <div className="text-center py-12">
          <Play className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No processing jobs</h3>
          <p className="text-gray-500 mb-4">Create your first processing job to analyze satellite data.</p>
          <button
            onClick={() => {
              setModalType('job');
              setShowAddModal(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Play className="w-4 h-4 mr-2" />
            Create Processing Job
          </button>
        </div>
      )}
      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {modalType === 'source' ? 'Add Satellite Data Source' : 'Create Processing Job'}
            </h3>
            
            {modalType === 'source' ? (
              <form onSubmit={handleSubmitSource} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Satellite Name</label>
                  <input
                    type="text"
                    required
                    value={formData?.satellite_name}
                    onChange={(e) => setFormData({...formData, satellite_name: e?.target?.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Landsat 9"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Satellite Type</label>
                  <select
                    value={formData?.satellite_type}
                    onChange={(e) => setFormData({...formData, satellite_type: e?.target?.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="earth_observation">Earth Observation</option>
                    <option value="weather">Weather</option>
                    <option value="communication">Communication</option>
                    <option value="navigation">Navigation</option>
                    <option value="scientific">Scientific</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Operator Organization</label>
                  <input
                    type="text"
                    required
                    value={formData?.operator_organization}
                    onChange={(e) => setFormData({...formData, operator_organization: e?.target?.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="NASA/USGS"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data Feed URL</label>
                  <input
                    type="url"
                    required
                    value={formData?.data_feed_url}
                    onChange={(e) => setFormData({...formData, data_feed_url: e?.target?.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://landsat.usgs.gov/api/data-feed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Resolution (m)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData?.resolution_meters}
                      onChange={(e) => setFormData({...formData, resolution_meters: parseFloat(e?.target?.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="30.0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Update Freq (min)</label>
                    <input
                      type="number"
                      min="1"
                      value={formData?.update_frequency_minutes}
                      onChange={(e) => setFormData({...formData, update_frequency_minutes: parseInt(e?.target?.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coverage Area</label>
                  <input
                    type="text"
                    value={formData?.coverage_area}
                    onChange={(e) => setFormData({...formData, coverage_area: e?.target?.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Global"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForms}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Source
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmitJob} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Name</label>
                  <input
                    type="text"
                    required
                    value={jobFormData?.job_name}
                    onChange={(e) => setJobFormData({...jobFormData, job_name: e?.target?.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ocean Color Analysis - Pacific"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data Source</label>
                  <select
                    required
                    value={jobFormData?.data_source_id}
                    onChange={(e) => setJobFormData({...jobFormData, data_source_id: e?.target?.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a data source</option>
                    {dataSources?.map((source) => (
                      <option key={source?.id} value={source?.id}>
                        {source?.satellite_name} - {source?.operator_organization}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Processing Type</label>
                  <select
                    required
                    value={jobFormData?.processing_type}
                    onChange={(e) => setJobFormData({...jobFormData, processing_type: e?.target?.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select processing type</option>
                    <option value="Ocean Color Detection">Ocean Color Detection</option>
                    <option value="Land Use Classification">Land Use Classification</option>
                    <option value="Change Detection Algorithm">Change Detection Algorithm</option>
                    <option value="Vegetation Index Analysis">Vegetation Index Analysis</option>
                    <option value="Water Quality Assessment">Water Quality Assessment</option>
                    <option value="Climate Pattern Recognition">Climate Pattern Recognition</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForms}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Create Job
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SatelliteDataSection;
