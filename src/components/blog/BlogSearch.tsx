// BlogSearch Component for Harmony Farm Sanctuary
// Simple search interface for blog content

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface BlogSearchProps {
  value: string;
  onChange: (query: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  onClear?: () => void;
  className?: string;
}

export const BlogSearch: React.FC<BlogSearchProps> = ({
  value,
  onChange,
  placeholder = "Search articles...",
  autoFocus = false,
  onClear,
  className = ''
}) => {
  console.log('BlogSearch rendering:', { value, placeholder });

  const [localValue, setLocalValue] = useState(value);

  // Debounce search input
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [localValue, onChange, value]);

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
    onClear?.();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sanctuary-primary focus:border-sanctuary-primary transition-colors text-gray-900 placeholder-gray-500"
        />
        {localValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors"
            title="Clear search"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search suggestions or results count could go here */}
      {localValue && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="p-3 text-sm text-gray-600">
            Press Enter to search for "{localValue}"
          </div>
        </div>
      )}
    </div>
  );
};