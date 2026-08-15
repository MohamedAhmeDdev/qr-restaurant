// Tenants.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Trash2, Power } from 'lucide-react';
import StatsCard from '../../../components/cards/StatsCard';
import Toolbar from '../../../components/Toolbar';
import Table from '../../../components/ui/Table';
import StatusBadge from '../../../components/ui/StatusBadge';


export default function Tenants() {
  const [tenants, setTenants] = useState([
    { id: 1, name: 'Foodie Group LLC', email: 'admin@foodiegroup.com', plan: 'Enterprise', status: 'Active', restaurants: 12 },
    { id: 2, name: 'Bistro Holdings', email: 'contact@bistroholdings.com', plan: 'Pro', status: 'Active', restaurants: 5 },
    { id: 3, name: 'Quick Eats Inc', email: 'support@quickeats.com', plan: 'Starter', status: 'Suspended', restaurants: 2 },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch = 
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || tenant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = (id) => {
    setTenants(prev => prev.map(t => 
      t.id === id ? { ...t, status: t.status === 'Active' ? 'Suspended' : 'Active' } : t
    ));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this tenant?')) {
      setTenants(prev => prev.filter(t => t.id !== id));
    }
  };

  const columns = [
    { label: 'Organization' },
    { label: 'Plan' },
    { label: 'Restaurants' },
    { label: 'Status' },
    { label: 'Actions', align: 'right' }
  ];

  const renderTenantRow = (tenant) => (
    <tr key={tenant.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors duration-200">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 transition-colors duration-200">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-slate-100 transition-colors duration-200">{tenant.name}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400 transition-colors duration-200">{tenant.email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-900 transition-colors duration-200">
          {tenant.plan}
        </span>
      </td>
      <td className="px-6 py-4 text-gray-600 dark:text-slate-300 font-medium transition-colors duration-200">
        {tenant.restaurants}
      </td>
      <td className="px-6 py-4">
        <StatusBadge
          status={tenant.status} 
          activeLabel="Active"
          inactiveLabel="Suspended"
        />
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <Link
            to={`/super-admin/restaurants/${tenant.id}`}
            title="View Restaurants"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-medium text-gray-700 dark:text-slate-200 transition-colors duration-200"
          >
            <span>View</span>
          </Link>
          <button
            onClick={() => handleToggleStatus(tenant.id)}
            title={tenant.status === 'Active' ? 'Suspend Tenant' : 'Activate Tenant'}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              tenant.status === 'Active' 
                ? 'text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950' 
                : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950'
            }`}
          >
            <Power className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(tenant.id)}
            title="Delete Tenant"
            className="p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950 rounded-lg transition-colors duration-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-2 sm:p-4 space-y-6 bg-gray-50 dark:bg-slate-950 min-h-screen text-gray-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">Tenants</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 transition-colors duration-200">Manage organizations using your platform.</p>
      </div>

      {/* SUMMARY METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Total Organizations" value={tenants.length} />
        <StatsCard
          label="Active Tenants" 
          value={tenants.filter(t => t.status === 'Active').length} 
          valueColor="text-emerald-600 dark:text-emerald-400"
        />
        <StatsCard 
          label="Total Restaurants" 
          value={tenants.reduce((sum, t) => sum + t.restaurants, 0)} 
        />
        <StatsCard 
          label="Enterprise Accounts" 
          value={tenants.filter(t => t.plan === 'Enterprise').length} 
          valueColor="text-purple-600 dark:text-purple-400"
        />
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-200">
        
        <Toolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search tenants or emails..."
          filters={['All', 'Active', 'Suspended']}
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />

        <Table
          columns={columns}
          data={filteredTenants}
          renderRow={renderTenantRow}
          emptyMessage="No tenants match your search/filters."
        />

      </div>

    </div>
  );
}