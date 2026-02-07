import React from 'react';
import { useLibraryUser } from '../../contexts/LibraryUserContext';

const RoleGuard = ({ 
  children, 
  allowedRoles = [],
  allowedPermissions = [],
  fallback = null,
  showMessage = false
}) => {
  const { userProfile, hasRole, hasPermission } = useLibraryUser();

  if (!userProfile) {
    return fallback || null;
  }

  // Check if user has any of the allowed roles
  const hasAllowedRole = allowedRoles.length === 0 || hasRole(allowedRoles);

  // Check if user has any of the allowed permissions
  const hasAllowedPermission = allowedPermissions.length === 0 || 
    allowedPermissions.some(permission => hasPermission(permission));

  // User must have either allowed role OR allowed permission (OR logic)
  const isAuthorized = hasAllowedRole || hasAllowedPermission;

  if (!isAuthorized) {
    if (showMessage) {
      return (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800 text-sm">
            This feature is not available for your account type.
          </p>
        </div>
      );
    }
    return fallback || null;
  }

  return <>{children}</>;
};

export default RoleGuard;
