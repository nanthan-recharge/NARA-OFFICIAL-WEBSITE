import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLibraryUser } from '../../contexts/LibraryUserContext';
import { motion } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Loader2,
  AlertCircle,
  BookOpen,
  GraduationCap,
  Globe,
  Users,
  Shield,
  ArrowLeft,
  CheckCircle,
  Library
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEOHead from '../../components/shared/SEOHead';

const LibraryLogin = () => {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle, error, setError } = useLibraryUser();
  const { t } = useTranslation('libraryAuth');

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      await signIn(formData.email, formData.password);
      navigate('/library-dashboard');
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setError(null);
      await signInWithGoogle('public');
      navigate('/library-dashboard');
    } catch (err) {
      console.error('Google sign-in error:', err);
    } finally {
      setGoogleLoading(false);
    }
  };

  const benefits = [
    {
      icon: BookOpen,
      title: t('login.benefits.borrow.title', { defaultValue: 'Borrow & Read' }),
      desc: t('login.benefits.borrow.desc', { defaultValue: 'Access thousands of books, journals, and digital resources' })
    },
    {
      icon: GraduationCap,
      title: t('login.benefits.research.title', { defaultValue: 'Research Tools' }),
      desc: t('login.benefits.research.desc', { defaultValue: 'Submit papers and access premium academic databases' })
    },
    {
      icon: Globe,
      title: t('login.benefits.digital.title', { defaultValue: '24/7 Digital Access' }),
      desc: t('login.benefits.digital.desc', { defaultValue: 'Read e-books and digital archives anytime, anywhere' })
    },
    {
      icon: Users,
      title: t('login.benefits.free.title', { defaultValue: 'Free for Everyone' }),
      desc: t('login.benefits.free.desc', { defaultValue: 'All membership tiers are completely free of charge' })
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      <SEOHead
        title="Library Login"
        description="Login to the NARA Library portal."
        path="/library-login"
        noindex
      />
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto"
        >
          {/* Back to Library */}
          <Link
            to="/library"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#003366] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('login.links.backToLibrary', { defaultValue: 'Back to Library' })}
          </Link>

          {/* Branding */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[#003366] flex items-center justify-center">
              <Library className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-[#003366] tracking-tight">NARA Library</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mt-6 mb-2">
            {t('login.title', { defaultValue: 'Welcome back' })}
          </h1>
          <p className="text-slate-500 mb-8">
            {t('login.subtitle', { defaultValue: 'Sign in to your library account to continue' })}
          </p>

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
                  {t('login.errors.generic', { defaultValue: 'Sign in failed' })}
                </p>
                <p className="text-sm text-red-600 mt-0.5">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {t('login.fields.emailLabel', { defaultValue: 'Email address' })}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#0066CC]/20 focus:border-[#0066CC] outline-none transition-all"
                  placeholder={t('login.fields.emailPlaceholder', { defaultValue: 'you@example.com' })}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  {t('login.fields.passwordLabel', { defaultValue: 'Password' })}
                </label>
                <Link
                  to="/library-forgot-password"
                  className="text-sm text-[#0066CC] hover:text-[#003366] font-medium transition-colors"
                >
                  {t('login.links.forgotPassword', { defaultValue: 'Forgot password?' })}
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#0066CC]/20 focus:border-[#0066CC] outline-none transition-all"
                  placeholder={t('login.fields.passwordPlaceholder', { defaultValue: 'Enter your password' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="w-4 h-4 text-[#0066CC] border-slate-300 rounded focus:ring-[#0066CC]"
              />
              <label htmlFor="remember-me" className="ml-2.5 text-sm text-slate-600">
                {t('login.rememberMe', { defaultValue: 'Remember me' })}
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full py-3 px-6 bg-[#003366] hover:bg-[#002244] text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('login.buttons.signingIn', { defaultValue: 'Signing in...' })}
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  {t('login.buttons.signIn', { defaultValue: 'Sign In' })}
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-slate-400">
                {t('login.divider', { defaultValue: 'or continue with' })}
              </span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading || googleLoading}
            className="w-full py-3 px-6 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
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
            {t('login.buttons.google', { defaultValue: 'Continue with Google' })}
          </button>

          {/* Register Link */}
          <p className="mt-8 text-center text-sm text-slate-500">
            {t('login.links.noAccount', { defaultValue: "Don't have an account?" })}{' '}
            <Link
              to="/library-register"
              className="text-[#0066CC] font-semibold hover:text-[#003366] transition-colors"
            >
              {t('login.links.register', { defaultValue: 'Create one now' })}
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Benefits Panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#003366] via-[#004488] to-[#0066CC] relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.03] rounded-full" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 xl:px-20 w-full">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm mb-6">
                <Shield className="w-4 h-4" />
                {t('login.panel.badge', { defaultValue: 'National Archives & Research' })}
              </div>
              <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-4">
                {t('login.panel.title', { defaultValue: 'Your gateway to knowledge' })}
              </h2>
              <p className="text-lg text-white/70 leading-relaxed">
                {t('login.panel.subtitle', { defaultValue: 'Access Sri Lanka\'s largest collection of books, research papers, and historical archives.' })}
              </p>
            </div>

            {/* Benefits List */}
            <div className="space-y-5">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-white/90" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">{benefit.title}</h3>
                    <p className="text-white/60 text-sm mt-0.5">{benefit.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.9 }}
              className="mt-12 pt-8 border-t border-white/10 grid grid-cols-3 gap-6"
            >
              <div>
                <p className="text-2xl font-bold text-white">50K+</p>
                <p className="text-sm text-white/50 mt-1">
                  {t('login.panel.stats.books', { defaultValue: 'Books & Resources' })}
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">10K+</p>
                <p className="text-sm text-white/50 mt-1">
                  {t('login.panel.stats.members', { defaultValue: 'Active Members' })}
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">1K+</p>
                <p className="text-sm text-white/50 mt-1">
                  {t('login.panel.stats.papers', { defaultValue: 'Research Papers' })}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Mobile Benefits (shown below form on mobile) */}
      <div className="lg:hidden px-6 pb-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-slate-50 rounded-2xl p-6 border border-slate-100"
        >
          <h3 className="text-sm font-semibold text-[#003366] mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            {t('login.benefits.heading', { defaultValue: 'Why join NARA Library?' })}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-[#0066CC] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-slate-600">{benefit.title}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LibraryLogin;
