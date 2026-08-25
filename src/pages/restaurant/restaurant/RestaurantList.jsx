import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, ChefHat, MoreVertical, Edit, Trash2, RotateCcw,
  Archive, Layers, ArrowRight, X, PlusCircle, AlertCircle
} from 'lucide-react';
import api from '../../../services/api';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import EmptyState from '../../../components/common/EmptyState';

export default function RestaurantList() {
  const navigate = useNavigate();

  // State
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'trashed'
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedRestaurantSlug, setSelectedRestaurantSlug] = useState(
    localStorage.getItem('active_restaurant_slug')
  );

  const [isSwitching, setIsSwitching] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [pendingAction, setPendingAction] = useState(null); // { id, type: 'restore' | 'trash' }

  // Delete modal state
  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    restaurant: null,
    isDeleting: false,
  });

  const searchInputRef = useRef(null);

  // Fetch function accepting explicit arguments to maintain function identity
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
        const formattedData = response.data.data.map(r => ({
          ...r,
          isTrashed: r.deleted_at !== null
        }));
        setRestaurants(formattedData);
      }
    } catch (err) {
      console.error("Failed to fetch restaurants", err);
      setError(err.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle Debounced Search & Tab Switch Effects
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRestaurants(searchQuery, activeTab);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, activeTab, fetchRestaurants]);

  // Close open row menu on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpenMenuId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Tab change handler
  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setSearchQuery('');
    setOpenMenuId(null);
  };

  // Workspace Switching
// 1. Updated Workspace Switching Handler
const handleSwitchRestaurant = (restaurant) => {
  if (restaurant.isTrashed) return;

  // If already active, navigate directly to dashboard
  if (restaurant.slug === selectedRestaurantSlug) {
    navigate('/dashboard');
    return;
  }

  // Switch to new restaurant workspace
  setIsSwitching(restaurant.id);
  localStorage.setItem('active_restaurant_slug', restaurant.slug);
  setSelectedRestaurantSlug(restaurant.slug);

  setTimeout(() => {
    setIsSwitching(null);
    navigate('/dashboard');
  }, 600);
};
  // Soft Delete Handler (With Optimistic UI Update)
  const handleSoftDelete = async (e, restaurant) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setPendingAction({ id: restaurant.id, type: 'trash' });

    try {
      await api.delete(`/restaurants/${restaurant.id}`);
      setRestaurants(prev => prev.filter(r => r.id !== restaurant.id));
    } catch (err) {
      console.error("Failed to soft delete", err);
      await fetchRestaurants(searchQuery, activeTab);
    } finally {
      setPendingAction(null);
    }
  };

  // Restore Handler (With Optimistic UI Update)
  const handleRestore = async (e, restaurant) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setPendingAction({ id: restaurant.id, type: 'restore' });

    try {
      await api.post(`/restaurants/${restaurant.id}/restore`, {});
      setRestaurants(prev => prev.filter(r => r.id !== restaurant.id));
    } catch (err) {
      console.error("Failed to restore", err);
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

  // Permanent Delete Handler
  const handlePermanentDelete = async () => {
    const { restaurant } = deleteModalState;
    if (!restaurant) return;

    setDeleteModalState(prev => ({ ...prev, isDeleting: true }));

    try {
      await api.delete(`/restaurants/${restaurant.id}/force`);

      if (restaurant.slug === selectedRestaurantSlug) {
        localStorage.removeItem('active_restaurant_slug');
        setSelectedRestaurantSlug(null);
      }

      setRestaurants(prev => prev.filter(r => r.id !== restaurant.id));

      setDeleteModalState({
        isOpen: false,
        restaurant: null,
        isDeleting: false,
      });
    } catch (err) {
      console.error("Failed to force delete", err);
      setDeleteModalState(prev => ({ ...prev, isDeleting: false }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-10 sm:px-6 md:py-14 flex flex-col items-center">

      {/* Header Section */}
      <div className="w-full max-w-6xl mb-8 text-center">
        <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 text-white shadow-lg shadow-orange-500/25 mb-4">
          <ChefHat className="w-5 h-5" strokeWidth={2.25} />
        </div>
        <h1 className="text-[26px] sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Select a workspace
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 max-w-md mx-auto leading-relaxed">
          Switch between your managed locations, or set up a new one.
        </p>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-6xl bg-white dark:bg-slate-900 rounded-2xl shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-800 overflow-hidden">

        {/* Navigation & Control Header */}
        <div className="bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between px-5 sm:px-6 border-b border-slate-100 dark:border-slate-800">

            {/* Tabs */}
            <div className="flex gap-7 -mb-px">
              <button
                onClick={() => handleTabChange('active')}
                className={`group flex items-center gap-1.5 py-3.5 text-[13px] font-medium border-b-2 transition-colors duration-150 ${
                  activeTab === 'active'
                    ? 'border-orange-500 text-slate-900 dark:text-white'
                    : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Layers className={`w-3.5 h-3.5 transition-colors ${activeTab === 'active' ? 'text-orange-500' : 'text-slate-300 dark:text-slate-600 group-hover:text-slate-400'}`} />
                Active locations
              </button>

              <button
                onClick={() => handleTabChange('trashed')}
                className={`group flex items-center gap-1.5 py-3.5 text-[13px] font-medium border-b-2 transition-colors duration-150 ${
                  activeTab === 'trashed'
                    ? 'border-orange-500 text-slate-900 dark:text-white'
                    : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Archive className={`w-3.5 h-3.5 transition-colors ${activeTab === 'trashed' ? 'text-orange-500' : 'text-slate-300 dark:text-slate-600 group-hover:text-slate-400'}`} />
                Trash
              </button>
            </div>
          </div>

          {/* Search & Actions Bar */}
          <div className="px-5 sm:px-6 py-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" strokeWidth={2} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={`Search ${activeTab === 'trashed' ? 'trash' : 'locations'}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-lg text-[13px] placeholder:text-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-150"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); searchInputRef.current?.focus(); }}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {activeTab === 'active' && (
              <button
                onClick={() => navigate('/restaurant/create')}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 active:scale-[0.98] text-white rounded-lg text-[13px] font-semibold transition-all duration-150 shadow-sm shadow-orange-500/20 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:ring-offset-2 dark:focus:ring-offset-slate-900 w-full sm:w-auto"
              >
                <PlusCircle className="w-3.5 h-3.5 stroke-[2.5]" /> Add restaurant
              </button>
            )}
          </div>
        </div>

        {/* Content View */}
        {isLoading ? (
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="rounded-2xl border border-slate-200/70 dark:border-slate-800 p-6 h-56 flex flex-col justify-between relative overflow-hidden bg-white dark:bg-slate-900">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-slate-100 dark:via-slate-800/60 to-transparent" />
                <div className="space-y-3">
                  <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
                  <div className="h-4 bg-slate-100 dark:bg-slate-800/60 rounded-full w-20" />
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-between">
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-16" />
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-24" />
                </div>
                <div className="h-9 bg-slate-100 dark:bg-slate-800 rounded-xl w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-12">
            <EmptyState
              icon={AlertCircle}
              title="Unable to load restaurants"
              description={error}
              action={
                <button
                  onClick={() => fetchRestaurants(searchQuery, activeTab)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-lg transition-colors duration-200"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Try again
                </button>
              }
            />
          </div>
        ) : restaurants.length === 0 ? (
          <div className="p-12">
            <EmptyState
              icon={activeTab === 'trashed' ? Archive : ChefHat}
              title={
                searchQuery
                  ? 'No matching locations'
                  : activeTab === 'trashed'
                    ? 'Trash is empty'
                    : 'No restaurants registered yet'
              }
              description={
                searchQuery
                  ? `No locations found matching "${searchQuery}".`
                  : activeTab === 'trashed'
                    ? 'Soft-deleted restaurants will appear here.'
                    : 'Get started by setting up your first restaurant location.'
              }
              action={
                !searchQuery && activeTab === 'active' ? (
                  <button
                    onClick={() => navigate('/restaurant/create')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-semibold transition-colors duration-200 shadow-sm"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Create Restaurant
                  </button>
                ) : searchQuery ? (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors duration-200"
                  >
                    Clear search filter
                  </button>
                ) : null
              }
            />
          </div>
        ) : (
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => {
              const isActive = selectedRestaurantSlug === restaurant.slug && !restaurant.isTrashed;
              const isSwitchingThis = isSwitching === restaurant.id;
              const isMenuOpen = openMenuId === restaurant.id;
              const isBusy = pendingAction?.id === restaurant.id;

              return (
                <div
                  key={restaurant.id}
                  className={`
                    relative group rounded-2xl border p-6 transition-all duration-200 flex flex-col justify-between gap-6 outline-none bg-white dark:bg-slate-900
                    ${restaurant.isTrashed
                      ? 'border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40'
                      : isActive
                        ? 'border-orange-400 dark:border-orange-500/50 ring-2 ring-orange-500/10 shadow-lg shadow-orange-500/5'
                        : 'border-slate-200 dark:border-slate-800 hover:border-orange-300 dark:hover:border-orange-800 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none hover:-translate-y-1'
                    }
                    ${isSwitchingThis || isBusy ? 'opacity-60 pointer-events-none' : ''}
                  `}
                >
                  {/* Card Header */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="min-w-0">
                        <h3
                          className={`font-bold text-lg leading-snug truncate ${
                            restaurant.isTrashed
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-900 dark:text-white'
                          }`}
                          title={restaurant.name}
                        >
                          {restaurant.name}
                        </h3>

                        <span
                          className={`inline-flex items-center gap-1.5 mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                            restaurant.isTrashed
                              ? 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                              : restaurant.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                                : 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              restaurant.isTrashed
                                ? 'bg-slate-400'
                                : restaurant.status === 'active'
                                  ? 'bg-emerald-500'
                                  : 'bg-amber-500'
                            }`}
                          />
                          {restaurant.isTrashed ? 'Trashed' : restaurant.status === 'active' ? 'Active' : 'Suspended'}
                        </span>
                      </div>

                      {/* Action Dropdown Menu */}
                      <div className="relative shrink-0">
                        <button
                          type="button"
                          aria-label="Open actions menu"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(isMenuOpen ? null : restaurant.id);
                          }}
                          className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {isMenuOpen && (
                          <>
                            <div
                              className="fixed inset-0 z-20"
                              onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); }}
                            />
                            <div className="absolute right-0 top-10 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl ring-1 ring-slate-200 dark:ring-slate-700 py-1.5 z-30 origin-top-right">
                              {!restaurant.isTrashed ? (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenMenuId(null);
                                      navigate(`/restaurant/edit/${restaurant.id}`);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/70 flex items-center gap-2.5"
                                  >
                                    <Edit className="w-4 h-4 text-slate-400" /> Edit details
                                  </button>
                                  <button
                                    onClick={(e) => handleSoftDelete(e, restaurant)}
                                    className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2.5"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-500" /> Move to trash
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={(e) => handleRestore(e, restaurant)}
                                    className="w-full text-left px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 flex items-center gap-2.5"
                                  >
                                    <RotateCcw className="w-4 h-4" /> Restore location
                                  </button>
                                  <button
                                    onClick={(e) => handleOpenDeleteModal(e, restaurant)}
                                    className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2.5 border-t border-slate-100 dark:border-slate-700 mt-1 pt-2"
                                  >
                                    <Trash2 className="w-4 h-4" /> Delete permanently
                                  </button>
                                </>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                      <div className="flex justify-between">
                        <span>Slug handle</span>
                        <span className="font-mono text-slate-700 dark:text-slate-300">{restaurant.slug || '—'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Switch Action */}
        {/* 2. Updated Footer Switch Action UI */}
<div>
  {!restaurant.isTrashed ? (
    <button
      type="button"
      onClick={() => handleSwitchRestaurant(restaurant)}
      disabled={isSwitchingThis}
      className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
        isActive
          ? 'bg-orange-50 hover:bg-orange-100 text-orange-600 dark:bg-orange-950/30 dark:hover:bg-orange-900/40 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50 cursor-pointer shadow-sm'
          : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 shadow-sm'
      }`}
    >
      {isSwitchingThis ? (
        <>
          <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Switching workspace…
        </>
      ) : isActive ? (
        <>
          <ChefHat className="w-4 h-4 text-orange-500" /> Open Active Workspace <ArrowRight className="w-3.5 h-3.5" />
        </>
      ) : (
        <>
          Click to switch <ArrowRight className="w-3.5 h-3.5" />
        </>
      )}
    </button>
  ) : (
    <div className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-medium text-xs text-center">
      {isBusy && pendingAction?.type === 'restore' ? 'Restoring location…' : 'Location in trash'}
    </div>
  )}
</div>
                </div>
              );
            })}
          </div>
        )}
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
            Are you sure you want to delete the{' '}
            <span className="font-bold text-slate-900 dark:text-slate-200">
              "{deleteModalState.restaurant?.name}"
            </span>{' '}
            restaurant? This action cannot be undone.
          </>
        }
        confirmText="Delete permanently"
        cancelText="Cancel"
      />

    </div>
  );
}