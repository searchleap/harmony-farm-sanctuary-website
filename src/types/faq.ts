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
  parentId?: string; // For hierarchical categories
  depth: number; // Hierarchy depth (0 = root)
  path: string; // Full category path for breadcrumbs
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
  
  // Enhanced features
  status: 'draft' | 'pending_review' | 'approved' | 'published' | 'archived';
  version: number;
  seoScore?: number; // SEO optimization score 0-100
  readabilityScore?: number; // Content readability score 0-100
  createdAt: string;
  publishedAt?: string;
  archivedAt?: string;
}

// New interfaces for enhanced features
export interface FAQVersion {
  id: string;
  faqId: string;
  version: number;
  question: string;
  answer: string;
  changelog: string;
  author: string;
  createdAt: string;
  status: 'draft' | 'pending_review' | 'approved' | 'published';
}

export interface FAQHelpfulness {
  faqId: string;
  helpful: number;
  notHelpful: number;
  comments: FAQFeedback[];
  improvementSuggestions: string[];
  lastAnalyzed: string;
}

export interface FAQFeedback {
  id: string;
  faqId: string;
  helpful: boolean;
  comment?: string;
  userAgent?: string;
  createdAt: string;
}

export interface FAQBulkOperation {
  type: 'categorize' | 'tag' | 'status_change' | 'delete' | 'export';
  faqIds: string[];
  data: Record<string, any>;
  createdBy: string;
  createdAt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: string;
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

// Version Control & Workflow Types
export type WorkflowState = 'draft' | 'review' | 'approved' | 'published' | 'archived';

export interface ContentVersion {
  id: string;
  content_id: string;
  content_type: 'faq' | 'resource';
  version_number: number;
  title: string;
  content: any; // Stores the full content snapshot
  changes_summary: string;
  created_by: string;
  created_at: string;
  is_current: boolean;
  workflow_state: WorkflowState;
  approval_data?: ApprovalData;
}

export interface VersionDiff {
  field: string;
  field_label: string;
  old_value: any;
  new_value: any;
  change_type: 'added' | 'removed' | 'modified';
}

export interface ApprovalData {
  submitted_by: string;
  submitted_at: string;
  current_stage: ApprovalStage;
  stages: ApprovalStage[];
  comments: ApprovalComment[];
}

export interface ApprovalStage {
  id: string;
  name: string;
  role_required: string;
  order: number;
  status: 'pending' | 'approved' | 'rejected' | 'skipped';
  approved_by?: string;
  approved_at?: string;
  notes?: string;
}

export interface ApprovalComment {
  id: string;
  stage_id: string;
  author: string;
  content: string;
  created_at: string;
  is_internal: boolean;
}

export interface WorkflowTransition {
  from_state: WorkflowState;
  to_state: WorkflowState;
  action: string;
  role_required: string;
  requires_approval: boolean;
}

export interface ChangeRecord {
  id: string;
  content_id: string;
  content_type: 'faq' | 'resource';
  version_id: string;
  changed_by: string;
  changed_at: string;
  changes: VersionDiff[];
  change_reason?: string;
  is_major_change: boolean;
}

// User Feedback & Rating System Types
export interface UserFeedback {
  id: string;
  content_id: string;
  content_type: 'faq' | 'resource';
  user_id?: string; // Optional for anonymous feedback
  feedback_type: 'helpfulness' | 'rating' | 'comment' | 'suggestion';
  
  // Feedback data
  helpful?: boolean; // For helpfulness votes
  rating?: number; // 1-5 star rating
  comment?: string; // Text feedback
  categories?: FeedbackCategory[]; // Specific aspects rated
  
  // Context
  user_agent?: string;
  session_id?: string;
  referrer?: string;
  time_spent?: number; // Seconds spent on content
  
  // Metadata
  created_at: string;
  updated_at?: string;
  status: 'pending' | 'approved' | 'flagged' | 'hidden';
  moderated_by?: string;
  moderated_at?: string;
  moderation_notes?: string;
}

export interface FeedbackCategory {
  name: string;
  rating: number; // 1-5
  weight?: number; // For weighted averages
}

export interface FeedbackMetrics {
  content_id: string;
  content_type: 'faq' | 'resource';
  
  // Helpfulness metrics
  helpful_count: number;
  not_helpful_count: number;
  helpfulness_ratio: number; // helpful / (helpful + not_helpful)
  
  // Rating metrics
  average_rating: number;
  rating_count: number;
  rating_distribution: Record<number, number>; // 1-5 star counts
  
  // Category ratings
  category_ratings: Record<string, {
    average: number;
    count: number;
  }>;
  
  // Engagement metrics
  total_feedback_count: number;
  comment_count: number;
  suggestion_count: number;
  
  // Quality indicators
  sentiment_score?: number; // -1 to 1
  quality_score?: number; // 0-100
  improvement_priority?: 'low' | 'medium' | 'high';
  
  last_updated: string;
}

export interface SentimentAnalysis {
  score: number; // -1 (negative) to 1 (positive)
  magnitude: number; // 0 to 1 (intensity)
  classification: 'positive' | 'neutral' | 'negative';
  keywords: string[];
  themes: string[];
  confidence: number; // 0 to 1
}

export interface FeedbackSuggestion {
  id: string;
  content_id: string;
  content_type: 'faq' | 'resource';
  suggestion_type: 'content_update' | 'new_faq' | 'categorization' | 'formatting';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  confidence_score: number; // 0-1
  
  // Supporting data
  feedback_count: number;
  user_sentiment: number;
  common_keywords: string[];
  
  // Implementation
  status: 'pending' | 'in_progress' | 'completed' | 'dismissed';
  assigned_to?: string;
  implemented_at?: string;
  
  created_at: string;
  updated_at: string;
}

export interface FeedbackTrend {
  period: string; // Date period (day, week, month)
  content_id: string;
  content_type: 'faq' | 'resource';
  
  // Trend data
  helpful_votes: number;
  not_helpful_votes: number;
  average_rating: number;
  feedback_volume: number;
  sentiment_trend: number; // Change in sentiment
  
  // Comparison
  vs_previous_period: {
    helpful_change: number;
    rating_change: number;
    volume_change: number;
    sentiment_change: number;
  };
}

export interface FeedbackWidget {
  content_id: string;
  content_type: 'faq' | 'resource';
  widget_type: 'simple_thumbs' | 'star_rating' | 'detailed_form' | 'quick_survey';
  
  // Configuration
  enabled: boolean;
  position: 'top' | 'bottom' | 'sidebar' | 'inline';
  trigger: 'immediate' | 'on_scroll' | 'on_exit' | 'timed';
  trigger_delay?: number; // Seconds
  
  // Customization
  title?: string;
  description?: string;
  categories?: string[]; // For detailed ratings
  required_fields?: string[];
  
  // Behavior
  allow_anonymous: boolean;
  require_email: boolean;
  show_results: boolean;
  auto_hide_after_feedback: boolean;
}