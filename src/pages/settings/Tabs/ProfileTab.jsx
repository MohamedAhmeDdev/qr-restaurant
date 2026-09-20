import React from 'react';
import { Loader2, User, Mail, ShieldCheck, BadgeCheck } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

function formatRole(role) {
  if (!role) return 'User';
  return role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ProfileTab() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between border-b border-gray-200 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
            <div className="p-2 bg-orange-500/10 dark:bg-orange-500/20 rounded-lg text-orange-500">
              <User className="w-5 h-5" />
            </div>
            Profile Information
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            View your personal account details and role information.
          </p>
        </div>
      </div>

      {/* Profile Details Card */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-xs space-y-6">
        <div className="grid grid-cols-1 gap-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-slate-400 mb-2">
              Full Name
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-gray-400 dark:text-slate-500 pointer-events-none">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                readOnly
                value={user?.name || ''}
                className="w-full pl-10 pr-3.5 py-2 bg-gray-100/70 dark:bg-slate-950/60 text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-slate-800/80 rounded-lg text-sm outline-none cursor-not-allowed"
              />
            </div>
          </div>

          {/* Public Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-slate-400 mb-2">
              Public Email
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-gray-400 dark:text-slate-500 pointer-events-none">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                readOnly
                value={user?.email || ''}
                className="w-full pl-10 pr-3.5 py-2 bg-gray-100/70 dark:bg-slate-950/60 text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-slate-800/80 rounded-lg text-sm outline-none cursor-not-allowed"
              />
            </div>
          </div>

          {/* Role Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-slate-400 mb-2">
              Role Title
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-gray-400 dark:text-slate-500 pointer-events-none">
                <BadgeCheck className="w-4 h-4" />
              </div>
              <input
                type="text"
                readOnly
                value={formatRole(user?.role)}
                className="w-full pl-10 pr-3.5 py-2 bg-gray-100/70 dark:bg-slate-950/60 text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-slate-800/80 rounded-lg text-sm outline-none cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}