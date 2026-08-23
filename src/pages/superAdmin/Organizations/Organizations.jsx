import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import StatsCard from '../../../components/cards/StatsCard';
import Toolbar from '../../../components/Toolbar';
import StatusBadge from '../../../components/ui/StatusBadge';
import Table from '../../../components/ui/Table';
import api from '../../../services/api';

export default function Organizations() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/organizations');
      setTenants(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const filteredTenants = tenants.filter((tenant) => {
    const tenantEmail = tenant.owner?.email || '';
    const statusLabel = tenant.is_active ? 'Active' : 'Suspended';

    const matchesSearch =
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenantEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || statusLabel === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { label: 'Organization', align: 'left' },
    { label: 'Restaurants', align: 'left' },
    { label: 'Status', align: 'left' },
    { label: 'Actions', align: 'right' },
  ];

  return (
    <div className="p-2 sm:p-4 space-y-6 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-200">

      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors duration-200">
          Tenants
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-200">
          Manage organizations using your platform.
        </p>
      </div>

      {/* SUMMARY METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard label="Total Organizations" value={loading ? '...' : tenants.length} />
        <StatsCard
          label="Active Tenants"
          value={loading ? '...' : tenants.filter((t) => t.is_active).length}
          valueColor="text-emerald-600 dark:text-emerald-400"
        />
        <StatsCard
          label="Total Restaurants"
          value={loading ? '...' : tenants.reduce((sum, t) => sum + (t.restaurants_count || 0), 0)}
        />
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-200">

        <Toolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search tenants or emails..."
          filters={['All', 'Active', 'Suspended']}
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />

        {/* REUSABLE TABLE INTEGRATION */}
        <Table
          columns={columns}
          data={filteredTenants}
          loading={loading}
          error={error}
          onRetry={fetchOrganizations}
          emptyIcon={Building2}
          emptyTitle="No tenants found"
          emptyDescription={
            searchQuery || statusFilter !== 'All'
              ? 'Try adjusting your search or filters'
              : 'No organizations have been created yet'
          }
          renderRow={(tenant, idx) => (
            <tr
              key={tenant.id}
              className={`hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200 ${
                idx !== filteredTenants.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''
              }`}
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 transition-colors duration-200">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100 transition-colors duration-200">
                      {tenant.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors duration-200">
                      {tenant.owner?.email}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium transition-colors duration-200">
                {tenant.restaurants_count}
              </td>
              <td className="px-6 py-4">
                <StatusBadge
                  status={tenant.is_active ? 'Active' : 'Suspended'}
                  activeLabel="Active"
                  inactiveLabel="Suspended"
                />
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    to={`/restaurants/${tenant.id}`}
                    title="View Restaurants"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors duration-200"
                  >
                    <span>View</span>
                  </Link>
                </div>
              </td>
            </tr>
          )}
        />

      </div>

    </div>
  );
}