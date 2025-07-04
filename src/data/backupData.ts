/**
 * Backup Sample Data
 * Realistic backup and export data for the backup management system
 */

import {
  BackupJob,
  BackupFile,
  BackupExecution,
  ExportJob,
  ImportJob,
  BackupStats,
  BackupTemplate,
  BackupVerification,
  BackupHealthCheck,
  BackupNotifications,
  BackupStorage,
  MigrationJob,
  BackupLogEntry,
  BackupStatus
} from '../types/backup';

// Sample Backup Jobs
export const sampleBackupJobs: BackupJob[] = [
  {
    id: 'backup-job-1',
    name: 'Daily Full Backup',
    description: 'Complete backup of all sanctuary data including animals, blog posts, and user data',
    type: 'full',
    contentTypes: ['animals', 'blog', 'faq', 'users', 'settings'],
    schedule: {
      frequency: 'daily',
      time: '02:00',
      timezone: 'America/Los_Angeles',
      enabled: true
    },
    status: 'active',
    retentionDays: 30,
    maxBackups: 30,
    compressionEnabled: true,
    encryptionEnabled: true,
    lastRun: new Date('2024-12-27T02:00:00'),
    nextRun: new Date('2024-12-28T02:00:00'),
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-20'),
    createdBy: 'admin'
  },
  {
    id: 'backup-job-2',
    name: 'Weekly Content Backup',
    description: 'Backup of all content (animals, blog, FAQ, resources) for content management',
    type: 'content',
    contentTypes: ['animals', 'blog', 'faq', 'resources'],
    schedule: {
      frequency: 'weekly',
      time: '01:00',
      dayOfWeek: 0, // Sunday
      timezone: 'America/Los_Angeles',
      enabled: true
    },
    status: 'active',
    retentionDays: 90,
    maxBackups: 12,
    compressionEnabled: true,
    encryptionEnabled: false,
    lastRun: new Date('2024-12-22T01:00:00'),
    nextRun: new Date('2024-12-29T01:00:00'),
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-12-15'),
    createdBy: 'admin'
  },
  {
    id: 'backup-job-3',
    name: 'Monthly Settings Archive',
    description: 'Monthly backup of system settings and configuration',
    type: 'settings',
    contentTypes: ['settings'],
    schedule: {
      frequency: 'monthly',
      time: '03:00',
      dayOfMonth: 1,
      timezone: 'America/Los_Angeles',
      enabled: true
    },
    status: 'active',
    retentionDays: 365,
    maxBackups: 12,
    compressionEnabled: true,
    encryptionEnabled: true,
    lastRun: new Date('2024-12-01T03:00:00'),
    nextRun: new Date('2025-01-01T03:00:00'),
    createdAt: new Date('2024-10-01'),
    updatedAt: new Date('2024-11-01'),
    createdBy: 'admin'
  },
  {
    id: 'backup-job-4',
    name: 'User Data Backup',
    description: 'Backup of user accounts, volunteers, and donation data',
    type: 'users',
    contentTypes: ['users', 'volunteers', 'donations'],
    schedule: {
      frequency: 'weekly',
      time: '04:00',
      dayOfWeek: 3, // Wednesday
      timezone: 'America/Los_Angeles',
      enabled: false
    },
    status: 'paused',
    retentionDays: 60,
    maxBackups: 8,
    compressionEnabled: true,
    encryptionEnabled: true,
    lastRun: new Date('2024-12-18T04:00:00'),
    lastError: 'Connection timeout to backup storage',
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-12-20'),
    createdBy: 'editor'
  }
];

// Sample Backup Files
export const sampleBackupFiles: BackupFile[] = [
  {
    id: 'backup-file-1',
    jobId: 'backup-job-1',
    name: 'Daily Full Backup - 2024-12-27',
    filename: 'harmony-farm-full-20241227-020000.zip',
    size: 52428800, // 50MB
    sizeFormatted: '50.0 MB',
    createdAt: new Date('2024-12-27T02:15:30'),
    type: 'full',
    contentTypes: ['animals', 'blog', 'faq', 'users', 'settings'],
    format: 'json',
    checksum: 'sha256:abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567',
    verified: true,
    verifiedAt: new Date('2024-12-27T02:20:00'),
    compressed: true,
    encrypted: true,
    downloadUrl: '/api/backups/download/backup-file-1',
    metadata: {
      recordCount: 1247,
      version: '1.0.0',
      sourceEnvironment: 'production',
      includesMedia: true
    }
  },
  {
    id: 'backup-file-2',
    jobId: 'backup-job-1',
    name: 'Daily Full Backup - 2024-12-26',
    filename: 'harmony-farm-full-20241226-020000.zip',
    size: 51380224, // 49MB
    sizeFormatted: '49.0 MB',
    createdAt: new Date('2024-12-26T02:12:45'),
    type: 'full',
    contentTypes: ['animals', 'blog', 'faq', 'users', 'settings'],
    format: 'json',
    checksum: 'sha256:def456ghi789jkl012mno345pqr678stu901vwx234yz567abc123',
    verified: true,
    verifiedAt: new Date('2024-12-26T02:18:30'),
    compressed: true,
    encrypted: true,
    downloadUrl: '/api/backups/download/backup-file-2',
    metadata: {
      recordCount: 1243,
      version: '1.0.0',
      sourceEnvironment: 'production',
      includesMedia: true
    }
  },
  {
    id: 'backup-file-3',
    jobId: 'backup-job-2',
    name: 'Weekly Content Backup - 2024-12-22',
    filename: 'harmony-farm-content-20241222-010000.zip',
    size: 31457280, // 30MB
    sizeFormatted: '30.0 MB',
    createdAt: new Date('2024-12-22T01:08:15'),
    type: 'content',
    contentTypes: ['animals', 'blog', 'faq', 'resources'],
    format: 'json',
    checksum: 'sha256:ghi789jkl012mno345pqr678stu901vwx234yz567abc123def456',
    verified: true,
    verifiedAt: new Date('2024-12-22T01:12:00'),
    compressed: true,
    encrypted: false,
    downloadUrl: '/api/backups/download/backup-file-3',
    metadata: {
      recordCount: 892,
      version: '1.0.0',
      sourceEnvironment: 'production',
      includesMedia: false
    }
  },
  {
    id: 'backup-file-4',
    jobId: 'backup-job-3',
    name: 'Monthly Settings Archive - 2024-12-01',
    filename: 'harmony-farm-settings-20241201-030000.zip',
    size: 2097152, // 2MB
    sizeFormatted: '2.0 MB',
    createdAt: new Date('2024-12-01T03:05:20'),
    type: 'settings',
    contentTypes: ['settings'],
    format: 'json',
    checksum: 'sha256:jkl012mno345pqr678stu901vwx234yz567abc123def456ghi789',
    verified: true,
    verifiedAt: new Date('2024-12-01T03:08:00'),
    compressed: true,
    encrypted: true,
    downloadUrl: '/api/backups/download/backup-file-4',
    metadata: {
      recordCount: 156,
      version: '1.0.0',
      sourceEnvironment: 'production',
      includesMedia: false
    }
  }
];

// Sample Backup Executions
export const sampleBackupExecutions: BackupExecution[] = [
  {
    id: 'execution-1',
    jobId: 'backup-job-1',
    backupFileId: 'backup-file-1',
    startTime: new Date('2024-12-27T02:00:00'),
    endTime: new Date('2024-12-27T02:15:30'),
    duration: 930000, // 15.5 minutes
    status: 'completed',
    progress: 100,
    recordsProcessed: 1247,
    totalRecords: 1247,
    logs: [
      { timestamp: new Date('2024-12-27T02:00:00'), level: 'info', message: 'Backup job started' },
      { timestamp: new Date('2024-12-27T02:02:30'), level: 'info', message: 'Backing up animals data: 247 records' },
      { timestamp: new Date('2024-12-27T02:05:45'), level: 'info', message: 'Backing up blog posts: 45 records' },
      { timestamp: new Date('2024-12-27T02:08:15'), level: 'info', message: 'Backing up FAQ entries: 67 records' },
      { timestamp: new Date('2024-12-27T02:11:30'), level: 'info', message: 'Backing up user data: 888 records' },
      { timestamp: new Date('2024-12-27T02:14:00'), level: 'info', message: 'Compressing and encrypting backup file' },
      { timestamp: new Date('2024-12-27T02:15:30'), level: 'info', message: 'Backup completed successfully' }
    ]
  },
  {
    id: 'execution-2',
    jobId: 'backup-job-4',
    startTime: new Date('2024-12-25T04:00:00'),
    endTime: new Date('2024-12-25T04:02:15'),
    duration: 135000, // 2.25 minutes
    status: 'error',
    progress: 45,
    recordsProcessed: 234,
    totalRecords: 520,
    errorMessage: 'Connection timeout to backup storage after 2 minutes',
    logs: [
      { timestamp: new Date('2024-12-25T04:00:00'), level: 'info', message: 'Backup job started' },
      { timestamp: new Date('2024-12-25T04:01:30'), level: 'info', message: 'Backing up user data: 234 records processed' },
      { timestamp: new Date('2024-12-25T04:02:00'), level: 'warning', message: 'Slow connection to backup storage detected' },
      { timestamp: new Date('2024-12-25T04:02:15'), level: 'error', message: 'Connection timeout to backup storage' }
    ]
  }
];

// Sample Export Jobs
export const sampleExportJobs: ExportJob[] = [
  {
    id: 'export-1',
    name: 'Animal Profiles Export',
    contentTypes: ['animals'],
    format: 'csv',
    dateRange: {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31')
    },
    filters: {
      published: true,
      categories: ['rescued', 'sanctuary-born']
    },
    includeFields: ['name', 'species', 'story', 'sponsorship', 'arrivalDate'],
    excludeFields: ['internalNotes', 'medicalHistory'],
    progress: 100,
    status: 'completed',
    createdAt: new Date('2024-12-26T14:30:00'),
    createdBy: 'admin',
    actualSize: 1048576, // 1MB
    downloadUrl: '/api/exports/download/export-1',
    expiresAt: new Date('2025-01-02T14:30:00')
  },
  {
    id: 'export-2',
    name: 'Blog Posts Report',
    contentTypes: ['blog'],
    format: 'pdf',
    dateRange: {
      startDate: new Date('2024-12-01'),
      endDate: new Date('2024-12-31')
    },
    filters: {
      published: true,
      categories: ['animal-care', 'education']
    },
    includeFields: ['title', 'author', 'publishedAt', 'excerpt', 'views'],
    excludeFields: ['drafts', 'revisionHistory'],
    progress: 75,
    status: 'running',
    createdAt: new Date('2024-12-27T10:15:00'),
    createdBy: 'editor',
    estimatedSize: 2097152 // 2MB
  }
];

// Sample Import Jobs
export const sampleImportJobs: ImportJob[] = [
  {
    id: 'import-1',
    name: 'Volunteer Applications Import',
    filename: 'volunteer-applications-2024.csv',
    format: 'csv',
    contentType: 'volunteers',
    fileSize: 524288, // 512KB
    progress: 100,
    status: 'completed',
    conflictResolution: {
      strategy: 'skip',
      skipDuplicates: true,
      preserveIds: false,
      updateExisting: false
    },
    dryRun: false,
    results: {
      recordsImported: 23,
      recordsSkipped: 5,
      recordsUpdated: 0,
      recordsCreated: 23,
      errors: [],
      warnings: [
        {
          row: 15,
          field: 'email',
          message: 'Email format appears unusual but is valid',
          data: { email: 'volunteer@example-domain.co.uk' }
        }
      ],
      duration: 15000 // 15 seconds
    },
    createdAt: new Date('2024-12-26T09:00:00'),
    createdBy: 'admin'
  }
];

// Sample Backup Statistics
export const sampleBackupStats: BackupStats = {
  totalBackups: 156,
  totalSize: 8589934592, // 8GB
  totalSizeFormatted: '8.0 GB',
  successfulBackups: 148,
  failedBackups: 8,
  averageBackupTime: 720000, // 12 minutes
  oldestBackup: new Date('2024-09-01'),
  newestBackup: new Date('2024-12-27T02:15:30'),
  storageUsagePercent: 42,
  backupsByType: {
    full: 92,
    incremental: 0,
    content: 48,
    settings: 12,
    users: 4
  },
  backupsByStatus: {
    pending: 0,
    running: 1,
    completed: 148,
    error: 7,
    cancelled: 0
  },
  monthlyBackupCount: 31,
  monthlyBackupSize: 1610612736 // 1.5GB
};

// Sample Backup Templates
export const sampleBackupTemplates: BackupTemplate[] = [
  {
    id: 'template-1',
    name: 'Daily Full Backup',
    description: 'Complete daily backup template for all sanctuary data',
    type: 'full',
    contentTypes: ['animals', 'blog', 'faq', 'users', 'settings'],
    schedule: {
      frequency: 'daily',
      time: '02:00',
      timezone: 'America/Los_Angeles',
      enabled: true
    },
    retentionDays: 30,
    options: {
      compression: true,
      encryption: true,
      includeMedia: true,
      includeSystemFiles: false,
      validateIntegrity: true,
      generateReport: true
    },
    isDefault: true,
    usageCount: 15,
    createdAt: new Date('2024-11-01')
  },
  {
    id: 'template-2',
    name: 'Content Only Backup',
    description: 'Backup template for content creators focusing on animals and blog posts',
    type: 'content',
    contentTypes: ['animals', 'blog', 'faq', 'resources'],
    schedule: {
      frequency: 'weekly',
      time: '01:00',
      dayOfWeek: 0,
      timezone: 'America/Los_Angeles',
      enabled: true
    },
    retentionDays: 90,
    options: {
      compression: true,
      encryption: false,
      includeMedia: false,
      includeSystemFiles: false,
      validateIntegrity: true,
      generateReport: false
    },
    isDefault: false,
    usageCount: 8,
    createdAt: new Date('2024-11-15')
  }
];

// Sample Backup Verifications
export const sampleBackupVerifications: BackupVerification[] = [
  {
    id: 'verification-1',
    backupFileId: 'backup-file-1',
    verifiedAt: new Date('2024-12-27T02:20:00'),
    verifiedBy: 'system',
    status: 'passed',
    checksumValid: true,
    sizeValid: true,
    contentValid: true,
    restorable: true,
    issues: [],
    score: 100
  },
  {
    id: 'verification-2',
    backupFileId: 'backup-file-3',
    verifiedAt: new Date('2024-12-22T01:12:00'),
    verifiedBy: 'system',
    status: 'warning',
    checksumValid: true,
    sizeValid: true,
    contentValid: true,
    restorable: true,
    issues: [
      {
        severity: 'warning',
        message: 'Some media files not found',
        details: '3 image files referenced in content but not included in backup',
        field: 'media'
      }
    ],
    score: 85
  }
];

// Sample Health Check
export const sampleBackupHealthCheck: BackupHealthCheck = {
  timestamp: new Date('2024-12-27T08:00:00'),
  overallHealth: 'healthy',
  storageHealth: 'warning',
  scheduleHealth: 'healthy',
  verificationHealth: 'healthy',
  issues: [
    {
      severity: 'warning',
      category: 'storage',
      message: 'Storage usage approaching 50% capacity',
      resolution: 'Consider cleaning up old backups or expanding storage'
    }
  ],
  recommendations: [
    'Enable auto-cleanup for backups older than 90 days',
    'Consider upgrading storage capacity',
    'Review backup retention policies'
  ],
  nextScheduledBackup: new Date('2024-12-28T02:00:00'),
  lastSuccessfulBackup: new Date('2024-12-27T02:15:30')
};

// Sample Backup Notifications
export const sampleBackupNotifications: BackupNotifications = {
  emailEnabled: true,
  emailAddresses: ['admin@harmonyfarm.org', 'tech@harmonyfarm.org'],
  notifyOnSuccess: false,
  notifyOnFailure: true,
  notifyOnLowStorage: true,
  webhookEnabled: false,
  webhookUrl: 'https://hooks.slack.com/services/...',
  discordWebhook: 'https://discord.com/api/webhooks/...',
  slackWebhook: 'https://hooks.slack.com/services/...'
};

// Sample Backup Storage
export const sampleBackupStorage: BackupStorage = {
  provider: 'local',
  config: {
    path: '/var/backups/harmony-farm'
  },
  maxStorageSize: 21474836480, // 20GB
  currentUsage: 8589934592, // 8GB
  retentionPolicy: {
    maxAge: 90,
    maxCount: 100,
    autoCleanup: true
  }
};

// Sample Migration Jobs
export const sampleMigrationJobs: MigrationJob[] = [
  {
    id: 'migration-1',
    name: 'Staging to Production Migration',
    description: 'Migrate new animal profiles from staging to production',
    sourceEnvironment: 'staging',
    targetEnvironment: 'production',
    contentTypes: ['animals'],
    migrationStrategy: {
      handleConflicts: 'merge',
      preserveRelationships: true,
      validateData: true,
      createBackup: true
    },
    status: 'completed',
    progress: 100,
    dryRun: false,
    preserveIds: false,
    createdAt: new Date('2024-12-26T16:00:00'),
    createdBy: 'admin',
    startTime: new Date('2024-12-26T16:05:00'),
    endTime: new Date('2024-12-26T16:12:30'),
    results: {
      recordsMigrated: 12,
      recordsSkipped: 2,
      recordsUpdated: 5,
      errors: [],
      warnings: [
        {
          row: 3,
          field: 'image',
          message: 'Image file not found in source environment',
          data: { filename: 'bella-portrait.jpg' }
        }
      ],
      duration: 450000 // 7.5 minutes
    }
  }
];

// Utility functions for backup data
export const getBackupJobById = (id: string) => {
  return sampleBackupJobs.find(job => job.id === id);
};

export const getBackupFilesByJobId = (jobId: string) => {
  return sampleBackupFiles.filter(file => file.jobId === jobId);
};

export const getBackupExecutionsByJobId = (jobId: string) => {
  return sampleBackupExecutions.filter(execution => execution.jobId === jobId);
};

export const getActiveBackupJobs = () => {
  return sampleBackupJobs.filter(job => job.status === 'active');
};

export const getFailedBackupJobs = () => {
  return sampleBackupJobs.filter(job => job.status === 'error');
};

export const getRecentBackupFiles = (limit: number = 10) => {
  return sampleBackupFiles
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
};

export const getTotalBackupSize = () => {
  return sampleBackupFiles.reduce((total, file) => total + file.size, 0);
};

export const formatFileSize = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

export const getBackupStatusColor = (status: BackupStatus) => {
  switch (status) {
    case 'completed': return 'green';
    case 'running': return 'blue';
    case 'pending': return 'yellow';
    case 'error': return 'red';
    case 'cancelled': return 'gray';
    default: return 'gray';
  }
};