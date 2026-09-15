import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage,
  totalPages = 1,
  totalRecords = 0,
  onPageChange,
  maxVisible = 5,
}) {
  if (!totalPages || totalPages < 1) return null;

  const getPageNumbers = () => {
    // If total pages is small, render all without ellipses
    if (totalPages <= maxVisible + 2) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    const sideCount = Math.floor((maxVisible - 2) / 2);
    
    let start = Math.max(2, currentPage - sideCount);
    let end = Math.min(totalPages - 1, currentPage + sideCount);

    // Adjust bounds near start or end
    if (currentPage <= sideCount + 2) {
      end = Math.min(totalPages - 1, maxVisible);
      start = 2;
    } else if (currentPage >= totalPages - sideCount - 1) {
      start = Math.max(2, totalPages - maxVisible + 1);
      end = totalPages - 1;
    }

    // Always include page 1
    pages.push(1);

    // Left ellipsis
    if (start > 2) {
      pages.push('LEFT_ELLIPSIS');
    }

    // Middle visible range
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Right ellipsis
    if (end < totalPages - 1) {
      pages.push('RIGHT_ELLIPSIS');
    }

    // Always include last page
    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        <div className="flex gap-1 items-center">
          {getPageNumbers().map((page, index) => {
            if (page === 'LEFT_ELLIPSIS' || page === 'RIGHT_ELLIPSIS') {
              return (
                <span
                  key={`${page}-${index}`}
                  className="px-2 py-1.5 text-xs text-gray-400 dark:text-gray-500 select-none"
                >
                  ...
                </span>
              );
            }

            return (
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
            );
          })}
        </div>

        {/* Next Button */}
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