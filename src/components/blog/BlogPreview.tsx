// BlogPreview Component for Harmony Farm Sanctuary
// Featured blog post preview for homepage and landing sections

import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Calendar } from 'lucide-react';
import { BlogPost } from '../../types/blog';
import { formatBlogDate } from '../../utils/blogHelpers';
import { CategoryBadge } from './CategoryBadge';
import { AuthorByline } from './AuthorByline';

interface BlogPreviewProps {
  post: BlogPost;
  variant?: 'hero' | 'featured' | 'sidebar';
  showFullExcerpt?: boolean;
  className?: string;
}

export const BlogPreview: React.FC<BlogPreviewProps> = ({
  post,
  variant = 'featured',
  showFullExcerpt = false,
  className = ''
}) => {
  console.log('BlogPreview rendering:', { title: post.title, variant });

  if (variant === 'hero') {
    return (
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-sanctuary-primary to-sanctuary-secondary ${className}`}>
        <div className="absolute inset-0">
          <img
            src={post.featuredImage}
            alt={post.featuredImageAlt}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        <div className="relative z-10 p-8 md:p-12 text-white">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-4">
              <CategoryBadge category={post.category} variant="light" />
              <div className="flex items-center gap-2 text-white/80">
                <Calendar className="w-4 h-4" />
                <span>{formatBlogDate(post.publishedAt, 'short')}</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              {post.title}
            </h1>

            <p className="text-lg md:text-xl text-white/90 mb-6 line-clamp-3">
              {post.excerpt}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <AuthorByline 
                author={post.author} 
                publishedAt={post.publishedAt}
                variant="light"
              />

              <Link
                to={`/blog/${post.slug}`}
                className="inline-flex items-center gap-2 bg-white text-sanctuary-primary px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors group"
              >
                Read Full Story
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="flex items-center gap-4 mt-6 text-sm text-white/70">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{post.readTime} min read</span>
              </div>
              <span>•</span>
              <span>{post.views.toLocaleString()} views</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <Link 
        to={`/blog/${post.slug}`}
        className={`block group ${className}`}
      >
        <div className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="relative flex-shrink-0 overflow-hidden rounded-md">
            <img
              src={post.featuredImage}
              alt={post.featuredImageAlt}
              className="w-20 h-20 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <CategoryBadge category={post.category} size="xs" />
              <span className="text-xs text-gray-500">
                {formatBlogDate(post.publishedAt, 'relative')}
              </span>
            </div>

            <h4 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-sanctuary-primary transition-colors mb-1">
              {post.title}
            </h4>

            <div className="flex items-center gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{post.readTime} min</span>
              </div>
              <span>{post.views.toLocaleString()} views</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Default 'featured' variant
  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${className}`}>
      <Link to={`/blog/${post.slug}`} className="block group">
        <div className="relative overflow-hidden">
          <img
            src={post.featuredImage}
            alt={post.featuredImageAlt}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          <div className="absolute top-4 left-4">
            <CategoryBadge category={post.category} />
          </div>

          {post.featured && (
            <div className="absolute top-4 right-4">
              <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                Featured
              </span>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
            <div className="flex items-center gap-2 text-white/90 text-sm mb-2">
              <Calendar className="w-4 h-4" />
              <span>{formatBlogDate(post.publishedAt, 'short')}</span>
              <span>•</span>
              <Clock className="w-4 h-4" />
              <span>{post.readTime} min read</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-sanctuary-primary transition-colors">
            {post.title}
          </h3>

          <p className={`text-gray-600 mb-4 ${showFullExcerpt ? '' : 'line-clamp-3'}`}>
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between">
            <AuthorByline 
              author={post.author} 
              publishedAt={post.publishedAt}
              variant="compact"
            />

            <div className="flex items-center gap-2 text-sanctuary-primary font-semibold text-sm group-hover:gap-3 transition-all">
              <span>Read More</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
            <div className="flex gap-2">
              {post.tags.slice(0, 3).map(tag => (
                <span
                  key={tag.id}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {tag.name}
                </span>
              ))}
            </div>

            <div className="text-sm text-gray-500">
              {post.views.toLocaleString()} views
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};