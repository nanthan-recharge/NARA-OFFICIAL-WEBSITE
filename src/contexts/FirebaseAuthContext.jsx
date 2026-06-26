// Firebase Authentication Context for NARA Admin Portal
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  confirmPasswordReset
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { ROLE_HIERARCHY, getRolePermissions } from '../constants/roles';

const FirebaseAuthContext = createContext({});

export const useFirebaseAuth = () => {
  const context = useContext(FirebaseAuthContext);
  if (!context) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider');
  }
  return context;
};

const DEFAULT_ADMIN_DOMAINS = [
  'nara.gov.lk',
  'gov.lk',
  'gmail.com', // Temporary launch access until official NARA email accounts are ready.
  'safenetcreations.com', // Temporary implementation/support access during launch.
  'test.com', // Temporary NARA IT review account. Remove before public launch.
];

const getAllowedAdminDomains = () => {
  const envValue = import.meta.env?.VITE_ADMIN_ALLOWED_EMAIL_DOMAINS;
  if (!envValue) return DEFAULT_ADMIN_DOMAINS;
  return envValue
    .split(',')
    .map((domain) => domain.trim().toLowerCase())
    .filter(Boolean);
};

const isAllowedAdminEmail = (email) => {
  if (!email) return false;
  const allowedDomains = getAllowedAdminDomains();
  if (allowedDomains.length === 0) return true;
  const normalizedEmail = email.toLowerCase();
  return allowedDomains.some((domain) => normalizedEmail.endsWith(`@${domain}`));
};

const isActiveAdminProfile = (profileData) => (
  !!profileData &&
  profileData.is_active !== false &&
  profileData.status !== 'suspended' &&
  profileData.status !== 'terminated' &&
  profileData.status !== 'retired' &&
  !!ROLE_HIERARCHY[profileData.role]
);

export const FirebaseAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Google Auth Provider
  const googleProvider = new GoogleAuthProvider();

  // Load user profile from Firestore
  const loadUserProfile = useCallback(async (firebaseUser, options = {}) => {
    if (!firebaseUser) {
      setProfile(null);
      return null;
    }

    const shouldEnforce = options.enforce === true;

    if (!isAllowedAdminEmail(firebaseUser.email)) {
      setProfile(null);
      const message = 'This admin portal is restricted to approved admin email domains.';
      if (shouldEnforce) throw new Error(message);
      setError(message);
      return null;
    }

    try {
      const ref = doc(db, 'adminProfiles', firebaseUser.uid);
      const snap = await getDoc(ref);
      if (!snap?.exists()) {
        setProfile(null);
        const message = 'No active admin profile was found for this account.';
        if (shouldEnforce) throw new Error(message);
        return null;
      }

      const profileData = { id: snap.id, ...snap.data() };
      if (!isActiveAdminProfile(profileData)) {
        setProfile(null);
        const message = 'Your admin account is inactive or does not have a recognized role.';
        if (shouldEnforce) throw new Error(message);
        return null;
      }

      setProfile(profileData);

      if (options.touchLogin) {
        await updateDoc(ref, {
          lastLoginAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      return profileData;
    } catch (error) {
      console.error('Error loading user profile:', error);
      setProfile(null);
      if (shouldEnforce) throw error;
      return null;
    }
  }, []);

  // Persist auth state across page refreshes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await loadUserProfile(firebaseUser);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [loadUserProfile]);

  const requireAdminProfile = async (result) => {
    const adminProfile = await loadUserProfile(result?.user, {
      enforce: true,
      touchLogin: true,
    });

    if (!adminProfile) {
      throw new Error('No active admin profile was found for this account.');
    }

    return result;
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      return await requireAdminProfile(result);
    } catch (error) {
      await signOut(auth).catch(() => {});
      setError(error?.message);
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      return await requireAdminProfile(result);
    } catch (error) {
      await signOut(auth).catch(() => {});
      setError(error?.message);
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setUser(null);
      setProfile(null);
    } catch (error) {
      setError(error?.message);
      throw error;
    }
  };

  // Send password reset email
  const resetPassword = async (email) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      setError(error?.message);
      throw error;
    }
  };

  // Confirm password reset
  const confirmPasswordResetCode = async (oobCode, newPassword) => {
    try {
      setError(null);
      await confirmPasswordReset(auth, oobCode, newPassword);
    } catch (error) {
      setError(error?.message);
      throw error;
    }
  };

  // Check if user has admin privileges (any recognized role)
  const isAdmin = () => {
    if (!profile?.role) return false;
    const roleConfig = ROLE_HIERARCHY[profile.role];
    return !!roleConfig;
  };

  // Get all permissions for the current user's role
  const getAdminPermissions = () => {
    if (!profile?.role) return [];
    // Get role-based permissions from hierarchy
    const rolePerms = getRolePermissions(profile.role);
    // Merge any custom permissions assigned to this specific user
    const customPerms = profile?.customPermissions || [];
    return [...new Set([...rolePerms, ...customPerms])];
  };

  // Check if the user has a specific permission
  const hasPermission = (permissionName) => {
    const perms = getAdminPermissions();
    return perms.includes(permissionName);
  };

  // Check if the user has a specific role (or higher rank)
  const hasRole = (roleName) => {
    if (!profile?.role) return false;
    const userRole = ROLE_HIERARCHY[profile.role];
    const requiredRole = ROLE_HIERARCHY[roleName];
    if (!userRole || !requiredRole) return false;
    // Lower level number = higher rank
    return userRole.level <= requiredRole.level;
  };

  const value = {
    user,
    profile,
    loading,
    error,
    signIn,
    signInWithGoogle,
    logout,
    resetPassword,
    confirmPasswordResetCode,
    isAdmin,
    getAdminPermissions,
    hasPermission,
    hasRole,
    setError
  };

  return (
    <FirebaseAuthContext.Provider value={value}>
      {children}
    </FirebaseAuthContext.Provider>
  );
};

export default FirebaseAuthProvider;
