import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

const LibraryUserContext = createContext({});

export const useLibraryUser = () => {
  const context = useContext(LibraryUserContext);
  if (!context) {
    throw new Error('useLibraryUser must be used within LibraryUserProvider');
  }
  return context;
};

const getRolePermissions = (role) => {
  const basePermissions = {
    canBorrow: false,
    canSubmitResearch: false,
    canAccessPremium: false,
    maxLoans: 0,
    loanPeriodDays: 0
  };

  switch (role) {
    case 'researcher':
      return { ...basePermissions, canBorrow: true, canSubmitResearch: true, canAccessPremium: true, maxLoans: 10, loanPeriodDays: 30 };
    case 'student':
      return { ...basePermissions, canBorrow: true, maxLoans: 5, loanPeriodDays: 14 };
    case 'public':
      return { ...basePermissions, canBorrow: true, maxLoans: 3, loanPeriodDays: 7 };
    default:
      return basePermissions;
  }
};

export const LibraryUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const googleProvider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await loadUserProfile(firebaseUser.uid);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loadUserProfile = async (uid) => {
    try {
      const userRef = doc(db, 'libraryUsers', uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserProfile({ id: userSnap.id, ...userSnap.data() });
      }
    } catch (err) {
      console.error('Error loading user profile:', err);
      setError(err.message);
    }
  };

  const register = async (email, password, role, profileData) => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const cardNumber = `NARA-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const permissions = getRolePermissions(role);

      const userProfile = {
        uid: firebaseUser.uid,
        email: email,
        role: role,
        profile: {
          firstName: profileData.firstName || '',
          lastName: profileData.lastName || '',
          displayName: `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim(),
          phoneNumber: profileData.phoneNumber || '',
          institution: profileData.institution || '',
          studentId: profileData.studentId || '',
          researchArea: profileData.researchArea || '',
        },
        libraryCard: {
          cardNumber: cardNumber,
          issueDate: new Date().toISOString(),
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          type: role
        },
        permissions: permissions,
        statistics: {
          totalBorrowed: 0,
          activeLoans: 0,
          overdueItems: 0,
          finesOwed: 0,
          researchSubmissions: role === 'researcher' ? 0 : null
        },
        status: 'active',
        emailVerified: false,
        accountCreatedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(db, 'libraryUsers', firebaseUser.uid), userProfile);
      await sendEmailVerification(firebaseUser);
      setUserProfile(userProfile);
      return { success: true, user: firebaseUser };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const signIn = async (email, password) => {
    try {
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userRef = doc(db, 'libraryUsers', userCredential.user.uid);
      await updateDoc(userRef, { lastLoginAt: serverTimestamp(), updatedAt: serverTimestamp() });
      return { success: true, user: userCredential.user };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const signInWithGoogle = async (role = 'public') => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      const userRef = doc(db, 'libraryUsers', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const cardNumber = `NARA-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const permissions = getRolePermissions(role);
        const userProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          role: role,
          profile: {
            firstName: firebaseUser.displayName?.split(' ')[0] || '',
            lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
            displayName: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL || '',
          },
          libraryCard: { cardNumber, issueDate: new Date().toISOString(), expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), status: 'active', type: role },
          permissions: permissions,
          statistics: { totalBorrowed: 0, activeLoans: 0, overdueItems: 0, finesOwed: 0, researchSubmissions: role === 'researcher' ? 0 : null },
          status: 'active',
          emailVerified: firebaseUser.emailVerified,
          accountCreatedAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        await setDoc(userRef, userProfile);
        setUserProfile(userProfile);
      } else {
        await updateDoc(userRef, { lastLoginAt: serverTimestamp(), updatedAt: serverTimestamp() });
      }
      return { success: true, user: firebaseUser };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateProfile = async (updates) => {
    if (!user) throw new Error('No user logged in');
    try {
      setError(null);
      const userRef = doc(db, 'libraryUsers', user.uid);
      await updateDoc(userRef, { ...updates, updatedAt: serverTimestamp() });
      await loadUserProfile(user.uid);
      return { success: true };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const hasPermission = (permission) => {
    if (!userProfile) return false;
    return userProfile.permissions[permission] === true;
  };

  const hasRole = (roles) => {
    if (!userProfile) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(userProfile.role);
  };

  const value = {
    user,
    userProfile,
    loading,
    error,
    register,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile,
    hasPermission,
    hasRole,
    isAuthenticated: !!user,
    isEmailVerified: user?.emailVerified || false,
    setError
  };

  return (
    <LibraryUserContext.Provider value={value}>
      {children}
    </LibraryUserContext.Provider>
  );
};

export default LibraryUserProvider;
