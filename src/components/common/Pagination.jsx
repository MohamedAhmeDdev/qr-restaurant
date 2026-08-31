import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage,
  totalPages = 1,
  totalRecords = 0,
  onPageChange,
  maxVisible = 5,
}) {
  // Always render if totalPages is at least 1, or remove guard clause completely
  if (!totalPages || totalPages < 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
      <span className="text-xs text-gray-500 dark:text-slate-400">
        Page {currentPage} of {totalPages}
      </span>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex gap-1">
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                currentPage === page
                  ? 'bg-orange-500 text-white'
                  : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300"
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}