import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import {
  eiaService,
  licensingService,
  complianceService,
  emergencyService,
  collaborationService,
  rtiRequestService,
  dashboardService
} from '../../services/governmentService';

const SERVICE_TABS = ['dashboard', 'rti', 'eia', 'licenses', 'compliance', 'emergency', 'collaboration'];

const getInitialTab = () => {
  if (typeof window === 'undefined') return 'dashboard';
  const hashTab = window.location.hash.replace('#', '');
  return SERVICE_TABS.includes(hashTab) ? hashTab : 'dashboard';
};

const formatDate = (value) => {
  const date = value?.toDate?.() || (value instanceof Date ? value : typeof value === 'string' ? new Date(value) : null);
  if (!date || Number.isNaN(date.getTime())) return 'Not recorded';
  return date.toLocaleString('en-LK', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
};

const getStatusClasses = (status) => {
  switch (status) {
    case 'responded':
    case 'closed':
      return 'bg-green-100 text-green-700';
    case 'in_review':
      return 'bg-blue-100 text-blue-700';
    case 'awaiting_clarification':
      return 'bg-amber-100 text-amber-800';
    case 'rejected':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
};

const getRequestSummary = (request) => {
  const fields = request.fields || {};
  const group = fields.details_about_information_requested || {};
  return (
    group.specific_information ||
    group.time_period ||
    fields.summary_of_information ||
    request.content?.summary_of_information ||
    request.formName ||
    'RTI online request'
  );
};

const GovernmentServicesAdmin = () => {
  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eiaApplications, setEiaApplications] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [complianceRecords, setComplianceRecords] = useState([]);
  const [emergencyIncidents, setEmergencyIncidents] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [rtiRequests, setRtiRequests] = useState([]);
  const [rtiStatusFilter, setRtiStatusFilter] = useState('all');
  const [updatingRtiId, setUpdatingRtiId] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    const syncHashTab = () => {
      const hashTab = window.location.hash.replace('#', '');
      if (SERVICE_TABS.includes(hashTab)) {
        setActiveTab(hashTab);
      }
    };

    window.addEventListener('hashchange', syncHashTab);
    syncHashTab();
    return () => window.removeEventListener('hashchange', syncHashTab);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const nextHash = tab === 'dashboard' ? '' : `#${tab}`;
      window.history.replaceState(null, '', `${window.location.pathname}${nextHash}`);
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, rtiData, eiaData, licenseData, complianceData, emergencyData, workspaceData] = await Promise.all([
        dashboardService.getStatistics(),
        rtiRequestService.getAll({ limit: 100 }),
        eiaService.getAll({ limit: 100 }),
        licensingService.getAll({ limit: 100 }),
        complianceService.getRecords({ limit: 100 }),
        emergencyService.getIncidents({ limit: 100 }),
        collaborationService.getAll({ limit: 100 })
      ]);

      setStats(statsData.data);
      setRtiRequests(rtiData.data || []);
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

  const handleUpdateRtiStatus = async (requestId, status) => {
    setUpdatingRtiId(requestId);
    try {
      const result = await rtiRequestService.update(requestId, {
        status,
        statusUpdatedAt: new Date()
      });
      if (result.error) throw new Error(result.error);
      setRtiRequests((requests) =>
        requests.map((request) =>
          request.id === requestId
            ? { ...request, status, statusUpdatedAt: new Date(), updatedAt: new Date() }
            : request
        )
      );
    } catch (error) {
      console.error('Error updating RTI request:', error);
      alert('Failed to update RTI request status');
    } finally {
      setUpdatingRtiId('');
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Government Services Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        <button
          type="button"
          onClick={() => handleTabChange('rti')}
          className="bg-white rounded-lg border border-gray-200 p-6 text-left transition hover:border-blue-400 hover:shadow-md"
        >
          <div className="flex items-center justify-between mb-2">
            <Icons.FileQuestion className="w-8 h-8 text-indigo-500" />
            <span className="text-3xl font-bold">{rtiRequests.length}</span>
          </div>
          <h3 className="font-semibold">RTI Requests</h3>
          <p className="text-sm text-gray-600">
            New: {rtiRequests.filter((request) => request.status === 'new').length}
          </p>
        </button>

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

  const filteredRtiRequests = rtiStatusFilter === 'all'
    ? rtiRequests
    : rtiRequests.filter((request) => request.status === rtiStatusFilter);

  const renderRTIManagement = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold">RTI Request Inbox</h2>
          <p className="text-sm text-gray-600">
            Online RTI forms submitted from the public /rti page. Use the reference number when replying to citizens.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'new', 'in_review', 'awaiting_clarification', 'responded', 'closed', 'rejected'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setRtiStatusFilter(status)}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                rtiStatusFilter === status
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-blue-50'
              }`}
            >
              {status.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Total online forms</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{rtiRequests.length}</p>
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm text-blue-700">New</p>
          <p className="mt-1 text-3xl font-bold text-blue-900">
            {rtiRequests.filter((request) => request.status === 'new').length}
          </p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-800">Awaiting action</p>
          <p className="mt-1 text-3xl font-bold text-amber-900">
            {rtiRequests.filter((request) => ['new', 'in_review', 'awaiting_clarification'].includes(request.status)).length}
          </p>
        </div>
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-sm text-green-700">Responded or closed</p>
          <p className="mt-1 text-3xl font-bold text-green-900">
            {rtiRequests.filter((request) => ['responded', 'closed'].includes(request.status)).length}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Reference</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Form</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Applicant</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Summary</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRtiRequests.map((request) => (
                <tr key={request.id} className="align-top hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-mono text-sm font-semibold text-gray-900">
                      {request.referenceId || request.id}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">{request.source || 'rti-online-form'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{request.formId || 'RTI'}</p>
                    <p className="text-sm text-gray-600">{request.formName || request.formTitle || 'RTI form'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{request.applicant?.name || 'Not supplied'}</p>
                    {request.applicant?.email && (
                      <a className="block text-sm text-blue-600 hover:underline" href={`mailto:${request.applicant.email}`}>
                        {request.applicant.email}
                      </a>
                    )}
                    {request.applicant?.phone && (
                      <a className="block text-sm text-blue-600 hover:underline" href={`tel:${request.applicant.phone}`}>
                        {request.applicant.phone}
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="line-clamp-3 max-w-sm text-sm text-gray-700">
                      {getRequestSummary(request)}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(request.submittedAt || request.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(request.status)}`}>
                      {(request.status || 'new').replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={request.status || 'new'}
                      disabled={updatingRtiId === request.id}
                      onChange={(event) => handleUpdateRtiStatus(request.id, event.target.value)}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="new">New</option>
                      <option value="in_review">In review</option>
                      <option value="awaiting_clarification">Awaiting clarification</option>
                      <option value="responded">Responded</option>
                      <option value="closed">Closed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredRtiRequests.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            No RTI requests found for this filter.
          </div>
        )}
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
      case 'rti':
        return renderRTIManagement();
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
              onClick={() => handleTabChange('dashboard')}
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
              onClick={() => handleTabChange('rti')}
              className={`px-6 py-4 font-medium transition-all ${
                activeTab === 'rti'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icons.FileQuestion className="w-5 h-5 inline-block mr-2" />
              RTI Requests
            </button>
            <button
              onClick={() => handleTabChange('eia')}
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
              onClick={() => handleTabChange('licenses')}
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
              onClick={() => handleTabChange('compliance')}
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
              onClick={() => handleTabChange('emergency')}
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
              onClick={() => handleTabChange('collaboration')}
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
