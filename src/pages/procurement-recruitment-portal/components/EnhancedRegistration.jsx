import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, Building, CreditCard, Lock, Upload,
  FileText, CheckCircle, AlertCircle, X, Loader, ChevronRight,
  ChevronLeft, Info
} from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../config/firebase';
import { authService } from '../../../services/procurementRecruitmentService';

const EnhancedRegistration = ({ onClose, onSuccess, translations }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    nic: '',
    accountType: 'individual',
    password: '',
    confirmPassword: '',
  });

  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cvInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleCvUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('CV file must be less than 5MB');
        return;
      }
      setCvFile(file);
      setError(null);
    }
  };

  const uploadCvToFirebase = async (file) => {
    try {
      const userId = `USER-${Date.now()}`;
      const fileName = `${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `users/${userId}/cv/${fileName}`);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      return {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        downloadURL,
        storagePath: `users/${userId}/cv/${fileName}`,
        uploadedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('CV upload error:', error);
      throw new Error('Failed to upload CV. Please try again.');
    }
  };

  const validateStep1 = () => {
    if (!formData.firstName || !formData.lastName) {
      setError('Please enter your full name');
      return false;
    }
    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.phone || formData.phone.length < 10) {
      setError('Please enter a valid phone number');
      return false;
    }
    if (!formData.nic) {
      setError('Please enter your NIC number');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.password || formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!cvFile) {
      setError('Please upload your CV/Resume');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      setError(null);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
      setError(null);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep3()) return;

    setLoading(true);
    setError(null);

    try {
      // Upload CV to Firebase Storage
      const uploadedCv = await uploadCvToFirebase(cvFile);

      // Register user with all data
      const registrationData = {
        ...formData,
        documents: {
          cv: uploadedCv
        },
        userId: `USER-${Date.now()}`,
        registeredAt: new Date().toISOString(),
        profileComplete: true
      };

      const response = await authService.register(registrationData);

      if (response.success) {
        onSuccess(response.user);
      } else {
        setError(response.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Simple Header */}
        <div className="bg-blue-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Create Your Account</h2>
              <p className="text-blue-100 text-sm mt-1">Join NARA Partner Network</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Simple Step Indicator */}
          <div className="flex items-center gap-2">
            <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-white' : 'bg-white/30'}`} />
            <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-white' : 'bg-white/30'}`} />
            <div className={`flex-1 h-2 rounded-full ${step >= 3 ? 'bg-white' : 'bg-white/30'}`} />
          </div>
          <p className="text-sm text-blue-100 mt-2">
            Step {step} of 3: {step === 1 ? 'Basic Information' : step === 2 ? 'Security' : 'Upload CV'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900">Error</h4>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* STEP 1: Basic Information */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <p className="text-sm text-blue-800">
                      Please enter your basic information. All fields are required.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Enter your first name"
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Enter your last name"
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+94 XX XXX XXXX"
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
                      />
                    </div>
                  </div>

                  {/* NIC */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      NIC Number *
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="nic"
                        required
                        value={formData.nic}
                        onChange={handleInputChange}
                        placeholder="XXXXXXXXXV or XXXXXXXXXXXX"
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
                      />
                    </div>
                  </div>

                  {/* Organization (Optional) */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Organization (Optional)
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="organization"
                        value={formData.organization}
                        onChange={handleInputChange}
                        placeholder="Your company or organization"
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
                      />
                    </div>
                  </div>

                  {/* Account Type */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Account Type *
                    </label>
                    <select
                      name="accountType"
                      required
                      value={formData.accountType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
                    >
                      <option value="individual">Individual Applicant</option>
                      <option value="vendor">Vendor / Supplier</option>
                      <option value="consultant">Consultant</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Security */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <p className="text-sm text-blue-800">
                      Create a secure password. Must be at least 8 characters long.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Create a secure password"
                        minLength={8}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">At least 8 characters</p>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        name="confirmPassword"
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Re-enter your password"
                        minLength={8}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Upload CV */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <p className="text-sm text-blue-800">
                      Upload your CV or Resume (PDF, DOC, or DOCX - Max 5MB)
                    </p>
                  </div>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                  {!cvFile ? (
                    <>
                      <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="w-8 h-8 text-blue-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Upload Your CV/Resume
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Click the button below to select your CV file
                      </p>
                      <input
                        ref={cvInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleCvUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => cvInputRef.current?.click()}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium inline-flex items-center gap-2"
                      >
                        <Upload className="w-5 h-5" />
                        Choose File
                      </button>
                      <p className="text-xs text-gray-500 mt-3">
                        Supported formats: PDF, DOC, DOCX (Max 5MB)
                      </p>
                    </>
                  ) : (
                    <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6">
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                        <div className="text-left">
                          <h4 className="font-semibold text-green-900">File Uploaded Successfully!</h4>
                          <p className="text-sm text-green-700">{cvFile.name}</p>
                          <p className="text-xs text-green-600 mt-1">
                            Size: {(cvFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setCvFile(null);
                          if (cvInputRef.current) cvInputRef.current.value = '';
                        }}
                        className="text-sm text-green-700 hover:text-green-900 font-medium underline"
                      >
                        Remove and choose a different file
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-3 mt-8 pt-6 border-t">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50 inline-flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="ml-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium inline-flex items-center gap-2"
              >
                Next Step
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || !cvFile}
                className="ml-auto px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 inline-flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Complete Registration
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EnhancedRegistration;
