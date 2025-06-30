// RelatedPosts Component for Harmony Farm Sanctuary
// Display related blog posts based on category and tags

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { BlogPost } from '../../types/blog';
import { getRelatedPosts } from '../../utils/blogHelpers';
import { BlogCard } from './BlogCard';

interface RelatedPostsProps {
  currentPost: BlogPost;
  limit?: number;
  showTitle?: boolean;
  variant?: 'grid' | 'list' | 'carousel';
  className?: string;
}

export const RelatedPosts: React.FC<RelatedPostsProps> = ({
  currentPost,
  limit = 3,
  showTitle = true,
  variant = 'grid',
  className = ''
}) => {
  console.log('RelatedPosts rendering:', { currentPostTitle: currentPost.title, limit, variant });

  const relatedPosts = getRelatedPosts(currentPost.id, limit);

  if (relatedPosts.length === 0) {
    return null;
  }

  const containerClasses = {
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    list: 'space-y-4',
    carousel: 'flex gap-6 overflow-x-auto pb-4'
  };

  return (
    <section className={`${className}`}>
      {showTitle && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Related Articles</h2>
          <p className="text-gray-600">
            More stories from {currentPost.category.name.toLowerCase()} and related topics
          </p>
        </div>
      )}

      <div className={containerClasses[variant]}>
        {relatedPosts.map(post => (
          <div key={post.id} className={variant === 'carousel' ? 'flex-shrink-0 w-80' : ''}>
            <BlogCard
              post={post}
              variant={variant === 'list' ? 'compact' : 'default'}
              showExcerpt={variant !== 'carousel'}
              showAuthor={variant !== 'carousel'}
              showStats={variant === 'grid'}
            />
          </div>
        ))}
      </div>

      {/* View More Link */}
      <div className="mt-8 text-center">
        <a
          href={`/blog/category/${currentPost.category.slug}`}
          className="inline-flex items-center gap-2 text-sanctuary-primary hover:text-sanctuary-primary/80 font-semibold"
        >
          <span>View more {currentPost.category.name.toLowerCase()}</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
};