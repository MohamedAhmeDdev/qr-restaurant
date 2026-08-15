// components/StatsCard.jsx
import React from 'react';

export default function StatsCard({ label, value, valueColor = 'text-gray-900 dark:text-white' }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
      <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider transition-colors duration-200">
        {label}
      </p>
      <p className={`text-2xl font-bold mt-1 transition-colors duration-200 ${valueColor}`}>
        {value}
      </p>
    </div>
  );
}