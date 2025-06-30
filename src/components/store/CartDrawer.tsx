// CartDrawer Component - Slide-out cart with item management
// Task 13: Phase 2 - Shopping Cart Components

import React from 'react'
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import { ShoppingCart, CartItem } from '../../types/store'
import { formatPrice, getCartItemCount } from '../../utils/store'
import { Button } from '../ui'
import { cn } from '../../utils/cn'

interface CartDrawerProps {
  cart: ShoppingCart
  isOpen: boolean
  onClose: () => void
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  onClearCart: () => void
  onCheckout: () => void
  variant?: 'default' | 'compact' | 'modal'
  className?: string
}

export function CartDrawer({
  cart,
  isOpen,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  variant = 'default',
  className
}: CartDrawerProps) {
  console.log('🛒 CartDrawer rendered:', { 
    isOpen, 
    itemCount: cart.items.length,
    total: cart.total,
    variant 
  })

  const itemCount = getCartItemCount(cart)

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      onRemoveItem(itemId)
    } else {
      onUpdateQuantity(itemId, newQuantity)
    }
    console.log('📊 Quantity changed:', { itemId, newQuantity })
  }

  const handleRemoveItem = (itemId: string) => {
    onRemoveItem(itemId)
    console.log('🗑️ Item removed:', itemId)
  }

  const handleCheckout = () => {
    onCheckout()
    onClose()
    console.log('💳 Proceeding to checkout')
  }

  // Modal variant
  if (variant === 'modal') {
    if (!isOpen) return null

    return (
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="relative max-w-lg w-full h-full ml-auto bg-white shadow-xl">
          <CartContent 
            cart={cart}
            itemCount={itemCount}
            onClose={onClose}
            onUpdateQuantity={handleQuantityChange}
            onRemoveItem={handleRemoveItem}
            onClearCart={onClearCart}
            onCheckout={handleCheckout}
            variant={variant}
          />
        </div>
      </div>
    )
  }

  // Compact variant for smaller spaces
  if (variant === 'compact') {
    if (!isOpen) return null

    return (
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="relative max-w-sm w-full h-full ml-auto bg-white shadow-xl">
          <CartContent 
            cart={cart}
            itemCount={itemCount}
            onClose={onClose}
            onUpdateQuantity={handleQuantityChange}
            onRemoveItem={handleRemoveItem}
            onClearCart={onClearCart}
            onCheckout={handleCheckout}
            variant={variant}
          />
        </div>
      </div>
    )
  }

  // Default slide-out drawer
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div className={cn(
        'fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : 'translate-x-full',
        className
      )}>
        <CartContent 
          cart={cart}
          itemCount={itemCount}
          onClose={onClose}
          onUpdateQuantity={handleQuantityChange}
          onRemoveItem={handleRemoveItem}
          onClearCart={onClearCart}
          onCheckout={handleCheckout}
          variant={variant}
        />
      </div>
    </>
  )
}

// Shared cart content component
function CartContent({
  cart,
  itemCount,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  variant
}: {
  cart: ShoppingCart
  itemCount: number
  onClose: () => void
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  onClearCart: () => void
  onCheckout: () => void
  variant: 'default' | 'compact' | 'modal'
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <ShoppingBag className="w-5 h-5 text-sanctuary-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Shopping Cart
            {itemCount > 0 && (
              <span className="ml-2 text-sm text-gray-500">
                ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </span>
            )}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close cart"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto">
        {cart.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">Add some sanctuary merchandise to get started!</p>
            <Button onClick={onClose} variant="outline" size="md">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {cart.items.map((item) => (
              <CartItemComponent
                key={item.id}
                item={item}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemoveItem}
                variant={variant}
              />
            ))}
            
            {/* Clear cart button */}
            {cart.items.length > 1 && (
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={onClearCart}
                  className="w-full text-sm text-red-600 hover:text-red-700 transition-colors"
                >
                  Clear entire cart
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer with totals and checkout */}
      {cart.items.length > 0 && (
        <div className="border-t border-gray-200 p-4 space-y-4">
          {/* Order summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatPrice(cart.subtotal)}</span>
            </div>
            
            {cart.shipping > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">{formatPrice(cart.shipping)}</span>
              </div>
            )}
            
            {cart.shipping === 0 && cart.subtotal >= 50 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">Free!</span>
              </div>
            )}
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">{formatPrice(cart.tax)}</span>
            </div>
            
            <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
              <span>Total</span>
              <span className="text-sanctuary-600">{formatPrice(cart.total)}</span>
            </div>
          </div>
          
          {/* Free shipping progress */}
          {cart.subtotal < 50 && (
            <div className="bg-sanctuary-50 rounded-lg p-3">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-sanctuary-700">Free shipping at $50</span>
                <span className="text-sanctuary-600 font-medium">
                  {formatPrice(50 - cart.subtotal)} to go
                </span>
              </div>
              <div className="w-full bg-sanctuary-200 rounded-full h-2">
                <div 
                  className="bg-sanctuary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((cart.subtotal / 50) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
          
          {/* Checkout button */}
          <Button
            onClick={onCheckout}
            variant="primary"
            size="lg"
            className="w-full flex items-center justify-center"
          >
            Checkout
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <button
            onClick={onClose}
            className="w-full text-sm text-gray-600 hover:text-gray-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  )
}

// Individual cart item component
function CartItemComponent({
  item,
  onUpdateQuantity,
  onRemove,
  variant
}: {
  item: CartItem
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemove: (itemId: string) => void
  variant: 'default' | 'compact' | 'modal'
}) {
  const isCompact = variant === 'compact'

  return (
    <div className="flex space-x-3 py-3 border-b border-gray-100 last:border-b-0">
      {/* Product Image */}
      <div className={cn(
        'flex-shrink-0 rounded-lg overflow-hidden bg-gray-100',
        isCompact ? 'w-16 h-16' : 'w-20 h-20'
      )}>
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
        <h4 className={cn(
          'font-medium text-gray-900 line-clamp-2',
          isCompact ? 'text-sm' : 'text-base'
        )}>
          {item.product?.name || 'Product'}
        </h4>
        
        {item.variant && (
          <p className="text-sm text-gray-500 mt-1">
            {item.variant.name}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-3">
            {/* Quantity Controls */}
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                className="p-1 hover:bg-gray-100 transition-colors"
                disabled={item.quantity <= 1}
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="px-2 py-1 text-sm font-medium min-w-[2rem] text-center">
                {item.quantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="p-1 hover:bg-gray-100 transition-colors"
                disabled={item.quantity >= 10}
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            
            {/* Remove Button */}
            <button
              onClick={() => onRemove(item.id)}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Remove item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          
          {/* Price */}
          <div className="text-right">
            <div className={cn(
              'font-semibold text-sanctuary-600',
              isCompact ? 'text-sm' : 'text-base'
            )}>
              {formatPrice(item.price * item.quantity)}
            </div>
            {item.quantity > 1 && (
              <div className="text-xs text-gray-500">
                {formatPrice(item.price)} each
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}