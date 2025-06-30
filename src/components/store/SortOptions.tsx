// SortOptions Component
// Task 13 Phase 2 Step 6: Store Navigation & Filtering

import React, { useState } from 'react'
import { ChevronDown, Grid, List, ArrowUpDown, Star, Clock, TrendingUp, DollarSign } from 'lucide-react'
import { SortOption, ViewMode } from '../../types/store'

export interface SortOptionsProps {
  sortBy: SortOption
  onSortChange: (sortOption: SortOption) => void
  viewMode?: ViewMode
  onViewModeChange?: (viewMode: ViewMode) => void
  resultsPerPage?: number
  onResultsPerPageChange?: (count: number) => void
  totalResults?: number
  variant?: 'dropdown' | 'buttons' | 'compact' | 'mobile'
  className?: string
  showViewToggle?: boolean
  showResultsPerPage?: boolean
}

const SORT_OPTIONS: Array<{
  value: SortOption
  label: string
  icon: React.ReactNode
  description: string
}> = [
  {
    value: 'featured',
    label: 'Featured',
    icon: <Star className="w-4 h-4" />,
    description: 'Our top picks'
  },
  {
    value: 'popular',
    label: 'Most Popular',
    icon: <TrendingUp className="w-4 h-4" />,
    description: 'Bestsellers first'
  },
  {
    value: 'newest',
    label: 'Newest',
    icon: <Clock className="w-4 h-4" />,
    description: 'Latest arrivals'
  },
  {
    value: 'price-asc',
    label: 'Price: Low to High',
    icon: <DollarSign className="w-4 h-4" />,
    description: 'Budget-friendly first'
  },
  {
    value: 'price-desc',
    label: 'Price: High to Low',
    icon: <DollarSign className="w-4 h-4" />,
    description: 'Premium first'
  },
  {
    value: 'name-asc',
    label: 'Name: A to Z',
    icon: <ArrowUpDown className="w-4 h-4" />,
    description: 'Alphabetical order'
  },
  {
    value: 'name-desc',
    label: 'Name: Z to A',
    icon: <ArrowUpDown className="w-4 h-4" />,
    description: 'Reverse alphabetical'
  }
]

const RESULTS_PER_PAGE_OPTIONS = [12, 24, 48, 96]

export const SortOptions: React.FC<SortOptionsProps> = ({
  sortBy,
  onSortChange,
  viewMode = 'grid',
  onViewModeChange,
  resultsPerPage = 24,
  onResultsPerPageChange,
  totalResults = 0,
  variant = 'dropdown',
  className = '',
  showViewToggle = true,
  showResultsPerPage = true
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const getCurrentSortOption = () => {
    return SORT_OPTIONS.find(option => option.value === sortBy) || SORT_OPTIONS[0]
  }

  const renderDropdownSort = () => (
    <div className={`flex items-center space-x-4 ${className}`}>
      {/* Sort Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-sanctuary-green focus:border-transparent"
        >
          {getCurrentSortOption().icon}
          <span className="text-sm font-medium">Sort: {getCurrentSortOption().label}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="p-2">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onSortChange(option.value)
                    setIsDropdownOpen(false)
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-md hover:bg-gray-50 ${
                    sortBy === option.value ? 'bg-sanctuary-green/10 text-sanctuary-green' : 'text-gray-700'
                  }`}
                >
                  {option.icon}
                  <div className="flex-1">
                    <div className="text-sm font-medium">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.description}</div>
                  </div>
                  {sortBy === option.value && (
                    <div className="w-2 h-2 bg-sanctuary-green rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* View Mode Toggle */}
      {showViewToggle && onViewModeChange && (
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 ${
              viewMode === 'grid' 
                ? 'bg-sanctuary-green text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
            title="Grid View"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 ${
              viewMode === 'list' 
                ? 'bg-sanctuary-green text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Results Per Page */}
      {showResultsPerPage && onResultsPerPageChange && (
        <select
          value={resultsPerPage}
          onChange={(e) => onResultsPerPageChange(Number(e.target.value))}
          className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sanctuary-green focus:border-transparent"
        >
          {RESULTS_PER_PAGE_OPTIONS.map((count) => (
            <option key={count} value={count}>
              {count} per page
            </option>
          ))}
        </select>
      )}

      {/* Results Count */}
      {totalResults > 0 && (
        <span className="text-sm text-gray-500">
          {totalResults.toLocaleString()} results
        </span>
      )}
    </div>
  )

  const renderButtonSort = () => (
    <div className={`space-y-4 ${className}`}>
      {/* Sort Buttons */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Sort By</h4>
        <div className="grid grid-cols-2 gap-2">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                sortBy === option.value
                  ? 'border-sanctuary-green bg-sanctuary-green/10 text-sanctuary-green'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {option.icon}
              <span className="text-sm">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* View Options */}
      {(showViewToggle || showResultsPerPage) && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          {/* View Mode */}
          {showViewToggle && onViewModeChange && (
            <div>
              <span className="text-sm font-medium text-gray-900 mr-3">View:</span>
              <div className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => onViewModeChange('grid')}
                  className={`p-2 ${
                    viewMode === 'grid' 
                      ? 'bg-sanctuary-green text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onViewModeChange('list')}
                  className={`p-2 ${
                    viewMode === 'list' 
                      ? 'bg-sanctuary-green text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Results Per Page */}
          {showResultsPerPage && onResultsPerPageChange && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Show:</span>
              <select
                value={resultsPerPage}
                onChange={(e) => onResultsPerPageChange(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              >
                {RESULTS_PER_PAGE_OPTIONS.map((count) => (
                  <option key={count} value={count}>{count}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  )

  const renderCompactSort = () => (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Compact Sort */}
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sanctuary-green focus:border-transparent"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <div className="flex items-center space-x-2">
        {/* View Toggle */}
        {showViewToggle && onViewModeChange && (
          <div className="flex items-center border border-gray-300 rounded overflow-hidden">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1 ${
                viewMode === 'grid' ? 'bg-sanctuary-green text-white' : 'bg-white text-gray-600'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-1 ${
                viewMode === 'list' ? 'bg-sanctuary-green text-white' : 'bg-white text-gray-600'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Results Count */}
        {totalResults > 0 && (
          <span className="text-sm text-gray-500">
            {totalResults} results
          </span>
        )}
      </div>
    </div>
  )

  const renderMobileSort = () => (
    <div className={`space-y-4 ${className}`}>
      {/* Mobile Sort Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Sort & Filter</h3>
        {totalResults > 0 && (
          <span className="text-sm text-gray-500">
            {totalResults} results
          </span>
        )}
      </div>

      {/* Sort Options Grid */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Sort By</h4>
        <div className="grid grid-cols-1 gap-2">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                sortBy === option.value
                  ? 'border-sanctuary-green bg-sanctuary-green/10 text-sanctuary-green'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                {option.icon}
                <div className="text-left">
                  <div className="text-sm font-medium">{option.label}</div>
                  <div className="text-xs text-gray-500">{option.description}</div>
                </div>
              </div>
              {sortBy === option.value && (
                <div className="w-3 h-3 bg-sanctuary-green rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* View & Display Options */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        {/* View Mode */}
        {showViewToggle && onViewModeChange && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">View</h4>
            <div className="flex space-x-2">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`flex-1 flex items-center justify-center p-2 rounded border ${
                  viewMode === 'grid'
                    ? 'border-sanctuary-green bg-sanctuary-green/10 text-sanctuary-green'
                    : 'border-gray-300 text-gray-600'
                }`}
              >
                <Grid className="w-4 h-4 mr-2" />
                Grid
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`flex-1 flex items-center justify-center p-2 rounded border ${
                  viewMode === 'list'
                    ? 'border-sanctuary-green bg-sanctuary-green/10 text-sanctuary-green'
                    : 'border-gray-300 text-gray-600'
                }`}
              >
                <List className="w-4 h-4 mr-2" />
                List
              </button>
            </div>
          </div>
        )}

        {/* Results Per Page */}
        {showResultsPerPage && onResultsPerPageChange && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Show</h4>
            <select
              value={resultsPerPage}
              onChange={(e) => onResultsPerPageChange(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              {RESULTS_PER_PAGE_OPTIONS.map((count) => (
                <option key={count} value={count}>
                  {count} per page
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  )

  // Render based on variant
  switch (variant) {
    case 'buttons':
      return renderButtonSort()
    case 'compact':
      return renderCompactSort()
    case 'mobile':
      return renderMobileSort()
    case 'dropdown':
    default:
      return renderDropdownSort()
  }
}

export default SortOptions