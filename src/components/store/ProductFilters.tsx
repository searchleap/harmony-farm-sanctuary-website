// ProductFilters Component
// Task 13 Phase 2 Step 6: Store Navigation & Filtering

import React, { useState, useEffect } from 'react'
import { X, Filter, ChevronDown, ChevronUp } from 'lucide-react'
import { ProductFilters as ProductFiltersType, Product, CategoryData } from '../../types/store'
import { getCategoryData, getMinMaxPrices } from '../../utils/store'

export interface ProductFiltersProps {
  products: Product[]
  filters: ProductFiltersType
  onFiltersChange: (filters: ProductFiltersType) => void
  onClearFilters: () => void
  variant?: 'sidebar' | 'horizontal' | 'compact' | 'mobile'
  className?: string
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  products,
  filters,
  onFiltersChange,
  onClearFilters,
  variant = 'sidebar',
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(variant !== 'compact')
  const [categoryData, setCategoryData] = useState<CategoryData[]>([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 })

  useEffect(() => {
    setCategoryData(getCategoryData(products))
    const { min, max } = getMinMaxPrices(products)
    setPriceRange({ min, max })
  }, [products])

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, categoryId as any]
      : filters.categories.filter(cat => cat !== categoryId)
    
    onFiltersChange({
      ...filters,
      categories: newCategories
    })
  }

  const handlePriceRangeChange = (min: number, max: number) => {
    onFiltersChange({
      ...filters,
      priceRange: { min, max }
    })
  }

  const handleToggleChange = (key: keyof ProductFiltersType, value: boolean) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const getActiveFilterCount = (): number => {
    let count = 0
    if (filters.categories.length > 0) count++
    if (filters.priceRange.min > priceRange.min || filters.priceRange.max < priceRange.max) count++
    if (filters.inStockOnly) count++
    if (filters.featured) count++
    if (filters.onSale) count++
    if (filters.tags.length > 0) count++
    return count
  }

  const renderSidebarFilters = () => (
    <div className={`space-y-6 ${className}`}>
      {/* Filter Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          {getActiveFilterCount() > 0 && (
            <span className="bg-sanctuary-green text-white text-xs px-2 py-1 rounded-full">
              {getActiveFilterCount()}
            </span>
          )}
        </div>
        {getActiveFilterCount() > 0 && (
          <button
            onClick={onClearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
          >
            <X className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Categories</h4>
        <div className="space-y-2">
          {categoryData.map((category) => (
            <label key={category.id} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.categories.includes(category.id)}
                onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                className="rounded border-gray-300 text-sanctuary-green focus:ring-sanctuary-green"
              />
              <span className="ml-2 text-sm text-gray-700 flex-1">
                {category.name}
              </span>
              <span className="text-xs text-gray-500">
                ({category.productCount})
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Price Range</h4>
        <div className="space-y-3">
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Min</label>
              <input
                type="number"
                min={priceRange.min}
                max={priceRange.max}
                value={filters.priceRange.min}
                onChange={(e) => handlePriceRangeChange(
                  Number(e.target.value),
                  filters.priceRange.max
                )}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-sanctuary-green focus:border-sanctuary-green"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Max</label>
              <input
                type="number"
                min={priceRange.min}
                max={priceRange.max}
                value={filters.priceRange.max === Number.MAX_VALUE ? priceRange.max : filters.priceRange.max}
                onChange={(e) => handlePriceRangeChange(
                  filters.priceRange.min,
                  Number(e.target.value)
                )}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-sanctuary-green focus:border-sanctuary-green"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Filters */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-900">Options</h4>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => handleToggleChange('inStockOnly', e.target.checked)}
            className="rounded border-gray-300 text-sanctuary-green focus:ring-sanctuary-green"
          />
          <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.featured}
            onChange={(e) => handleToggleChange('featured', e.target.checked)}
            className="rounded border-gray-300 text-sanctuary-green focus:ring-sanctuary-green"
          />
          <span className="ml-2 text-sm text-gray-700">Featured Products</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.onSale}
            onChange={(e) => handleToggleChange('onSale', e.target.checked)}
            className="rounded border-gray-300 text-sanctuary-green focus:ring-sanctuary-green"
          />
          <span className="ml-2 text-sm text-gray-700">On Sale</span>
        </label>
      </div>
    </div>
  )

  const renderHorizontalFilters = () => (
    <div className={`flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg ${className}`}>
      {/* Filter Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
      >
        <Filter className="w-4 h-4" />
        <span>Filter</span>
        {getActiveFilterCount() > 0 && (
          <span className="bg-sanctuary-green text-white text-xs px-2 py-1 rounded-full">
            {getActiveFilterCount()}
          </span>
        )}
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Quick Category Filters */}
      {categoryData.slice(0, 3).map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryChange(
            category.id,
            !filters.categories.includes(category.id)
          )}
          className={`px-3 py-2 text-sm rounded-md transition-colors ${
            filters.categories.includes(category.id)
              ? 'bg-sanctuary-green text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {category.name} ({category.productCount})
        </button>
      ))}

      {/* Quick Toggle Filters */}
      <button
        onClick={() => handleToggleChange('onSale', !filters.onSale)}
        className={`px-3 py-2 text-sm rounded-md transition-colors ${
          filters.onSale
            ? 'bg-red-500 text-white'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}
      >
        On Sale
      </button>

      <button
        onClick={() => handleToggleChange('inStockOnly', !filters.inStockOnly)}
        className={`px-3 py-2 text-sm rounded-md transition-colors ${
          filters.inStockOnly
            ? 'bg-sanctuary-green text-white'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}
      >
        In Stock
      </button>

      {/* Clear Filters */}
      {getActiveFilterCount() > 0 && (
        <button
          onClick={onClearFilters}
          className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
        >
          <X className="w-4 h-4" />
          <span>Clear</span>
        </button>
      )}

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="w-full mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* All Categories */}
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-2">All Categories</h5>
              <div className="space-y-1">
                {categoryData.map((category) => (
                  <label key={category.id} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category.id)}
                      onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                      className="rounded border-gray-300 text-sanctuary-green focus:ring-sanctuary-green mr-2"
                    />
                    {category.name} ({category.productCount})
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-2">Price Range</h5>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange.min}
                  onChange={(e) => handlePriceRangeChange(
                    Number(e.target.value),
                    filters.priceRange.max
                  )}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange.max === Number.MAX_VALUE ? '' : filters.priceRange.max}
                  onChange={(e) => handlePriceRangeChange(
                    filters.priceRange.min,
                    Number(e.target.value) || Number.MAX_VALUE
                  )}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>

            {/* Options */}
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-2">Options</h5>
              <div className="space-y-1">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={filters.featured}
                    onChange={(e) => handleToggleChange('featured', e.target.checked)}
                    className="rounded border-gray-300 text-sanctuary-green focus:ring-sanctuary-green mr-2"
                  />
                  Featured Products
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderCompactFilters = () => (
    <div className={`${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 w-full"
      >
        <Filter className="w-4 h-4" />
        <span>Filters</span>
        {getActiveFilterCount() > 0 && (
          <span className="bg-sanctuary-green text-white text-xs px-2 py-1 rounded-full">
            {getActiveFilterCount()}
          </span>
        )}
        <div className="flex-1" />
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isExpanded && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
          {renderSidebarFilters()}
        </div>
      )}
    </div>
  )

  const renderMobileFilters = () => (
    <div className={`${className}`}>
      {/* Mobile Filter Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          {getActiveFilterCount() > 0 && (
            <span className="bg-sanctuary-green text-white text-xs px-2 py-1 rounded-full">
              {getActiveFilterCount()}
            </span>
          )}
        </div>
        {getActiveFilterCount() > 0 && (
          <button
            onClick={onClearFilters}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Mobile Filter Content */}
      <div className="p-4">
        {renderSidebarFilters()}
      </div>
    </div>
  )

  // Render based on variant
  switch (variant) {
    case 'horizontal':
      return renderHorizontalFilters()
    case 'compact':
      return renderCompactFilters()
    case 'mobile':
      return renderMobileFilters()
    case 'sidebar':
    default:
      return renderSidebarFilters()
  }
}

export default ProductFilters