import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useLibraryUser } from '../../contexts/LibraryUserContext';
import * as Icons from 'lucide-react';

const ProtectedRoute = ({ 
  children, 
  requiredRole = null,
  requiredPermission = null,
  fallbackPath = '/library-login'
}) => {
  const { user, userProfile, loading, hasRole, hasPermission } = useLibraryUser();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Icons.Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check if user profile exists
  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <Icons.AlertCircle className="w-16 h-16 text-amber-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Profile Not Found
          </h2>
          <p className="text-slate-600 mb-6">
            Your user profile could not be loaded. Please contact support or try signing in again.
          </p>
          <a
            href="/library-login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            <Icons.LogIn className="w-5 h-5" />
            Sign In Again
          </a>
        </div>
      </div>
    );
  }

  // Check role-based access
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <Icons.ShieldAlert className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Access Denied
          </h2>
          <p className="text-slate-600 mb-6">
            You don't have permission to access this page. This area is restricted to{' '}
            <span className="font-semibold">
              {Array.isArray(requiredRole) ? requiredRole.join(', ') : requiredRole}
            </span>{' '}
            users only.
          </p>
          <div className="space-y-3">
            <a
              href="/library-dashboard"
              className="block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Go to Dashboard
            </a>
            <a
              href="/library"
              className="block px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors"
            >
              Browse Catalogue
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Check permission-based access
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <Icons.Lock className="w-16 h-16 text-amber-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Feature Unavailable
          </h2>
          <p className="text-slate-600 mb-6">
            This feature requires additional permissions. Please upgrade your account or contact the library administration.
          </p>
          <div className="space-y-3">
            <a
              href="/library-dashboard"
              className="block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Go to Dashboard
            </a>
            <a
              href="/contact-us"
              className="block px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Email verification check (optional - can be enabled if needed)
  // Uncomment this block if you want to enforce email verification
  /*
  if (!user.emailVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <Icons.Mail className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Verify Your Email
          </h2>
          <p className="text-slate-600 mb-6">
            Please verify your email address to access this feature. Check your inbox for the verification link.
          </p>
          <a
            href="/library-dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }
  */

  // User is authenticated and authorized
  return <>{children}</>;
};

export default ProtectedRoute;
