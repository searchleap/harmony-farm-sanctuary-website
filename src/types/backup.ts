/**
 * Backup & Export System Types
 * Comprehensive TypeScript interfaces for the backup and data export system
 */

// Backup Types and Enums
export type BackupType = 'full' | 'incremental' | 'content' | 'settings' | 'users';
export type BackupStatus = 'pending' | 'running' | 'completed' | 'error' | 'cancelled';
export type ScheduleFrequency = 'daily' | 'weekly' | 'monthly' | 'custom';
export type ExportFormat = 'json' | 'csv' | 'xml' | 'pdf' | 'sql';
export type ContentType = 'animals' | 'blog' | 'faq' | 'resources' | 'users' | 'volunteers' | 'donations' | 'events' | 'settings';

// Date Range Interface
export interface DateRange {
  startDate: Date;
  endDate: Date;
}

// Backup Schedule Configuration
export interface BackupSchedule {
  frequency: ScheduleFrequency;
  time: string; // HH:MM format
  dayOfWeek?: number; // 0-6, Sunday = 0 (for weekly)
  dayOfMonth?: number; // 1-31 (for monthly)
  customCron?: string; // Custom cron expression
  timezone: string;
  enabled: boolean;
}

// Backup Job Configuration
export interface BackupJob {
  id: string;
  name: string;
  description: string;
  type: BackupType;
  contentTypes: ContentType[];
  schedule: BackupSchedule;
  status: 'active' | 'paused' | 'error';
  retentionDays: number;
  maxBackups: number;
  compressionEnabled: boolean;
  encryptionEnabled: boolean;
  lastRun?: Date;
  nextRun?: Date;
  lastError?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

// Backup File Metadata
export interface BackupFile {
  id: string;
  jobId: string;
  name: string;
  filename: string;
  size: number; // bytes
  sizeFormatted: string; // "10.5 MB"
  createdAt: Date;
  type: BackupType;
  contentTypes: ContentType[];
  format: ExportFormat;
  checksum: string;
  verified: boolean;
  verifiedAt?: Date;
  compressed: boolean;
  encrypted: boolean;
  downloadUrl?: string;
  metadata: {
    recordCount: number;
    version: string;
    sourceEnvironment: string;
    includesMedia: boolean;
    [key: string]: any;
  };
}

// Backup Execution Log
export interface BackupExecution {
  id: string;
  jobId: string;
  backupFileId?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // milliseconds
  status: BackupStatus;
  progress: number; // 0-100
  recordsProcessed: number;
  totalRecords: number;
  errorMessage?: string;
  logs: BackupLogEntry[];
}

export interface BackupLogEntry {
  timestamp: Date;
  level: 'info' | 'warning' | 'error';
  message: string;
  details?: any;
}

// Export Job Configuration
export interface ExportJob {
  id: string;
  name: string;
  contentTypes: ContentType[];
  format: ExportFormat;
  dateRange?: DateRange;
  filters: ExportFilters;
  includeFields: string[];
  excludeFields: string[];
  progress: number;
  status: BackupStatus;
  createdAt: Date;
  createdBy: string;
  estimatedSize?: number;
  actualSize?: number;
  downloadUrl?: string;
  expiresAt?: Date;
}

export interface ExportFilters {
  published?: boolean;
  categories?: string[];
  tags?: string[];
  authors?: string[];
  customFilters?: Record<string, any>;
}

// Import Job Configuration
export interface ImportJob {
  id: string;
  name: string;
  filename: string;
  format: ExportFormat;
  contentType: ContentType;
  fileSize: number;
  progress: number;
  status: BackupStatus;
  conflictResolution: ConflictResolution;
  dryRun: boolean;
  preview?: ImportPreview;
  results?: ImportResults;
  createdAt: Date;
  createdBy: string;
}

export interface ConflictResolution {
  strategy: 'skip' | 'overwrite' | 'merge' | 'create_new';
  skipDuplicates: boolean;
  preserveIds: boolean;
  updateExisting: boolean;
}

export interface ImportPreview {
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  duplicateRecords: number;
  newRecords: number;
  errors: ImportError[];
  sampleData: any[];
}

export interface ImportResults {
  recordsImported: number;
  recordsSkipped: number;
  recordsUpdated: number;
  recordsCreated: number;
  errors: ImportError[];
  warnings: ImportWarning[];
  duration: number;
}

export interface ImportError {
  row: number;
  field?: string;
  message: string;
  data: any;
}

export interface ImportWarning {
  row: number;
  field?: string;
  message: string;
  data: any;
}

// Migration Configuration
export interface MigrationJob {
  id: string;
  name: string;
  description: string;
  sourceEnvironment: string;
  targetEnvironment: string;
  contentTypes: ContentType[];
  migrationStrategy: MigrationStrategy;
  status: BackupStatus;
  progress: number;
  dryRun: boolean;
  preserveIds: boolean;
  createdAt: Date;
  createdBy: string;
  startTime?: Date;
  endTime?: Date;
  results?: MigrationResults;
}

export interface MigrationStrategy {
  handleConflicts: 'skip' | 'overwrite' | 'merge';
  preserveRelationships: boolean;
  validateData: boolean;
  createBackup: boolean;
}

export interface MigrationResults {
  recordsMigrated: number;
  recordsSkipped: number;
  recordsUpdated: number;
  errors: ImportError[];
  warnings: ImportWarning[];
  duration: number;
}

// Backup Storage Configuration
export interface BackupStorage {
  provider: 'local' | 'aws-s3' | 'google-cloud' | 'azure' | 'ftp';
  config: {
    path?: string;
    bucket?: string;
    region?: string;
    accessKey?: string;
    secretKey?: string;
    endpoint?: string;
    [key: string]: any;
  };
  maxStorageSize: number; // bytes
  currentUsage: number; // bytes
  retentionPolicy: {
    maxAge: number; // days
    maxCount: number;
    autoCleanup: boolean;
  };
}

// Backup Verification
export interface BackupVerification {
  id: string;
  backupFileId: string;
  verifiedAt: Date;
  verifiedBy: string;
  status: 'passed' | 'failed' | 'warning';
  checksumValid: boolean;
  sizeValid: boolean;
  contentValid: boolean;
  restorable: boolean;
  issues: VerificationIssue[];
  score: number; // 0-100
}

export interface VerificationIssue {
  severity: 'error' | 'warning' | 'info';
  message: string;
  details?: string;
  field?: string;
}

// Backup Statistics
export interface BackupStats {
  totalBackups: number;
  totalSize: number;
  totalSizeFormatted: string;
  successfulBackups: number;
  failedBackups: number;
  averageBackupTime: number; // milliseconds
  oldestBackup?: Date;
  newestBackup?: Date;
  storageUsagePercent: number;
  backupsByType: Record<BackupType, number>;
  backupsByStatus: Record<BackupStatus, number>;
  monthlyBackupCount: number;
  monthlyBackupSize: number;
}

// Backup Notification Settings
export interface BackupNotifications {
  emailEnabled: boolean;
  emailAddresses: string[];
  notifyOnSuccess: boolean;
  notifyOnFailure: boolean;
  notifyOnLowStorage: boolean;
  webhookUrl?: string;
  webhookEnabled: boolean;
  discordWebhook?: string;
  slackWebhook?: string;
}

// System Health Check
export interface BackupHealthCheck {
  timestamp: Date;
  overallHealth: 'healthy' | 'warning' | 'critical';
  storageHealth: 'healthy' | 'warning' | 'critical';
  scheduleHealth: 'healthy' | 'warning' | 'critical';
  verificationHealth: 'healthy' | 'warning' | 'critical';
  issues: HealthIssue[];
  recommendations: string[];
  nextScheduledBackup?: Date;
  lastSuccessfulBackup?: Date;
}

export interface HealthIssue {
  severity: 'error' | 'warning' | 'info';
  category: 'storage' | 'schedule' | 'verification' | 'performance';
  message: string;
  resolution?: string;
}

// Backup Templates
export interface BackupTemplate {
  id: string;
  name: string;
  description: string;
  type: BackupType;
  contentTypes: ContentType[];
  schedule: Partial<BackupSchedule>;
  retentionDays: number;
  options: BackupOptions;
  isDefault: boolean;
  usageCount: number;
  createdAt: Date;
}

export interface BackupOptions {
  compression: boolean;
  encryption: boolean;
  includeMedia: boolean;
  includeSystemFiles: boolean;
  validateIntegrity: boolean;
  generateReport: boolean;
}

// Export utility types
export type BackupJobFormData = Omit<BackupJob, 'id' | 'createdAt' | 'updatedAt' | 'lastRun' | 'nextRun'>;
export type ExportJobFormData = Omit<ExportJob, 'id' | 'createdAt' | 'progress' | 'status'>;
export type ImportJobFormData = Omit<ImportJob, 'id' | 'createdAt' | 'progress' | 'status'>;

// Backup form validation
export interface BackupValidation {
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

// Backup permissions
export interface BackupPermissions {
  canCreateBackups: boolean;
  canScheduleBackups: boolean;
  canDownloadBackups: boolean;
  canDeleteBackups: boolean;
  canRestoreBackups: boolean;
  canManageSettings: boolean;
  canViewLogs: boolean;
  canExportData: boolean;
  canImportData: boolean;
  canMigrateData: boolean;
}