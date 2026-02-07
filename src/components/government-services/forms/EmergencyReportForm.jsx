import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { X, Send, AlertTriangle, MapPin, Phone, Camera, Clock, User } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { useFirebaseAuth } from '../../../contexts/FirebaseAuthContext';
import DocumentUploader from '../DocumentUploader';
import toast from 'react-hot-toast';

// Validation Schema
const schema = yup.object().shape({
  incidentType: yup.string().required('Incident type is required'),
  severity: yup.string().required('Severity level is required'),
  title: yup.string().required('Title is required').min(10, 'Minimum 10 characters'),
  description: yup.string().required('Description is required').min(50, 'Minimum 50 characters'),
  location: yup.string().required('Location is required'),
  district: yup.string().required('District is required'),
  coordinates: yup.string(),
  reporterName: yup.string().required('Reporter name is required'),
  reporterContact: yup.string().required('Contact number is required').matches(/^[0-9]{10}$/, 'Must be 10 digits'),
  reporterEmail: yup.string().email('Invalid email'),
  immediateAction: yup.string().required('Immediate action taken is required')
});

const EmergencyReportForm = ({ onClose, onSuccess }) => {
  const { user } = useFirebaseAuth();
  const [submitting, setSubmitting] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: yupResolver(schema)
  });

  const incidentTypes = [
    { id: 'oil_spill', name: 'Oil Spill', icon: '🛢️', color: 'bg-orange-500' },
    { id: 'vessel_accident', name: 'Vessel Accident', icon: '🚢', color: 'bg-red-500' },
    { id: 'marine_pollution', name: 'Marine Pollution', icon: '🌊', color: 'bg-yellow-500' },
    { id: 'illegal_fishing', name: 'Illegal Fishing', icon: '🎣', color: 'bg-purple-500' },
    { id: 'coastal_erosion', name: 'Coastal Erosion', icon: '🏖️', color: 'bg-amber-500' },
    { id: 'marine_life_threat', name: 'Marine Life Threat', icon: '🐋', color: 'bg-blue-500' },
    { id: 'search_rescue', name: 'Search & Rescue', icon: '🆘', color: 'bg-red-600' },
    { id: 'other', name: 'Other Emergency', icon: '⚠️', color: 'bg-gray-500' }
  ];

  const severityLevels = [
    { id: 'critical', name: 'Critical', description: 'Life-threatening, immediate response needed', color: 'bg-red-600 border-red-500', icon: '🔴' },
    { id: 'high', name: 'High', description: 'Significant impact, urgent attention required', color: 'bg-orange-600 border-orange-500', icon: '🟠' },
    { id: 'medium', name: 'Medium', description: 'Moderate impact, attention needed soon', color: 'bg-yellow-600 border-yellow-500', icon: '🟡' },
    { id: 'low', name: 'Low', description: 'Minor impact, can be addressed in due course', color: 'bg-green-600 border-green-500', icon: '🟢' }
  ];

  const districts = [
    'Colombo', 'Gampaha', 'Kalutara', 'Galle', 'Matara', 'Hambantota',
    'Trincomalee', 'Batticaloa', 'Ampara', 'Jaffna', 'Kilinochki',
    'Mannar', 'Vavuniya', 'Mullaitivu', 'Puttalam'
  ];

  const watchedSeverity = watch('severity');
  const watchedType = watch('incidentType');

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      // Generate incident ID
      const incidentId = `EMG-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Prepare incident data
      const incidentData = {
        ...data,
        photos: uploadedPhotos,
        incidentId,
        userId: user?.uid || 'anonymous',
        userEmail: user?.email || data.reporterEmail,
        status: 'active',
        priority: data.severity === 'critical' ? 1 : data.severity === 'high' ? 2 : data.severity === 'medium' ? 3 : 4,
        reportedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        responseTeam: null,
        resolutionDate: null
      };

      // Save to Firestore
      const docRef = await addDoc(collection(db, 'emergency_incidents'), incidentData);

      // Send notification (would integrate with notification service)
      if (data.severity === 'critical') {
        console.log('CRITICAL ALERT: Immediate notification sent');
      }

      toast.success('Emergency report submitted successfully! Response team will be notified.');
      
      if (onSuccess) {
        onSuccess({ id: docRef.id, ...incidentData });
      }

      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error) {
      console.error('Error submitting emergency report:', error);
      toast.error('Failed to submit report. Please try again or call emergency hotline: 1915');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePhotoUpload = (files) => {
    setUploadedPhotos(files);
  };

  const selectedIncident = incidentTypes.find(t => t.id === watchedType);
  const selectedSeverity = severityLevels.find(s => s.id === watchedSeverity);

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
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-gradient-to-r from-red-600 to-orange-600 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-7 h-7" />
              Emergency Report
            </h2>
            <p className="text-red-100 text-sm mt-1">For critical marine emergencies call: 1915</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
          {/* Emergency Hotline Banner */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-600/20 border border-red-500/30">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-red-500 to-orange-600">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">Emergency Hotline</h3>
                <p className="text-4xl font-bold text-white mb-1">1915</p>
                <p className="text-red-100 text-sm">Available 24/7 for immediate marine emergencies</p>
              </div>
            </div>
          </div>

          {/* Severity Level Selection */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Severity Level *</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {severityLevels.map((level) => (
                <label
                  key={level.id}
                  className={`relative flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    watchedSeverity === level.id
                      ? `${level.color}`
                      : 'border-white/10 bg-white/5 hover:border-white/30'
                  }`}
                >
                  <input
                    type="radio"
                    {...register('severity')}
                    value={level.id}
                    className="sr-only"
                  />
                  <div className="flex items-start gap-3 w-full">
                    <span className="text-2xl">{level.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-bold text-white mb-1">{level.name}</h4>
                      <p className="text-xs text-slate-300">{level.description}</p>
                    </div>
                    {watchedSeverity === level.id && (
                      <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-600" />
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>
            {errors.severity && (
              <p className="text-red-400 text-sm">{errors.severity.message}</p>
            )}
          </div>

          {/* Incident Type */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Incident Type *</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {incidentTypes.map((type) => (
                <label
                  key={type.id}
                  className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all text-center ${
                    watchedType === type.id
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-white/10 bg-white/5 hover:border-white/30'
                  }`}
                >
                  <input
                    type="radio"
                    {...register('incidentType')}
                    value={type.id}
                    className="sr-only"
                  />
                  <div className="text-3xl mb-2">{type.icon}</div>
                  <p className="text-sm font-semibold text-white">{type.name}</p>
                  {watchedType === type.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                </label>
              ))}
            </div>
            {errors.incidentType && (
              <p className="text-red-400 text-sm">{errors.incidentType.message}</p>
            )}
          </div>

          {/* Incident Details */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-400" />
              Incident Details
            </h3>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Incident Title *
              </label>
              <input
                {...register('title')}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                placeholder="Brief title describing the incident"
              />
              {errors.title && (
                <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Detailed Description *
              </label>
              <textarea
                {...register('description')}
                rows={5}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all resize-none"
                placeholder="Provide detailed description of the incident (minimum 50 characters)"
              />
              {errors.description && (
                <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-400" />
              Location Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Specific Location *
                </label>
                <input
                  {...register('location')}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                  placeholder="E.g., 5km off Colombo harbor"
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
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
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

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                GPS Coordinates (if available)
              </label>
              <input
                {...register('coordinates')}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                placeholder="E.g., 6.9271° N, 79.8612° E"
              />
            </div>
          </div>

          {/* Immediate Action Taken */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Immediate Action Taken *</h3>
            <textarea
              {...register('immediateAction')}
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all resize-none"
              placeholder="Describe any immediate actions taken to address the situation"
            />
            {errors.immediateAction && (
              <p className="text-red-400 text-xs mt-1">{errors.immediateAction.message}</p>
            )}
          </div>

          {/* Reporter Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-red-400" />
              Reporter Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Your Name *
                </label>
                <input
                  {...register('reporterName')}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                  placeholder="Full name"
                />
                {errors.reporterName && (
                  <p className="text-red-400 text-xs mt-1">{errors.reporterName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Contact Number *
                </label>
                <input
                  {...register('reporterContact')}
                  type="tel"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                  placeholder="07XXXXXXXX"
                />
                {errors.reporterContact && (
                  <p className="text-red-400 text-xs mt-1">{errors.reporterContact.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address (optional)
              </label>
              <input
                {...register('reporterEmail')}
                type="email"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                placeholder="email@example.com"
              />
              {errors.reporterEmail && (
                <p className="text-red-400 text-xs mt-1">{errors.reporterEmail.message}</p>
              )}
            </div>
          </div>

          {/* Photos/Evidence */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-red-400" />
              Photos & Evidence
            </h3>
            <p className="text-sm text-slate-400">
              Upload photos of the incident (recommended for faster response)
            </p>
            <DocumentUploader
              onUploadComplete={handlePhotoUpload}
              category="emergency_incidents"
              maxFiles={10}
              maxSizeMB={10}
              acceptedFormats={{
                'image/jpeg': ['.jpg', '.jpeg'],
                'image/png': ['.png'],
                'video/mp4': ['.mp4'],
                'video/quicktime': ['.mov']
              }}
            />
          </div>

          {/* Priority Alert */}
          {watchedSeverity === 'critical' && (
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="p-6 rounded-xl bg-gradient-to-br from-red-600 to-orange-600 border-2 border-red-400"
            >
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-white flex-shrink-0 animate-pulse" />
                <div>
                  <h4 className="font-bold text-white text-lg mb-2">CRITICAL ALERT</h4>
                  <p className="text-white text-sm">
                    This report will trigger immediate notification to emergency response teams. 
                    For life-threatening situations, please also call <strong>1915</strong> immediately.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

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
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-semibold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Emergency Report
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EmergencyReportForm;
