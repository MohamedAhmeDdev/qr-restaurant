import React from 'react';

export default function SettingsSidebar({ tabs, activeTab, setActiveTab }) {
  return (
    <aside className="space-y-6">
      <div>
        <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">
          Account Settings
        </h3>
        <nav className="space-y-0.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-md text-left transition-colors duration-150 ${
                  isActive
                    ? 'bg-gray-100 dark:bg-slate-800/80 text-gray-900 dark:text-white font-semibold border-l-2 border-orange-500 rounded-l-none'
                    : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-900 hover:text-gray-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-orange-500' : 'text-gray-400 dark:text-slate-500'}`} />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}