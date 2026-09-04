import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, AlertCircle, ArrowLeft, Power, Loader2, 
  Calendar, Globe, Activity, ChefHat, ArrowRight,
  CheckCircle, XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import Toolbar from '../../../components/Toolbar';
import StatusBadge from '../../../components/StatusBadge';
import EmptyState from '../../../components/common/EmptyState';
import api from '../../../services/api';
import { formatDate } from '../../../utils/formatDate';

export default function RestaurantsPage() {
  const { id } = useParams();

  const [organization, setOrganization] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Track which restaurant ID is currently toggling active status
  const [togglingId, setTogglingId] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchOrganizationRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/organizations/${id}`);

      const orgData = response.data?.data;
      setOrganization(orgData);
      setRestaurants(orgData?.restaurants || []);
    } catch (err) {
      setError(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrganizationRestaurants();
    }
  }, [id]);

  // Toggle Restaurant Active/Inactive Status API Handler
  const handleToggleActive = async (restaurant) => {
    const nextStatus = !restaurant.is_active;
    setTogglingId(restaurant.id);

    try {
      // API call to update status
      const response = await api.patch(`/restaurants/${restaurant.id}/toggle-active`, {
        is_active: nextStatus,
      });

      // Update local state optimistically
      setRestaurants((prev) =>
        prev.map((r) =>
          r.id === restaurant.id ? { ...r, is_active: nextStatus } : r
        )
      );

      toast.success(response.data?.message);
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setTogglingId(null);
    }
  };

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Active' && item.is_active) ||
        (statusFilter === 'Inactive' && !item.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [restaurants, searchQuery, statusFilter]);

  return (
    <div className="p-2 sm:p-4 space-y-4 bg-gray-50 dark:bg-slate-950 min-h-screen text-gray-900 dark:text-slate-100 transition-colors duration-200">
      {/* HEADER & BACK BUTTON */}
      <div>
        <Link
          to="/tenants"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200 mb-1.5 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Organizations
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">
          {organization?.name || 'Organization Restaurants'}
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 transition-colors duration-200">
          Overview of all store locations for {organization?.name || 'this tenant'}.
        </p>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-200">
        <Toolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search restaurants name..."
          filters={['All', 'Active', 'Inactive']}
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />
      </div>

      {/* CONTENT AREA */}
      {loading ? (
        /* SKELETON GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between h-[280px] animate-pulse"
            >
              {/* Header Skeleton */}
              <div className="p-4 pb-2.5">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-gray-200 dark:bg-slate-800" />
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-3/4" />
                  </div>
                </div>
              </div>

              {/* Metadata Skeleton */}
              <div className="px-4 pb-2.5 space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded w-1/2" />
                <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded w-2/3" />
                <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded w-1/4" />
                <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded w-1/3" />
                <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded w-1/3" />
              </div>

              {/* Action Area Skeleton */}
              <div className="p-4 pt-0">
                <div className="h-9 bg-gray-200 dark:bg-slate-800 rounded-xl w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        /* ERROR STATE */
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-6 transition-colors duration-200">
          <EmptyState
            icon={AlertCircle}
            title={error}
            description="An error occurred while fetching restaurants."
            action={
              <button
                onClick={fetchOrganizationRestaurants}
                className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors duration-200"
              >
                Try Again
              </button>
            }
          />
        </div>
      ) : filteredRestaurants.length === 0 ? (
        /* EMPTY STATE */
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-6 transition-colors duration-200">
          <EmptyState
            icon={Building2}
            title="No restaurants found"
            description={
              searchQuery || statusFilter !== 'All'
                ? 'Try adjusting your search or status filter'
                : 'This organization does not have any restaurants registered yet.'
            }
          />
        </div>
      ) : (
        /* RESTAURANT CARDS GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRestaurants.map((restaurant) => {
            const isTogglingThis = togglingId === restaurant.id;
            const isRestaurantActive = restaurant.is_active;

            return (
              <div
                key={restaurant.id}
                className={`
                  group relative rounded-2xl border p-4 transition-all duration-300 flex flex-col gap-3 outline-none
                  ${restaurant.isTrashed 
                    ? 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 opacity-75'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none hover:-translate-y-1'
                  }
                  ${isTogglingThis ? 'opacity-60 pointer-events-none' : ''}
                `}
              >
                {/* Card Header */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {restaurant.logo ? (
                      <img
                        src={restaurant.logo}
                        alt={restaurant.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <Building2 className="w-5 h-5" />
                    )}
                  </div>

                  <h3
                    className="font-bold text-sm leading-tight truncate text-slate-900 dark:text-white"
                    title={restaurant.name}
                  >
                    {restaurant.name}
                  </h3>
                </div>

                {/* Metadata with Status and Visibility */}
                <div className="space-y-2 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Globe className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">
                      <span className="font-mono text-slate-600 dark:text-slate-300">
                        {restaurant.slug}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{organization?.name}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Created: {formatDate(restaurant.created_at)}</span>
                  </div>

                  {/* Status Field */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Status:</span>
                    <div className="flex items-center gap-1.5">
                      <StatusBadge status={restaurant.status} />
                    </div>
                  </div>

                  {/* Visibility Field */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Visibility:</span>
                    <div className="flex items-center gap-1.5">
                      <StatusBadge
                        status={restaurant.is_active ? 'active' : 'inactive'}
                      />
                    </div>
                  </div>

                  {restaurant.currency && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <Activity className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {restaurant.currency}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="pt-1.5">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(restaurant)}
                    disabled={isTogglingThis}
                    className={`w-full py-2 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                      isRestaurantActive
                        ? 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/30 active:scale-[0.98]'
                        : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98]'
                    }`}
                  >
                    {isTogglingThis ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Updating...
                      </>
                    ) : isRestaurantActive ? (
                      <>
                        <Power className="w-4 h-4" />
                        Deactivate Restaurant
                      </>
                    ) : (
                      <>
                        <ChefHat className="w-4 h-4" />
                        Activate Restaurant
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}