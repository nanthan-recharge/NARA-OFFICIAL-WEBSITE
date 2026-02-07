import React, { useState, useEffect } from 'react';
import { emergencyService } from '../../../services/governmentService.js';

const EmergencyResponseSection = () => {
  const [incidents, setIncidents] = useState([]);
  const [activeIncidents, setActiveIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);

  const [formData, setFormData] = useState({
    incident_type: '',
    severity: 'medium',
    location: '',
    description: '',
    response_team: [],
    resources_allocated: {}
  });

  const incidentTypes = [
    'Oil Spill',
    'Marine Wildlife Distress',
    'Vessel Emergency',
    'Coastal Erosion',
    'Pollution Incident',
    'Natural Disaster',
    'Search and Rescue',
    'Infrastructure Failure',
    'Environmental Hazard',
    'Other'
  ];

  const severityLevels = [
    { value: 'low', label: 'Low Priority', color: 'green', icon: '🟢' },
    { value: 'medium', label: 'Medium Priority', color: 'yellow', icon: '🟡' },
    { value: 'high', label: 'High Priority', color: 'orange', icon: '🟠' },
    { value: 'critical', label: 'Critical', color: 'red', icon: '🔴' }
  ];

  const responseTeams = [
    'Coast Guard',
    'Environmental Response Team',
    'Marine Rescue Team',
    'Emergency Medical Services',
    'Fire Department',
    'Local Authorities',
    'Wildlife Rescue Team',
    'Hazmat Team'
  ];

  useEffect(() => {
    loadIncidents();
    loadActiveIncidents();
  }, []);

  const loadIncidents = async () => {
    setLoading(true);
    const { data, error } = await emergencyService?.getUserIncidents();
    if (data) setIncidents(data);
    if (error) console.error('Error loading incidents:', error);
    setLoading(false);
  };

  const loadActiveIncidents = async () => {
    const { data, error } = await emergencyService?.getActiveIncidents();
    if (data) setActiveIncidents(data);
    if (error) console.error('Error loading active incidents:', error);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    const incidentData = {
      ...formData,
      response_team: formData?.response_team,
      resources_allocated: formData?.resources_allocated
    };

    const { data, error } = await emergencyService?.reportIncident(incidentData);
    
    if (error) {
      alert(`Error reporting incident: ${error}`);
      return;
    }
    
    setFormData({
      incident_type: '',
      severity: 'medium',
      location: '',
      description: '',
      response_team: [],
      resources_allocated: {}
    });
    setShowForm(false);
    loadIncidents();
    loadActiveIncidents();
  };

  const handleTeamSelection = (team) => {
    const teams = formData?.response_team?.includes(team)
      ? formData?.response_team?.filter(t => t !== team)
      : [...formData?.response_team, team];
    
    setFormData({ ...formData, response_team: teams });
  };

  const getSeverityColor = (severity) => {
    const level = severityLevels?.find(s => s?.value === severity);
    return level ? level?.color : 'gray';
  };

  const getSeverityIcon = (severity) => {
    const level = severityLevels?.find(s => s?.value === severity);
    return level ? level?.icon : '⚪';
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-red-100 text-red-700',
      monitoring: 'bg-yellow-100 text-yellow-700',
      resolved: 'bg-green-100 text-green-700',
      under_investigation: 'bg-blue-100 text-blue-700'
    };
    return colors?.[status] || colors?.active;
  };

  const getStatusIcon = (status) => {
    const icons = {
      active: '🚨',
      monitoring: '👀',
      resolved: '✅',
      under_investigation: '🔍'
    };
    return icons?.[status] || '🚨';
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[1, 2, 3]?.map(i => (
              <div key={i} className="h-24 bg-gray-100 rounded"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3]?.map(i => (
              <div key={i} className="h-24 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Emergency Response Coordination</h2>
          <p className="text-gray-600 mt-1">Incident reporting, response team management, and multi-channel communications</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          🚨 Report Incident
        </button>
      </div>
      {/* Active Incidents Alert */}
      {activeIncidents?.length > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <span className="text-red-600 text-2xl">🚨</span>
            <div className="flex-1">
              <h3 className="font-semibold text-red-900">Active Emergency Incidents</h3>
              <p className="text-sm text-red-700">
                {activeIncidents?.length} incident{activeIncidents?.length !== 1 ? 's' : ''} requiring immediate attention
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-red-600">{activeIncidents?.length}</p>
              <p className="text-xs text-red-500">ACTIVE</p>
            </div>
          </div>
        </div>
      )}
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Incidents</p>
              <p className="text-2xl font-bold text-gray-900">{incidents?.length}</p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-red-600">
                {incidents?.filter(i => i?.status === 'active')?.length}
              </p>
            </div>
            <div className="text-3xl">🚨</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">
                {incidents?.filter(i => i?.status === 'resolved')?.length}
              </p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical Level</p>
              <p className="text-2xl font-bold text-red-600">
                {incidents?.filter(i => i?.severity === 'critical')?.length}
              </p>
            </div>
            <div className="text-3xl">🔴</div>
          </div>
        </div>
      </div>
      {/* New Incident Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold text-red-900">🚨 Report Emergency Incident</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Incident Type *
                  </label>
                  <select
                    required
                    value={formData?.incident_type}
                    onChange={(e) => setFormData({ ...formData, incident_type: e?.target?.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">Select incident type</option>
                    {incidentTypes?.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Severity Level *
                  </label>
                  <select
                    required
                    value={formData?.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e?.target?.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    {severityLevels?.map((level) => (
                      <option key={level?.value} value={level?.value}>
                        {level?.icon} {level?.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  required
                  value={formData?.location}
                  onChange={(e) => setFormData({ ...formData, location: e?.target?.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Exact location or coordinates"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Incident Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData?.description}
                  onChange={(e) => setFormData({ ...formData, description: e?.target?.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Detailed description of the incident, immediate hazards, and current situation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Response Teams
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {responseTeams?.map((team) => (
                    <label key={team} className="flex items-center space-x-2 p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData?.response_team?.includes(team)}
                        onChange={() => handleTeamSelection(team)}
                        className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                      <span className="text-sm">{team}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  🚨 Report Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Incidents List */}
      <div className="space-y-4">
        {incidents?.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">🚨</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Emergency Incidents</h3>
            <p className="text-gray-600 mb-4">Emergency incidents and response coordination will appear here</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Report First Incident
            </button>
          </div>
        ) : (
          incidents?.map((incident) => (
            <div key={incident?.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl">{getSeverityIcon(incident?.severity)}</span>
                    <h3 className="text-lg font-semibold text-gray-900">{incident?.incident_type}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(incident?.status)}`}>
                      {getStatusIcon(incident?.status)} {incident?.status?.replace('_', ' ')?.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${getSeverityColor(incident?.severity)}-100 text-${getSeverityColor(incident?.severity)}-700`}>
                      {incident?.severity?.toUpperCase()} PRIORITY
                    </span>
                  </div>

                  <p className="text-gray-600 mb-3">{incident?.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                    <div>
                      <span className="font-medium text-gray-700">Location:</span>
                      <p className="text-gray-600">{incident?.location}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Reported:</span>
                      <p className="text-gray-600">
                        {getTimeAgo(incident?.reported_at)} ({new Date(incident.reported_at)?.toLocaleDateString()})
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Response Time:</span>
                      <p className="text-gray-600">
                        {incident?.resolved_at 
                          ? `${Math.ceil((new Date(incident.resolved_at) - new Date(incident.reported_at)) / (1000 * 60))} minutes`
                          : 'Ongoing'
                        }
                      </p>
                    </div>
                  </div>

                  {incident?.response_team && Array.isArray(incident?.response_team) && incident?.response_team?.length > 0 && (
                    <div className="mb-3">
                      <span className="font-medium text-gray-700 text-sm">Response Teams: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {incident?.response_team?.map((team, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                            {team}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {incident?.resources_allocated && Object.keys(incident?.resources_allocated)?.length > 0 && (
                    <div className="mb-3">
                      <span className="font-medium text-gray-700 text-sm">Resources Allocated:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {Object.entries(incident?.resources_allocated)?.map(([key, value]) => (
                          <span key={key} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            {key}: {Array.isArray(value) ? value?.join(', ') : value}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => setSelectedIncident(incident)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
                  >
                    View Details
                  </button>
                  
                  {incident?.status === 'active' && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded text-center animate-pulse">
                      ACTIVE
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Incident Detail Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{getSeverityIcon(selectedIncident?.severity)}</span>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedIncident?.incident_type}</h3>
                    <p className="text-sm text-gray-600">{selectedIncident?.location}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedIncident(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Status</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedIncident?.status)}`}>
                    {getStatusIcon(selectedIncident?.status)} {selectedIncident?.status?.replace('_', ' ')?.toUpperCase()}
                  </span>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Priority Level</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${getSeverityColor(selectedIncident?.severity)}-100 text-${getSeverityColor(selectedIncident?.severity)}-700`}>
                    {getSeverityIcon(selectedIncident?.severity)} {selectedIncident?.severity?.toUpperCase()}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Incident Description</h4>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{selectedIncident?.description}</p>
              </div>

              {selectedIncident?.response_team && Array.isArray(selectedIncident?.response_team) && selectedIncident?.response_team?.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Response Teams Deployed</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedIncident?.response_team?.map((team, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <span className="text-blue-600">👥</span>
                        <span className="text-blue-800 font-medium">{team}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedIncident?.resources_allocated && Object.keys(selectedIncident?.resources_allocated)?.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Resources Allocated</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    {Object.entries(selectedIncident?.resources_allocated)?.map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="font-medium text-gray-700 capitalize">{key?.replace('_', ' ')}:</span>
                        <span className="text-gray-600">
                          {Array.isArray(value) ? value?.join(', ') : value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedIncident?.resolution_notes && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Resolution Notes</h4>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800">{selectedIncident?.resolution_notes}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Reported At</h4>
                  <p className="text-gray-600">
                    {new Date(selectedIncident.reported_at)?.toLocaleString()}
                    <span className="text-sm text-gray-500 block">({getTimeAgo(selectedIncident?.reported_at)})</span>
                  </p>
                </div>
                
                {selectedIncident?.resolved_at && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Resolved At</h4>
                    <p className="text-green-600">
                      {new Date(selectedIncident.resolved_at)?.toLocaleString()}
                      <span className="text-sm text-green-500 block">
                        (Duration: {Math.ceil((new Date(selectedIncident.resolved_at) - new Date(selectedIncident.reported_at)) / (1000 * 60))} minutes)
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyResponseSection;