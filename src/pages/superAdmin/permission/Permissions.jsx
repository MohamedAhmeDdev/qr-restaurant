import React from 'react';
import { Key, Plus, Search, Tag } from 'lucide-react';

export default function PermissionsPage() {
  const permissions = [
    { id: 1, name: 'view_dashboard', group: 'General', description: 'Can view the main dashboard' },
    { id: 2, name: 'manage_menu', group: 'Restaurant', description: 'Can add/edit menu items' },
    { id: 3, name: 'view_orders', group: 'Orders', description: 'Can view live orders' },
    { id: 4, name: 'manage_users', group: 'Admin', description: 'Can create/delete users' },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-slate-950 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Permissions</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600">
          <Plus className="w-4 h-4" /> New Permission
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-slate-800">
           <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Filter permissions..." className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm dark:text-white" />
          </div>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-slate-400 font-medium">
            <tr>
              <th className="px-6 py-4">Permission Name</th>
              <th className="px-6 py-4">Group</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
            {permissions.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                <td className="px-6 py-4 font-mono text-xs text-orange-600 bg-orange-50/50 dark:bg-orange-900/10 inline-block mt-2 ml-4 px-2 py-1 rounded">{p.name}</td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1 text-gray-600 dark:text-slate-300"><Tag className="w-3 h-3" /> {p.group}</span>
                </td>
                <td className="px-6 py-4 text-gray-500">{p.description}</td>
                <td className="px-6 py-4 text-right">
                   <button className="text-blue-600 hover:underline text-xs font-medium">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}