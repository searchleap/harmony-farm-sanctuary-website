import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Search, 
  X, 
  Clock, 
  TrendingUp, 
  Filter,
  ArrowRight,
  Star,
  FileText,
  Play,
  BookOpen,
  Image,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { EducationalResource } from '../../types/faq';

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'query' | 'category' | 'tag' | 'resource';
  count?: number;
  icon?: React.ReactNode;
  metadata?: {
    category?: string;
    resourceType?: string;
    popularity?: number;
  };
}

export interface SearchResult {
  resource: EducationalResource;
  score: number;
  matchedFields: string[];
  excerpt?: string;
}

interface ResourceSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch?: (query: string) => void;
  suggestions?: SearchSuggestion[];
  recentSearches?: string[];
  popularSearches?: string[];
  results?: SearchResult[];
  isLoading?: boolean;
  variant?: 'default' | 'compact' | 'hero' | 'modal';
  showFilters?: boolean;
  showSuggestions?: boolean;
  showRecentSearches?: boolean;
  placeholder?: string;
  className?: string;
}

const getResourceTypeIcon = (type: string): React.ReactNode => {
  switch (type) {
    case 'pdf':
      return <FileText className="w-4 h-4 text-red-600" />;
    case 'video':
      return <Play className="w-4 h-4 text-blue-600" />;
    case 'article':
      return <BookOpen className="w-4 h-4 text-green-600" />;
    case 'infographic':
      return <Image className="w-4 h-4 text-purple-600" />;
    default:
      return <FileText className="w-4 h-4 text-gray-600" />;
  }
};

const highlightText = (text: string, query: string): React.ReactNode => {
  if (!query.trim()) return text;
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark key={index} className="bg-yellow-200 text-gray-900 px-1 rounded">
        {part}
      </mark>
    ) : (
      part
    )
  );
};

export const ResourceSearch: React.FC<ResourceSearchProps> = ({
  searchQuery,
  onSearchChange,
  onSearch,
  suggestions = [],
  recentSearches = [],
  popularSearches = [],
  results = [],
  isLoading = false,
  variant = 'default',
  showFilters = true,
  showSuggestions = true,
  showRecentSearches = true,
  placeholder = 'Search educational resources...',
  className = ''
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch?.(searchQuery.trim());
      setIsFocused(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onSearchChange(suggestion.text);
    onSearch?.(suggestion.text);
    setIsFocused(false);
  };

  const handleClearSearch = () => {
    onSearchChange('');
    inputRef.current?.focus();
  };

  const showDropdown = isFocused && (
    (showSuggestions && suggestions.length > 0) ||
    (showRecentSearches && searchQuery.length === 0 && (recentSearches.length > 0 || popularSearches.length > 0))
  );

  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`}>
        <form onSubmit={handleSubmit} className="relative">
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </form>
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div className={`w-full max-w-2xl mx-auto ${className}`}>
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              placeholder={placeholder}
              className="w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary shadow-sm"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleClearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
          
          <Button
            type="submit"
            variant="primary"
            className="w-full mt-4 py-3 text-lg"
            disabled={!searchQuery.trim() || isLoading}
          >
            {isLoading ? (
              <>
                <Search className="w-5 h-5 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                Search Resources
              </>
            )}
          </Button>
        </form>

        {showDropdown && (
          <Card className="absolute top-full left-0 right-0 mt-2 p-4 bg-white border shadow-lg z-50">
            <SearchDropdownContent
              searchQuery={searchQuery}
              suggestions={suggestions}
              recentSearches={recentSearches}
              popularSearches={popularSearches}
              onSuggestionClick={handleSuggestionClick}
              showSuggestions={showSuggestions}
              showRecentSearches={showRecentSearches}
            />
          </Card>
        )}
      </div>
    );
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-gray-900">Search Resources</h3>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="flex gap-3 mt-4">
          <Button
            type="submit"
            variant="primary"
            disabled={!searchQuery.trim() || isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Search className="w-4 h-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Search
              </>
            )}
          </Button>
          
          {showFilters && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </Button>
          )}
        </div>

        {showDropdown && (
          <Card className="absolute top-full left-0 right-0 mt-2 p-4 bg-white border shadow-lg z-50">
            <SearchDropdownContent
              searchQuery={searchQuery}
              suggestions={suggestions}
              recentSearches={recentSearches}
              popularSearches={popularSearches}
              onSuggestionClick={handleSuggestionClick}
              showSuggestions={showSuggestions}
              showRecentSearches={showRecentSearches}
            />
          </Card>
        )}
      </form>

      {showAdvanced && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Advanced Search Options</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resource Type
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary">
                <option value="">All Types</option>
                <option value="pdf">PDF Documents</option>
                <option value="video">Videos</option>
                <option value="article">Articles</option>
                <option value="infographic">Infographics</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty Level
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary">
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">
              Search Results ({results.length})
            </h4>
            <Button variant="outline" size="sm">
              View All Results
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {results.slice(0, 3).map((result) => (
              <div key={result.resource.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getResourceTypeIcon(result.resource.type)}
                  </div>
                  
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900 hover:text-primary cursor-pointer">
                      {highlightText(result.resource.title, searchQuery)}
                    </h5>
                    
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {result.excerpt || result.resource.summary}
                    </p>
                    
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <Badge variant="default" className="text-xs">
                        {result.resource.category.name}
                      </Badge>
                      
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        {result.resource.rating.toFixed(1)}
                      </div>
                      
                      <span>Match: {Math.round(result.score * 100)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

interface SearchDropdownContentProps {
  searchQuery: string;
  suggestions: SearchSuggestion[];
  recentSearches: string[];
  popularSearches: string[];
  onSuggestionClick: (suggestion: SearchSuggestion) => void;
  showSuggestions: boolean;
  showRecentSearches: boolean;
}

const SearchDropdownContent: React.FC<SearchDropdownContentProps> = ({
  searchQuery,
  suggestions,
  recentSearches,
  popularSearches,
  onSuggestionClick,
  showSuggestions,
  showRecentSearches
}) => {
  if (searchQuery.length > 0 && showSuggestions && suggestions.length > 0) {
    return (
      <div>
        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Suggestions
        </h4>
        <div className="space-y-1">
          {suggestions.slice(0, 5).map((suggestion) => (
            <Button
              key={suggestion.id}
              variant="ghost"
              onClick={() => onSuggestionClick(suggestion)}
              className="w-full justify-between text-left p-2 h-auto"
            >
              <div className="flex items-center gap-2">
                {suggestion.icon || <Search className="w-4 h-4 text-gray-400" />}
                <span className="text-sm">{highlightText(suggestion.text, searchQuery)}</span>
                {suggestion.type !== 'query' && (
                  <Badge variant="default" className="text-xs">
                    {suggestion.type}
                  </Badge>
                )}
              </div>
              {suggestion.count && (
                <span className="text-xs text-gray-500">{suggestion.count} results</span>
              )}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  if (searchQuery.length === 0 && showRecentSearches) {
    return (
      <div className="space-y-4">
        {recentSearches.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-600" />
              Recent Searches
            </h4>
            <div className="flex flex-wrap gap-2">
              {recentSearches.slice(0, 5).map((search, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => onSuggestionClick({ id: `recent-${index}`, text: search, type: 'query' })}
                  className="text-xs"
                >
                  {search}
                </Button>
              ))}
            </div>
          </div>
        )}

        {popularSearches.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Popular Searches
            </h4>
            <div className="flex flex-wrap gap-2">
              {popularSearches.slice(0, 5).map((search, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => onSuggestionClick({ id: `popular-${index}`, text: search, type: 'query' })}
                  className="text-xs"
                >
                  {search}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="text-center text-gray-500 py-4">
      <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
      <p className="text-sm">Start typing to see suggestions</p>
    </div>
  );
};