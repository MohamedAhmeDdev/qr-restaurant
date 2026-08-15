// RolesPage.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, Plus, Power, Trash2, Edit,
  PlusCircle
} from 'lucide-react';
import StatsCard from '../../../components/cards/StatsCard';
import Toolbar from '../../../components/Toolbar';
import StatusBadge from '../../../components/ui/StatusBadge';

// Master List of Available Platform Permissions
export const MASTER_PERMISSIONS = [
  { id: 'tenants.manage', label: 'Manage Tenants', description: 'Create, update, and suspend tenant accounts', category: 'Tenants' },
  { id: 'tenants.view', label: 'View Tenants', description: 'Read-only access to tenant metrics and list', category: 'Tenants' },
  { id: 'restaurants.manage', label: 'Manage Restaurants', description: 'Add, edit, or remove restaurant locations', category: 'Restaurants' },
  { id: 'restaurants.view', label: 'View Restaurants', description: 'Browse active restaurant listings', category: 'Restaurants' },
  { id: 'users.manage', label: 'Manage Admins & Users', description: 'Invite users and assign role permissions', category: 'User Management' },
  { id: 'users.view', label: 'View User Directory', description: 'View staff lists and role assignments', category: 'User Management' },
  { id: 'analytics.export', label: 'Export Analytics', description: 'Download platform metrics and revenue reports', category: 'Analytics' },
  { id: 'settings.system', label: 'System Configuration', description: 'Modify global environment and feature flags', category: 'Settings' },
];

export default function RolesPage() {
  const navigate = useNavigate();

  // Roles State
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'Super Admin',
      description: 'Full administrative access across all system features and tenant settings.',
      type: 'System Default',
      usersCount: 3,
      status: 'Active',
      permissions: MASTER_PERMISSIONS.map(p => p.id)
    },
    {
      id: 2,
      name: 'Organization Admin',
      description: 'Manages specific tenant accounts, users, and assigned locations.',
      type: 'System Default',
      usersCount: 8,
      status: 'Active',
      permissions: ['tenants.view', 'restaurants.manage', 'restaurants.view', 'users.view']
    },
    {
      id: 3,
      name: 'Store Manager',
      description: 'Operational control limited to specific assigned store locations.',
      type: 'Custom',
      usersCount: 24,
      status: 'Active',
      permissions: ['restaurants.manage', 'restaurants.view']
    },
    {
      id: 4,
      name: 'Auditor / Viewer',
      description: 'Read-only access across platform metric dashboards and logs.',
      type: 'Custom',
      usersCount: 2,
      status: 'Inactive',
      permissions: ['tenants.view', 'restaurants.view', 'users.view']
    }
  ]);

  // UI Control States
  const [typeFilter, setTypeFilter] = useState('All');

  // Navigation Handlers
  const handleOpenPermissionsPage = (roleId) => {
    navigate(`/super-admin/assign-permissions/${roleId}`);
  };

  const handleCreateRolePage = () => {
    navigate('/super-admin/roles/create');
  };

  const handleEditRolePage = (roleId) => {
    navigate(`/super-admin/roles/edit/${roleId}`);
  };

  // Action Handlers
  const handleToggleStatus = (id) => {
    setRoles(prev => prev.map(role => {
      if (role.id === id) {
        if (role.type === 'System Default') {
          alert('System default roles cannot be deactivated.');
          return role;
        }
        return { ...role, status: role.status === 'Active' ? 'Inactive' : 'Active' };
      }
      return role;
    }));
  };

  const handleDeleteRole = (id) => {
    const roleToDelete = roles.find(r => r.id === id);
    if (roleToDelete?.type === 'System Default') {
      alert('System Default roles cannot be deleted.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete the "${roleToDelete?.name}" role?`)) {
      setRoles(prev => prev.filter(r => r.id !== id));
    }
  };

  // Filter Computation
  const filteredRoles = useMemo(() => {
    return roles.filter(role => {
      const matchesType = typeFilter === 'All' || role.type === typeFilter;
      return matchesType;
    });
  }, [roles, typeFilter]);

  return (
    <div className="p-2 sm:p-4 space-y-6 bg-gray-50 dark:bg-slate-950 min-h-screen text-gray-900 dark:text-slate-100 transition-colors duration-200">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">Roles</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 transition-colors duration-200">
            Manage user access roles and inspect granted permission sets.
          </p>
        </div>

        <button 
          onClick={handleCreateRolePage}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm"
        >
          <PlusCircle className="w-4 h-4" /> Create Role
        </button>
      </div>

      {/* METRICS - Using StatsCard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard 
          label="Total Roles" 
          value={roles.length}
        />
        <StatsCard 
          label="System Default" 
          value={roles.filter(r => r.type === 'System Default').length}
          valueColor="text-blue-600 dark:text-blue-400"
        />
        <StatsCard 
          label="Custom Roles" 
          value={roles.filter(r => r.type === 'Custom').length}
          valueColor="text-purple-600 dark:text-purple-400"
        />
      </div>

      {/* TOOLBAR - Using Toolbar with search hidden */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-200">
        <Toolbar
          showSearch={false}
          filters={['All', 'System Default', 'Custom']}
          activeFilter={typeFilter}
          onFilterChange={setTypeFilter}
        />
      </div>

      {/* ROLES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRoles.map((role) => (
          <div 
            key={role.id}
            className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors duration-200"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 transition-colors duration-200">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-gray-900 dark:text-white transition-colors duration-200">{role.name}</h3>
                  </div>
                </div>

                <StatusBadge
                  status={role.status} 
                  size="xs"
                />
              </div>

              <p className="text-xs text-gray-500 dark:text-slate-400 mb-4 transition-colors duration-200">{role.description}</p>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between transition-colors duration-200">
              {/* MANAGE PERMISSIONS - Now on the left */}
              <button
                onClick={() => handleOpenPermissionsPage(role.id)}
                className="px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 dark:bg-orange-950 dark:hover:bg-orange-900 text-orange-600 dark:text-orange-400 text-xs font-semibold transition-colors duration-200"
              >
                Manage Permissions
              </button>

              {/* Action buttons on the right */}
              <div className="flex items-center gap-2">
                {/* EDIT ROLE DETAILS */}
                <button
                  onClick={() => handleEditRolePage(role.id)}
                  title="Edit Role Details"
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-400 transition-colors duration-200"
                >
                  <Edit className="w-4 h-4" />
                </button>

                {/* TOGGLE STATUS */}
                <button
                  onClick={() => handleToggleStatus(role.id)}
                  disabled={role.type === 'System Default'}
                  title={role.type === 'System Default' ? 'System default roles cannot be deactivated' : 'Toggle Status'}
                  className={`p-1.5 rounded-lg transition-colors duration-200 ${
                    role.type === 'System Default'
                      ? 'opacity-30 cursor-not-allowed text-gray-400'
                      : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-400'
                  }`}
                >
                  <Power className="w-4 h-4" />
                </button>

                {/* DELETE ROLE */}
                <button
                  onClick={() => handleDeleteRole(role.id)}
                  disabled={role.type === 'System Default'}
                  title={role.type === 'System Default' ? 'System default roles cannot be deleted' : 'Delete Role'}
                  className={`p-1.5 rounded-lg transition-colors duration-200 ${
                    role.type === 'System Default'
                      ? 'opacity-30 cursor-not-allowed text-gray-400'
                      : 'hover:bg-rose-100 dark:hover:bg-rose-950 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}