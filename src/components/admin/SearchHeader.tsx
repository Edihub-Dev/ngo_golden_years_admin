'use client';

import { SearchIcon, FilterIcon, RefreshCcwIcon } from 'lucide-react';
import { useState } from 'react';

interface SearchHeaderProps {
  title: string;
  onSearch: (query: string) => void;
  onFilterToggle?: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

/**
 * Reusable Administrative Search Header
 */
export default function SearchHeader({ 
  title, 
  onSearch, 
  onFilterToggle, 
  onRefresh, 
  isLoading = false 
}: SearchHeaderProps) {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>

      <div className="flex flex-1 max-w-lg items-center gap-2">
        <form onSubmit={handleSearch} className="relative flex-1 group">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-blue-600" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, mobile, or email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-sm"
          />
        </form>

        <div className="flex items-center gap-2">
          {onFilterToggle && (
            <button
              onClick={onFilterToggle}
              className="p-2 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-colors shadow-sm text-gray-600"
              title="Show Filters"
            >
              <FilterIcon className="h-5 w-5" />
            </button>
          )}

          {onRefresh && (
            <button
              onClick={onRefresh}
              className={`p-2 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-colors shadow-sm text-gray-600 ${isLoading ? 'animate-spin' : ''}`}
              disabled={isLoading}
              title="Refresh Data"
            >
              <RefreshCcwIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
