// BlogCategoryPage Component for Harmony Farm Sanctuary
// Category-specific blog post listings with filtering and sorting

import React, { useState, useMemo } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { ArrowLeft, Grid3X3, List, Calendar } from 'lucide-react';
import { BlogSearchParams } from '../types/blog';
import { getCategoryBySlug } from '../data/blogCategories';
import { searchBlogPosts } from '../utils/blogHelpers';
import { generateCategoryPageMeta } from '../utils/seoHelpers';
import { BlogCard } from '../components/blog/BlogCard';
import { BlogFilters } from '../components/blog/BlogFilters';
import { BlogSidebar } from '../components/blog/BlogSidebar';
import { NewsletterSignup } from '../components/blog/NewsletterSignup';
import { CategoryBadge } from '../components/blog/CategoryBadge';
import { Button } from '../components/ui/Button';

export const BlogCategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [searchParams, setSearchParams] = useState<BlogSearchParams>({
    page: 1,
    limit: 12,
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  console.log('BlogCategoryPage rendering:', { categorySlug, searchParams });

  const category = categorySlug ? getCategoryBySlug(categorySlug) : null;
  
  const searchResults = useMemo(() => 
    searchBlogPosts({ ...searchParams, category: categorySlug }),
    [searchParams, categorySlug]
  );

  // Update document head for SEO
  React.useEffect(() => {
    if (category) {
      const meta = generateCategoryPageMeta(category.name, category.description, searchResults.totalCount);
      document.title = meta.title;
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', meta.description);
      }
      
      return () => {
        document.title = 'Harmony Farm Sanctuary';
      };
    }
  }, [category, searchResults.totalCount]);

  if (!category) {
    return <Navigate to="/blog" replace />;
  }

  const handleSearchChange = (newParams: BlogSearchParams) => {
    setSearchParams(newParams);
  };

  const handleLoadMore = () => {
    setSearchParams(prev => ({
      ...prev,
      page: (prev.page || 1) + 1
    }));
  };

  const hasMorePosts = searchResults.currentPage < searchResults.totalPages;

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
            <span className="text-gray-900 font-medium">{category.name}</span>
          </nav>

          {/* Back to Blog */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sanctuary-primary hover:text-sanctuary-primary/80 font-medium mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Articles
          </Link>

          {/* Category Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <CategoryBadge 
                  category={category} 
                  size="lg" 
                  clickable={false}
                />
                <span className="text-gray-500">
                  {searchResults.totalCount} {searchResults.totalCount === 1 ? 'article' : 'articles'}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {category.name}
              </h1>
              
              <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
                {category.description}
              </p>
            </div>

            {/* Category Stats */}
            <div className="bg-gray-50 rounded-lg p-6 lg:w-64">
              <h3 className="font-semibold text-gray-900 mb-4">Category Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Articles</span>
                  <span className="font-semibold">{searchResults.totalCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Latest Post</span>
                  <span className="font-semibold text-sm">
                    {searchResults.posts.length > 0 && 
                      new Date(searchResults.posts[0].publishedAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg. Read Time</span>
                  <span className="font-semibold">
                    {searchResults.posts.length > 0 && 
                      Math.round(searchResults.posts.reduce((sum, post) => sum + post.readTime, 0) / searchResults.posts.length)
                    } min
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Article Listing */}
          <div className="lg:col-span-3 space-y-6">
            {/* Filters and View Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Search and Filters */}
              <div className="flex-1">
                <BlogFilters
                  searchParams={searchParams}
                  onSearchChange={handleSearchChange}
                  totalResults={searchResults.totalCount}
                  showAdvanced={false}
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">View:</span>
                <div className="flex rounded-lg overflow-hidden border border-gray-300">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 text-sm flex items-center gap-1 transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-sanctuary-primary text-white' 
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 text-sm flex items-center gap-1 transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-sanctuary-primary text-white' 
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <List className="w-4 h-4" />
                    List
                  </button>
                </div>
              </div>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {searchParams.query ? 'Search Results' : `${category.name} Articles`}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {searchResults.totalCount} {searchResults.totalCount === 1 ? 'article' : 'articles'}
                  {searchParams.query && ` matching "${searchParams.query}"`}
                </p>
              </div>

              {/* Sort Options */}
              <select
                value={`${searchParams.sortBy || 'date'}-${searchParams.sortOrder || 'desc'}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  handleSearchChange({ ...searchParams, sortBy: sortBy as any, sortOrder: sortOrder as any });
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sanctuary-primary focus:border-transparent"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="popularity-desc">Most Popular</option>
                <option value="views-desc">Most Viewed</option>
                <option value="alphabetical-asc">A to Z</option>
              </select>
            </div>

            {/* Blog Posts */}
            {searchResults.posts.length > 0 ? (
              <>
                <div className={
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-6'
                }>
                  {searchResults.posts.map(post => (
                    <BlogCard
                      key={post.id}
                      post={post}
                      variant={viewMode === 'list' ? 'compact' : 'default'}
                      showExcerpt={viewMode === 'grid'}
                      showStats
                      showAuthor={viewMode === 'grid'}
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
                      Load More Articles
                    </Button>
                    <p className="text-sm text-gray-600 mt-2">
                      Showing {searchResults.posts.length} of {searchResults.totalCount} articles
                    </p>
                  </div>
                )}
              </>
            ) : (
              /* No Results */
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No articles found
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchParams.query 
                    ? `No articles in ${category.name} match your search for "${searchParams.query}"`
                    : `No articles have been published in ${category.name} yet`
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={() => handleSearchChange({ page: 1, limit: 12, sortBy: 'date', sortOrder: 'desc' })}
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

      {/* Newsletter Signup */}
      <section className="container mx-auto px-4 pb-16">
        <NewsletterSignup
          variant="inline"
          title={`Never Miss ${category.name} Updates`}
          description={`Get the latest ${category.name.toLowerCase()} stories delivered to your inbox.`}
        />
      </section>

      {/* Related Categories */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Explore Other Topics
            </h2>
            <p className="text-gray-600">
              Discover more stories from our sanctuary
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {searchResults.categories
              .filter(cat => cat.id !== category.id)
              .slice(0, 4)
              .map(cat => (
                <Link
                  key={cat.id}
                  to={`/blog/category/${cat.slug}`}
                  className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center group"
                >
                  <CategoryBadge 
                    category={cat} 
                    clickable={false}
                    className="mx-auto mb-2"
                  />
                  <h3 className="font-semibold text-gray-900 group-hover:text-sanctuary-primary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {cat.postCount} articles
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};