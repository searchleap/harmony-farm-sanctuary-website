// SEO Helper Functions for Harmony Farm Sanctuary Blog
// Utilities for search engine optimization, meta tags, and structured data

import { BlogPost, SocialShareData } from '../types/blog';

// Generate meta tags for blog posts
export const generateBlogPostMeta = (post: BlogPost) => {
  const siteName = 'Harmony Farm Sanctuary';
  const siteUrl = 'https://harmonyfarm.org';
  const postUrl = `${siteUrl}/blog/${post.slug}`;

  return {
    title: post.seo.metaTitle || `${post.title} | ${siteName}`,
    description: post.seo.metaDescription || post.excerpt,
    keywords: post.seo.keywords.join(', '),
    canonical: postUrl,
    robots: 'index, follow',
    
    // Open Graph tags for Facebook
    ogType: 'article',
    ogTitle: post.seo.metaTitle || post.title,
    ogDescription: post.seo.metaDescription || post.excerpt,
    ogImage: post.seo.ogImage || post.featuredImage,
    ogUrl: postUrl,
    ogSiteName: siteName,
    
    // Twitter Card tags
    twitterCard: 'summary_large_image',
    twitterTitle: post.seo.metaTitle || post.title,
    twitterDescription: post.seo.metaDescription || post.excerpt,
    twitterImage: post.seo.twitterImage || post.seo.ogImage || post.featuredImage,
    twitterSite: '@HarmonyFarmSanctuary',
    twitterCreator: post.author.social?.twitter || '@HarmonyFarmSanctuary',
    
    // Article-specific tags
    articlePublishedTime: post.publishedAt,
    articleModifiedTime: post.updatedAt || post.publishedAt,
    articleAuthor: post.author.name,
    articleSection: post.category.name,
    articleTag: post.tags.map(tag => tag.name).join(', ')
  };
};

// Generate structured data (JSON-LD) for blog posts
export const generateBlogPostStructuredData = (post: BlogPost) => {
  const siteName = 'Harmony Farm Sanctuary';
  const siteUrl = 'https://harmonyfarm.org';
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage,
    url: postUrl,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.role,
      description: post.author.bio,
      image: post.author.image,
      url: post.author.social?.linkedin || post.author.social?.twitter
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/logo.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl
    },
    articleSection: post.category.name,
    keywords: post.seo.keywords,
    wordCount: post.content.split(/\s+/).length,
    timeRequired: `PT${post.readTime}M`,
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    // Add organization context for animal sanctuary
    about: {
      '@type': 'Organization',
      '@id': siteUrl,
      name: siteName,
      description: 'Animal sanctuary providing rescue, rehabilitation, and education for farm animals',
      url: siteUrl,
      sameAs: [
        'https://facebook.com/HarmonyFarmSanctuary',
        'https://instagram.com/harmonyfarmor',
        'https://twitter.com/HarmonyFarmSanctuary'
      ]
    }
  };
};

// Generate structured data for blog listing pages
export const generateBlogListingStructuredData = (posts: BlogPost[], _pageType: 'blog' | 'category' | 'tag', title?: string) => {
  const siteName = 'Harmony Farm Sanctuary';
  const siteUrl = 'https://harmonyfarm.org';
  
  const baseData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: title || `${siteName} Blog`,
    description: 'Latest news, animal updates, and educational content from Harmony Farm Sanctuary',
    url: `${siteUrl}/blog`,
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl
    },
    blogPost: posts.map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      image: post.featuredImage,
      url: `${siteUrl}/blog/${post.slug}`,
      datePublished: post.publishedAt,
      author: {
        '@type': 'Person',
        name: post.author.name
      }
    }))
  };

  return baseData;
};

// Generate social sharing data
export const generateSocialShareData = (post: BlogPost): SocialShareData => {
  const siteUrl = 'https://harmonyfarm.org';
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  
  return {
    url: postUrl,
    title: post.title,
    description: post.excerpt,
    image: post.featuredImage,
    hashtags: post.tags.map(tag => tag.name.replace(/\s+/g, ''))
  };
};

// Generate social sharing URLs
export const generateSocialShareUrls = (shareData: SocialShareData) => {
  const encodedUrl = encodeURIComponent(shareData.url);
  const encodedTitle = encodeURIComponent(shareData.title);
  const encodedDescription = encodeURIComponent(shareData.description);
  const encodedHashtags = shareData.hashtags?.join(',') || '';

  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${encodedHashtags}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}&media=${encodeURIComponent(shareData.image)}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%0A${encodedUrl}`
  };
};

// Generate meta tags for category pages
export const generateCategoryPageMeta = (categoryName: string, categoryDescription: string, postCount: number) => {
  const siteName = 'Harmony Farm Sanctuary';
  
  return {
    title: `${categoryName} | ${siteName} Blog`,
    description: `${categoryDescription} Browse ${postCount} articles in our ${categoryName.toLowerCase()} category.`,
    keywords: `${categoryName.toLowerCase()}, animal sanctuary, farm animals, animal welfare`,
    robots: 'index, follow'
  };
};

// Generate meta tags for tag pages
export const generateTagPageMeta = (tagName: string, postCount: number) => {
  const siteName = 'Harmony Farm Sanctuary';
  
  return {
    title: `${tagName} Articles | ${siteName} Blog`,
    description: `Discover ${postCount} articles tagged with "${tagName}" from Harmony Farm Sanctuary's blog.`,
    keywords: `${tagName.toLowerCase()}, animal sanctuary, farm animals`,
    robots: 'index, follow'
  };
};

// Generate sitemap data for blog posts
export const generateBlogSitemap = (posts: BlogPost[]) => {
  const siteUrl = 'https://harmonyfarm.org';
  
  return posts
    .filter(post => post.status === 'published')
    .map(post => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastmod: post.updatedAt || post.publishedAt,
      changefreq: 'monthly' as const,
      priority: post.featured ? 0.8 : 0.6
    }));
};

// Generate RSS feed data
export const generateRSSFeed = (posts: BlogPost[]) => {
  const siteName = 'Harmony Farm Sanctuary';
  const siteUrl = 'https://harmonyfarm.org';
  const siteDescription = 'Latest news, animal updates, and educational content from Harmony Farm Sanctuary';
  
  const publishedPosts = posts
    .filter(post => post.status === 'published')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 20); // Limit to 20 most recent posts

  return {
    title: `${siteName} Blog`,
    description: siteDescription,
    link: `${siteUrl}/blog`,
    lastBuildDate: new Date().toISOString(),
    language: 'en-US',
    copyright: `Copyright ${new Date().getFullYear()} ${siteName}`,
    managingEditor: 'blog@harmonyfarm.org',
    webMaster: 'web@harmonyfarm.org',
    category: 'Animal Welfare',
    ttl: 1440, // 24 hours
    image: {
      url: `${siteUrl}/images/logo.png`,
      title: siteName,
      link: siteUrl,
      width: 144,
      height: 144
    },
    items: publishedPosts.map(post => ({
      title: post.title,
      description: post.excerpt,
      link: `${siteUrl}/blog/${post.slug}`,
      guid: `${siteUrl}/blog/${post.slug}`,
      pubDate: new Date(post.publishedAt).toUTCString(),
      author: `${post.author.email || 'blog@harmonyfarm.org'} (${post.author.name})`,
      category: post.category.name,
      enclosure: post.featuredImage ? {
        url: post.featuredImage,
        type: 'image/jpeg'
      } : undefined
    }))
  };
};

// Clean and format HTML content for meta descriptions
export const cleanHtmlForMeta = (htmlContent: string, maxLength: number = 160): string => {
  // Remove HTML tags
  const textContent = htmlContent.replace(/<[^>]*>/g, '');
  
  // Remove extra whitespace and line breaks
  const cleanedText = textContent.replace(/\s+/g, ' ').trim();
  
  if (cleanedText.length <= maxLength) {
    return cleanedText;
  }
  
  // Truncate at word boundary
  const truncated = cleanedText.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  return lastSpaceIndex > 0 
    ? truncated.substring(0, lastSpaceIndex) + '...'
    : truncated + '...';
};

// Generate canonical URLs for blog pages
export const generateCanonicalUrl = (path: string): string => {
  const siteUrl = 'https://harmonyfarm.org';
  return `${siteUrl}${path.startsWith('/') ? path : '/' + path}`;
};

// Generate hreflang tags for international SEO (if needed in the future)
export const generateHreflangTags = (path: string) => {
  const siteUrl = 'https://harmonyfarm.org';
  
  return [
    { hreflang: 'en-US', href: `${siteUrl}${path}` },
    { hreflang: 'x-default', href: `${siteUrl}${path}` }
  ];
};