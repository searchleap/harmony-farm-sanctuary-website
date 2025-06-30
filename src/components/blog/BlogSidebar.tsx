// BlogSidebar Component for Harmony Farm Sanctuary
// Sidebar with recent posts, categories, and additional blog navigation

import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, TrendingUp, Users, Tag, ExternalLink } from 'lucide-react';
import { BlogPost } from '../../types/blog';
import { getRecentBlogPosts, getMostPopularBlogPosts, getCategoryStats, getTagStats } from '../../utils/blogHelpers';
import { BlogPreview } from './BlogPreview';
import { BlogCategories } from './BlogCategories';

interface BlogSidebarProps {
  currentPostId?: string;
  showRecentPosts?: boolean;
  showPopularPosts?: boolean;
  showCategories?: boolean;
  showTags?: boolean;
  showNewsletter?: boolean;
  className?: string;
}

export const BlogSidebar: React.FC<BlogSidebarProps> = ({
  currentPostId,
  showRecentPosts = true,
  showPopularPosts = true,
  showCategories = true,
  showTags = true,
  showNewsletter = true,
  className = ''
}) => {
  console.log('BlogSidebar rendering:', { currentPostId, showRecentPosts, showPopularPosts });

  const recentPosts = getRecentBlogPosts(5).filter(post => post.id !== currentPostId);
  const popularPosts = getMostPopularBlogPosts(5).filter(post => post.id !== currentPostId);
  const categoryStats = getCategoryStats();
  const tagStats = getTagStats().slice(0, 12); // Show top 12 tags

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Newsletter Signup */}
      {showNewsletter && (
        <div className="bg-gradient-to-br from-sanctuary-primary to-sanctuary-secondary rounded-xl p-6 text-white">
          <h3 className="text-lg font-bold mb-3">Stay Updated</h3>
          <p className="text-sm mb-4 text-white/90">
            Get the latest animal stories and sanctuary news delivered to your inbox.
          </p>
          <div className="space-y-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button className="w-full bg-white text-sanctuary-primary font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
          <p className="text-xs text-white/70 mt-2">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      )}

      {/* Recent Posts */}
      {showRecentPosts && recentPosts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-sanctuary-primary" />
            <h3 className="text-lg font-bold text-gray-900">Recent Articles</h3>
          </div>
          <div className="space-y-4">
            {recentPosts.map(post => (
              <BlogPreview
                key={post.id}
                post={post}
                variant="sidebar"
              />
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1 text-sanctuary-primary hover:text-sanctuary-primary/80 font-medium text-sm"
            >
              View All Articles
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Popular Posts */}
      {showPopularPosts && popularPosts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-sanctuary-primary" />
            <h3 className="text-lg font-bold text-gray-900">Popular Articles</h3>
          </div>
          <div className="space-y-4">
            {popularPosts.map((post, index) => (
              <div key={post.id} className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-sanctuary-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <BlogPreview
                  post={post}
                  variant="sidebar"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      {showCategories && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-5 h-5 text-sanctuary-primary" />
            <h3 className="text-lg font-bold text-gray-900">Categories</h3>
          </div>
          <div className="space-y-2">
            {categoryStats.map(({ category, postCount }) => (
              <Link
                key={category.id}
                to={`/blog/category/${category.slug}`}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <span className="text-gray-700 group-hover:text-sanctuary-primary">
                  {category.name}
                </span>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {postCount}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Popular Tags */}
      {showTags && tagStats.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-5 h-5 text-sanctuary-primary" />
            <h3 className="text-lg font-bold text-gray-900">Popular Tags</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {tagStats.map(({ tag, postCount }) => (
              <Link
                key={tag.id}
                to={`/blog/tag/${tag.slug}`}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-sanctuary-primary hover:text-white transition-colors"
              >
                <span>{tag.name}</span>
                <span className="text-xs opacity-75">({postCount})</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Social Links */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-sanctuary-primary" />
          <h3 className="text-lg font-bold text-gray-900">Follow Us</h3>
        </div>
        <div className="space-y-3">
          <a
            href="https://facebook.com/HarmonyFarmSanctuary"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">f</span>
            </div>
            <span className="text-gray-700">Facebook</span>
          </a>
          <a
            href="https://instagram.com/harmonyfarmor"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">📷</span>
            </div>
            <span className="text-gray-700">Instagram</span>
          </a>
          <a
            href="https://twitter.com/HarmonyFarmSanctuary"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">𝕏</span>
            </div>
            <span className="text-gray-700">Twitter</span>
          </a>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h3>
        <div className="space-y-2">
          <Link
            to="/animals"
            className="block text-gray-700 hover:text-sanctuary-primary transition-colors"
          >
            Meet Our Animals
          </Link>
          <Link
            to="/volunteer"
            className="block text-gray-700 hover:text-sanctuary-primary transition-colors"
          >
            Volunteer Opportunities
          </Link>
          <Link
            to="/donate"
            className="block text-gray-700 hover:text-sanctuary-primary transition-colors"
          >
            Make a Donation
          </Link>
          <Link
            to="/visit"
            className="block text-gray-700 hover:text-sanctuary-primary transition-colors"
          >
            Plan Your Visit
          </Link>
        </div>
      </div>
    </div>
  );
};