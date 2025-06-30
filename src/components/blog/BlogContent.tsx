// BlogContent Component for Harmony Farm Sanctuary
// Main content display for individual blog posts with rich formatting

import React from 'react';
import { Calendar, Clock, Eye, Heart, Share2, User } from 'lucide-react';
import { BlogPost } from '../../types/blog';
import { formatBlogDate } from '../../utils/blogHelpers';
import { CategoryBadge } from './CategoryBadge';
import { AuthorByline } from './AuthorByline';
import { SocialShare } from './SocialShare';
import { BlogGallery } from './BlogGallery';

interface BlogContentProps {
  post: BlogPost;
  showStats?: boolean;
  showSocialShare?: boolean;
  showGallery?: boolean;
  className?: string;
}

export const BlogContent: React.FC<BlogContentProps> = ({
  post,
  showStats = true,
  showSocialShare = true,
  showGallery = true,
  className = ''
}) => {
  console.log('BlogContent rendering:', { title: post.title, showStats, showSocialShare });

  // Function to process content and handle HTML
  const processContent = (content: string) => {
    // In a real app, you'd want to use a proper HTML sanitizer
    // For now, we'll safely render the HTML content
    return { __html: content };
  };

  return (
    <article className={`bg-white ${className}`}>
      {/* Header Section */}
      <header className="mb-8">
        {/* Category and Meta Info */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
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
              <span>{formatBlogDate(post.publishedAt, 'long')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{post.readTime} min read</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Excerpt */}
        <div className="text-xl text-gray-600 mb-6 leading-relaxed">
          {post.excerpt}
        </div>

        {/* Author and Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200">
          <AuthorByline 
            author={post.author} 
            publishedAt={post.publishedAt}
            variant="default"
            showDate={false}
          />

          {showStats && (
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
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
          )}
        </div>
      </header>

      {/* Featured Image */}
      <div className="mb-8">
        <div className="relative overflow-hidden rounded-xl">
          <img
            src={post.featuredImage}
            alt={post.featuredImageAlt}
            className="w-full h-64 md:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
        <p className="text-sm text-gray-600 mt-2 italic">
          {post.featuredImageAlt}
        </p>
      </div>

      {/* Social Share - Top */}
      {showSocialShare && (
        <div className="mb-8">
          <SocialShare post={post} variant="horizontal" />
        </div>
      )}

      {/* Main Content */}
      <div className="prose prose-lg max-w-none mb-8">
        <div 
          dangerouslySetInnerHTML={processContent(post.content)}
          className="
            [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mt-8 [&>h2]:mb-4
            [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-gray-900 [&>h3]:mt-6 [&>h3]:mb-3
            [&>p]:text-gray-700 [&>p]:mb-4 [&>p]:leading-relaxed
            [&>ul]:mb-4 [&>ul>li]:text-gray-700 [&>ul>li]:mb-2
            [&>ol]:mb-4 [&>ol>li]:text-gray-700 [&>ol>li]:mb-2
            [&>blockquote]:border-l-4 [&>blockquote]:border-sanctuary-primary [&>blockquote]:pl-4 [&>blockquote]:py-2 [&>blockquote]:my-6 [&>blockquote]:bg-gray-50 [&>blockquote]:italic
            [&>blockquote>p]:text-gray-800 [&>blockquote>p]:mb-2
            [&>blockquote>cite]:text-sm [&>blockquote>cite]:text-gray-600 [&>blockquote>cite]:not-italic [&>blockquote>cite]:font-semibold
          "
        />
      </div>

      {/* Gallery */}
      {showGallery && post.gallery && post.gallery.length > 0 && (
        <div className="mb-8">
          <BlogGallery media={post.gallery} />
        </div>
      )}

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <a
                key={tag.id}
                href={`/blog/tag/${tag.slug}`}
                className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-sanctuary-primary hover:text-white transition-colors"
              >
                #{tag.name}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Social Share - Bottom */}
      {showSocialShare && (
        <div className="mb-8 pt-6 border-t border-gray-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Share This Article</h3>
            <SocialShare post={post} variant="horizontal" showLabels />
          </div>
        </div>
      )}

      {/* Updated Date */}
      {post.updatedAt && post.updatedAt !== post.publishedAt && (
        <div className="text-sm text-gray-500 pt-6 border-t border-gray-200">
          <p>
            Last updated: {formatBlogDate(post.updatedAt, 'long')}
          </p>
        </div>
      )}
    </article>
  );
};