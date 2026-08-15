import React, { useState } from 'react';
import { Upload, Check, Save } from 'lucide-react';

export default function ProfileTab() {
  const [profile, setProfile] = useState({
    name: 'Alex Morgan',
    email: 'alex.morgan@company.com',
    role: 'Super Admin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
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
          Profile Information
        </h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 leading-relaxed transition-colors duration-200">
          Update your public profile photo and account contact details.
        </p>
      </div>

      <div className="px-6 sm:px-7 py-6 space-y-6">
        
        {/* AVATAR UPLOAD */}
        <div className="flex items-center gap-5 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-800 transition-colors duration-200">
          <img
            src={profile.avatar}
            alt="Avatar"
            className="w-16 h-16 rounded-full object-cover ring-4 ring-white dark:ring-slate-900 shadow-sm transition-colors duration-200"
          />
          <div className="space-y-1.5">
            <button
              type="button"
              className="flex items-center gap-2 px-3.5 py-1.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-950 rounded-lg text-xs font-semibold text-gray-700 dark:text-slate-200 shadow-sm transition-colors duration-200"
            >
              <Upload className="w-3.5 h-3.5 text-orange-500" /> Upload photo
            </button>
            <p className="text-[11px] text-gray-400 dark:text-slate-500 transition-colors duration-200">
              JPG, GIF or PNG · Max 1MB
            </p>
          </div>
        </div>

        {/* FORM CONTROLS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 transition-colors duration-200">
              Full Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 border border-gray-200 dark:border-slate-700 rounded-xl text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 transition-colors duration-200">
              Email Address
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 border border-gray-200 dark:border-slate-700 rounded-xl text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 transition-colors duration-200">
              Role Title
            </label>
            <div className="relative">
              <input
                type="text"
                disabled
                value={profile.role}
                className="w-full px-3.5 py-2.5 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-800 rounded-xl text-sm text-gray-500 dark:text-slate-500 cursor-not-allowed transition-colors duration-200"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-600 transition-colors duration-200">
                Locked
              </span>
            </div>
          </div>
        </div>

        {/* ACTION FOOTER */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-slate-800 -mx-6 sm:-mx-7 px-6 sm:px-7 mt-2 transition-colors duration-200">
          {isSaved && (
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mr-auto transition-colors duration-200">
              Changes saved
            </span>
          )}
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm rounded-xl transition-colors duration-200 shadow-sm active:scale-[0.97]"
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {isSaved ? 'Saved changes' : 'Save profile'}
          </button>
        </div>

      </div>
    </form>
  );
}