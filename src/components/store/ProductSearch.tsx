// ProductSearch Component
// Task 13 Phase 2 Step 6: Store Navigation & Filtering

import React, { useState, useEffect, useRef } from 'react'
import { Search, X, Clock, TrendingUp } from 'lucide-react'
import { Product } from '../../types/store'
import { getProductSearchSuggestions, searchProducts } from '../../utils/store'

export interface ProductSearchProps {
  products: Product[]
  onSearch: (query: string) => void
  onProductSelect?: (product: Product) => void
  placeholder?: string
  variant?: 'header' | 'inline' | 'expanded' | 'mobile'
  className?: string
  initialQuery?: string
  showSuggestions?: boolean
  showRecentSearches?: boolean
}

export const ProductSearch: React.FC<ProductSearchProps> = ({
  products,
  onSearch,
  onProductSelect,
  placeholder = 'Search products...',
  variant = 'header',
  className = '',
  initialQuery = '',
  showSuggestions = true, // eslint-disable-line @typescript-eslint/no-unused-vars
  showRecentSearches = true
}) => {
  const [query, setQuery] = useState(initialQuery)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<Product[]>([])
  
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<number>()

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('harmony-farm-recent-searches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (error) {
        console.error('Error loading recent searches:', error)
      }
    }
  }, [])

  // Handle query changes with debouncing
  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current)
    }

    if (query.length >= 2) {
      setIsLoading(true)
      debounceRef.current = window.setTimeout(() => {
        const newSuggestions = getProductSearchSuggestions(query, products)
        setSuggestions(newSuggestions)
        
        const results = searchProducts(products, query)
        setSearchResults(results)
        setIsLoading(false)
      }, 300)
    } else {
      setSuggestions([])
      setSearchResults([])
      setIsLoading(false)
    }

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current)
      }
    }
  }, [query, products])

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setIsOpen(value.length > 0 || showRecentSearches)
  }

  const handleInputFocus = () => {
    setIsOpen(query.length > 0 || showRecentSearches)
  }

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return

    const trimmedQuery = searchQuery.trim()
    
    // Add to recent searches
    const newRecentSearches = [
      trimmedQuery,
      ...recentSearches.filter(s => s !== trimmedQuery)
    ].slice(0, 5)
    
    setRecentSearches(newRecentSearches)
    localStorage.setItem('harmony-farm-recent-searches', JSON.stringify(newRecentSearches))

    // Execute search
    onSearch(trimmedQuery)
    setIsOpen(false)
    inputRef.current?.blur()
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    handleSearch(suggestion)
  }

  const handleProductClick = (product: Product) => {
    if (onProductSelect) {
      onProductSelect(product)
    }
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch(query)
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  const clearQuery = () => {
    setQuery('')
    setSuggestions([])
    setSearchResults([])
    onSearch('')
    inputRef.current?.focus()
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('harmony-farm-recent-searches')
  }

  const renderSearchInput = () => {
    const inputClasses = {
      header: 'w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sanctuary-green focus:border-transparent',
      inline: 'w-full pl-10 pr-10 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sanctuary-green focus:border-transparent',
      expanded: 'w-full pl-12 pr-12 py-4 text-xl border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-sanctuary-green focus:border-transparent shadow-lg',
      mobile: 'w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sanctuary-green focus:border-transparent'
    }

    const iconSizes = {
      header: 'w-4 h-4',
      inline: 'w-5 h-5',
      expanded: 'w-6 h-6',
      mobile: 'w-5 h-5'
    }

    return (
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${iconSizes[variant]}`} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={inputClasses[variant]}
        />
        {query && (
          <button
            onClick={clearQuery}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600`}
          >
            <X className={iconSizes[variant]} />
          </button>
        )}
      </div>
    )
  }

  const renderDropdown = () => {
    if (!isOpen) return null

    const showResults = query.length >= 2
    const showRecent = !showResults && showRecentSearches && recentSearches.length > 0

    return (
      <div
        ref={dropdownRef}
        className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
      >
        {isLoading && (
          <div className="p-4 text-center text-gray-500">
            <div className="animate-spin w-6 h-6 border-2 border-sanctuary-green border-t-transparent rounded-full mx-auto mb-2" />
            Searching...
          </div>
        )}

        {/* Search Suggestions */}
        {showResults && !isLoading && suggestions.length > 0 && (
          <div className="p-2 border-b border-gray-100">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide px-2 py-1 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              Suggestions
            </div>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded flex items-center"
              >
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-700">{suggestion}</span>
              </button>
            ))}
          </div>
        )}

        {/* Product Results */}
        {showResults && !isLoading && searchResults.length > 0 && (
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide px-2 py-1">
              Products ({searchResults.length})
            </div>
            {searchResults.slice(0, 5).map((product) => (
              <button
                key={product.id}
                onClick={() => handleProductClick(product)}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded flex items-center space-x-3"
              >
                <img
                  src={product.images[0]?.url || '/api/placeholder/40/40'}
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    ${product.salePrice || product.price}
                    {product.salePrice && (
                      <span className="ml-2 text-xs line-through text-gray-400">
                        ${product.price}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
            {searchResults.length > 5 && (
              <button
                onClick={() => handleSearch(query)}
                className="w-full text-center px-3 py-2 text-sm text-sanctuary-green hover:bg-gray-50 rounded"
              >
                View all {searchResults.length} results
              </button>
            )}
          </div>
        )}

        {/* Recent Searches */}
        {showRecent && (
          <div className="p-2">
            <div className="flex items-center justify-between px-2 py-1">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Recent Searches
              </div>
              <button
                onClick={clearRecentSearches}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                Clear
              </button>
            </div>
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(search)}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded flex items-center"
              >
                <Clock className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-700">{search}</span>
              </button>
            ))}
          </div>
        )}

        {/* No Results */}
        {showResults && !isLoading && suggestions.length === 0 && searchResults.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <div className="text-sm">No results found for "{query}"</div>
            <div className="text-xs text-gray-400 mt-1">
              Try a different search term
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {renderSearchInput()}
      {renderDropdown()}
    </div>
  )
}

export default ProductSearch