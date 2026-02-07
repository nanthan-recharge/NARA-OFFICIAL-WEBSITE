import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, Building, CreditCard, Edit2, Save, X,
  Upload, FileText, Download, Trash2, Eye, CheckCircle,
  Award, Briefcase, GraduationCap, MapPin, Calendar, Globe,
  AlertCircle, Loader, Plus, ChevronDown, ChevronUp
} from 'lucide-react';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage, db } from '../../../config/firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';

const UserProfile = ({ userId, onClose }) => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, documents, applications, settings
  const [applications, setApplications] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    education: true,
    experience: true,
    skills: true
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    loadUserProfile();
    loadUserApplications();
  }, [userId]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      // In a real app, this would fetch from Firebase
      const userDoc = await getDoc(doc(db, 'procurement_users', userId));

      if (userDoc.exists()) {
        setProfile(userDoc.data());
      } else {
        setError('Profile not found');
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const loadUserApplications = async () => {
    try {
      // Load procurement applications
      const procurementQuery = query(
        collection(db, 'procurement_applications'),
        where('userId', '==', userId)
      );
      const procurementSnapshot = await getDocs(procurementQuery);
      const procurementApps = procurementSnapshot.docs.map(doc => ({
        id: doc.id,
        type: 'procurement',
        ...doc.data()
      }));

      // Load recruitment applications
      const recruitmentQuery = query(
        collection(db, 'recruitment_applications'),
        where('userId', '==', userId)
      );
      const recruitmentSnapshot = await getDocs(recruitmentQuery);
      const recruitmentApps = recruitmentSnapshot.docs.map(doc => ({
        id: doc.id,
        type: 'recruitment',
        ...doc.data()
      }));

      setApplications([...procurementApps, ...recruitmentApps].sort((a, b) =>
        new Date(b.submittedAt) - new Date(a.submittedAt)
      ));
    } catch (err) {
      console.error('Error loading applications:', err);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const userRef = doc(db, 'procurement_users', userId);
      await updateDoc(userRef, {
        ...profile,
        updatedAt: new Date().toISOString()
      });
      setEditing(false);
      setError(null);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadDocument = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setSaving(true);
      const fileName = `${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `users/${userId}/documents/${fileName}`);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      const newDocument = {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        downloadURL,
        storagePath: `users/${userId}/documents/${fileName}`,
        uploadedAt: new Date().toISOString()
      };

      const updatedDocuments = [...(profile.documents?.otherDocuments || []), newDocument];

      const userRef = doc(db, 'procurement_users', userId);
      await updateDoc(userRef, {
        'documents.otherDocuments': updatedDocuments,
        updatedAt: new Date().toISOString()
      });

      setProfile(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          otherDocuments: updatedDocuments
        }
      }));
    } catch (err) {
      console.error('Error uploading document:', err);
      setError('Failed to upload document');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDocument = async (documentPath, index) => {
    try {
      setSaving(true);
      const storageRef = ref(storage, documentPath);
      await deleteObject(storageRef);

      const updatedDocuments = profile.documents.otherDocuments.filter((_, i) => i !== index);

      const userRef = doc(db, 'procurement_users', userId);
      await updateDoc(userRef, {
        'documents.otherDocuments': updatedDocuments,
        updatedAt: new Date().toISOString()
      });

      setProfile(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          otherDocuments: updatedDocuments
        }
      }));
    } catch (err) {
      console.error('Error deleting document:', err);
      setError('Failed to delete document');
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full">
          <div className="flex items-start gap-3 mb-6">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="font-bold text-gray-900">Error</h3>
              <p className="text-gray-600 mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {profile?.firstName} {profile?.lastName}
                </h2>
                <p className="text-blue-100">{profile?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mt-4">
            {['overview', 'documents', 'applications', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'bg-white/20 text-white'
                    : 'text-blue-100 hover:bg-white/10'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-red-900">Error</h4>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Personal Information */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoField
                      icon={User}
                      label="Full Name"
                      value={`${profile?.firstName} ${profile?.lastName}`}
                      editing={editing}
                      onChange={(value) => {
                        const [firstName, ...lastNameParts] = value.split(' ');
                        setProfile(prev => ({
                          ...prev,
                          firstName,
                          lastName: lastNameParts.join(' ')
                        }));
                      }}
                    />
                    <InfoField
                      icon={Mail}
                      label="Email"
                      value={profile?.email}
                      editing={editing}
                      onChange={(value) => setProfile(prev => ({ ...prev, email: value }))}
                    />
                    <InfoField
                      icon={Phone}
                      label="Phone"
                      value={profile?.phone}
                      editing={editing}
                      onChange={(value) => setProfile(prev => ({ ...prev, phone: value }))}
                    />
                    <InfoField
                      icon={CreditCard}
                      label="NIC"
                      value={profile?.nic}
                      editing={editing}
                      onChange={(value) => setProfile(prev => ({ ...prev, nic: value }))}
                    />
                    <InfoField
                      icon={Calendar}
                      label="Date of Birth"
                      value={profile?.dateOfBirth}
                      editing={editing}
                      onChange={(value) => setProfile(prev => ({ ...prev, dateOfBirth: value }))}
                    />
                    <InfoField
                      icon={Globe}
                      label="Nationality"
                      value={profile?.nationality}
                      editing={editing}
                      onChange={(value) => setProfile(prev => ({ ...prev, nationality: value }))}
                    />
                    <InfoField
                      icon={Building}
                      label="Organization"
                      value={profile?.organization}
                      editing={editing}
                      onChange={(value) => setProfile(prev => ({ ...prev, organization: value }))}
                      className="md:col-span-2"
                    />
                    <InfoField
                      icon={MapPin}
                      label="Address"
                      value={profile?.address}
                      editing={editing}
                      onChange={(value) => setProfile(prev => ({ ...prev, address: value }))}
                      className="md:col-span-2"
                    />
                    <InfoField
                      label="City"
                      value={profile?.city}
                      editing={editing}
                      onChange={(value) => setProfile(prev => ({ ...prev, city: value }))}
                    />
                    <InfoField
                      label="Province"
                      value={profile?.province}
                      editing={editing}
                      onChange={(value) => setProfile(prev => ({ ...prev, province: value }))}
                    />
                  </div>
                </div>

                {/* Professional Information */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    Professional Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Skills & Expertise
                      </label>
                      {editing ? (
                        <textarea
                          value={profile?.skills || ''}
                          onChange={(e) => setProfile(prev => ({ ...prev, skills: e.target.value }))}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="text-gray-600">{profile?.skills || 'Not specified'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Languages
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          value={profile?.languages || ''}
                          onChange={(e) => setProfile(prev => ({ ...prev, languages: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="text-gray-600">{profile?.languages || 'Not specified'}</p>
                      )}
                    </div>
                  </div>
                </div>

                {editing && (
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setEditing(false);
                        loadUserProfile(); // Reload original data
                      }}
                      disabled={saving}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      {saving ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <motion.div
                key="documents"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">My Documents</h3>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Document
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleUploadDocument}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </div>

                {/* CV */}
                {profile?.documents?.cv && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-600 rounded-lg">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-1">Curriculum Vitae</h4>
                        <p className="text-sm text-gray-600 mb-2">{profile.documents.cv.fileName}</p>
                        <p className="text-xs text-gray-500">
                          Uploaded: {new Date(profile.documents.cv.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={profile.documents.cv.downloadURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </a>
                        <a
                          href={profile.documents.cv.downloadURL}
                          download
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                        >
                          <Download className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Certificates */}
                {profile?.documents?.certificates && profile.documents.certificates.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Certificates & Qualifications</h4>
                    {profile.documents.certificates.map((cert, index) => (
                      <DocumentCard
                        key={index}
                        document={cert}
                        icon={Award}
                        color="purple"
                        onDelete={() => {}} // Implement if needed
                      />
                    ))}
                  </div>
                )}

                {/* Other Documents */}
                {profile?.documents?.otherDocuments && profile.documents.otherDocuments.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Other Documents</h4>
                    {profile.documents.otherDocuments.map((doc, index) => (
                      <DocumentCard
                        key={index}
                        document={doc}
                        icon={FileText}
                        color="gray"
                        onDelete={() => handleDeleteDocument(doc.storagePath, index)}
                        canDelete={true}
                      />
                    ))}
                  </div>
                )}

                {(!profile?.documents?.otherDocuments || profile.documents.otherDocuments.length === 0) &&
                  (!profile?.documents?.certificates || profile.documents.certificates.length === 0) &&
                  !profile?.documents?.cv && (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">No documents uploaded yet</p>
                    <p className="text-sm mt-2">Upload your documents to complete your profile</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <motion.div
                key="applications"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">My Applications</h3>

                {applications.length > 0 ? (
                  applications.map((app) => (
                    <ApplicationCard key={app.id} application={app} />
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">No applications yet</p>
                    <p className="text-sm mt-2">Start applying to procurement tenders or job vacancies</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Helper Components
const InfoField = ({ icon: Icon, label, value, editing, onChange, className }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {Icon && <Icon className="w-4 h-4 inline mr-2" />}
      {label}
    </label>
    {editing ? (
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    ) : (
      <p className="text-gray-900">{value || 'Not specified'}</p>
    )}
  </div>
);

const DocumentCard = ({ document, icon: Icon, color, onDelete, canDelete }) => {
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100 border-blue-200 bg-blue-600 text-blue-600',
    purple: 'from-purple-50 to-purple-100 border-purple-200 bg-purple-600 text-purple-600',
    gray: 'from-gray-50 to-gray-100 border-gray-200 bg-gray-600 text-gray-600'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-4`}>
      <div className="flex items-start gap-4">
        <div className={`p-2 ${colorClasses[color].split(' ')[2]} rounded-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{document.fileName}</h4>
          <p className="text-xs text-gray-500 mt-1">
            {(document.fileSize / 1024 / 1024).toFixed(2)} MB • Uploaded {new Date(document.uploadedAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href={document.downloadURL}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 ${colorClasses[color].split(' ')[3]} hover:bg-white/50 rounded-lg transition-colors`}
          >
            <Eye className="w-5 h-5" />
          </a>
          <a
            href={document.downloadURL}
            download
            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
          >
            <Download className="w-5 h-5" />
          </a>
          {canDelete && (
            <button
              onClick={onDelete}
              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ApplicationCard = ({ application }) => {
  const statusColors = {
    submitted: 'bg-blue-100 text-blue-700',
    under_review: 'bg-yellow-100 text-yellow-700',
    shortlisted: 'bg-green-100 text-green-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    interviewed: 'bg-purple-100 text-purple-700'
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
              application.type === 'procurement' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
            }`}>
              {application.type}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              statusColors[application.status] || 'bg-gray-100 text-gray-700'
            }`}>
              {application.status.replace('_', ' ')}
            </span>
          </div>
          <h4 className="text-lg font-bold text-gray-900">{application.title || application.jobTitle || 'Application'}</h4>
          <p className="text-sm text-gray-600 mt-1">
            Application ID: {application.applicationId}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Submitted: {new Date(application.submittedAt).toLocaleString()}
          </p>
        </div>
      </div>
      {application.notes && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">{application.notes}</p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
