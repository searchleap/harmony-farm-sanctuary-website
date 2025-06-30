// MiniCart Component - Header cart icon with item count
// Task 13: Phase 2 - Shopping Cart Components

import React from 'react'
import { ShoppingBag, ShoppingCart } from 'lucide-react'
import { ShoppingCart as CartType } from '../../types/store'
import { formatPrice, getCartItemCount } from '../../utils/store'
import { Button } from '../ui'
import { cn } from '../../utils/cn'

interface MiniCartProps {
  cart: CartType
  variant?: 'default' | 'icon-only' | 'badge' | 'dropdown'
  showPreview?: boolean
  onToggleCart?: () => void
  onViewCart?: () => void
  onCheckout?: () => void
  className?: string
}

export function MiniCart({
  cart,
  variant = 'default',
  showPreview = false,
  onToggleCart,
  onViewCart,
  onCheckout,
  className
}: MiniCartProps) {
  const [showDropdown, setShowDropdown] = React.useState(false)
  const itemCount = getCartItemCount(cart)
  
  console.log('🛍️ MiniCart rendered:', { 
    itemCount, 
    total: cart.total,
    variant,
    showPreview 
  })

  const handleToggle = () => {
    if (onToggleCart) {
      onToggleCart()
    } else {
      setShowDropdown(!showDropdown)
    }
  }

  const handleViewCart = () => {
    if (onViewCart) {
      onViewCart()
    }
    setShowDropdown(false)
  }

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout()
    }
    setShowDropdown(false)
  }

  // Icon-only variant for minimal header
  if (variant === 'icon-only') {
    return (
      <button
        onClick={handleToggle}
        className={cn(
          'relative p-2 text-gray-600 hover:text-sanctuary-600 transition-colors',
          className
        )}
        aria-label={`Shopping cart with ${itemCount} items`}
      >
        <ShoppingBag className="w-6 h-6" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-sanctuary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {itemCount > 9 ? '9+' : itemCount}
          </span>
        )}
      </button>
    )
  }

  // Badge variant with text
  if (variant === 'badge') {
    return (
      <button
        onClick={handleToggle}
        className={cn(
          'flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:border-sanctuary-300 hover:shadow-sm transition-all',
          className
        )}
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 text-gray-600" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-sanctuary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {itemCount > 9 ? '9+' : itemCount}
            </span>
          )}
        </div>
        <div className="text-sm">
          <div className="font-medium text-gray-900">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </div>
          {cart.total > 0 && (
            <div className="text-sanctuary-600 font-semibold">
              {formatPrice(cart.total)}
            </div>
          )}
        </div>
      </button>
    )
  }

  // Dropdown variant with preview
  if (variant === 'dropdown') {
    return (
      <div className={cn('relative', className)}>
        <button
          onClick={handleToggle}
          onMouseEnter={() => showPreview && setShowDropdown(true)}
          onMouseLeave={() => showPreview && setShowDropdown(false)}
          className="relative p-2 text-gray-600 hover:text-sanctuary-600 transition-colors"
          aria-label={`Shopping cart with ${itemCount} items`}
        >
          <ShoppingBag className="w-6 h-6" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-sanctuary-600 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
              {itemCount > 9 ? '9+' : itemCount}
            </span>
          )}
        </button>

        {/* Dropdown Preview */}
        {showDropdown && itemCount > 0 && (
          <div 
            className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Shopping Cart</h3>
                <span className="text-sm text-gray-500">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </span>
              </div>
              
              {/* Cart Items Preview */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cart.items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
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
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                        {item.product?.name || 'Product'}
                      </h4>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                        <span className="text-sm font-semibold text-sanctuary-600">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {cart.items.length > 3 && (
                  <div className="text-center text-sm text-gray-500 py-2">
                    +{cart.items.length - 3} more items
                  </div>
                )}
              </div>
              
              {/* Total and Actions */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-gray-900">Total:</span>
                  <span className="text-lg font-bold text-sanctuary-600">
                    {formatPrice(cart.total)}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <Button
                    onClick={handleViewCart}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    View Cart
                  </Button>
                  <Button
                    onClick={handleCheckout}
                    variant="primary"
                    size="sm"
                    className="w-full"
                  >
                    Checkout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Empty cart message */}
        {showDropdown && itemCount === 0 && (
          <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-4 text-center">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Your cart is empty</p>
          </div>
        )}
      </div>
    )
  }

  // Default variant
  return (
    <button
      onClick={handleToggle}
      className={cn(
        'flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-sanctuary-300 hover:shadow-md transition-all',
        className
      )}
    >
      <div className="relative">
        <ShoppingBag className="w-5 h-5 text-gray-600" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 w-5 h-5 bg-sanctuary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {itemCount > 9 ? '9+' : itemCount}
          </span>
        )}
      </div>
      
      <div className="flex flex-col items-start">
        <span className="text-xs text-gray-500 leading-none">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </span>
        <span className="text-sm font-semibold text-gray-900 leading-none">
          {cart.total > 0 ? formatPrice(cart.total) : 'Empty'}
        </span>
      </div>
    </button>
  )
}