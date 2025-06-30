// ProductCard Component - Multiple display variants for product listings
// Task 13: Phase 2 - Product Display Components

import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Star, Eye, Tag } from 'lucide-react'
import { Product } from '../../types/store'
import { formatPrice, getProductPrice, isProductOnSale, getProductDiscountPercentage } from '../../utils/store'
import { Button } from '../ui'
import { cn } from '../../utils/cn'

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'compact' | 'featured' | 'list'
  showQuickAdd?: boolean
  showWishlist?: boolean
  onAddToCart?: (productId: string) => void
  onAddToWishlist?: (productId: string) => void
  className?: string
}

export function ProductCard({
  product,
  variant = 'default',
  showQuickAdd = true,
  showWishlist = true,
  onAddToCart,
  onAddToWishlist,
  className
}: ProductCardProps) {
  console.log('🛍️ ProductCard rendered:', { productId: product.id, variant, inStock: product.inStock })

  const currentPrice = getProductPrice(product)
  const onSale = isProductOnSale(product)
  const discountPercentage = onSale ? getProductDiscountPercentage(product) : 0
  const mainImage = product.images.find(img => img.isMain) || product.images[0]

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onAddToCart) {
      onAddToCart(product.id)
      console.log('➕ Quick add to cart:', product.id)
    }
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onAddToWishlist) {
      onAddToWishlist(product.id)
      console.log('❤️ Add to wishlist:', product.id)
    }
  }

  // Compact variant for small spaces
  if (variant === 'compact') {
    return (
      <Link
        to={`/shop/products/${product.id}`}
        className={cn(
          'block bg-white rounded-lg border border-gray-200 hover:border-sanctuary-300 hover:shadow-md transition-all duration-200',
          className
        )}
      >
        <div className="aspect-square relative overflow-hidden rounded-t-lg">
          {mainImage && (
            <img
              src={mainImage.url}
              alt={mainImage.alt}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          )}
          
          {onSale && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
              -{discountPercentage}%
            </div>
          )}
          
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </div>
        
        <div className="p-3">
          <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {onSale && (
                <span className="text-xs text-gray-500 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
              <span className="font-semibold text-sanctuary-600">
                {formatPrice(currentPrice)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // List variant for list view
  if (variant === 'list') {
    return (
      <div className={cn(
        'bg-white rounded-lg border border-gray-200 hover:border-sanctuary-300 hover:shadow-md transition-all duration-200',
        className
      )}>
        <div className="flex p-4">
          <Link to={`/shop/products/${product.id}`} className="flex-shrink-0">
            <div className="w-24 h-24 relative overflow-hidden rounded-lg">
              {mainImage && (
                <img
                  src={mainImage.url}
                  alt={mainImage.alt}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </Link>
          
          <div className="ml-4 flex-1 min-w-0">
            <Link to={`/shop/products/${product.id}`}>
              <h3 className="font-semibold text-gray-900 hover:text-sanctuary-600 transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {product.shortDescription}
              </p>
            </Link>
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-2">
                {onSale && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
                <span className="font-semibold text-lg text-sanctuary-600">
                  {formatPrice(currentPrice)}
                </span>
                {onSale && (
                  <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-medium">
                    -{discountPercentage}%
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {showWishlist && (
                  <button
                    onClick={handleWishlist}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Add to Wishlist"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                )}
                
                {showQuickAdd && product.inStock && (
                  <Button
                    onClick={handleQuickAdd}
                    size="sm"
                    variant="primary"
                    className="flex items-center"
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Featured variant for hero sections
  if (variant === 'featured') {
    return (
      <div className={cn(
        'bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden',
        className
      )}>
        <Link to={`/shop/products/${product.id}`} className="block">
          <div className="aspect-[4/3] relative overflow-hidden">
            {mainImage && (
              <img
                src={mainImage.url}
                alt={mainImage.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            )}
            
            {onSale && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1.5 rounded-lg font-semibold shadow-lg">
                SAVE {discountPercentage}%
              </div>
            )}
            
            {product.featured && (
              <div className="absolute top-4 right-4 bg-sanctuary-600 text-white px-3 py-1.5 rounded-lg font-semibold shadow-lg">
                <Star className="w-4 h-4 inline mr-1" />
                Featured
              </div>
            )}
            
            {!product.inStock && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <div className="text-white text-center">
                  <Tag className="w-8 h-8 mx-auto mb-2" />
                  <span className="font-semibold text-lg">Out of Stock</span>
                </div>
              </div>
            )}
          </div>
        </Link>
        
        <div className="p-6">
          <Link to={`/shop/products/${product.id}`}>
            <h3 className="font-bold text-xl text-gray-900 hover:text-sanctuary-600 transition-colors mb-2">
              {product.name}
            </h3>
            <p className="text-gray-600 mb-4 line-clamp-3">
              {product.shortDescription}
            </p>
          </Link>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {onSale && (
                <span className="text-lg text-gray-500 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
              <span className="font-bold text-2xl text-sanctuary-600">
                {formatPrice(currentPrice)}
              </span>
            </div>
            
            {product.tags.slice(0, 2).map(tag => (
              <span
                key={tag}
                className="bg-sanctuary-100 text-sanctuary-700 px-2 py-1 rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center space-x-3">
            {showQuickAdd && product.inStock && (
              <Button
                onClick={handleQuickAdd}
                variant="primary"
                size="lg"
                className="flex-1 flex items-center justify-center"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
            )}
            
            {showWishlist && (
              <button
                onClick={handleWishlist}
                className="p-3 border border-gray-300 rounded-lg text-gray-600 hover:text-red-500 hover:border-red-300 transition-colors"
                title="Add to Wishlist"
              >
                <Heart className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div className={cn(
      'bg-white rounded-lg border border-gray-200 hover:border-sanctuary-300 hover:shadow-lg transition-all duration-200 overflow-hidden group',
      className
    )}>
      <Link to={`/shop/products/${product.id}`} className="block">
        <div className="aspect-square relative overflow-hidden">
          {mainImage && (
            <img
              src={mainImage.url}
              alt={mainImage.alt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
          
          {onSale && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
              -{discountPercentage}%
            </div>
          )}
          
          {product.featured && (
            <div className="absolute top-3 right-3 bg-sanctuary-600 text-white px-2 py-1 rounded-md text-sm font-semibold">
              Featured
            </div>
          )}
          
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
          
          {/* Hover overlay with quick actions */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex space-x-2">
              <button
                onClick={handleWishlist}
                className="p-2 bg-white rounded-full text-gray-600 hover:text-red-500 transition-colors shadow-lg"
                title="Add to Wishlist"
              >
                <Heart className="w-4 h-4" />
              </button>
              <button
                className="p-2 bg-white rounded-full text-gray-600 hover:text-sanctuary-600 transition-colors shadow-lg"
                title="Quick View"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/shop/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 hover:text-sanctuary-600 transition-colors mb-2 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.shortDescription}
          </p>
        </Link>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {onSale && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
            )}
            <span className="font-bold text-lg text-sanctuary-600">
              {formatPrice(currentPrice)}
            </span>
          </div>
          
          {product.tags.length > 0 && (
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
              {product.tags[0]}
            </span>
          )}
        </div>
        
        {showQuickAdd && product.inStock && (
          <Button
            onClick={handleQuickAdd}
            variant="primary"
            size="sm"
            className="w-full flex items-center justify-center"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        )}
        
        {!product.inStock && (
          <Button
            disabled
            variant="secondary"
            size="sm"
            className="w-full"
          >
            Out of Stock
          </Button>
        )}
      </div>
    </div>
  )
}