// src/pages/restaurants/Restaurants.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Archive, Layers, X, PlusCircle, Settings, LogOut, ChevronDown
} from 'lucide-react';
import api from '../../../services/api';
import { useRestaurant } from '../../../contexts/RestaurantContext';
import { useAuth } from '../../../contexts/AuthContext';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import RestaurantGrid from '../../../components/cards/RestaurantGrid';
import toast from 'react-hot-toast';
import { RestaurantService } from '../../../services/restaurant';

export default function Restaurants() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
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

  // Profile dropdown state
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Delete modal state
  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    restaurant: null,
    isDeleting: false,
  });

  const searchInputRef = useRef(null);
  const menuRefs = useRef({});
  const profileRef = useRef(null);




  // Fetch list (search + tab aware)
  const fetchRestaurants = useCallback(async (query = '', tab = 'active') => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {
        search: query || undefined,
        with_trashed: tab === 'trashed' ? 1 : 0,
        only_trashed: tab === 'trashed' ? 1 : 0,
      };

      const data = await RestaurantService.getRestaurants(params);
      if (data) {
        const formatted = data.map((r) => ({
          ...r,
          isTrashed: r.deleted_at !== null,
        }));
        setRestaurants(formatted);
      }
    } catch (err) {
      setError(err.response?.data?.message);
    } finally {
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

  // Close open menus on Escape key press or outside click
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpenMenuId(null);
        setIsProfileOpen(false);
      }
    };

    const handleClickOutside = (e) => {
      if (openMenuId && !menuRefs.current[openMenuId]?.contains(e.target)) {
        setOpenMenuId(null);
      }
      if (isProfileOpen && profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };

    window.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId, isProfileOpen]);

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setSearchQuery('');
    setOpenMenuId(null);
  };

  // ── Workspace Switching ──
  const handleSwitchRestaurant = (restaurant) => {
    if (restaurant.isTrashed) return;

    const isActive = restaurant.is_active === true;
    if (!isActive) {
      toast.error('This restaurant is deactivated.');
      return;
    }

    if (restaurant.slug === activeSlug) {
      navigate('/app/dashboard');
      return;
    }

    setIsSwitching(restaurant.id);
    switchRestaurant(restaurant.slug);

    setTimeout(() => {
      setIsSwitching(null);
      navigate('/app/dashboard');
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

  // Handle Logout
  const handleLogout = async () => {
    try {
      await logout();
      await api.post('/logout');

      clearActiveRestaurant();
      toast.success('Signed out successfully');
      navigate('/login'); // Adjust route as needed
    } catch (err) {
      console.error('Logout failed', err);
      toast.error('Failed to sign out');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8 space-y-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Restaurants
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Manage your restaurant locations and workspaces
            </p>
          </div>
        </div>

        <div className="flex flex-col  sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Add Restaurant Button */}
            {activeTab === 'active' && (
              <button
                onClick={() => navigate('/restaurant/create')}
                title="Add Restaurant"
                className="inline-flex items-center justify-center gap-2 px-2 py-2 sm:px-5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-md text-sm font-semibold transition-all duration-200 active:scale-[0.98]"
              >
                <PlusCircle className="w-4 h-4 shrink-0" />
                <span className="">Add Restaurant</span>
              </button>
            )}

            {/* Organization Settings Button */}
            <button
              onClick={() => navigate('/restaurant/organization/settings')}
              title="Organization Settings"
              className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md text-sm font-semibold transition-all active:scale-[0.98]"
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span className="hidden md:inline">Organization Settings</span>
            </button>

            {/* ── Account / Profile Dropdown ── */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 sm:gap-3 px-2.5 sm:pl-1 sm:pr-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200"
              >
                <p className="text-sm font-semibold text-slate-900 dark:text-white leading-none capitalize">
                  {user.name}
                </p>
                <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute left-0 mt-1 w-38 bg-white dark:bg-slate-800 rounded-md shadow-md shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-200 dark:border-slate-700 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 px-2 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-md"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto">

        <div className="mb-6 flex flex-col gap-4 rounded-md border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
          <div className="w-full sm:max-w-xs md:max-w-sm">
            <div className="relative w-full">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors peer-focus:text-orange-500"
                strokeWidth={2}
              />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={`Search ${activeTab === 'trashed' ? 'deleted' : 'active'} restaurants...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="peer w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-orange-500 dark:focus:bg-slate-800 dark:hover:border-slate-600"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    searchInputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-200/60 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="w-full sm:w-auto">
            <div className="inline-flex w-full rounded-md bg-slate-100 p-1 sm:w-auto dark:bg-slate-800/60">

              {/* Active Tab */}
              <button
                type="button"
                onClick={() => handleTabChange('active')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3.5 py-2 text-sm font-medium transition-all duration-150 sm:flex-none ${activeTab === 'active'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
              >
                <Layers className="h-4 w-4" />
                <span>Active</span>
                <span
                  className={`ml-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${activeTab === 'active'
                      ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400'
                      : 'bg-slate-200/70 text-slate-600 dark:bg-slate-600/50 dark:text-slate-400'
                    }`}
                >
                  {activeTab === 'active' ? restaurants.length : '-'}
                </span>
              </button>

              {/* Trash Tab */}
              <button
                type="button"
                onClick={() => handleTabChange('trashed')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3.5 py-2 text-sm font-medium transition-all duration-150 sm:flex-none ${activeTab === 'trashed'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
              >
                <Archive className="h-4 w-4" />
                <span>Trash</span>
                <span
                  className={`ml-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${activeTab === 'trashed'
                      ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400'
                      : 'bg-slate-200/70 text-slate-600 dark:bg-slate-600/50 dark:text-slate-400'
                    }`}
                >
                  {activeTab === 'trashed' ? restaurants.length : '-'}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-md ring-1 ring-slate-200/80 dark:ring-slate-800 overflow-hidden">
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