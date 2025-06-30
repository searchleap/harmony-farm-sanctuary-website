// ProductVariants Component - Size, color, style selection interface
// Task 13: Phase 2 - Product Display Components

import React from 'react'
import { Check, X } from 'lucide-react'
import { ProductVariant, VariantType } from '../../types/store'
import { formatPrice } from '../../utils/store'
import { cn } from '../../utils/cn'

interface ProductVariantsProps {
  variants: ProductVariant[]
  selectedVariants: { [key: string]: string }
  onVariantChange: (variantType: string, variantId: string) => void
  variant?: 'default' | 'compact' | 'inline' | 'grid'
  showPricing?: boolean
  showStock?: boolean
  className?: string
}

export function ProductVariants({
  variants,
  selectedVariants,
  onVariantChange,
  variant = 'default',
  showPricing = true,
  showStock = false,
  className
}: ProductVariantsProps) {
  console.log('🎛️ ProductVariants rendered:', { 
    variantsCount: variants.length, 
    selectedVariants,
    variant 
  })

  // Group variants by type
  const variantGroups = variants.reduce((groups, variant) => {
    if (!groups[variant.type]) {
      groups[variant.type] = []
    }
    groups[variant.type].push(variant)
    return groups
  }, {} as Record<string, ProductVariant[]>)

  const handleVariantSelect = (variantType: string, variantId: string) => {
    onVariantChange(variantType, variantId)
    console.log('🔄 Variant selected:', { variantType, variantId })
  }

  const getVariantTypeLabel = (type: VariantType): string => {
    switch (type) {
      case 'size': return 'Size'
      case 'color': return 'Color'
      case 'style': return 'Style'
      case 'material': return 'Material'
      default: return type.charAt(0).toUpperCase() + type.slice(1)
    }
  }

  if (variants.length === 0) {
    return null
  }

  // Compact variant for minimal space
  if (variant === 'compact') {
    return (
      <div className={cn('space-y-3', className)}>
        {Object.entries(variantGroups).map(([type, groupVariants]) => (
          <div key={type}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {getVariantTypeLabel(type as VariantType)}
            </label>
            <select
              value={selectedVariants[type] || ''}
              onChange={(e) => handleVariantSelect(type, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-sanctuary-500 focus:border-sanctuary-500"
            >
              <option value="">Choose {type}</option>
              {groupVariants.map(variant => (
                <option
                  key={variant.id}
                  value={variant.id}
                  disabled={!variant.isAvailable}
                >
                  {variant.name}
                  {showPricing && variant.price && ` (+${formatPrice(variant.price)})`}
                  {!variant.isAvailable && ' (Out of Stock)'}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    )
  }

  // Inline variant for horizontal layout
  if (variant === 'inline') {
    return (
      <div className={cn('flex flex-wrap items-center gap-6', className)}>
        {Object.entries(variantGroups).map(([type, groupVariants]) => (
          <div key={type} className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700 min-w-0">
              {getVariantTypeLabel(type as VariantType)}:
            </span>
            <div className="flex space-x-2">
              {groupVariants.map(variant => {
                const isSelected = selectedVariants[type] === variant.id
                return (
                  <button
                    key={variant.id}
                    onClick={() => handleVariantSelect(type, variant.id)}
                    className={cn(
                      'px-3 py-1 text-sm border rounded-md transition-colors',
                      isSelected
                        ? 'border-sanctuary-500 bg-sanctuary-50 text-sanctuary-700'
                        : 'border-gray-300 hover:border-sanctuary-300',
                      !variant.isAvailable && 'opacity-50 cursor-not-allowed'
                    )}
                    disabled={!variant.isAvailable}
                    title={
                      !variant.isAvailable 
                        ? 'Out of stock' 
                        : variant.price 
                        ? `+${formatPrice(variant.price)}` 
                        : undefined
                    }
                  >
                    {variant.name}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Grid variant for card-like selection
  if (variant === 'grid') {
    return (
      <div className={cn('space-y-6', className)}>
        {Object.entries(variantGroups).map(([type, groupVariants]) => (
          <div key={type}>
            <label className="block text-lg font-medium text-gray-700 mb-3">
              {getVariantTypeLabel(type as VariantType)}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {groupVariants.map(variant => {
                const isSelected = selectedVariants[type] === variant.id
                return (
                  <button
                    key={variant.id}
                    onClick={() => handleVariantSelect(type, variant.id)}
                    className={cn(
                      'relative p-4 border rounded-lg text-center transition-all hover:shadow-md',
                      isSelected
                        ? 'border-sanctuary-500 bg-sanctuary-50 ring-2 ring-sanctuary-200'
                        : 'border-gray-300 hover:border-sanctuary-300',
                      !variant.isAvailable && 'opacity-50 cursor-not-allowed'
                    )}
                    disabled={!variant.isAvailable}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-sanctuary-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    
                    {!variant.isAvailable && (
                      <div className="absolute top-2 left-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <X className="w-3 h-3 text-white" />
                      </div>
                    )}
                    
                    <div className="font-medium text-gray-900">{variant.name}</div>
                    
                    {showPricing && variant.price && (
                      <div className="text-sm text-sanctuary-600 mt-1">
                        +{formatPrice(variant.price)}
                      </div>
                    )}
                    
                    {showStock && variant.stockCount !== undefined && (
                      <div className="text-xs text-gray-500 mt-1">
                        {variant.stockCount > 0 
                          ? `${variant.stockCount} in stock`
                          : 'Out of stock'
                        }
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Default variant
  return (
    <div className={cn('space-y-6', className)}>
      {Object.entries(variantGroups).map(([type, groupVariants]) => (
        <div key={type}>
          <label className="block text-lg font-medium text-gray-700 mb-3">
            {getVariantTypeLabel(type as VariantType)}
            {selectedVariants[type] && (
              <span className="ml-2 text-base font-normal text-sanctuary-600">
                ({groupVariants.find(v => v.id === selectedVariants[type])?.name})
              </span>
            )}
          </label>
          
          <div className="flex flex-wrap gap-3">
            {groupVariants.map(variant => {
              const isSelected = selectedVariants[type] === variant.id
              
              return (
                <button
                  key={variant.id}
                  onClick={() => handleVariantSelect(type, variant.id)}
                  className={cn(
                    'relative px-4 py-3 border rounded-lg font-medium transition-all',
                    isSelected
                      ? 'border-sanctuary-500 bg-sanctuary-50 text-sanctuary-700 ring-2 ring-sanctuary-200'
                      : 'border-gray-300 hover:border-sanctuary-300 hover:shadow-sm',
                    !variant.isAvailable && 'opacity-50 cursor-not-allowed bg-gray-50'
                  )}
                  disabled={!variant.isAvailable}
                >
                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-sanctuary-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  {/* Unavailable indicator */}
                  {!variant.isAvailable && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <X className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div className="flex flex-col items-center space-y-1">
                    <span>{variant.name}</span>
                    
                    {showPricing && variant.price && (
                      <span className="text-sm text-sanctuary-600">
                        +{formatPrice(variant.price)}
                      </span>
                    )}
                    
                    {showStock && variant.stockCount !== undefined && (
                      <span className="text-xs text-gray-500">
                        {variant.stockCount > 0 
                          ? `${variant.stockCount} left`
                          : 'Out of stock'
                        }
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
          
          {/* Variant type description */}
          {type === 'size' && (
            <p className="text-sm text-gray-500 mt-2">
              Need help with sizing? Check our size guide.
            </p>
          )}
          
          {type === 'color' && (
            <p className="text-sm text-gray-500 mt-2">
              Colors may appear slightly different due to monitor settings.
            </p>
          )}
        </div>
      ))}
      
      {/* Variant selection summary */}
      {Object.keys(selectedVariants).length > 0 && (
        <div className="mt-6 p-4 bg-sanctuary-50 rounded-lg border border-sanctuary-200">
          <h4 className="font-medium text-sanctuary-800 mb-2">Your Selection:</h4>
          <div className="space-y-1">
            {Object.entries(selectedVariants).map(([type, variantId]) => {
              const variant = variants.find(v => v.id === variantId)
              if (!variant) return null
              
              return (
                <div key={type} className="flex justify-between text-sm">
                  <span className="text-gray-700 capitalize">{type}:</span>
                  <span className="font-medium text-sanctuary-700">
                    {variant.name}
                    {showPricing && variant.price && ` (+${formatPrice(variant.price)})`}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}