// BlogSearchPage Component for Harmony Farm Sanctuary
// Dedicated search results page with advanced filtering

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ArrowLeft, Zap, Clock, TrendingUp } from 'lucide-react';
import { BlogSearchParams } from '../types/blog';
import { searchBlogPosts } from '../utils/blogHelpers';
import { BlogCard } from '../components/blog/BlogCard';
import { BlogFilters } from '../components/blog/BlogFilters';
import { BlogCategories } from '../components/blog/BlogCategories';
import { BlogSidebar } from '../components/blog/BlogSidebar';
import { Button } from '../components/ui/Button';

export const BlogSearchPage: React.FC = () => {
  const [urlParams, setUrlParams] = useSearchParams();
  const [searchState, setSearchState] = useState<BlogSearchParams>({
    query: urlParams.get('q') || '',
    category: urlParams.get('category') || undefined,
    tag: urlParams.get('tag') || undefined,
    sortBy: (urlParams.get('sort') as any) || 'date',
    sortOrder: (urlParams.get('order') as any) || 'desc',
    page: parseInt(urlParams.get('page') || '1'),
    limit: 12
  });

  console.log('BlogSearchPage rendering:', { searchState });

  const searchResults = useMemo(() => 
    searchBlogPosts(searchState),
    [searchState]
  );

  // Update URL params when search state changes
  useEffect(() => {
    const newParams = new URLSearchParams();
    
    if (searchState.query) newParams.set('q', searchState.query);
    if (searchState.category) newParams.set('category', searchState.category);
    if (searchState.tag) newParams.set('tag', searchState.tag);
    if (searchState.sortBy && searchState.sortBy !== 'date') newParams.set('sort', searchState.sortBy);
    if (searchState.sortOrder && searchState.sortOrder !== 'desc') newParams.set('order', searchState.sortOrder);
    if (searchState.page && searchState.page > 1) newParams.set('page', searchState.page.toString());

    setUrlParams(newParams);
  }, [searchState, setUrlParams]);

  // Update document title for SEO
  useEffect(() => {
    const title = searchState.query 
      ? `Search: "${searchState.query}" | Harmony Farm Sanctuary Blog`
      : 'Search Articles | Harmony Farm Sanctuary Blog';
    document.title = title;
    
    return () => {
      document.title = 'Harmony Farm Sanctuary';
    };
  }, [searchState.query]);

  const handleSearchChange = (newParams: BlogSearchParams) => {
    setSearchState(newParams);
  };

  const handleLoadMore = () => {
    setSearchState(prev => ({
      ...prev,
      page: (prev.page || 1) + 1
    }));
  };

  const hasMorePosts = searchResults.currentPage < searchResults.totalPages;

  // Popular search terms (in a real app, this would come from analytics)
  const popularSearches = [
    'pig intelligence',
    'rescue stories',
    'animal care',
    'winter shelter',
    'volunteers',
    'sanctuary news',
    'behind the scenes',
    'medical care'
  ];

  const handlePopularSearch = (term: string) => {
    setSearchState(prev => ({
      ...prev,
      query: term,
      page: 1
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link to="/" className="hover:text-sanctuary-primary">Home</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-sanctuary-primary">Blog</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Search</span>
          </nav>

          {/* Back to Blog */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sanctuary-primary hover:text-sanctuary-primary/80 font-medium mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Articles
          </Link>

          {/* Search Header */}
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <Search className="w-8 h-8 text-sanctuary-primary" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {searchState.query ? 'Search Results' : 'Search Articles'}
              </h1>
            </div>
            
            <p className="text-lg text-gray-600 mb-6">
              {searchState.query ? (
                <>
                  {searchResults.totalCount > 0 ? (
                    <>Found {searchResults.totalCount} {searchResults.totalCount === 1 ? 'article' : 'articles'} for "{searchState.query}"</>
                  ) : (
                    <>No articles found for "{searchState.query}"</>
                  )}
                </>
              ) : (
                'Search through our collection of animal stories, sanctuary updates, and educational content.'
              )}
            </p>

            {/* Search Stats */}
            {searchState.query && searchResults.totalCount > 0 && (
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>
                    Avg. {Math.round(searchResults.posts.reduce((sum, post) => sum + post.readTime, 0) / searchResults.posts.length)} min read
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>
                    {Math.round(searchResults.posts.reduce((sum, post) => sum + post.views, 0) / searchResults.posts.length).toLocaleString()} avg. views
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Search Results */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Filters */}
            <BlogFilters
              searchParams={searchState}
              onSearchChange={handleSearchChange}
              totalResults={searchResults.totalCount}
              showAdvanced={true}
            />

            {/* Popular Searches */}
            {!searchState.query && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-sanctuary-primary" />
                  <h3 className="text-lg font-semibold text-gray-900">Popular Searches</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map(term => (
                    <button
                      key={term}
                      onClick={() => handlePopularSearch(term)}
                      className="px-3 py-1 bg-gray-100 hover:bg-sanctuary-primary/10 text-gray-700 hover:text-sanctuary-primary rounded-full text-sm transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Category Quick Filter */}
            {!searchState.category && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Browse by Category</h3>
                <BlogCategories
                  selectedCategory={searchState.category}
                  onCategorySelect={(category) => handleSearchChange({ ...searchState, category, page: 1 })}
                  variant="pills"
                  showCounts
                  showIcons
                />
              </div>
            )}

            {/* Search Results */}
            {searchResults.posts.length > 0 ? (
              <>
                {/* Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.posts.map(post => (
                    <BlogCard
                      key={post.id}
                      post={post}
                      variant="default"
                      showExcerpt
                      showStats
                      showAuthor
                    />
                  ))}
                </div>

                {/* Load More */}
                {hasMorePosts && (
                  <div className="text-center pt-8">
                    <Button
                      onClick={handleLoadMore}
                      variant="outline"
                      className="px-8"
                    >
                      Load More Results
                    </Button>
                    <p className="text-sm text-gray-600 mt-2">
                      Showing {searchResults.posts.length} of {searchResults.totalCount} articles
                    </p>
                  </div>
                )}
              </>
            ) : searchState.query ? (
              /* No Results */
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No articles found
                </h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any articles matching "{searchState.query}". 
                  Try adjusting your search terms or browse our categories.
                </p>
                
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={() => handleSearchChange({ query: '', page: 1, limit: 12 })}
                      variant="outline"
                    >
                      Clear Search
                    </Button>
                    <Link to="/blog">
                      <Button>
                        Browse All Articles
                      </Button>
                    </Link>
                  </div>

                  {/* Search Suggestions */}
                  <div className="pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-3">Try searching for:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {popularSearches.slice(0, 4).map(term => (
                        <button
                          key={term}
                          onClick={() => handlePopularSearch(term)}
                          className="px-3 py-1 bg-gray-100 hover:bg-sanctuary-primary/10 text-gray-700 hover:text-sanctuary-primary rounded-full text-sm transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Search Instructions */
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Search className="w-16 h-16 text-sanctuary-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Start Your Search
                </h3>
                <p className="text-gray-600 mb-6">
                  Enter keywords in the search box above to find articles about animals, 
                  sanctuary life, educational topics, and more.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Animal Stories</h4>
                    <p className="text-sm text-gray-600">
                      Search for specific animals or rescue stories
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Educational Content</h4>
                    <p className="text-sm text-gray-600">
                      Find articles about animal welfare and care
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Sanctuary Updates</h4>
                    <p className="text-sm text-gray-600">
                      Stay updated with news and events
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <BlogSidebar 
              showRecentPosts
              showPopularPosts
              showCategories
              showTags
              showNewsletter={false}
            />
          </aside>
        </div>
      </main>
    </div>
  );
};