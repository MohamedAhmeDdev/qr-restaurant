// PermissionsPage.jsx
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  KeyRound, Plus, Shield, Building2, Store, Users, 
  BarChart3, Settings, Trash2, Edit,
  PlusCircle
} from 'lucide-react';
import StatsCard from '../../../components/cards/StatsCard';
import Toolbar from '../../../components/Toolbar';

export default function PermissionsPage() {
  // Master Permissions List State
  const [permissions, setPermissions] = useState([
    { id: 'tenants.create', label: 'Create Tenants', description: 'Provision new multi-tenant organization accounts', category: 'Tenants', isSystem: true, assignedRoles: ['Super Admin'] },
    { id: 'tenants.view', label: 'View Tenants', description: 'Access organization directory and metadata', category: 'Tenants', isSystem: true, assignedRoles: ['Super Admin', 'Organization Admin', 'Auditor'] },
    { id: 'tenants.edit', label: 'Update Tenant Info', description: 'Modify tenant plans, contact details, and limits', category: 'Tenants', isSystem: true, assignedRoles: ['Super Admin', 'Organization Admin'] },
    { id: 'tenants.delete', label: 'Delete Tenants', description: 'Deactivate or permanently remove tenant accounts', category: 'Tenants', isSystem: true, assignedRoles: ['Super Admin'] },

    { id: 'restaurants.create', label: 'Add Restaurants', description: 'Register new restaurant locations under a tenant', category: 'Restaurants', isSystem: true, assignedRoles: ['Super Admin', 'Organization Admin'] },
    { id: 'restaurants.view', label: 'View Restaurants', description: 'Browse active restaurant listings and store profiles', category: 'Restaurants', isSystem: true, assignedRoles: ['Super Admin', 'Organization Admin', 'Store Manager', 'Auditor'] },
    { id: 'restaurants.edit', label: 'Manage Restaurant Details', description: 'Update store hours, menus, and operating details', category: 'Restaurants', isSystem: true, assignedRoles: ['Super Admin', 'Organization Admin', 'Store Manager'] },
    { id: 'restaurants.delete', label: 'Remove Restaurant', description: 'Delete store locations from the platform', category: 'Restaurants', isSystem: true, assignedRoles: ['Super Admin', 'Organization Admin'] },

    { id: 'users.manage', label: 'Manage Admins & Staff', description: 'Invite users, assign roles, and revoke access', category: 'User Management', isSystem: true, assignedRoles: ['Super Admin', 'Organization Admin'] },
    { id: 'users.view', label: 'View User Directory', description: 'Read-only access to user lists and staff profiles', category: 'User Management', isSystem: true, assignedRoles: ['Super Admin', 'Organization Admin', 'Auditor'] },

    { id: 'analytics.view', label: 'View Metrics', description: 'Access operational dashboards and performance charts', category: 'Analytics', isSystem: true, assignedRoles: ['Super Admin', 'Organization Admin', 'Auditor'] },
    { id: 'analytics.export', label: 'Export Reports', description: 'Download revenue, order logs, and audit data', category: 'Analytics', isSystem: true, assignedRoles: ['Super Admin'] },

    { id: 'settings.custom_integrations', label: 'Webhook Integrations', description: 'Configure custom third-party POS webhooks', category: 'Integrations', isSystem: false, assignedRoles: ['Super Admin'] },
  ]);

  // UI Control States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Category Icon Mapping
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Tenants': return <Building2 className="w-4 h-4 text-blue-500" />;
      case 'Restaurants': return <Store className="w-4 h-4 text-orange-500" />;
      case 'User Management': return <Users className="w-4 h-4 text-purple-500" />;
      case 'Analytics': return <BarChart3 className="w-4 h-4 text-emerald-500" />;
      default: return <Settings className="w-4 h-4 text-slate-500" />;
    }
  };

  // Delete Handler
  const handleDeletePermission = (permId) => {
    const target = permissions.find(p => p.id === permId);
    if (target?.isSystem) {
      alert('System-critical permissions cannot be deleted.');
      return;
    }
    if (window.confirm(`Are you sure you want to remove permission "${target?.label}"?`)) {
      setPermissions(prev => prev.filter(p => p.id !== permId));
    }
  };

  // Filter Computation
  const filteredPermissions = useMemo(() => {
    return permissions.filter(perm => {
      const matchesSearch = 
        perm.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        perm.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        perm.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || perm.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [permissions, searchQuery, categoryFilter]);

  // Group by Category
  const groupedPermissions = useMemo(() => {
    return filteredPermissions.reduce((acc, perm) => {
      if (!acc[perm.category]) acc[perm.category] = [];
      acc[perm.category].push(perm);
      return acc;
    }, {});
  }, [filteredPermissions]);

  // Render permission rows grouped by category
  const renderPermissionGroup = (category, perms) => (
    <div key={category} className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-200">
      
      {/* Category Header */}
      <div className="px-6 py-3.5 bg-gray-200 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between transition-colors duration-200">
        <div className="flex items-center gap-2 font-bold text-sm text-gray-800 dark:text-slate-200">
          {getCategoryIcon(category)}
          <span>{category} Scope Capabilities</span>
        </div>
        <span className="text-xs text-gray-500 dark:text-slate-400 font-medium transition-colors duration-200">{perms.length} Permissions</span>
      </div>

      {/* Table List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-gray-500 dark:text-slate-400 font-medium text-xs bg-gray-100 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-800 transition-colors duration-200">
            <tr>
              <th className="px-6 py-3">Permission</th>
              <th className="px-6 py-3">Key Identifier</th>
              <th className="px-6 py-3">Assigned Roles</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800 transition-colors duration-200">
            {perms.map((perm) => (
              <tr key={perm.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors duration-200">
                
                {/* Name & Desc */}
                <td className="px-6 py-4">
                  <p className="font-semibold text-gray-900 dark:text-white transition-colors duration-200">{perm.label}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 transition-colors duration-200">{perm.description}</p>
                </td>

                {/* ID Key */}
                <td className="px-6 py-4">
                  <code className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 font-mono border border-gray-200 dark:border-slate-700 transition-colors duration-200">
                    {perm.id}
                  </code>
                </td>

                {/* Assigned Roles Tags */}
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {perm.assignedRoles.map((role, idx) => (
                      <span key={idx} className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium transition-colors duration-200">
                        {role}
                      </span>
                    ))}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      to={`/super-admin/permissions/edit/${perm.id}`}
                      title="Edit permission"
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      disabled={perm.isSystem}
                      onClick={() => handleDeletePermission(perm.id)}
                      title={perm.isSystem ? 'System permissions cannot be deleted' : 'Delete permission'}
                      className={`p-1.5 rounded-lg transition-colors duration-200 ${
                        perm.isSystem 
                          ? 'opacity-30 cursor-not-allowed text-gray-400 dark:text-slate-600' 
                          : 'hover:bg-red-100 text-red-600 dark:hover:bg-red-900/40 dark:text-red-400'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );

  return (
    <div className="p-2 sm:p-4 space-y-6 bg-gray-50 dark:bg-slate-950 min-h-screen text-gray-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">Permissions Directory</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 transition-colors duration-200">
            View and define system capabilities and security scopes across the application.
          </p>
        </div>

        {/* ROUTE LINK TO CREATE PERMISSION PAGE */}
        <Link 
          to="/super-admin/permissions/create"
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm"
        >
          <PlusCircle className="w-4 h-4" /> Create Permission
        </Link>
      </div>

      {/* METRICS CARDS - Using StatsCard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard 
          label="Total Scopes" 
          value={permissions.length}
        />
        <StatsCard 
          label="System Permissions" 
          value={permissions.filter(p => p.isSystem).length}
          valueColor="text-purple-600 dark:text-purple-400"
        />
        <StatsCard 
          label="Custom Extensions" 
          value={permissions.filter(p => !p.isSystem).length}
          valueColor="text-emerald-600 dark:text-emerald-400"
        />
      </div>

      {/* FILTER & TOOLBAR - Using Toolbar */}
      <Toolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search key, label, or description..."
        filters={['All', 'Tenants', 'Restaurants', 'User Management', 'Analytics', 'Integrations']}
        activeFilter={categoryFilter}
        onFilterChange={setCategoryFilter}
      />

      {/* PERMISSIONS CATEGORIZED LIST */}
      {Object.keys(groupedPermissions).length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400 text-sm transition-colors duration-200">
          No permissions match your search filter.
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedPermissions).map(([category, perms]) => 
            renderPermissionGroup(category, perms)
          )}
        </div>
      )}

    </div>
  );
}