// Shopify API Client
// Task 13: Shopify Migration - API Client

import Client from 'shopify-buy'
import { 
  ShopifyConfig, 
  ShopifyApiError, 
  ShopifyProductsResponse,
  ShopifyCollectionsResponse,
  ShopifyCart,
  ProductsQueryVariables,
  CollectionsQueryVariables,
  SHOPIFY_PRODUCT_FRAGMENT,
  SHOPIFY_CART_FRAGMENT
} from '../types/shopify'

// Configuration
const SHOPIFY_CONFIG: ShopifyConfig = {
  domain: (import.meta as any).env.VITE_SHOPIFY_DOMAIN || 'harmony-farm.myshopify.com',
  storefrontAccessToken: (import.meta as any).env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
  apiVersion: '2024-01'
}

// Shopify Buy SDK Client
export const shopifyClient = Client.buildClient({
  domain: SHOPIFY_CONFIG.domain,
  storefrontAccessToken: SHOPIFY_CONFIG.storefrontAccessToken,
  apiVersion: SHOPIFY_CONFIG.apiVersion
})

// Storefront API Client for GraphQL queries
class ShopifyStorefrontClient {
  private endpoint: string
  private headers: Record<string, string>

  constructor(config: ShopifyConfig) {
    this.endpoint = `https://${config.domain}/api/${config.apiVersion || '2024-01'}/graphql.json`
    this.headers = {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': config.storefrontAccessToken
    }
  }

  private async request<T>(query: string, variables?: Record<string, any>): Promise<T> {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          query,
          variables
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const json = await response.json()

      if (json.errors) {
        throw new Error(json.errors.map((e: any) => e.message).join(', '))
      }

      return json.data
    } catch (error) {
      console.error('Shopify API request failed:', error)
      throw error
    }
  }

  // Get Products
  async getProducts(variables: ProductsQueryVariables = {}): Promise<ShopifyProductsResponse> {
    const query = `
      query getProducts(
        $first: Int,
        $last: Int,
        $after: String,
        $before: String,
        $query: String,
        $sortKey: ProductSortKeys,
        $reverse: Boolean
      ) {
        products(
          first: $first,
          last: $last,
          after: $after,
          before: $before,
          query: $query,
          sortKey: $sortKey,
          reverse: $reverse
        ) {
          edges {
            node {
              ${SHOPIFY_PRODUCT_FRAGMENT}
            }
            cursor
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
        }
      }
    `

    return this.request<ShopifyProductsResponse>(query, {
      first: 50,
      ...variables
    })
  }

  // Get Single Product
  async getProduct(handle: string) {
    const query = `
      query getProduct($handle: String!) {
        product(handle: $handle) {
          ${SHOPIFY_PRODUCT_FRAGMENT}
        }
      }
    `

    const response = await this.request<{ product: any }>(query, { handle })
    return response.product
  }

  // Get Collections
  async getCollections(variables: CollectionsQueryVariables = {}): Promise<ShopifyCollectionsResponse> {
    const query = `
      query getCollections(
        $first: Int,
        $last: Int,
        $after: String,
        $before: String,
        $query: String,
        $sortKey: CollectionSortKeys,
        $reverse: Boolean
      ) {
        collections(
          first: $first,
          last: $last,
          after: $after,
          before: $before,
          query: $query,
          sortKey: $sortKey,
          reverse: $reverse
        ) {
          edges {
            node {
              id
              handle
              title
              description
              image {
                id
                url
                altText
                width
                height
              }
              products(first: 1) {
                edges {
                  node {
                    id
                  }
                }
              }
            }
            cursor
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
        }
      }
    `

    return this.request<ShopifyCollectionsResponse>(query, {
      first: 20,
      ...variables
    })
  }

  // Search Products
  async searchProducts(searchQuery: string, variables: ProductsQueryVariables = {}) {
    return this.getProducts({
      ...variables,
      query: searchQuery
    })
  }

  // Get Collection Products
  async getCollectionProducts(handle: string, variables: ProductsQueryVariables = {}) {
    const query = `
      query getCollectionProducts(
        $handle: String!,
        $first: Int,
        $after: String,
        $sortKey: ProductCollectionSortKeys,
        $reverse: Boolean
      ) {
        collection(handle: $handle) {
          id
          title
          description
          products(
            first: $first,
            after: $after,
            sortKey: $sortKey,
            reverse: $reverse
          ) {
            edges {
              node {
                ${SHOPIFY_PRODUCT_FRAGMENT}
              }
              cursor
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
          }
        }
      }
    `

    const response = await this.request<{ collection: any }>(query, {
      handle,
      first: 50,
      ...variables
    })

    return response.collection
  }

  // Cart Operations
  async createCart(): Promise<ShopifyCart> {
    const query = `
      mutation cartCreate($input: CartInput) {
        cartCreate(input: $input) {
          cart {
            ${SHOPIFY_CART_FRAGMENT}
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    const response = await this.request<{ cartCreate: { cart: ShopifyCart, userErrors: any[] } }>(query, {
      input: {}
    })

    if (response.cartCreate.userErrors.length > 0) {
      throw new Error(response.cartCreate.userErrors.map(e => e.message).join(', '))
    }

    return response.cartCreate.cart
  }

  async addToCart(cartId: string, lines: Array<{ merchandiseId: string, quantity: number }>): Promise<ShopifyCart> {
    const query = `
      mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            ${SHOPIFY_CART_FRAGMENT}
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    const response = await this.request<{ cartLinesAdd: { cart: ShopifyCart, userErrors: any[] } }>(query, {
      cartId,
      lines
    })

    if (response.cartLinesAdd.userErrors.length > 0) {
      throw new Error(response.cartLinesAdd.userErrors.map(e => e.message).join(', '))
    }

    return response.cartLinesAdd.cart
  }

  async updateCartLines(cartId: string, lines: Array<{ id: string, quantity: number }>): Promise<ShopifyCart> {
    const query = `
      mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            ${SHOPIFY_CART_FRAGMENT}
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    const response = await this.request<{ cartLinesUpdate: { cart: ShopifyCart, userErrors: any[] } }>(query, {
      cartId,
      lines
    })

    if (response.cartLinesUpdate.userErrors.length > 0) {
      throw new Error(response.cartLinesUpdate.userErrors.map(e => e.message).join(', '))
    }

    return response.cartLinesUpdate.cart
  }

  async removeCartLines(cartId: string, lineIds: string[]): Promise<ShopifyCart> {
    const query = `
      mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            ${SHOPIFY_CART_FRAGMENT}
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    const response = await this.request<{ cartLinesRemove: { cart: ShopifyCart, userErrors: any[] } }>(query, {
      cartId,
      lineIds
    })

    if (response.cartLinesRemove.userErrors.length > 0) {
      throw new Error(response.cartLinesRemove.userErrors.map(e => e.message).join(', '))
    }

    return response.cartLinesRemove.cart
  }

  async getCart(cartId: string): Promise<ShopifyCart> {
    const query = `
      query getCart($cartId: ID!) {
        cart(id: $cartId) {
          ${SHOPIFY_CART_FRAGMENT}
        }
      }
    `

    const response = await this.request<{ cart: ShopifyCart }>(query, { cartId })
    return response.cart
  }
}

// Export singleton instance
export const shopifyStorefront = new ShopifyStorefrontClient(SHOPIFY_CONFIG)

// Helper functions
export const formatPrice = (amount: string, currencyCode: string = 'USD'): string => {
  const price = parseFloat(amount)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(price)
}

export const getProductPrice = (product: any): number => {
  return parseFloat(product.priceRange.minVariantPrice.amount)
}

export const getProductCompareAtPrice = (product: any): number | null => {
  const compareAt = product.compareAtPriceRange?.minVariantPrice?.amount
  return compareAt ? parseFloat(compareAt) : null
}

export const isProductOnSale = (product: any): boolean => {
  const price = getProductPrice(product)
  const compareAtPrice = getProductCompareAtPrice(product)
  return compareAtPrice !== null && compareAtPrice > price
}

export const getDiscountPercentage = (product: any): number => {
  const price = getProductPrice(product)
  const compareAtPrice = getProductCompareAtPrice(product)
  
  if (!compareAtPrice || compareAtPrice <= price) return 0
  
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
}

// Error handling
export const handleShopifyError = (error: any): ShopifyApiError => {
  console.error('Shopify API Error:', error)
  
  if (error.networkError) {
    return {
      message: 'Network error occurred',
      networkError: error.networkError
    }
  }
  
  if (error.graphQLErrors) {
    return {
      errors: error.graphQLErrors,
      message: error.graphQLErrors.map((e: any) => e.message).join(', ')
    }
  }
  
  return {
    message: error.message || 'An unknown error occurred'
  }
}

// Local storage helpers for cart persistence
export const CART_STORAGE_KEY = 'harmony-farm-cart-id'

export const getStoredCartId = (): string | null => {
  try {
    return localStorage.getItem(CART_STORAGE_KEY)
  } catch {
    return null
  }
}

export const setStoredCartId = (cartId: string): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, cartId)
  } catch (error) {
    console.warn('Could not store cart ID:', error)
  }
}

export const clearStoredCartId = (): void => {
  try {
    localStorage.removeItem(CART_STORAGE_KEY)
  } catch (error) {
    console.warn('Could not clear cart ID:', error)
  }
}