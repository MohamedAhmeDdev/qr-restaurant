import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Helper: auto-assign first restaurant for staff ──
  const autoAssignStaffRestaurant = useCallback((userData) => {
    if (userData?.restaurants?.length > 0) {
      const currentSlug = localStorage.getItem('active_restaurant_slug');
      const allowedSlugs = userData.restaurants.map((r) => r.slug);

      // Set only if missing or current slug is no longer in their assignment list
      if (!currentSlug || !allowedSlugs.includes(currentSlug)) {
        localStorage.setItem('active_restaurant_slug', userData.restaurants[0].slug);
      }
    }
  }, []);

  // ── Mount check ──
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // NOTE: /verify should NOT have EnsureRestaurantAccess middleware
        const { data } = await api.get('/verify');
        setUser(data.user);
        autoAssignStaffRestaurant(data.user);
      } catch (err) {
        console.error('Auth check failed:', err);
        localStorage.removeItem('authToken');
        localStorage.removeItem('active_restaurant_slug');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [autoAssignStaffRestaurant]);

  // ── Login ──
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/login', { email, password });

      if (data.two_factor_required) {
        return {
          success: true,
          two_factor_required: true,
          email: data.email,
          message: data.message,
        };
      }

      localStorage.setItem('authToken', data.token);
      setUser(data.user);
      autoAssignStaffRestaurant(data.user);

      return {
        success: true,
        user: data.user,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error?.response?.data?.message,
      };
    }
  };

  // ── 2FA completion ──
  const setAuthSession = ({ token, user }) => {
    localStorage.setItem('authToken', token);
    setUser(user);
    autoAssignStaffRestaurant(user);
  };

  // ── Logout ──
  const logout = useCallback(async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('active_restaurant_slug');
      setUser(null);
    }
  }, []);

  // ── Register ──
  const register = useCallback(async (userData) => {
    try {
      const { data } = await api.post('/register', userData);

      if (data.token) {
        localStorage.setItem('authToken', data.token);
        setUser(data.user);
        autoAssignStaffRestaurant(data.user);
      }

      return {
        success: true,
        user: data.user,
        token: data.token,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error?.response?.data?.message,
      };
    }
  }, [autoAssignStaffRestaurant]);

  // ── Profile update ──
  const updateUser = useCallback((updatedData) => {
    setUser((prev) => (prev ? { ...prev, ...updatedData } : null));
  }, []);

  // ── Role check ──
  const hasRole = useCallback((role) => {
    if (!user || !user.role) return false;
    if (Array.isArray(role)) return role.includes(user.role);
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
  if (!context) throw new Error('useAuth must be used within an <AuthProvider>');
  return context;
};