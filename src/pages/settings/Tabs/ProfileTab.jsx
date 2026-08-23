import React from 'react';
import { User, Mail, Badge, Loader2 } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

function formatRole(role) {
  if (!role) return 'User';
  return role
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ProfileTab() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm flex items-center justify-center h-64 transition-colors duration-200">
        <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-colors duration-200">
      
      {/* SECTION HEADER */}
      <div className="px-6 sm:px-7 pt-6 pb-5 border-b border-gray-100 dark:border-slate-800 transition-colors duration-200">
        <span className="inline-block text-[11px] font-semibold tracking-wider uppercase text-orange-500 mb-1">
          Account
        </span>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-200">
          Profile Information
        </h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 leading-relaxed transition-colors duration-200">
          View your account contact details.
        </p>
      </div>

      <div className="px-6 sm:px-7 py-6 space-y-6">
        
        {/* PROFILE DISPLAY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 transition-colors duration-200">
              Full Name
            </label>
            <div className="flex items-center gap-3 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl transition-colors duration-200">
              <User className="w-4 h-4 text-gray-400 dark:text-slate-500 transition-colors duration-200" />
              <span className="text-sm text-gray-900 dark:text-slate-100 transition-colors duration-200">
                {user?.name || '—'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 transition-colors duration-200">
              Email Address
            </label>
            <div className="flex items-center gap-3 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl transition-colors duration-200">
              <Mail className="w-4 h-4 text-gray-400 dark:text-slate-500 transition-colors duration-200" />
              <span className="text-sm text-gray-900 dark:text-slate-100 transition-colors duration-200">
                {user?.email || '—'}
              </span>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 transition-colors duration-200">
              Role Title
            </label>
            <div className="flex items-center gap-3 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl transition-colors duration-200">
              <Badge className="w-4 h-4 text-gray-400 dark:text-slate-500 transition-colors duration-200" />
              <span className="text-sm text-gray-900 dark:text-slate-100 transition-colors duration-200">
                {formatRole(user?.role)}
              </span>
            </div>
          </div>
        </div>

        {/* VIEW ONLY FOOTER */}
        <div className="pt-4 flex items-center justify-end border-t border-gray-100 dark:border-slate-800 -mx-6 sm:-mx-7 px-6 sm:px-7 mt-2 transition-colors duration-200">
          <span className="text-xs font-medium text-gray-400 dark:text-slate-500 transition-colors duration-200">
            View only mode
          </span>
        </div>

      </div>
    </div>
  );
}