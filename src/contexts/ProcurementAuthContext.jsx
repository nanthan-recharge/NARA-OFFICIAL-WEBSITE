import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/procurementRecruitmentService';

const ProcurementAuthContext = createContext();

export const useProcurementAuth = () => {
  const context = useContext(ProcurementAuthContext);
  if (!context) {
    throw new Error('useProcurementAuth must be used within a ProcurementAuthProvider');
  }
  return context;
};

export const ProcurementAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = () => {
    try {
      const currentUser = authService?.getCurrentUser();
      const isAuth = authService?.isAuthenticated();
      
      if (currentUser && isAuth) {
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService?.login(credentials);
      
      setUser(response?.user);
      setIsAuthenticated(true);
      
      return { success: true, user: response?.user };
    } catch (error) {
      setError(error?.message);
      setUser(null);
      setIsAuthenticated(false);
      
      return { success: false, error: error?.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService?.register(userData);
      
      setUser(response?.user);
      setIsAuthenticated(true);
      
      return { success: true, user: response?.user };
    } catch (error) {
      setError(error?.message);
      setUser(null);
      setIsAuthenticated(false);
      
      return { success: false, error: error?.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService?.logout();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    initializeAuth
  };

  return (
    <ProcurementAuthContext.Provider value={value}>
      {children}
    </ProcurementAuthContext.Provider>
  );
};

export default ProcurementAuthContext;