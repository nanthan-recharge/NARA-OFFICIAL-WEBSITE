import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import * as Icons from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useThemeStore from '../../store/theme';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const LDARegister = () => {
  const { t, i18n } = useTranslation(['common', 'knowledge']);
  const currentLang = i18n.language || 'en';
  const theme = useThemeStore((state) => state?.theme || 'normal');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    organization: '',
    role: 'student',
    interests: [],
    country: 'Sri Lanka',
    city: '',
    language: currentLang
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const roles = [
    { value: 'student', label: { en: 'Student', si: 'ශිෂ්‍ය', ta: 'மாணவர்' } },
    { value: 'researcher', label: { en: 'Researcher', si: 'පර්යේෂක', ta: 'ஆராய்ச்சியாளர்' } },
    { value: 'professor', label: { en: 'Professor', si: 'මහාචාර්ය', ta: 'பேராசிரியர்' } },
    { value: 'professional', label: { en: 'Professional', si: 'වෘත්තිකයා', ta: 'தொழில் வல்லுநர்' } }
  ];

  const interestsList = [
    { value: 'ocean-science', label: { en: 'Ocean Science', si: 'සාගර විද්‍යාව', ta: 'கடல் அறிவியல்' } },
    { value: 'marine-biology', label: { en: 'Marine Biology', si: 'සමුද්‍ර ජීව විද්‍යාව', ta: 'கடல் உயிரியல்' } },
    { value: 'fisheries', label: { en: 'Fisheries Science', si: 'මත්ස්‍ය විද්‍යාව', ta: 'மீன்வள அறிவியல்' } },
    { value: 'aquaculture', label: { en: 'Aquaculture', si: 'ජලජීවී වගාව', ta: 'நீர்வாழ் வளர்ப்பு' } },
    { value: 'conservation', label: { en: 'Ocean Conservation', si: 'සාගර සංරක්ෂණය', ta: 'கடல் பாதுகாப்பு' } },
    { value: 'technology', label: { en: 'Marine Technology', si: 'සමුද්‍ර තාක්ෂණය', ta: 'கடல் தொழில்நுட்பம்' } },
    { value: 'climate', label: { en: 'Climate Change', si: 'දේශගුණ වෙනස', ta: 'காலநிலை மாற்றம்' } },
    { value: 'research', label: { en: 'Research Methods', si: 'පර්යේෂණ ක්‍රම', ta: 'ஆராய்ச்சி முறைகள்' } }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    if (formData.interests.length === 0) {
      newErrors.interests = 'Select at least one interest';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // Update display name
      await updateProfile(user, {
        displayName: `${formData.firstName} ${formData.lastName}`
      });

      // Create user profile in Firestore
      await setDoc(doc(db, 'lda_users', user.uid), {
        uid: user.uid,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        organization: formData.organization,
        role: formData.role,
        interests: formData.interests,
        country: formData.country,
        city: formData.city,
        language: formData.language,
        createdAt: new Date(),
        updatedAt: new Date(),
        enrolledCourses: [],
        completedCourses: [],
        certificates: [],
        profileComplete: true
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/learning-development-academy');
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setErrors({ email: 'Email already registered' });
      } else {
        setErrors({ general: error.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
    if (errors.interests) {
      setErrors(prev => ({ ...prev, interests: '' }));
    }
  };

  const getThemeClasses = () => {
    const baseClasses = 'min-h-screen transition-all duration-500';
    switch(theme) {
      case 'dark':
        return `${baseClasses} bg-gray-900 text-white`;
      case 'glow':
        return `${baseClasses} bg-black text-white`;
      default:
        return `${baseClasses} bg-gradient-to-br from-blue-50 via-white to-cyan-50 text-gray-900`;
    }
  };

  const getInputClasses = () => {
    return theme === 'dark'
      ? 'bg-gray-800 border-gray-700 text-white'
      : theme === 'glow'
      ? 'bg-gray-900 border-cyan-500/30 text-white'
      : 'bg-white border-gray-300 text-gray-900';
  };

  if (success) {
    return (
      <div className={getThemeClasses()}>
        <div className="flex items-center justify-center min-h-screen p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <Icons.CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              {currentLang === 'si' ? 'ලියාපදිංචිය සාර්ථකයි!' : currentLang === 'ta' ? 'பதிவு வெற்றி!' : 'Registration Successful!'}
            </h2>
            <p className="text-lg opacity-80">
              {currentLang === 'si' ? 'ඔබව ඉගෙනුම් ඇකඩමියට හරවා යවමින්...' : currentLang === 'ta' ? 'கற்றல் அகாடமிக்கு திருப்பி விடுகிறது...' : 'Redirecting to Learning Academy...'}
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className={getThemeClasses()}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              {currentLang === 'si' ? 'ඉගෙනුම් ඇකඩමියට සම්බන්ධ වන්න' : currentLang === 'ta' ? 'கற்றல் அகாடமியில் சேரவும்' : 'Join Learning Academy'}
            </h1>
            <p className="text-lg opacity-80">
              {currentLang === 'si' ? 'ඔබගේ සාගර විද්‍යා ගමන ආරම්භ කරන්න' : currentLang === 'ta' ? 'உங்கள் கடல் அறிவியல் பயணத்தைத் தொடங்குங்கள்' : 'Start your marine science journey'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className={`rounded-2xl p-8 shadow-xl border ${getInputClasses()}`}>
            {errors.general && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
                {errors.general}
              </div>
            )}

            {/* Personal Information */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Icons.User className="w-5 h-5" />
                {currentLang === 'si' ? 'පුද්ගලික තොරතුරු' : currentLang === 'ta' ? 'தனிப்பட்ட தகவல்' : 'Personal Information'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium">
                    {currentLang === 'si' ? 'මුල් නම' : currentLang === 'ta' ? 'முதல் பெயர்' : 'First Name'} *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${getInputClasses()} ${errors.firstName ? 'border-red-500' : ''}`}
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    {currentLang === 'si' ? 'අවසාන නම' : currentLang === 'ta' ? 'கடைசி பெயர்' : 'Last Name'} *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${getInputClasses()} ${errors.lastName ? 'border-red-500' : ''}`}
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    {currentLang === 'si' ? 'විද්‍යුත් තැපෑල' : currentLang === 'ta' ? 'மின்னஞ்சல்' : 'Email'} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${getInputClasses()} ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    {currentLang === 'si' ? 'දුරකථන අංකය' : currentLang === 'ta' ? 'தொலைபேசி எண்' : 'Phone Number'} *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+94 XX XXX XXXX"
                    className={`w-full px-4 py-2 rounded-lg border ${getInputClasses()} ${errors.phoneNumber ? 'border-red-500' : ''}`}
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                </div>
              </div>
            </div>

            {/* Account Security */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Icons.Lock className="w-5 h-5" />
                {currentLang === 'si' ? 'ගිණුම් ආරක්ෂාව' : currentLang === 'ta' ? 'கணக்கு பாதுகாப்பு' : 'Account Security'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium">
                    {currentLang === 'si' ? 'මුරපදය' : currentLang === 'ta' ? 'கடவுச்சொல்' : 'Password'} *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${getInputClasses()} ${errors.password ? 'border-red-500' : ''}`}
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    {currentLang === 'si' ? 'මුරපදය තහවුරු කරන්න' : currentLang === 'ta' ? 'கடவுச்சொல்லை உறுதிப்படுத்தவும்' : 'Confirm Password'} *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${getInputClasses()} ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>

            {/* Professional Details */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Icons.Briefcase className="w-5 h-5" />
                {currentLang === 'si' ? 'වෘත්තීය විස්තර' : currentLang === 'ta' ? 'தொழில் விவரங்கள்' : 'Professional Details'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium">
                    {currentLang === 'si' ? 'භූමිකාව' : currentLang === 'ta' ? 'பங்கு' : 'Role'} *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${getInputClasses()}`}
                  >
                    {roles.map(role => (
                      <option key={role.value} value={role.value}>
                        {role.label[currentLang]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    {currentLang === 'si' ? 'සංවිධානය' : currentLang === 'ta' ? 'அமைப்பு' : 'Organization'}
                  </label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder={currentLang === 'si' ? 'විශ්ව විද්‍යාලය/සමාගම' : currentLang === 'ta' ? 'பல்கலைக்கழகம்/நிறுவனம்' : 'University/Company'}
                    className={`w-full px-4 py-2 rounded-lg border ${getInputClasses()}`}
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    {currentLang === 'si' ? 'රට' : currentLang === 'ta' ? 'நாடு' : 'Country'}
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${getInputClasses()}`}
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    {currentLang === 'si' ? 'නගරය' : currentLang === 'ta' ? 'நகரம்' : 'City'}
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${getInputClasses()}`}
                  />
                </div>
              </div>
            </div>

            {/* Interests */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Icons.Heart className="w-5 h-5" />
                {currentLang === 'si' ? 'ඔබගේ උනන්දුව' : currentLang === 'ta' ? 'உங்கள் ஆர்வங்கள்' : 'Your Interests'} *
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {interestsList.map(interest => (
                  <button
                    key={interest.value}
                    type="button"
                    onClick={() => toggleInterest(interest.value)}
                    className={`px-4 py-3 rounded-lg border-2 transition-all ${
                      formData.interests.includes(interest.value)
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : theme === 'dark'
                        ? 'border-gray-700 hover:border-blue-600'
                        : 'border-gray-300 hover:border-blue-600'
                    }`}
                  >
                    {interest.label[currentLang]}
                  </button>
                ))}
              </div>
              {errors.interests && <p className="text-red-500 text-sm mt-2">{errors.interests}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Icons.Loader className="w-5 h-5 animate-spin" />
                  {currentLang === 'si' ? 'ලියාපදිංචි වෙමින්...' : currentLang === 'ta' ? 'பதிவு செய்கிறது...' : 'Registering...'}
                </span>
              ) : (
                currentLang === 'si' ? 'ලියාපදිංචි වන්න' : currentLang === 'ta' ? 'பதிவு செய்யவும்' : 'Register Now'
              )}
            </button>

            <p className="text-center mt-6 opacity-70">
              {currentLang === 'si' ? 'දැනටමත් ගිණුමක් තිබේද?' : currentLang === 'ta' ? 'ஏற்கனவே கணக்கு உள்ளதா?' : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => navigate('/lda-login')}
                className="text-blue-600 hover:underline font-semibold"
              >
                {currentLang === 'si' ? 'ප්‍රවේශ වන්න' : currentLang === 'ta' ? 'உள்நுழைக' : 'Login'}
              </button>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default LDARegister;
