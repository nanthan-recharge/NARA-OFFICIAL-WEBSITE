import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import {
  marineIncidentsService,
  citizenScienceService,
  marineIncidentDashboardService
} from '../../services/marineIncidentService';

const MarineIncidentAdmin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [incidents, setIncidents] = useState([]);
  const [observations, setObservations] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showTriageModal, setShowTriageModal] = useState(false);
  const [triageForm, setTriageForm] = useState({
    status: '',
    assignedDivision: '',
    assignedTo: '',
    triageNotes: ''
  });

  const [filters, setFilters] = useState({
    incidentType: 'all',
    status: 'all',
    severity: 'all'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [incidentsRes, observationsRes, dashboardRes] = await Promise.all([
      marineIncidentsService.getAll(),
      citizenScienceService.getAll(),
      marineIncidentDashboardService.getStatistics()
    ]);

    if (!incidentsRes.error) setIncidents(incidentsRes.data);
    if (!observationsRes.error) setObservations(observationsRes.data);
    if (!dashboardRes.error) setDashboardData(dashboardRes.data);

    setLoading(false);
  };

  const handleTriage = async (e) => {
    e.preventDefault();

    if (!selectedIncident) return;

    const { error } = await marineIncidentsService.updateStatus(
      selectedIncident.id,
      triageForm.status,
      triageForm.triageNotes,
      triageForm.assignedDivision,
      triageForm.assignedTo
    );

    if (error) {
      alert('Error updating incident status');
      return;
    }

    alert('Incident status updated successfully');
    setShowTriageModal(false);
    setSelectedIncident(null);
    setTriageForm({ status: '', assignedDivision: '', assignedTo: '', triageNotes: '' });
    fetchData();
  };

  const handleVerifyObservation = async (observationId) => {
    const { error } = await citizenScienceService.verify(
      observationId,
      'Admin User',
      'Verified by NARA staff'
    );

    if (error) {
      alert('Error verifying observation');
      return;
    }

    alert('Observation verified successfully');
    fetchData();
  };

  const handleAddResponseUpdate = async (incidentId, updateText) => {
    const { error } = await marineIncidentsService.addResponseUpdate(
      incidentId,
      updateText,
      'Admin User'
    );

    if (error) {
      alert('Error adding update');
      return;
    }

    alert('Update added successfully');
    fetchData();
  };

  const filteredIncidents = incidents.filter(incident => {
    const matchesType = filters.incidentType === 'all' || incident.incidentType === filters.incidentType;
    const matchesStatus = filters.status === 'all' || incident.status === filters.status;
    const matchesSeverity = filters.severity === 'all' || incident.severity === filters.severity;
    return matchesType && matchesStatus && matchesSeverity;
  });

  // Dashboard View
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Icons.AlertTriangle className="w-10 h-10" />
            <span className="text-3xl font-bold">{dashboardData?.overview.totalIncidents}</span>
          </div>
          <h3 className="text-lg font-semibold">Total Incidents</h3>
          <p className="text-sm text-white/80">All time reports</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Icons.Clock className="w-10 h-10" />
            <span className="text-3xl font-bold">{dashboardData?.overview.activeIncidents}</span>
          </div>
          <h3 className="text-lg font-semibold">Active Cases</h3>
          <p className="text-sm text-white/80">Under investigation</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Icons.CheckCircle className="w-10 h-10" />
            <span className="text-3xl font-bold">{dashboardData?.overview.resolvedIncidents}</span>
          </div>
          <h3 className="text-lg font-semibold">Resolved</h3>
          <p className="text-sm text-white/80">Closed cases</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Icons.Eye className="w-10 h-10" />
            <span className="text-3xl font-bold">{dashboardData?.overview.totalObservations}</span>
          </div>
          <h3 className="text-lg font-semibold">Observations</h3>
          <p className="text-sm text-white/80">Citizen science</p>
        </div>
      </div>

      {/* Critical Incidents Alert */}
      {dashboardData?.criticalIncidents.length > 0 && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Icons.AlertTriangle className="w-8 h-8 text-red-600" />
            <h2 className="text-xl font-bold text-red-900">Critical Incidents Requiring Immediate Attention</h2>
          </div>

          <div className="space-y-3">
            {dashboardData.criticalIncidents.map((incident) => (
              <div
                key={incident.id}
                className="bg-white rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                      {incident.incidentId}
                    </span>
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                      {incident.incidentType.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900">{incident.title}</h4>
                  <p className="text-sm text-gray-600">{incident.description}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedIncident(incident);
                    setShowTriageModal(true);
                  }}
                  className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Triage Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Incident Statistics */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Incidents by Type</h3>
          <div className="space-y-3">
            {dashboardData && Object.entries(dashboardData.incidentsByType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-gray-700 capitalize">{type.replace('_', ' ')}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(count / dashboardData.overview.totalIncidents) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Incidents by Status</h3>
          <div className="space-y-3">
            {dashboardData && Object.entries(dashboardData.incidentsByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-gray-700 capitalize">{status.replace('_', ' ')}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        status === 'resolved' ? 'bg-green-600' :
                        status === 'under_investigation' ? 'bg-blue-600' :
                        'bg-yellow-600'
                      }`}
                      style={{ width: `${(count / dashboardData.overview.totalIncidents) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Incidents Management View
  const renderIncidentsManagement = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Filters</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <select
            value={filters.incidentType}
            onChange={(e) => setFilters({ ...filters, incidentType: e.target.value })}
            className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl"
          >
            <option value="all">All Types</option>
            <option value="fish_kill">Fish Kill</option>
            <option value="stranding">Stranding</option>
            <option value="algal_bloom">Algal Bloom</option>
            <option value="pollution">Pollution</option>
            <option value="unusual_behavior">Unusual Behavior</option>
            <option value="other">Other</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl"
          >
            <option value="all">All Statuses</option>
            <option value="reported">Reported</option>
            <option value="under_investigation">Under Investigation</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            value={filters.severity}
            onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
            className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl"
          >
            <option value="all">All Severities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Incident ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Severity</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Reporter</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredIncidents.map((incident) => (
                <tr key={incident.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-blue-600">{incident.incidentId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{incident.title}</div>
                    <div className="text-sm text-gray-600 line-clamp-1">{incident.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      {incident.incidentType.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      incident.severity === 'critical' ? 'bg-red-100 text-red-700' :
                      incident.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                      incident.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {incident.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      incident.status === 'resolved' ? 'bg-green-100 text-green-700' :
                      incident.status === 'under_investigation' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {incident.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{incident.reporterName}</div>
                    <div className="text-xs text-gray-500">{incident.reporterEmail}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {incident.reportedDate && new Date(incident.reportedDate.seconds * 1000).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setSelectedIncident(incident);
                        setTriageForm({
                          status: incident.status,
                          assignedDivision: incident.assignedDivision || '',
                          assignedTo: incident.assignedTo || '',
                          triageNotes: incident.triageNotes || ''
                        });
                        setShowTriageModal(true);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Citizen Science Management View
  const renderObservationsManagement = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {observations.map((obs) => (
          <div key={obs.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {obs.photos && obs.photos.length > 0 && (
              <div className="relative h-48 bg-gradient-to-br from-blue-100 to-cyan-100">
                <img
                  src={obs.photos[0]}
                  alt={obs.species}
                  className="w-full h-full object-cover"
                />
                {obs.verified && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full px-3 py-1 text-xs font-semibold flex items-center space-x-1">
                    <Icons.CheckCircle className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                )}
              </div>
            )}

            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                  {obs.observationType}
                </span>
                <span className="text-sm text-gray-500">
                  {obs.likes || 0} <Icons.Heart className="w-4 h-4 inline" />
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">{obs.species}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{obs.description}</p>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <Icons.User className="w-3 h-3" />
                  <span>{obs.observerName}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icons.Calendar className="w-3 h-3" />
                  <span>{obs.observationDate && new Date(obs.observationDate.seconds * 1000).toLocaleDateString()}</span>
                </div>
              </div>

              {!obs.verified && (
                <button
                  onClick={() => handleVerifyObservation(obs.id)}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Verify Observation
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Triage Modal
  const renderTriageModal = () => (
    <AnimatePresence>
      {showTriageModal && selectedIncident && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowTriageModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-t-3xl z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Incident Triage & Management</h2>
                  <p className="text-blue-100 text-sm mt-1">ID: {selectedIncident.incidentId}</p>
                </div>
                <button
                  onClick={() => setShowTriageModal(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <Icons.X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Incident Details */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{selectedIncident.title}</h3>
                <p className="text-gray-700 mb-4">{selectedIncident.description}</p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-semibold text-gray-600">Type:</span>
                    <p className="text-gray-900 capitalize">{selectedIncident.incidentType.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-600">Severity:</span>
                    <p className="text-gray-900 capitalize">{selectedIncident.severity}</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-600">Reporter:</span>
                    <p className="text-gray-900">{selectedIncident.reporterName}</p>
                    <p className="text-sm text-gray-600">{selectedIncident.reporterEmail}</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-600">Reported:</span>
                    <p className="text-gray-900">
                      {selectedIncident.reportedDate && new Date(selectedIncident.reportedDate.seconds * 1000).toLocaleString()}
                    </p>
                  </div>
                </div>

                {selectedIncident.location && (
                  <div className="mt-4">
                    <span className="text-sm font-semibold text-gray-600">Location:</span>
                    <p className="text-gray-900">
                      Lat: {selectedIncident.location.latitude.toFixed(6)}, Lng: {selectedIncident.location.longitude.toFixed(6)}
                    </p>
                  </div>
                )}
              </div>

              {/* Triage Form */}
              <form onSubmit={handleTriage} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status *</label>
                  <select
                    required
                    value={triageForm.status}
                    onChange={(e) => setTriageForm({ ...triageForm, status: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl"
                  >
                    <option value="">Select status</option>
                    <option value="reported">Reported (Pending Triage)</option>
                    <option value="under_investigation">Under Investigation</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Assign to Division</label>
                  <select
                    value={triageForm.assignedDivision}
                    onChange={(e) => setTriageForm({ ...triageForm, assignedDivision: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl"
                  >
                    <option value="">Select division</option>
                    <option value="marine-biology">Marine Biology & Ecosystems</option>
                    <option value="environmental">Environmental Monitoring & Advisory</option>
                    <option value="fisheries">Marine & Inland Fisheries Science</option>
                    <option value="post-harvest">Post-Harvest & Quality Assurance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Assign to Staff Member</label>
                  <input
                    type="text"
                    value={triageForm.assignedTo}
                    onChange={(e) => setTriageForm({ ...triageForm, assignedTo: e.target.value })}
                    placeholder="Staff name or email"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Triage Notes</label>
                  <textarea
                    value={triageForm.triageNotes}
                    onChange={(e) => setTriageForm({ ...triageForm, triageNotes: e.target.value })}
                    placeholder="Add notes about the incident, response actions, or follow-up required..."
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowTriageModal(false)}
                    className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Update Status
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Icons.Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Marine Incident Admin</h1>
              <p className="text-gray-600 mt-1">Triage and manage marine incidents and citizen science observations</p>
            </div>
            <button
              onClick={() => window.location.href = '/marine-incident-portal'}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View Public Portal
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto py-4">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Icons.LayoutDashboard },
              { id: 'incidents', label: 'Incidents', icon: Icons.AlertTriangle },
              { id: 'observations', label: 'Citizen Science', icon: Icons.Eye }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'incidents' && renderIncidentsManagement()}
            {activeTab === 'observations' && renderObservationsManagement()}
          </motion.div>
        </AnimatePresence>
      </div>

      {renderTriageModal()}
    </div>
  );
};

export default MarineIncidentAdmin;
