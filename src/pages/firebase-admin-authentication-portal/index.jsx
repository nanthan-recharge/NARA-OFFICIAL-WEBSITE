import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Chrome,
  AlertTriangle,
  CheckCircle,
  Loader2,
  KeyRound,
  UserCheck,
  Globe,
  Waves,
  Fish
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import ParticleSystem from '../../components/shared/ParticleSystem';
import GlassMorphismCard from '../../components/shared/GlassMorphismCard';

const FirebaseAdminAuthenticationPortal = () => {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle, resetPassword, user, loading, error, setError } = useFirebaseAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      navigate('/firebase-admin-dashboard-control-center');
    }
  }, [user, loading, navigate]);

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e?.target?.name]: e?.target?.value
    });
    // Clear errors when user starts typing
    if (error) setError(null);
    if (authMessage) setAuthMessage('');
  };

  // Handle email/password sign in
  const handleSignIn = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await signIn(formData?.email, formData?.password);
      setAuthMessage('Successfully signed in! Redirecting to admin dashboard...');
      setMessageType('success');
      setTimeout(() => navigate('/firebase-admin-dashboard-control-center'), 1500);
    } catch (error) {
      setAuthMessage(`Authentication failed: ${error?.message}`);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await signInWithGoogle();
      setAuthMessage('Successfully signed in with Google! Redirecting...');
      setMessageType('success');
      setTimeout(() => navigate('/firebase-admin-dashboard-control-center'), 1500);
    } catch (error) {
      setAuthMessage(`Google sign-in failed: ${error?.message}`);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password reset
  const handlePasswordReset = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    
    try {
      await resetPassword(resetEmail);
      setAuthMessage('Password reset email sent! Please check your inbox.');
      setMessageType('success');
      setShowResetForm(false);
      setResetEmail('');
    } catch (error) {
      setAuthMessage(`Password reset failed: ${error?.message}`);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean-50 to-ocean-100 flex items-center justify-center">
        <div className="flex items-center gap-3 text-ocean-600">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-lg font-medium">Initializing secure connection...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-ocean-100 to-cyan-50 relative overflow-hidden">
      {/* Top Bar: Back + Home Logo */}
      <div className="absolute top-0 left-0 right-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <button
            onClick={() => { if (window.history.length > 1) navigate(-1); else navigate('/'); }}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/70 backdrop-blur border border-ocean-200 text-ocean-700 hover:bg-white transition"
            aria-label="Go back"
            title="Back"
          >
            <KeyRound className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <a href="/" className="inline-flex items-center gap-2" aria-label="Home">
            <img src="/assets/nara-logo.png" alt="NARA logo" className="w-9 h-9 object-contain rounded" />
          </a>
        </div>
      </div>
      {/* Particle System Background */}
      <ParticleSystem 
        particleCount={150}
        colors={['#0891b2', '#0e7490', '#155e75']}
        maxSize={4}
        speed={0.5}
      />
      {/* Ocean-themed decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-ocean-200/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-tl from-cyan-200/30 to-transparent rounded-full blur-3xl"></div>
        
        {/* Floating marine elements */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 15, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 right-20 text-ocean-300/20"
        >
          <Fish className="w-16 h-16" />
        </motion.div>
        
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            rotate: [0, -10, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-32 left-16 text-cyan-300/20"
        >
          <Waves className="w-20 h-20" />
        </motion.div>
      </div>
      <div className="relative z-10 min-h-screen flex pt-16">
        {/* Left Side - NARA Branding */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-lg text-center"
          >
            {/* NARA Logo */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-ocean-600 to-ocean-800 rounded-full flex items-center justify-center shadow-2xl">
                <Globe className="w-16 h-16 text-white" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-4xl font-black text-ocean-900 mb-4 font-space-grotesk"
            >
              NARA Admin Portal
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-xl text-ocean-700 mb-8 leading-relaxed"
            >
              Secure gateway to Sri Lanka's premier marine research administration system
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="space-y-4 text-left"
            >
              <div className="flex items-center gap-3 text-ocean-600">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span className="font-medium">Multi-factor authentication</span>
              </div>
              <div className="flex items-center gap-3 text-ocean-600">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span className="font-medium">Role-based access control</span>
              </div>
              <div className="flex items-center gap-3 text-ocean-600">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span className="font-medium">Comprehensive audit logging</span>
              </div>
              <div className="flex items-center gap-3 text-ocean-600">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span className="font-medium">Real-time system monitoring</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Side - Authentication Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <GlassMorphismCard className="p-8" onClick={() => {}}>
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex items-center justify-center gap-3 mb-4"
                >
                  <Shield className="w-8 h-8 text-ocean-600" />
                  <h2 className="text-2xl font-bold text-gray-800 font-space-grotesk">
                    Admin Authentication
                  </h2>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-gray-600"
                >
                  Secure access to NARA administrative functions
                </motion.p>
              </div>

              {/* Alert Messages */}
              <AnimatePresence>
                {(authMessage || error) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`mb-6 p-4 rounded-lg border flex items-center gap-3 ${
                      messageType === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
                    }`}
                  >
                    {messageType === 'success' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5" />
                    )}
                    <span className="text-sm font-medium">
                      {authMessage || error}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {!showResetForm ? (
                <>
                  {/* Main Sign In Form */}
                  <form onSubmit={handleSignIn} className="space-y-6">
                    {/* Email Field */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Admin Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData?.email}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm text-gray-900"
                          placeholder="admin@nara.gov.lk"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          name="password"
                          value={formData?.password}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm text-gray-900"
                          placeholder="••••••••"
                          required
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          disabled={isLoading}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e?.target?.checked)}
                          className="rounded border-gray-300 text-ocean-600 focus:ring-ocean-500"
                          disabled={isLoading}
                        />
                        <span className="ml-2 text-sm text-gray-600">Remember me</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowResetForm(true)}
                        className="text-sm text-ocean-600 hover:text-ocean-800 font-medium"
                        disabled={isLoading}
                      >
                        Forgot password?
                      </button>
                    </div>

                    {/* Sign In Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-ocean-600 to-ocean-700 hover:from-ocean-700 hover:to-ocean-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Authenticating...</span>
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-5 h-5" />
                          <span>Sign In to Admin Portal</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="my-6 flex items-center">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-4 text-sm text-gray-500 bg-white/50">or</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>

                  {/* Google Sign In */}
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg border border-gray-300 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    <Chrome className="w-5 h-5 text-blue-500" />
                    <span>Continue with Google</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Password Reset Form */}
                  <form onSubmit={handlePasswordReset} className="space-y-6">
                    <div className="text-center mb-6">
                      <KeyRound className="w-12 h-12 text-ocean-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Reset Password</h3>
                      <p className="text-sm text-gray-600">
                        Enter your admin email address and we'll send you a reset link.
                      </p>
                    </div>

                    <div>
                      <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 mb-2">
                        Admin Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          id="resetEmail"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e?.target?.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm text-gray-900"
                          placeholder="admin@nara.gov.lk"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowResetForm(false);
                          setResetEmail('');
                          setAuthMessage('');
                        }}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-all duration-200"
                        disabled={isLoading}
                      >
                        Back to Sign In
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 bg-gradient-to-r from-ocean-600 to-ocean-700 hover:from-ocean-700 hover:to-ocean-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          'Send Reset Link'
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-ocean-50 rounded-lg border border-ocean-200">
                <div className="flex items-center gap-3 text-ocean-700">
                  <Shield className="w-5 h-5" />
                  <div>
                    <p className="text-sm font-medium">Secure Connection</p>
                    <p className="text-xs text-ocean-600 mt-1">
                      All authentication data is encrypted and protected by Firebase Security Rules.
                    </p>
                  </div>
                </div>
              </div>
            </GlassMorphismCard>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center mt-8 text-sm text-ocean-600"
            >
              <p>© 2024 National Aquatic Resources Research and Development Agency</p>
              <p className="mt-1">Authorized personnel only • All activities are monitored and logged</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FirebaseAdminAuthenticationPortal;