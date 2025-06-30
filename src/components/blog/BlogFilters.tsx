// BlogFilters Component for Harmony Farm Sanctuary
// Advanced filtering and sorting interface for blog posts

import React, { useState } from 'react';
import { Search, Filter, X, ChevronDown, Calendar, User, Tag, SlidersHorizontal } from 'lucide-react';
import { BlogSearchParams, BlogCategory, BlogTag, Author } from '../../types/blog';
import { blogCategories } from '../../data/blogCategories';
import { blogTags } from '../../data/blogPosts';
import { authors } from '../../data/authors';
import { Button } from '../ui/Button';

interface BlogFiltersProps {
  searchParams: BlogSearchParams;
  onSearchChange: (params: BlogSearchParams) => void;
  totalResults: number;
  showAdvanced?: boolean;
  className?: string;
}

export const BlogFilters: React.FC<BlogFiltersProps> = ({
  searchParams,
  onSearchChange,
  totalResults,
  showAdvanced = true,
  className = ''
}) => {
  console.log('BlogFilters rendering:', { searchParams, totalResults });

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Update search parameters
  const updateSearch = (updates: Partial<BlogSearchParams>) => {
    const newParams = { ...searchParams, ...updates, page: 1 }; // Reset to page 1 when filtering
    onSearchChange(newParams);
  };

  // Handle text search
  const handleSearchChange = (query: string) => {
    updateSearch({ query: query || undefined });
  };

  // Handle category filter
  const handleCategoryChange = (categorySlug: string) => {
    updateSearch({ 
      category: categorySlug === searchParams.category ? undefined : categorySlug 
    });
  };

  // Handle tag filter
  const handleTagChange = (tagSlug: string) => {
    updateSearch({ 
      tag: tagSlug === searchParams.tag ? undefined : tagSlug 
    });
  };

  // Handle author filter
  const handleAuthorChange = (authorId: string) => {
    updateSearch({ 
      author: authorId === searchParams.author ? undefined : authorId 
    });
  };

  // Handle sort change
  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    updateSearch({ sortBy: sortBy as any, sortOrder });
  };

  // Clear all filters
  const clearAllFilters = () => {
    onSearchChange({});
    setActiveFilters([]);
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (searchParams.query) count++;
    if (searchParams.category) count++;
    if (searchParams.tag) count++;
    if (searchParams.author) count++;
    if (searchParams.featured !== undefined) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Main Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles, animals, topics..."
              value={searchParams.query || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sanctuary-primary focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            {showAdvanced && (
              <Button
                variant="outline"
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="bg-sanctuary-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {activeFilterCount}
                  </span>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
              </Button>
            )}

            <select
              value={`${searchParams.sortBy || 'date'}-${searchParams.sortOrder || 'desc'}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                handleSortChange(sortBy, sortOrder as 'asc' | 'desc');
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sanctuary-primary focus:border-transparent"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="popularity-desc">Most Popular</option>
              <option value="views-desc">Most Viewed</option>
              <option value="alphabetical-asc">A to Z</option>
              <option value="alphabetical-desc">Z to A</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-3 text-sm text-gray-600">
          {totalResults === 0 ? (
            <span>No articles found</span>
          ) : (
            <span>
              {totalResults} {totalResults === 1 ? 'article' : 'articles'} found
              {searchParams.query && ` for "${searchParams.query}"`}
            </span>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && isAdvancedOpen && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4 inline mr-1" />
                Category
              </label>
              <select
                value={searchParams.category || ''}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sanctuary-primary focus:border-transparent"
              >
                <option value="">All Categories</option>
                {blogCategories.map(category => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tag Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4 inline mr-1" />
                Tag
              </label>
              <select
                value={searchParams.tag || ''}
                onChange={(e) => handleTagChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sanctuary-primary focus:border-transparent"
              >
                <option value="">All Tags</option>
                {blogTags
                  .filter(tag => tag.count > 0)
                  .sort((a, b) => b.count - a.count)
                  .map(tag => (
                    <option key={tag.id} value={tag.slug}>
                      {tag.name} ({tag.count})
                    </option>
                  ))
                }
              </select>
            </div>

            {/* Author Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Author
              </label>
              <select
                value={searchParams.author || ''}
                onChange={(e) => handleAuthorChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sanctuary-primary focus:border-transparent"
              >
                <option value="">All Authors</option>
                {authors.map(author => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Featured Posts Toggle */}
          <div className="mt-4 flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={searchParams.featured === true}
                onChange={(e) => updateSearch({ 
                  featured: e.target.checked ? true : undefined 
                })}
                className="rounded border-gray-300 text-sanctuary-primary focus:ring-sanctuary-primary"
              />
              <span className="text-sm text-gray-700">Featured posts only</span>
            </label>
          </div>

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={clearAllFilters}
                className="flex items-center gap-2 text-sm"
              >
                <X className="w-4 h-4" />
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="p-4 bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {searchParams.query && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-sanctuary-primary text-white rounded-full text-sm">
                Search: "{searchParams.query}"
                <button
                  onClick={() => handleSearchChange('')}
                  className="hover:bg-white/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchParams.category && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Category: {blogCategories.find(c => c.slug === searchParams.category)?.name}
                <button
                  onClick={() => handleCategoryChange('')}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchParams.tag && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Tag: {blogTags.find(t => t.slug === searchParams.tag)?.name}
                <button
                  onClick={() => handleTagChange('')}
                  className="hover:bg-green-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchParams.author && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                Author: {authors.find(a => a.id === searchParams.author)?.name}
                <button
                  onClick={() => handleAuthorChange('')}
                  className="hover:bg-purple-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchParams.featured && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                Featured Only
                <button
                  onClick={() => updateSearch({ featured: undefined })}
                  className="hover:bg-yellow-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};