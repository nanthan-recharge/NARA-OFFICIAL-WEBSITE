import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Search, Filter, Eye, CheckCircle, XCircle, Clock, AlertTriangle, Calendar, FileText, Mail, Download, MessageSquare } from 'lucide-react';
import GlassMorphismCard from '../../../components/shared/GlassMorphismCard';
import firebaseAdminService from '../../../services/firebaseAdminService';

const ApplicationTrackingSection = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [statusUpdateModal, setStatusUpdateModal] = useState(false);
  const [statusComments, setStatusComments] = useState('');

  useEffect(() => {
    loadApplications();
  }, [selectedStatus, selectedType]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const appData = await firebaseAdminService?.getApplications(selectedType !== 'all' ? selectedType : 'all');
      setApplications(appData);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationAction = async (action, applicationId, data = {}) => {
    try {
      const application = applications?.find(app => app?.id === applicationId);
      
      switch (action) {
        case 'view':
          setSelectedApplication(application);
          setShowApplicationModal(true);
          break;
        case 'approve': await firebaseAdminService?.updateApplicationStatus(applicationId, application?.type,'approved', data?.comments || '');
          break;
        case 'reject': await firebaseAdminService?.updateApplicationStatus(applicationId, application?.type,'rejected', data?.comments || '');
          break;
        case 'review': await firebaseAdminService?.updateApplicationStatus(applicationId, application?.type,'under_review', data?.comments || '');
          break;
        case 'update_status':
          setSelectedApplication(application);
          setStatusUpdateModal(true);
          break;
      }
      
      if (action !== 'view' && action !== 'update_status') {
        await loadApplications();
      }
    } catch (error) {
      console.error(`Error ${action} application:`, error);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      if (selectedApplication) {
        await firebaseAdminService?.updateApplicationStatus(
          selectedApplication?.id, 
          selectedApplication?.type, 
          newStatus, 
          statusComments
        );
        setStatusUpdateModal(false);
        setStatusComments('');
        setSelectedApplication(null);
        await loadApplications();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredApplications = applications?.filter(app => 
    app?.user_profiles?.full_name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    app?.user_profiles?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    app?.collaboration_opportunities?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    app?.research_projects?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    app?.status?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  )?.filter(app => selectedStatus === 'all' || app?.status === selectedStatus);

  const getStatusColor = (status) => {
    const colors = {
      submitted: 'bg-blue-100 text-blue-800',
      under_review: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      draft: 'bg-gray-100 text-gray-800'
    };
    return colors?.[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'under_review':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'submitted':
        return <AlertTriangle className="w-4 h-4 text-blue-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      collaboration: 'bg-purple-100 text-purple-800',
      grant: 'bg-emerald-100 text-emerald-800',
      license: 'bg-orange-100 text-orange-800',
      eia: 'bg-cyan-100 text-cyan-800'
    };
    return colors?.[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-space-grotesk">Application Tracking</h2>
          <p className="text-gray-600">Monitor and manage all application submissions</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassMorphismCard className="p-4" onClick={() => {}}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{applications?.length}</div>
              <div className="text-sm text-gray-600">Total Applications</div>
            </div>
          </div>
        </GlassMorphismCard>

        <GlassMorphismCard className="p-4" onClick={() => {}}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {applications?.filter(app => app?.status === 'submitted' || app?.status === 'under_review')?.length}
              </div>
              <div className="text-sm text-gray-600">Pending Review</div>
            </div>
          </div>
        </GlassMorphismCard>

        <GlassMorphismCard className="p-4" onClick={() => {}}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {applications?.filter(app => app?.status === 'approved')?.length}
              </div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
          </div>
        </GlassMorphismCard>

        <GlassMorphismCard className="p-4" onClick={() => {}}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {applications?.filter(app => app?.status === 'rejected')?.length}
              </div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
          </div>
        </GlassMorphismCard>
      </div>
      {/* Search and Filters */}
      <GlassMorphismCard className="p-6" onClick={() => {}}>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search applications by applicant name, email, or project title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
            />
          </div>
          
          <div className="flex gap-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e?.target?.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
            >
              <option value="all">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e?.target?.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
            >
              <option value="all">All Types</option>
              <option value="collaboration">Collaboration</option>
              <option value="grant">Grant</option>
              <option value="license">License</option>
              <option value="eia">EIA</option>
            </select>
            
            <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>
      </GlassMorphismCard>
      {/* Applications Table */}
      <GlassMorphismCard className="overflow-hidden" onClick={() => {}}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Applications ({filteredApplications?.length})
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Applicant</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Type</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Project/Opportunity</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Submitted</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500">
                    Loading applications...
                  </td>
                </tr>
              ) : filteredApplications?.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500">
                    No applications found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredApplications?.map((application) => (
                  <motion.tr
                    key={application?.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-ocean-400 to-ocean-600 rounded-full flex items-center justify-center text-white font-medium">
                          {application?.user_profiles?.full_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">
                            {application?.user_profiles?.full_name || 'Unknown'}
                          </div>
                          <div className="text-sm text-gray-600 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {application?.user_profiles?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(application?.type)}`}>
                        {application?.type?.charAt(0)?.toUpperCase() + application?.type?.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="max-w-xs">
                        <div className="font-medium text-gray-800 truncate">
                          {application?.collaboration_opportunities?.title || 
                           application?.research_projects?.title || 
                           'No title available'}
                        </div>
                        <div className="text-sm text-gray-600">
                          ID: {application?.id?.slice(0, 8)}...
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(application?.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application?.status)}`}>
                          {application?.status?.replace('_', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-3 h-3" />
                        {new Date(application.created_at)?.toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleApplicationAction('view', application?.id)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {application?.status === 'submitted' && (
                          <>
                            <button
                              onClick={() => handleApplicationAction('approve', application?.id)}
                              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleApplicationAction('reject', application?.id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        
                        <button
                          onClick={() => handleApplicationAction('update_status', application?.id)}
                          className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Update Status"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassMorphismCard>
      {/* Application Detail Modal */}
      <AnimatePresence>
        {showApplicationModal && selectedApplication && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Application Details</h3>
                <button
                  onClick={() => setShowApplicationModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Application Header */}
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      {selectedApplication?.collaboration_opportunities?.title || 
                       selectedApplication?.research_projects?.title || 
                       'Application Details'}
                    </h4>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedApplication?.type)}`}>
                        {selectedApplication?.type?.charAt(0)?.toUpperCase() + selectedApplication?.type?.slice(1)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedApplication?.status)}`}>
                        {selectedApplication?.status?.replace('_', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
                      </span>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div>Applied: {new Date(selectedApplication.created_at)?.toLocaleDateString()}</div>
                    <div>ID: {selectedApplication?.id}</div>
                  </div>
                </div>

                {/* Applicant Information */}
                <div>
                  <h5 className="font-medium text-gray-800 mb-3">Applicant Information</h5>
                  <div className="grid grid-cols-2 gap-4 p-4 border border-gray-200 rounded-lg">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Full Name</div>
                      <div className="font-medium">{selectedApplication?.user_profiles?.full_name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Email</div>
                      <div className="font-medium">{selectedApplication?.user_profiles?.email}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Role</div>
                      <div className="font-medium">{selectedApplication?.user_profiles?.role}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Institution</div>
                      <div className="font-medium">{selectedApplication?.user_profiles?.institution || 'Not specified'}</div>
                    </div>
                  </div>
                </div>

                {/* Application Content */}
                <div>
                  <h5 className="font-medium text-gray-800 mb-3">Application Details</h5>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="prose max-w-none text-sm">
                      {selectedApplication?.proposal_summary || 
                       selectedApplication?.application_details ||
                       selectedApplication?.description ||
                       'No additional details provided.'}
                    </div>
                  </div>
                </div>

                {/* Admin Comments */}
                {selectedApplication?.admin_comments && (
                  <div>
                    <h5 className="font-medium text-gray-800 mb-3">Admin Comments</h5>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="text-sm text-blue-800">
                        {selectedApplication?.admin_comments}
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  {selectedApplication?.status === 'submitted' && (
                    <>
                      <button
                        onClick={() => handleApplicationAction('approve', selectedApplication?.id)}
                        className="px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg font-medium transition-colors"
                      >
                        Approve Application
                      </button>
                      <button
                        onClick={() => handleApplicationAction('reject', selectedApplication?.id)}
                        className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-medium transition-colors"
                      >
                        Reject Application
                      </button>
                      <button
                        onClick={() => handleApplicationAction('review', selectedApplication?.id)}
                        className="px-4 py-2 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-lg font-medium transition-colors"
                      >
                        Mark Under Review
                      </button>
                    </>
                  )}
                  <button className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg font-medium transition-colors">
                    Download Application
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors">
                    Send Message
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Status Update Modal */}
      <AnimatePresence>
        {statusUpdateModal && selectedApplication && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Update Application Status</h3>
                <button
                  onClick={() => setStatusUpdateModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
                  <textarea
                    value={statusComments}
                    onChange={(e) => setStatusComments(e?.target?.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                    placeholder="Add comments about the status change..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleStatusUpdate('approved')}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('rejected')}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('under_review')}
                    className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    Under Review
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ApplicationTrackingSection;