import React from 'react';
import { Menu, Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

function formatRole(role) {
  if (!role) return 'User';
  return role
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Header({ setMobileOpen }) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white dark:bg-slate-900 border-b border-gray-200/80 dark:border-slate-700/50 sm:px-6 lg:px-8 shadow-sm transition-colors duration-300">
      <div className="flex items-center flex-1">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 -ml-2 text-gray-500 dark:text-slate-400 rounded-md lg:hidden hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-200"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center justify-end gap-2 sm:gap-4 flex-1">
        <button
          onClick={toggleTheme}
          className="p-2 text-gray-500 dark:text-slate-400 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none transition-colors duration-200"
          aria-label="Toggle Dark Mode"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5 text-orange-400" />
          )}
        </button>



        {/* User Name & Role — text only, no image, no dropdown */}
        <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-gray-200/80 dark:border-slate-700/50">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight transition-colors duration-300">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400 leading-tight mt-0.5 transition-colors duration-300">
              {formatRole(user?.role)}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}