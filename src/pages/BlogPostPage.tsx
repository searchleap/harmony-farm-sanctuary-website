// BlogPostPage Component for Harmony Farm Sanctuary
// Individual blog post page with full content, engagement, and related posts

import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Share2, Heart } from 'lucide-react';
import { BlogPost } from '../types/blog';
import { incrementPostViews } from '../utils/blogHelpers';
import { getBlogPostBySlug } from '../data/blogPosts';
import { generateBlogPostMeta, generateBlogPostStructuredData } from '../utils/seoHelpers';
import { SEOHead } from '../components/SEOHead';
import { BlogContent } from '../components/blog/BlogContent';
import { BlogEngagement } from '../components/blog/BlogEngagement';
import { RelatedPosts } from '../components/blog/RelatedPosts';
import { BlogNavigation } from '../components/blog/BlogNavigation';
import { BlogSidebar } from '../components/blog/BlogSidebar';
import { NewsletterSignup } from '../components/blog/NewsletterSignup';
import { CategoryBadge } from '../components/blog/CategoryBadge';
import { AuthorByline } from '../components/blog/AuthorByline';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  console.log('BlogPostPage rendering:', { slug });

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    // Simulate loading delay for better UX
    const timer = setTimeout(() => {
      const foundPost = getBlogPostBySlug(slug);
      setPost(foundPost || null);
      
      // Increment view count
      if (foundPost) {
        incrementPostViews(foundPost.id);
      }
      
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [slug]);

  // Generate SEO meta data
  const seoMeta = post ? generateBlogPostMeta(post) : null;
  const structuredData = post ? generateBlogPostStructuredData(post) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Loading Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="w-3/4 h-8 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Loading Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="w-full h-64 bg-gray-200 rounded-lg animate-pulse mb-8"></div>
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="w-full h-32 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Meta Tags */}
      {seoMeta && (
        <SEOHead
          title={seoMeta.title}
          description={seoMeta.description}
          keywords={seoMeta.keywords}
          canonical={seoMeta.canonical}
          robots={seoMeta.robots}
          
          ogType={seoMeta.ogType}
          ogTitle={seoMeta.ogTitle}
          ogDescription={seoMeta.ogDescription}
          ogImage={seoMeta.ogImage}
          ogUrl={seoMeta.ogUrl}
          ogSiteName={seoMeta.ogSiteName}
          
          twitterCard={seoMeta.twitterCard}
          twitterTitle={seoMeta.twitterTitle}
          twitterDescription={seoMeta.twitterDescription}
          twitterImage={seoMeta.twitterImage}
          twitterSite={seoMeta.twitterSite}
          twitterCreator={seoMeta.twitterCreator}
          
          articlePublishedTime={seoMeta.articlePublishedTime}
          articleModifiedTime={seoMeta.articleModifiedTime}
          articleAuthor={seoMeta.articleAuthor}
          articleSection={seoMeta.articleSection}
          articleTag={seoMeta.articleTag}
          
          structuredData={structuredData || undefined}
        />
      )}
      {/* Header Section */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link to="/" className="hover:text-sanctuary-primary">Home</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-sanctuary-primary">Blog</Link>
            <span>/</span>
            <Link 
              to={`/blog/category/${post.category.slug}`}
              className="hover:text-sanctuary-primary"
            >
              {post.category.name}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">
              {post.title.length > 40 ? `${post.title.substring(0, 40)}...` : post.title}
            </span>
          </nav>

          {/* Back to Blog */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sanctuary-primary hover:text-sanctuary-primary/80 font-medium mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Post Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <CategoryBadge category={post.category} size="lg" />
            
            {post.featured && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                Featured Article
              </span>
            )}
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{post.readTime} min read</span>
              </div>
            </div>
          </div>

          {/* Title and Excerpt */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-6 leading-relaxed max-w-4xl">
            {post.excerpt}
          </p>

          {/* Author and Stats */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <AuthorByline 
              author={post.author} 
              publishedAt={post.publishedAt}
              variant="default"
              showDate={false}
            />

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <span>{post.views.toLocaleString()} views</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{post.likes} likes</span>
              </div>
              <div className="flex items-center gap-1">
                <Share2 className="w-4 h-4" />
                <span>{post.shares} shares</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Article Content */}
          <article className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <BlogContent 
                post={post}
                showStats={false} // Already shown in header
                showSocialShare={true}
                showGallery={true}
              />
            </div>

            {/* Author Bio Section */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={post.author.image}
                    alt={`${post.author.name} profile photo`}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    About {post.author.name}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {post.author.bio}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.author.specialties.slice(0, 4).map(specialty => (
                      <span
                        key={specialty}
                        className="px-3 py-1 bg-sanctuary-primary/10 text-sanctuary-primary rounded-full text-sm"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{post.author.yearsAtSanctuary} years at Harmony Farm</span>
                    <span>•</span>
                    <span>{post.author.role}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Posts */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <RelatedPosts currentPost={post} />
            </div>

            {/* Post Navigation */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <BlogNavigation currentPost={post} />
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Floating Engagement (will be positioned absolutely) */}
              <BlogEngagement 
                post={post} 
                variant="floating" 
                showReadingProgress
                showEstimatedTime
              />
              
              {/* Sidebar Content */}
              <BlogSidebar 
                currentPostId={post.id}
                showRecentPosts
                showPopularPosts
                showCategories
                showTags
                showNewsletter={false} // We'll show it below
              />
            </div>
          </aside>
        </div>
      </main>

      {/* Newsletter Signup */}
      <section className="container mx-auto px-4 pb-16">
        <NewsletterSignup
          variant="inline"
          title="Stay Updated with Our Stories"
          description="Get the latest animal updates and sanctuary news delivered to your inbox."
        />
      </section>

      {/* Call to Action */}
      <section className="bg-sanctuary-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Inspired by {post.author.name}'s Story?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Your support helps us continue rescuing animals and sharing their stories. 
              Every contribution makes a difference in the lives of farm animals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/donate"
                className="bg-sanctuary-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-sanctuary-primary/90 transition-colors"
              >
                Support Our Mission
              </Link>
              <Link
                to="/volunteer"
                className="bg-white text-sanctuary-primary border border-sanctuary-primary px-8 py-3 rounded-lg font-semibold hover:bg-sanctuary-primary/5 transition-colors"
              >
                Become a Volunteer
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};