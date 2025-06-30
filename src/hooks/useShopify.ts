// Shopify React Hooks
// Task 13: Shopify Migration - Data Fetching Hooks

import { useState, useEffect, useCallback } from 'react'
import { shopifyStorefront, getStoredCartId, setStoredCartId, clearStoredCartId } from '../utils/shopify'
import { 
  adaptShopifyProducts, 
  adaptShopifyCart, 
  adaptShopifyCollectionsToCategories,
  adaptFiltersToShopifyQuery,
  adaptSortToShopify,
  adaptShopifyError
} from '../utils/shopifyAdapters'
import {
  UseShopifyProductsReturn,
  UseShopifyCollectionsReturn,
  UseShopifyCartReturn,
  AdaptedProduct,
  AdaptedCart,
  ShopifyCollection,
  ShopifyApiError,
  ProductsQueryVariables
} from '../types/shopify'

// Products Hook
export const useShopifyProducts = (
  initialQuery?: string,
  initialFilters?: any,
  initialSort?: string
): UseShopifyProductsReturn => {
  const [products, setProducts] = useState<AdaptedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ShopifyApiError | null>(null)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [cursor, setCursor] = useState<string | null>(null)

  const fetchProducts = useCallback(async (
    query?: string,
    filters?: any,
    sort?: string,
    after?: string,
    append = false
  ) => {
    try {
      setLoading(true)
      setError(null)

      // Build Shopify query
      let shopifyQuery = ''
      
      if (query) {
        shopifyQuery = query
      }
      
      if (filters) {
        const filterQuery = adaptFiltersToShopifyQuery(filters)
        if (filterQuery) {
          shopifyQuery = shopifyQuery 
            ? `${shopifyQuery} AND ${filterQuery}`
            : filterQuery
        }
      }

      // Build variables
      const variables: ProductsQueryVariables = {
        first: 24,
        after: after || undefined
      }

      if (shopifyQuery) {
        variables.query = shopifyQuery
      }

      if (sort) {
        const { sortKey, reverse } = adaptSortToShopify(sort)
        variables.sortKey = sortKey as any
        variables.reverse = reverse
      }

      console.log('Fetching products with variables:', variables)

      const response = await shopifyStorefront.getProducts(variables)
      const adaptedProducts = adaptShopifyProducts(
        response.products.edges.map(edge => edge.node)
      )

      if (append) {
        setProducts(prev => [...prev, ...adaptedProducts])
      } else {
        setProducts(adaptedProducts)
      }

      setHasNextPage(response.products.pageInfo.hasNextPage)
      setCursor(response.products.pageInfo.endCursor)

    } catch (err) {
      console.error('Error fetching products:', err)
      setError({
        message: adaptShopifyError(err)
      })
    } finally {
      setLoading(false)
    }
  }, [])

  const loadMore = useCallback(async () => {
    if (cursor && hasNextPage && !loading) {
      await fetchProducts(initialQuery, initialFilters, initialSort, cursor, true)
    }
  }, [cursor, hasNextPage, loading, initialQuery, initialFilters, initialSort, fetchProducts])

  const refetch = useCallback(async () => {
    setCursor(null)
    await fetchProducts(initialQuery, initialFilters, initialSort)
  }, [initialQuery, initialFilters, initialSort, fetchProducts])

  // Initial fetch
  useEffect(() => {
    fetchProducts(initialQuery, initialFilters, initialSort)
  }, [fetchProducts, initialQuery, initialFilters, initialSort])

  return {
    products,
    loading,
    error,
    hasNextPage,
    loadMore,
    refetch
  }
}

// Single Product Hook
export const useShopifyProduct = (handle: string) => {
  const [product, setProduct] = useState<AdaptedProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ShopifyApiError | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)

        const shopifyProduct = await shopifyStorefront.getProduct(handle)
        
        if (shopifyProduct) {
          const adaptedProduct = adaptShopifyProducts([shopifyProduct])[0]
          setProduct(adaptedProduct)
        } else {
          setError({ message: 'Product not found' })
        }

      } catch (err) {
        console.error('Error fetching product:', err)
        setError({
          message: adaptShopifyError(err)
        })
      } finally {
        setLoading(false)
      }
    }

    if (handle) {
      fetchProduct()
    }
  }, [handle])

  return { product, loading, error }
}

// Collections Hook
export const useShopifyCollections = (): UseShopifyCollectionsReturn => {
  const [collections, setCollections] = useState<ShopifyCollection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ShopifyApiError | null>(null)

  const fetchCollections = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await shopifyStorefront.getCollections()
      setCollections(response.collections.edges.map(edge => edge.node))

    } catch (err) {
      console.error('Error fetching collections:', err)
      setError({
        message: adaptShopifyError(err)
      })
    } finally {
      setLoading(false)
    }
  }, [])

  const refetch = useCallback(async () => {
    await fetchCollections()
  }, [fetchCollections])

  useEffect(() => {
    fetchCollections()
  }, [fetchCollections])

  return {
    collections,
    loading,
    error,
    refetch
  }
}

// Cart Hook
export const useShopifyCart = (): UseShopifyCartReturn => {
  const [cart, setCart] = useState<AdaptedCart | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ShopifyApiError | null>(null)

  // Initialize cart
  useEffect(() => {
    const initializeCart = async () => {
      try {
        const storedCartId = getStoredCartId()
        
        if (storedCartId) {
          // Try to fetch existing cart
          try {
            const shopifyCart = await shopifyStorefront.getCart(storedCartId)
            if (shopifyCart) {
              setCart(adaptShopifyCart(shopifyCart))
              return
            }
          } catch (err) {
            console.warn('Could not fetch stored cart, creating new one')
            clearStoredCartId()
          }
        }

        // Create new cart
        const newCart = await shopifyStorefront.createCart()
        setCart(adaptShopifyCart(newCart))
        setStoredCartId(newCart.id)

      } catch (err) {
        console.error('Error initializing cart:', err)
        setError({
          message: adaptShopifyError(err)
        })
      }
    }

    initializeCart()
  }, [])

  const addToCart = useCallback(async (variantId: string, quantity: number) => {
    if (!cart) return

    try {
      setLoading(true)
      setError(null)

      const updatedCart = await shopifyStorefront.addToCart(cart.id, [
        { merchandiseId: variantId, quantity }
      ])

      setCart(adaptShopifyCart(updatedCart))

    } catch (err) {
      console.error('Error adding to cart:', err)
      setError({
        message: adaptShopifyError(err)
      })
    } finally {
      setLoading(false)
    }
  }, [cart])

  const updateCartLine = useCallback(async (lineId: string, quantity: number) => {
    if (!cart) return

    try {
      setLoading(true)
      setError(null)

      if (quantity === 0) {
        // Remove line if quantity is 0
        const updatedCart = await shopifyStorefront.removeCartLines(cart.id, [lineId])
        setCart(adaptShopifyCart(updatedCart))
      } else {
        // Update quantity
        const updatedCart = await shopifyStorefront.updateCartLines(cart.id, [
          { id: lineId, quantity }
        ])
        setCart(adaptShopifyCart(updatedCart))
      }

    } catch (err) {
      console.error('Error updating cart line:', err)
      setError({
        message: adaptShopifyError(err)
      })
    } finally {
      setLoading(false)
    }
  }, [cart])

  const removeFromCart = useCallback(async (lineId: string) => {
    if (!cart) return

    try {
      setLoading(true)
      setError(null)

      const updatedCart = await shopifyStorefront.removeCartLines(cart.id, [lineId])
      setCart(adaptShopifyCart(updatedCart))

    } catch (err) {
      console.error('Error removing from cart:', err)
      setError({
        message: adaptShopifyError(err)
      })
    } finally {
      setLoading(false)
    }
  }, [cart])

  const clearCart = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Create new empty cart
      const newCart = await shopifyStorefront.createCart()
      setCart(adaptShopifyCart(newCart))
      setStoredCartId(newCart.id)

    } catch (err) {
      console.error('Error clearing cart:', err)
      setError({
        message: adaptShopifyError(err)
      })
    } finally {
      setLoading(false)
    }
  }, [])

  const checkout = useCallback(() => {
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl
    }
  }, [cart])

  return {
    cart,
    loading,
    error,
    addToCart,
    updateCartLine,
    removeFromCart,
    clearCart,
    checkout
  }
}

// Search Hook
export const useShopifySearch = (query: string) => {
  const [results, setResults] = useState<AdaptedProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ShopifyApiError | null>(null)

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults([])
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await shopifyStorefront.searchProducts(searchQuery)
      const adaptedProducts = adaptShopifyProducts(
        response.products.edges.map(edge => edge.node)
      )

      setResults(adaptedProducts)

    } catch (err) {
      console.error('Error searching products:', err)
      setError({
        message: adaptShopifyError(err)
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      search(query)
    }, 300) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [query, search])

  return {
    results,
    loading,
    error,
    search
  }
}

// Collection Products Hook
export const useShopifyCollectionProducts = (handle: string) => {
  const [products, setProducts] = useState<AdaptedProduct[]>([])
  const [collection, setCollection] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ShopifyApiError | null>(null)

  useEffect(() => {
    const fetchCollectionProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        const collectionData = await shopifyStorefront.getCollectionProducts(handle)
        
        if (collectionData) {
          setCollection(collectionData)
          const adaptedProducts = adaptShopifyProducts(
            collectionData.products.edges.map((edge: any) => edge.node)
          )
          setProducts(adaptedProducts)
        } else {
          setError({ message: 'Collection not found' })
        }

      } catch (err) {
        console.error('Error fetching collection products:', err)
        setError({
          message: adaptShopifyError(err)
        })
      } finally {
        setLoading(false)
      }
    }

    if (handle) {
      fetchCollectionProducts()
    }
  }, [handle])

  return { products, collection, loading, error }
}