// Blog and News System Types
// Comprehensive TypeScript interfaces for Harmony Farm Sanctuary blog system

export interface Author {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  email?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    facebook?: string;
  };
  yearsAtSanctuary: number;
  specialties: string[];
}

export interface BlogCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
  color: string;
  icon: string;
  postCount: number;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface BlogMedia {
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  alt?: string;
  caption?: string;
  credits?: string;
  thumbnail?: string;
  duration?: number; // for video/audio in seconds
  size?: number; // file size in bytes
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: Author;
  category: BlogCategory;
  tags: BlogTag[];
  featuredImage: string;
  featuredImageAlt: string;
  gallery?: BlogMedia[];
  publishedAt: string;
  updatedAt?: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  readTime: number; // estimated reading time in minutes
  views: number;
  likes: number;
  shares: number;
  
  // SEO and Social Media
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords: string[];
    ogImage?: string;
    twitterImage?: string;
  };
  
  // Content structure
  sections?: BlogSection[];
  
  // Related content
  relatedAnimals?: string[]; // Animal IDs
  relatedPosts?: string[]; // Blog Post IDs
  
  // Engagement
  allowComments: boolean;
  commentCount: number;
  
  // Newsletter
  includeInNewsletter: boolean;
  newsletterSubject?: string;
}

export interface BlogSection {
  id: string;
  type: 'text' | 'image' | 'gallery' | 'video' | 'quote' | 'callout' | 'divider';
  content: string;
  media?: BlogMedia;
  style?: {
    alignment?: 'left' | 'center' | 'right';
    backgroundColor?: string;
    textColor?: string;
    padding?: string;
  };
}

export interface BlogComment {
  id: string;
  postId: string;
  author: {
    name: string;
    email: string;
    website?: string;
    avatar?: string;
  };
  content: string;
  publishedAt: string;
  status: 'pending' | 'approved' | 'spam' | 'rejected';
  parentId?: string; // for replies
  likes: number;
}

// Search and filtering interfaces
export interface BlogSearchParams {
  query?: string;
  category?: string;
  tag?: string;
  author?: string;
  dateFrom?: string;
  dateTo?: string;
  featured?: boolean;
  sortBy?: 'date' | 'popularity' | 'alphabetical' | 'views';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface BlogSearchResult {
  posts: BlogPost[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  categories: BlogCategory[];
  tags: BlogTag[];
  authors: Author[];
}

// RSS and newsletter interfaces
export interface RSSFeed {
  title: string;
  description: string;
  link: string;
  lastBuildDate: string;
  items: RSSItem[];
}

export interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  author: string;
  category: string;
  guid: string;
}

export interface NewsletterSubscription {
  email: string;
  categories: string[];
  frequency: 'weekly' | 'monthly' | 'immediate';
  subscribedAt: string;
  active: boolean;
}

// Analytics and statistics
export interface BlogAnalytics {
  totalPosts: number;
  totalViews: number;
  totalShares: number;
  averageReadTime: number;
  topCategories: {
    category: BlogCategory;
    postCount: number;
    viewCount: number;
  }[];
  topPosts: {
    post: BlogPost;
    views: number;
    engagement: number;
  }[];
  monthlyStats: {
    month: string;
    posts: number;
    views: number;
    newSubscribers: number;
  }[];
}

// Social sharing interfaces
export interface SocialShareData {
  url: string;
  title: string;
  description: string;
  image: string;
  hashtags?: string[];
}

export interface SocialPlatform {
  name: 'facebook' | 'twitter' | 'linkedin' | 'pinterest' | 'email' | 'whatsapp';
  label: string;
  icon: string;
  shareUrl: string;
  color: string;
}

// Blog configuration
export interface BlogConfig {
  postsPerPage: number;
  excerptLength: number;
  enableComments: boolean;
  enableSocialSharing: boolean;
  enableNewsletter: boolean;
  enableSearch: boolean;
  enableRSS: boolean;
  defaultCategory: string;
  defaultAuthor: string;
  featuredPostsCount: number;
  relatedPostsCount: number;
  recentPostsCount: number;
}