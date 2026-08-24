import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const { data } = await api.get('/verify');
        setUser(data.user);
      } catch (err) {
        console.error('Auth check failed:', err);
        localStorage.removeItem('authToken');
        api.defaults.headers.common['Authorization'] = '';
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/login', { email, password });

      // 2FA required — return flag WITHOUT setting session yet
      if (data.two_factor_required) {
        return {
          success: true,
          two_factor_required: true,
          email: data.email,
          message: data.message,
        };
      }

      // Normal login — set session immediately
      localStorage.setItem('authToken', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data.user);

      return { 
        success: true, 
        user: data.user,
        message: data.message
      };

    } catch (error) {
      return {
        success: false,
        error: error?.response?.data?.message,
      };
    }
  };

  // Call this after 2FA verification to set the final session
  const setAuthSession = ({ token, user }) => {
    localStorage.setItem('authToken', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
  };

  // Logout function
  const logout = useCallback(async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('authToken');
      api.defaults.headers.common['Authorization'] = '';
      setUser(null);
    }
  }, []);

  // Register function
// Register function - cleaned up version
const register = useCallback(async (userData) => {
  try {
    const { data } = await api.post('/register', userData);

    if (data.token) {
      localStorage.setItem('authToken', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data.user);
    }

    return { 
      success: true, 
      user: data.user,
      token: data.token,  
      message: data.message
    };
  } catch (error) {
    return {
      success: false,
      error: error?.response?.data?.message,
    };
  }
}, []);

  // Update user profile (local only)
  const updateUser = useCallback((updatedData) => {
    setUser((prev) => (prev ? { ...prev, ...updatedData } : null));
  }, []);

  // Check if user has specific role
  const hasRole = useCallback((role) => {
    if (!user || !user.role) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  }, [user]);

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    updateUser,
    hasRole,
    setAuthSession,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return context;
};