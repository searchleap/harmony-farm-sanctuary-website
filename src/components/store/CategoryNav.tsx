// CategoryNav Component
// Task 13 Phase 2 Step 6: Store Navigation & Filtering

import React, { useState, useEffect } from 'react'
import { ChevronDown, Grid, Shirt, ShoppingBag, BookOpen, Gift, Calendar } from 'lucide-react'
import { ProductCategory, CategoryData, Product } from '../../types/store'
import { getCategoryData } from '../../utils/store'

export interface CategoryNavProps {
  products: Product[]
  activeCategory?: ProductCategory | 'all'
  onCategoryChange: (category: ProductCategory | 'all') => void
  variant?: 'sidebar' | 'horizontal' | 'dropdown' | 'mobile'
  className?: string
  showProductCount?: boolean
  showIcons?: boolean
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  products,
  activeCategory = 'all',
  onCategoryChange,
  variant = 'sidebar',
  className = '',
  showProductCount = true,
  showIcons = true
}) => {
  const [categoryData, setCategoryData] = useState<CategoryData[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [totalProducts, setTotalProducts] = useState(0)

  useEffect(() => {
    const categories = getCategoryData(products)
    setCategoryData(categories)
    setTotalProducts(products.length)
  }, [products])

  const getCategoryIcon = (categoryId: ProductCategory) => {
    const iconClass = "w-5 h-5"
    
    switch (categoryId) {
      case 'apparel':
        return <Shirt className={iconClass} />
      case 'accessories':
        return <ShoppingBag className={iconClass} />
      case 'books':
        return <BookOpen className={iconClass} />
      case 'gifts':
        return <Gift className={iconClass} />
      case 'seasonal':
        return <Calendar className={iconClass} />
      default:
        return <Grid className={iconClass} />
    }
  }

  const getActiveCategory = () => {
    if (activeCategory === 'all') {
      return { name: 'All Products', count: totalProducts }
    }
    const category = categoryData.find(cat => cat.id === activeCategory)
    return { name: category?.name || 'Unknown', count: category?.productCount || 0 }
  }

  const renderSidebarCategories = () => (
    <div className={`space-y-2 ${className}`}>
      {/* All Products */}
      <button
        onClick={() => onCategoryChange('all')}
        className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-lg transition-colors ${
          activeCategory === 'all'
            ? 'bg-sanctuary-green text-white'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <div className="flex items-center space-x-3">
          {showIcons && <Grid className="w-5 h-5" />}
          <span className="font-medium">All Products</span>
        </div>
        {showProductCount && (
          <span className={`text-sm px-2 py-1 rounded-full ${
            activeCategory === 'all'
              ? 'bg-white/20 text-white'
              : 'bg-gray-100 text-gray-600'
          }`}>
            {totalProducts}
          </span>
        )}
      </button>

      {/* Category Divider */}
      <div className="border-t border-gray-200 my-3" />

      {/* Categories */}
      {categoryData.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-lg transition-colors ${
            activeCategory === category.id
              ? 'bg-sanctuary-green text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center space-x-3">
            {showIcons && getCategoryIcon(category.id)}
            <div>
              <div className="font-medium">{category.name}</div>
              {category.description && (
                <div className={`text-xs ${
                  activeCategory === category.id ? 'text-white/80' : 'text-gray-500'
                }`}>
                  {category.description}
                </div>
              )}
            </div>
          </div>
          {showProductCount && (
            <span className={`text-sm px-2 py-1 rounded-full ${
              activeCategory === category.id
                ? 'bg-white/20 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {category.productCount}
            </span>
          )}
        </button>
      ))}
    </div>
  )

  const renderHorizontalCategories = () => (
    <div className={`flex items-center space-x-2 overflow-x-auto pb-2 ${className}`}>
      {/* All Products */}
      <button
        onClick={() => onCategoryChange('all')}
        className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
          activeCategory === 'all'
            ? 'bg-sanctuary-green text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {showIcons && <Grid className="w-4 h-4" />}
        <span>All Products</span>
        {showProductCount && (
          <span className={`text-sm px-2 py-1 rounded-full ${
            activeCategory === 'all'
              ? 'bg-white/20'
              : 'bg-white text-gray-600'
          }`}>
            {totalProducts}
          </span>
        )}
      </button>

      {/* Categories */}
      {categoryData.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
            activeCategory === category.id
              ? 'bg-sanctuary-green text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {showIcons && getCategoryIcon(category.id)}
          <span>{category.name}</span>
          {showProductCount && (
            <span className={`text-sm px-2 py-1 rounded-full ${
              activeCategory === category.id
                ? 'bg-white/20'
                : 'bg-white text-gray-600'
            }`}>
              {category.productCount}
            </span>
          )}
        </button>
      ))}
    </div>
  )

  const renderDropdownCategories = () => (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        <div className="flex items-center space-x-2">
          {showIcons && (activeCategory === 'all' ? <Grid className="w-5 h-5" /> : getCategoryIcon(activeCategory as ProductCategory))}
          <span className="font-medium">
            {getActiveCategory().name}
          </span>
          {showProductCount && (
            <span className="text-sm text-gray-500">
              ({getActiveCategory().count})
            </span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {isDropdownOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {/* All Products */}
          <button
            onClick={() => {
              onCategoryChange('all')
              setIsDropdownOpen(false)
            }}
            className={`w-full flex items-center justify-between px-4 py-2 text-left hover:bg-gray-50 ${
              activeCategory === 'all' ? 'bg-sanctuary-green/10 text-sanctuary-green' : ''
            }`}
          >
            <div className="flex items-center space-x-2">
              {showIcons && <Grid className="w-4 h-4" />}
              <span>All Products</span>
            </div>
            {showProductCount && (
              <span className="text-sm text-gray-500">({totalProducts})</span>
            )}
          </button>

          <div className="border-t border-gray-100" />

          {/* Categories */}
          {categoryData.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                onCategoryChange(category.id)
                setIsDropdownOpen(false)
              }}
              className={`w-full flex items-center justify-between px-4 py-2 text-left hover:bg-gray-50 ${
                activeCategory === category.id ? 'bg-sanctuary-green/10 text-sanctuary-green' : ''
              }`}
            >
              <div className="flex items-center space-x-2">
                {showIcons && getCategoryIcon(category.id)}
                <div>
                  <div>{category.name}</div>
                  {category.description && (
                    <div className="text-xs text-gray-500">{category.description}</div>
                  )}
                </div>
              </div>
              {showProductCount && (
                <span className="text-sm text-gray-500">({category.productCount})</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )

  const renderMobileCategories = () => (
    <div className={`${className}`}>
      {/* Mobile Category Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
        <span className="text-sm text-gray-500">
          {getActiveCategory().count} products
        </span>
      </div>

      {/* Mobile Category Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* All Products */}
        <button
          onClick={() => onCategoryChange('all')}
          className={`flex flex-col items-center p-4 rounded-lg border-2 transition-colors ${
            activeCategory === 'all'
              ? 'border-sanctuary-green bg-sanctuary-green/10 text-sanctuary-green'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <Grid className="w-8 h-8 mb-2" />
          <span className="text-sm font-medium">All Products</span>
          {showProductCount && (
            <span className="text-xs text-gray-500 mt-1">
              {totalProducts} items
            </span>
          )}
        </button>

        {/* Categories */}
        {categoryData.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`flex flex-col items-center p-4 rounded-lg border-2 transition-colors ${
              activeCategory === category.id
                ? 'border-sanctuary-green bg-sanctuary-green/10 text-sanctuary-green'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {getCategoryIcon(category.id)}
            <span className="text-sm font-medium mt-2 text-center">
              {category.name}
            </span>
            {showProductCount && (
              <span className="text-xs text-gray-500 mt-1">
                {category.productCount} items
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )

  // Render based on variant
  switch (variant) {
    case 'horizontal':
      return renderHorizontalCategories()
    case 'dropdown':
      return renderDropdownCategories()
    case 'mobile':
      return renderMobileCategories()
    case 'sidebar':
    default:
      return renderSidebarCategories()
  }
}

export default CategoryNav