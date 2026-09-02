import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const RestaurantContext = createContext(null);

export function RestaurantProvider({ children }) {
  const { user, isAuthenticated } = useAuth();

  const [activeSlug, setActiveSlug] = useState(() =>
    localStorage.getItem('active_restaurant_slug')
  );
  const [activeRestaurant, setActiveRestaurant] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ── Fetch for owners/admins ──
  const fetchRestaurants = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/restaurants', { params: { with_trashed: 0 } });
      if (res.data?.data) {
        const active = res.data.data
          .map((r) => ({ ...r, isTrashed: r.deleted_at !== null }))
          .filter((r) => !r.isTrashed);
        setRestaurants(active);
      }
    } catch (err) {
      console.error('RestaurantContext: fetch failed', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Derive active object from slug + list ──
  useEffect(() => {
    if (activeSlug && restaurants.length > 0) {
      const found = restaurants.find((r) => r.slug === activeSlug);
      setActiveRestaurant(found || null);
    } else {
      setActiveRestaurant(null);
    }
  }, [activeSlug, restaurants]);

  // ── Initialize: staff (from auth) vs owner (from API) ──
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setRestaurants([]);
      setActiveSlug(null);
      setActiveRestaurant(null);
      return;
    }

    const isStaff = !['restaurant_admin'].includes(user.role);

    if (isStaff && user.restaurants?.length > 0) {
      // Staff: assigned restaurants are embedded in the auth user payload
      setRestaurants(user.restaurants);
      setIsLoading(false);

      const currentSlug = localStorage.getItem('active_restaurant_slug');
      const allowedSlugs = user.restaurants.map((r) => r.slug);

      if (!currentSlug || !allowedSlugs.includes(currentSlug)) {
        const firstSlug = user.restaurants[0].slug;
        localStorage.setItem('active_restaurant_slug', firstSlug);
        setActiveSlug(firstSlug);
      } else {
        setActiveSlug(currentSlug);
      }
    } else {
      // Owner / Super admin: fetch full list from API
      fetchRestaurants();
      setActiveSlug(localStorage.getItem('active_restaurant_slug'));
    }
  }, [user, isAuthenticated, fetchRestaurants]);

  const switchRestaurant = useCallback((slug) => {
    localStorage.setItem('active_restaurant_slug', slug);
    setActiveSlug(slug);
  }, []);

  const clearActiveRestaurant = useCallback(() => {
    localStorage.removeItem('active_restaurant_slug');
    setActiveSlug(null);
  }, []);

  const refreshContextRestaurants = useCallback(() => {
    // Staff list comes from auth payload; owners need API refresh
    if (user && ['restaurant_admin'].includes(user.role)) {
      fetchRestaurants();
    }
  }, [user, fetchRestaurants]);

  return (
    <RestaurantContext.Provider
      value={{
        restaurants,
        activeSlug,
        activeRestaurant,
        isLoading,
        fetchRestaurants: refreshContextRestaurants,
        switchRestaurant,
        clearActiveRestaurant,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export const useRestaurant = () => {
  const ctx = useContext(RestaurantContext);
  if (!ctx) throw new Error('useRestaurant must be used inside <RestaurantProvider>');
  return ctx;
};