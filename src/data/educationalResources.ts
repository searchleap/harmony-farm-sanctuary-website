// Educational Resources Database for Harmony Farm Sanctuary
// Comprehensive collection of educational materials and resources

import { EducationalResource, ResourceTag } from '../types/faq';

// Re-export types for convenience
export type { EducationalResource, ResourceTag };
import { getResourceCategoryById } from './resourceCategories';

// Resource tags for content organization
export const resourceTags: ResourceTag[] = [
  { id: 'beginner-friendly', name: 'Beginner Friendly', slug: 'beginner-friendly', count: 0 },
  { id: 'printable', name: 'Printable', slug: 'printable', count: 0 },
  { id: 'interactive', name: 'Interactive', slug: 'interactive', count: 0 },
  { id: 'video-content', name: 'Video', slug: 'video-content', count: 0 },
  { id: 'research-based', name: 'Research Based', slug: 'research-based', count: 0 },
  { id: 'kid-friendly', name: 'Kid Friendly', slug: 'kid-friendly', count: 0 },
  { id: 'nutrition', name: 'Nutrition', slug: 'nutrition', count: 0 },
  { id: 'recipes', name: 'Recipes', slug: 'recipes', count: 0 },
  { id: 'health', name: 'Health', slug: 'health', count: 0 },
  { id: 'environment', name: 'Environment', slug: 'environment', count: 0 },
  { id: 'pig-care', name: 'Pig Care', slug: 'pig-care', count: 0 },
  { id: 'cow-care', name: 'Cow Care', slug: 'cow-care', count: 0 },
  { id: 'chicken-care', name: 'Chicken Care', slug: 'chicken-care', count: 0 },
  { id: 'goat-care', name: 'Goat Care', slug: 'goat-care', count: 0 },
  { id: 'daily-routine', name: 'Daily Routine', slug: 'daily-routine', count: 0 },
  { id: 'seasonal', name: 'Seasonal', slug: 'seasonal', count: 0 },
  { id: 'cognition', name: 'Animal Cognition', slug: 'cognition', count: 0 },
  { id: 'social-behavior', name: 'Social Behavior', slug: 'social-behavior', count: 0 },
  { id: 'training-materials', name: 'Training', slug: 'training-materials', count: 0 },
  { id: 'safety', name: 'Safety', slug: 'safety', count: 0 },
  { id: 'classroom', name: 'Classroom', slug: 'classroom', count: 0 },
  { id: 'hands-on', name: 'Hands-On', slug: 'hands-on', count: 0 },
  { id: 'activities', name: 'Activities', slug: 'activities', count: 0 },
  { id: 'discussion', name: 'Discussion', slug: 'discussion', count: 0 }
];

export const educationalResources: EducationalResource[] = [
  // ANIMAL CARE & WELFARE
  {
    id: 'pig-intelligence-guide',
    title: 'The Remarkable Intelligence of Pigs: A Comprehensive Guide',
    description: 'An in-depth exploration of pig cognition, problem-solving abilities, and emotional intelligence based on scientific research and sanctuary observations.',
    summary: 'Discover the surprising intelligence of pigs through research and real sanctuary examples.',
    category: getResourceCategoryById('animal-intelligence')!,
    tags: [resourceTags[4], resourceTags[16], resourceTags[10]], // research-based, cognition, pig-care
    type: 'pdf',
    url: '/resources/pig-intelligence-guide.pdf',
    fileSize: 2457600, // 2.4MB
    pageCount: 18,
    difficulty: 'intermediate',
    targetAudience: ['visitors', 'educators', 'families'],
    language: 'en',
    lastUpdated: '2024-01-15',
    downloads: 1247,
    views: 2890,
    rating: 4.8,
    ratingCount: 156,
    featured: true,
    isPopular: true,
    keywords: ['pig', 'intelligence', 'cognition', 'research', 'behavior'],
    socialImage: '/images/resources/pig-intelligence-social.jpg',
    relatedResources: ['animal-cognition-video', 'farm-animal-emotions'],
    hasQuiz: true,
    certificateAvailable: false
  },
  {
    id: 'daily-care-routine',
    title: 'Daily Animal Care Routine at Harmony Farm',
    description: 'A detailed guide to our daily animal care routines, including feeding schedules, health checks, and enrichment activities for each species.',
    summary: 'Learn about the daily care routines that keep our sanctuary animals healthy and happy.',
    category: getResourceCategoryById('animal-care')!,
    tags: [resourceTags[0], resourceTags[14], resourceTags[19]], // beginner-friendly, daily-routine, safety
    type: 'guide',
    url: '/resources/daily-care-routine.pdf',
    fileSize: 1843200, // 1.8MB
    pageCount: 12,
    difficulty: 'beginner',
    targetAudience: ['volunteers', 'visitors'],
    language: 'en',
    lastUpdated: '2024-01-12',
    downloads: 892,
    views: 1534,
    rating: 4.6,
    ratingCount: 89,
    featured: false,
    isPopular: true,
    keywords: ['daily', 'routine', 'care', 'feeding', 'health', 'enrichment'],
    relatedResources: ['volunteer-handbook', 'animal-nutrition-basics'],
    hasQuiz: false,
    certificateAvailable: false
  },
  {
    id: 'animal-cognition-video',
    title: 'Farm Animal Cognition: What Science Tells Us',
    description: 'A 25-minute documentary featuring interviews with animal cognition researchers and footage of animals demonstrating their intelligence at our sanctuary.',
    summary: 'Documentary exploring the latest scientific research on farm animal intelligence.',
    category: getResourceCategoryById('animal-intelligence')!,
    tags: [resourceTags[3], resourceTags[4], resourceTags[16]], // video-content, research-based, cognition
    type: 'video',
    url: 'https://youtu.be/sanctuary-cognition-doc',
    duration: 25,
    difficulty: 'intermediate',
    targetAudience: ['visitors', 'educators', 'families'],
    language: 'en',
    lastUpdated: '2024-01-10',
    downloads: 0, // Videos don't have downloads
    views: 4567,
    rating: 4.9,
    ratingCount: 234,
    featured: true,
    isPopular: true,
    keywords: ['cognition', 'intelligence', 'research', 'documentary', 'science'],
    socialImage: '/images/resources/cognition-video-thumbnail.jpg',
    relatedResources: ['pig-intelligence-guide', 'farm-animal-emotions'],
    hasQuiz: true,
    certificateAvailable: false
  },

  // VEGANISM & PLANT-BASED LIVING
  {
    id: 'plant-based-starter-guide',
    title: 'Your Plant-Based Journey: A Beginner\'s Guide',
    description: 'Everything you need to know to start and maintain a plant-based lifestyle, including nutrition basics, meal planning, and recipe ideas.',
    summary: 'Complete beginner\'s guide to adopting a healthy, compassionate plant-based diet.',
    category: getResourceCategoryById('veganism-nutrition')!,
    tags: [resourceTags[0], resourceTags[6], resourceTags[7], resourceTags[8]], // beginner-friendly, nutrition, recipes, health
    type: 'guide',
    url: '/resources/plant-based-starter-guide.pdf',
    fileSize: 3145728, // 3MB
    pageCount: 24,
    difficulty: 'beginner',
    targetAudience: ['visitors', 'families'],
    language: 'en',
    lastUpdated: '2024-01-14',
    downloads: 2103,
    views: 3456,
    rating: 4.7,
    ratingCount: 187,
    featured: true,
    isPopular: true,
    keywords: ['vegan', 'plant-based', 'nutrition', 'recipes', 'health'],
    socialImage: '/images/resources/plant-based-guide-social.jpg',
    relatedResources: ['vegan-meal-prep', 'nutrition-facts-sheet'],
    hasQuiz: false,
    certificateAvailable: false
  },
  {
    id: 'vegan-meal-prep',
    title: '7-Day Vegan Meal Prep Planning Kit',
    description: 'Complete meal prep kit with shopping lists, prep schedules, and recipes for a full week of delicious plant-based meals.',
    summary: 'Weekly meal prep kit with shopping lists and easy plant-based recipes.',
    category: getResourceCategoryById('veganism-nutrition')!,
    tags: [resourceTags[1], resourceTags[7], resourceTags[0]], // printable, recipes, beginner-friendly
    type: 'checklist',
    url: '/resources/vegan-meal-prep-kit.pdf',
    fileSize: 1572864, // 1.5MB
    pageCount: 8,
    difficulty: 'beginner',
    targetAudience: ['visitors', 'families'],
    language: 'en',
    lastUpdated: '2024-01-13',
    downloads: 1456,
    views: 2234,
    rating: 4.5,
    ratingCount: 98,
    featured: false,
    isPopular: true,
    keywords: ['meal prep', 'recipes', 'planning', 'shopping', 'vegan'],
    relatedResources: ['plant-based-starter-guide', 'nutrition-facts-sheet'],
    hasQuiz: false,
    certificateAvailable: false
  },

  // SANCTUARY LIFE & OPERATIONS
  {
    id: 'sanctuary-tour-virtual',
    title: 'Virtual Sanctuary Tour: Behind the Scenes',
    description: 'Take an immersive virtual tour of our sanctuary, including areas not typically accessible during regular visits.',
    summary: 'Interactive virtual tour showing daily operations and behind-the-scenes sanctuary life.',
    category: getResourceCategoryById('sanctuary-life')!,
    tags: [resourceTags[2], resourceTags[3], resourceTags[14]], // interactive, video-content, daily-routine
    type: 'video',
    url: 'https://sanctuary-virtual-tour.com',
    duration: 45,
    difficulty: 'beginner',
    targetAudience: ['visitors', 'families', 'educators'],
    language: 'en',
    lastUpdated: '2024-01-11',
    downloads: 0,
    views: 3456,
    rating: 4.8,
    ratingCount: 167,
    featured: true,
    isPopular: true,
    keywords: ['virtual tour', 'sanctuary life', 'operations', 'behind scenes'],
    socialImage: '/images/resources/virtual-tour-social.jpg',
    relatedResources: ['daily-care-routine', 'volunteer-handbook'],
    hasQuiz: false,
    certificateAvailable: false
  },

  // VOLUNTEER TRAINING & RESOURCES
  {
    id: 'volunteer-handbook',
    title: 'Volunteer Handbook: Complete Training Guide',
    description: 'Comprehensive handbook covering all aspects of volunteering at the sanctuary, from animal handling to safety protocols.',
    summary: 'Complete training guide for new and experienced volunteers.',
    category: getResourceCategoryById('volunteer-resources')!,
    tags: [resourceTags[18], resourceTags[19], resourceTags[1]], // training-materials, safety, printable
    type: 'pdf',
    url: '/resources/volunteer-handbook.pdf',
    fileSize: 4194304, // 4MB
    pageCount: 32,
    difficulty: 'intermediate',
    targetAudience: ['volunteers'],
    language: 'en',
    lastUpdated: '2024-01-16',
    downloads: 567,
    views: 789,
    rating: 4.9,
    ratingCount: 45,
    featured: false,
    isPopular: false,
    keywords: ['volunteer', 'training', 'handbook', 'safety', 'protocols'],
    relatedResources: ['daily-care-routine', 'safety-protocols'],
    hasQuiz: true,
    certificateAvailable: true
  },

  // EDUCATIONAL ACTIVITIES & LESSON PLANS
  {
    id: 'classroom-activities-k5',
    title: 'Farm Animal Compassion: K-5 Classroom Activities',
    description: 'Age-appropriate activities and lesson plans for elementary students learning about farm animals and compassion.',
    summary: 'Elementary classroom activities teaching compassion and farm animal awareness.',
    category: getResourceCategoryById('educational-activities')!,
    tags: [resourceTags[5], resourceTags[20], resourceTags[22], resourceTags[0]], // kid-friendly, classroom, activities, beginner-friendly
    type: 'pdf',
    url: '/resources/k5-classroom-activities.pdf',
    fileSize: 2097152, // 2MB
    pageCount: 16,
    difficulty: 'beginner',
    targetAudience: ['educators'],
    language: 'en',
    lastUpdated: '2024-01-09',
    downloads: 678,
    views: 1123,
    rating: 4.6,
    ratingCount: 67,
    featured: false,
    isPopular: false,
    keywords: ['classroom', 'activities', 'elementary', 'compassion', 'education'],
    relatedResources: ['family-activity-book', 'animal-fact-sheets'],
    hasQuiz: false,
    certificateAvailable: false
  },

  // FAMILY & CHILDREN RESOURCES
  {
    id: 'family-activity-book',
    title: 'Sanctuary Friends: Family Activity Book',
    description: 'Fun activities, coloring pages, and educational games for children to learn about farm animals and kindness.',
    summary: 'Interactive activity book for children featuring sanctuary animals and kindness themes.',
    category: getResourceCategoryById('family-resources')!,
    tags: [resourceTags[5], resourceTags[1], resourceTags[22], resourceTags[2]], // kid-friendly, printable, activities, interactive
    type: 'pdf',
    url: '/resources/family-activity-book.pdf',
    fileSize: 2621440, // 2.5MB
    pageCount: 20,
    difficulty: 'beginner',
    targetAudience: ['families'],
    language: 'en',
    lastUpdated: '2024-01-08',
    downloads: 1234,
    views: 1987,
    rating: 4.7,
    ratingCount: 123,
    featured: false,
    isPopular: true,
    keywords: ['family', 'children', 'activities', 'coloring', 'games'],
    socialImage: '/images/resources/activity-book-social.jpg',
    relatedResources: ['classroom-activities-k5', 'animal-fact-sheets'],
    hasQuiz: false,
    certificateAvailable: false
  }
];

export const getResourceById = (id: string): EducationalResource | undefined => {
  return educationalResources.find(resource => resource.id === id);
};

export const getResourcesByCategory = (categoryId: string): EducationalResource[] => {
  return educationalResources.filter(resource => resource.category.id === categoryId)
    .sort((a, b) => b.downloads - a.downloads);
};

export const getFeaturedResources = (): EducationalResource[] => {
  return educationalResources.filter(resource => resource.featured)
    .sort((a, b) => b.rating - a.rating);
};

export const getPopularResources = (limit: number = 10): EducationalResource[] => {
  return educationalResources.filter(resource => resource.isPopular)
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, limit);
};

export const getResourcesByAudience = (audience: string): EducationalResource[] => {
  return educationalResources.filter(resource => 
    resource.targetAudience.includes(audience)
  ).sort((a, b) => b.rating - a.rating);
};

export const getResourcesByType = (type: string): EducationalResource[] => {
  return educationalResources.filter(resource => resource.type === type)
    .sort((a, b) => b.downloads - a.downloads);
};

export const searchResources = (query: string): EducationalResource[] => {
  const lowercaseQuery = query.toLowerCase();
  return educationalResources.filter(resource => 
    resource.title.toLowerCase().includes(lowercaseQuery) ||
    resource.description.toLowerCase().includes(lowercaseQuery) ||
    resource.summary.toLowerCase().includes(lowercaseQuery) ||
    resource.keywords.some(keyword => keyword.toLowerCase().includes(lowercaseQuery)) ||
    resource.tags.some(tag => tag.name.toLowerCase().includes(lowercaseQuery))
  ).sort((a, b) => b.rating - a.rating);
};

// Update tag counts based on actual resource usage
export const updateResourceTagCounts = (): void => {
  const tagCounts: Record<string, number> = {};
  
  educationalResources.forEach(resource => {
    resource.tags.forEach(tag => {
      tagCounts[tag.id] = (tagCounts[tag.id] || 0) + 1;
    });
  });
  
  resourceTags.forEach(tag => {
    tag.count = tagCounts[tag.id] || 0;
  });
};