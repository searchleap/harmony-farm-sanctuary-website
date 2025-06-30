// Store Components Test Page
// Task 13 Phase 2 Step 6: Testing Store Navigation & Filtering

import React, { useState } from 'react'
import ProductFilters from './ProductFilters'
import ProductSearch from './ProductSearch'
import CategoryNav from './CategoryNav'
import SortOptions from './SortOptions'
import { sampleProducts } from '../../data/products'
import { 
  ProductFilters as ProductFiltersType, 
  SortOption, 
  ViewMode, 
  ProductCategory 
} from '../../types/store'
import { 
  applyProductFilters, 
  sortProductsBySortOption, 
  searchProducts, 
  createDefaultFilters 
} from '../../utils/store'

const StoreTestPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<ProductFiltersType>(createDefaultFilters())
  const [sortBy, setSortBy] = useState<SortOption>('featured')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all')
  const [resultsPerPage, setResultsPerPage] = useState(24)

  console.log('StoreTestPage state:', {
    searchQuery,
    filters,
    sortBy,
    viewMode,
    activeCategory,
    resultsPerPage
  })

  const handleSearch = (query: string) => {
    console.log('Search query:', query)
    setSearchQuery(query)
  }

  const handleFiltersChange = (newFilters: ProductFiltersType) => {
    console.log('Filters changed:', newFilters)
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    console.log('Clearing filters')
    setFilters(createDefaultFilters())
  }

  const handleCategoryChange = (category: ProductCategory | 'all') => {
    console.log('Category changed:', category)
    setActiveCategory(category)
    
    // Update filters to match category
    const newFilters = category === 'all' 
      ? { ...filters, categories: [] }
      : { ...filters, categories: [category] }
    setFilters(newFilters)
  }

  const handleSortChange = (newSortBy: SortOption) => {
    console.log('Sort changed:', newSortBy)
    setSortBy(newSortBy)
  }

  const handleViewModeChange = (newViewMode: ViewMode) => {
    console.log('View mode changed:', newViewMode)
    setViewMode(newViewMode)
  }

  const handleResultsPerPageChange = (count: number) => {
    console.log('Results per page changed:', count)
    setResultsPerPage(count)
  }

  // Apply filters and search
  let filteredProducts = sampleProducts
  
  if (searchQuery) {
    filteredProducts = searchProducts(filteredProducts, searchQuery)
  }
  
  filteredProducts = applyProductFilters(filteredProducts, filters)
  filteredProducts = sortProductsBySortOption(filteredProducts, sortBy)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Store Components Test</h1>
      
      {/* Product Search */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Product Search</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Header Variant</h3>
            <ProductSearch
              products={sampleProducts}
              onSearch={handleSearch}
              variant="header"
              placeholder="Search products..."
            />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Inline Variant</h3>
            <ProductSearch
              products={sampleProducts}
              onSearch={handleSearch}
              variant="inline"
              placeholder="Search products..."
            />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Mobile Variant</h3>
            <ProductSearch
              products={sampleProducts}
              onSearch={handleSearch}
              variant="mobile"
              placeholder="Search products..."
            />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Expanded Variant</h3>
            <ProductSearch
              products={sampleProducts}
              onSearch={handleSearch}
              variant="expanded"
              placeholder="Search products..."
            />
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Category Navigation</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Horizontal Variant</h3>
            <CategoryNav
              products={sampleProducts}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
              variant="horizontal"
            />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Dropdown Variant</h3>
            <CategoryNav
              products={sampleProducts}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
              variant="dropdown"
            />
          </div>
        </div>
      </div>

      {/* Sort Options */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Sort Options</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Dropdown Variant</h3>
            <SortOptions
              sortBy={sortBy}
              onSortChange={handleSortChange}
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
              resultsPerPage={resultsPerPage}
              onResultsPerPageChange={handleResultsPerPageChange}
              totalResults={filteredProducts.length}
              variant="dropdown"
            />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Compact Variant</h3>
            <SortOptions
              sortBy={sortBy}
              onSortChange={handleSortChange}
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
              totalResults={filteredProducts.length}
              variant="compact"
            />
          </div>
        </div>
      </div>

      {/* Product Filters */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Product Filters</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-medium mb-2">Sidebar Variant</h3>
            <ProductFilters
              products={sampleProducts}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              variant="sidebar"
            />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Compact Variant</h3>
            <ProductFilters
              products={sampleProducts}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              variant="compact"
            />
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Results Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="font-medium text-gray-900">Search Query</div>
            <div className="text-gray-600">{searchQuery || 'None'}</div>
          </div>
          <div>
            <div className="font-medium text-gray-900">Active Category</div>
            <div className="text-gray-600">{activeCategory === 'all' ? 'All Products' : activeCategory}</div>
          </div>
          <div>
            <div className="font-medium text-gray-900">Sort By</div>
            <div className="text-gray-600">
              {sortBy.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900">Results</div>
            <div className="text-gray-600">{filteredProducts.length} products</div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="font-medium text-gray-900 mb-2">Active Filters</div>
          <div className="text-sm text-gray-600">
            {filters.categories.length > 0 && (
              <span className="mr-4">Categories: {filters.categories.join(', ')}</span>
            )}
            {filters.inStockOnly && (
              <span className="mr-4">In Stock Only</span>
            )}
            {filters.featured && (
              <span className="mr-4">Featured</span>
            )}
            {filters.onSale && (
              <span className="mr-4">On Sale</span>
            )}
            {filters.tags.length > 0 && (
              <span className="mr-4">Tags: {filters.tags.join(', ')}</span>
            )}
            {(filters.priceRange.min > 0 || filters.priceRange.max < Number.MAX_VALUE) && (
              <span className="mr-4">
                Price: ${filters.priceRange.min} - ${filters.priceRange.max === Number.MAX_VALUE ? '∞' : filters.priceRange.max}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StoreTestPage