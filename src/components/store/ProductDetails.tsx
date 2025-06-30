// ProductDetails Component - Comprehensive product information display
// Task 13: Phase 2 - Product Display Components

import React, { useState } from 'react'
import { Star, Truck, Shield, RefreshCw, Package, Heart, Share2, Tag, Info } from 'lucide-react'
import { Product } from '../../types/store'
import { formatPrice, getProductPrice, isProductOnSale, getProductDiscountPercentage } from '../../utils/store'
import { Button } from '../ui'
import { cn } from '../../utils/cn'

interface ProductDetailsProps {
  product: Product
  variant?: 'default' | 'compact' | 'sidebar'
  showShipping?: boolean
  showReturns?: boolean
  showReviews?: boolean
  onAddToCart?: (productId: string, variantId?: string, quantity?: number) => void
  onAddToWishlist?: (productId: string) => void
  className?: string
}

export function ProductDetails({
  product,
  variant = 'default',
  showShipping = true,
  showReturns = true,
  showReviews = true,
  onAddToCart,
  onAddToWishlist,
  className
}: ProductDetailsProps) {
  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: string }>({})
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'shipping' | 'reviews'>('description')

  console.log('📋 ProductDetails rendered:', { 
    productId: product.id, 
    variant, 
    selectedVariants,
    quantity 
  })

  const currentPrice = getProductPrice(product)
  const onSale = isProductOnSale(product)
  const discountPercentage = onSale ? getProductDiscountPercentage(product) : 0

  // Group variants by type
  const variantGroups = product.variants.reduce((groups, variant) => {
    if (!groups[variant.type]) {
      groups[variant.type] = []
    }
    groups[variant.type].push(variant)
    return groups
  }, {} as Record<string, typeof product.variants>)

  const handleVariantChange = (variantType: string, variantId: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantType]: variantId
    }))
    console.log('🎛️ Variant changed:', { variantType, variantId })
  }

  const handleAddToCart = () => {
    if (onAddToCart) {
      const variantId = Object.values(selectedVariants)[0] // For simplicity, use first variant
      onAddToCart(product.id, variantId, quantity)
      console.log('🛒 Added to cart:', { productId: product.id, variantId, quantity })
    }
  }

  const handleAddToWishlist = () => {
    if (onAddToWishlist) {
      onAddToWishlist(product.id)
      console.log('❤️ Added to wishlist:', product.id)
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity)
    }
  }

  // Compact variant for smaller spaces
  if (variant === 'compact') {
    return (
      <div className={cn('space-y-4', className)}>
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <p className="text-gray-600 text-sm">{product.shortDescription}</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {onSale && (
            <span className="text-lg text-gray-500 line-through">
              {formatPrice(product.price)}
            </span>
          )}
          <span className="text-2xl font-bold text-sanctuary-600">
            {formatPrice(currentPrice)}
          </span>
          {onSale && (
            <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-medium">
              Save {discountPercentage}%
            </span>
          )}
        </div>
        
        {product.inStock ? (
          <Button
            onClick={handleAddToCart}
            variant="primary"
            size="lg"
            className="w-full"
          >
            Add to Cart
          </Button>
        ) : (
          <Button variant="secondary" size="lg" className="w-full" disabled>
            Out of Stock
          </Button>
        )}
      </div>
    )
  }

  // Sidebar variant
  if (variant === 'sidebar') {
    return (
      <div className={cn('space-y-6', className)}>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h1>
          <p className="text-gray-600">{product.shortDescription}</p>
        </div>
        
        {/* Price */}
        <div className="flex items-center space-x-3">
          {onSale && (
            <span className="text-xl text-gray-500 line-through">
              {formatPrice(product.price)}
            </span>
          )}
          <span className="text-3xl font-bold text-sanctuary-600">
            {formatPrice(currentPrice)}
          </span>
          {onSale && (
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-lg font-medium">
              Save {discountPercentage}%
            </span>
          )}
        </div>
        
        {/* Variants */}
        {Object.entries(variantGroups).map(([type, variants]) => (
          <div key={type}>
            <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
              {type}
            </label>
            <div className="flex flex-wrap gap-2">
              {variants.map(variant => (
                <button
                  key={variant.id}
                  onClick={() => handleVariantChange(type, variant.id)}
                  className={cn(
                    'px-3 py-2 border rounded-lg text-sm font-medium transition-colors',
                    selectedVariants[type] === variant.id
                      ? 'border-sanctuary-500 bg-sanctuary-50 text-sanctuary-700'
                      : 'border-gray-300 hover:border-sanctuary-300'
                  )}
                  disabled={!variant.isAvailable}
                >
                  {variant.name}
                </button>
              ))}
            </div>
          </div>
        ))}
        
        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity
          </label>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="p-2 border border-gray-300 rounded-lg hover:border-sanctuary-300"
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="p-2 border border-gray-300 rounded-lg hover:border-sanctuary-300"
              disabled={quantity >= 10}
            >
              +
            </button>
          </div>
        </div>
        
        {/* Actions */}
        <div className="space-y-3">
          {product.inStock ? (
            <Button
              onClick={handleAddToCart}
              variant="primary"
              size="lg"
              className="w-full"
            >
              Add to Cart - {formatPrice(currentPrice * quantity)}
            </Button>
          ) : (
            <Button variant="secondary" size="lg" className="w-full" disabled>
              Out of Stock
            </Button>
          )}
          
          <div className="flex space-x-3">
            <Button
              onClick={handleAddToWishlist}
              variant="outline"
              size="md"
              className="flex-1"
            >
              <Heart className="w-4 h-4 mr-2" />
              Wishlist
            </Button>
            <Button variant="outline" size="md" className="flex-1">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Default variant - full featured display
  return (
    <div className={cn('space-y-8', className)}>
      {/* Header */}
      <div>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-lg text-gray-600">{product.shortDescription}</p>
          </div>
          
          {product.featured && (
            <span className="bg-sanctuary-100 text-sanctuary-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
              <Star className="w-4 h-4 mr-1" />
              Featured
            </span>
          )}
        </div>
        
        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {product.tags.slice(0, 4).map(tag => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Price */}
      <div className="flex items-center space-x-4">
        {onSale && (
          <span className="text-2xl text-gray-500 line-through">
            {formatPrice(product.price)}
          </span>
        )}
        <span className="text-4xl font-bold text-sanctuary-600">
          {formatPrice(currentPrice)}
        </span>
        {onSale && (
          <span className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-semibold">
            Save {discountPercentage}%
          </span>
        )}
      </div>
      
      {/* Variants */}
      {Object.entries(variantGroups).map(([type, variants]) => (
        <div key={type}>
          <label className="block text-lg font-medium text-gray-700 mb-3 capitalize">
            Choose {type}
          </label>
          <div className="grid grid-cols-4 gap-3">
            {variants.map(variant => (
              <button
                key={variant.id}
                onClick={() => handleVariantChange(type, variant.id)}
                className={cn(
                  'p-3 border rounded-lg text-center font-medium transition-colors',
                  selectedVariants[type] === variant.id
                    ? 'border-sanctuary-500 bg-sanctuary-50 text-sanctuary-700 ring-2 ring-sanctuary-200'
                    : 'border-gray-300 hover:border-sanctuary-300',
                  !variant.isAvailable && 'opacity-50 cursor-not-allowed'
                )}
                disabled={!variant.isAvailable}
              >
                <div>{variant.name}</div>
                {variant.price && (
                  <div className="text-sm text-gray-500">
                    +{formatPrice(variant.price)}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
      
      {/* Quantity and Actions */}
      <div className="flex items-center space-x-6">
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-3">
            Quantity
          </label>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="w-12 h-12 border border-gray-300 rounded-lg hover:border-sanctuary-300 flex items-center justify-center text-xl font-medium"
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="w-16 text-center text-xl font-medium">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="w-12 h-12 border border-gray-300 rounded-lg hover:border-sanctuary-300 flex items-center justify-center text-xl font-medium"
              disabled={quantity >= 10}
            >
              +
            </button>
          </div>
        </div>
        
        <div className="flex-1 space-y-4">
          {product.inStock ? (
            <Button
              onClick={handleAddToCart}
              variant="primary"
              size="xl"
              className="w-full text-lg"
            >
              Add to Cart - {formatPrice(currentPrice * quantity)}
            </Button>
          ) : (
            <Button variant="secondary" size="xl" className="w-full text-lg" disabled>
              Out of Stock
            </Button>
          )}
          
          <div className="flex space-x-4">
            <Button
              onClick={handleAddToWishlist}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              <Heart className="w-5 h-5 mr-2" />
              Add to Wishlist
            </Button>
            <Button variant="outline" size="lg" className="flex-1">
              <Share2 className="w-5 h-5 mr-2" />
              Share Product
            </Button>
          </div>
        </div>
      </div>
      
      {/* Information Tabs */}
      <div>
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'description', label: 'Description', icon: Info },
              { id: 'details', label: 'Details', icon: Package },
              { id: 'shipping', label: 'Shipping', icon: Truck },
              { id: 'reviews', label: 'Reviews', icon: Star }
            ].map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors',
                    activeTab === tab.id
                      ? 'border-sanctuary-500 text-sanctuary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>
        
        <div className="py-6">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          )}
          
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.materials && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Materials</h4>
                  <ul className="space-y-1">
                    {product.materials.map((material, index) => (
                      <li key={index} className="text-gray-600">{material}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {product.careInstructions && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Care Instructions</h4>
                  <p className="text-gray-600">{product.careInstructions}</p>
                </div>
              )}
              
              {product.dimensions && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Dimensions</h4>
                  <p className="text-gray-600">
                    {product.dimensions.length}" L × {product.dimensions.width}" W × {product.dimensions.height}" H
                  </p>
                </div>
              )}
              
              {product.weight && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Weight</h4>
                  <p className="text-gray-600">{product.weight} lbs</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'shipping' && showShipping && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start space-x-3">
                  <Truck className="w-6 h-6 text-sanctuary-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Free Shipping</h4>
                    <p className="text-sm text-gray-600">On orders over $50</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Package className="w-6 h-6 text-sanctuary-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Fast Processing</h4>
                    <p className="text-sm text-gray-600">Ships within 2-3 business days</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <RefreshCw className="w-6 h-6 text-sanctuary-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Easy Returns</h4>
                    <p className="text-sm text-gray-600">30-day return policy</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'reviews' && showReviews && (
            <div className="space-y-6">
              <div className="text-center py-8">
                <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h4>
                <p className="text-gray-600">Be the first to review this product!</p>
                <Button variant="outline" size="md" className="mt-4">
                  Write a Review
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}