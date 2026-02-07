import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import {
  eiaService,
  licensingService,
  complianceService,
  emergencyService,
  collaborationService,
  dashboardService
} from '../../services/governmentService';

const GovernmentServicesAdmin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eiaApplications, setEiaApplications] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [complianceRecords, setComplianceRecords] = useState([]);
  const [emergencyIncidents, setEmergencyIncidents] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, eiaData, licenseData, complianceData, emergencyData, workspaceData] = await Promise.all([
        dashboardService.getStatistics(),
        eiaService.getAll({ limit: 100 }),
        licensingService.getAll({ limit: 100 }),
        complianceService.getRecords({ limit: 100 }),
        emergencyService.getIncidents({ limit: 100 }),
        collaborationService.getAll({ limit: 100 })
      ]);

      setStats(statsData.data);
      setEiaApplications(eiaData.data || []);
      setLicenses(licenseData.data || []);
      setComplianceRecords(complianceData.data || []);
      setEmergencyIncidents(emergencyData.data || []);
      setWorkspaces(workspaceData.data || []);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveEIA = async (eiaId) => {
    try {
      await eiaService.update(eiaId, { status: 'approved', approvedAt: new Date() });
      loadDashboardData();
      alert('EIA application approved successfully');
    } catch (error) {
      console.error('Error approving EIA:', error);
      alert('Failed to approve EIA application');
    }
  };

  const handleRejectEIA = async (eiaId) => {
    try {
      await eiaService.update(eiaId, { status: 'rejected', rejectedAt: new Date() });
      loadDashboardData();
      alert('EIA application rejected');
    } catch (error) {
      console.error('Error rejecting EIA:', error);
      alert('Failed to reject EIA application');
    }
  };

  const handleApproveLicense = async (licenseId) => {
    try {
      const licenseNumber = `LIC-${Date.now()}`;
      await licensingService.update(licenseId, {
        status: 'active',
        licenseNumber,
        issuedAt: new Date(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
      });
      loadDashboardData();
      alert(`License approved. License Number: ${licenseNumber}`);
    } catch (error) {
      console.error('Error approving license:', error);
      alert('Failed to approve license');
    }
  };

  const handleResolveEmergency = async (incidentId) => {
    try {
      await emergencyService.update(incidentId, {
        status: 'resolved',
        resolvedAt: new Date()
      });
      loadDashboardData();
      alert('Emergency incident resolved');
    } catch (error) {
      console.error('Error resolving emergency:', error);
      alert('Failed to resolve emergency incident');
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Government Services Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <Icons.FileText className="w-8 h-8 text-blue-500" />
            <span className="text-3xl font-bold">{stats?.eia?.total || 0}</span>
          </div>
          <h3 className="font-semibold">EIA Applications</h3>
          <p className="text-sm text-gray-600">Pending: {stats?.eia?.pending || 0}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <Icons.Award className="w-8 h-8 text-cyan-500" />
            <span className="text-3xl font-bold">{stats?.licenses?.total || 0}</span>
          </div>
          <h3 className="font-semibold">Licenses</h3>
          <p className="text-sm text-gray-600">Pending: {stats?.licenses?.pending || 0}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <Icons.CheckCircle className="w-8 h-8 text-green-500" />
            <span className="text-3xl font-bold">{stats?.compliance?.total || 0}</span>
          </div>
          <h3 className="font-semibold">Compliance Records</h3>
          <p className="text-sm text-gray-600">Non-Compliant: {stats?.compliance?.nonCompliant || 0}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <Icons.AlertTriangle className="w-8 h-8 text-red-500" />
            <span className="text-3xl font-bold">{stats?.emergencies?.active || 0}</span>
          </div>
          <h3 className="font-semibold">Active Emergencies</h3>
          <p className="text-sm text-gray-600">Require attention</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent EIA Applications */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Recent EIA Applications</h3>
          <div className="space-y-3">
            {eiaApplications.slice(0, 5).map((app) => (
              <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{app.projectName}</p>
                  <p className="text-sm text-gray-600">{app.projectType}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  app.status === 'approved' ? 'bg-green-100 text-green-700' :
                  app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {app.status}
                </span>
              </div>
            ))}
            {eiaApplications.length === 0 && (
              <p className="text-center text-gray-500 py-8">No EIA applications</p>
            )}
          </div>
        </div>

        {/* Active Emergencies */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Active Emergencies</h3>
          <div className="space-y-3">
            {emergencyIncidents.filter(i => i.status === 'active').slice(0, 5).map((incident) => (
              <div key={incident.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{incident.title}</p>
                    <p className="text-sm text-gray-600">{incident.location}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    incident.severity === 'critical' ? 'bg-red-500 text-white' :
                    incident.severity === 'high' ? 'bg-orange-500 text-white' :
                    'bg-yellow-500 text-black'
                  }`}>
                    {incident.severity}
                  </span>
                </div>
              </div>
            ))}
            {emergencyIncidents.filter(i => i.status === 'active').length === 0 && (
              <p className="text-center text-gray-500 py-8">No active emergencies</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderEIAManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">EIA Applications Management</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">
            Filter: All
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {eiaApplications.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium">{app.projectName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {app.projectType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {app.applicantName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    app.status === 'approved' ? 'bg-green-100 text-green-700' :
                    app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {app.status === 'submitted' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveEIA(app.id)}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectEIA(app.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {app.status !== 'submitted' && (
                    <button className="text-blue-500 hover:underline">View Details</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {eiaApplications.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No EIA applications found
          </div>
        )}
      </div>
    </div>
  );

  const renderLicenseManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">License Management</h2>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">License Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Holder</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expires</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {licenses.map((license) => (
              <tr key={license.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                  {license.licenseNumber || 'Pending'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {license.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {license.holderName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    license.status === 'active' ? 'bg-green-100 text-green-700' :
                    license.status === 'expired' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {license.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {license.expiresAt ? new Date(license.expiresAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {license.status === 'pending' && (
                    <button
                      onClick={() => handleApproveLicense(license.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Approve & Issue
                    </button>
                  )}
                  {license.status !== 'pending' && (
                    <button className="text-blue-500 hover:underline">View Details</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {licenses.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No licenses found
          </div>
        )}
      </div>
    </div>
  );

  const renderComplianceManagement = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Compliance Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <Icons.CheckCircle className="w-8 h-8 text-green-500" />
            <span className="text-3xl font-bold text-green-700">{stats?.compliance?.compliant || 0}</span>
          </div>
          <p className="font-semibold mt-2">Compliant</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <Icons.XCircle className="w-8 h-8 text-red-500" />
            <span className="text-3xl font-bold text-red-700">{stats?.compliance?.nonCompliant || 0}</span>
          </div>
          <p className="font-semibold mt-2">Non-Compliant</p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <Icons.Clock className="w-8 h-8 text-yellow-500" />
            <span className="text-3xl font-bold text-yellow-700">{stats?.compliance?.pending || 0}</span>
          </div>
          <p className="font-semibold mt-2">Pending Review</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-lg mb-4">Recent Compliance Records</h3>
        <div className="space-y-3">
          {complianceRecords.slice(0, 10).map((record) => (
            <div key={record.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium">{record.entityName}</p>
                <p className="text-sm text-gray-600">{record.type}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                record.status === 'compliant' ? 'bg-green-100 text-green-700' :
                record.status === 'non-compliant' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {record.status}
              </span>
            </div>
          ))}
          {complianceRecords.length === 0 && (
            <p className="text-center text-gray-500 py-8">No compliance records</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderEmergencyManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Emergency Incident Management</h2>
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-semibold">
          Active Incidents: {emergencyIncidents.filter(i => i.status === 'active').length}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-lg mb-4">Active Incidents</h3>
        <div className="space-y-4">
          {emergencyIncidents.filter(i => i.status === 'active').map((incident) => (
            <div key={incident.id} className="border border-red-300 bg-red-50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      incident.severity === 'critical' ? 'bg-red-500 text-white' :
                      incident.severity === 'high' ? 'bg-orange-500 text-white' :
                      'bg-yellow-500 text-black'
                    }`}>
                      {incident.severity}
                    </span>
                    <span className="text-sm text-gray-600">{incident.location}</span>
                  </div>
                  <h4 className="font-semibold text-lg">{incident.title}</h4>
                  <p className="text-gray-700 mt-1">{incident.description}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleResolveEmergency(incident.id)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Mark as Resolved
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  View Details
                </button>
              </div>
            </div>
          ))}
          {emergencyIncidents.filter(i => i.status === 'active').length === 0 && (
            <div className="text-center py-12">
              <Icons.CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600">No active emergencies</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-lg mb-4">Resolved Incidents</h3>
        <div className="space-y-3">
          {emergencyIncidents.filter(i => i.status === 'resolved').slice(0, 5).map((incident) => (
            <div key={incident.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{incident.title}</p>
                <p className="text-sm text-gray-600">{incident.location}</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                Resolved
              </span>
            </div>
          ))}
          {emergencyIncidents.filter(i => i.status === 'resolved').length === 0 && (
            <p className="text-center text-gray-500 py-8">No resolved incidents</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderCollaborationManagement = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Inter-Agency Collaboration</h2>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-lg mb-4">Active Workspaces</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workspaces.map((workspace) => (
            <div key={workspace.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-all">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-lg">{workspace.name}</h4>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                  {workspace.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{workspace.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icons.Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{workspace.members?.length || 0} members</span>
                </div>
                <button className="text-blue-500 hover:underline text-sm">
                  Manage
                </button>
              </div>
            </div>
          ))}
          {workspaces.length === 0 && (
            <div className="col-span-2 text-center py-12 text-gray-500">
              No workspaces found
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'eia':
        return renderEIAManagement();
      case 'licenses':
        return renderLicenseManagement();
      case 'compliance':
        return renderComplianceManagement();
      case 'emergency':
        return renderEmergencyManagement();
      case 'collaboration':
        return renderCollaborationManagement();
      default:
        return renderDashboard();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Icons.Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-lg">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Government Services Admin</h1>
          <p className="text-gray-600 mt-1">Manage EIA, licenses, compliance, and emergency response</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-4 font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icons.LayoutDashboard className="w-5 h-5 inline-block mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('eia')}
              className={`px-6 py-4 font-medium transition-all ${
                activeTab === 'eia'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icons.FileText className="w-5 h-5 inline-block mr-2" />
              EIA Management
            </button>
            <button
              onClick={() => setActiveTab('licenses')}
              className={`px-6 py-4 font-medium transition-all ${
                activeTab === 'licenses'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icons.Award className="w-5 h-5 inline-block mr-2" />
              Licenses
            </button>
            <button
              onClick={() => setActiveTab('compliance')}
              className={`px-6 py-4 font-medium transition-all ${
                activeTab === 'compliance'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icons.CheckCircle className="w-5 h-5 inline-block mr-2" />
              Compliance
            </button>
            <button
              onClick={() => setActiveTab('emergency')}
              className={`px-6 py-4 font-medium transition-all ${
                activeTab === 'emergency'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icons.AlertTriangle className="w-5 h-5 inline-block mr-2" />
              Emergency
            </button>
            <button
              onClick={() => setActiveTab('collaboration')}
              className={`px-6 py-4 font-medium transition-all ${
                activeTab === 'collaboration'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icons.Users className="w-5 h-5 inline-block mr-2" />
              Collaboration
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default GovernmentServicesAdmin;
