import React, { useState, useMemo } from 'react';
import { 
  Shield, Check, AlertCircle, Save, CheckSquare, 
  Building2, Store, Users, BarChart3, Settings
} from 'lucide-react';

// Master List of Available Platform Permissions
const ALL_PERMISSIONS = [
  // Tenant Category
  { id: 'tenants.create', label: 'Create Tenants', description: 'Provision new multi-tenant organization accounts', category: 'Tenants' },
  { id: 'tenants.view', label: 'View Tenants', description: 'Access organization directory and tenant metadata', category: 'Tenants' },
  { id: 'tenants.edit', label: 'Update Tenant Info', description: 'Modify tenant plans, contact details, and limits', category: 'Tenants' },
  { id: 'tenants.delete', label: 'Delete / Suspend Tenants', description: 'Deactivate or permanently remove tenant accounts', category: 'Tenants' },

  // Restaurant Category
  { id: 'restaurants.create', label: 'Add Restaurants', description: 'Register new restaurant locations under a tenant', category: 'Restaurants' },
  { id: 'restaurants.view', label: 'View Restaurants', description: 'Browse active restaurant lists and store profiles', category: 'Restaurants' },
  { id: 'restaurants.edit', label: 'Manage Restaurant Details', description: 'Update store hours, menus, and operating details', category: 'Restaurants' },
  { id: 'restaurants.delete', label: 'Remove Restaurant', description: 'Delete store locations from the platform', category: 'Restaurants' },

  // User & Admin Category
  { id: 'users.manage', label: 'Manage Admins & Staff', description: 'Invite users, assign roles, and revoke access', category: 'User Management' },
  { id: 'users.view', label: 'View User Directory', description: 'Read-only access to user lists and staff profiles', category: 'User Management' },

  // Analytics & Reports Category
  { id: 'analytics.view', label: 'View Dashboard Metrics', description: 'Access operational dashboards and performance charts', category: 'Analytics' },
  { id: 'analytics.export', label: 'Export Reports', description: 'Download revenue, order logs, and audit data', category: 'Analytics' },

  // Settings Category
  { id: 'settings.system', label: 'System Configuration', description: 'Modify global application settings and feature flags', category: 'Settings' },
];

export default function AssignPermissions({ 
  roleName = "Organization Admin", 
  roleType = "Custom Role", 
  initialPermissions = ['tenants.view', 'restaurants.create', 'restaurants.view', 'restaurants.edit', 'users.view', 'analytics.view'],
  onSave,
  onCancel
}) {
  // State for permissions
  const [assignedPermissions, setAssignedPermissions] = useState(initialPermissions);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Check if permissions have been modified from initial state
  const isDirty = useMemo(() => {
    if (assignedPermissions.length !== initialPermissions.length) return true;
    return !initialPermissions.every(p => assignedPermissions.includes(p));
  }, [assignedPermissions, initialPermissions]);

  // Toggle individual permission
  const handleTogglePermission = (permId) => {
    setAssignedPermissions(prev => 
      prev.includes(permId) ? prev.filter(id => id !== permId) : [...prev, permId]
    );
  };

  // Select/Deselect All permissions in current view
  const handleSelectAllInView = () => {
    const currentViewIds = filteredPermissions.map(p => p.id);
    const allSelected = currentViewIds.every(id => assignedPermissions.includes(id));

    if (allSelected) {
      // Remove all currently visible permissions
      setAssignedPermissions(prev => prev.filter(id => !currentViewIds.includes(id)));
    } else {
      // Add all currently visible permissions
      setAssignedPermissions(prev => Array.from(new Set([...prev, ...currentViewIds])));
    }
  };

  // Save changes handler
  const handleSave = () => {
    if (onSave) {
      onSave(assignedPermissions);
    } else {
      alert(`Saved ${assignedPermissions.length} permissions for ${roleName}`);
    }
  };

  // Filter computation by category
  const filteredPermissions = useMemo(() => {
    return ALL_PERMISSIONS.filter(perm => {
      return selectedCategory === 'All' || perm.category === selectedCategory;
    });
  }, [selectedCategory]);

  // Group filtered permissions by category
  const groupedPermissions = useMemo(() => {
    return filteredPermissions.reduce((acc, perm) => {
      if (!acc[perm.category]) acc[perm.category] = [];
      acc[perm.category].push(perm);
      return acc;
    }, {});
  }, [filteredPermissions]);

  // Icon mapping for categories
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Tenants': return <Building2 className="w-4 h-4" />;
      case 'Restaurants': return <Store className="w-4 h-4" />;
      case 'User Management': return <Users className="w-4 h-4" />;
      case 'Analytics': return <BarChart3 className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-slate-950 min-h-screen text-gray-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* HEADER SECTION */}
      <div className="border-b border-gray-200 dark:border-slate-800 pb-5 transition-colors duration-200">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">Assign Permissions</h1>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 transition-colors duration-200">
            {roleType}
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 transition-colors duration-200">
          Configuring permission capabilities for <strong className="text-gray-900 dark:text-white transition-colors duration-200">{roleName}</strong>
        </p>
      </div>

      {/* SUMMARY BANNER */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm transition-colors duration-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 transition-colors duration-200">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-900 dark:text-white transition-colors duration-200">
              {assignedPermissions.length} of {ALL_PERMISSIONS.length} Permissions Active
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400 transition-colors duration-200">
              Users assigned to this role will inherit all granted capabilities immediately.
            </p>
          </div>
        </div>

        {isDirty && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-950 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-900 transition-colors duration-200">
            <AlertCircle className="w-4 h-4 shrink-0" /> Unsaved changes pending
          </div>
        )}
      </div>

      {/* CATEGORY FILTER TOOLBAR */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm transition-colors duration-200">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-medium overflow-x-auto w-full sm:w-auto transition-colors duration-200">
          {['All', 'Tenants', 'Restaurants', 'User Management', 'Analytics', 'Settings'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-md transition-all duration-200 whitespace-nowrap ${
                selectedCategory === cat 
                  ? 'bg-white dark:bg-slate-900 text-gray-900 dark:text-white shadow-sm font-semibold' 
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Bulk Select All Button */}
        <button
          type="button"
          onClick={handleSelectAllInView}
          className="flex items-center gap-1.5 text-xs font-medium text-orange-600 dark:text-orange-400 hover:underline shrink-0 transition-colors duration-200"
        >
          <CheckSquare className="w-3.5 h-3.5" /> Toggle All Visible
        </button>
      </div>

      {/* PERMISSIONS GRID BY CATEGORY */}
      {Object.keys(groupedPermissions).length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400 text-sm transition-colors duration-200">
          No permissions match your filter.
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedPermissions).map(([category, perms]) => (
            <div key={category} className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-200">
              
              {/* Category Sub-Header */}
              <div className="px-6 py-3.5 bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between transition-colors duration-200">
                <div className="flex items-center gap-2 text-gray-800 dark:text-slate-200 font-bold text-sm transition-colors duration-200">
                  {getCategoryIcon(category)}
                  <span>{category} Permissions</span>
                </div>
                <span className="text-xs font-medium text-gray-500 dark:text-slate-400 transition-colors duration-200">
                  {perms.filter(p => assignedPermissions.includes(p.id)).length} / {perms.length} Enabled
                </span>
              </div>

              {/* Permission Items */}
              <div className="divide-y divide-gray-100 dark:divide-slate-800">
                {perms.map((perm) => {
                  const isChecked = assignedPermissions.includes(perm.id);

                  return (
                    <div 
                      key={perm.id}
                      onClick={() => handleTogglePermission(perm.id)}
                      className={`p-4 px-6 flex items-center justify-between gap-4 cursor-pointer transition-colors duration-200 ${
                        isChecked 
                          ? 'bg-orange-50 dark:bg-slate-800/80' 
                          : 'hover:bg-gray-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border transition-colors duration-200 ${
                          isChecked 
                            ? 'bg-orange-500 border-orange-500 text-white' 
                            : 'border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-900 dark:text-white transition-colors duration-200">{perm.label}</p>
                          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 transition-colors duration-200">{perm.description}</p>
                        </div>
                      </div>

                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors duration-200 ${
                        isChecked 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' 
                          : 'bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {isChecked ? 'Granted' : 'Off'}
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* STATIC BOTTOM ACTION BAR */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-4 shadow-sm transition-colors duration-200">
        <div className="flex items-center justify-end gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-sm ${
              isDirty
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                : 'bg-gray-200 dark:bg-slate-800 text-gray-400 dark:text-slate-600 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>

    </div>
  );
}