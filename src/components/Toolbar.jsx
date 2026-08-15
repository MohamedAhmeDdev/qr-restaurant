// components/Toolbar.jsx
import React from 'react';
import { Search } from 'lucide-react';

export default function Toolbar({ 
  searchQuery = '', 
  onSearchChange = null, 
  searchPlaceholder = "Search...",
  showSearch = true,
  filters = [],
  activeFilter = '',
  onFilterChange = null,
}) {
  return (
    <div className="p-1.5 sm:p-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors duration-200">
      
      {/* Search Box */}
      {showSearch && onSearchChange && (
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500 transition-colors duration-200 pointer-events-none" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-colors duration-200"
          />
        </div>
      )}

      {/* Filter Tabs - Horizontal Scroll on Small Screens */}
      {filters.length > 0 && onFilterChange && (
        <div className="w-full md:w-auto overflow-x-auto scrollbar-none py-0.5">
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-medium min-w-max transition-colors duration-200">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => onFilterChange(filter)}
                className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-all duration-200 ${
                  activeFilter === filter 
                    ? 'bg-white dark:bg-slate-900 text-gray-900 dark:text-white shadow-sm font-semibold' 
                    : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}