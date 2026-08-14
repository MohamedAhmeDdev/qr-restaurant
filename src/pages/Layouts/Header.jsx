import React from 'react';
import { Menu, Bell, ChevronDown, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext'; 

export default function Header({ setMobileOpen }) {
  const { theme, toggleTheme } = useTheme(); 

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

        {/* Notification Bell */}
        <button className="relative p-2 text-gray-500 dark:text-slate-400 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none transition-colors duration-200">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse transition-colors duration-300"></span>
        </button>

        {/* User Profile Dropdown */}
        <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-gray-200/80 dark:border-slate-700/50 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 rounded-lg pr-2 py-1 transition-colors duration-300">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight transition-colors duration-300">John Manager</p>
            <p className="text-xs text-gray-500 dark:text-slate-400 leading-tight mt-0.5 transition-colors duration-300">Admin</p>
          </div>
          <div className="relative">
            <img
              className="w-9 h-9 rounded-full object-cover border-2 border-gray-100 dark:border-slate-700 shadow-sm transition-colors duration-300"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="User avatar"
            />
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 dark:text-slate-500 hidden sm:block transition-colors duration-300" />
        </div>
      </div>
    </header>
  );
}