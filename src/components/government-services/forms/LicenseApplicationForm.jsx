import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { X, Send, Ship, Anchor, Factory, Award, Building } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { useFirebaseAuth } from '../../../contexts/FirebaseAuthContext';
import DocumentUploader from '../DocumentUploader';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Validation Schema
const schema = yup.object().shape({
  licenseType: yup.string().required('License type is required'),
  applicantName: yup.string().required('Applicant name is required').min(3, 'Minimum 3 characters'),
  applicantNIC: yup.string().required('NIC is required').matches(/^[0-9]{9}[vVxX]$|^[0-9]{12}$/, 'Invalid NIC format'),
  applicantAddress: yup.string().required('Address is required'),
  contactEmail: yup.string().email('Invalid email').required('Email is required'),
  contactPhone: yup.string().required('Phone is required').matches(/^[0-9]{10}$/, 'Must be 10 digits'),
  businessName: yup.string().when('licenseType', {
    is: (val) => val === 'industrial',
    then: (schema) => schema.required('Business name is required for industrial licenses'),
    otherwise: (schema) => schema
  }),
  businessRegNo: yup.string().when('licenseType', {
    is: (val) => val === 'industrial',
    then: (schema) => schema.required('Business registration number is required'),
    otherwise: (schema) => schema
  }),
  vesselName: yup.string().when('licenseType', {
    is: (val) => val === 'fishing' || val === 'anchoring',
    then: (schema) => schema.required('Vessel name is required'),
    otherwise: (schema) => schema
  }),
  vesselRegNo: yup.string().when('licenseType', {
    is: (val) => val === 'fishing' || val === 'anchoring',
    then: (schema) => schema.required('Vessel registration number is required'),
    otherwise: (schema) => schema
  }),
  operationArea: yup.string().required('Operation area is required'),
  operationDescription: yup.string().required('Operation description is required').min(50, 'Minimum 50 characters')
});

const LicenseApplicationForm = ({ onClose, onSuccess, preSelectedType = null }) => {
  const { user } = useFirebaseAuth();
  const [submitting, setSubmitting] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [validFrom, setValidFrom] = useState(new Date());
  const [selectedType, setSelectedType] = useState(preSelectedType || '');

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      licenseType: preSelectedType || ''
    }
  });

  const licenseTypes = [
    {
      id: 'fishing',
      name: 'Fishing License',
      icon: Ship,
      color: 'from-blue-400 to-blue-600',
      description: 'For commercial fishing operations',
      requiredDocs: ['Vessel Registration', 'Boat Certificate', 'Owner ID'],
      fee: 5000
    },
    {
      id: 'anchoring',
      name: 'Anchoring License',
      icon: Anchor,
      color: 'from-cyan-400 to-cyan-600',
      description: 'For vessel anchoring permits',
      requiredDocs: ['Vessel Registration', 'Insurance Certificate', 'Location Map'],
      fee: 3000
    },
    {
      id: 'industrial',
      name: 'Industrial License',
      icon: Factory,
      color: 'from-green-400 to-green-600',
      description: 'For marine industrial activities',
      requiredDocs: ['Business Registration', 'Environmental Clearance', 'Site Plan'],
      fee: 15000
    }
  ];

  const watchedLicenseType = watch('licenseType');

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      // Validate documents
      if (uploadedDocuments.length === 0) {
        toast.error('Please upload required documents');
        setSubmitting(false);
        return;
      }

      const selectedLicenseInfo = licenseTypes.find(lt => lt.id === data.licenseType);

      // Prepare application data
      const applicationData = {
        ...data,
        validFrom: validFrom.toISOString(),
        validUntil: new Date(validFrom.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year validity
        documents: uploadedDocuments,
        userId: user?.uid || 'anonymous',
        userEmail: user?.email || data.contactEmail,
        status: 'pending',
        licenseNumber: null, // Assigned after approval
        applicationId: `LIC-${data.licenseType.toUpperCase()}-${Date.now()}`,
        licenseFee: selectedLicenseInfo?.fee || 0,
        paymentStatus: 'pending',
        submittedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Save to Firestore
      const docRef = await addDoc(collection(db, 'license_applications'), applicationData);

      toast.success(`${selectedLicenseInfo?.name} application submitted successfully!`);
      
      if (onSuccess) {
        onSuccess({ id: docRef.id, ...applicationData });
      }

      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error) {
      console.error('Error submitting license application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDocumentUpload = (files) => {
    setUploadedDocuments(files);
  };

  const handleTypeSelect = (typeId) => {
    setSelectedType(typeId);
    setValue('licenseType', typeId);
  };

  const selectedLicense = licenseTypes.find(lt => lt.id === watchedLicenseType);

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
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-gradient-to-r from-purple-600 to-pink-600 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Award className="w-7 h-7" />
              Digital License Application
            </h2>
            <p className="text-purple-100 text-sm mt-1">Apply for marine operation licenses</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
          {/* License Type Selection */}
          {!preSelectedType && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">Select License Type *</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {licenseTypes.map((type) => (
                  <motion.button
                    key={type.id}
                    type="button"
                    onClick={() => handleTypeSelect(type.id)}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                      watchedLicenseType === type.id
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-white/10 bg-white/5 hover:border-white/30'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-4`}>
                      <type.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-bold text-white mb-2">{type.name}</h4>
                    <p className="text-sm text-slate-400 mb-3">{type.description}</p>
                    <div className="text-xs text-slate-500">
                      Fee: LKR {type.fee.toLocaleString()}
                    </div>
                    {watchedLicenseType === type.id && (
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
              <input type="hidden" {...register('licenseType')} />
              {errors.licenseType && (
                <p className="text-red-400 text-sm">{errors.licenseType.message}</p>
              )}
            </div>
          )}

          {/* Show form only after license type is selected */}
          {watchedLicenseType && (
            <>
              {/* Selected License Info */}
              {selectedLicense && (
                <div className={`p-6 rounded-xl bg-gradient-to-br ${selectedLicense.color} bg-opacity-10 border border-white/10`}>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${selectedLicense.color}`}>
                      <selectedLicense.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white mb-2">{selectedLicense.name}</h4>
                      <p className="text-sm text-slate-300 mb-3">Required Documents:</p>
                      <ul className="text-sm text-slate-400 space-y-1">
                        {selectedLicense.requiredDocs.map((doc, idx) => (
                          <li key={idx}>• {doc}</li>
                        ))}
                      </ul>
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-sm text-slate-300">
                          <strong>License Fee:</strong> LKR {selectedLicense.fee.toLocaleString()}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">Valid for 1 year from issue date</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Applicant Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Applicant Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      {...register('applicantName')}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      placeholder="Enter full name"
                    />
                    {errors.applicantName && (
                      <p className="text-red-400 text-xs mt-1">{errors.applicantName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      NIC Number *
                    </label>
                    <input
                      {...register('applicantNIC')}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      placeholder="123456789V or 123456789012"
                    />
                    {errors.applicantNIC && (
                      <p className="text-red-400 text-xs mt-1">{errors.applicantNIC.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Address *
                  </label>
                  <textarea
                    {...register('applicantAddress')}
                    rows={2}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                    placeholder="Full address"
                  />
                  {errors.applicantAddress && (
                    <p className="text-red-400 text-xs mt-1">{errors.applicantAddress.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      {...register('contactEmail')}
                      type="email"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      placeholder="email@example.com"
                    />
                    {errors.contactEmail && (
                      <p className="text-red-400 text-xs mt-1">{errors.contactEmail.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      {...register('contactPhone')}
                      type="tel"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      placeholder="07XXXXXXXX"
                    />
                    {errors.contactPhone && (
                      <p className="text-red-400 text-xs mt-1">{errors.contactPhone.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Vessel/Business Information */}
              {(watchedLicenseType === 'fishing' || watchedLicenseType === 'anchoring') && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Ship className="w-5 h-5 text-cyan-400" />
                    Vessel Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Vessel Name *
                      </label>
                      <input
                        {...register('vesselName')}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        placeholder="Enter vessel name"
                      />
                      {errors.vesselName && (
                        <p className="text-red-400 text-xs mt-1">{errors.vesselName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Vessel Registration Number *
                      </label>
                      <input
                        {...register('vesselRegNo')}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        placeholder="Registration number"
                      />
                      {errors.vesselRegNo && (
                        <p className="text-red-400 text-xs mt-1">{errors.vesselRegNo.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {watchedLicenseType === 'industrial' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Building className="w-5 h-5 text-green-400" />
                    Business Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Business Name *
                      </label>
                      <input
                        {...register('businessName')}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        placeholder="Enter business name"
                      />
                      {errors.businessName && (
                        <p className="text-red-400 text-xs mt-1">{errors.businessName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Business Registration Number *
                      </label>
                      <input
                        {...register('businessRegNo')}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        placeholder="BR number"
                      />
                      {errors.businessRegNo && (
                        <p className="text-red-400 text-xs mt-1">{errors.businessRegNo.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Operation Details */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Operation Details</h3>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Operation Area *
                  </label>
                  <input
                    {...register('operationArea')}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="E.g., Colombo coastal waters, Trincomalee harbor"
                  />
                  {errors.operationArea && (
                    <p className="text-red-400 text-xs mt-1">{errors.operationArea.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Operation Description *
                  </label>
                  <textarea
                    {...register('operationDescription')}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                    placeholder="Describe your operation in detail (minimum 50 characters)"
                  />
                  {errors.operationDescription && (
                    <p className="text-red-400 text-xs mt-1">{errors.operationDescription.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    License Valid From *
                  </label>
                  <DatePicker
                    selected={validFrom}
                    onChange={(date) => setValidFrom(date)}
                    minDate={new Date()}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    dateFormat="yyyy-MM-dd"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Valid until: {new Date(validFrom.getTime() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Documents */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Required Documents *</h3>
                <p className="text-sm text-slate-400">
                  Upload all required documents listed above
                </p>
                <DocumentUploader
                  onUploadComplete={handleDocumentUpload}
                  category={`license_${watchedLicenseType}`}
                  maxFiles={10}
                  maxSizeMB={10}
                />
              </div>

              {/* Fee Information */}
              {selectedLicense && (
                <div className="p-6 rounded-xl bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/30">
                  <h4 className="font-bold text-white mb-2">Payment Information</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">License Fee:</span>
                    <span className="text-2xl font-bold text-amber-400">
                      LKR {selectedLicense.fee.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Payment instructions will be sent after application approval
                  </p>
                </div>
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
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
            </>
          )}
        </form>
      </motion.div>
    </motion.div>
  );
};

export default LicenseApplicationForm;
