// Firebase Authentication Context for NARA Admin Portal
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  confirmPasswordReset
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
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

export const FirebaseAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Google Auth Provider
  const googleProvider = new GoogleAuthProvider();
  googleProvider?.setCustomParameters({
    domain_hint: 'nara.gov.lk'
  });

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
  }, []);

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      await ensureAdminProfile(result?.user);
      return result;
    } catch (error) {
      setError(error?.message);
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      await ensureAdminProfile(result?.user);
      return result;
    } catch (error) {
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

  // Ensure a Firestore admin profile exists for the authenticated user
  const ensureAdminProfile = async (firebaseUser) => {
    if (!firebaseUser) return;
    try {
      const profileRef = doc(db, 'adminProfiles', firebaseUser?.uid);
      const snap = await getDoc(profileRef);
      const base = {
        uid: firebaseUser?.uid,
        email: firebaseUser?.email,
        displayName: firebaseUser?.displayName || 'Admin User',
        photoURL: firebaseUser?.photoURL || null,
        role: 'admin',
        is_active: true,
        lastLoginAt: new Date()
      };
      if (!snap?.exists()) {
        await setDoc(profileRef, { ...base, createdAt: new Date(), updatedAt: new Date() });
      } else {
        await updateDoc(profileRef, { lastLoginAt: new Date(), updatedAt: new Date() });
      }
      setProfile({ ...base });
    } catch (error) {
      console.error('Error ensuring admin profile:', error);
    }
  };

  // Load user profile from Firestore
  const loadUserProfile = async (user) => {
    if (!user) return;
    try {
      const ref = doc(db, 'adminProfiles', user?.uid);
      const snap = await getDoc(ref);
      if (!snap?.exists()) {
        await ensureAdminProfile(user);
        return;
      }
      const profileData = snap?.data();
      setProfile(profileData);
      await updateDoc(ref, { lastLoginAt: new Date() });
    } catch (error) {
      console.error('Error loading user profile:', error);
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