import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import {
  vacancyService,
  applicationService,
  interviewService,
  scoringService,
  exportService,
  documentService,
  recruitmentDashboardService
} from '../../services/recruitmentATSService';

const RecruitmentATSAdmin = () => {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'vacancies' | 'applications' | 'interviews'
  const [dashboardStats, setDashboardStats] = useState(null);
  const [vacancies, setVacancies] = useState([]);
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);

  // Vacancy Form
  const [vacancyForm, setVacancyForm] = useState({
    jobTitle: '',
    department: '',
    description: '',
    qualifications: '',
    duties: '',
    salaryRange: '',
    numberOfPositions: 1,
    closingDate: '',
    employmentType: 'permanent',
    grade: '',
    requiredApprovalLevels: 2
  });

  useEffect(() => {
    loadDashboardStats();
    loadVacancies();
  }, []);

  const loadDashboardStats = async () => {
    const { data } = await recruitmentDashboardService.getStatistics();
    if (data) setDashboardStats(data);
  };

  const loadVacancies = async () => {
    setLoading(true);
    const { data } = await vacancyService.getAll();
    if (data) setVacancies(data);
    setLoading(false);
  };

  const loadApplicationsForVacancy = async (vacancyId) => {
    const { data } = await applicationService.getByVacancy(vacancyId);
    if (data) setApplications(data);
  };

  const handleCreateVacancy = async (e) => {
    e.preventDefault();
    setLoading(true);

    const vacancyData = {
      ...vacancyForm,
      qualifications: vacancyForm.qualifications.split('\n').filter(q => q.trim()),
      numberOfPositions: parseInt(vacancyForm.numberOfPositions) || 1,
      requiredApprovalLevels: parseInt(vacancyForm.requiredApprovalLevels) || 2
    };

    const { data, error } = await vacancyService.create(vacancyData);
    if (error) {
      alert('Error creating vacancy: ' + error.message);
    } else {
      alert('Vacancy created successfully! ID: ' + data.vacancyId);
      resetVacancyForm();
      loadVacancies();
      loadDashboardStats();
      setActiveTab('vacancies');
    }
    setLoading(false);
  };

  const handleSubmitForApproval = async (vacancyId) => {
    const { error } = await vacancyService.submitForApproval(vacancyId, 'Admin User');
    if (error) {
      alert('Error submitting for approval: ' + error.message);
    } else {
      alert('Vacancy submitted for approval successfully!');
      loadVacancies();
    }
  };

  const handleApproveVacancy = async (vacancyId) => {
    const approverRole = prompt('Enter your role (e.g., HR Manager, Director):');
    if (!approverRole) return;

    const { data, error } = await vacancyService.approve(vacancyId, {
      approver: 'Admin User',
      approverRole,
      approvalLevel: 1,
      comments: 'Approved'
    });

    if (error) {
      alert('Error approving vacancy: ' + error.message);
    } else {
      if (data.allApproved) {
        alert('All approvals completed! Vacancy is now approved.');
      } else {
        alert('Approval recorded. Waiting for additional approvals.');
      }
      loadVacancies();
      loadDashboardStats();
    }
  };

  const handlePublishVacancy = async (vacancyId) => {
    const channels = ['website', 'psc', 'gazette'];
    const { error } = await vacancyService.publish(vacancyId, channels);
    if (error) {
      alert('Error publishing vacancy: ' + error.message);
    } else {
      alert('Vacancy published successfully!');
      loadVacancies();
      loadDashboardStats();
    }
  };

  const handleCloseVacancy = async (vacancyId) => {
    const { error } = await vacancyService.close(vacancyId, 'manual_closure');
    if (error) {
      alert('Error closing vacancy: ' + error.message);
    } else {
      alert('Vacancy closed successfully!');
      loadVacancies();
      loadDashboardStats();
    }
  };

  const handleShortlistApplication = async (applicationId) => {
    const notes = prompt('Enter shortlisting notes (optional):');
    const { error } = await applicationService.shortlist(applicationId, 'Admin User', notes || '');
    if (error) {
      alert('Error shortlisting application: ' + error.message);
    } else {
      alert('Application shortlisted successfully!');
      loadApplicationsForVacancy(selectedVacancy.id);
    }
  };

  const handleExportPSC = async (vacancyId) => {
    const { data, error } = await exportService.generatePSCTemplate(vacancyId);
    if (error) {
      alert('Error generating PSC template: ' + error.message);
    } else {
      console.log('PSC Template:', data);
      alert('PSC template generated! Check console for details.');
      // In production, this would download a file
    }
  };

  const handleExportGazette = async (vacancyId) => {
    const { data, error } = await exportService.generateGazetteTemplate(vacancyId);
    if (error) {
      alert('Error generating Gazette template: ' + error.message);
    } else {
      console.log('Gazette Template:', data);
      alert('Gazette template generated! Check console for details.');
      // In production, this would download a file
    }
  };

  const resetVacancyForm = () => {
    setVacancyForm({
      jobTitle: '',
      department: '',
      description: '',
      qualifications: '',
      duties: '',
      salaryRange: '',
      numberOfPositions: 1,
      closingDate: '',
      employmentType: 'permanent',
      grade: '',
      requiredApprovalLevels: 2
    });
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-700',
      pending_approval: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      published: 'bg-blue-100 text-blue-700',
      closed: 'bg-red-100 text-red-700',
      submitted: 'bg-blue-100 text-blue-700',
      under_review: 'bg-yellow-100 text-yellow-700',
      shortlisted: 'bg-green-100 text-green-700',
      interviewed: 'bg-purple-100 text-purple-700',
      selected: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  // Dashboard Tab
  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-xl p-8">
        <Icons.Briefcase className="w-12 h-12 mb-3 opacity-90" />
        <h1 className="text-3xl font-bold mb-2">Recruitment ATS Admin</h1>
        <p className="text-indigo-100">Applicant Tracking System for NARA Careers Management</p>
      </div>

      {dashboardStats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={Icons.FileText}
              label="Total Vacancies"
              value={dashboardStats.vacancies.total}
              color="blue"
            />
            <StatCard
              icon={Icons.Users}
              label="Total Applications"
              value={dashboardStats.applications.total}
              color="green"
            />
            <StatCard
              icon={Icons.CheckCircle}
              label="Shortlisted"
              value={dashboardStats.applications.shortlisted}
              color="purple"
            />
            <StatCard
              icon={Icons.UserCheck}
              label="Selected"
              value={dashboardStats.applications.selected}
              color="indigo"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Vacancy Status</h2>
              <div className="space-y-3">
                <StatusRow label="Draft" count={dashboardStats.vacancies.draft} color="gray" />
                <StatusRow label="Pending Approval" count={dashboardStats.vacancies.pending_approval} color="yellow" />
                <StatusRow label="Published" count={dashboardStats.vacancies.published} color="blue" />
                <StatusRow label="Closed" count={dashboardStats.vacancies.closed} color="red" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Application Status</h2>
              <div className="space-y-3">
                <StatusRow label="Submitted" count={dashboardStats.applications.submitted} color="blue" />
                <StatusRow label="Under Review" count={dashboardStats.applications.under_review} color="yellow" />
                <StatusRow label="Shortlisted" count={dashboardStats.applications.shortlisted} color="green" />
                <StatusRow label="Interviewed" count={dashboardStats.applications.interviewed} color="purple" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recruitment Insights</h2>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{dashboardStats.insights.averageApplicationsPerVacancy}</div>
                <div className="text-sm text-gray-600 mt-2">Avg Applications per Vacancy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{dashboardStats.insights.totalShortlistedRate}%</div>
                <div className="text-sm text-gray-600 mt-2">Shortlist Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{dashboardStats.insights.totalSelectionRate}%</div>
                <div className="text-sm text-gray-600 mt-2">Selection Rate</div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => {
            resetVacancyForm();
            setActiveTab('create');
          }}
          className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-xl p-8 hover:shadow-2xl transition-all"
        >
          <Icons.Plus className="w-12 h-12 mb-3" />
          <h3 className="text-xl font-bold mb-2">Create New Vacancy</h3>
          <p className="text-green-100">Post a new job opening</p>
        </button>
        <button
          onClick={() => setActiveTab('vacancies')}
          className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl p-8 hover:shadow-2xl transition-all"
        >
          <Icons.List className="w-12 h-12 mb-3" />
          <h3 className="text-xl font-bold mb-2">Manage Vacancies</h3>
          <p className="text-blue-100">View and update job postings</p>
        </button>
      </div>
    </div>
  );

  // Vacancies Tab
  const renderVacancies = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">All Vacancies</h2>
          <button
            onClick={() => {
              resetVacancyForm();
              setActiveTab('create');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Icons.Plus className="w-5 h-5" />
            New Vacancy
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {vacancies.map((vacancy) => (
              <div key={vacancy.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-sm text-gray-500">{vacancy.vacancyId}</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeColor(vacancy.status)}`}>
                        {vacancy.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{vacancy.jobTitle}</h3>
                    <p className="text-gray-600 text-sm mb-3">{vacancy.department} • {vacancy.employmentType}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span>Applications: {vacancy.applicationCount || 0}</span>
                      <span>Shortlisted: {vacancy.shortlistedCount || 0}</span>
                      <span>Closing: {new Date(vacancy.closingDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {vacancy.status === 'draft' && (
                      <button
                        onClick={() => handleSubmitForApproval(vacancy.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Submit for Approval"
                      >
                        <Icons.Send className="w-5 h-5" />
                      </button>
                    )}
                    {vacancy.status === 'pending_approval' && (
                      <button
                        onClick={() => handleApproveVacancy(vacancy.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Approve"
                      >
                        <Icons.CheckCircle className="w-5 h-5" />
                      </button>
                    )}
                    {vacancy.status === 'approved' && (
                      <button
                        onClick={() => handlePublishVacancy(vacancy.id)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                        title="Publish"
                      >
                        <Icons.Globe className="w-5 h-5" />
                      </button>
                    )}
                    {vacancy.status === 'published' && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedVacancy(vacancy);
                            loadApplicationsForVacancy(vacancy.id);
                            setActiveTab('applications');
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="View Applications"
                        >
                          <Icons.Users className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleCloseVacancy(vacancy.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Close Vacancy"
                        >
                          <Icons.X className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleExportPSC(vacancy.id)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                      title="Export PSC Template"
                    >
                      <Icons.FileDown className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleExportGazette(vacancy.id)}
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                      title="Export Gazette Template"
                    >
                      <Icons.FileText className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {vacancy.approvals && vacancy.approvals.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">Approvals:</p>
                    <div className="space-y-1">
                      {vacancy.approvals.map((approval, idx) => (
                        <div key={idx} className="text-sm text-gray-600">
                          ✓ {approval.approver} ({approval.approverRole}) - Level {approval.approvalLevel}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Create Vacancy Form
  const renderCreateVacancy = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Vacancy</h2>

        <form onSubmit={handleCreateVacancy} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Title*</label>
              <input
                type="text"
                required
                value={vacancyForm.jobTitle}
                onChange={(e) => setVacancyForm({ ...vacancyForm, jobTitle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department*</label>
              <select
                required
                value={vacancyForm.department}
                onChange={(e) => setVacancyForm({ ...vacancyForm, department: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Department</option>
                <option value="Marine Biology">Marine Biology</option>
                <option value="Fisheries Science">Fisheries Science</option>
                <option value="Aquaculture">Aquaculture</option>
                <option value="Environmental Monitoring">Environmental Monitoring</option>
                <option value="Administration">Administration</option>
                <option value="IT & Technology">IT & Technology</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type*</label>
              <select
                required
                value={vacancyForm.employmentType}
                onChange={(e) => setVacancyForm({ ...vacancyForm, employmentType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="permanent">Permanent</option>
                <option value="contract">Contract</option>
                <option value="temporary">Temporary</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
              <input
                type="text"
                value={vacancyForm.grade}
                onChange={(e) => setVacancyForm({ ...vacancyForm, grade: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range*</label>
              <input
                type="text"
                required
                value={vacancyForm.salaryRange}
                onChange={(e) => setVacancyForm({ ...vacancyForm, salaryRange: e.target.value })}
                placeholder="e.g., Rs. 50,000 - 80,000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Positions*</label>
              <input
                type="number"
                required
                min="1"
                value={vacancyForm.numberOfPositions}
                onChange={(e) => setVacancyForm({ ...vacancyForm, numberOfPositions: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Closing Date*</label>
              <input
                type="date"
                required
                value={vacancyForm.closingDate}
                onChange={(e) => setVacancyForm({ ...vacancyForm, closingDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description*</label>
              <textarea
                required
                rows={4}
                value={vacancyForm.description}
                onChange={(e) => setVacancyForm({ ...vacancyForm, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Qualifications* (one per line)</label>
              <textarea
                required
                rows={4}
                value={vacancyForm.qualifications}
                onChange={(e) => setVacancyForm({ ...vacancyForm, qualifications: e.target.value })}
                placeholder="BSc in Marine Biology&#10;5 years experience&#10;Strong research skills"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Duties & Responsibilities*</label>
              <textarea
                required
                rows={4}
                value={vacancyForm.duties}
                onChange={(e) => setVacancyForm({ ...vacancyForm, duties: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Vacancy'}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('vacancies');
                resetVacancyForm();
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

  // Applications Tab
  const renderApplications = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Applications</h2>
            {selectedVacancy && (
              <p className="text-gray-600 mt-1">{selectedVacancy.jobTitle} ({selectedVacancy.vacancyId})</p>
            )}
          </div>
          <button
            onClick={() => {
              setSelectedVacancy(null);
              setApplications([]);
              setActiveTab('vacancies');
            }}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Back to Vacancies
          </button>
        </div>

        <div className="space-y-4">
          {applications.map((application) => (
            <div key={application.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm text-gray-500">{application.applicationId}</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeColor(application.status)}`}>
                      {application.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{application.applicantName}</h3>
                  <p className="text-gray-600 text-sm mb-2">{application.email} • {application.phone}</p>
                  <div className="text-sm text-gray-500">
                    Submitted: {new Date(application.submittedAt).toLocaleDateString()}
                  </div>
                  {application.scorePercentage > 0 && (
                    <div className="mt-2">
                      <span className="text-sm font-medium text-gray-700">Score: </span>
                      <span className="text-lg font-bold text-blue-600">{application.scorePercentage}%</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {application.status === 'submitted' && (
                    <button
                      onClick={() => handleShortlistApplication(application.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      title="Shortlist"
                    >
                      <Icons.CheckCircle className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedApplication(application)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="View Details"
                  >
                    <Icons.Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {applications.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No applications found for this vacancy
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="mb-8 flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'dashboard'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('vacancies')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'vacancies'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Vacancies
          </button>
          {selectedVacancy && (
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'applications'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Applications
            </button>
          )}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'vacancies' && renderVacancies()}
          {activeTab === 'create' && renderCreateVacancy()}
          {activeTab === 'applications' && renderApplications()}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    indigo: 'from-indigo-500 to-indigo-600'
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

export default RecruitmentATSAdmin;
