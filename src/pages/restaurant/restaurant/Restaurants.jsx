// src/pages/restaurants/Restaurants.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, ChefHat,
  Archive, Layers, X, PlusCircle
} from 'lucide-react';
import api from '../../../services/api';
import { useRestaurant } from '../../../contexts/RestaurantContext';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import RestaurantGrid from '../../../components/cards/RestaurantGrid';
import toast from 'react-hot-toast';


export default function Restaurants() {
  const navigate = useNavigate();

  // ── Shared context ──
  const {
    activeSlug,
    switchRestaurant,
    clearActiveRestaurant,
    fetchRestaurants: refreshContextRestaurants,
  } = useRestaurant();

  // ── Local page state ──
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSwitching, setIsSwitching] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  // Delete modal state
  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    restaurant: null,
    isDeleting: false,
  });

  const searchInputRef = useRef(null);
  const menuRefs = useRef({});

  // Fetch list (search + tab aware)
  const fetchRestaurants = useCallback(async (search, tab) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {
        search: search,
        ...(tab === 'trashed' ? { only_trashed: 1 } : { with_trashed: 0 }),
      };

      const response = await api.get('/restaurants', { params });

      if (response.data?.data) {
        const formattedData = response.data.data.map((r) => ({
          ...r,
          isTrashed: r.deleted_at !== null,
        }));
        setRestaurants(formattedData);
      }
    } catch (err) {
      console.error('Failed to fetch restaurants', err);
      setError(err.response?.data?.message || 'Failed to fetch restaurants');
    }
    finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search & tab switch
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRestaurants(searchQuery, activeTab);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, activeTab, fetchRestaurants]);

  // Close open row menu on Escape key press or outside click
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpenMenuId(null);
    };

    const handleClickOutside = (e) => {
      if (openMenuId && !menuRefs.current[openMenuId]?.contains(e.target)) {
        setOpenMenuId(null);
      }
    };

    window.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setSearchQuery('');
    setOpenMenuId(null);
  };

  // ── Workspace Switching ──
    const handleSwitchRestaurant = (restaurant) => {
    if (restaurant.isTrashed) return;
    
    // NEW: prevent switching to deactivated restaurants
    const isActive =
      restaurant.is_active === true 
    if (!isActive) {
      toast.error('This restaurant is deactivated.');
      return;
    }

    if (restaurant.slug === activeSlug) {
      navigate('/dashboard');
      return;
    }

    setIsSwitching(restaurant.id);
    switchRestaurant(restaurant.slug);

    setTimeout(() => {
      setIsSwitching(null);
      navigate('/dashboard');
    }, 600);
  };

  // ── Toggle Active / Inactive Status ──
  const handleToggleStatus = async (e, restaurant) => {
    e.stopPropagation();
    setOpenMenuId(null);

    const newStatus = restaurant.status === 'active' ? 'suspended' : 'active';
    setPendingAction({ id: restaurant.id, type: 'toggleStatus' });

    try {
      const response = await api.patch(`/restaurants/${restaurant.id}/toggle-status`, { status: newStatus });

      setRestaurants((prev) =>
        prev.map((r) => (r.id === restaurant.id ? { ...r, status: newStatus } : r))
      );
      toast.success(response.data?.message);
      refreshContextRestaurants();

    } catch (err) {
      toast.error(err.response?.data?.message);
      await fetchRestaurants(searchQuery, activeTab);
    } finally {
      setPendingAction(null);
    }
  };

  // Soft Delete
  const handleSoftDelete = async (e, restaurant) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setPendingAction({ id: restaurant.id, type: 'trash' });

    try {
      await api.delete(`/restaurants/${restaurant.id}`);
      setRestaurants((prev) => prev.filter((r) => r.id !== restaurant.id));
      refreshContextRestaurants();
    } catch (err) {
      console.error('Failed to soft delete', err);
      await fetchRestaurants(searchQuery, activeTab);
    } finally {
      setPendingAction(null);
    }
  };

  // Restore
  const handleRestore = async (e, restaurant) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setPendingAction({ id: restaurant.id, type: 'restore' });

    try {
      await api.post(`/restaurants/${restaurant.id}/restore`, {});
      setRestaurants((prev) => prev.filter((r) => r.id !== restaurant.id));
      refreshContextRestaurants();
    } catch (err) {
      console.error('Failed to restore', err);
      await fetchRestaurants(searchQuery, activeTab);
    } finally {
      setPendingAction(null);
    }
  };

  // Delete modal management
  const handleOpenDeleteModal = (e, restaurant) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setDeleteModalState({
      isOpen: true,
      restaurant,
      isDeleting: false,
    });
  };

  const handleCloseDeleteModal = () => {
    if (!deleteModalState.isDeleting) {
      setDeleteModalState({
        isOpen: false,
        restaurant: null,
        isDeleting: false,
      });
    }
  };

  // Permanent Delete
  const handlePermanentDelete = async () => {
    const { restaurant } = deleteModalState;
    if (!restaurant) return;

    setDeleteModalState((prev) => ({ ...prev, isDeleting: true }));

    try {
      await api.delete(`/restaurants/${restaurant.id}/force`);

      if (restaurant.slug === activeSlug) {
        clearActiveRestaurant();
      }

      setRestaurants((prev) => prev.filter((r) => r.id !== restaurant.id));
      refreshContextRestaurants();

      setDeleteModalState({
        isOpen: false,
        restaurant: null,
        isDeleting: false,
      });
    } catch (err) {
      console.error('Failed to force delete', err);
      setDeleteModalState((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  // Toggle menu
  const toggleMenu = (e, restaurantId) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === restaurantId ? null : restaurantId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30">
                <ChefHat className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Restaurants
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Manage your restaurant locations and workspaces
                </p>
              </div>
            </div>
          </div>

          {activeTab === 'active' && (
            <button
              onClick={() => navigate('/restaurant/create')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              <PlusCircle className="w-4 h-4" />
              Add Restaurant
            </button>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 ring-1 ring-slate-200/80 dark:ring-slate-800 overflow-hidden">
          {/* Tabs & Controls */}
          <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="px-6 pt-4">
              <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl w-fit">
                <button
                  onClick={() => handleTabChange('active')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'active'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                >
                  <Layers className="w-4 h-4" />
                  Active
                  <span
                    className={`ml-1 px-2 py-0.5 text-xs rounded-full ${activeTab === 'active'
                      ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                  >
                    {restaurants.filter((r) => !r.isTrashed).length}
                  </span>
                </button>

                <button
                  onClick={() => handleTabChange('trashed')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'trashed'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                >
                  <Archive className="w-4 h-4" />
                  Trash
                  <span
                    className={`ml-1 px-2 py-0.5 text-xs rounded-full ${activeTab === 'trashed'
                      ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                  >
                    {restaurants.filter((r) => r.isTrashed).length}
                  </span>
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="px-6 py-4">
              <div className="relative max-w-md">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                  strokeWidth={2}
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={`Search ${activeTab === 'trashed' ? 'deleted' : 'active'} restaurants...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm placeholder:text-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Content View handled inside Grid */}
          <RestaurantGrid
            restaurants={restaurants}
            activeSlug={activeSlug}
            isSwitching={isSwitching}
            pendingAction={pendingAction}
            openMenuId={openMenuId}
            menuRefs={menuRefs}
            isLoading={isLoading}
            error={error}
            activeTab={activeTab}
            searchQuery={searchQuery}
            onToggleMenu={toggleMenu}
            onToggleStatus={handleToggleStatus}
            onSoftDelete={handleSoftDelete}
            onRestore={handleRestore}
            onOpenDeleteModal={handleOpenDeleteModal}
            onSwitchRestaurant={handleSwitchRestaurant}
            onRetry={() => fetchRestaurants(searchQuery, activeTab)}
            onCreateRestaurant={() => navigate('/restaurant/create')}
            onClearSearch={() => setSearchQuery('')}
          />
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalState.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handlePermanentDelete}
        isLoading={deleteModalState.isDeleting}
        title="Delete permanently?"
        message={
          <>
            Are you sure you want to delete{' '}
            <span className="font-bold text-slate-900 dark:text-slate-200">
              "{deleteModalState.restaurant?.name}"
            </span>
            ? This action cannot be undone.
          </>
        }
        confirmText="Delete permanently"
        cancelText="Cancel"
      />
    </div>
  );
}