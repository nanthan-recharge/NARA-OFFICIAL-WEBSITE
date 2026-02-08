import React from 'react';
import { Navigate } from 'react-router-dom';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import { Loader2, ShieldX } from 'lucide-react';

// TEMPORARY: Set to true to allow unauthenticated access for testing
// Set back to false when testing is complete to re-enable auth
const BYPASS_AUTH = true;

const AdminProtectedRoute = ({ children, requiredRole, requiredPermission }) => {
  // Skip all auth checks when bypass is enabled (for testing)
  if (BYPASS_AUTH) return children;

  const { user, profile, loading, isAdmin, hasPermission, hasRole } = useFirebaseAuth();

  // Still checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#003366] mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // No admin profile or not active
  if (!profile || profile.is_active === false) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 max-w-md text-center">
          <ShieldX className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Access Denied</h2>
          <p className="text-slate-500 mb-6">
            Your account does not have admin access or has been deactivated.
            Contact a system administrator if you believe this is an error.
          </p>
          <a
            href="/admin/login"
            className="inline-flex items-center px-4 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#002244] transition text-sm font-medium"
          >
            Return to Login
          </a>
        </div>
      </div>
    );
  }

  // Check required role
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const hasRequiredRole = roles.some(role => hasRole(role));
    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 max-w-md text-center">
            <ShieldX className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Insufficient Privileges</h2>
            <p className="text-slate-500 mb-6">
              You do not have the required role to access this section.
              Contact your department head or system administrator.
            </p>
            <a
              href="/admin/master"
              className="inline-flex items-center px-4 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#002244] transition text-sm font-medium"
            >
              Go to Dashboard
            </a>
          </div>
        </div>
      );
    }
  }

  // Check required permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 max-w-md text-center">
          <ShieldX className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Permission Required</h2>
          <p className="text-slate-500 mb-6">
            You do not have the "{requiredPermission}" permission required for this page.
          </p>
          <a
            href="/admin/master"
            className="inline-flex items-center px-4 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#002244] transition text-sm font-medium"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminProtectedRoute;
