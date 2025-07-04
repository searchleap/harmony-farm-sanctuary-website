/**
 * Backup Service Utilities
 * Helper functions for backup operations, data validation, and file handling
 */

import {
  BackupJob,
  BackupFile,
  ExportJob,
  ImportJob,
  BackupValidation,
  ContentType,
  ExportFormat,
  BackupType,
  BackupStatus,
  ImportPreview,
  BackupExecution
} from '../types/backup';

// Backup validation functions
export const validateBackupJob = (job: Partial<BackupJob>): BackupValidation => {
  const errors: { field: string; message: string }[] = [];
  const warnings: { field: string; message: string }[] = [];

  // Required fields validation
  if (!job.name?.trim()) {
    errors.push({ field: 'name', message: 'Backup name is required' });
  }

  if (!job.type) {
    errors.push({ field: 'type', message: 'Backup type is required' });
  }

  if (!job.contentTypes || job.contentTypes.length === 0) {
    errors.push({ field: 'contentTypes', message: 'At least one content type must be selected' });
  }

  if (!job.schedule?.frequency) {
    errors.push({ field: 'schedule.frequency', message: 'Backup frequency is required' });
  }

  if (!job.schedule?.time) {
    errors.push({ field: 'schedule.time', message: 'Backup time is required' });
  }

  // Logical validation
  if (job.retentionDays && job.retentionDays < 1) {
    errors.push({ field: 'retentionDays', message: 'Retention period must be at least 1 day' });
  }

  if (job.maxBackups && job.maxBackups < 1) {
    errors.push({ field: 'maxBackups', message: 'Maximum backup count must be at least 1' });
  }

  // Warnings
  if (job.retentionDays && job.retentionDays > 365) {
    warnings.push({ field: 'retentionDays', message: 'Long retention periods may consume significant storage' });
  }

  if (job.schedule?.frequency === 'daily' && job.contentTypes?.includes('settings')) {
    warnings.push({ field: 'contentTypes', message: 'Daily backups of settings may be excessive' });
  }

  if (job.encryptionEnabled === false && job.contentTypes?.includes('users')) {
    warnings.push({ field: 'encryptionEnabled', message: 'User data should be encrypted for security' });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Export validation
export const validateExportJob = (job: Partial<ExportJob>): BackupValidation => {
  const errors: { field: string; message: string }[] = [];
  const warnings: { field: string; message: string }[] = [];

  if (!job.name?.trim()) {
    errors.push({ field: 'name', message: 'Export name is required' });
  }

  if (!job.contentTypes || job.contentTypes.length === 0) {
    errors.push({ field: 'contentTypes', message: 'At least one content type must be selected' });
  }

  if (!job.format) {
    errors.push({ field: 'format', message: 'Export format is required' });
  }

  // Date range validation
  if (job.dateRange) {
    if (job.dateRange.startDate >= job.dateRange.endDate) {
      errors.push({ field: 'dateRange', message: 'Start date must be before end date' });
    }
    
    const daysDiff = Math.ceil((job.dateRange.endDate.getTime() - job.dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 365) {
      warnings.push({ field: 'dateRange', message: 'Large date ranges may result in very large export files' });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// File size estimation
export const estimateBackupSize = (contentTypes: ContentType[], type: BackupType): number => {
  const baseSizes: Record<ContentType, number> = {
    animals: 10485760, // 10MB
    blog: 5242880, // 5MB
    faq: 1048576, // 1MB
    resources: 15728640, // 15MB
    users: 2097152, // 2MB
    volunteers: 1048576, // 1MB
    donations: 3145728, // 3MB
    events: 2097152, // 2MB
    settings: 524288 // 512KB
  };

  let totalSize = 0;
  contentTypes.forEach(contentType => {
    totalSize += baseSizes[contentType] || 1048576; // Default 1MB
  });

  // Adjust based on backup type
  switch (type) {
    case 'full':
      totalSize *= 1.2; // Include metadata and relationships
      break;
    case 'incremental':
      totalSize *= 0.3; // Only changes
      break;
    case 'content':
      totalSize *= 0.8; // Exclude system data
      break;
    case 'settings':
      totalSize = baseSizes.settings * 2; // Include history
      break;
    case 'users':
      totalSize = (baseSizes.users + baseSizes.volunteers + baseSizes.donations) * 1.1;
      break;
  }

  return Math.round(totalSize);
};

// Backup frequency helpers
export const getNextBackupTime = (schedule: BackupJob['schedule']): Date => {
  const now = new Date();
  const [hours, minutes] = schedule.time.split(':').map(Number);
  
  let nextRun = new Date();
  nextRun.setHours(hours, minutes, 0, 0);

  switch (schedule.frequency) {
    case 'daily':
      if (nextRun <= now) {
        nextRun.setDate(nextRun.getDate() + 1);
      }
      break;
    
    case 'weekly':
      const dayOfWeek = schedule.dayOfWeek || 0;
      nextRun.setDate(nextRun.getDate() + (7 + dayOfWeek - nextRun.getDay()) % 7);
      if (nextRun <= now) {
        nextRun.setDate(nextRun.getDate() + 7);
      }
      break;
    
    case 'monthly':
      const dayOfMonth = schedule.dayOfMonth || 1;
      nextRun.setDate(dayOfMonth);
      if (nextRun <= now) {
        nextRun.setMonth(nextRun.getMonth() + 1);
      }
      break;
    
    case 'custom':
      // For custom cron expressions, return a placeholder
      nextRun.setDate(nextRun.getDate() + 1);
      break;
  }

  return nextRun;
};

// File format helpers
export const getFileExtension = (format: ExportFormat): string => {
  const extensions: Record<ExportFormat, string> = {
    json: '.json',
    csv: '.csv',
    xml: '.xml',
    pdf: '.pdf',
    sql: '.sql'
  };
  return extensions[format];
};

export const getMimeType = (format: ExportFormat): string => {
  const mimeTypes: Record<ExportFormat, string> = {
    json: 'application/json',
    csv: 'text/csv',
    xml: 'application/xml',
    pdf: 'application/pdf',
    sql: 'application/sql'
  };
  return mimeTypes[format];
};

// Backup file naming
export const generateBackupFilename = (
  name: string,
  type: BackupType,
  format: ExportFormat,
  timestamp?: Date
): string => {
  const date = timestamp || new Date();
  const dateStr = date.toISOString().slice(0, 19).replace(/[-:]/g, '').replace('T', '-');
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const extension = getFileExtension(format);
  
  return `${cleanName}-${type}-${dateStr}${extension}`;
};

// Progress calculation
export const calculateProgress = (current: number, total: number): number => {
  if (total === 0) return 0;
  return Math.min(Math.round((current / total) * 100), 100);
};

// Duration formatting
export const formatDuration = (milliseconds: number): string => {
  if (milliseconds < 1000) {
    return `${milliseconds}ms`;
  }
  
  const seconds = Math.floor(milliseconds / 1000);
  if (seconds < 60) {
    return `${seconds}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes < 60) {
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

// File size formatting
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

// Checksum generation (mock implementation)
export const generateChecksum = (data: string): string => {
  // In a real implementation, this would use a proper hashing algorithm
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `sha256:${Math.abs(hash).toString(16).padStart(64, '0')}`;
};

// Backup verification
export const verifyBackupIntegrity = (
  backupFile: BackupFile,
  actualData?: string
): { isValid: boolean; issues: string[] } => {
  const issues: string[] = [];
  
  // Size validation
  if (actualData && actualData.length !== backupFile.size) {
    issues.push(`File size mismatch: expected ${backupFile.size}, got ${actualData.length}`);
  }
  
  // Checksum validation
  if (actualData) {
    const calculatedChecksum = generateChecksum(actualData);
    if (calculatedChecksum !== backupFile.checksum) {
      issues.push('Checksum mismatch: file may be corrupted');
    }
  }
  
  // Format validation
  if (actualData) {
    try {
      switch (backupFile.format) {
        case 'json':
          JSON.parse(actualData);
          break;
        case 'csv':
          // Basic CSV validation
          if (!actualData.includes(',') && actualData.split('\n').length < 2) {
            issues.push('Invalid CSV format');
          }
          break;
        case 'xml':
          // Basic XML validation
          if (!actualData.includes('<') || !actualData.includes('>')) {
            issues.push('Invalid XML format');
          }
          break;
      }
    } catch (error) {
      issues.push(`Invalid ${backupFile.format.toUpperCase()} format: ${error}`);
    }
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
};

// Import preview generation
export const generateImportPreview = (
  data: string,
  format: ExportFormat,
  contentType: ContentType
): ImportPreview => {
  let records: any[] = [];
  let errors: any[] = [];
  
  try {
    switch (format) {
      case 'json':
        const jsonData = JSON.parse(data);
        records = Array.isArray(jsonData) ? jsonData : [jsonData];
        break;
      
      case 'csv':
        const lines = data.split('\n').filter(line => line.trim());
        if (lines.length > 1) {
          const headers = lines[0].split(',');
          records = lines.slice(1).map((line, index) => {
            const values = line.split(',');
            const record: any = { _row: index + 2 };
            headers.forEach((header, i) => {
              record[header.trim()] = values[i]?.trim() || '';
            });
            return record;
          });
        }
        break;
      
      default:
        errors.push({ row: 0, message: `Format ${format} not supported for preview` });
    }
  } catch (error) {
    errors.push({ row: 0, message: `Parse error: ${error}` });
  }
  
  // Validate records
  const validRecords = records.filter(record => {
    // Basic validation based on content type
    switch (contentType) {
      case 'animals':
        return record.name && record.species;
      case 'blog':
        return record.title && record.content;
      case 'users':
        return record.email;
      default:
        return true;
    }
  });
  
  const invalidRecords = records.length - validRecords.length;
  
  return {
    totalRecords: records.length,
    validRecords: validRecords.length,
    invalidRecords,
    duplicateRecords: 0, // Would need more complex logic to detect duplicates
    newRecords: validRecords.length, // Assume all are new for preview
    errors,
    sampleData: records.slice(0, 5) // First 5 records for preview
  };
};

// Backup status helpers
export const getStatusIcon = (status: BackupStatus): string => {
  const icons: Record<BackupStatus, string> = {
    pending: '⏳',
    running: '🔄',
    completed: '✅',
    error: '❌',
    cancelled: '⛔'
  };
  return icons[status];
};

export const getStatusColor = (status: BackupStatus): string => {
  const colors: Record<BackupStatus, string> = {
    pending: 'yellow',
    running: 'blue',
    completed: 'green',
    error: 'red',
    cancelled: 'gray'
  };
  return colors[status];
};

// Backup cleanup utilities
export const shouldCleanupBackup = (
  backupFile: BackupFile,
  retentionDays: number,
  maxBackups: number,
  allBackups: BackupFile[]
): boolean => {
  // Check age
  const ageInDays = (Date.now() - backupFile.createdAt.getTime()) / (1000 * 60 * 60 * 24);
  if (ageInDays > retentionDays) {
    return true;
  }
  
  // Check count (keep only the most recent maxBackups)
  const jobBackups = allBackups
    .filter(b => b.jobId === backupFile.jobId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  
  const backupIndex = jobBackups.findIndex(b => b.id === backupFile.id);
  if (backupIndex >= maxBackups) {
    return true;
  }
  
  return false;
};

// Schedule helpers
export const getScheduleDescription = (schedule: BackupJob['schedule']): string => {
  const timeStr = schedule.time;
  
  switch (schedule.frequency) {
    case 'daily':
      return `Daily at ${timeStr}`;
    
    case 'weekly':
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayName = days[schedule.dayOfWeek || 0];
      return `Weekly on ${dayName} at ${timeStr}`;
    
    case 'monthly':
      const dayOfMonth = schedule.dayOfMonth || 1;
      const suffix = dayOfMonth === 1 ? 'st' : dayOfMonth === 2 ? 'nd' : dayOfMonth === 3 ? 'rd' : 'th';
      return `Monthly on the ${dayOfMonth}${suffix} at ${timeStr}`;
    
    case 'custom':
      return `Custom schedule: ${schedule.customCron || 'Not configured'}`;
    
    default:
      return 'Schedule not configured';
  }
};