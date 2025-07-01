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
  | 'animals' 
  | 'blog' 
  | 'faq' 
  | 'resources' 
  | 'volunteers' 
  | 'users' 
  | 'settings' 
  | 'analytics'
  | 'donations';

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