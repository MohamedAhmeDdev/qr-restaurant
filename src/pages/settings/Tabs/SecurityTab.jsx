import React, { useState } from 'react';
import { KeyRound, ShieldCheck, Check, Save } from 'lucide-react';

export default function SecurityTab() {
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    twoFactor: true,
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-colors duration-200">
      
      {/* SECTION HEADER */}
      <div className="px-6 sm:px-7 pt-6 pb-5 border-b border-gray-100 dark:border-slate-800 transition-colors duration-200">
        <span className="inline-block text-[11px] font-semibold tracking-wider uppercase text-orange-500 mb-1">
          Account
        </span>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-200">
          Security & Authentication
        </h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 leading-relaxed transition-colors duration-200">
          Update your account password and manage multi-factor authentication.
        </p>
      </div>

      {/* CARD BODY */}
      <div className="px-6 sm:px-7 py-6 space-y-6">
        
        {/* PASSWORD SECTION */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-slate-200 transition-colors duration-200">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-orange-50 dark:bg-orange-950 transition-colors duration-200">
              <KeyRound className="w-3.5 h-3.5 text-orange-500" />
            </span>
            <span>Change Password</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 transition-colors duration-200">
                Current Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={security.currentPassword}
                onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 border border-gray-200 dark:border-slate-700 rounded-xl text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 transition-colors duration-200">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={security.newPassword}
                onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 border border-gray-200 dark:border-slate-700 rounded-xl text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* 2FA TOGGLE SECTION */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-800 transition-colors duration-200">
          <div className="flex items-start gap-3 min-w-0 w-full sm:w-auto">
            <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shrink-0 transition-colors duration-200">
              <ShieldCheck className="w-4 h-4 text-orange-500" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white transition-colors duration-200">
                Two-Factor Authentication
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 leading-relaxed transition-colors duration-200">
                Secure your account using TOTP mobile authenticator codes.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 sm:gap-0">
            <span className="text-xs text-gray-500 dark:text-slate-400 sm:hidden transition-colors duration-200">
              {security.twoFactor ? 'Enabled' : 'Disabled'}
            </span>
            <button
              type="button"
              onClick={() => setSecurity({ ...security, twoFactor: !security.twoFactor })}
              aria-pressed={security.twoFactor}
              className={`w-12 h-6 flex items-center rounded-full p-1 shrink-0 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                security.twoFactor ? 'bg-orange-500 justify-end' : 'bg-gray-300 dark:bg-slate-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* ACTION CONTROLS */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-slate-800 -mx-6 sm:-mx-7 px-6 sm:px-7 mt-2 transition-colors duration-200">
          {isSaved && (
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mr-auto animate-in fade-in duration-200">
              Changes saved
            </span>
          )}
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.97]"
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {isSaved ? 'Saved settings' : 'Save security'}
          </button>
        </div>

      </div>
    </form>
  );
}