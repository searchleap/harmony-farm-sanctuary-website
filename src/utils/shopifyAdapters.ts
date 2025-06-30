// Shopify Data Adapters
// Task 13: Shopify Migration - Data Transformation

import { 
  ShopifyProductNode,
  ShopifyCart,
  ShopifyCartLine,
  AdaptedProduct,
  AdaptedCart,
  AdaptedCartItem
} from '../types/shopify'
import { 
  ProductCategory,
  CategoryData
} from '../types/store'

// Product Adapters
export const adaptShopifyProduct = (shopifyProduct: ShopifyProductNode): AdaptedProduct => {
  // Extract images
  const images = shopifyProduct.images.edges.map((edge, index) => ({
    id: edge.node.id,
    url: edge.node.url,
    alt: edge.node.altText || shopifyProduct.title,
    isMain: index === 0,
    order: index
  }))

  // Extract variants
  const variants = shopifyProduct.variants.edges.map(edge => ({
    id: edge.node.id,
    name: edge.node.title,
    type: 'variant', // Shopify doesn't have explicit variant types
    price: parseFloat(edge.node.price.amount),
    stockCount: edge.node.quantityAvailable,
    sku: edge.node.sku || undefined,
    isAvailable: edge.node.available
  }))

  // Map Shopify productType to our categories
  const mapProductTypeToCategory = (productType: string): ProductCategory => {
    const type = productType.toLowerCase()
    if (type.includes('shirt') || type.includes('hoodie') || type.includes('apparel') || type.includes('clothing')) {
      return 'apparel'
    }
    if (type.includes('bag') || type.includes('mug') || type.includes('accessory') || type.includes('sticker')) {
      return 'accessories'
    }
    if (type.includes('book') || type.includes('guide') || type.includes('education')) {
      return 'books'
    }
    if (type.includes('gift') || type.includes('collectible')) {
      return 'gifts'
    }
    if (type.includes('seasonal') || type.includes('holiday')) {
      return 'seasonal'
    }
    return 'gifts' // default fallback
  }

  // Get price information
  const price = parseFloat(shopifyProduct.priceRange.minVariantPrice.amount)
  const compareAtPrice = shopifyProduct.compareAtPriceRange?.minVariantPrice?.amount 
    ? parseFloat(shopifyProduct.compareAtPriceRange.minVariantPrice.amount)
    : undefined

  return {
    id: shopifyProduct.id,
    handle: shopifyProduct.handle,
    name: shopifyProduct.title,
    description: shopifyProduct.description,
    shortDescription: shopifyProduct.description.substring(0, 150) + '...',
    category: mapProductTypeToCategory(shopifyProduct.productType),
    price,
    salePrice: compareAtPrice && compareAtPrice > price ? price : undefined,
    images,
    variants,
    inStock: shopifyProduct.availableForSale,
    stockCount: variants.reduce((total, variant) => total + (variant.stockCount || 0), 0),
    featured: shopifyProduct.tags.includes('featured'),
    tags: shopifyProduct.tags,
    weight: variants[0]?.price || undefined, // Shopify doesn't have product-level weight
    collections: shopifyProduct.collections.edges.map(edge => edge.node.handle),
    vendor: shopifyProduct.vendor,
    productType: shopifyProduct.productType,
    createdAt: new Date(shopifyProduct.createdAt),
    updatedAt: new Date(shopifyProduct.updatedAt)
  }
}

export const adaptShopifyProducts = (shopifyProducts: ShopifyProductNode[]): AdaptedProduct[] => {
  return shopifyProducts.map(adaptShopifyProduct)
}

// Cart Adapters
export const adaptShopifyCartLine = (cartLine: ShopifyCartLine): AdaptedCartItem => {
  const merchandise = cartLine.merchandise
  const product = merchandise.product

  return {
    productId: product.id,
    variantId: merchandise.id,
    quantity: cartLine.quantity,
    price: parseFloat(merchandise.price.amount),
    compareAtPrice: merchandise.compareAtPrice 
      ? parseFloat(merchandise.compareAtPrice.amount) 
      : undefined,
    title: product.title,
    variantTitle: merchandise.title,
    image: product.featuredImage?.url,
    handle: product.handle,
    sku: undefined, // Would need to be added to cart fragment if needed
    availableQuantity: 999 // Shopify doesn't provide this in cart context
  }
}

export const adaptShopifyCart = (shopifyCart: ShopifyCart): AdaptedCart => {
  const items = shopifyCart.lines.edges.map(edge => adaptShopifyCartLine(edge.node))
  
  const subtotal = parseFloat(shopifyCart.cost.subtotalAmount.amount)
  const tax = shopifyCart.cost.totalTaxAmount 
    ? parseFloat(shopifyCart.cost.totalTaxAmount.amount)
    : 0
  const total = parseFloat(shopifyCart.cost.totalAmount.amount)
  const shipping = total - subtotal - tax // Calculate shipping as difference

  return {
    id: shopifyCart.id,
    items,
    subtotal,
    tax,
    shipping,
    total,
    totalQuantity: shopifyCart.totalQuantity,
    checkoutUrl: shopifyCart.checkoutUrl,
    createdAt: new Date(shopifyCart.createdAt),
    updatedAt: new Date(shopifyCart.updatedAt)
  }
}

// Category Adapters
export const adaptShopifyCollectionsToCategories = (
  collections: any[],
  products: AdaptedProduct[]
): CategoryData[] => {
  // Create base categories based on our product categories
  const baseCategories: CategoryData[] = [
    {
      id: 'apparel',
      name: 'Apparel',
      slug: 'apparel',
      description: 'T-shirts, hoodies, and wearable sanctuary gear',
      icon: 'Shirt',
      productCount: 0,
      featured: true
    },
    {
      id: 'accessories',
      name: 'Accessories',
      slug: 'accessories',
      description: 'Bags, mugs, stickers, and everyday items',
      icon: 'ShoppingBag',
      productCount: 0,
      featured: true
    },
    {
      id: 'books',
      name: 'Books & Education',
      slug: 'books',
      description: 'Educational materials and rescue stories',
      icon: 'BookOpen',
      productCount: 0,
      featured: false
    },
    {
      id: 'gifts',
      name: 'Gifts',
      slug: 'gifts',
      description: 'Perfect gifts for animal lovers',
      icon: 'Gift',
      productCount: 0,
      featured: true
    },
    {
      id: 'seasonal',
      name: 'Seasonal',
      slug: 'seasonal',
      description: 'Holiday and seasonal sanctuary items',
      icon: 'Calendar',
      productCount: 0,
      featured: false
    }
  ]

  // Count products in each category
  const categoryCounts: Record<ProductCategory, number> = {
    apparel: 0,
    accessories: 0,
    books: 0,
    gifts: 0,
    seasonal: 0
  }

  products.forEach(product => {
    categoryCounts[product.category]++
  })

  // Update category counts
  return baseCategories.map(category => ({
    ...category,
    productCount: categoryCounts[category.id as ProductCategory]
  }))
}

// Search Adapters
export const adaptSearchQueryToShopify = (query: string): string => {
  // Convert our search format to Shopify search format
  // Shopify supports AND, OR, NOT operators and field-specific searches
  
  // Basic query cleanup
  const cleanQuery = query.trim()
  
  // For now, pass through directly - can enhance later
  return cleanQuery
}

// Filter Adapters
export const adaptFiltersToShopifyQuery = (filters: any): string => {
  const queryParts: string[] = []

  // Category filters
  if (filters.categories && filters.categories.length > 0) {
    const categoryQueries = filters.categories.map((category: string) => {
      // Map our categories to Shopify product types or tags
      switch (category) {
        case 'apparel':
          return 'product_type:Apparel OR tag:apparel OR tag:clothing'
        case 'accessories':
          return 'product_type:Accessories OR tag:accessories'
        case 'books':
          return 'product_type:Books OR tag:books OR tag:education'
        case 'gifts':
          return 'product_type:Gifts OR tag:gifts'
        case 'seasonal':
          return 'product_type:Seasonal OR tag:seasonal OR tag:holiday'
        default:
          return `tag:${category}`
      }
    })
    
    if (categoryQueries.length === 1) {
      queryParts.push(`(${categoryQueries[0]})`)
    } else {
      queryParts.push(`(${categoryQueries.join(' OR ')})`)
    }
  }

  // Price filters
  if (filters.priceRange) {
    if (filters.priceRange.min > 0) {
      queryParts.push(`variants.price:>=${filters.priceRange.min}`)
    }
    if (filters.priceRange.max < Number.MAX_VALUE) {
      queryParts.push(`variants.price:<=${filters.priceRange.max}`)
    }
  }

  // Availability filter
  if (filters.inStockOnly) {
    queryParts.push('available:true')
  }

  // Featured filter
  if (filters.featured) {
    queryParts.push('tag:featured')
  }

  // Sale filter
  if (filters.onSale) {
    queryParts.push('compare_at_price:>0')
  }

  // Tag filters
  if (filters.tags && filters.tags.length > 0) {
    const tagQueries = filters.tags.map((tag: string) => `tag:${tag}`)
    queryParts.push(`(${tagQueries.join(' OR ')})`)
  }

  return queryParts.join(' AND ')
}

// Sort Adapters
export const adaptSortToShopify = (sortOption: string): { sortKey: string, reverse: boolean } => {
  switch (sortOption) {
    case 'price-asc':
      return { sortKey: 'PRICE', reverse: false }
    case 'price-desc':
      return { sortKey: 'PRICE', reverse: true }
    case 'name-asc':
      return { sortKey: 'TITLE', reverse: false }
    case 'name-desc':
      return { sortKey: 'TITLE', reverse: true }
    case 'newest':
      return { sortKey: 'CREATED_AT', reverse: true }
    case 'popular':
      return { sortKey: 'BEST_SELLING', reverse: true }
    case 'featured':
      return { sortKey: 'UPDATED_AT', reverse: true } // Best approximation
    default:
      return { sortKey: 'UPDATED_AT', reverse: true }
  }
}

// Utility Functions
export const extractShopifyId = (gid: string): string => {
  // Shopify GIDs are in format "gid://shopify/Product/123456"
  const parts = gid.split('/')
  return parts[parts.length - 1]
}

export const createShopifyGid = (type: string, id: string): string => {
  return `gid://shopify/${type}/${id}`
}

// Validation helpers
export const isValidShopifyProduct = (product: any): boolean => {
  return !!(
    product &&
    product.id &&
    product.title &&
    product.handle &&
    product.availableForSale !== undefined
  )
}

export const isValidShopifyCart = (cart: any): boolean => {
  return !!(
    cart &&
    cart.id &&
    cart.lines &&
    cart.cost &&
    cart.checkoutUrl
  )
}

// Image URL helpers
export const getShopifyImageUrl = (url: string, size?: string): string => {
  if (!url) return ''
  
  // Shopify image URLs can be resized by adding size parameters
  if (size) {
    // Remove existing size parameters
    const baseUrl = url.split('?')[0]
    return `${baseUrl}?width=${size}`
  }
  
  return url
}

export const getOptimizedImageUrl = (url: string, width: number, height?: number): string => {
  if (!url) return ''
  
  const baseUrl = url.split('?')[0]
  let params = `width=${width}`
  
  if (height) {
    params += `&height=${height}&crop=center`
  }
  
  return `${baseUrl}?${params}`
}

// Error adapters
export const adaptShopifyError = (error: any): string => {
  if (typeof error === 'string') return error
  
  if (error.message) return error.message
  
  if (error.userErrors && error.userErrors.length > 0) {
    return error.userErrors.map((e: any) => e.message).join(', ')
  }
  
  if (error.errors && error.errors.length > 0) {
    return error.errors.map((e: any) => e.message).join(', ')
  }
  
  return 'An unknown error occurred'
}