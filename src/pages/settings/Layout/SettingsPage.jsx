import React, { useState } from 'react';
import { User, Lock, Globe, ChevronRight } from 'lucide-react';
import ProfileTab from '../Tabs/ProfileTab';
import SecurityTab from '../Tabs/SecurityTab';
import PreferencesTab from '../Tabs/PreferencesTab';
import SettingsSidebar from './SettingsSidebar';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User, blurb: 'Photo & contact info' },
  { id: 'security', label: 'Security & Auth', icon: Lock, blurb: 'Password & 2FA' },
  { id: 'preferences', label: 'Preferences', icon: Globe, blurb: 'Appearance' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const activeMeta = TABS.find((t) => t.id === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-200">
      <div className="p-2 sm:p-4 max-w-7xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-800 pb-5 transition-colors duration-200">
          <div>
            <p className="text-[11px] font-semibold tracking-wider uppercase text-orange-500 mb-1">
              Settings
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white transition-colors duration-200">
              Account Settings
            </h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 transition-colors duration-200">
              Manage your account credentials, security options, and theme preferences.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 dark:text-slate-500 transition-colors duration-200">
            <span>Settings</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-600 dark:text-slate-300 font-medium transition-colors duration-200">{activeMeta?.label}</span>
          </div>
        </div>

        {/* HORIZONTAL TABS (Mobile & Tablet < lg) */}
        <div className="flex lg:hidden border-b border-gray-200 dark:border-slate-800 space-x-2 overflow-x-auto pb-1 scrollbar-none transition-colors duration-200">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors duration-200 whitespace-nowrap rounded-t-lg ${
                  isActive
                    ? 'border-orange-500 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 transition-colors duration-200 ${isActive ? 'text-orange-500' : 'text-gray-400 dark:text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* VERTICAL SIDEBAR (Desktop >= lg) */}
          <div className="hidden lg:block">
            <SettingsSidebar tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* TAB CONTENT PANEL */}
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