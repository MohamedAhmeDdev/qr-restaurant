import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function SettingsSidebar({ tabs, activeTab, setActiveTab }) {
  return (
    <aside className="lg:col-span-1">
      <nav className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-2 shadow-sm space-y-0.5 lg:sticky lg:top-6 transition-colors duration-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full group flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 ${
                isActive
                  ? 'bg-orange-50 dark:bg-orange-950 shadow-sm ring-1 ring-orange-200 dark:ring-orange-900'
                  : 'hover:bg-gray-50 dark:hover:bg-slate-800'
              }`}
            >
              <span
                className={`flex items-center justify-center w-9 h-9 rounded-lg shrink-0 transition-colors duration-200 ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-500 group-hover:text-gray-600 dark:group-hover:text-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
              </span>
              <span className="flex-1 min-w-0">
                <span
                  className={`block text-sm font-semibold truncate transition-colors duration-200 ${
                    isActive ? 'text-orange-700 dark:text-orange-400' : 'text-gray-700 dark:text-slate-200'
                  }`}
                >
                  {tab.label}
                </span>
                <span className="block text-[11px] text-gray-400 dark:text-slate-500 truncate transition-colors duration-200">
                  {tab.blurb}
                </span>
              </span>
              <ChevronRight
                className={`w-4 h-4 shrink-0 transition-all duration-200 ${
                  isActive ? 'text-orange-400 opacity-100' : 'text-gray-300 dark:text-slate-600 opacity-0 group-hover:opacity-100'
                }`}
              />
            </button>
          );
        })}
      </nav>
    </aside>
  );
}