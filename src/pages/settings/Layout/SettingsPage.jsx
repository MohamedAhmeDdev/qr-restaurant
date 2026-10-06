import React, { useState } from 'react';
import { User, Lock, Globe, ArrowLeft } from 'lucide-react';
import ProfileTab from '../Tabs/ProfileTab';
import SecurityTab from '../Tabs/SecurityTab';
import PreferencesTab from '../Tabs/PreferencesTab';
import SettingsSidebar from './SettingsSidebar';
import { useAuth } from '../../../contexts/AuthContext';

const TABS = [
  { id: 'profile', label: 'Public profile', icon: User, category: 'Account Settings' },
  { id: 'security', label: 'Password and authentication', icon: Lock, category: 'Account Settings' },
  { id: 'preferences', label: 'Appearance', icon: Globe, category: 'Account Settings' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const { user } = useAuth();

  return (
    <div className="p-1 sm:p-4 space-y-6 bg-gray-50 dark:bg-slate-950 min-h-screen text-gray-900 dark:text-slate-100 transition-colors duration-200">


      <div className="max-w-6xl mx-auto px-3 py-3">
        <button
          onClick={() => window.history.back()}
          className="p-2.5 text-gray-600 dark:text-slate-300 active:scale-[0.98] -ml-2.5 mb-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Go back"
        >
          <span className="flex items-center text-sm gap-1">
            <ArrowLeft className="w-5 h-5" />
            <span>Go back</span>
          </span>
        </button>

        {/* TOP USER HEADER */}
        <div className="flex items-center gap-1.5 pb-6 mb-6 border-b border-gray-200 dark:border-slate-800">
          <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-sm">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className="text-sm md:text-lg capitalize font-semibold leading-tight text-gray-900 dark:text-white">
              {user?.name || 'User Account'}
            </h1>
            <p className="text-xs md:text-base text-gray-500 dark:text-slate-400">
              Your personal account
            </p>
          </div>
        </div>

        {/* MOBILE TABS */}
        <div className="flex lg:hidden border-b border-gray-200 dark:border-slate-800 space-x-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${isActive
                    ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                    : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* MAIN LAYOUT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* SIDEBAR */}
          <div className="hidden lg:block">
            <SettingsSidebar tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* MAIN CONTENT AREA */}
          <main className="lg:col-span-3">
            {activeTab === 'profile' && <ProfileTab />}
            {activeTab === 'security' && <SecurityTab />}
            {activeTab === 'preferences' && <PreferencesTab />}
          </main>
        </div>

      </div>
    </div>
  );
}