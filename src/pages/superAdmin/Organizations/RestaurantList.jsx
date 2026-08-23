import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Building2, AlertCircle, ArrowLeft } from 'lucide-react';
import Toolbar from '../../../components/Toolbar';
import StatusBadge from '../../../components/ui/StatusBadge';
import EmptyState from '../../../components/common/EmptyState';
import api from '../../../services/api';

export default function RestaurantsPage() {
  const { id } = useParams();

  const [organization, setOrganization] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchOrganizationRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/organizations/${id}`);

      const orgData = response.data?.data;
      setOrganization(orgData);
      setRestaurants(orgData?.restaurants);
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

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(item => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase())

      const currentStatus = item.is_active ? 'Active' : 'Inactive';
      const matchesStatus = statusFilter === 'All' || currentStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [restaurants, searchQuery, statusFilter]);

  return (
    <div className="p-2 sm:p-4 space-y-6 bg-gray-50 dark:bg-slate-950 min-h-screen text-gray-900 dark:text-slate-100 transition-colors duration-200">

      {/* HEADER & BACK BUTTON */}
      <div>
        <Link
          to="/tenants"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200 mb-2 transition-colors duration-200"
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
          searchPlaceholder="Search restaurants name."
          filters={['All', 'Active', 'Inactive']}
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />
      </div>

      {/* CONTENT AREA */}
      {loading ? (
        /* LOADING SKELETON GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm animate-pulse"
            >
              <div className="h-40 bg-gray-200 dark:bg-slate-800" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-gray-200 dark:bg-slate-800 rounded w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-1/2" />
                <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded w-1/3" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
            >
              <div>
                {/* Image Header */}
                <div className="h-40 bg-gray-100 dark:bg-slate-800 relative overflow-hidden flex items-center justify-center transition-colors duration-200">
                  {restaurant.logo ? (
                    <img
                      src={restaurant.logo}
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <Building2 className="w-12 h-12 text-gray-300 dark:text-slate-600" />
                  )}
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white transition-colors duration-200">
                      {restaurant.name}
                    </h3>
                    <StatusBadge
                      status={restaurant.is_active ? 'Active' : 'Inactive'}
                      size="xs"
                    />
                  </div>

                  {/* Tenant Tag */}
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 mb-2 transition-colors duration-200">
                    <Building2 className="w-3.5 h-3.5" /> {organization?.name}
                  </p>

                  <p className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1 truncate transition-colors duration-200">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-gray-400 dark:text-slate-500 transition-colors duration-200" /> {restaurant.slug}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}