// BlogNavigation Component for Harmony Farm Sanctuary
// Navigation between blog posts (previous/next)

import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowUp } from 'lucide-react';
import { BlogPost } from '../../types/blog';
import { getPublishedBlogPosts } from '../../data/blogPosts';

interface BlogNavigationProps {
  currentPost: BlogPost;
  showBackToTop?: boolean;
  className?: string;
}

export const BlogNavigation: React.FC<BlogNavigationProps> = ({
  currentPost,
  showBackToTop = true,
  className = ''
}) => {
  console.log('BlogNavigation rendering:', { currentPostTitle: currentPost.title });

  // Get all published posts sorted by date
  const allPosts = getPublishedBlogPosts().sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const currentIndex = allPosts.findIndex(post => post.id === currentPost.id);
  const previousPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={`${className}`}>
      <div className="flex flex-col sm:flex-row items-stretch justify-between gap-4">
        {/* Previous Post */}
        <div className="flex-1">
          {previousPost ? (
            <Link
              to={`/blog/${previousPost.slug}`}
              className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-sanctuary-primary hover:shadow-md transition-all group"
            >
              <div className="flex-shrink-0">
                <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-sanctuary-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-500 mb-1">Previous Article</div>
                <div className="font-semibold text-gray-900 group-hover:text-sanctuary-primary line-clamp-2">
                  {previousPost.title}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {previousPost.category.name}
                </div>
              </div>
              {previousPost.featuredImage && (
                <div className="hidden sm:block flex-shrink-0">
                  <img
                    src={previousPost.featuredImage}
                    alt={previousPost.featuredImageAlt}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                </div>
              )}
            </Link>
          ) : (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg opacity-50">
              <div className="flex items-center gap-3">
                <ChevronLeft className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">No previous article</div>
                  <div className="font-semibold text-gray-400">You're at the beginning!</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Back to Top */}
        {showBackToTop && (
          <div className="flex-shrink-0 flex sm:flex-col justify-center">
            <button
              onClick={scrollToTop}
              className="flex items-center justify-center w-12 h-12 bg-sanctuary-primary text-white rounded-lg hover:bg-sanctuary-primary/90 transition-colors"
              title="Back to top"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Next Post */}
        <div className="flex-1">
          {nextPost ? (
            <Link
              to={`/blog/${nextPost.slug}`}
              className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-sanctuary-primary hover:shadow-md transition-all group text-right"
            >
              {nextPost.featuredImage && (
                <div className="hidden sm:block flex-shrink-0">
                  <img
                    src={nextPost.featuredImage}
                    alt={nextPost.featuredImageAlt}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-500 mb-1">Next Article</div>
                <div className="font-semibold text-gray-900 group-hover:text-sanctuary-primary line-clamp-2">
                  {nextPost.title}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {nextPost.category.name}
                </div>
              </div>
              <div className="flex-shrink-0">
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-sanctuary-primary" />
              </div>
            </Link>
          ) : (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg opacity-50 text-right">
              <div className="flex items-center gap-3 justify-end">
                <div>
                  <div className="text-sm text-gray-500">No next article</div>
                  <div className="font-semibold text-gray-400">You're all caught up!</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <nav className="flex items-center space-x-2 text-sm">
          <Link to="/" className="text-gray-500 hover:text-sanctuary-primary">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link to="/blog" className="text-gray-500 hover:text-sanctuary-primary">
            Blog
          </Link>
          <span className="text-gray-400">/</span>
          <Link 
            to={`/blog/category/${currentPost.category.slug}`} 
            className="text-gray-500 hover:text-sanctuary-primary"
          >
            {currentPost.category.name}
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">
            {currentPost.title.length > 40 
              ? `${currentPost.title.substring(0, 40)}...` 
              : currentPost.title
            }
          </span>
        </nav>
      </div>

      {/* Blog Statistics */}
      <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-500">
        <span>Article {currentIndex + 1} of {allPosts.length}</span>
        <span>•</span>
        <Link to="/blog" className="hover:text-sanctuary-primary">
          View all articles
        </Link>
      </div>
    </nav>
  );
};