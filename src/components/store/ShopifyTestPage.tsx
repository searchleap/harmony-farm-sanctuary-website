// Shopify Integration Test Page
// Task 13: Shopify Migration - Integration Testing

import React, { useState } from 'react'
import { useShopifyProducts, useShopifyCollections, useShopifyCart } from '../../hooks/useShopify'
import { ProductCard } from './ProductCard'
import { CartDrawer } from './CartDrawer'
import { ProductFilters } from './ProductFilters'
import { ProductSearch } from './ProductSearch'
import { CategoryNav } from './CategoryNav'
import { SortOptions } from './SortOptions'
import { 
  ProductFilters as ProductFiltersType, 
  SortOption, 
  ViewMode, 
  ProductCategory 
} from '../../types/store'
import { 
  createDefaultFilters
} from '../../utils/store'
import { adaptShopifyCollectionsToCategories } from '../../utils/shopifyAdapters'

const ShopifyTestPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<ProductFiltersType>(createDefaultFilters())
  const [sortBy, setSortBy] = useState<SortOption>('featured')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all')
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Shopify hooks
  const { 
    products, 
    loading: productsLoading, 
    error: productsError,
    hasNextPage,
    loadMore,
    refetch 
  } = useShopifyProducts(searchQuery, filters, sortBy)

  const { 
    collections, 
    loading: collectionsLoading, 
    error: collectionsError 
  } = useShopifyCollections()

  const { 
    cart, 
    loading: cartLoading, 
    error: cartError,
    addToCart,
    updateCartLine,
    removeFromCart,
    clearCart,
    checkout 
  } = useShopifyCart()

  // Adapter categories for our existing components
  const categoryData = adaptShopifyCollectionsToCategories(collections, products)

  console.log('ShopifyTestPage state:', {
    searchQuery,
    filters,
    sortBy,
    viewMode,
    activeCategory,
    productsCount: products.length,
    collectionsCount: collections.length,
    cartItemsCount: cart?.totalQuantity || 0
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

  const handleAddToCart = async (productId: string, variantId: string, quantity: number) => {
    console.log('Adding to cart:', { productId, variantId, quantity })
    await addToCart(variantId, quantity)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopify Integration Test</h1>
      
      {/* Status Section */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Integration Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-medium text-gray-900">Products</div>
            <div className={`${productsLoading ? 'text-yellow-600' : productsError ? 'text-red-600' : 'text-green-600'}`}>
              {productsLoading ? 'Loading...' : productsError ? `Error: ${productsError.message}` : `✓ ${products.length} loaded`}
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900">Collections</div>
            <div className={`${collectionsLoading ? 'text-yellow-600' : collectionsError ? 'text-red-600' : 'text-green-600'}`}>
              {collectionsLoading ? 'Loading...' : collectionsError ? `Error: ${collectionsError.message}` : `✓ ${collections.length} loaded`}
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900">Cart</div>
            <div className={`${cartLoading ? 'text-yellow-600' : cartError ? 'text-red-600' : 'text-green-600'}`}>
              {cartLoading ? 'Loading...' : cartError ? `Error: ${cartError.message}` : `✓ ${cart?.totalQuantity || 0} items`}
            </div>
          </div>
        </div>

        {/* Environment Check */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="font-medium text-gray-900 mb-2">Configuration</div>
          <div className="text-sm space-y-1">
            <div>
              <span className="font-medium">Domain:</span>{' '}
              {import.meta.env.VITE_SHOPIFY_DOMAIN || '❌ Not configured'}
            </div>
            <div>
              <span className="font-medium">Access Token:</span>{' '}
              {import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN ? '✓ Configured' : '❌ Not configured'}
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Product Search (Shopify)</h2>
        <ProductSearch
          products={products}
          onSearch={handleSearch}
          variant="expanded"
          placeholder="Search Shopify products..."
        />
      </div>

      {/* Controls */}
      <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Navigation */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Categories</h3>
          <CategoryNav
            products={products}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
            variant="dropdown"
          />
        </div>

        {/* Sort Options */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Sort & View</h3>
          <SortOptions
            sortBy={sortBy}
            onSortChange={handleSortChange}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            totalResults={products.length}
            variant="compact"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Filters (Shopify Data)</h2>
        <ProductFilters
          products={products}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          variant="horizontal"
        />
      </div>

      {/* Product Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Products from Shopify</h2>
          <div className="flex items-center space-x-4">
            {hasNextPage && (
              <button
                onClick={loadMore}
                disabled={productsLoading}
                className="px-4 py-2 bg-sanctuary-green text-white rounded-lg hover:bg-sanctuary-green-dark disabled:opacity-50"
              >
                {productsLoading ? 'Loading...' : 'Load More'}
              </button>
            )}
            <button
              onClick={refetch}
              disabled={productsLoading}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Refresh
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 relative"
            >
              Cart ({cart?.totalQuantity || 0})
            </button>
          </div>
        </div>

        {productsLoading && products.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-sanctuary-green border-t-transparent rounded-full mx-auto mb-4" />
            <div className="text-gray-600">Loading Shopify products...</div>
          </div>
        ) : productsError ? (
          <div className="text-center py-12 text-red-600">
            <div className="text-lg font-semibold mb-2">Error Loading Products</div>
            <div className="text-sm">{productsError.message}</div>
            <button
              onClick={refetch}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <div className="text-lg font-semibold mb-2">No Products Found</div>
            <div className="text-sm">Try adjusting your search or filters</div>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
          }`}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(quantity, variantId) => handleAddToCart(product.id, variantId || '', quantity)}
                variant={viewMode === 'list' ? 'list' : 'default'}
              />
            ))}
          </div>
        )}
      </div>

      {/* Debug Information */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-medium mb-2">Active State</h3>
            <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
{JSON.stringify({
  searchQuery,
  activeCategory,
  sortBy,
  viewMode,
  productsCount: products.length,
  hasNextPage,
  cartItems: cart?.totalQuantity || 0
}, null, 2)}
            </pre>
          </div>
          <div>
            <h3 className="font-medium mb-2">Sample Product Data</h3>
            <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
{JSON.stringify(products[0] || {}, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateCartLine}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
        onCheckout={checkout}
        loading={cartLoading}
      />
    </div>
  )
}

export default ShopifyTestPage