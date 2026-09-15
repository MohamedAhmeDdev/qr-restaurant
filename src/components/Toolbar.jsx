import React from 'react';
import { Search, ChevronDown } from 'lucide-react';

export default function Toolbar({ 
  searchQuery = '', 
  onSearchChange = null, 
  searchPlaceholder = "Search...",
  showSearch = true,
  // Pass an array of dropdown objects: [{ id, placeholder, options, value, onChange }]
  dropdowns = [],
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

      {/* Filter Controls */}
      {dropdowns.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {dropdowns.map((dd, index) => (
            <div key={dd.id || index} className="relative flex-1 md:w-40 shrink-0 min-w-[120px]">
              <select
                value={dd.value ?? ''}
                onChange={(e) => dd.onChange && dd.onChange(e.target.value)}
                className="w-full appearance-none px-3 py-2 pr-8 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 border border-gray-200 dark:border-slate-700 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-colors duration-200 cursor-pointer"
              >
                {dd.placeholder && (
                  <option value="" disabled hidden>
                    {dd.placeholder}
                  </option>
                )}
                {dd.options?.map((opt) => {
                  const label = typeof opt === 'object' ? opt.label : opt;
                  const val = typeof opt === 'object' ? opt.value : opt;
                  return (
                    <option 
                      key={val} 
                      value={val}
                      className="bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 py-1"
                    >
                      {label}
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500 pointer-events-none transition-colors duration-200" />
            </div>
          ))}
        </div>
      )}

    </div>
  );
}