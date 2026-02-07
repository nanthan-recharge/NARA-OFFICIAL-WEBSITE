import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { X, Save, Send, MapPin, Calendar, DollarSign } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { useFirebaseAuth } from '../../../contexts/FirebaseAuthContext';
import DocumentUploader from '../DocumentUploader';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Validation Schema
const schema = yup.object().shape({
  projectName: yup.string().required('Project name is required').min(3, 'Minimum 3 characters'),
  projectType: yup.string().required('Project type is required'),
  description: yup.string().required('Description is required').min(50, 'Minimum 50 characters'),
  location: yup.string().required('Location is required'),
  district: yup.string().required('District is required'),
  estimatedBudget: yup.number().required('Budget is required').positive('Must be positive'),
  projectDuration: yup.number().required('Duration is required').positive('Must be positive'),
  applicantName: yup.string().required('Applicant name is required'),
  applicantOrganization: yup.string().required('Organization is required'),
  contactEmail: yup.string().email('Invalid email').required('Email is required'),
  contactPhone: yup.string().required('Phone is required').matches(/^[0-9]{10}$/, 'Must be 10 digits'),
  environmentalImpact: yup.string().required('Environmental impact description is required').min(100, 'Minimum 100 characters'),
  mitigationMeasures: yup.string().required('Mitigation measures are required').min(50, 'Minimum 50 characters')
});

const EIAApplicationForm = ({ onClose, onSuccess }) => {
  const { user } = useFirebaseAuth();
  const [submitting, setSubmitting] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: yupResolver(schema)
  });

  const projectTypes = [
    'Coastal Development',
    'Marine Infrastructure',
    'Aquaculture Facility',
    'Industrial Discharge',
    'Port Development',
    'Fishing Operations',
    'Tourism Development',
    'Research Activity',
    'Other'
  ];

  const districts = [
    'Colombo', 'Gampaha', 'Kalutara', 'Galle', 'Matara', 'Hambantota',
    'Trincomalee', 'Batticaloa', 'Ampara', 'Jaffna', 'Kilinochchi',
    'Mannar', 'Vavuniya', 'Mullaitivu', 'Puttalam'
  ];

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      // Validate documents
      if (uploadedDocuments.length === 0) {
        toast.error('Please upload at least one supporting document');
        setSubmitting(false);
        return;
      }

      // Prepare application data
      const applicationData = {
        ...data,
        startDate: startDate.toISOString(),
        endDate: endDate ? endDate.toISOString() : null,
        documents: uploadedDocuments,
        userId: user?.uid || 'anonymous',
        userEmail: user?.email || data.contactEmail,
        status: 'pending',
        applicationId: `EIA-${Date.now()}`,
        submittedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Save to Firestore
      const docRef = await addDoc(collection(db, 'eia_applications'), applicationData);

      toast.success('EIA Application submitted successfully!');
      
      if (onSuccess) {
        onSuccess({ id: docRef.id, ...applicationData });
      }

      // Close form after short delay
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error) {
      console.error('Error submitting EIA application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDocumentUpload = (files) => {
    setUploadedDocuments(files);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl border border-white/10"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-gradient-to-r from-cyan-600 to-blue-600 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold text-white">Environmental Impact Assessment Application</h2>
            <p className="text-cyan-100 text-sm mt-1">Complete all required fields</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
          {/* Project Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-400" />
              Project Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Project Name *
                </label>
                <input
                  {...register('projectName')}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  placeholder="Enter project name"
                />
                {errors.projectName && (
                  <p className="text-red-400 text-xs mt-1">{errors.projectName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Project Type *
                </label>
                <select
                  {...register('projectType')}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                >
                  <option value="">Select project type</option>
                  {projectTypes.map(type => (
                    <option key={type} value={type} className="bg-slate-800">{type}</option>
                  ))}
                </select>
                {errors.projectType && (
                  <p className="text-red-400 text-xs mt-1">{errors.projectType.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Project Description *
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
                placeholder="Describe your project in detail (minimum 50 characters)"
              />
              {errors.description && (
                <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Location *
                </label>
                <input
                  {...register('location')}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  placeholder="Specific location"
                />
                {errors.location && (
                  <p className="text-red-400 text-xs mt-1">{errors.location.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  District *
                </label>
                <select
                  {...register('district')}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                >
                  <option value="">Select district</option>
                  {districts.map(district => (
                    <option key={district} value={district} className="bg-slate-800">{district}</option>
                  ))}
                </select>
                {errors.district && (
                  <p className="text-red-400 text-xs mt-1">{errors.district.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Estimated Budget (LKR) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    {...register('estimatedBudget')}
                    type="number"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    placeholder="0.00"
                  />
                </div>
                {errors.estimatedBudget && (
                  <p className="text-red-400 text-xs mt-1">{errors.estimatedBudget.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Project Duration (months) *
                </label>
                <input
                  {...register('projectDuration')}
                  type="number"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  placeholder="Duration in months"
                />
                {errors.projectDuration && (
                  <p className="text-red-400 text-xs mt-1">{errors.projectDuration.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Expected Start Date *
                </label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  minDate={new Date()}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  dateFormat="yyyy-MM-dd"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Expected End Date
                </label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  minDate={startDate}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select end date"
                />
              </div>
            </div>
          </div>

          {/* Environmental Impact */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Environmental Impact Assessment</h3>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Environmental Impact Description *
              </label>
              <textarea
                {...register('environmentalImpact')}
                rows={5}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
                placeholder="Describe the potential environmental impacts (minimum 100 characters)"
              />
              {errors.environmentalImpact && (
                <p className="text-red-400 text-xs mt-1">{errors.environmentalImpact.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Mitigation Measures *
              </label>
              <textarea
                {...register('mitigationMeasures')}
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
                placeholder="Describe mitigation measures (minimum 50 characters)"
              />
              {errors.mitigationMeasures && (
                <p className="text-red-400 text-xs mt-1">{errors.mitigationMeasures.message}</p>
              )}
            </div>
          </div>

          {/* Applicant Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Applicant Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Applicant Name *
                </label>
                <input
                  {...register('applicantName')}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  placeholder="Full name"
                />
                {errors.applicantName && (
                  <p className="text-red-400 text-xs mt-1">{errors.applicantName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Organization *
                </label>
                <input
                  {...register('applicantOrganization')}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  placeholder="Organization name"
                />
                {errors.applicantOrganization && (
                  <p className="text-red-400 text-xs mt-1">{errors.applicantOrganization.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Contact Email *
                </label>
                <input
                  {...register('contactEmail')}
                  type="email"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  placeholder="email@example.com"
                />
                {errors.contactEmail && (
                  <p className="text-red-400 text-xs mt-1">{errors.contactEmail.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Contact Phone *
                </label>
                <input
                  {...register('contactPhone')}
                  type="tel"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  placeholder="07XXXXXXXX"
                />
                {errors.contactPhone && (
                  <p className="text-red-400 text-xs mt-1">{errors.contactPhone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Supporting Documents *</h3>
            <p className="text-sm text-slate-400">Upload relevant documents (PDF, DOC, DOCX, images)</p>
            <DocumentUploader
              onUploadComplete={handleDocumentUpload}
              category="eia_applications"
              maxFiles={10}
              maxSizeMB={10}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Application
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EIAApplicationForm;
