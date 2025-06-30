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
    color: 'sanctuary',
    questionCount: 0, // Will be calculated
    priority: 1
  },
  {
    id: 'animals',
    name: 'Our Animals',
    description: 'Learn about the animals we care for and their individual stories',
    slug: 'animals',
    icon: 'Heart',
    color: 'earth',
    questionCount: 0,
    priority: 2
  },
  {
    id: 'volunteering',
    name: 'Volunteering',
    description: 'How to get involved and make a difference at the sanctuary',
    slug: 'volunteering',
    icon: 'Users',
    color: 'green',
    questionCount: 0,
    priority: 3
  },
  {
    id: 'donations',
    name: 'Donations & Support',
    description: 'Ways to financially support our mission and animals',
    slug: 'donations',
    icon: 'DollarSign',
    color: 'sanctuary',
    questionCount: 0,
    priority: 4
  },
  {
    id: 'adoption-sponsorship',
    name: 'Adoption & Sponsorship',
    description: 'Programs for adopting or sponsoring sanctuary animals',
    slug: 'adoption-sponsorship',
    icon: 'Gift',
    color: 'earth',
    questionCount: 0,
    priority: 5
  },
  {
    id: 'animal-care',
    name: 'Animal Care & Welfare',
    description: 'Our approach to animal care, veterinary services, and wellbeing',
    slug: 'animal-care',
    icon: 'Stethoscope',
    color: 'green',
    questionCount: 0,
    priority: 6
  },
  {
    id: 'education',
    name: 'Education & Learning',
    description: 'Educational programs, resources, and learning opportunities',
    slug: 'education',
    icon: 'BookOpen',
    color: 'sanctuary',
    questionCount: 0,
    priority: 7
  },
  {
    id: 'general',
    name: 'General Information',
    description: 'Basic information about the sanctuary, mission, and operations',
    slug: 'general',
    icon: 'Info',
    color: 'earth',
    questionCount: 0,
    priority: 8
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