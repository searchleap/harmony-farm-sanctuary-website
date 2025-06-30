// CartItem Component - Individual cart item with quantity controls
// Task 13: Phase 2 - Shopping Cart Components

import React from 'react'
import { Link } from 'react-router-dom'
import { Plus, Minus, Trash2, Heart, ShoppingBag } from 'lucide-react'
import { CartItem as CartItemType } from '../../types/store'
import { formatPrice } from '../../utils/store'
import { Button } from '../ui'
import { cn } from '../../utils/cn'

interface CartItemProps {
  item: CartItemType
  variant?: 'default' | 'compact' | 'detailed' | 'checkout'
  showRemove?: boolean
  showMoveToWishlist?: boolean
  onUpdateQuantity?: (itemId: string, quantity: number) => void
  onRemove?: (itemId: string) => void
  onMoveToWishlist?: (itemId: string) => void
  className?: string
}

export function CartItem({
  item,
  variant = 'default',
  showRemove = true,
  showMoveToWishlist = false,
  onUpdateQuantity,
  onRemove,
  onMoveToWishlist,
  className
}: CartItemProps) {
  console.log('🛍️ CartItem rendered:', { 
    itemId: item.id, 
    quantity: item.quantity,
    variant 
  })

  const itemTotal = item.price * item.quantity
  const productUrl = item.product ? `/shop/products/${item.product.id}` : '#'

  const handleQuantityChange = (newQuantity: number) => {
    if (onUpdateQuantity) {
      onUpdateQuantity(item.id, newQuantity)
      console.log('📊 Quantity updated:', { itemId: item.id, newQuantity })
    }
  }

  const handleRemove = () => {
    if (onRemove) {
      onRemove(item.id)
      console.log('🗑️ Item removed:', item.id)
    }
  }

  const handleMoveToWishlist = () => {
    if (onMoveToWishlist) {
      onMoveToWishlist(item.id)
      console.log('❤️ Moved to wishlist:', item.id)
    }
  }

  // Compact variant for small spaces
  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200', className)}>
        {/* Product Image */}
        <Link to={productUrl} className="flex-shrink-0">
          <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100">
            {item.product?.images?.[0] ? (
              <img
                src={item.product.images[0].url}
                alt={item.product.images[0].alt}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-gray-400" />
              </div>
            )}
          </div>
        </Link>
        
        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <Link to={productUrl}>
            <h4 className="text-sm font-medium text-gray-900 line-clamp-1 hover:text-sanctuary-600 transition-colors">
              {item.product?.name || 'Product'}
            </h4>
          </Link>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
            <span className="text-sm font-semibold text-sanctuary-600">
              {formatPrice(itemTotal)}
            </span>
          </div>
        </div>
        
        {/* Remove Button */}
        {showRemove && onRemove && (
          <button
            onClick={handleRemove}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            title="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    )
  }

  // Checkout variant for checkout page
  if (variant === 'checkout') {
    return (
      <div className={cn('flex items-start space-x-4 p-4 border-b border-gray-200', className)}>
        {/* Product Image */}
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          {item.product?.images?.[0] ? (
            <img
              src={item.product.images[0].url}
              alt={item.product.images[0].alt}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>
        
        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 mb-1">
            {item.product?.name || 'Product'}
          </h4>
          
          {item.variant && (
            <p className="text-sm text-gray-500 mb-2">
              {item.variant.name}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Quantity: {item.quantity}
            </span>
            <div className="text-right">
              <div className="font-semibold text-gray-900">
                {formatPrice(itemTotal)}
              </div>
              {item.quantity > 1 && (
                <div className="text-sm text-gray-500">
                  {formatPrice(item.price)} each
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Detailed variant with all features
  if (variant === 'detailed') {
    return (
      <div className={cn('bg-white rounded-lg border border-gray-200 hover:border-sanctuary-300 hover:shadow-md transition-all', className)}>
        <div className="flex p-4 space-x-4">
          {/* Product Image */}
          <Link to={productUrl} className="flex-shrink-0">
            <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
              {item.product?.images?.[0] ? (
                <img
                  src={item.product.images[0].url}
                  alt={item.product.images[0].alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
          </Link>
          
          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <Link to={productUrl}>
              <h4 className="text-lg font-semibold text-gray-900 hover:text-sanctuary-600 transition-colors mb-1">
                {item.product?.name || 'Product'}
              </h4>
            </Link>
            
            {item.product?.shortDescription && (
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {item.product.shortDescription}
              </p>
            )}
            
            {item.variant && (
              <div className="flex items-center space-x-4 mb-3">
                <span className="text-sm text-gray-500">
                  {item.variant.name}
                </span>
              </div>
            )}
            
            {/* Quantity and Price */}
            <div className="flex items-center justify-between">
              {/* Quantity Controls */}
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(item.quantity - 1)}
                    className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item.quantity + 1)}
                    className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    disabled={item.quantity >= 10}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Price */}
              <div className="text-right">
                <div className="text-xl font-bold text-sanctuary-600">
                  {formatPrice(itemTotal)}
                </div>
                {item.quantity > 1 && (
                  <div className="text-sm text-gray-500">
                    {formatPrice(item.price)} each
                  </div>
                )}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-gray-100">
              {showMoveToWishlist && onMoveToWishlist && (
                <button
                  onClick={handleMoveToWishlist}
                  className="flex items-center text-sm text-gray-600 hover:text-sanctuary-600 transition-colors"
                >
                  <Heart className="w-4 h-4 mr-1" />
                  Move to Wishlist
                </button>
              )}
              
              {showRemove && onRemove && (
                <button
                  onClick={handleRemove}
                  className="flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div className={cn('flex items-start space-x-4 py-4 border-b border-gray-200 last:border-b-0', className)}>
      {/* Product Image */}
      <Link to={productUrl} className="flex-shrink-0">
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
          {item.product?.images?.[0] ? (
            <img
              src={item.product.images[0].url}
              alt={item.product.images[0].alt}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>
      </Link>
      
      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <Link to={productUrl}>
          <h4 className="font-medium text-gray-900 hover:text-sanctuary-600 transition-colors mb-1">
            {item.product?.name || 'Product'}
          </h4>
        </Link>
        
        {item.variant && (
          <p className="text-sm text-gray-500 mb-2">
            {item.variant.name}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Qty:</span>
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                className="p-1 hover:bg-gray-100 transition-colors disabled:opacity-50"
                disabled={item.quantity <= 1}
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="px-3 py-1 text-sm font-medium min-w-[2.5rem] text-center">
                {item.quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                className="p-1 hover:bg-gray-100 transition-colors disabled:opacity-50"
                disabled={item.quantity >= 10}
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
          
          {/* Price and Actions */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="font-semibold text-sanctuary-600">
                {formatPrice(itemTotal)}
              </div>
              {item.quantity > 1 && (
                <div className="text-xs text-gray-500">
                  {formatPrice(item.price)} each
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {showMoveToWishlist && onMoveToWishlist && (
                <button
                  onClick={handleMoveToWishlist}
                  className="p-1 text-gray-400 hover:text-sanctuary-600 transition-colors"
                  title="Move to wishlist"
                >
                  <Heart className="w-4 h-4" />
                </button>
              )}
              
              {showRemove && onRemove && (
                <button
                  onClick={handleRemove}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}