import { useState, useEffect, useRef } from 'react'
import { Search, X, Filter, Clock } from 'lucide-react'
import { FAQCategory, FAQTag, SearchParams } from '../../types/faq'
import { Button } from '../ui/Button'

interface FAQSearchProps {
  onSearch: (params: SearchParams) => void
  placeholder?: string
  showFilters?: boolean
  categories?: FAQCategory[]
  tags?: FAQTag[]
  initialParams?: SearchParams
}

export function FAQSearch({
  onSearch,
  placeholder = 'Search frequently asked questions...',
  showFilters = true,
  categories = [],
  tags = [],
  initialParams = {}
}: FAQSearchProps) {
  const [query, setQuery] = useState(initialParams.query || '')
  const [selectedCategory, setSelectedCategory] = useState(initialParams.category || '')
  const [selectedTags, setSelectedTags] = useState<string[]>(initialParams.tags || [])
  const [selectedDifficulty, setSelectedDifficulty] = useState(initialParams.difficulty || '')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  
  const searchInputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<number>()
  
  console.log('🔍 FAQSearch rendered:', { 
    query, 
    selectedCategory, 
    selectedTags: selectedTags.length,
    showAdvancedFilters 
  })
  
  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('faq-recent-searches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (e) {
        console.warn('Failed to parse recent searches:', e)
      }
    }
  }, [])
  
  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    
    debounceRef.current = setTimeout(() => {
      performSearch()
    }, 300)
    
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query, selectedCategory, selectedTags, selectedDifficulty])
  
  // Generate search suggestions
  useEffect(() => {
    if (query.length >= 2) {
      const suggestions = generateSuggestions(query)
      setSearchSuggestions(suggestions)
      setShowSuggestions(suggestions.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }, [query])
  
  const performSearch = () => {
    const searchParams: SearchParams = {
      query: query.trim() || undefined,
      category: selectedCategory || undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      difficulty: selectedDifficulty || undefined,
      sortBy: 'relevance',
      sortOrder: 'desc',
      page: 1,
      limit: 10
    }
    
    onSearch(searchParams)
    
    // Save to recent searches if there's a query
    if (query.trim()) {
      saveRecentSearch(query.trim())
    }
    
    console.log('🔍 Search performed:', searchParams)
  }
  
  const generateSuggestions = (query: string): string[] => {
    const commonQuestions = [
      'visiting hours',
      'tour cost',
      'volunteer requirements',
      'donation tax deductible',
      'animal sponsorship',
      'group tours',
      'parking directions',
      'what to bring',
      'animal species',
      'rescue stories',
      'feeding animals',
      'accessibility',
      'children tours',
      'volunteer training',
      'monthly giving'
    ]
    
    const lowerQuery = query.toLowerCase()
    return commonQuestions
      .filter(suggestion => 
        suggestion.toLowerCase().includes(lowerQuery) ||
        lowerQuery.split(' ').some(word => suggestion.toLowerCase().includes(word))
      )
      .slice(0, 5)
  }
  
  const saveRecentSearch = (searchQuery: string) => {
    const updated = [
      searchQuery,
      ...recentSearches.filter(s => s !== searchQuery)
    ].slice(0, 5) // Keep only 5 recent searches
    
    setRecentSearches(updated)
    localStorage.setItem('faq-recent-searches', JSON.stringify(updated))
  }
  
  const handleQueryChange = (value: string) => {
    setQuery(value)
  }
  
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    setShowSuggestions(false)
    searchInputRef.current?.focus()
  }
  
  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }
  
  const clearAllFilters = () => {
    setQuery('')
    setSelectedCategory('')
    setSelectedTags([])
    setSelectedDifficulty('')
    setShowSuggestions(false)
  }
  
  const hasActiveFilters = query || selectedCategory || selectedTags.length > 0 || selectedDifficulty
  
  return (
    <div className="relative">
      {/* Main Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sanctuary-500 focus:border-sanctuary-500 text-gray-900"
            onFocus={() => {
              if (query.length >= 2) setShowSuggestions(true)
            }}
            onBlur={() => {
              // Delay hiding suggestions to allow clicking
              setTimeout(() => setShowSuggestions(false), 200)
            }}
          />
          {query && (
            <button
              onClick={() => {
                setQuery('')
                setShowSuggestions(false)
                searchInputRef.current?.focus()
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
        
        {/* Search Suggestions Dropdown */}
        {showSuggestions && (searchSuggestions.length > 0 || recentSearches.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
            {/* Current suggestions */}
            {searchSuggestions.length > 0 && (
              <div className="p-2">
                <div className="text-xs font-medium text-gray-500 mb-2 px-2">Suggestions</div>
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md text-sm text-gray-700"
                  >
                    <Search className="w-4 h-4 inline mr-2 text-gray-400" />
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            
            {/* Recent searches */}
            {recentSearches.length > 0 && !query && (
              <div className="p-2 border-t border-gray-100">
                <div className="text-xs font-medium text-gray-500 mb-2 px-2 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  Recent Searches
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(search)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md text-sm text-gray-600"
                  >
                    {search}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Filter Controls */}
      {showFilters && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="bg-sanctuary-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {[query, selectedCategory, selectedDifficulty, ...selectedTags].filter(Boolean).length}
                </span>
              )}
            </Button>
            
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-gray-500"
              >
                Clear all
              </Button>
            )}
          </div>
          
          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              {/* Category Filter */}
              {categories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sanctuary-500"
                  >
                    <option value="">All categories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name} ({category.questionCount})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sanctuary-500"
                >
                  <option value="">All levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              
              {/* Tag Filter */}
              {tags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {tags.slice(0, 10).map(tag => (
                      <button
                        key={tag.id}
                        onClick={() => handleTagToggle(tag.id)}
                        className={`
                          px-3 py-1 text-sm rounded-full border transition-colors
                          ${selectedTags.includes(tag.id)
                            ? 'bg-sanctuary-100 border-sanctuary-300 text-sanctuary-800'
                            : 'bg-white border-gray-300 text-gray-600 hover:border-sanctuary-300'
                          }
                        `}
                      >
                        {tag.name}
                        {tag.count > 0 && (
                          <span className="ml-1 text-xs opacity-75">
                            ({tag.count})
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}