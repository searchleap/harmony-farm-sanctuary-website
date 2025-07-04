// FAQ Categories for Harmony Farm Sanctuary
// Organized categories for comprehensive FAQ system

import { FAQCategory } from '../types/faq';

export const faqCategories: FAQCategory[] = [
  {
    id: 'visiting',
    name: 'Visiting the Sanctuary',
    description: 'Information about tours, hours, and what to expect during your visit',
    slug: 'visiting',
    icon: 'MapPin',
    color: '#3B82F6',
    questionCount: 0,
    priority: 1,
    depth: 0,
    path: 'Visiting the Sanctuary',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'animals',
    name: 'Our Animals',
    description: 'Learn about the animals we care for and their individual stories',
    slug: 'animals',
    icon: 'Heart',
    color: '#10B981',
    questionCount: 0,
    priority: 2,
    depth: 0,
    path: 'Our Animals',
    isActive: true,
    createdAt: '2024-01-15T10:05:00Z',
    updatedAt: '2024-01-15T10:05:00Z'
  },
  {
    id: 'volunteering',
    name: 'Volunteering',
    description: 'How to get involved and make a difference at the sanctuary',
    slug: 'volunteering',
    icon: 'Users',
    color: '#F59E0B',
    questionCount: 0,
    priority: 3,
    depth: 0,
    path: 'Volunteering',
    isActive: true,
    createdAt: '2024-01-15T10:10:00Z',
    updatedAt: '2024-01-15T10:10:00Z'
  },
  {
    id: 'donations',
    name: 'Donations & Support',
    description: 'Ways to financially support our mission and animals',
    slug: 'donations',
    icon: 'DollarSign',
    color: '#8B5CF6',
    questionCount: 0,
    priority: 4,
    depth: 0,
    path: 'Donations & Support',
    isActive: true,
    createdAt: '2024-01-15T10:15:00Z',
    updatedAt: '2024-01-15T10:15:00Z'
  },
  {
    id: 'adoption-sponsorship',
    name: 'Adoption & Sponsorship',
    description: 'Programs for adopting or sponsoring sanctuary animals',
    slug: 'adoption-sponsorship',
    icon: 'Gift',
    color: '#EC4899',
    questionCount: 0,
    priority: 5,
    depth: 0,
    path: 'Adoption & Sponsorship',
    isActive: true,
    createdAt: '2024-01-15T10:20:00Z',
    updatedAt: '2024-01-15T10:20:00Z'
  },
  {
    id: 'animal-care',
    name: 'Animal Care & Welfare',
    description: 'Our approach to animal care, veterinary services, and wellbeing',
    slug: 'animal-care',
    icon: 'Stethoscope',
    color: '#06B6D4',
    questionCount: 0,
    priority: 6,
    depth: 0,
    path: 'Animal Care & Welfare',
    isActive: true,
    createdAt: '2024-01-15T10:25:00Z',
    updatedAt: '2024-01-15T10:25:00Z'
  },
  {
    id: 'education',
    name: 'Education & Learning',
    description: 'Educational programs, resources, and learning opportunities',
    slug: 'education',
    icon: 'BookOpen',
    color: '#84CC16',
    questionCount: 0,
    priority: 7,
    depth: 0,
    path: 'Education & Learning',
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'general',
    name: 'General Information',
    description: 'Basic information about the sanctuary, mission, and operations',
    slug: 'general',
    icon: 'Info',
    color: '#6366F1',
    questionCount: 0,
    priority: 8,
    depth: 0,
    path: 'General Information',
    isActive: true,
    createdAt: '2024-01-15T10:35:00Z',
    updatedAt: '2024-01-15T10:35:00Z'
  }
];

export const getCategoryById = (id: string): FAQCategory | undefined => {
  return faqCategories.find(category => category.id === id);
};

export const getCategoryBySlug = (slug: string): FAQCategory | undefined => {
  return faqCategories.find(category => category.slug === slug);
};

export const updateCategoryQuestionCounts = (categoryQuestionCounts: Record<string, number>): void => {
  faqCategories.forEach(category => {
    category.questionCount = categoryQuestionCounts[category.id] || 0;
  });
};