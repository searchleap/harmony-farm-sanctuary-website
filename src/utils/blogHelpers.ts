// Blog Helper Functions for Harmony Farm Sanctuary
// Utility functions for blog content management, search, filtering, and SEO

import { BlogPost, BlogSearchParams, BlogSearchResult, BlogCategory, BlogTag, Author } from '../types/blog';
import { blogPosts, blogTags } from '../data/blogPosts';
import { blogCategories } from '../data/blogCategories';
import { authors } from '../data/authors';

// Search and filtering functions
export const searchBlogPosts = (params: BlogSearchParams): BlogSearchResult => {
  let filteredPosts = blogPosts.filter(post => post.status === 'published');

  // Text search across title, excerpt, and content
  if (params.query) {
    const query = params.query.toLowerCase();
    filteredPosts = filteredPosts.filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.tags.some(tag => tag.name.toLowerCase().includes(query)) ||
      post.author.name.toLowerCase().includes(query)
    );
  }

  // Category filter
  if (params.category) {
    filteredPosts = filteredPosts.filter(post =>
      post.category.slug === params.category
    );
  }

  // Tag filter
  if (params.tag) {
    filteredPosts = filteredPosts.filter(post =>
      post.tags.some(tag => tag.slug === params.tag)
    );
  }

  // Author filter
  if (params.author) {
    filteredPosts = filteredPosts.filter(post =>
      post.author.id === params.author
    );
  }

  // Date range filter
  if (params.dateFrom) {
    const fromDate = new Date(params.dateFrom);
    filteredPosts = filteredPosts.filter(post =>
      new Date(post.publishedAt) >= fromDate
    );
  }

  if (params.dateTo) {
    const toDate = new Date(params.dateTo);
    filteredPosts = filteredPosts.filter(post =>
      new Date(post.publishedAt) <= toDate
    );
  }

  // Featured filter
  if (params.featured !== undefined) {
    filteredPosts = filteredPosts.filter(post =>
      post.featured === params.featured
    );
  }

  // Sorting
  const sortBy = params.sortBy || 'date';
  const sortOrder = params.sortOrder || 'desc';

  filteredPosts.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'date':
        comparison = new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
        break;
      case 'popularity':
        comparison = a.views - b.views;
        break;
      case 'alphabetical':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'views':
        comparison = a.views - b.views;
        break;
      default:
        comparison = new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });

  // Pagination
  const page = params.page || 1;
  const limit = params.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredPosts.length / limit);

  return {
    posts: paginatedPosts,
    totalCount: filteredPosts.length,
    totalPages,
    currentPage: page,
    categories: blogCategories,
    tags: blogTags,
    authors: authors
  };
};

// Get blog posts with specific criteria
export const getBlogPostsWithCriteria = (
  category?: string,
  featured?: boolean,
  limit?: number,
  excludeId?: string
): BlogPost[] => {
  let posts = blogPosts.filter(post => post.status === 'published');

  if (excludeId) {
    posts = posts.filter(post => post.id !== excludeId);
  }

  if (category) {
    posts = posts.filter(post => post.category.slug === category);
  }

  if (featured !== undefined) {
    posts = posts.filter(post => post.featured === featured);
  }

  // Sort by date (newest first)
  posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  if (limit) {
    posts = posts.slice(0, limit);
  }

  return posts;
};

// Calculate reading time based on content length
export const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, readingTime); // Minimum 1 minute
};

// Extract excerpt from content if not provided
export const generateExcerpt = (content: string, maxLength: number = 160): string => {
  // Remove HTML tags
  const textContent = content.replace(/<[^>]*>/g, '');
  
  if (textContent.length <= maxLength) {
    return textContent;
  }

  // Find the last complete word within the limit
  const truncated = textContent.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  return lastSpaceIndex > 0 
    ? truncated.substring(0, lastSpaceIndex) + '...'
    : truncated + '...';
};

// Format date for display
export const formatBlogDate = (dateString: string, format: 'long' | 'short' | 'relative' = 'long'): string => {
  const date = new Date(dateString);
  const now = new Date();

  switch (format) {
    case 'short':
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    
    case 'relative':
      const diffTime = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
      return `${Math.floor(diffDays / 365)} years ago`;
    
    case 'long':
    default:
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
  }
};

// Generate URL-friendly slug from title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
};

// Get category statistics
export const getCategoryStats = (): Array<{ category: BlogCategory; postCount: number; totalViews: number }> => {
  return blogCategories.map(category => {
    const categoryPosts = blogPosts.filter(post => 
      post.category.id === category.id && post.status === 'published'
    );
    
    return {
      category,
      postCount: categoryPosts.length,
      totalViews: categoryPosts.reduce((sum, post) => sum + post.views, 0)
    };
  });
};

// Get tag statistics
export const getTagStats = (): Array<{ tag: BlogTag; postCount: number; totalViews: number }> => {
  return blogTags.map(tag => {
    const tagPosts = blogPosts.filter(post =>
      post.status === 'published' && 
      post.tags.some(postTag => postTag.id === tag.id)
    );
    
    return {
      tag,
      postCount: tagPosts.length,
      totalViews: tagPosts.reduce((sum, post) => sum + post.views, 0)
    };
  }).sort((a, b) => b.postCount - a.postCount);
};

// Get author statistics
export const getAuthorStats = (): Array<{ author: Author; postCount: number; totalViews: number }> => {
  return authors.map(author => {
    const authorPosts = blogPosts.filter(post =>
      post.author.id === author.id && post.status === 'published'
    );
    
    return {
      author,
      postCount: authorPosts.length,
      totalViews: authorPosts.reduce((sum, post) => sum + post.views, 0)
    };
  }).sort((a, b) => b.postCount - a.postCount);
};

// Get blog analytics data
export const getBlogAnalytics = () => {
  const publishedPosts = blogPosts.filter(post => post.status === 'published');
  
  const totalViews = publishedPosts.reduce((sum, post) => sum + post.views, 0);
  const totalShares = publishedPosts.reduce((sum, post) => sum + post.shares, 0);
  const averageReadTime = publishedPosts.reduce((sum, post) => sum + post.readTime, 0) / publishedPosts.length;

  const categoryStats = getCategoryStats();
  const topCategories = categoryStats
    .sort((a, b) => b.totalViews - a.totalViews)
    .slice(0, 5);

  const topPosts = publishedPosts
    .map(post => ({
      post,
      views: post.views,
      engagement: post.views + post.likes + post.shares
    }))
    .sort((a, b) => b.engagement - a.engagement)
    .slice(0, 10);

  return {
    totalPosts: publishedPosts.length,
    totalViews,
    totalShares,
    averageReadTime: Math.round(averageReadTime),
    topCategories,
    topPosts
  };
};

// Get related posts based on tags and category
export const getRelatedPosts = (currentPost: BlogPost, limit: number = 3): BlogPost[] => {
  const allPosts = blogPosts.filter(post => 
    post.id !== currentPost.id && post.status === 'published'
  );

  // Score posts based on relevance
  const scoredPosts = allPosts.map(post => {
    let score = 0;

    // Same category gets higher score
    if (post.category.id === currentPost.category.id) {
      score += 3;
    }

    // Shared tags increase score
    const sharedTags = post.tags.filter(tag =>
      currentPost.tags.some(currentTag => currentTag.id === tag.id)
    );
    score += sharedTags.length * 2;

    // Same author gets slight boost
    if (post.author.id === currentPost.author.id) {
      score += 1;
    }

    return { post, score };
  });

  // Sort by score, then by views
  scoredPosts.sort((a, b) => {
    if (a.score !== b.score) {
      return b.score - a.score;
    }
    return b.post.views - a.post.views;
  });

  return scoredPosts.slice(0, limit).map(item => item.post);
};

// Generate breadcrumb navigation
export const generateBreadcrumbs = (
  currentPage: 'blog' | 'post' | 'category' | 'tag' | 'author',
  slug?: string,
  post?: BlogPost
) => {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' }
  ];

  switch (currentPage) {
    case 'post':
      if (post) {
        breadcrumbs.push({
          label: post.category.name,
          href: `/blog/category/${post.category.slug}`
        });
        breadcrumbs.push({
          label: post.title,
          href: `/blog/${post.slug}`
        });
      }
      break;
    
    case 'category':
      if (slug) {
        const category = blogCategories.find(cat => cat.slug === slug);
        if (category) {
          breadcrumbs.push({
            label: category.name,
            href: `/blog/category/${category.slug}`
          });
        }
      }
      break;
    
    case 'tag':
      if (slug) {
        const tag = blogTags.find(t => t.slug === slug);
        if (tag) {
          breadcrumbs.push({
            label: `Tagged: ${tag.name}`,
            href: `/blog/tag/${tag.slug}`
          });
        }
      }
      break;
    
    case 'author':
      if (slug) {
        const author = authors.find(a => a.id === slug);
        if (author) {
          breadcrumbs.push({
            label: `By ${author.name}`,
            href: `/blog/author/${author.id}`
          });
        }
      }
      break;
  }

  return breadcrumbs;
};

// Update post view count (in a real app, this would be a server-side operation)
export const incrementPostViews = (postId: string): void => {
  const post = blogPosts.find(p => p.id === postId);
  if (post) {
    post.views += 1;
  }
};

// Get archive data for date-based browsing
export const getArchiveData = () => {
  const publishedPosts = blogPosts.filter(post => post.status === 'published');
  const archive: { [year: string]: { [month: string]: BlogPost[] } } = {};

  publishedPosts.forEach(post => {
    const date = new Date(post.publishedAt);
    const year = date.getFullYear().toString();
    const month = date.toLocaleDateString('en-US', { month: 'long' });

    if (!archive[year]) {
      archive[year] = {};
    }
    if (!archive[year][month]) {
      archive[year][month] = [];
    }

    archive[year][month].push(post);
  });

  return archive;
};