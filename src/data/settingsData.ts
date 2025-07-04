/**
 * Settings Sample Data
 * Realistic configuration data for the settings management system
 */

import { 
  Settings, 
  UserRole, 
  Permission, 
  SettingsTemplate,
  SettingsHistory 
} from '../types/settings';

// Sample Permissions
export const samplePermissions: Permission[] = [
  // Dashboard permissions
  { id: 'dash-1', name: 'View Dashboard', resource: 'dashboard', action: 'read', description: 'Access to main admin dashboard' },
  
  // Content permissions
  { id: 'content-1', name: 'View Content', resource: 'content', action: 'read', description: 'View all content' },
  { id: 'content-2', name: 'Create Content', resource: 'content', action: 'create', description: 'Create new content' },
  { id: 'content-3', name: 'Edit Content', resource: 'content', action: 'update', description: 'Edit existing content' },
  { id: 'content-4', name: 'Delete Content', resource: 'content', action: 'delete', description: 'Delete content' },
  
  // Animals permissions
  { id: 'animals-1', name: 'View Animals', resource: 'animals', action: 'read', description: 'View animal profiles' },
  { id: 'animals-2', name: 'Manage Animals', resource: 'animals', action: 'update', description: 'Edit animal profiles' },
  { id: 'animals-3', name: 'Add Animals', resource: 'animals', action: 'create', description: 'Add new animals' },
  
  // Blog permissions
  { id: 'blog-1', name: 'View Blog', resource: 'blog', action: 'read', description: 'View blog posts' },
  { id: 'blog-2', name: 'Write Blog', resource: 'blog', action: 'create', description: 'Create new blog posts' },
  { id: 'blog-3', name: 'Edit Blog', resource: 'blog', action: 'update', description: 'Edit blog posts' },
  { id: 'blog-4', name: 'Publish Blog', resource: 'blog', action: 'admin', description: 'Publish and manage blog posts' },
  
  // Users permissions
  { id: 'users-1', name: 'View Users', resource: 'users', action: 'read', description: 'View user accounts' },
  { id: 'users-2', name: 'Manage Users', resource: 'users', action: 'update', description: 'Edit user accounts' },
  { id: 'users-3', name: 'Admin Users', resource: 'users', action: 'admin', description: 'Full user management' },
  
  // Settings permissions
  { id: 'settings-1', name: 'View Settings', resource: 'settings', action: 'read', description: 'View system settings' },
  { id: 'settings-2', name: 'Manage Settings', resource: 'settings', action: 'update', description: 'Edit system settings' },
  { id: 'settings-3', name: 'Admin Settings', resource: 'settings', action: 'admin', description: 'Full settings management' },
  
  // Analytics permissions
  { id: 'analytics-1', name: 'View Analytics', resource: 'analytics', action: 'read', description: 'View analytics data' },
  { id: 'analytics-2', name: 'Export Analytics', resource: 'analytics', action: 'admin', description: 'Export analytics reports' },
];

// Sample User Roles
export const sampleUserRoles: UserRole[] = [
  {
    id: 'role-1',
    name: 'Super Admin',
    slug: 'super-admin',
    description: 'Full system access with all permissions',
    permissions: samplePermissions, // All permissions
    users: ['user-1'],
    isSystemRole: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'role-2',
    name: 'Content Editor',
    slug: 'content-editor',
    description: 'Can manage content, animals, and blog posts',
    permissions: samplePermissions.filter(p => 
      ['dashboard', 'content', 'animals', 'blog'].includes(p.resource) && 
      ['read', 'create', 'update'].includes(p.action)
    ),
    users: ['user-2', 'user-3'],
    isSystemRole: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: 'role-3',
    name: 'Content Moderator',
    slug: 'content-moderator',
    description: 'Can view and moderate content but not create',
    permissions: samplePermissions.filter(p => 
      ['dashboard', 'content', 'blog'].includes(p.resource) && 
      ['read', 'update'].includes(p.action)
    ),
    users: ['user-4'],
    isSystemRole: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-10')
  },
  {
    id: 'role-4',
    name: 'Analytics Viewer',
    slug: 'analytics-viewer',
    description: 'Read-only access to analytics and reports',
    permissions: samplePermissions.filter(p => 
      ['dashboard', 'analytics'].includes(p.resource) && 
      p.action === 'read'
    ),
    users: ['user-5'],
    isSystemRole: false,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-15')
  },
  {
    id: 'role-5',
    name: 'Volunteer Coordinator',
    slug: 'volunteer-coordinator',
    description: 'Can manage volunteers and users',
    permissions: samplePermissions.filter(p => 
      ['dashboard', 'users', 'animals'].includes(p.resource) && 
      ['read', 'update'].includes(p.action)
    ),
    users: ['user-6'],
    isSystemRole: false,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-20')
  }
];

// Sample Settings
export const sampleSettings: Settings = {
  general: {
    siteName: 'Harmony Farm Sanctuary',
    tagline: 'A safe haven for rescued farm animals',
    description: 'Harmony Farm Sanctuary is a nonprofit organization dedicated to rescuing, rehabilitating, and providing sanctuary for farm animals in need.',
    logoUrl: '/images/logo.png',
    faviconUrl: '/images/favicon.ico',
    contactInfo: {
      phone: '(555) 123-4567',
      email: 'info@harmonyfarm.org',
      address: {
        street: '1234 Rural Route 56',
        city: 'Harmony Valley',
        state: 'CA',
        zipCode: '95123',
        country: 'United States'
      },
      hours: {
        general: 'Mon-Fri: 9:00 AM - 5:00 PM, Sat-Sun: 10:00 AM - 4:00 PM',
        tours: 'Sat-Sun: 11:00 AM, 1:00 PM, 3:00 PM (by appointment)',
        emergency: '24/7 Emergency Line: (555) 123-HELP'
      }
    },
    socialMedia: {
      facebook: 'https://facebook.com/harmonyfarm',
      instagram: 'https://instagram.com/harmonyfarm',
      twitter: 'https://twitter.com/harmonyfarm',
      youtube: 'https://youtube.com/harmonyfarm',
      tiktok: 'https://tiktok.com/@harmonyfarm'
    },
    timezone: 'America/Los_Angeles',
    locale: 'en-US',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    maintenanceMode: false,
    googleAnalyticsId: 'GA-123456789',
    facebookPixelId: 'FB-987654321'
  },
  security: {
    sessionTimeout: 120,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      expirationDays: 90,
      preventReuse: 5
    },
    twoFactorAuth: {
      enabled: true,
      required: false,
      methods: ['email', 'app']
    },
    apiRateLimit: {
      requestsPerMinute: 100,
      enabled: true
    },
    contentApproval: {
      enabled: true,
      requiresApproval: ['blog', 'news', 'events']
    },
    loginAttempts: {
      maxAttempts: 5,
      lockoutDuration: 30
    },
    ipWhitelist: [],
    ipBlacklist: []
  },
  content: {
    defaultVisibility: 'public',
    enableComments: true,
    moderateComments: true,
    enableRatings: true,
    allowGuestComments: false,
    mediaUpload: {
      maxFileSize: 10,
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'application/pdf'],
      enableImageOptimization: true,
      enableImageWatermark: false,
      watermarkText: '© Harmony Farm Sanctuary'
    },
    seo: {
      enableMetaTags: true,
      enableStructuredData: true,
      defaultMetaDescription: 'Visit Harmony Farm Sanctuary to learn about our mission to rescue and care for farm animals.',
      enableSitemap: true,
      enableRobotsTxt: true
    },
    archival: {
      autoArchiveAfterDays: 365,
      enableVersioning: true,
      maxVersions: 10
    },
    newletter: {
      enableSignup: true,
      requireDoubleOptIn: true,
      defaultListId: 'newsletter-main'
    }
  },
  integrations: {
    email: {
      provider: 'sendgrid',
      apiKey: 'SG.***',
      fromEmail: 'noreply@harmonyfarm.org',
      fromName: 'Harmony Farm Sanctuary',
      replyToEmail: 'info@harmonyfarm.org',
      enableTracking: true
    },
    payment: {
      providers: {
        stripe: {
          enabled: true,
          publicKey: 'pk_test_***',
          secretKey: 'sk_test_***',
          webhookSecret: 'whsec_***'
        },
        paypal: {
          enabled: true,
          clientId: 'paypal_client_***',
          clientSecret: 'paypal_secret_***',
          environment: 'sandbox'
        }
      },
      currency: 'USD',
      enableRecurring: true,
      enableTestMode: true
    },
    analytics: {
      google: {
        enabled: true,
        trackingId: 'GA-123456789',
        enableEcommerce: true,
        enableReports: true
      },
      facebook: {
        enabled: true,
        pixelId: 'FB-987654321',
        enableConversions: true
      }
    },
    socialMedia: {
      enableAutoPosting: false,
      platforms: {
        facebook: { enabled: true, apiKey: 'fb_***' },
        instagram: { enabled: true, accessToken: 'ig_***' },
        twitter: { enabled: false }
      }
    },
    newsletter: {
      provider: 'mailchimp',
      apiKey: 'mc_***',
      listId: 'newsletter-main',
      enableWelcomeEmail: true
    }
  },
  api: {
    baseUrl: 'https://api.harmonyfarm.org',
    version: 'v1',
    timeout: 30,
    retryAttempts: 3,
    endpoints: [
      {
        id: 'animals-api',
        name: 'Animals API',
        url: '/animals',
        method: 'GET',
        enabled: true,
        lastChecked: new Date(),
        status: 'healthy',
        responseTime: 245
      },
      {
        id: 'donations-api',
        name: 'Donations API',
        url: '/donations',
        method: 'POST',
        enabled: true,
        lastChecked: new Date(),
        status: 'healthy',
        responseTime: 180
      },
      {
        id: 'newsletter-api',
        name: 'Newsletter API',
        url: '/newsletter/subscribe',
        method: 'POST',
        enabled: true,
        lastChecked: new Date(),
        status: 'warning',
        responseTime: 890
      }
    ],
    authentication: {
      type: 'bearer',
      bearerToken: 'bearer_***'
    },
    monitoring: {
      enableHealthChecks: true,
      checkInterval: 15,
      enableLogging: true,
      enableMetrics: true
    }
  },
  lastUpdated: new Date(),
  version: '1.0.0'
};

// Sample Settings Templates
export const sampleSettingsTemplates: SettingsTemplate[] = [
  {
    id: 'template-1',
    name: 'Basic Sanctuary Setup',
    description: 'Basic configuration for small sanctuaries',
    settings: {
      general: {
        siteName: 'Your Sanctuary Name',
        tagline: 'Caring for animals in need',
        description: 'A safe haven for rescued animals',
        timezone: 'America/New_York',
        locale: 'en-US',
        currency: 'USD',
        maintenanceMode: false,
        contactInfo: {
          phone: '',
          email: 'info@yoursanctuary.org',
          address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'United States'
          },
          hours: {
            general: 'Mon-Fri: 9:00 AM - 5:00 PM',
            tours: 'By appointment only',
            emergency: '24/7 Emergency Line'
          }
        },
        socialMedia: {}
      },
      security: {
        sessionTimeout: 60,
        passwordPolicy: {
          minLength: 8,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSpecialChars: false,
          preventReuse: 3
        },
        twoFactorAuth: {
          enabled: false,
          required: false,
          methods: ['email']
        },
        contentApproval: {
          enabled: true,
          requiresApproval: ['blog']
        }
      }
    },
    category: 'basic',
    isDefault: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'template-2',
    name: 'Enterprise Sanctuary Setup',
    description: 'Advanced configuration for large sanctuaries',
    settings: {
      security: {
        sessionTimeout: 120,
        passwordPolicy: {
          minLength: 12,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSpecialChars: true,
          expirationDays: 60,
          preventReuse: 10
        },
        twoFactorAuth: {
          enabled: true,
          required: true,
          methods: ['email', 'app']
        },
        contentApproval: {
          enabled: true,
          requiresApproval: ['blog', 'news', 'events', 'animals']
        }
      },
      api: {
        monitoring: {
          enableHealthChecks: true,
          checkInterval: 5,
          enableLogging: true,
          enableMetrics: true
        }
      }
    },
    category: 'enterprise',
    isDefault: false,
    createdAt: new Date('2024-01-15')
  }
];

// Sample Settings History
export const sampleSettingsHistory: SettingsHistory[] = [
  {
    id: 'history-1',
    changeType: 'update',
    section: 'general',
    previousValue: { siteName: 'Old Sanctuary Name' },
    newValue: { siteName: 'Harmony Farm Sanctuary' },
    changedBy: 'admin',
    timestamp: new Date('2024-02-15T10:30:00'),
    reason: 'Updated sanctuary branding'
  },
  {
    id: 'history-2',
    changeType: 'update',
    section: 'security',
    previousValue: { sessionTimeout: 60 },
    newValue: { sessionTimeout: 120 },
    changedBy: 'admin',
    timestamp: new Date('2024-02-10T14:15:00'),
    reason: 'Extended session timeout for better user experience'
  },
  {
    id: 'history-3',
    changeType: 'update',
    section: 'integrations',
    previousValue: { payment: { enableTestMode: false } },
    newValue: { payment: { enableTestMode: true } },
    changedBy: 'editor',
    timestamp: new Date('2024-02-05T09:45:00'),
    reason: 'Enabled test mode for payment testing'
  }
];

// Utility functions for settings data
export const getSettingsBySection = (section: keyof Settings) => {
  return sampleSettings[section];
};

export const getUserRoleBySlug = (slug: string) => {
  return sampleUserRoles.find(role => role.slug === slug);
};

export const getPermissionsByResource = (resource: string) => {
  return samplePermissions.filter(permission => permission.resource === resource);
};

export const getUsersInRole = (roleId: string) => {
  const role = sampleUserRoles.find(r => r.id === roleId);
  return role ? role.users : [];
};

export const getSettingsTemplate = (id: string) => {
  return sampleSettingsTemplates.find(template => template.id === id);
};

export const getDefaultTemplate = () => {
  return sampleSettingsTemplates.find(template => template.isDefault);
};