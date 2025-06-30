// Store Utility Functions
// Task 13: Phase 1 - Helper Functions

import { Product, CartItem, ShoppingCart, ProductFilter, ProductSort } from '../types/store'

// Price formatting and calculations
export const formatPrice = (price: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price)
}

export const calculateDiscount = (originalPrice: number, salePrice: number): number => {
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
}

export const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0)
}

export const calculateTax = (subtotal: number, taxRate: number): number => {
  return subtotal * taxRate
}

export const calculateShipping = (
  subtotal: number, 
  shippingRate: number, 
  freeShippingThreshold: number
): number => {
  return subtotal >= freeShippingThreshold ? 0 : shippingRate
}

export const calculateTotal = (
  subtotal: number, 
  tax: number, 
  shipping: number
): number => {
  return subtotal + tax + shipping
}

// Cart management functions
export const addToCart = (
  cart: ShoppingCart, 
  productId: string, 
  variantId: string | undefined, 
  quantity: number, 
  price: number
): ShoppingCart => {
  const existingItemIndex = cart.items.findIndex(
    item => item.productId === productId && item.variantId === variantId
  )

  let updatedItems: CartItem[] = [...cart.items]

  if (existingItemIndex >= 0) {
    // Update existing item quantity
    updatedItems[existingItemIndex] = {
      ...updatedItems[existingItemIndex],
      quantity: updatedItems[existingItemIndex].quantity + quantity
    }
  } else {
    // Add new item
    const newItem: CartItem = {
      id: `${productId}-${variantId || 'default'}-${Date.now()}`,
      productId,
      variantId,
      quantity,
      price
    }
    updatedItems.push(newItem)
  }

  const subtotal = calculateSubtotal(updatedItems)
  const tax = calculateTax(subtotal, 0.08) // Default 8% tax rate
  const shipping = calculateShipping(subtotal, 5.99, 50.00) // Default shipping
  const total = calculateTotal(subtotal, tax, shipping)

  return {
    ...cart,
    items: updatedItems,
    subtotal,
    tax,
    shipping,
    total,
    updatedAt: new Date()
  }
}

export const removeFromCart = (cart: ShoppingCart, itemId: string): ShoppingCart => {
  const updatedItems = cart.items.filter(item => item.id !== itemId)
  
  const subtotal = calculateSubtotal(updatedItems)
  const tax = calculateTax(subtotal, 0.08)
  const shipping = calculateShipping(subtotal, 5.99, 50.00)
  const total = calculateTotal(subtotal, tax, shipping)

  return {
    ...cart,
    items: updatedItems,
    subtotal,
    tax,
    shipping,
    total,
    updatedAt: new Date()
  }
}

export const updateCartItemQuantity = (
  cart: ShoppingCart, 
  itemId: string, 
  newQuantity: number
): ShoppingCart => {
  if (newQuantity <= 0) {
    return removeFromCart(cart, itemId)
  }

  const updatedItems = cart.items.map(item =>
    item.id === itemId ? { ...item, quantity: newQuantity } : item
  )

  const subtotal = calculateSubtotal(updatedItems)
  const tax = calculateTax(subtotal, 0.08)
  const shipping = calculateShipping(subtotal, 5.99, 50.00)
  const total = calculateTotal(subtotal, tax, shipping)

  return {
    ...cart,
    items: updatedItems,
    subtotal,
    tax,
    shipping,
    total,
    updatedAt: new Date()
  }
}

export const clearCart = (cart: ShoppingCart): ShoppingCart => {
  return {
    ...cart,
    items: [],
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
    updatedAt: new Date()
  }
}

export const getCartItemCount = (cart: ShoppingCart): number => {
  return cart.items.reduce((total, item) => total + item.quantity, 0)
}

// Product filtering and sorting
export const filterProducts = (products: Product[], filters: ProductFilter): Product[] => {
  let filtered = [...products]

  // Filter by category
  if (filters.category && filters.category.length > 0) {
    filtered = filtered.filter(product => filters.category!.includes(product.category))
  }

  // Filter by price range
  if (filters.priceRange) {
    filtered = filtered.filter(product => {
      const price = product.salePrice || product.price
      return price >= filters.priceRange!.min && price <= filters.priceRange!.max
    })
  }

  // Filter by stock status
  if (filters.inStock !== undefined) {
    filtered = filtered.filter(product => product.inStock === filters.inStock)
  }

  // Filter by sale status
  if (filters.onSale) {
    filtered = filtered.filter(product => product.salePrice && product.salePrice < product.price)
  }

  // Filter by tags
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(product =>
      filters.tags!.some(tag => product.tags.includes(tag))
    )
  }

  // Filter by search query
  if (filters.search) {
    const query = filters.search.toLowerCase()
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.shortDescription.toLowerCase().includes(query) ||
      product.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  return filtered
}

export const sortProducts = (products: Product[], sort: ProductSort): Product[] => {
  const sorted = [...products]

  return sorted.sort((a, b) => {
    let comparison = 0

    switch (sort.field) {
      case 'name':
        comparison = a.name.localeCompare(b.name)
        break
      case 'price':
        const priceA = a.salePrice || a.price
        const priceB = b.salePrice || b.price
        comparison = priceA - priceB
        break
      case 'createdAt':
        comparison = a.createdAt.getTime() - b.createdAt.getTime()
        break
      case 'popularity':
        // For now, use featured status and creation date as popularity proxy
        if (a.featured && !b.featured) comparison = -1
        else if (!a.featured && b.featured) comparison = 1
        else comparison = b.createdAt.getTime() - a.createdAt.getTime()
        break
      default:
        comparison = 0
    }

    return sort.direction === 'desc' ? -comparison : comparison
  })
}

// Product utility functions
export const getProductPrice = (product: Product): number => {
  return product.salePrice || product.price
}

export const isProductOnSale = (product: Product): boolean => {
  return !!(product.salePrice && product.salePrice < product.price)
}

export const getProductDiscountPercentage = (product: Product): number => {
  if (!product.salePrice) return 0
  return calculateDiscount(product.price, product.salePrice)
}

export const isProductInStock = (product: Product, variantId?: string): boolean => {
  if (!product.inStock) return false
  
  if (variantId) {
    const variant = product.variants.find(v => v.id === variantId)
    return variant ? variant.isAvailable : false
  }
  
  return true
}

export const getProductStockCount = (product: Product, variantId?: string): number => {
  if (variantId) {
    const variant = product.variants.find(v => v.id === variantId)
    return variant?.stockCount || 0
  }
  
  return product.stockCount || 0
}

// SKU and inventory helpers
export const generateSKU = (product: Product, variantId?: string): string => {
  const baseCode = product.name
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
    .substring(0, 8)
  
  if (variantId) {
    const variant = product.variants.find(v => v.id === variantId)
    if (variant?.sku) return variant.sku
    
    const variantCode = variant?.name
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase()
      .substring(0, 4)
    
    return `${baseCode}-${variantCode}`
  }
  
  return baseCode
}

// URL and slug helpers
export const createProductSlug = (productName: string): string => {
  return productName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const getProductUrl = (product: Product): string => {
  const slug = createProductSlug(product.name)
  return `/shop/products/${product.id}/${slug}`
}

// Validation helpers
export const validateCartItem = (item: CartItem): boolean => {
  return !!(
    item.productId &&
    item.quantity > 0 &&
    item.price > 0
  )
}

export const validateShoppingCart = (cart: ShoppingCart): boolean => {
  return cart.items.every(validateCartItem) && cart.items.length > 0
}

// Search and recommendation helpers
export const getRelatedProducts = (
  product: Product, 
  allProducts: Product[], 
  limit: number = 4
): Product[] => {
  const related = allProducts
    .filter(p => p.id !== product.id)
    .filter(p => 
      p.category === product.category ||
      product.tags.some(tag => p.tags.includes(tag))
    )
    .sort((a, b) => {
      // Prioritize same category, then shared tags
      const aScore = (a.category === product.category ? 2 : 0) +
        product.tags.filter(tag => a.tags.includes(tag)).length
      const bScore = (b.category === product.category ? 2 : 0) +
        product.tags.filter(tag => b.tags.includes(tag)).length
      return bScore - aScore
    })
    .slice(0, limit)

  return related
}

export const getSearchSuggestions = (
  query: string, 
  products: Product[], 
  limit: number = 5
): string[] => {
  if (!query || query.length < 2) return []

  const suggestions = new Set<string>()
  const lowercaseQuery = query.toLowerCase()

  products.forEach(product => {
    // Add product names that match
    if (product.name.toLowerCase().includes(lowercaseQuery)) {
      suggestions.add(product.name)
    }

    // Add matching tags
    product.tags.forEach(tag => {
      if (tag.toLowerCase().includes(lowercaseQuery)) {
        suggestions.add(tag)
      }
    })
  })

  return Array.from(suggestions).slice(0, limit)
}