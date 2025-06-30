// Shopify Type Definitions
// Task 13: Shopify Migration - Type System

import { Product as ShopifyProduct, ProductVariant as ShopifyVariant } from 'shopify-buy'

// Core Shopify Types (extend SDK types with our needs)
export interface ShopifyProductImage {
  id: string
  url: string
  altText: string | null
  width: number
  height: number
}

export interface ShopifyProductVariant {
  id: string
  title: string
  price: string
  compareAtPrice: string | null
  available: boolean
  sku: string | null
  weight: number
  weightUnit: string
  image?: ShopifyProductImage
  selectedOptions: Array<{
    name: string
    value: string
  }>
  quantityAvailable: number
}

export interface ShopifyCollection {
  id: string
  handle: string
  title: string
  description: string
  image?: ShopifyProductImage
  products: ShopifyProductNode[]
  productsCount: number
}

export interface ShopifyProductNode {
  id: string
  handle: string
  title: string
  description: string
  descriptionHtml: string
  productType: string
  vendor: string
  tags: string[]
  createdAt: string
  updatedAt: string
  publishedAt: string
  available: boolean
  availableForSale: boolean
  priceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
    maxVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
  compareAtPriceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
    maxVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
  images: {
    edges: Array<{
      node: ShopifyProductImage
    }>
  }
  variants: {
    edges: Array<{
      node: ShopifyProductVariant
    }>
  }
  collections: {
    edges: Array<{
      node: {
        id: string
        handle: string
        title: string
      }
    }>
  }
  options: Array<{
    id: string
    name: string
    values: string[]
  }>
  featuredImage?: ShopifyProductImage
  seo: {
    title: string | null
    description: string | null
  }
}

// Cart Types
export interface ShopifyCartLine {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    selectedOptions: Array<{
      name: string
      value: string
    }>
    product: {
      id: string
      handle: string
      title: string
      featuredImage?: ShopifyProductImage
    }
    price: {
      amount: string
      currencyCode: string
    }
    compareAtPrice?: {
      amount: string
      currencyCode: string
    }
  }
  cost: {
    totalAmount: {
      amount: string
      currencyCode: string
    }
    subtotalAmount: {
      amount: string
      currencyCode: string
    }
    compareAtAmountPerQuantity?: {
      amount: string
      currencyCode: string
    }
  }
}

export interface ShopifyCart {
  id: string
  checkoutUrl: string
  lines: {
    edges: Array<{
      node: ShopifyCartLine
    }>
  }
  cost: {
    totalAmount: {
      amount: string
      currencyCode: string
    }
    subtotalAmount: {
      amount: string
      currencyCode: string
    }
    totalTaxAmount?: {
      amount: string
      currencyCode: string
    }
    totalDutyAmount?: {
      amount: string
      currencyCode: string
    }
  }
  totalQuantity: number
  createdAt: string
  updatedAt: string
}

// Adapter Types (bridge our existing types with Shopify)
export interface AdaptedProduct {
  id: string
  handle: string
  name: string
  description: string
  shortDescription: string
  category: string
  price: number
  salePrice?: number
  images: Array<{
    id: string
    url: string
    alt: string
    isMain: boolean
    order: number
  }>
  variants: Array<{
    id: string
    name: string
    type: string
    price?: number
    stockCount?: number
    sku?: string
    isAvailable: boolean
  }>
  inStock: boolean
  stockCount?: number
  featured: boolean
  tags: string[]
  weight?: number
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
  collections: string[]
  vendor: string
  productType: string
}

export interface AdaptedCartItem {
  productId: string
  variantId: string
  quantity: number
  price: number
  compareAtPrice?: number
  title: string
  variantTitle: string
  image?: string
  handle: string
  sku?: string
  availableQuantity: number
}

export interface AdaptedCart {
  id: string
  items: AdaptedCartItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  totalQuantity: number
  checkoutUrl: string
  createdAt: Date
  updatedAt: Date
}

// Search and Filter Types
export interface ShopifySearchFilters {
  query?: string
  productType?: string
  vendor?: string
  tag?: string
  available?: boolean
  priceMin?: number
  priceMax?: number
  sortKey?: ShopifyProductSortKeys
  reverse?: boolean
}

export type ShopifyProductSortKeys = 
  | 'TITLE'
  | 'PRODUCT_TYPE' 
  | 'VENDOR'
  | 'UPDATED_AT'
  | 'CREATED_AT'
  | 'BEST_SELLING'
  | 'PRICE'
  | 'ID'
  | 'RELEVANCE'

// API Response Types
export interface ShopifyProductsResponse {
  products: {
    edges: Array<{
      node: ShopifyProductNode
      cursor: string
    }>
    pageInfo: {
      hasNextPage: boolean
      hasPreviousPage: boolean
      startCursor: string
      endCursor: string
    }
  }
}

export interface ShopifyCollectionsResponse {
  collections: {
    edges: Array<{
      node: ShopifyCollection
      cursor: string
    }>
    pageInfo: {
      hasNextPage: boolean
      hasPreviousPage: boolean
      startCursor: string
      endCursor: string
    }
  }
}

// GraphQL Query Variables
export interface ProductsQueryVariables {
  first?: number
  last?: number
  after?: string
  before?: string
  query?: string
  sortKey?: ShopifyProductSortKeys
  reverse?: boolean
}

export interface CollectionsQueryVariables {
  first?: number
  last?: number
  after?: string
  before?: string
  query?: string
  sortKey?: 'TITLE' | 'UPDATED_AT' | 'ID'
  reverse?: boolean
}

// Error Types
export interface ShopifyError {
  message: string
  locations?: Array<{
    line: number
    column: number
  }>
  path?: string[]
  extensions?: {
    code: string
    [key: string]: any
  }
}

export interface ShopifyApiError {
  errors?: ShopifyError[]
  message?: string
  networkError?: Error
}

// Configuration Types
export interface ShopifyConfig {
  domain: string
  storefrontAccessToken: string
  apiVersion?: string
}

// Hook Return Types
export interface UseShopifyProductsReturn {
  products: AdaptedProduct[]
  loading: boolean
  error: ShopifyApiError | null
  hasNextPage: boolean
  loadMore: () => Promise<void>
  refetch: () => Promise<void>
}

export interface UseShopifyCollectionsReturn {
  collections: ShopifyCollection[]
  loading: boolean
  error: ShopifyApiError | null
  refetch: () => Promise<void>
}

export interface UseShopifyCartReturn {
  cart: AdaptedCart | null
  loading: boolean
  error: ShopifyApiError | null
  addToCart: (variantId: string, quantity: number) => Promise<void>
  updateCartLine: (lineId: string, quantity: number) => Promise<void>
  removeFromCart: (lineId: string) => Promise<void>
  clearCart: () => Promise<void>
  checkout: () => void
}

// Constants
export const SHOPIFY_PRODUCT_FRAGMENT = `
  fragment ProductFragment on Product {
    id
    handle
    title
    description
    descriptionHtml
    productType
    vendor
    tags
    createdAt
    updatedAt
    publishedAt
    available
    availableForSale
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 10) {
      edges {
        node {
          id
          url
          altText
          width
          height
        }
      }
    }
    variants(first: 10) {
      edges {
        node {
          id
          title
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          available
          sku
          weight
          weightUnit
          quantityAvailable
          selectedOptions {
            name
            value
          }
          image {
            id
            url
            altText
            width
            height
          }
        }
      }
    }
    options {
      id
      name
      values
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
    seo {
      title
      description
    }
  }
`

export const SHOPIFY_CART_FRAGMENT = `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    createdAt
    updatedAt
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              selectedOptions {
                name
                value
              }
              product {
                id
                handle
                title
                featuredImage {
                  id
                  url
                  altText
                  width
                  height
                }
              }
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
            compareAtAmountPerQuantity {
              amount
              currencyCode
            }
          }
        }
      }
    }
    cost {
      totalAmount {
        amount
        currencyCode
      }
      subtotalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
      totalDutyAmount {
        amount
        currencyCode
      }
    }
  }
`