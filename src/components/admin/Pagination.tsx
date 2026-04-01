'use client';

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

interface PaginationProps {
  current: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * Reusable Pagination Component
 */
export default function Pagination({ 
  current, 
  total, 
  onPageChange, 
  className = '' 
}: PaginationProps) {
  const pages = Array.from({ length: total }, (_, i) => i + 1);

  if (total <= 1) return null;

  return (
    <div className={`flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 rounded-b-xl ${className}`}>
      <div className="flex justify-between flex-1 sm:hidden">
        <button
          onClick={() => onPageChange(Math.max(1, current - 1))}
          disabled={current === 1}
          className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(Math.min(total, current + 1))}
          disabled={current === total}
          className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Page <span className="font-medium">{current}</span> of{' '}
            <span className="font-medium">{total}</span>
          </p>
        </div>
        <div>
          <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => onPageChange(current - 1)}
              disabled={current === 1}
              className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 rounded-l-md"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            {pages.map((p) => (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                  p === current
                    ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                    : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => onPageChange(current + 1)}
              disabled={current === total}
              className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 rounded-r-md"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
