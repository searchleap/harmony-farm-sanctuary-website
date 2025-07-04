/**
 * Settings & Configuration Management Types
 * Comprehensive TypeScript interfaces for the admin settings system
 */

// User Roles and Permissions
export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string; // 'create' | 'read' | 'update' | 'delete' | 'admin'
  description: string;
}

export interface UserRole {
  id: string;
  name: string;
  slug: string;
  description: string;
  permissions: Permission[];
  users: string[]; // User IDs
  isSystemRole: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// General Settings
export interface ContactInfo {
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  hours: {
    general: string;
    tours: string;
    emergency: string;
  };
}

export interface SocialMediaLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
  linkedin?: string;
}

export interface GeneralSettings {
  siteName: string;
  tagline: string;
  description: string;
  logoUrl?: string;
  faviconUrl?: string;
  contactInfo: ContactInfo;
  socialMedia: SocialMediaLinks;
  timezone: string;
  locale: string;
  dateFormat: string;
  currency: string;
  maintenanceMode: boolean;
  maintenanceMessage?: string;
  googleAnalyticsId?: string;
  facebookPixelId?: string;
}

// Security Settings
export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  expirationDays?: number;
  preventReuse: number; // Number of previous passwords to prevent reuse
}

export interface SecuritySettings {
  sessionTimeout: number; // Minutes
  passwordPolicy: PasswordPolicy;
  twoFactorAuth: {
    enabled: boolean;
    required: boolean;
    methods: ('email' | 'sms' | 'app')[];
  };
  apiRateLimit: {
    requestsPerMinute: number;
    enabled: boolean;
  };
  contentApproval: {
    enabled: boolean;
    requiresApproval: string[]; // Content types that require approval
  };
  loginAttempts: {
    maxAttempts: number;
    lockoutDuration: number; // Minutes
  };
  ipWhitelist?: string[];
  ipBlacklist?: string[];
}

// Content Settings
export interface ContentSettings {
  defaultVisibility: 'public' | 'private' | 'restricted';
  enableComments: boolean;
  moderateComments: boolean;
  enableRatings: boolean;
  allowGuestComments: boolean;
  mediaUpload: {
    maxFileSize: number; // MB
    allowedTypes: string[];
    enableImageOptimization: boolean;
    enableImageWatermark: boolean;
    watermarkText?: string;
  };
  seo: {
    enableMetaTags: boolean;
    enableStructuredData: boolean;
    defaultMetaDescription: string;
    enableSitemap: boolean;
    enableRobotsTxt: boolean;
  };
  archival: {
    autoArchiveAfterDays?: number;
    enableVersioning: boolean;
    maxVersions: number;
  };
  newletter: {
    enableSignup: boolean;
    requireDoubleOptIn: boolean;
    defaultListId?: string;
  };
}

// Integration Settings
export interface EmailSettings {
  provider: 'sendgrid' | 'mailchimp' | 'aws-ses' | 'custom';
  apiKey: string;
  fromEmail: string;
  fromName: string;
  replyToEmail?: string;
  enableTracking: boolean;
}

export interface PaymentSettings {
  providers: {
    stripe?: {
      enabled: boolean;
      publicKey: string;
      secretKey: string;
      webhookSecret: string;
    };
    paypal?: {
      enabled: boolean;
      clientId: string;
      clientSecret: string;
      environment: 'sandbox' | 'production';
    };
  };
  currency: string;
  enableRecurring: boolean;
  enableTestMode: boolean;
}

export interface AnalyticsSettings {
  google?: {
    enabled: boolean;
    trackingId: string;
    enableEcommerce: boolean;
    enableReports: boolean;
  };
  facebook?: {
    enabled: boolean;
    pixelId: string;
    enableConversions: boolean;
  };
  custom?: {
    enabled: boolean;
    scriptUrl: string;
    configuration: Record<string, any>;
  };
}

export interface IntegrationSettings {
  email: EmailSettings;
  payment: PaymentSettings;
  analytics: AnalyticsSettings;
  socialMedia: {
    enableAutoPosting: boolean;
    platforms: Record<string, {
      enabled: boolean;
      apiKey?: string;
      accessToken?: string;
    }>;
  };
  newsletter: {
    provider: 'mailchimp' | 'sendgrid' | 'constant-contact' | 'custom';
    apiKey: string;
    listId: string;
    enableWelcomeEmail: boolean;
  };
}

// API Configuration
export interface APIEndpoint {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  enabled: boolean;
  lastChecked?: Date;
  status: 'healthy' | 'warning' | 'error' | 'unknown';
  responseTime?: number;
}

export interface APIConfiguration {
  baseUrl: string;
  version: string;
  timeout: number; // Seconds
  retryAttempts: number;
  endpoints: APIEndpoint[];
  authentication: {
    type: 'none' | 'api-key' | 'oauth' | 'bearer';
    apiKey?: string;
    bearerToken?: string;
    oauth?: {
      clientId: string;
      clientSecret: string;
      authUrl: string;
      tokenUrl: string;
    };
  };
  monitoring: {
    enableHealthChecks: boolean;
    checkInterval: number; // Minutes
    enableLogging: boolean;
    enableMetrics: boolean;
  };
}

// Complete Settings Interface
export interface Settings {
  general: GeneralSettings;
  security: SecuritySettings;
  content: ContentSettings;
  integrations: IntegrationSettings;
  api: APIConfiguration;
  lastUpdated: Date;
  version: string;
}

// Settings Update Types
export interface SettingsUpdate {
  section: keyof Settings;
  data: Partial<Settings[keyof Settings]>;
  updatedBy: string;
  timestamp: Date;
}

export interface SettingsValidation {
  isValid: boolean;
  errors: {
    field: string;
    message: string;
  }[];
  warnings: {
    field: string;
    message: string;
  }[];
}

// Settings History
export interface SettingsHistory {
  id: string;
  changeType: 'create' | 'update' | 'delete';
  section: keyof Settings;
  previousValue?: any;
  newValue: any;
  changedBy: string;
  timestamp: Date;
  reason?: string;
}

// Settings Templates
export interface SettingsTemplate {
  id: string;
  name: string;
  description: string;
  settings: Partial<Settings>;
  category: 'basic' | 'advanced' | 'enterprise' | 'custom';
  isDefault: boolean;
  createdAt: Date;
}

// Export utility types for form handling
export type SettingsSection = keyof Settings;
export type SettingsFormData<T extends SettingsSection> = Partial<Settings[T]>;