import React from 'react';
import { Check, Sun, Moon, Palette, Monitor } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

export default function PreferencesTab() {
  const { theme, toggleTheme, setTheme } = useTheme();

  const handleSelect = (selectedId) => {
    if (setTheme) {
      setTheme(selectedId);
    } else if (theme !== selectedId) {
      toggleTheme();
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between border-b border-gray-200 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
            <div className="p-2 bg-orange-500/10 dark:bg-orange-500/20 rounded-lg text-orange-500">
              <Palette className="w-5 h-5" />
            </div>
            Appearance Preferences
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Customize the visual appearance of your workspace.
          </p>
        </div>
      </div>

      {/* Theme Selection Card */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-xs space-y-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-slate-400 mb-3">
            Theme Preference
          </label>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Light Theme */}
            <button
              type="button"
              onClick={() => handleSelect('light')}
              className={`p-4 rounded-lg text-left flex items-center justify-between transition-all ${
                theme === 'light'
                  ? 'border-orange-500 bg-orange-500/5 ring-2 ring-orange-500/30'
                  : 'border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 hover:border-gray-300 dark:hover:border-slate-700 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-md ${
                  theme === 'light' 
                    ? 'bg-orange-500/10 text-orange-500' 
                    : 'bg-gray-200/50 dark:bg-slate-800 text-gray-500 dark:text-slate-400'
                }`}>
                  <Sun className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  Light
                </span>
                <span className="text-xs text-gray-500 dark:text-slate-400">
                  Default
                </span>
              </div>
              {theme === 'light' && (
                <div className="p-1 bg-orange-500 rounded-full">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </button>

            {/* Dark Theme */}
            <button
              type="button"
              onClick={() => handleSelect('dark')}
              className={`p-4 rounded-lg text-left flex items-center justify-between transition-all ${
                theme === 'dark'
                  ? 'border-orange-500 bg-orange-500/5 ring-2 ring-orange-500/30'
                  : 'border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 hover:border-gray-300 dark:hover:border-slate-700 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-md ${
                  theme === 'dark' 
                    ? 'bg-orange-500/10 text-orange-500' 
                    : 'bg-gray-200/50 dark:bg-slate-800 text-gray-500 dark:text-slate-400'
                }`}>
                  <Moon className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  Dark
                </span>
                <span className="text-xs text-gray-500 dark:text-slate-400">
                  Reduced eye strain
                </span>
              </div>
              {theme === 'dark' && (
                <div className="p-1 bg-orange-500 rounded-full">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </button>
          </div>

          {/* Theme Description */}
          <div className="mt-4 p-3 bg-gray-50 dark:bg-slate-950/60 rounded-lg border border-gray-200 dark:border-slate-800/80">
            <div className="flex items-start gap-2.5">
              <Monitor className="w-4 h-4 text-gray-500 dark:text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-600 dark:text-slate-400">
                  <span className="font-semibold text-gray-700 dark:text-slate-300">Current theme:</span>{' '}
                  {theme === 'light' ? 'Light mode' : 'Dark mode'}
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-500 mt-0.5">
                  {theme === 'light' 
                    ? 'Optimized for bright environments with high contrast.' 
                    : 'Optimized for low-light environments with reduced eye strain.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}