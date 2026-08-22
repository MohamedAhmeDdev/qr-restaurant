import React from 'react';

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      {Icon && (
        <div className="p-3 rounded-full bg-gray-100 dark:bg-slate-800 mb-3">
          <Icon className="w-8 h-8 text-gray-400 dark:text-slate-500" />
        </div>
      )}
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-slate-100">{title}</p>
        {description && (
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{description}</p>
        )}
      </div>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}