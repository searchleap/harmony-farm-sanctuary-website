// Educational Resource Categories for Harmony Farm Sanctuary
// Organized categories for comprehensive educational content

import { ResourceCategory } from '../types/faq';

export const resourceCategories: ResourceCategory[] = [
  {
    id: 'animal-care',
    name: 'Animal Care & Welfare',
    description: 'Learn about proper care, nutrition, and welfare of farm animals',
    slug: 'animal-care',
    icon: 'Heart',
    color: 'sanctuary',
    resourceCount: 0, // Will be calculated
    targetAudience: ['visitors', 'volunteers', 'educators', 'families']
  },
  {
    id: 'veganism-nutrition',
    name: 'Veganism & Plant-Based Living',
    description: 'Resources for adopting and maintaining a compassionate lifestyle',
    slug: 'veganism-nutrition',
    icon: 'Leaf',
    color: 'green',
    resourceCount: 0,
    targetAudience: ['visitors', 'families', 'educators']
  },
  {
    id: 'sanctuary-life',
    name: 'Sanctuary Life & Operations',
    description: 'Behind-the-scenes look at how a farm animal sanctuary operates',
    slug: 'sanctuary-life',
    icon: 'Home',
    color: 'earth',
    resourceCount: 0,
    targetAudience: ['visitors', 'volunteers', 'educators']
  },
  {
    id: 'animal-intelligence',
    name: 'Animal Intelligence & Behavior',
    description: 'Fascinating insights into farm animal cognition and social behavior',
    slug: 'animal-intelligence',
    icon: 'Brain',
    color: 'sanctuary',
    resourceCount: 0,
    targetAudience: ['visitors', 'educators', 'families']
  },
  {
    id: 'rescue-stories',
    name: 'Rescue Stories & Case Studies',
    description: 'Real stories of animal rescue, rehabilitation, and recovery',
    slug: 'rescue-stories',
    icon: 'BookHeart',
    color: 'earth',
    resourceCount: 0,
    targetAudience: ['visitors', 'families', 'educators']
  },
  {
    id: 'volunteer-resources',
    name: 'Volunteer Training & Resources',
    description: 'Training materials and guides for current and prospective volunteers',
    slug: 'volunteer-resources',
    icon: 'Users',
    color: 'green',
    resourceCount: 0,
    targetAudience: ['volunteers']
  },
  {
    id: 'educational-activities',
    name: 'Educational Activities & Lesson Plans',
    description: 'Classroom activities, lesson plans, and educational materials for teachers',
    slug: 'educational-activities',
    icon: 'BookOpen',
    color: 'sanctuary',
    resourceCount: 0,
    targetAudience: ['educators']
  },
  {
    id: 'family-resources',
    name: 'Family & Children Resources',
    description: 'Age-appropriate materials for children and families',
    slug: 'family-resources',
    icon: 'Baby',
    color: 'earth',
    resourceCount: 0,
    targetAudience: ['families']
  }
];

export const getResourceCategoryById = (id: string): ResourceCategory | undefined => {
  return resourceCategories.find(category => category.id === id);
};

export const getResourceCategoryBySlug = (slug: string): ResourceCategory | undefined => {
  return resourceCategories.find(category => category.slug === slug);
};

export const getResourceCategoriesForAudience = (audience: string): ResourceCategory[] => {
  return resourceCategories.filter(category => 
    category.targetAudience.includes(audience)
  );
};

export const updateResourceCategoryCounts = (categoryResourceCounts: Record<string, number>): void => {
  resourceCategories.forEach(category => {
    category.resourceCount = categoryResourceCounts[category.id] || 0;
  });
};