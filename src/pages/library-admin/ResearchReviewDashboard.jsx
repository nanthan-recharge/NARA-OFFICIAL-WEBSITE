import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useLibraryUser } from '../../contexts/LibraryUserContext';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

const ResearchReviewDashboard = () => {
  const { user, userProfile, hasPermission } = useLibraryUser();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [reviewModal, setReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({ status: '', comments: '' });
  const [filterStatus, setFilterStatus] = useState('pending');

  useEffect(() => {
    if (user) {
      fetchSubmissions();
    }
  }, [filterStatus, user]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const q = filterStatus === 'all' 
        ? query(collection(db, 'researchSubmissions'), orderBy('submission.submittedAt', 'desc'))
        : query(
            collection(db, 'researchSubmissions'),
            where('submission.status', '==', filterStatus),
            orderBy('submission.submittedAt', 'desc')
          );
      
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSubmissions(data);
    } catch (err) {
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const openReviewModal = (submission) => {
    setSelectedSubmission(submission);
    setReviewData({ 
      status: submission.submission.status, 
      comments: submission.submission.reviewComments || '' 
    });
    setReviewModal(true);
  };

  const handleReview = async () => {
    if (!selectedSubmission || !reviewData.status) return;

    try {
      const submissionRef = doc(db, 'researchSubmissions', selectedSubmission.id);
      await updateDoc(submissionRef, {
        'submission.status': reviewData.status,
        'submission.reviewComments': reviewData.comments,
        'submission.reviewedBy': user.uid,
        'submission.reviewedAt': serverTimestamp()
      });

      setReviewModal(false);
      fetchSubmissions();
      alert('Review submitted successfully!');
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Failed to submit review. Please check your permissions.');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      under_review: 'bg-blue-100 text-blue-800 border-blue-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      published: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return badges[status] || badges.pending;
  };

  const getStatusCount = (status) => {
    if (status === 'all') return submissions.length;
    return submissions.filter(s => s.submission?.status === status).length;
  };

  // Check if user is admin or has review permissions
  const canReview = userProfile?.role === 'admin' || 
                    userProfile?.role === 'librarian' || 
                    hasPermission?.('review_research');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <Icons.Lock className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Authentication Required</h2>
          <p className="text-slate-600">Please sign in to access this page.</p>
        </div>
      </div>
    );
  }

  if (!canReview) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <Icons.ShieldAlert className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-600 mb-4">
            Only administrators and librarians can access this page.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Icons.ClipboardCheck className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-slate-900">Research Review Dashboard</h1>
          </div>
          <p className="text-slate-600">Review and manage research submissions</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-3">
            {['all', 'pending', 'under_review', 'approved', 'rejected', 'published'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                  filterStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {status.replace('_', ' ')} ({getStatusCount(status)})
              </button>
            ))}
          </div>
        </div>

        {/* Submissions List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Icons.Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Icons.FileSearch className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 text-lg font-medium mb-2">No submissions found</p>
            <p className="text-slate-500 text-sm">
              {filterStatus === 'all' 
                ? 'There are no research submissions yet.' 
                : `No submissions with status "${filterStatus.replace('_', ' ')}"`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <Icons.FileText className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900 mb-1">
                          {submission.manuscript?.title || 'Untitled'}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <Icons.User className="w-4 h-4" />
                            {submission.authorName || 'Unknown Author'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icons.Mail className="w-4 h-4" />
                            {submission.authorEmail || 'No email'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icons.Calendar className="w-4 h-4" />
                            {submission.submission?.submittedAt?.toDate?.().toLocaleDateString() || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-slate-700 mb-3 line-clamp-2">
                      {submission.manuscript?.abstract || 'No abstract provided'}
                    </p>

                    {submission.manuscript?.keywords && submission.manuscript.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {submission.manuscript.keywords.slice(0, 5).map((keyword, idx) => (
                          <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">
                            {keyword}
                          </span>
                        ))}
                        {submission.manuscript.keywords.length > 5 && (
                          <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">
                            +{submission.manuscript.keywords.length - 5} more
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm">
                      <span className={`px-3 py-1 rounded-full font-semibold border ${getStatusBadge(submission.submission?.status || 'pending')}`}>
                        {(submission.submission?.status || 'pending').replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="text-slate-600 capitalize">
                        {submission.manuscript?.documentType?.replace('_', ' ') || 'Unknown type'}
                      </span>
                      <span className="text-slate-600">
                        {submission.manuscript?.researchArea || 'No area specified'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => openReviewModal(submission)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
                    >
                      <Icons.Eye className="w-4 h-4" />
                      Review
                    </button>
                    {submission.manuscript?.mainDocument?.fileURL && (
                      <a
                        href={submission.manuscript.mainDocument.fileURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
                      >
                        <Icons.Download className="w-4 h-4" />
                        Download
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Review Modal */}
        {reviewModal && selectedSubmission && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8"
            >
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900">Review Submission</h2>
                  <button
                    onClick={() => setReviewModal(false)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <Icons.X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                {/* Submission Details */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    {selectedSubmission.manuscript?.title || 'Untitled'}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Submission ID:</span>
                      <p className="font-medium text-slate-900">{selectedSubmission.submissionId || selectedSubmission.id}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Author:</span>
                      <p className="font-medium text-slate-900">{selectedSubmission.authorName}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Email:</span>
                      <p className="font-medium text-slate-900">{selectedSubmission.authorEmail}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Document Type:</span>
                      <p className="font-medium text-slate-900 capitalize">
                        {selectedSubmission.manuscript?.documentType?.replace('_', ' ') || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-600">Research Area:</span>
                      <p className="font-medium text-slate-900">{selectedSubmission.manuscript?.researchArea || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Language:</span>
                      <p className="font-medium text-slate-900 uppercase">{selectedSubmission.manuscript?.language || 'EN'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Abstract</h4>
                  <p className="text-slate-700 text-sm">
                    {selectedSubmission.manuscript?.abstract || 'No abstract provided'}
                  </p>
                </div>

                {selectedSubmission.manuscript?.keywords && selectedSubmission.manuscript.keywords.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSubmission.manuscript.keywords.map((keyword, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedSubmission.authors && selectedSubmission.authors.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Authors ({selectedSubmission.authors.length})</h4>
                    <div className="space-y-2">
                      {selectedSubmission.authors.map((author, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-lg text-sm">
                          <p className="font-medium text-slate-900">{author.name}</p>
                          <p className="text-slate-600 text-xs">{author.email} • {author.affiliation}</p>
                          {author.isCorresponding && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                              Corresponding Author
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Review Form */}
                <div className="border-t border-slate-200 pt-6">
                  <h4 className="font-semibold text-slate-900 mb-4">Review Decision</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Status *</label>
                      <select
                        value={reviewData.status}
                        onChange={(e) => setReviewData(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value="">Select status</option>
                        <option value="pending">Pending</option>
                        <option value="under_review">Under Review</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="published">Published</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Comments</label>
                      <textarea
                        value={reviewData.comments}
                        onChange={(e) => setReviewData(prev => ({ ...prev, comments: e.target.value }))}
                        rows={4}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                        placeholder="Provide feedback to the author..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
                <button
                  onClick={() => setReviewModal(false)}
                  className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReview}
                  disabled={!reviewData.status}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Icons.Check className="w-4 h-4" />
                  Submit Review
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchReviewDashboard;
