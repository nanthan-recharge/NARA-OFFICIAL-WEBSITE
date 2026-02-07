import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLibraryUser } from '../../contexts/LibraryUserContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  Loader2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Microscope,
  CheckCircle,
  Library,
  Building2,
  IdCard,
  FlaskConical,
  Link2,
  Shield,
  Check
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TIERS = [
  {
    id: 'public',
    icon: BookOpen,
    color: 'emerald',
    features: [
      'Borrow up to 3 items',
      '7-day loan period',
      'Access public catalogue',
      'Online reservations',
      'Reading room access'
    ]
  },
  {
    id: 'student',
    icon: GraduationCap,
    color: 'blue',
    features: [
      'Borrow up to 5 items',
      '14-day loan period',
      'Access academic databases',
      'Study room booking',
      'Inter-library loan requests',
      'Digital resource access'
    ]
  },
  {
    id: 'researcher',
    icon: Microscope,
    color: 'purple',
    features: [
      'Borrow up to 10 items',
      '30-day loan period',
      'Premium database access',
      'Submit research papers',
      'Private research carrel',
      'Archive & special collections',
      'Priority interlibrary loans'
    ]
  }
];

const TIER_COLORS = {
  emerald: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    activeBorder: 'border-emerald-500',
    ring: 'ring-emerald-500/20',
    text: 'text-emerald-700',
    icon: 'text-emerald-600',
    badge: 'bg-emerald-100 text-emerald-800',
    check: 'text-emerald-500'
  },
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    activeBorder: 'border-blue-500',
    ring: 'ring-blue-500/20',
    text: 'text-blue-700',
    icon: 'text-blue-600',
    badge: 'bg-blue-100 text-blue-800',
    check: 'text-blue-500'
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    activeBorder: 'border-purple-500',
    ring: 'ring-purple-500/20',
    text: 'text-purple-700',
    icon: 'text-purple-600',
    badge: 'bg-purple-100 text-purple-800',
    check: 'text-purple-500'
  }
};

const LibraryRegister = () => {
  const navigate = useNavigate();
  const { register, signInWithGoogle, error, setError } = useLibraryUser();
  const { t } = useTranslation('libraryAuth');

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    university: '',
    studentId: '',
    institution: '',
    researchArea: '',
    orcid: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (error) setError(null);
  };

  const validateStep2 = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Please enter a valid email';
    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';

    if (selectedTier === 'student') {
      if (!formData.university.trim()) errors.university = 'University is required for students';
      if (!formData.studentId.trim()) errors.studentId = 'Student ID is required';
    }
    if (selectedTier === 'researcher') {
      if (!formData.institution.trim()) errors.institution = 'Institution is required for researchers';
      if (!formData.researchArea.trim()) errors.researchArea = 'Research area is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && selectedTier) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!acceptTerms) return;
    setError(null);
    try {
      setLoading(true);
      const profileData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        institution: selectedTier === 'student' ? formData.university : formData.institution,
        studentId: formData.studentId,
        researchArea: formData.researchArea,
        orcid: formData.orcid
      };
      await register(formData.email, formData.password, selectedTier, profileData);
      navigate('/library-dashboard?welcome=true');
    } catch (err) {
      console.error('Registration error:', err);
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!selectedTier) return;
    try {
      setGoogleLoading(true);
      setError(null);
      await signInWithGoogle(selectedTier);
      navigate('/library-dashboard?welcome=true');
    } catch (err) {
      console.error('Google sign-in error:', err);
    } finally {
      setGoogleLoading(false);
    }
  };

  const tierLabels = {
    public: t('register.tiers.public.name', { defaultValue: 'Free Reader' }),
    student: t('register.tiers.student.name', { defaultValue: 'Student' }),
    researcher: t('register.tiers.researcher.name', { defaultValue: 'Researcher' })
  };

  const tierDescriptions = {
    public: t('register.tiers.public.desc', { defaultValue: 'Perfect for casual readers and the general public' }),
    student: t('register.tiers.student.desc', { defaultValue: 'For university and college students' }),
    researcher: t('register.tiers.researcher.desc', { defaultValue: 'For academics and research professionals' })
  };

  const renderInput = (name, label, type = 'text', icon, placeholder, required = true) => {
    const IconComponent = icon;
    const isPasswordField = type === 'password';
    const showPw = name === 'password' ? showPassword : showConfirmPassword;
    const togglePw = name === 'password'
      ? () => setShowPassword(!showPassword)
      : () => setShowConfirmPassword(!showConfirmPassword);

    return (
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
        <div className="relative">
          <IconComponent className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type={isPasswordField ? (showPw ? 'text' : 'password') : type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            required={required}
            className={`w-full pl-11 ${isPasswordField ? 'pr-12' : 'pr-4'} py-3 bg-slate-50 border ${
              formErrors[name] ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 focus:ring-[#0066CC]/20 focus:border-[#0066CC]'
            } rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 outline-none transition-all`}
            placeholder={placeholder}
          />
          {isPasswordField && (
            <button
              type="button"
              onClick={togglePw}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
        </div>
        {formErrors[name] && (
          <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {formErrors[name]}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="border-b border-slate-100 bg-white sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/library" className="flex items-center gap-2 text-slate-500 hover:text-[#003366] transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#003366] flex items-center justify-center">
                <Library className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-[#003366] text-sm">NARA Library</span>
            </div>
          </div>
          <p className="text-sm text-slate-500">
            {t('register.links.haveAccount', { defaultValue: 'Already a member?' })}{' '}
            <Link to="/library-login" className="text-[#0066CC] font-semibold hover:text-[#003366]">
              {t('register.links.signIn', { defaultValue: 'Sign in' })}
            </Link>
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-10">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    step > s
                      ? 'bg-[#003366] text-white'
                      : step === s
                      ? 'bg-[#003366] text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {step > s ? <Check className="w-4 h-4" /> : s}
                </div>
                <span
                  className={`text-sm font-medium hidden sm:block ${
                    step >= s ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  {s === 1
                    ? t('register.steps.tier', { defaultValue: 'Membership' })
                    : s === 2
                    ? t('register.steps.info', { defaultValue: 'Information' })
                    : t('register.steps.verify', { defaultValue: 'Complete' })}
                </span>
              </div>
              {s < 3 && (
                <div
                  className={`w-12 sm:w-20 h-0.5 mx-2 sm:mx-3 transition-colors ${
                    step > s ? 'bg-[#003366]' : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">
                {t('register.errors.generic', { defaultValue: 'Registration failed' })}
              </p>
              <p className="text-sm text-red-600 mt-0.5">{error}</p>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1 - Choose Membership Tier */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                  {t('register.step1.title', { defaultValue: 'Choose your membership' })}
                </h1>
                <p className="text-slate-500">
                  {t('register.step1.subtitle', { defaultValue: 'All tiers are completely free - this is a government service for everyone.' })}
                </p>
                <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full">
                  <Shield className="w-3.5 h-3.5" />
                  {t('register.step1.freeBadge', { defaultValue: '100% Free - No charges' })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {TIERS.map((tier) => {
                  const colors = TIER_COLORS[tier.color];
                  const isSelected = selectedTier === tier.id;
                  const TierIcon = tier.icon;

                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setSelectedTier(tier.id)}
                      className={`relative text-left p-5 rounded-2xl border-2 transition-all ${
                        isSelected
                          ? `${colors.activeBorder} ${colors.bg} ring-4 ${colors.ring}`
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && (
                        <div className={`absolute top-3 right-3 w-6 h-6 rounded-full ${colors.badge} flex items-center justify-center`}>
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}

                      <div className={`w-11 h-11 rounded-xl ${colors.bg} flex items-center justify-center mb-4`}>
                        <TierIcon className={`w-5 h-5 ${colors.icon}`} />
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 mb-1">{tierLabels[tier.id]}</h3>
                      <p className="text-sm text-slate-500 mb-4">{tierDescriptions[tier.id]}</p>

                      <div className="space-y-2">
                        {tier.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle className={`w-4 h-4 ${colors.check} flex-shrink-0 mt-0.5`} />
                            <span className="text-sm text-slate-600">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className={`mt-4 pt-3 border-t ${isSelected ? colors.border : 'border-slate-100'}`}>
                        <span className="text-xl font-bold text-slate-900">
                          {t('register.tiers.price', { defaultValue: 'Free' })}
                        </span>
                        <span className="text-sm text-slate-500 ml-1">
                          {t('register.tiers.forever', { defaultValue: '/ forever' })}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Google Option for Step 1 */}
              {selectedTier && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100"
                >
                  <p className="text-sm text-slate-600 text-center mb-3">
                    {t('register.step1.quickRegister', { defaultValue: 'Quick registration with Google' })}
                  </p>
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={googleLoading}
                    className="w-full py-3 px-6 bg-white border border-slate-200 hover:border-slate-300 hover:bg-white text-slate-700 font-medium rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-3"
                  >
                    {googleLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                    )}
                    {t('register.buttons.googleRegister', { defaultValue: 'Register with Google' })}
                  </button>
                </motion.div>
              )}

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!selectedTier}
                  className="px-8 py-3 bg-[#003366] hover:bg-[#002244] text-white font-semibold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {t('register.buttons.continue', { defaultValue: 'Continue' })}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2 - Personal Information */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                  {t('register.step2.title', { defaultValue: 'Your information' })}
                </h1>
                <p className="text-slate-500">
                  {t('register.step2.subtitle', { defaultValue: 'Fill in your details to create your library account.' })}
                </p>
              </div>

              <div className="bg-white rounded-2xl">
                <div className="space-y-5">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {renderInput(
                      'firstName',
                      t('register.fields.firstName', { defaultValue: 'First Name' }),
                      'text',
                      User,
                      t('register.fields.firstNamePlaceholder', { defaultValue: 'John' })
                    )}
                    {renderInput(
                      'lastName',
                      t('register.fields.lastName', { defaultValue: 'Last Name' }),
                      'text',
                      User,
                      t('register.fields.lastNamePlaceholder', { defaultValue: 'Doe' })
                    )}
                  </div>

                  {/* Email */}
                  {renderInput(
                    'email',
                    t('register.fields.email', { defaultValue: 'Email Address' }),
                    'email',
                    Mail,
                    t('register.fields.emailPlaceholder', { defaultValue: 'you@example.com' })
                  )}

                  {/* Password Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {renderInput(
                      'password',
                      t('register.fields.password', { defaultValue: 'Password' }),
                      'password',
                      Lock,
                      t('register.fields.passwordPlaceholder', { defaultValue: 'Min. 6 characters' })
                    )}
                    {renderInput(
                      'confirmPassword',
                      t('register.fields.confirmPassword', { defaultValue: 'Confirm Password' }),
                      'password',
                      Lock,
                      t('register.fields.confirmPasswordPlaceholder', { defaultValue: 'Repeat your password' })
                    )}
                  </div>

                  {/* Phone */}
                  {renderInput(
                    'phoneNumber',
                    t('register.fields.phone', { defaultValue: 'Phone Number (optional)' }),
                    'tel',
                    Phone,
                    t('register.fields.phonePlaceholder', { defaultValue: '+94 7X XXX XXXX' }),
                    false
                  )}

                  {/* Student-specific fields */}
                  {selectedTier === 'student' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-5 pt-4 border-t border-slate-100"
                    >
                      <p className="text-sm font-semibold text-blue-700 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        {t('register.sections.studentInfo', { defaultValue: 'Student Information' })}
                      </p>
                      {renderInput(
                        'university',
                        t('register.fields.university', { defaultValue: 'University / College' }),
                        'text',
                        Building2,
                        t('register.fields.universityPlaceholder', { defaultValue: 'University of Colombo' })
                      )}
                      {renderInput(
                        'studentId',
                        t('register.fields.studentId', { defaultValue: 'Student ID' }),
                        'text',
                        IdCard,
                        t('register.fields.studentIdPlaceholder', { defaultValue: 'e.g. STU-2024-001' })
                      )}
                    </motion.div>
                  )}

                  {/* Researcher-specific fields */}
                  {selectedTier === 'researcher' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-5 pt-4 border-t border-slate-100"
                    >
                      <p className="text-sm font-semibold text-purple-700 flex items-center gap-2">
                        <Microscope className="w-4 h-4" />
                        {t('register.sections.researcherInfo', { defaultValue: 'Researcher Information' })}
                      </p>
                      {renderInput(
                        'institution',
                        t('register.fields.institution', { defaultValue: 'Institution / Organization' }),
                        'text',
                        Building2,
                        t('register.fields.institutionPlaceholder', { defaultValue: 'National Science Foundation' })
                      )}
                      {renderInput(
                        'researchArea',
                        t('register.fields.researchArea', { defaultValue: 'Primary Research Area' }),
                        'text',
                        FlaskConical,
                        t('register.fields.researchAreaPlaceholder', { defaultValue: 'e.g. Marine Biology, History' })
                      )}
                      {renderInput(
                        'orcid',
                        t('register.fields.orcid', { defaultValue: 'ORCID iD (optional)' }),
                        'text',
                        Link2,
                        t('register.fields.orcidPlaceholder', { defaultValue: '0000-0000-0000-0000' }),
                        false
                      )}
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium rounded-xl transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t('register.buttons.back', { defaultValue: 'Back' })}
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-3 bg-[#003366] hover:bg-[#002244] text-white font-semibold rounded-xl transition-all flex items-center gap-2"
                >
                  {t('register.buttons.continue', { defaultValue: 'Continue' })}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3 - Verification & Complete */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                  {t('register.step3.title', { defaultValue: 'Review & complete' })}
                </h1>
                <p className="text-slate-500">
                  {t('register.step3.subtitle', { defaultValue: 'Please review your information and accept the terms to continue.' })}
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 mb-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">
                  {t('register.step3.summary', { defaultValue: 'Account Summary' })}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">
                      {t('register.step3.labels.name', { defaultValue: 'Full Name' })}
                    </p>
                    <p className="text-sm font-medium text-slate-900 mt-0.5">
                      {formData.firstName} {formData.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">
                      {t('register.step3.labels.email', { defaultValue: 'Email' })}
                    </p>
                    <p className="text-sm font-medium text-slate-900 mt-0.5">{formData.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">
                      {t('register.step3.labels.membership', { defaultValue: 'Membership Tier' })}
                    </p>
                    <p className="text-sm font-medium text-slate-900 mt-0.5">{tierLabels[selectedTier]}</p>
                  </div>
                  {formData.phoneNumber && (
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide">
                        {t('register.step3.labels.phone', { defaultValue: 'Phone' })}
                      </p>
                      <p className="text-sm font-medium text-slate-900 mt-0.5">{formData.phoneNumber}</p>
                    </div>
                  )}
                  {selectedTier === 'student' && (
                    <>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">
                          {t('register.step3.labels.university', { defaultValue: 'University' })}
                        </p>
                        <p className="text-sm font-medium text-slate-900 mt-0.5">{formData.university}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">
                          {t('register.step3.labels.studentId', { defaultValue: 'Student ID' })}
                        </p>
                        <p className="text-sm font-medium text-slate-900 mt-0.5">{formData.studentId}</p>
                      </div>
                    </>
                  )}
                  {selectedTier === 'researcher' && (
                    <>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">
                          {t('register.step3.labels.institution', { defaultValue: 'Institution' })}
                        </p>
                        <p className="text-sm font-medium text-slate-900 mt-0.5">{formData.institution}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">
                          {t('register.step3.labels.researchArea', { defaultValue: 'Research Area' })}
                        </p>
                        <p className="text-sm font-medium text-slate-900 mt-0.5">{formData.researchArea}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Email Verification Notice */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#0066CC] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#003366]">
                    {t('register.step3.verification.title', { defaultValue: 'Email verification required' })}
                  </p>
                  <p className="text-sm text-blue-600 mt-0.5">
                    {t('register.step3.verification.desc', { defaultValue: 'We will send a verification link to your email address. Please verify your email to access all features.' })}
                  </p>
                </div>
              </div>

              {/* Terms Acceptance */}
              <div className="mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="w-4 h-4 mt-1 text-[#0066CC] border-slate-300 rounded focus:ring-[#0066CC]"
                  />
                  <span className="text-sm text-slate-600">
                    {t('register.step3.terms', { defaultValue: 'I agree to the ' })}
                    <Link to="/terms" className="text-[#0066CC] hover:underline font-medium">
                      {t('register.step3.termsLink', { defaultValue: 'Terms of Service' })}
                    </Link>
                    {' '}{t('register.step3.and', { defaultValue: 'and' })}{' '}
                    <Link to="/privacy" className="text-[#0066CC] hover:underline font-medium">
                      {t('register.step3.privacyLink', { defaultValue: 'Privacy Policy' })}
                    </Link>
                    {t('register.step3.termsEnd', { defaultValue: ' of the NARA Library.' })}
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium rounded-xl transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t('register.buttons.back', { defaultValue: 'Back' })}
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!acceptTerms || loading}
                  className="px-8 py-3 bg-[#003366] hover:bg-[#002244] text-white font-semibold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t('register.buttons.creating', { defaultValue: 'Creating account...' })}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      {t('register.buttons.create', { defaultValue: 'Create Account' })}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LibraryRegister;
