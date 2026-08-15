import React from 'react';
import { Sun, Moon, Check } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

export default function PreferencesTab() {
  const { theme, toggleTheme, setTheme } = useTheme();

  const themes = [
    { id: 'light', label: 'Light', icon: Sun, description: 'Bright interface appearance' },
    { id: 'dark', label: 'Dark', icon: Moon, description: 'Low-light dark appearance' },
  ];

  const handleSelect = (selectedId) => {
    if (setTheme) {
      setTheme(selectedId);
    } else if (theme !== selectedId) {
      toggleTheme();
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-colors duration-200">
      
      {/* SECTION HEADER */}
      <div className="px-6 sm:px-7 pt-6 pb-5 border-b border-gray-100 dark:border-slate-800 transition-colors duration-200">
        <span className="inline-block text-[11px] font-semibold tracking-wider uppercase text-orange-500 mb-1">
          Interface
        </span>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-200">
          System Preferences
        </h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 leading-relaxed transition-colors duration-200">
          Customize how your platform interface looks and behaves.
        </p>
      </div>

      {/* CARD BODY */}
      <div className="px-6 sm:px-7 py-6 space-y-6">
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 transition-colors duration-200">
            Theme Mode
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {themes.map((item) => {
              const Icon = item.icon;
              const isSelected = theme === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className={`relative flex flex-col items-start p-4 rounded-xl border text-left transition-colors duration-200 ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-950 ring-2 ring-orange-500 shadow-sm'
                      : 'border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 bg-gray-50 dark:bg-slate-800'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center transition-colors duration-200">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                  
                  <div
                    className={`p-2 rounded-lg mb-3 transition-colors duration-200 ${
                      isSelected
                        ? 'bg-orange-500 text-white'
                        : 'bg-white dark:bg-slate-900 text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <span className="text-sm font-semibold text-gray-900 dark:text-white transition-colors duration-200">
                    {item.label}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 transition-colors duration-200">
                    {item.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}