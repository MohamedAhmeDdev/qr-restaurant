import React, { useState } from 'react';
import { Save, ArrowLeft, Check } from 'lucide-react';

export default function CreateRole() { // Use same for EditRole, just pre-fill data
  const [permissions, setPermissions] = useState({
    dashboard: true,
    menu_manage: false,
    orders_view: true,
    users_manage: false,
  });

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 bg-gray-50 dark:bg-slate-950 min-h-screen">
      <div className="flex items-center gap-4">
        <button onClick={() => window.history.back()} className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-800 text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Role</h1>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Role Name</label>
          <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:ring-2 focus:ring-orange-500 outline-none dark:text-white" placeholder="e.g. Shift Manager" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Description</label>
          <textarea className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:ring-2 focus:ring-orange-500 outline-none dark:text-white h-24" placeholder="What can this role do?" />
        </div>

        <div className="border-t border-gray-200 dark:border-slate-800 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Permissions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(permissions).map((key) => (
              <label key={key} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-slate-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                <input 
                  type="checkbox" 
                  checked={permissions[key]} 
                  onChange={(e) => setPermissions({...permissions, [key]: e.target.checked})}
                  className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300 capitalize">{key.replace('_', ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors shadow-sm">
            <Save className="w-4 h-4" /> Save Role
          </button>
        </div>
      </div>
    </div>
  );
}