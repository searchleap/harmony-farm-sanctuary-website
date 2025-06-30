// BlogPage Component for Harmony Farm Sanctuary
// Main blog landing page with featured content, filters, and post listings

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users } from 'lucide-react';
import { BlogSearchParams } from '../types/blog';
import { searchBlogPosts, getBlogAnalytics } from '../utils/blogHelpers';
import { getFeaturedBlogPosts } from '../data/blogPosts';
import { generateBlogListingStructuredData } from '../utils/seoHelpers';
import { SEOHead } from '../components/SEOHead';
import { BlogFilters } from '../components/blog/BlogFilters';
import { BlogCard } from '../components/blog/BlogCard';
import { BlogPreview } from '../components/blog/BlogPreview';
import { BlogCategories } from '../components/blog/BlogCategories';
import { BlogSidebar } from '../components/blog/BlogSidebar';
import { NewsletterSignup } from '../components/blog/NewsletterSignup';
import { Button } from '../components/ui/Button';

export const BlogPage: React.FC = () => {
  console.log('BlogPage rendering');

  const [searchParams, setSearchParams] = useState<BlogSearchParams>({
    page: 1,
    limit: 9,
    sortBy: 'date',
    sortOrder: 'desc'
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Get blog data
  const featuredPosts = getFeaturedBlogPosts();
  const searchResults = useMemo(() => 
    searchBlogPosts({ ...searchParams, category: selectedCategory || searchParams.category }),
    [searchParams, selectedCategory]
  );
  const analytics = getBlogAnalytics();

  const handleSearchChange = (newParams: BlogSearchParams) => {
    setSearchParams(newParams);
    setSelectedCategory(''); // Clear category selection when using search
  };

  const handleCategorySelect = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setSearchParams({ ...searchParams, page: 1, category: undefined }); // Clear search params
  };

  const handleLoadMore = () => {
    setSearchParams(prev => ({
      ...prev,
      page: (prev.page || 1) + 1
    }));
  };

  // Pagination logic
  const hasMorePosts = searchResults.currentPage < searchResults.totalPages;
  
  // Generate SEO data
  const structuredData = generateBlogListingStructuredData(searchResults.posts, 'blog');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Meta Tags */}
      <SEOHead
        title="Blog - Stories from the Sanctuary | Harmony Farm Sanctuary"
        description="Discover heartwarming animal stories, educational insights, and the latest news from our farm animal sanctuary. Read about rescue stories, animal care, and compassionate living."
        keywords="farm animal sanctuary, animal rescue stories, pig intelligence, animal welfare, vegan education, sanctuary news, animal updates"
        canonical="https://harmonyfarm.org/blog"
        
        ogType="website"
        ogTitle="Blog - Stories from the Sanctuary"
        ogDescription="Discover heartwarming animal stories, educational insights, and the latest news from our farm animal sanctuary."
        ogImage="https://harmonyfarm.org/images/blog-og-image.jpg"
        ogUrl="https://harmonyfarm.org/blog"
        
        twitterTitle="Blog - Stories from the Sanctuary"
        twitterDescription="Discover heartwarming animal stories, educational insights, and the latest news from our farm animal sanctuary."
        twitterImage="https://harmonyfarm.org/images/blog-twitter-image.jpg"
        
        structuredData={structuredData}
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sanctuary-primary to-sanctuary-secondary text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Stories from the Sanctuary
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Discover heartwarming animal stories, educational insights, and the latest news from 
              Harmony Farm Sanctuary's mission to provide compassionate care and advocacy for farm animals.
            </p>
            
            {/* Blog Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">{analytics.totalPosts}</div>
                <div className="text-white/80 text-sm">Articles Published</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">{Math.round(analytics.totalViews / 1000)}k</div>
                <div className="text-white/80 text-sm">Total Views</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">{analytics.averageReadTime}</div>
                <div className="text-white/80 text-sm">Avg. Read Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">8</div>
                <div className="text-white/80 text-sm">Categories</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article Hero */}
      {featuredPosts.length > 0 && (
        <section className="container mx-auto px-4 -mt-16 relative z-10">
          <BlogPreview 
            post={featuredPosts[0]} 
            variant="hero"
            className="shadow-2xl"
          />
        </section>
      )}

      {/* Category Navigation */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore by Category</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse our content by topic to find exactly what interests you most
          </p>
        </div>
        
        <BlogCategories
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
          variant="pills"
          showCounts
          showIcons
          className="justify-center"
        />
      </section>

      {/* Featured Posts Grid */}
      {featuredPosts.length > 1 && (
        <section className="container mx-auto px-4 pb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Articles</h2>
              <p className="text-gray-600">Our most impactful and popular stories</p>
            </div>
            <Link
              to="/blog/featured"
              className="inline-flex items-center gap-2 text-sanctuary-primary hover:text-sanctuary-primary/80 font-semibold"
            >
              View All Featured
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.slice(1, 4).map(post => (
              <BlogPreview
                key={post.id}
                post={post}
                variant="featured"
              />
            ))}
          </div>
        </section>
      )}

      {/* Main Content Area */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Search and Filters */}
            <BlogFilters
              searchParams={searchParams}
              onSearchChange={handleSearchChange}
              totalResults={searchResults.totalCount}
            />

            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory ? (
                    <>
                      {searchResults.categories.find(c => c.slug === selectedCategory)?.name} Articles
                    </>
                  ) : searchParams.query ? (
                    <>Search Results</>
                  ) : (
                    <>Latest Articles</>
                  )}
                </h2>
                <p className="text-gray-600 mt-1">
                  {searchResults.totalCount} {searchResults.totalCount === 1 ? 'article' : 'articles'} found
                  {selectedCategory && ` in ${searchResults.categories.find(c => c.slug === selectedCategory)?.name}`}
                  {searchParams.query && ` for "${searchParams.query}"`}
                </p>
              </div>

              {/* View Toggle */}
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-gray-600">View:</span>
                <div className="flex rounded-lg overflow-hidden border border-gray-300">
                  <button className="px-3 py-1 bg-sanctuary-primary text-white text-sm">
                    Grid
                  </button>
                  <button className="px-3 py-1 bg-white text-gray-600 hover:bg-gray-50 text-sm">
                    List
                  </button>
                </div>
              </div>
            </div>

            {/* Blog Posts Grid */}
            {searchResults.posts.length > 0 ? (
              <>
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

                {/* Load More / Pagination */}
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
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600 mb-6">
                  {searchParams.query 
                    ? `No articles match your search for "${searchParams.query}"`
                    : selectedCategory
                    ? `No articles found in this category yet`
                    : "No articles available"
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={() => {
                      setSearchParams({ page: 1, limit: 9, sortBy: 'date', sortOrder: 'desc' });
                      setSelectedCategory('');
                    }}
                    variant="outline"
                  >
                    Clear Filters
                  </Button>
                  <Link to="/animals">
                    <Button>
                      Meet Our Animals
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <BlogSidebar />
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="container mx-auto px-4 pb-16">
        <NewsletterSignup
          title="Never Miss a Story"
          description="Get heartwarming animal updates and sanctuary news delivered to your inbox weekly."
        />
      </section>

      {/* Call to Action Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Become Part of Our Story
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Your support helps us rescue, care for, and advocate for farm animals. 
              Join our community and make a difference today.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                to="/volunteer"
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
              >
                <Users className="w-8 h-8 text-sanctuary-primary mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Volunteer</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Join our team of dedicated volunteers
                </p>
                <span className="text-sanctuary-primary font-medium text-sm group-hover:underline">
                  Learn More →
                </span>
              </Link>

              <Link
                to="/donate"
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="w-8 h-8 text-sanctuary-primary mx-auto mb-4 text-2xl">💝</div>
                <h3 className="font-semibold text-gray-900 mb-2">Donate</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Support our animals with a donation
                </p>
                <span className="text-sanctuary-primary font-medium text-sm group-hover:underline">
                  Give Now →
                </span>
              </Link>

              <Link
                to="/animals"
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="w-8 h-8 text-sanctuary-primary mx-auto mb-4 text-2xl">🐷</div>
                <h3 className="font-semibold text-gray-900 mb-2">Meet Animals</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Get to know our rescue animals
                </p>
                <span className="text-sanctuary-primary font-medium text-sm group-hover:underline">
                  Visit Gallery →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};