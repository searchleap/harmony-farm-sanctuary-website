// Store Utility Functions
// Task 13: Phase 1 - Helper Functions

import { 
  Product, 
  CartItem, 
  ShoppingCart, 
  ProductFilters, 
  SortOption,
  CategoryData,
  ProductCategory
} from '../types/store'

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
export const filterProducts = (products: Product[], filters: any): Product[] => {
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
      filters.tags!.some((tag: string) => product.tags.includes(tag))
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

export const sortProducts = (products: Product[], sort: any): Product[] => {
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

// New filtering and search utilities for Task 13 Step 6

export const applyProductFilters = (products: Product[], filters: ProductFilters): Product[] => {
  let filtered = [...products]

  // Filter by categories
  if (filters.categories.length > 0) {
    filtered = filtered.filter(product => filters.categories.includes(product.category))
  }

  // Filter by price range
  if (filters.priceRange.min > 0 || filters.priceRange.max < Number.MAX_VALUE) {
    filtered = filtered.filter(product => {
      const price = product.salePrice || product.price
      return price >= filters.priceRange.min && price <= filters.priceRange.max
    })
  }

  // Filter by stock status
  if (filters.inStockOnly) {
    filtered = filtered.filter(product => product.inStock)
  }

  // Filter by tags
  if (filters.tags.length > 0) {
    filtered = filtered.filter(product =>
      filters.tags.some(tag => product.tags.includes(tag))
    )
  }

  // Filter by featured status
  if (filters.featured) {
    filtered = filtered.filter(product => product.featured)
  }

  // Filter by sale status
  if (filters.onSale) {
    filtered = filtered.filter(product => isProductOnSale(product))
  }

  return filtered
}

export const sortProductsBySortOption = (products: Product[], sortOption: SortOption): Product[] => {
  const sorted = [...products]

  return sorted.sort((a, b) => {
    switch (sortOption) {
      case 'price-asc':
        return getProductPrice(a) - getProductPrice(b)
      case 'price-desc':
        return getProductPrice(b) - getProductPrice(a)
      case 'name-asc':
        return a.name.localeCompare(b.name)
      case 'name-desc':
        return b.name.localeCompare(a.name)
      case 'newest':
        return b.createdAt.getTime() - a.createdAt.getTime()
      case 'popular':
        // Featured products first, then by creation date
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return b.createdAt.getTime() - a.createdAt.getTime()
      case 'featured':
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })
}

export const searchProducts = (products: Product[], query: string): Product[] => {
  if (!query || query.trim().length === 0) return products

  const searchTerm = query.toLowerCase().trim()
  
  return products.filter(product => {
    // Search in product name
    if (product.name.toLowerCase().includes(searchTerm)) return true
    
    // Search in product description
    if (product.description.toLowerCase().includes(searchTerm)) return true
    if (product.shortDescription.toLowerCase().includes(searchTerm)) return true
    
    // Search in tags
    if (product.tags.some(tag => tag.toLowerCase().includes(searchTerm))) return true
    
    // Search in category
    if (product.category.toLowerCase().includes(searchTerm)) return true
    
    return false
  })
}

export const getProductSearchSuggestions = (
  query: string,
  products: Product[],
  limit: number = 8
): string[] => {
  if (!query || query.length < 2) return []

  const suggestions = new Set<string>()
  const searchTerm = query.toLowerCase()

  // Add product names that start with the query
  products.forEach(product => {
    if (product.name.toLowerCase().startsWith(searchTerm)) {
      suggestions.add(product.name)
    }
  })

  // Add product names that contain the query
  products.forEach(product => {
    if (product.name.toLowerCase().includes(searchTerm) && 
        !product.name.toLowerCase().startsWith(searchTerm)) {
      suggestions.add(product.name)
    }
  })

  // Add tags that match
  products.forEach(product => {
    product.tags.forEach(tag => {
      if (tag.toLowerCase().includes(searchTerm)) {
        suggestions.add(tag)
      }
    })
  })

  return Array.from(suggestions).slice(0, limit)
}

export const getCategoryData = (products: Product[]): CategoryData[] => {
  const categories: Record<ProductCategory, number> = {
    apparel: 0,
    accessories: 0,
    books: 0,
    gifts: 0,
    seasonal: 0
  }

  // Count products in each category
  products.forEach(product => {
    categories[product.category]++
  })

  return [
    {
      id: 'apparel',
      name: 'Apparel',
      slug: 'apparel',
      description: 'T-shirts, hoodies, and wearable sanctuary gear',
      icon: 'Shirt',
      productCount: categories.apparel,
      featured: true
    },
    {
      id: 'accessories',
      name: 'Accessories',
      slug: 'accessories',
      description: 'Bags, mugs, stickers, and everyday items',
      icon: 'ShoppingBag',
      productCount: categories.accessories,
      featured: true
    },
    {
      id: 'books',
      name: 'Books & Education',
      slug: 'books',
      description: 'Educational materials and rescue stories',
      icon: 'BookOpen',
      productCount: categories.books,
      featured: false
    },
    {
      id: 'gifts',
      name: 'Gifts',
      slug: 'gifts',
      description: 'Perfect gifts for animal lovers',
      icon: 'Gift',
      productCount: categories.gifts,
      featured: true
    },
    {
      id: 'seasonal',
      name: 'Seasonal',
      slug: 'seasonal',
      description: 'Holiday and seasonal sanctuary items',
      icon: 'Calendar',
      productCount: categories.seasonal,
      featured: false
    }
  ]
}

export const getFilteredProductCount = (products: Product[], filters: ProductFilters): number => {
  return applyProductFilters(products, filters).length
}

export const createDefaultFilters = (): ProductFilters => {
  return {
    categories: [],
    priceRange: {
      min: 0,
      max: Number.MAX_VALUE
    },
    inStockOnly: false,
    tags: [],
    featured: false,
    onSale: false
  }
}

export const getMinMaxPrices = (products: Product[]): { min: number; max: number } => {
  if (products.length === 0) return { min: 0, max: 100 }

  const prices = products.map(product => getProductPrice(product))
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  }
}