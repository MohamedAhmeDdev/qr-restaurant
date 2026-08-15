// components/Table.jsx
import React from 'react';

export default function Tables({ 
  columns, 
  data, 
  renderRow,
  emptyMessage = "No data available.",
  className = ""
}) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full text-left text-sm ${className}`}>
        <thead className="bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 font-medium transition-colors duration-200">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className={`px-6 py-4 ${col.align === 'right' ? 'text-right' : ''}`}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-slate-800 transition-colors duration-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500 dark:text-slate-400 text-xs transition-colors duration-200">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => renderRow(item, index))
          )}
        </tbody>
      </table>
    </div>
  );
}