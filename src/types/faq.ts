// FAQ and Educational Resources System Types
// Comprehensive TypeScript interfaces for Harmony Farm Sanctuary FAQ and learning system

export interface FAQCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
  icon: string; // Lucide icon name
  color: string;
  questionCount: number;
  priority: number; // Display order
}

export interface FAQTag {
  id: string;
  name: string;
  slug: string;
  count: number;
  category?: string; // Optional category association
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: FAQCategory;
  tags: FAQTag[];
  
  // Organization and display
  priority: number; // Higher = more important
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  lastUpdated: string;
  
  // User interaction
  views: number;
  helpful: number; // Helpful votes
  notHelpful: number; // Not helpful votes
  helpfulnessRatio: number; // Calculated: helpful / (helpful + notHelpful)
  
  // Content structure
  shortAnswer?: string; // Brief answer for previews
  relatedFAQs?: string[]; // FAQ IDs
  relatedResources?: string[]; // Resource IDs
  
  // Metadata
  author: string; // Staff member who created/maintains
  keywords: string[]; // For search optimization
  isPopular: boolean; // Trending FAQ
  isFeatured: boolean; // Featured on homepage
}

export interface ResourceCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
  icon: string; // Lucide icon name
  color: string;
  resourceCount: number;
  targetAudience: string[]; // ['visitors', 'volunteers', 'educators', 'families']
}

export interface ResourceTag {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface EducationalResource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  tags: ResourceTag[];
  
  // Resource details
  type: 'pdf' | 'video' | 'article' | 'infographic' | 'quiz' | 'guide' | 'checklist';
  url?: string; // External URL or download link
  fileSize?: number; // In bytes
  duration?: number; // For videos, in minutes
  pageCount?: number; // For PDFs
  
  // Content metadata
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  targetAudience: string[]; // ['visitors', 'volunteers', 'educators', 'families']
  language: string; // ISO language code
  lastUpdated: string;
  
  // Engagement metrics
  downloads: number;
  views: number;
  rating: number; // Average rating 1-5
  ratingCount: number;
  
  // Content organization
  featured: boolean;
  isPopular: boolean;
  relatedResources?: string[]; // Resource IDs
  relatedFAQs?: string[]; // FAQ IDs
  
  // Learning features
  hasQuiz?: boolean;
  certificateAvailable?: boolean;
  prerequisites?: string[]; // Resource IDs that should be completed first
  
  // SEO and sharing
  keywords: string[];
  socialImage?: string;
  summary: string; // Brief description for cards/previews
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  
  // Path structure
  resources: string[]; // Ordered list of resource IDs
  estimatedTime: number; // Total time in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  
  // Progress tracking
  completionRate: number; // Percentage of users who complete
  averageRating: number;
  enrollmentCount: number;
  
  // Metadata
  featured: boolean;
  certificateAwarded: boolean;
  targetAudience: string[];
  tags: string[];
}

export interface UserProgress {
  userId?: string; // Anonymous users get local storage
  completedResources: string[];
  bookmarkedResources: string[];
  downloadedResources: string[];
  pathProgress: Record<string, number>; // pathId -> percentage complete
  certificates: string[]; // Certificate IDs earned
  totalLearningTime: number; // Minutes spent learning
}

export interface SearchParams {
  query?: string;
  category?: string;
  tags?: string[];
  type?: string; // FAQ or Resource type
  difficulty?: string;
  audience?: string;
  sortBy?: 'relevance' | 'date' | 'popularity' | 'rating' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  searchTime: number; // Milliseconds
  suggestions?: string[]; // Alternative search terms
}

export interface Analytics {
  // FAQ Analytics
  popularFAQs: FAQ[];
  categoryPopularity: Record<string, number>;
  searchQueries: Record<string, number>;
  helpfulnessStats: {
    averageHelpfulness: number;
    totalVotes: number;
    improvementSuggestions: string[];
  };
  
  // Resource Analytics
  popularResources: EducationalResource[];
  downloadStats: Record<string, number>;
  completionRates: Record<string, number>;
  userEngagement: {
    averageSessionTime: number;
    returnVisitorRate: number;
    resourcesPerSession: number;
  };
}

export interface Feedback {
  id: string;
  type: 'faq' | 'resource' | 'general';
  targetId: string; // FAQ ID or Resource ID
  rating?: number; // 1-5 stars
  helpful?: boolean; // For FAQ feedback
  feedback: string;
  email?: string; // Optional for follow-up
  createdAt: string;
  status: 'pending' | 'reviewed' | 'addressed';
}

// Component prop interfaces
export interface FAQSearchProps {
  onSearch: (params: SearchParams) => void;
  placeholder?: string;
  showFilters?: boolean;
  categories?: FAQCategory[];
  tags?: FAQTag[];
}

export interface ResourceFiltersProps {
  categories: ResourceCategory[];
  tags: ResourceTag[];
  selectedCategory?: string;
  selectedTags?: string[];
  selectedDifficulty?: string;
  selectedAudience?: string;
  selectedType?: string;
  onFilterChange: (filters: Partial<SearchParams>) => void;
  onReset: () => void;
}

export interface FAQItemProps {
  faq: FAQ;
  expanded?: boolean;
  onToggle?: (faqId: string) => void;
  onFeedback?: (faqId: string, helpful: boolean) => void;
  showMetrics?: boolean;
}

export interface ResourceCardProps {
  resource: EducationalResource;
  variant?: 'default' | 'compact' | 'featured' | 'list';
  showProgress?: boolean;
  onDownload?: (resourceId: string) => void;
  onBookmark?: (resourceId: string) => void;
  onRate?: (resourceId: string, rating: number) => void;
}