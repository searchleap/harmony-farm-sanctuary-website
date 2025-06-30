// CartSummary Component - Price breakdown and totals
// Task 13: Phase 2 - Shopping Cart Components

import React from 'react'
import { Truck, Gift, Tag, Info, Calculator } from 'lucide-react'
import { ShoppingCart } from '../../types/store'
import { formatPrice, getCartItemCount } from '../../utils/store'
import { Button } from '../ui'
import { cn } from '../../utils/cn'

interface CartSummaryProps {
  cart: ShoppingCart
  variant?: 'default' | 'compact' | 'detailed' | 'checkout'
  showPromoCode?: boolean
  showShippingOptions?: boolean
  showTaxBreakdown?: boolean
  onApplyPromoCode?: (code: string) => void
  onSelectShipping?: (option: string) => void
  onProceedToCheckout?: () => void
  className?: string
}

export function CartSummary({
  cart,
  variant = 'default',
  showPromoCode = true,
  showShippingOptions = false,
  showTaxBreakdown = false,
  onApplyPromoCode,
  onSelectShipping,
  onProceedToCheckout,
  className
}: CartSummaryProps) {
  const [promoCode, setPromoCode] = React.useState('')
  const [selectedShipping, setSelectedShipping] = React.useState('standard')

  console.log('🧾 CartSummary rendered:', { 
    itemCount: cart.items.length,
    total: cart.total,
    variant 
  })

  const itemCount = getCartItemCount(cart)
  const freeShippingThreshold = 50
  const amountForFreeShipping = Math.max(0, freeShippingThreshold - cart.subtotal)
  const qualifiesForFreeShipping = cart.subtotal >= freeShippingThreshold

  const shippingOptions = [
    { id: 'standard', name: 'Standard Shipping', price: 5.99, days: '5-7 business days' },
    { id: 'expedited', name: 'Expedited Shipping', price: 12.99, days: '2-3 business days' },
    { id: 'overnight', name: 'Overnight Shipping', price: 24.99, days: '1 business day' }
  ]

  const handleApplyPromoCode = () => {
    if (onApplyPromoCode && promoCode.trim()) {
      onApplyPromoCode(promoCode.trim())
      console.log('🏷️ Promo code applied:', promoCode)
    }
  }

  const handleShippingChange = (optionId: string) => {
    setSelectedShipping(optionId)
    if (onSelectShipping) {
      onSelectShipping(optionId)
    }
  }

  if (cart.items.length === 0) {
    return null
  }

  // Compact variant for small spaces
  if (variant === 'compact') {
    return (
      <div className={cn('bg-white rounded-lg border border-gray-200 p-4 space-y-3', className)}>
        <h3 className="font-semibold text-gray-900">Order Summary</h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Items ({itemCount})</span>
            <span>{formatPrice(cart.subtotal)}</span>
          </div>
          
          {cart.shipping > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span>{formatPrice(cart.shipping)}</span>
            </div>
          )}
          
          <div className="flex justify-between font-semibold pt-2 border-t border-gray-200">
            <span>Total</span>
            <span className="text-sanctuary-600">{formatPrice(cart.total)}</span>
          </div>
        </div>
        
        {onProceedToCheckout && (
          <Button
            onClick={onProceedToCheckout}
            variant="primary"
            size="md"
            className="w-full"
          >
            Checkout
          </Button>
        )}
      </div>
    )
  }

  // Checkout variant for checkout page
  if (variant === 'checkout') {
    return (
      <div className={cn('bg-gray-50 rounded-lg p-6 space-y-4', className)}>
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Calculator className="w-5 h-5 mr-2" />
          Order Summary
        </h3>
        
        {/* Items breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal ({itemCount} items)</span>
            <span className="font-medium">{formatPrice(cart.subtotal)}</span>
          </div>
          
          {/* Shipping */}
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium">
              {cart.shipping === 0 ? (
                <span className="text-green-600">Free</span>
              ) : (
                formatPrice(cart.shipping)
              )}
            </span>
          </div>
          
          {/* Tax */}
          <div className="flex justify-between">
            <span className="text-gray-600">Tax</span>
            <span className="font-medium">{formatPrice(cart.tax)}</span>
          </div>
          
          {showTaxBreakdown && (
            <div className="ml-4 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Sales Tax (8%)</span>
                <span>{formatPrice(cart.tax)}</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Total */}
        <div className="pt-4 border-t border-gray-300">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-sanctuary-600">
              {formatPrice(cart.total)}
            </span>
          </div>
        </div>
        
        {/* Payment security notice */}
        <div className="bg-green-50 rounded-lg p-3 flex items-start space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-700">
            Your payment information is secure and encrypted
          </p>
        </div>
      </div>
    )
  }

  // Detailed variant with all features
  if (variant === 'detailed') {
    return (
      <div className={cn('bg-white rounded-lg border border-gray-200 shadow-sm', className)}>
        <div className="p-6 space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">Order Summary</h3>
          
          {/* Items */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal ({itemCount} items)</span>
              <span className="text-lg font-semibold">{formatPrice(cart.subtotal)}</span>
            </div>
            
            {/* Free shipping progress */}
            {!qualifiesForFreeShipping && amountForFreeShipping > 0 && (
              <div className="bg-sanctuary-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-sanctuary-700">
                    Free shipping at ${freeShippingThreshold}
                  </span>
                  <span className="text-sm text-sanctuary-600">
                    Add {formatPrice(amountForFreeShipping)} more
                  </span>
                </div>
                <div className="w-full bg-sanctuary-200 rounded-full h-2">
                  <div 
                    className="bg-sanctuary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((cart.subtotal / freeShippingThreshold) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
            
            {qualifiesForFreeShipping && (
              <div className="bg-green-50 rounded-lg p-3 flex items-center space-x-2">
                <Truck className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  You qualify for free shipping!
                </span>
              </div>
            )}
          </div>
          
          {/* Shipping Options */}
          {showShippingOptions && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Shipping Options</h4>
              <div className="space-y-2">
                {shippingOptions.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-sanctuary-300 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="shipping"
                        value={option.id}
                        checked={selectedShipping === option.id}
                        onChange={() => handleShippingChange(option.id)}
                        className="text-sanctuary-600 focus:ring-sanctuary-500"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{option.name}</div>
                        <div className="text-sm text-gray-500">{option.days}</div>
                      </div>
                    </div>
                    <span className="font-medium">
                      {qualifiesForFreeShipping && option.id === 'standard' 
                        ? 'Free' 
                        : formatPrice(option.price)
                      }
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
          
          {/* Promo Code */}
          {showPromoCode && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 flex items-center">
                <Tag className="w-4 h-4 mr-2" />
                Promo Code
              </h4>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter promo code"
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-sanctuary-500 focus:border-sanctuary-500"
                />
                <Button
                  onClick={handleApplyPromoCode}
                  variant="outline"
                  size="md"
                  disabled={!promoCode.trim()}
                >
                  Apply
                </Button>
              </div>
            </div>
          )}
          
          {/* Cost Breakdown */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatPrice(cart.subtotal)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span>
                {cart.shipping === 0 ? (
                  <span className="text-green-600 font-medium">Free</span>
                ) : (
                  formatPrice(cart.shipping)
                )}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span>{formatPrice(cart.tax)}</span>
            </div>
            
            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-sanctuary-600">
                {formatPrice(cart.total)}
              </span>
            </div>
          </div>
          
          {/* Checkout Button */}
          {onProceedToCheckout && (
            <Button
              onClick={onProceedToCheckout}
              variant="primary"
              size="xl"
              className="w-full"
            >
              Proceed to Checkout
            </Button>
          )}
          
          {/* Trust signals */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span>Secure checkout</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span>30-day return policy</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span>Ships within 2-3 business days</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 p-6 space-y-4', className)}>
      <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal ({itemCount} items)</span>
          <span className="font-medium">{formatPrice(cart.subtotal)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">
            {cart.shipping === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              formatPrice(cart.shipping)
            )}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Tax</span>
          <span className="font-medium">{formatPrice(cart.tax)}</span>
        </div>
        
        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <span className="text-lg font-semibold text-gray-900">Total</span>
          <span className="text-xl font-bold text-sanctuary-600">
            {formatPrice(cart.total)}
          </span>
        </div>
      </div>
      
      {/* Free shipping notice */}
      {!qualifiesForFreeShipping && amountForFreeShipping > 0 && (
        <div className="bg-sanctuary-50 rounded-lg p-3">
          <p className="text-sm text-sanctuary-700">
            Add {formatPrice(amountForFreeShipping)} more for free shipping
          </p>
        </div>
      )}
      
      {onProceedToCheckout && (
        <Button
          onClick={onProceedToCheckout}
          variant="primary"
          size="lg"
          className="w-full"
        >
          Proceed to Checkout
        </Button>
      )}
    </div>
  )
}