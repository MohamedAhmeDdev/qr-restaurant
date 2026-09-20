import React from 'react';

export default function OrganizationSidebar({ tabs, activeTab, setActiveTab }) {
  const categories = Array.from(new Set(tabs.map((t) => t.category || 'General')));

  return (
    <aside className="space-y-6">
      {categories.map((category) => {
        const categoryTabs = tabs.filter((t) => (t.category || 'General') === category);
        const isDangerCategory = category === 'Danger Zone';

        return (
          <div key={category}>
            <h3
              className={`px-3 text-xs font-semibold uppercase tracking-wider mb-2 ${
                isDangerCategory ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-slate-400'
              }`}
            >
              {category}
            </h3>
            <nav className="space-y-0.5">
              {categoryTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                let buttonStyles = '';
                let iconStyles = '';

                // Remove the special styling for danger tabs
                buttonStyles = isActive
                  ? 'bg-gray-100 dark:bg-slate-800/80 text-gray-900 dark:text-white font-semibold border-l-2 border-orange-500 rounded-l-none'
                  : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-900 hover:text-gray-900 dark:hover:text-slate-200';
                iconStyles = isActive ? 'text-orange-500' : 'text-gray-400 dark:text-slate-500';

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-md text-left transition-colors duration-150 ${buttonStyles}`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${iconStyles}`} />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        );
      })}
    </aside>
  );
}