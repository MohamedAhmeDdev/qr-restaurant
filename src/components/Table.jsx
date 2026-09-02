import React from 'react';
import TableSkeleton from './skeleton/TableSkeleton';
import EmptyState from './common/EmptyState';
import { AlertCircle } from 'lucide-react';

export default function Table({ 
  columns = [], 
  data = [], 
  renderRow,
  loading = false,
  error = null,
  onRetry,
  emptyIcon,
  emptyTitle = "No data found",
  emptyDescription = "There is no information to display at this time.",
  className = ""
}) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full text-left text-sm border-collapse ${className}`}>
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 transition-colors duration-200">
            {columns.map((col, idx) => (
              <th key={idx} className={`px-6 py-3.5 ${col.align === 'right' ? 'text-right' : 'text-left'}`}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* 1. LOADING STATE */}
          {loading ? (
            <TableSkeleton rows={6} columns={columns.length} />
          ) : error ? (
            /* 2. ERROR STATE INSIDE TBODY */
            <tr>
              <td colSpan={columns.length} className="px-6 py-12">
                <EmptyState
                  icon={AlertCircle}
                  title={error}
                />
              </td>
            </tr>
          ) : data.length === 0 ? (
            /* 3. EMPTY STATE INSIDE TBODY */
            <tr>
              <td colSpan={columns.length} className="px-6 py-12">
                <EmptyState
                  icon={emptyIcon}
                  title={emptyTitle}
                  description={emptyDescription}
                />
              </td>
            </tr>
          ) : (
            /* 4. DATA ROWS */
            data.map((item, index) => renderRow(item, index))
          )}
        </tbody>
      </table>
    </div>
  );
}