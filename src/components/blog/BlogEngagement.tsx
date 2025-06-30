// BlogEngagement Component for Harmony Farm Sanctuary
// Interactive engagement features for blog posts (likes, bookmarks, reading progress)

import React, { useState, useEffect } from 'react';
import { Heart, Bookmark, Share2, Clock, TrendingUp } from 'lucide-react';
import { BlogPost } from '../../types/blog';

interface BlogEngagementProps {
  post: BlogPost;
  variant?: 'floating' | 'inline' | 'compact';
  showReadingProgress?: boolean;
  showEstimatedTime?: boolean;
  className?: string;
}

export const BlogEngagement: React.FC<BlogEngagementProps> = ({
  post,
  variant = 'floating',
  showReadingProgress = true,
  showEstimatedTime = true,
  className = ''
}) => {
  console.log('BlogEngagement rendering:', { postTitle: post.title, variant });

  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [localLikes, setLocalLikes] = useState(post.likes);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Calculate reading progress
  useEffect(() => {
    if (!showReadingProgress) return;

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min((scrollTop / docHeight) * 100, 100);
      setReadingProgress(progress);
    };

    const handleScroll = () => {
      updateProgress();
      
      // Hide/show floating engagement based on scroll position
      if (variant === 'floating') {
        const scrollTop = window.scrollY;
        setIsVisible(scrollTop > 200);
      }
    };

    window.addEventListener('scroll', handleScroll);
    updateProgress();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [showReadingProgress, variant]);

  // Load saved engagement state from localStorage
  useEffect(() => {
    const savedLikes = localStorage.getItem(`blog-likes-${post.id}`);
    const savedBookmarks = localStorage.getItem(`blog-bookmarks-${post.id}`);
    
    if (savedLikes) setIsLiked(true);
    if (savedBookmarks) setIsBookmarked(true);
  }, [post.id]);

  const handleLike = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLocalLikes(prev => newLikedState ? prev + 1 : prev - 1);

    if (newLikedState) {
      localStorage.setItem(`blog-likes-${post.id}`, 'true');
    } else {
      localStorage.removeItem(`blog-likes-${post.id}`);
    }

    // In a real app, you would send this to your API
    console.log(`Post ${post.id} ${newLikedState ? 'liked' : 'unliked'}`);
  };

  const handleBookmark = () => {
    const newBookmarkedState = !isBookmarked;
    setIsBookmarked(newBookmarkedState);

    if (newBookmarkedState) {
      localStorage.setItem(`blog-bookmarks-${post.id}`, JSON.stringify({
        id: post.id,
        title: post.title,
        slug: post.slug,
        savedAt: new Date().toISOString()
      }));
    } else {
      localStorage.removeItem(`blog-bookmarks-${post.id}`);
    }

    console.log(`Post ${post.id} ${newBookmarkedState ? 'bookmarked' : 'unbookmarked'}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-4 text-sm ${className}`}>
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 transition-colors ${
            isLiked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          <span>{formatNumber(localLikes)}</span>
        </button>

        <button
          onClick={handleBookmark}
          className={`flex items-center gap-1 transition-colors ${
            isBookmarked ? 'text-sanctuary-primary' : 'text-gray-600 hover:text-sanctuary-primary'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1 text-gray-600 hover:text-sanctuary-primary transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>{formatNumber(post.shares)}</span>
        </button>

        {showEstimatedTime && (
          <div className="flex items-center gap-1 text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{post.readTime} min</span>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
        {showReadingProgress && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Reading Progress</span>
              <span>{Math.round(readingProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-sanctuary-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${readingProgress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors ${
                isLiked 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-600'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{formatNumber(localLikes)}</span>
            </button>

            <button
              onClick={handleBookmark}
              className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors ${
                isBookmarked 
                  ? 'bg-sanctuary-primary/10 text-sanctuary-primary' 
                  : 'bg-white text-gray-600 hover:bg-sanctuary-primary/5 hover:text-sanctuary-primary'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
              <span>{isBookmarked ? 'Saved' : 'Save'}</span>
            </button>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3 py-2 bg-white text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </button>
        </div>

        {showEstimatedTime && (
          <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readTime} minute read</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>{formatNumber(post.views)} views</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Floating variant (default)
  return (
    <div
      className={`fixed left-4 top-1/2 transform -translate-y-1/2 z-40 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'
      } ${className}`}
    >
      <div className="bg-white shadow-lg rounded-full p-2 space-y-2">
        {showReadingProgress && (
          <div className="relative w-12 h-12 mb-2">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-200"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-sanctuary-primary transition-all duration-300"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={`${readingProgress}, 100`}
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-600">
                {Math.round(readingProgress)}%
              </span>
            </div>
          </div>
        )}

        <button
          onClick={handleLike}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            isLiked 
              ? 'bg-red-100 text-red-600' 
              : 'hover:bg-red-50 text-gray-600 hover:text-red-600'
          }`}
          title={`${isLiked ? 'Unlike' : 'Like'} this article`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        <div className="text-center text-xs text-gray-500 px-1">
          {formatNumber(localLikes)}
        </div>

        <button
          onClick={handleBookmark}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            isBookmarked 
              ? 'bg-sanctuary-primary/10 text-sanctuary-primary' 
              : 'hover:bg-sanctuary-primary/5 text-gray-600 hover:text-sanctuary-primary'
          }`}
          title={`${isBookmarked ? 'Remove bookmark' : 'Bookmark'} this article`}
        >
          <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>

        <button
          onClick={handleShare}
          className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors"
          title="Share this article"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};