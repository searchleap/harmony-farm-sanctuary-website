// FAQ and Educational Resources Helper Functions
// Utilities for searching, filtering, and managing FAQ and resource content

import { FAQ, EducationalResource, SearchParams, SearchResult, Analytics } from '../types/faq';
import { faqs, searchFAQs as basicSearchFAQs } from '../data/faqs';
import { educationalResources, searchResources as basicSearchResources } from '../data/educationalResources';

// Advanced FAQ search with filtering and pagination
export const searchFAQs = (params: SearchParams): SearchResult<FAQ> => {
  const startTime = performance.now();
  
  let results = faqs;
  
  // Apply text search
  if (params.query) {
    results = basicSearchFAQs(params.query);
  }
  
  // Apply category filter
  if (params.category) {
    results = results.filter(faq => faq.category.id === params.category);
  }
  
  // Apply tag filters
  if (params.tags && params.tags.length > 0) {
    results = results.filter(faq => 
      params.tags!.some(tagId => faq.tags.some(tag => tag.id === tagId))
    );
  }
  
  // Apply difficulty filter
  if (params.difficulty) {
    results = results.filter(faq => faq.difficulty === params.difficulty);
  }
  
  // Apply sorting
  results = sortFAQs(results, params.sortBy || 'relevance', params.sortOrder || 'desc');
  
  // Calculate pagination
  const page = params.page || 1;
  const limit = params.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedResults = results.slice(startIndex, endIndex);
  
  const searchTime = performance.now() - startTime;
  
  // Generate search suggestions if no results
  const suggestions = results.length === 0 && params.query ? 
    generateFAQSuggestions(params.query) : undefined;
  
  console.log('🔍 FAQ Search completed:', {
    query: params.query,
    totalResults: results.length,
    page,
    searchTime: `${searchTime.toFixed(2)}ms`
  });
  
  return {
    items: paginatedResults,
    total: results.length,
    currentPage: page,
    totalPages: Math.ceil(results.length / limit),
    hasMore: endIndex < results.length,
    searchTime,
    suggestions
  };
};

// Advanced resource search with filtering and pagination
export const searchEducationalResources = (params: SearchParams): SearchResult<EducationalResource> => {
  const startTime = performance.now();
  
  let results = educationalResources;
  
  // Apply text search
  if (params.query) {
    results = basicSearchResources(params.query);
  }
  
  // Apply category filter
  if (params.category) {
    results = results.filter(resource => resource.category.id === params.category);
  }
  
  // Apply tag filters
  if (params.tags && params.tags.length > 0) {
    results = results.filter(resource => 
      params.tags!.some(tagId => resource.tags.some(tag => tag.id === tagId))
    );
  }
  
  // Apply type filter
  if (params.type) {
    results = results.filter(resource => resource.type === params.type);
  }
  
  // Apply difficulty filter
  if (params.difficulty) {
    results = results.filter(resource => resource.difficulty === params.difficulty);
  }
  
  // Apply audience filter
  if (params.audience) {
    results = results.filter(resource => resource.targetAudience.includes(params.audience!));
  }
  
  // Apply sorting
  results = sortResources(results, params.sortBy || 'relevance', params.sortOrder || 'desc');
  
  // Calculate pagination
  const page = params.page || 1;
  const limit = params.limit || 12;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedResults = results.slice(startIndex, endIndex);
  
  const searchTime = performance.now() - startTime;
  
  // Generate search suggestions if no results
  const suggestions = results.length === 0 && params.query ? 
    generateResourceSuggestions(params.query) : undefined;
  
  console.log('🔍 Resource Search completed:', {
    query: params.query,
    totalResults: results.length,
    page,
    searchTime: `${searchTime.toFixed(2)}ms`
  });
  
  return {
    items: paginatedResults,
    total: results.length,
    currentPage: page,
    totalPages: Math.ceil(results.length / limit),
    hasMore: endIndex < results.length,
    searchTime,
    suggestions
  };
};

// Sort FAQs by different criteria
const sortFAQs = (faqs: FAQ[], sortBy: string, sortOrder: string): FAQ[] => {
  const direction = sortOrder === 'asc' ? 1 : -1;
  
  return [...faqs].sort((a, b) => {
    switch (sortBy) {
      case 'popularity':
        return direction * (b.views - a.views);
      case 'helpfulness':
        return direction * (b.helpfulnessRatio - a.helpfulnessRatio);
      case 'date':
        return direction * (new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
      case 'title':
        return direction * a.question.localeCompare(b.question);
      case 'relevance':
      default:
        return direction * (b.priority - a.priority);
    }
  });
};

// Sort resources by different criteria
const sortResources = (resources: EducationalResource[], sortBy: string, sortOrder: string): EducationalResource[] => {
  const direction = sortOrder === 'asc' ? 1 : -1;
  
  return [...resources].sort((a, b) => {
    switch (sortBy) {
      case 'popularity':
        return direction * (b.downloads - a.downloads);
      case 'rating':
        return direction * (b.rating - a.rating);
      case 'date':
        return direction * (new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
      case 'title':
        return direction * a.title.localeCompare(b.title);
      case 'relevance':
      default:
        return direction * ((b.featured ? 1 : 0) - (a.featured ? 1 : 0)) || (b.rating - a.rating);
    }
  });
};

// Generate search suggestions for FAQs
const generateFAQSuggestions = (query: string): string[] => {
  const commonTerms = [
    'visiting hours', 'tour cost', 'volunteer requirements', 'donations',
    'animal care', 'sponsorship', 'adoption', 'parking', 'directions',
    'group tours', 'children', 'accessibility', 'feeding animals'
  ];
  
  const lowercaseQuery = query.toLowerCase();
  return commonTerms
    .filter(term => term.includes(lowercaseQuery) || lowercaseQuery.includes(term.split(' ')[0]))
    .slice(0, 5);
};

// Generate search suggestions for resources
const generateResourceSuggestions = (query: string): string[] => {
  const commonTerms = [
    'pig intelligence', 'animal care', 'vegan recipes', 'volunteer training',
    'classroom activities', 'family resources', 'plant based', 'sanctuary life',
    'animal behavior', 'rescue stories', 'nutrition guide', 'meal prep'
  ];
  
  const lowercaseQuery = query.toLowerCase();
  return commonTerms
    .filter(term => term.includes(lowercaseQuery) || lowercaseQuery.includes(term.split(' ')[0]))
    .slice(0, 5);
};

// Get related FAQs based on tags and category
export const getRelatedFAQs = (faq: FAQ, limit: number = 3): FAQ[] => {
  const related = faqs.filter(f => f.id !== faq.id && (
    f.category.id === faq.category.id ||
    f.tags.some(tag => faq.tags.some(faqTag => faqTag.id === tag.id))
  ));
  
  return related
    .sort((a, b) => b.helpfulnessRatio - a.helpfulnessRatio)
    .slice(0, limit);
};

// Get related resources based on tags and category
export const getRelatedResources = (resource: EducationalResource, limit: number = 3): EducationalResource[] => {
  const related = educationalResources.filter(r => r.id !== resource.id && (
    r.category.id === resource.category.id ||
    r.tags.some(tag => resource.tags.some(resTag => resTag.id === tag.id))
  ));
  
  return related
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};

// Analytics and statistics
export const getFAQAnalytics = (): Analytics => {
  const popularFAQs = faqs
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);
  
  const categoryPopularity: Record<string, number> = {};
  faqs.forEach(faq => {
    categoryPopularity[faq.category.id] = (categoryPopularity[faq.category.id] || 0) + faq.views;
  });
  
  const totalVotes = faqs.reduce((sum, faq) => sum + faq.helpful + faq.notHelpful, 0);
  const totalHelpful = faqs.reduce((sum, faq) => sum + faq.helpful, 0);
  const averageHelpfulness = totalVotes > 0 ? totalHelpful / totalVotes : 0;
  
  const popularResources = educationalResources
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 10);
  
  const downloadStats: Record<string, number> = {};
  educationalResources.forEach(resource => {
    downloadStats[resource.category.id] = (downloadStats[resource.category.id] || 0) + resource.downloads;
  });
  
  const completionRates: Record<string, number> = {};
  // This would be calculated from actual user data in a real implementation
  
  return {
    popularFAQs,
    categoryPopularity,
    searchQueries: {}, // Would be populated from actual search logs
    helpfulnessStats: {
      averageHelpfulness,
      totalVotes,
      improvementSuggestions: []
    },
    popularResources,
    downloadStats,
    completionRates,
    userEngagement: {
      averageSessionTime: 0, // Would be calculated from analytics
      returnVisitorRate: 0,
      resourcesPerSession: 0
    }
  };
};

// Track FAQ feedback
export const recordFAQFeedback = (faqId: string, helpful: boolean): void => {
  const faq = faqs.find(f => f.id === faqId);
  if (faq) {
    if (helpful) {
      faq.helpful += 1;
    } else {
      faq.notHelpful += 1;
    }
    faq.helpfulnessRatio = faq.helpful / (faq.helpful + faq.notHelpful);
    
    console.log('📊 FAQ feedback recorded:', {
      faqId,
      helpful,
      newRatio: faq.helpfulnessRatio.toFixed(2)
    });
  }
};

// Track resource downloads
export const recordResourceDownload = (resourceId: string): void => {
  const resource = educationalResources.find(r => r.id === resourceId);
  if (resource) {
    resource.downloads += 1;
    
    console.log('📥 Resource download recorded:', {
      resourceId,
      newDownloadCount: resource.downloads
    });
  }
};

// Track resource views
export const recordResourceView = (resourceId: string): void => {
  const resource = educationalResources.find(r => r.id === resourceId);
  if (resource) {
    resource.views += 1;
    
    console.log('👀 Resource view recorded:', {
      resourceId,
      newViewCount: resource.views
    });
  }
};

// Get trending content
export const getTrendingContent = () => {
  const trendingFAQs = faqs
    .filter(faq => faq.views > 100) // Minimum view threshold
    .sort((a, b) => {
      // Weight recent views more heavily
      const aRecency = Date.now() - new Date(a.lastUpdated).getTime();
      const bRecency = Date.now() - new Date(b.lastUpdated).getTime();
      const aScore = a.views / (aRecency / (1000 * 60 * 60 * 24)) || 0; // Views per day
      const bScore = b.views / (bRecency / (1000 * 60 * 60 * 24)) || 0;
      return bScore - aScore;
    })
    .slice(0, 5);
  
  const trendingResources = educationalResources
    .filter(resource => resource.downloads > 50) // Minimum download threshold
    .sort((a, b) => {
      const aRecency = Date.now() - new Date(a.lastUpdated).getTime();
      const bRecency = Date.now() - new Date(b.lastUpdated).getTime();
      const aScore = a.downloads / (aRecency / (1000 * 60 * 60 * 24)) || 0;
      const bScore = b.downloads / (bRecency / (1000 * 60 * 60 * 24)) || 0;
      return bScore - aScore;
    })
    .slice(0, 5);
  
  return { trendingFAQs, trendingResources };
};

// Content recommendations based on user behavior
export const getPersonalizedRecommendations = (
  viewedFAQs: string[], 
  downloadedResources: string[]
): { recommendedFAQs: FAQ[], recommendedResources: EducationalResource[] } => {
  // Simple recommendation based on categories and tags of viewed content
  const userInterests = new Set<string>();
  
  // Analyze viewed FAQs
  viewedFAQs.forEach(faqId => {
    const faq = faqs.find(f => f.id === faqId);
    if (faq) {
      userInterests.add(faq.category.id);
      faq.tags.forEach(tag => userInterests.add(tag.id));
    }
  });
  
  // Analyze downloaded resources
  downloadedResources.forEach(resourceId => {
    const resource = educationalResources.find(r => r.id === resourceId);
    if (resource) {
      userInterests.add(resource.category.id);
      resource.tags.forEach(tag => userInterests.add(tag.id));
    }
  });
  
  // Recommend FAQs based on interests
  const recommendedFAQs = faqs
    .filter(faq => 
      !viewedFAQs.includes(faq.id) &&
      (userInterests.has(faq.category.id) || 
       faq.tags.some(tag => userInterests.has(tag.id)))
    )
    .sort((a, b) => b.helpfulnessRatio - a.helpfulnessRatio)
    .slice(0, 5);
  
  // Recommend resources based on interests
  const recommendedResources = educationalResources
    .filter(resource => 
      !downloadedResources.includes(resource.id) &&
      (userInterests.has(resource.category.id) || 
       resource.tags.some(tag => userInterests.has(tag.id)))
    )
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);
  
  return { recommendedFAQs, recommendedResources };
};