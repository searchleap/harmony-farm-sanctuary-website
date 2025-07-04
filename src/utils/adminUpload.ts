// Admin File Upload Utilities
// Handle file uploads for images, documents, and bulk data

export interface UploadConfig {
  acceptedTypes: string[];
  maxFileSize: number; // in bytes
  maxFiles?: number;
  allowedExtensions?: string[];
  validateContent?: boolean;
}

export interface UploadResult {
  success: boolean;
  files: UploadedFile[];
  errors: UploadError[];
}

export interface UploadedFile {
  file: File;
  preview?: string; // For images
  data?: any; // For processed content (e.g., CSV data)
  size: number;
  type: string;
  name: string;
  lastModified: number;
}

export interface UploadError {
  file?: File;
  message: string;
  code: string;
}

export class AdminFileUploader {
  private config: UploadConfig;

  constructor(config: UploadConfig) {
    this.config = config;
  }

  // Validate and process files
  async processFiles(files: FileList | File[]): Promise<UploadResult> {
    console.log('[AdminFileUploader] Processing files:', files.length);

    const fileArray = Array.from(files);
    const result: UploadResult = {
      success: false,
      files: [],
      errors: []
    };

    // Check file count limit
    if (this.config.maxFiles && fileArray.length > this.config.maxFiles) {
      result.errors.push({
        message: `Maximum ${this.config.maxFiles} files allowed`,
        code: 'TOO_MANY_FILES'
      });
      return result;
    }

    // Process each file
    for (const file of fileArray) {
      try {
        const uploadedFile = await this.processFile(file);
        result.files.push(uploadedFile);
      } catch (error) {
        result.errors.push({
          file,
          message: error instanceof Error ? error.message : 'Unknown error',
          code: 'PROCESSING_ERROR'
        });
      }
    }

    result.success = result.files.length > 0 && result.errors.length === 0;
    return result;
  }

  // Process a single file
  private async processFile(file: File): Promise<UploadedFile> {
    // Validate file
    this.validateFile(file);

    const uploadedFile: UploadedFile = {
      file,
      size: file.size,
      type: file.type,
      name: file.name,
      lastModified: file.lastModified
    };

    // Generate preview for images
    if (file.type.startsWith('image/')) {
      uploadedFile.preview = await this.generateImagePreview(file);
    }

    // Process CSV/JSON files for data import
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      uploadedFile.data = await this.processCSVFile(file);
    } else if (file.type === 'application/json' || file.name.endsWith('.json')) {
      uploadedFile.data = await this.processJSONFile(file);
    }

    return uploadedFile;
  }

  // Validate file against config
  private validateFile(file: File): void {
    // Check file size
    if (file.size > this.config.maxFileSize) {
      throw new Error(`File size exceeds limit of ${this.formatFileSize(this.config.maxFileSize)}`);
    }

    // Check file type
    if (this.config.acceptedTypes.length > 0 && !this.config.acceptedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed`);
    }

    // Check file extension
    if (this.config.allowedExtensions) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!extension || !this.config.allowedExtensions.includes(extension)) {
        throw new Error(`File extension .${extension} is not allowed`);
      }
    }

    // Validate content if required
    if (this.config.validateContent) {
      this.validateFileContent(file);
    }
  }

  // Basic content validation
  private validateFileContent(file: File): void {
    // Check for potentially dangerous files
    const dangerousExtensions = ['exe', 'bat', 'cmd', 'com', 'scr', 'vbs', 'js'];
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (extension && dangerousExtensions.includes(extension)) {
      throw new Error('File type not allowed for security reasons');
    }

    // Additional validation could be added here
  }

  // Generate image preview
  private generateImagePreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error('Failed to generate preview'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file for preview'));
      reader.readAsDataURL(file);
    });
  }

  // Process CSV file
  private processCSVFile(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const lines = content.split('\n').filter(line => line.trim());
          
          if (lines.length === 0) {
            resolve([]);
            return;
          }

          // Parse CSV (basic implementation)
          const headers = lines[0].split(',').map(h => h.trim());
          const data = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim());
            const row: any = {};
            headers.forEach((header, index) => {
              row[header] = values[index] || '';
            });
            return row;
          });

          resolve(data);
        } catch (error) {
          reject(new Error('Failed to parse CSV file'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read CSV file'));
      reader.readAsText(file);
    });
  }

  // Process JSON file
  private processJSONFile(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);
          resolve(data);
        } catch (error) {
          reject(new Error('Failed to parse JSON file'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read JSON file'));
      reader.readAsText(file);
    });
  }

  // Format file size for display
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Predefined upload configurations
export const uploadConfigs = {
  images: {
    acceptedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 10,
    allowedExtensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    validateContent: true
  },
  
  documents: {
    acceptedTypes: ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 5,
    allowedExtensions: ['pdf', 'txt', 'doc', 'docx'],
    validateContent: true
  },
  
  data: {
    acceptedTypes: ['text/csv', 'application/json'],
    maxFileSize: 2 * 1024 * 1024, // 2MB
    maxFiles: 1,
    allowedExtensions: ['csv', 'json'],
    validateContent: true
  },
  
  any: {
    acceptedTypes: [],
    maxFileSize: 50 * 1024 * 1024, // 50MB
    maxFiles: 20,
    validateContent: false
  }
};

// Utility functions
export function createImageUploader(): AdminFileUploader {
  return new AdminFileUploader(uploadConfigs.images);
}

export function createDocumentUploader(): AdminFileUploader {
  return new AdminFileUploader(uploadConfigs.documents);
}

export function createDataUploader(): AdminFileUploader {
  return new AdminFileUploader(uploadConfigs.data);
}

// File input helper component props
export interface FileInputHelperProps {
  uploader: AdminFileUploader;
  onFilesProcessed: (result: UploadResult) => void;
  multiple?: boolean;
  accept?: string;
  children?: React.ReactNode;
  className?: string;
}

// Hook for file upload
export function useFileUpload(config: UploadConfig) {
  const [uploader] = React.useState(() => new AdminFileUploader(config));
  const [isUploading, setIsUploading] = React.useState(false);
  const [result, setResult] = React.useState<UploadResult | null>(null);

  const processFiles = React.useCallback(async (files: FileList | File[]) => {
    setIsUploading(true);
    try {
      const uploadResult = await uploader.processFiles(files);
      setResult(uploadResult);
      return uploadResult;
    } finally {
      setIsUploading(false);
    }
  }, [uploader]);

  const reset = React.useCallback(() => {
    setResult(null);
  }, []);

  return {
    processFiles,
    isUploading,
    result,
    reset
  };
}

// Import React for the hook
import React from 'react';