import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import * as Icons from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useThemeStore from '../../store/theme';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LDALogin = () => {
  const { t, i18n } = useTranslation(['common', 'knowledge']);
  const currentLang = i18n.language || 'en';
  const theme = useThemeStore((state) => state?.theme || 'normal');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      setErrors({ email: 'Email is required' });
      return;
    }
    if (!formData.password) {
      setErrors({ password: 'Password is required' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate('/learning-development-academy');
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'auth/user-not-found') {
        setErrors({ email: 'No account found with this email' });
      } else if (error.code === 'auth/wrong-password') {
        setErrors({ password: 'Incorrect password' });
      } else if (error.code === 'auth/invalid-credential') {
        setErrors({ general: 'Invalid email or password' });
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

  return (
    <div className={getThemeClasses()}>
      <div className="max-w-md mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="text-center mb-10">
            <Icons.GraduationCap className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              {currentLang === 'si' ? 'ප්‍රවේශ වන්න' : currentLang === 'ta' ? 'உள்நுழைக' : 'Login'}
            </h1>
            <p className="text-lg opacity-80">
              {currentLang === 'si' ? 'ඔබගේ ඉගෙනුම් ගමන දිගටම කරගෙන යන්න' : currentLang === 'ta' ? 'உங்கள் கற்றல் பயணத்தைத் தொடரவும்' : 'Continue your learning journey'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className={`rounded-2xl p-8 shadow-xl border ${getInputClasses()}`}>
            {errors.general && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
                {errors.general}
              </div>
            )}

            <div className="mb-6">
              <label className="block mb-2 font-medium">
                {currentLang === 'si' ? 'විද්‍යුත් තැපෑල' : currentLang === 'ta' ? 'மின்னஞ்சல்' : 'Email'}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${getInputClasses()} ${errors.email ? 'border-red-500' : ''}`}
                placeholder="your@email.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium">
                {currentLang === 'si' ? 'මුරපදය' : currentLang === 'ta' ? 'கடவுச்சொல்' : 'Password'}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${getInputClasses()} ${errors.password ? 'border-red-500' : ''}`}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

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
                  {currentLang === 'si' ? 'ප්‍රවේශ වෙමින්...' : currentLang === 'ta' ? 'உள்நுழைகிறது...' : 'Logging in...'}
                </span>
              ) : (
                currentLang === 'si' ? 'ප්‍රවේශ වන්න' : currentLang === 'ta' ? 'உள்நுழைக' : 'Login'
              )}
            </button>

            <div className="mt-6 text-center space-y-4">
              <p className="opacity-70">
                {currentLang === 'si' ? 'ගිණුමක් නැද්ද?' : currentLang === 'ta' ? 'கணக்கு இல்லையா?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => navigate('/lda-register')}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  {currentLang === 'si' ? 'ලියාපදිංචි වන්න' : currentLang === 'ta' ? 'பதிவு செய்யவும்' : 'Register'}
                </button>
              </p>
            </div>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/learning-development-academy')}
              className="text-blue-600 hover:underline flex items-center gap-2 mx-auto"
            >
              <Icons.ArrowLeft className="w-4 h-4" />
              {currentLang === 'si' ? 'ඇකඩමියට ආපසු යන්න' : currentLang === 'ta' ? 'அகாடமிக்குத் திரும்பு' : 'Back to Academy'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LDALogin;
