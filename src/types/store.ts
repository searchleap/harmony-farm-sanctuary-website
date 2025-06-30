// Merchandise Store Type Definitions
// Task 13: Phase 1 - Data Architecture

export type ProductCategory = 'apparel' | 'accessories' | 'books' | 'gifts' | 'seasonal'
export type VariantType = 'size' | 'color' | 'style' | 'material'
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface ProductImage {
  id: string
  url: string
  alt: string
  isMain: boolean
  order: number
}

export interface ProductVariant {
  id: string
  name: string // e.g. "Small", "Medium", "Large", "Black", "White"
  type: VariantType
  price?: number // override base price if different
  stockCount?: number
  sku?: string
  isAvailable: boolean
}

export interface Product {
  id: string
  name: string
  description: string
  shortDescription: string
  category: ProductCategory
  price: number
  salePrice?: number
  images: ProductImage[]
  variants: ProductVariant[]
  inStock: boolean
  stockCount?: number
  featured: boolean
  tags: string[]
  weight?: number // for shipping calculations
  dimensions?: {
    length: number
    width: number
    height: number
  }
  materials?: string[]
  careInstructions?: string
  sizing?: string
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  id: string
  productId: string
  variantId?: string
  quantity: number
  price: number // price at time of adding to cart
  product?: Product // populated product data
  variant?: ProductVariant // populated variant data
}

export interface ShoppingCart {
  id: string
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  createdAt: Date
  updatedAt: Date
}

export interface Address {
  id?: string
  firstName: string
  lastName: string
  company?: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
}

export interface CustomerInfo {
  id?: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  marketingOptIn: boolean
}

export interface OrderItem {
  id: string
  productId: string
  variantId?: string
  quantity: number
  price: number
  total: number
  product: Product
  variant?: ProductVariant
}

export interface Order {
  id: string
  orderNumber: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  customerInfo: CustomerInfo
  shippingAddress: Address
  billingAddress: Address
  trackingNumber?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
  estimatedDelivery?: Date
}

export interface ProductFilter {
  category?: ProductCategory[]
  priceRange?: {
    min: number
    max: number
  }
  inStock?: boolean
  onSale?: boolean
  tags?: string[]
  search?: string
}

export interface ProductSort {
  field: 'name' | 'price' | 'createdAt' | 'popularity'
  direction: 'asc' | 'desc'
}

export interface StoreConfig {
  currency: string
  taxRate: number
  shippingRates: {
    standard: number
    expedited: number
    overnight: number
  }
  freeShippingThreshold: number
  returnsPolicy: string
  shippingPolicy: string
}

// Wishlist and User Preferences
export interface WishlistItem {
  id: string
  productId: string
  variantId?: string
  addedAt: Date
}

export interface Wishlist {
  id: string
  userId: string
  items: WishlistItem[]
  createdAt: Date
  updatedAt: Date
}

// Analytics and Reporting
export interface ProductAnalytics {
  productId: string
  views: number
  addToCart: number
  purchases: number
  revenue: number
  conversionRate: number
  lastUpdated: Date
}

export interface SalesReport {
  period: string
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  topSellingProducts: Array<{
    productId: string
    quantity: number
    revenue: number
  }>
  conversionRate: number
}

// API Response Types
export interface ProductListResponse {
  products: Product[]
  totalCount: number
  currentPage: number
  totalPages: number
  hasMore: boolean
}

export interface OrderResponse {
  order: Order
  success: boolean
  message?: string
}

export interface PaymentResponse {
  success: boolean
  orderId: string
  paymentId?: string
  redirectUrl?: string
  error?: string
}

// Form Types
export interface CheckoutFormData {
  customerInfo: CustomerInfo
  shippingAddress: Address
  billingAddress: Address
  sameAsShipping: boolean
  paymentMethod: string
  specialInstructions?: string
}

export interface ProductReview {
  id: string
  productId: string
  userId: string
  rating: number
  title: string
  comment: string
  verified: boolean // verified purchase
  helpful: number
  createdAt: Date
}

// Store Settings
export interface StoreSettings {
  storeName: string
  description: string
  logo: string
  favicon: string
  primaryColor: string
  secondaryColor: string
  featuredProducts: string[]
  heroProducts: string[]
  socialMedia: {
    facebook?: string
    instagram?: string
    twitter?: string
  }
}

// Store Navigation & Filtering Types
export type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest' | 'popular' | 'featured'
export type ViewMode = 'grid' | 'list'

export interface ProductFilters {
  categories: ProductCategory[]
  priceRange: {
    min: number
    max: number
  }
  inStockOnly: boolean
  tags: string[]
  featured: boolean
  onSale: boolean
}

export interface SearchState {
  query: string
  suggestions: string[]
  recentSearches: string[]
  results: Product[]
  isLoading: boolean
}

export interface CategoryData {
  id: ProductCategory
  name: string
  slug: string
  description: string
  icon: string
  productCount: number
  featured: boolean
  image?: string
}

export interface FilterState {
  activeFilters: ProductFilters
  sortBy: SortOption
  viewMode: ViewMode
  resultsPerPage: number
  currentPage: number
}

export interface SearchFilters extends ProductFilters {
  searchQuery: string
}