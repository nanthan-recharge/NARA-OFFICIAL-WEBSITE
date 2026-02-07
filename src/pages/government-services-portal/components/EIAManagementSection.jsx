import React, { useState, useEffect } from 'react';
import { eiaService, documentService } from '../../../services/governmentService.js';

const EIAManagementSection = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const [formData, setFormData] = useState({
    project_title: '',
    project_description: '',
    location: '',
    expected_impact: '',
    status: 'draft'
  });

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    setLoading(true);
    const { data, error } = await eiaService?.getUserSubmissions();
    if (data) setSubmissions(data);
    if (error) console.error('Error loading submissions:', error);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const { data, error } = await eiaService?.create(formData);
    
    if (error) {
      alert(`Error creating submission: ${error}`);
      return;
    }
    
    setFormData({
      project_title: '',
      project_description: '',
      location: '',
      expected_impact: '',
      status: 'draft'
    });
    setShowForm(false);
    loadSubmissions();
  };

  const handleSubmitForReview = async (id) => {
    const { error } = await eiaService?.submit(id);
    if (error) {
      alert(`Error submitting: ${error}`);
      return;
    }
    loadSubmissions();
  };

  const handleFileUpload = async (e, submissionId) => {
    const file = e?.target?.files?.[0];
    if (!file) return;

    setUploadingDoc(true);
    const { data, error } = await documentService?.upload(file, 'eia_report', submissionId);
    
    if (error) {
      alert(`Error uploading document: ${error}`);
    } else {
      alert('Document uploaded successfully');
    }
    setUploadingDoc(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-700',
      submitted: 'bg-blue-100 text-blue-700',
      under_review: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      requires_changes: 'bg-orange-100 text-orange-700'
    };
    return colors?.[status] || colors?.draft;
  };

  const getStatusIcon = (status) => {
    const icons = {
      draft: '📝',
      submitted: '📤',
      under_review: '🔍',
      approved: '✅',
      rejected: '❌',
      requires_changes: '📝'
    };
    return icons?.[status] || '📋';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
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
          <h2 className="text-2xl font-bold text-gray-900">Environmental Impact Assessment</h2>
          <p className="text-gray-600 mt-1">Submit and track EIA applications with guided review workflows</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
        >
          + New EIA Submission
        </button>
      </div>
      {/* New Submission Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold">New EIA Submission</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData?.project_title}
                  onChange={(e) => setFormData({ ...formData, project_title: e?.target?.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter project title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData?.project_description}
                  onChange={(e) => setFormData({ ...formData, project_description: e?.target?.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Describe the project scope and activities"
                />
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Project location or area"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Environmental Impact
                </label>
                <textarea
                  rows={3}
                  value={formData?.expected_impact}
                  onChange={(e) => setFormData({ ...formData, expected_impact: e?.target?.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Describe potential environmental impacts"
                />
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
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Create Submission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Submissions List */}
      <div className="space-y-4">
        {submissions?.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-emerald-600 text-2xl">📋</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No EIA Submissions</h3>
            <p className="text-gray-600 mb-4">Start your first Environmental Impact Assessment submission</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Create First Submission
            </button>
          </div>
        ) : (
          submissions?.map((submission) => (
            <div key={submission?.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl">{getStatusIcon(submission?.status)}</span>
                    <h3 className="text-lg font-semibold text-gray-900">{submission?.project_title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission?.status)}`}>
                      {submission?.status?.replace('_', ' ')?.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-3">{submission?.project_description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Location:</span>
                      <p className="text-gray-600">{submission?.location || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Submitted:</span>
                      <p className="text-gray-600">
                        {submission?.submission_date 
                          ? new Date(submission.submission_date)?.toLocaleDateString()
                          : 'Not submitted'
                        }
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Review Deadline:</span>
                      <p className="text-gray-600">
                        {submission?.review_deadline 
                          ? new Date(submission.review_deadline)?.toLocaleDateString()
                          : 'TBD'
                        }
                      </p>
                    </div>
                  </div>

                  {submission?.reviewer && (
                    <div className="mt-3 pt-3 border-t">
                      <span className="text-sm font-medium text-gray-700">Reviewer: </span>
                      <span className="text-sm text-gray-600">{submission?.reviewer?.full_name}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  {submission?.status === 'draft' && (
                    <button
                      onClick={() => handleSubmitForReview(submission?.id)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Submit for Review
                    </button>
                  )}
                  
                  <div className="relative">
                    <input
                      type="file"
                      id={`upload-${submission?.id}`}
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, submission?.id)}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      disabled={uploadingDoc}
                    />
                    <label
                      htmlFor={`upload-${submission?.id}`}
                      className={`px-3 py-1 text-sm rounded cursor-pointer inline-block text-center ${
                        uploadingDoc 
                          ? 'bg-gray-300 text-gray-500' :'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {uploadingDoc ? 'Uploading...' : '📎 Upload Doc'}
                    </label>
                  </div>
                  
                  <button
                    onClick={() => setSelectedSubmission(submission)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{selectedSubmission?.project_title}</h3>
                <button
                  onClick={() => setSelectedSubmission(null)}
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
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedSubmission?.status)}`}>
                    {selectedSubmission?.status?.replace('_', ' ')?.toUpperCase()}
                  </span>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                  <p className="text-gray-600">{selectedSubmission?.location || 'Not specified'}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Project Description</h4>
                <p className="text-gray-600">{selectedSubmission?.project_description}</p>
              </div>

              {selectedSubmission?.expected_impact && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Expected Environmental Impact</h4>
                  <p className="text-gray-600">{selectedSubmission?.expected_impact}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Created</h4>
                  <p className="text-gray-600">{new Date(selectedSubmission.created_at)?.toLocaleDateString()}</p>
                </div>
                
                {selectedSubmission?.submission_date && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Submitted</h4>
                    <p className="text-gray-600">{new Date(selectedSubmission.submission_date)?.toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              {selectedSubmission?.reviewer && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Assigned Reviewer</h4>
                  <p className="text-gray-600">{selectedSubmission?.reviewer?.full_name}</p>
                  <p className="text-sm text-gray-500">{selectedSubmission?.reviewer?.email}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EIAManagementSection;