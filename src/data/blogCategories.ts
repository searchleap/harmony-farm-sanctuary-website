// Blog Categories for Harmony Farm Sanctuary
// Comprehensive categorization system for blog content

import { BlogCategory } from '../types/blog';

export const blogCategories: BlogCategory[] = [
  {
    id: 'animal-updates',
    name: 'Animal Updates',
    description: 'Stories, rescue updates, and progress reports about our sanctuary animals',
    slug: 'animal-updates',
    color: 'bg-blue-100 text-blue-800',
    icon: 'Heart',
    postCount: 0 // Will be calculated dynamically
  },
  {
    id: 'sanctuary-news',
    name: 'Sanctuary News', 
    description: 'Official announcements, facility updates, achievements, and important sanctuary news',
    slug: 'sanctuary-news',
    color: 'bg-green-100 text-green-800',
    icon: 'Megaphone',
    postCount: 0
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Educational content about animal welfare, veganism, conservation, and compassionate living',
    slug: 'education',
    color: 'bg-purple-100 text-purple-800',
    icon: 'BookOpen',
    postCount: 0
  },
  {
    id: 'behind-the-scenes',
    name: 'Behind the Scenes',
    description: 'Daily life at the sanctuary, staff insights, and the work that goes into animal care',
    slug: 'behind-the-scenes',
    color: 'bg-orange-100 text-orange-800',
    icon: 'Camera',
    postCount: 0
  },
  {
    id: 'events',
    name: 'Events',
    description: 'Coverage of fundraisers, volunteer appreciation events, and special sanctuary occasions',
    slug: 'events',
    color: 'bg-pink-100 text-pink-800',
    icon: 'Calendar',
    postCount: 0
  },
  {
    id: 'community',
    name: 'Community',
    description: 'Volunteer spotlights, donor features, supporter stories, and community involvement',
    slug: 'community',
    color: 'bg-yellow-100 text-yellow-800',
    icon: 'Users',
    postCount: 0
  },
  {
    id: 'veterinary-care',
    name: 'Veterinary Care',
    description: 'Medical updates, health information, and veterinary insights about farm animal care',
    slug: 'veterinary-care',
    color: 'bg-red-100 text-red-800',
    icon: 'Stethoscope',
    postCount: 0
  },
  {
    id: 'rescue-stories',
    name: 'Rescue Stories',
    description: 'Dramatic rescue operations, emergency interventions, and animal liberation stories',
    slug: 'rescue-stories',
    color: 'bg-indigo-100 text-indigo-800',
    icon: 'Shield',
    postCount: 0
  }
];

// Helper functions for category management
export const getCategoryById = (id: string): BlogCategory | undefined => {
  return blogCategories.find(category => category.id === id);
};

export const getCategoryBySlug = (slug: string): BlogCategory | undefined => {
  return blogCategories.find(category => category.slug === slug);
};

export const getMainCategories = (): BlogCategory[] => {
  // Return the most important categories for navigation
  return blogCategories.filter(category => 
    ['animal-updates', 'sanctuary-news', 'education', 'community'].includes(category.id)
  );
};

export const getAllCategories = (): BlogCategory[] => {
  return blogCategories;
};

export const getCategoriesSortedByPostCount = (): BlogCategory[] => {
  return [...blogCategories].sort((a, b) => b.postCount - a.postCount);
};

export const updateCategoryPostCount = (categoryId: string, count: number): void => {
  const category = getCategoryById(categoryId);
  if (category) {
    category.postCount = count;
  }
};

// Default category for uncategorized posts
export const getDefaultCategory = (): BlogCategory => {
  return getCategoryById('sanctuary-news') || blogCategories[0];
};