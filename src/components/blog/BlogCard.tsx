// BlogCard Component for Harmony Farm Sanctuary
// Reusable blog post preview card for listings and grids

import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, Heart, Share2, Calendar } from 'lucide-react';
import { BlogPost } from '../../types/blog';
import { formatBlogDate } from '../../utils/blogHelpers';
import { CategoryBadge } from './CategoryBadge';
import { AuthorByline } from './AuthorByline';

interface BlogCardProps {
  post: BlogPost;
  variant?: 'default' | 'featured' | 'compact' | 'minimal';
  showExcerpt?: boolean;
  showStats?: boolean;
  showAuthor?: boolean;
  className?: string;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  post,
  variant = 'default',
  showExcerpt = true,
  showStats = true,
  showAuthor = true,
  className = ''
}) => {
  console.log('BlogCard rendering:', { title: post.title, variant, showExcerpt });

  const baseClasses = "bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group";
  const variantClasses = {
    default: "h-full",
    featured: "h-full md:flex md:flex-row",
    compact: "h-full flex flex-row space-x-4",
    minimal: "h-full"
  };

  const imageClasses = {
    default: "w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300",
    featured: "w-full md:w-1/2 h-48 md:h-auto object-cover group-hover:scale-105 transition-transform duration-300",
    compact: "w-24 h-24 flex-shrink-0 object-cover rounded-md",
    minimal: "w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
  };

  const contentClasses = {
    default: "p-6",
    featured: "p-6 md:w-1/2 flex flex-col justify-between",
    compact: "flex-1 py-2",
    minimal: "p-4"
  };

  if (variant === 'compact') {
    return (
      <Link 
        to={`/blog/${post.slug}`}
        className={`${baseClasses} ${variantClasses[variant]} p-4 ${className}`}
      >
        <div className="relative overflow-hidden rounded-md">
          <img
            src={post.featuredImage}
            alt={post.featuredImageAlt}
            className={imageClasses[variant]}
          />
          {post.featured && (
            <div className="absolute top-2 left-2">
              <span className="bg-sanctuary-primary text-white px-2 py-1 rounded-full text-xs font-semibold">
                Featured
              </span>
            </div>
          )}
        </div>

        <div className={contentClasses[variant]}>
          <div className="flex items-center gap-2 mb-2">
            <CategoryBadge category={post.category} size="sm" />
            <span className="text-gray-500 text-xs">
              {formatBlogDate(post.publishedAt, 'relative')}
            </span>
          </div>

          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-sanctuary-primary transition-colors">
            {post.title}
          </h3>

          {showStats && (
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{post.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{post.readTime} min</span>
              </div>
            </div>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link 
      to={`/blog/${post.slug}`}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      <div className="relative overflow-hidden">
        <img
          src={post.featuredImage}
          alt={post.featuredImageAlt}
          className={imageClasses[variant]}
        />
        {post.featured && (
          <div className="absolute top-4 left-4">
            <span className="bg-sanctuary-primary text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
              Featured
            </span>
          </div>
        )}
        
        <div className="absolute top-4 right-4">
          <CategoryBadge category={post.category} />
        </div>
      </div>

      <div className={contentClasses[variant]}>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{formatBlogDate(post.publishedAt, 'short')}</span>
            <span className="text-gray-400">•</span>
            <Clock className="w-4 h-4" />
            <span>{post.readTime} min read</span>
          </div>

          <h3 className={`font-bold text-gray-900 mb-3 group-hover:text-sanctuary-primary transition-colors ${
            variant === 'featured' ? 'text-xl md:text-2xl' : 'text-lg'
          }`}>
            {post.title}
          </h3>

          {showExcerpt && (
            <p className={`text-gray-600 mb-4 line-clamp-3 ${
              variant === 'minimal' ? 'text-sm' : ''
            }`}>
              {post.excerpt}
            </p>
          )}

          {showAuthor && (
            <AuthorByline 
              author={post.author} 
              publishedAt={post.publishedAt}
              variant={variant === 'minimal' ? 'compact' : 'default'}
            />
          )}
        </div>

        {showStats && variant !== 'minimal' && (
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{post.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{post.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <Share2 className="w-4 h-4" />
                <span>{post.shares}</span>
              </div>
            </div>

            <div className="flex gap-1">
              {post.tags.slice(0, 2).map(tag => (
                <span
                  key={tag.id}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {tag.name}
                </span>
              ))}
              {post.tags.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{post.tags.length - 2}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};