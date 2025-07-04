// Admin System Types
// Comprehensive TypeScript interfaces for admin functionality

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: AdminRole;
  firstName: string;
  lastName: string;
  avatar?: string;
  lastLogin?: Date;
  permissions: AdminPermission[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type AdminRole = 'admin' | 'editor' | 'viewer';

export interface AdminPermission {
  resource: AdminResource;
  actions: AdminAction[];
}

export type AdminResource = 
  | 'admin'
  | 'animals' 
  | 'blog' 
  | 'faq' 
  | 'resources' 
  | 'volunteers' 
  | 'users' 
  | 'settings' 
  | 'analytics'
  | 'donations'
  | 'inquiries'
  | 'backup'
  | 'testing';

export type AdminAction = 'create' | 'read' | 'update' | 'delete';

export interface AdminAuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (resource: AdminResource, action: AdminAction) => boolean;
  hasRole: (role: AdminRole) => boolean;
}

export interface AdminSession {
  token: string;
  user: AdminUser;
  expiresAt: Date;
}

export interface AdminLoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface AdminLoginResponse {
  success: boolean;
  user?: AdminUser;
  token?: string;
  message?: string;
}

// Dashboard & Analytics Types
export interface AdminDashboardStats {
  totalAnimals: number;
  totalBlogPosts: number;
  totalVolunteers: number;
  totalFAQs: number;
  totalResources: number;
  recentActivity: AdminActivity[];
  quickActions: AdminQuickAction[];
}

export interface AdminActivity {
  id: string;
  type: AdminActivityType;
  user: string;
  resource: AdminResource;
  action: AdminAction;
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export type AdminActivityType = 
  | 'content_created' 
  | 'content_updated' 
  | 'content_deleted'
  | 'user_login'
  | 'settings_updated'
  | 'data_exported';

export interface AdminQuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  color: 'blue' | 'green' | 'orange' | 'purple' | 'red';
  permission?: {
    resource: AdminResource;
    action: AdminAction;
  };
}

// Table & Form Types
export interface AdminTableColumn<T = any> {
  key: keyof T | string;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, record: T) => React.ReactNode;
  width?: string;
}

export interface AdminTableProps<T = any> {
  columns: AdminTableColumn<T>[];
  data: T[];
  loading?: boolean;
  pagination?: AdminPagination;
  selection?: AdminTableSelection<T>;
  actions?: AdminTableAction<T>[];
  searchable?: boolean;
  filterable?: boolean;
  exportable?: boolean;
}

export interface AdminPagination {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  onChange: (page: number, pageSize: number) => void;
}

export interface AdminTableSelection<T> {
  type: 'checkbox' | 'radio';
  selectedRowKeys: string[];
  onChange: (selectedRowKeys: string[], selectedRows: T[]) => void;
  getCheckboxProps?: (record: T) => { disabled?: boolean };
}

export interface AdminTableAction<T> {
  title: string;
  icon?: string;
  color?: 'blue' | 'green' | 'orange' | 'red';
  onClick: (record: T) => void;
  disabled?: (record: T) => boolean;
  permission?: {
    resource: AdminResource;
    action: AdminAction;
  };
}

export interface AdminFormField {
  name: string;
  label: string;
  type: AdminFieldType;
  required?: boolean;
  validation?: AdminFieldValidation;
  options?: AdminFieldOption[];
  placeholder?: string;
  helpText?: string;
  disabled?: boolean;
  hidden?: boolean;
  defaultValue?: any;
}

export type AdminFieldType = 
  | 'text' 
  | 'textarea' 
  | 'email' 
  | 'password' 
  | 'number' 
  | 'select' 
  | 'multiselect'
  | 'checkbox' 
  | 'radio' 
  | 'date' 
  | 'datetime'
  | 'file' 
  | 'image'
  | 'rich-text'
  | 'json';

export interface AdminFieldValidation {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface AdminFieldOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface AdminFormProps {
  fields: AdminFormField[];
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  layout?: 'horizontal' | 'vertical';
  submitText?: string;
  cancelText?: string;
}

// Settings & Configuration Types
export interface AdminSettings {
  site: AdminSiteSettings;
  email: AdminEmailSettings;
  analytics: AdminAnalyticsSettings;
  backup: AdminBackupSettings;
  security: AdminSecuritySettings;
}

export interface AdminSiteSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  contactEmail: string;
  contactPhone: string;
  maintenanceMode: boolean;
  timezone: string;
  language: string;
}

export interface AdminEmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  templates: AdminEmailTemplate[];
}

export interface AdminEmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
}

export interface AdminAnalyticsSettings {
  googleAnalyticsId?: string;
  trackingEnabled: boolean;
  cookieConsent: boolean;
  dataRetentionDays: number;
}

export interface AdminBackupSettings {
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  maxBackups: number;
  includeImages: boolean;
  backupLocation: 'local' | 'cloud';
}

export interface AdminSecuritySettings {
  sessionTimeout: number; // minutes
  maxLoginAttempts: number;
  lockoutDuration: number; // minutes
  requireStrongPasswords: boolean;
  twoFactorAuth: boolean;
  auditLogging: boolean;
}

// Export & Import Types
export interface AdminExportOptions {
  format: 'json' | 'csv' | 'xlsx';
  resources: AdminResource[];
  includeMedia: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface AdminImportOptions {
  format: 'json' | 'csv' | 'xlsx';
  resource: AdminResource;
  overwrite: boolean;
  dryRun: boolean;
}

export interface AdminBackup {
  id: string;
  filename: string;
  size: number;
  createdAt: Date;
  resources: AdminResource[];
  metadata: Record<string, any>;
}

// Notification Types
export interface AdminNotification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface AdminNotificationContextType {
  notifications: AdminNotification[];
  unreadCount: number;
  addNotification: (notification: Omit<AdminNotification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

// ========================================
// Enhanced Animal Management Types (Phase 2, Step 5)
// ========================================

export interface AnimalPhoto {
  id: string;
  url: string;
  thumbnailUrl: string;
  caption?: string;
  isPrimary: boolean;
  uploadedBy: string;
  uploadedAt: Date;
  altText: string;
  tags: string[];
  metadata: {
    filename: string;
    size: number;
    dimensions: { width: number; height: number };
    format: string;
  };
}

export interface MedicalRecord {
  id: string;
  animalId: string;
  date: Date;
  type: 'vaccination' | 'treatment' | 'checkup' | 'surgery' | 'emergency' | 'dental' | 'diagnostic';
  title: string;
  description: string;
  veterinarian: {
    name: string;
    clinic: string;
    phone: string;
    email?: string;
  };
  diagnosis?: string;
  treatment?: string;
  medications?: AnimalMedication[];
  cost?: number;
  followUpRequired: boolean;
  followUpDate?: Date;
  nextAppointment?: Date;
  attachments?: {
    id: string;
    filename: string;
    url: string;
    type: 'image' | 'document' | 'xray' | 'lab_result';
  }[];
  isEmergency: boolean;
  status: 'completed' | 'ongoing' | 'scheduled' | 'cancelled';
  notes?: string;
  addedBy: string;
  lastModified: Date;
}

export interface AnimalMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  isOngoing: boolean;
  prescribedBy: string;
  purpose: string;
  sideEffects?: string[];
  instructions?: string;
  cost?: number;
}

export interface Sponsor {
  id: string;
  type: 'individual' | 'family' | 'business' | 'organization';
  firstName: string;
  lastName?: string;
  businessName?: string;
  email: string;
  phone?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  sponsorshipTier: 'basic' | 'premium' | 'guardian' | 'lifetime';
  monthlyAmount: number;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  animalsSponsored: string[];
  totalDonated: number;
  paymentMethod: 'credit_card' | 'bank_transfer' | 'paypal' | 'check';
  preferences: {
    communicationFrequency: 'weekly' | 'monthly' | 'quarterly' | 'annually';
    receiveUpdates: boolean;
    receivePhotos: boolean;
    receiveNewsletter: boolean;
    visitPreferences: 'in_person' | 'virtual' | 'both' | 'none';
  };
  notes?: string;
  addedBy: string;
  lastContact?: Date;
  renewalReminder?: Date;
}

export interface CareNote {
  id: string;
  animalId: string;
  date: Date;
  category: 'feeding' | 'behavior' | 'health' | 'enrichment' | 'training' | 'social' | 'maintenance' | 'other';
  title: string;
  content: string;
  caregiverName: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isPublic: boolean; // Can be shared with sponsors
  tags: string[];
  attachments?: {
    id: string;
    filename: string;
    url: string;
    type: 'image' | 'video' | 'document';
  }[];
  relatedAnimals?: string[]; // For group activities
  addedBy: string;
  lastModified: Date;
}

export interface AnimalAnalytics {
  animalId: string;
  careStats: {
    totalCareNotes: number;
    recentCareNotes: number; // Last 30 days
    careFrequency: Record<CareNote['category'], number>;
    averageCareInterval: number; // Days between care notes
  };
  medicalStats: {
    totalMedicalRecords: number;
    recentMedicalRecords: number; // Last 30 days
    totalMedicalCost: number;
    yearlyMedicalCost: number;
    vaccinationStatus: 'up_to_date' | 'due_soon' | 'overdue';
    nextVaccinationDate?: Date;
    ongoingMedications: number;
  };
  sponsorshipStats: {
    totalSponsors: number;
    activeSponsors: number;
    monthlyRevenue: number;
    yearlyRevenue: number;
    sponsorshipGoal: number;
    sponsorshipPercentage: number;
    averageSponsorshipDuration: number; // Months
    renewalRate: number; // Percentage
  };
  engagementStats: {
    pageViews: number;
    profileViews: number;
    photoViews: number;
    sponsorshipInquiries: number;
    socialShares: number;
    lastUpdated: Date;
  };
}

export interface EnhancedAnimal extends Omit<import('../types').Animal, 'images' | 'medicalHistory'> {
  // Enhanced photo management
  photos: AnimalPhoto[];
  
  // Medical tracking
  medicalHistory: MedicalRecord[];
  currentMedications: AnimalMedication[];
  vaccinations: {
    type: string;
    date: Date;
    nextDue: Date;
    veterinarian: string;
  }[];
  
  // Sponsorship management
  sponsors: Sponsor[];
  sponsorshipGoals: {
    monthlyTarget: number;
    currentAmount: number;
    goalDescription: string;
  };
  
  // Care tracking
  careNotes: CareNote[];
  careSchedule: {
    feeding: { times: string[]; diet: string; notes?: string };
    exercise: { frequency: string; duration: string; activities: string[] };
    grooming: { frequency: string; lastGroomed?: Date; notes?: string };
    enrichment: { activities: string[]; frequency: string; preferences: string[] };
  };
  
  // Analytics and metrics
  analytics: AnimalAnalytics;
  
  // Enhanced admin fields
  adminNotes: string;
  internalStatus: 'active' | 'inactive' | 'archived';
  lastUpdated: Date;
  updatedBy: string;
  publicProfile: boolean; // Whether to show on public website
  featuredUntil?: Date; // When to stop featuring
  
  // Content management
  storyLastUpdated?: Date;
  photosLastUpdated?: Date;
  needsContentUpdate: boolean;
  contentReviewDate?: Date;
}

// Animal Management Helper Types
export interface AnimalSearchFilters {
  species?: string[];
  status?: string[];
  sponsorshipStatus?: 'sponsored' | 'not_sponsored' | 'partially_sponsored';
  careLevel?: string[];
  medicalStatus?: 'healthy' | 'treatment' | 'chronic' | 'emergency';
  ageRange?: { min: number; max: number };
  arrivalDateRange?: { start: Date; end: Date };
  hasPhotos?: boolean;
  needsUpdate?: boolean;
}

export interface AnimalFormData {
  basic: Pick<EnhancedAnimal, 'name' | 'species' | 'breed' | 'gender' | 'age' | 'weight' | 'color'>;
  story: Pick<EnhancedAnimal, 'story' | 'rescueStory' | 'personalityDescription'>;
  care: Pick<EnhancedAnimal, 'careLevel' | 'specialNeeds' | 'housingType' | 'companionAnimals'>;
  medical: Pick<EnhancedAnimal, 'medicalNeeds' | 'specialDiet' | 'medications'>;
  sponsorship: Pick<EnhancedAnimal, 'sponsorshipCost' | 'maxSponsors' | 'sponsorshipBenefits'>;
  admin: Pick<EnhancedAnimal, 'adminNotes' | 'internalStatus' | 'publicProfile'>;
}