import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useFirebaseAuth } from './FirebaseAuthContext';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const { user, loading: authLoading, signIn, logout } = useFirebaseAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user?.uid) {
        setUserProfile(null);
        return;
      }
      setProfileLoading(true);
      try {
        const ref = doc(db, 'researcherProfiles', user?.uid);
        const snap = await getDoc(ref);
        if (snap?.exists()) {
          setUserProfile({ id: snap?.id, ...snap?.data() });
        } else {
          const base = {
            uid: user?.uid,
            email: user?.email,
            full_name: user?.displayName || 'Research User',
            role: 'researcher',
            is_active: true,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          await setDoc(ref, base);
          setUserProfile(base);
        }
      } catch (e) {
        console.error('Error loading researcher profile:', e);
      } finally {
        setProfileLoading(false);
      }
    };
    load();
  }, [user?.uid]);

  const updateProfile = async (updates) => {
    if (!user?.uid) return { error: { message: 'No user logged in' } };
    try {
      const ref = doc(db, 'researcherProfiles', user?.uid);
      await updateDoc(ref, { ...updates, updatedAt: new Date() });
      setUserProfile((prev) => ({ ...(prev || {}), ...updates }));
      return { data: { ...(userProfile || {}), ...updates }, error: null };
    } catch (error) {
      return { error: { message: 'Failed to update profile' } };
    }
  };

  const value = {
    user,
    userProfile,
    loading: authLoading,
    profileLoading,
    signIn,
    signOut: logout,
    updateProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
