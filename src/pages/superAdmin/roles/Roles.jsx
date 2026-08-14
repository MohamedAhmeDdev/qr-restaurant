import React from 'react';
import { Shield, Plus, Edit, Trash2, Users } from 'lucide-react';

export default function RolesPage() {
  const roles = [
    { id: 1, name: 'Super Admin', users: 2, description: 'Full system access' },
    { id: 2, name: 'Tenant Manager', users: 12, description: 'Manages specific tenant organization' },
    { id: 3, name: 'Restaurant Owner', users: 45, description: 'Manages single restaurant location' },
    { id: 4, name: 'Staff', users: 120, description: 'Basic operational access' },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-slate-950 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Roles</h1>
        <button onClick={() => window.location.href='/super-admin/roles/create'} className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600">
          <Plus className="w-4 h-4" /> Create Role
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map(role => (
          <div key={role.id} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col h-full">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600">
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex gap-2">
                <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded text-gray-500"><Edit className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">{role.name}</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-4 flex-grow">{role.description}</p>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-50 dark:bg-slate-800 px-3 py-2 rounded-lg w-fit">
              <Users className="w-3.5 h-3.5" /> {role.users} Users
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}