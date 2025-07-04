// Admin Data Management Utilities
// Handles CRUD operations and data persistence for admin functionality

import { AdminResource } from '../types/admin';
import { Animal } from '../types';
import { BlogPost } from '../data/blogPosts';
import { FAQ } from '../data/faqs';
import { EducationalResource } from '../data/educationalResources';
import { VolunteerRole } from '../data/volunteerRoles';

// Storage keys for different data types
export const STORAGE_KEYS = {
  admin: 'harmony_admin_admin',
  animals: 'harmony_admin_animals',
  blog: 'harmony_admin_blog_posts',
  faq: 'harmony_admin_faqs',
  resources: 'harmony_admin_resources',
  volunteers: 'harmony_admin_volunteers',
  users: 'harmony_admin_users',
  settings: 'harmony_admin_settings',
  analytics: 'harmony_admin_analytics',
  inquiries: 'harmony_admin_inquiries',
  donations: 'harmony_admin_donations',
  backup: 'harmony_admin_backup',
  testing: 'harmony_admin_testing',
  metadata: 'harmony_admin_metadata',
} as const;

// Generic data types
export type AdminDataType = 
  | Animal 
  | BlogPost 
  | FAQ 
  | EducationalResource 
  | VolunteerRole 
  | ContactInquiry 
  | DonationRecord 
  | AdminSettings;

export interface ContactInquiry {
  id: string;
  type: 'general' | 'volunteer' | 'visit' | 'donation' | 'adoption';
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'responded' | 'resolved' | 'archived';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  tags: string[];
  submittedAt: Date;
  respondedAt?: Date;
  resolvedAt?: Date;
  notes: AdminNote[];
  attachments: string[];
}

export interface DonationRecord {
  id: string;
  type: 'one-time' | 'monthly' | 'memorial' | 'tribute' | 'corporate';
  amount: number;
  currency: string;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  donorAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: 'credit-card' | 'bank-transfer' | 'paypal' | 'check' | 'cash';
  transactionId?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  designation?: string; // What the donation is for
  anonymous: boolean;
  recurring: boolean;
  recurringFrequency?: 'monthly' | 'quarterly' | 'annually';
  donatedAt: Date;
  processedAt?: Date;
  notes: string;
  taxDeductible: boolean;
  receiptSent: boolean;
}

export interface AdminNote {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
  type: 'note' | 'response' | 'internal';
}

export interface AdminSettings {
  site: {
    name: string;
    description: string;
    url: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    timezone: string;
    language: string;
    maintenanceMode: boolean;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUsername: string;
    fromEmail: string;
    fromName: string;
    templates: EmailTemplate[];
  };
  notifications: {
    emailNotifications: boolean;
    volunteerApplications: boolean;
    contactForms: boolean;
    donations: boolean;
    systemAlerts: boolean;
  };
  backup: {
    autoBackup: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    maxBackups: number;
    includeImages: boolean;
  };
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  active: boolean;
}

// Data persistence utilities
export class AdminDataManager {
  // Utility method for safe date conversion
  static safeConvertToDate(value: any): Date | undefined {
    if (!value) return undefined;
    
    try {
      // If it's already a Date object, return it
      if (value instanceof Date) {
        return value;
      }
      
      // If it's a string or number, try to convert
      const date = new Date(value);
      
      // Check if the date is valid
      if (!isNaN(date.getTime())) {
        return date;
      }
      
      console.warn('Invalid date value:', value);
      return undefined;
    } catch (error) {
      console.warn('Error converting to Date:', value, error);
      return undefined;
    }
  }

  // Generic CRUD operations
  static create<T extends { id: string }>(
    resource: AdminResource,
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
  ): T {
    console.log(`Creating new ${resource}:`, data);
    
    const newItem = {
      ...data,
      id: `${resource}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as T;

    const existing = this.getAll<T>(resource);
    const updated = [newItem, ...existing];
    
    this.saveAll(resource, updated);
    this.updateMetadata(resource, 'create');
    
    console.log(`Created ${resource}:`, newItem.id);
    return newItem;
  }

  static getAll<T>(resource: AdminResource): T[] {
    try {
      const storageKey = STORAGE_KEYS[resource as keyof typeof STORAGE_KEYS];
      const data = localStorage.getItem(storageKey);
      
      if (!data) {
        console.log(`No data found for ${resource}, returning empty array`);
        return [];
      }
      
      const parsed = JSON.parse(data);
      
      // Convert date strings back to Date objects safely
      return parsed.map((item: any) => {
        const convertedItem = { ...item };
        
        // List of fields that should be Date objects
        const dateFields = [
          'createdAt', 'updatedAt', 'publishedAt', 'submittedAt', 'donatedAt',
          'respondedAt', 'resolvedAt', 'lastModified', 'scheduledAt', 'completedAt'
        ];
        
        // Convert each date field safely
        dateFields.forEach(field => {
          if (item[field]) {
            try {
              // If it's already a Date object, keep it
              if (item[field] instanceof Date) {
                convertedItem[field] = item[field];
              }
              // If it's a string that looks like a date, convert it
              else if (typeof item[field] === 'string') {
                const date = new Date(item[field]);
                // Check if the date is valid
                if (!isNaN(date.getTime())) {
                  convertedItem[field] = date;
                } else {
                  console.warn(`Invalid date string for ${field}:`, item[field]);
                  convertedItem[field] = undefined;
                }
              }
              // If it's a number (timestamp), convert it
              else if (typeof item[field] === 'number') {
                convertedItem[field] = new Date(item[field]);
              }
            } catch (error) {
              console.warn(`Error converting ${field} to Date:`, item[field], error);
              convertedItem[field] = undefined;
            }
          }
        });
        
        // Handle nested date objects (like in notes array)
        if (item.notes && Array.isArray(item.notes)) {
          convertedItem.notes = item.notes.map((note: any) => ({
            ...note,
            createdAt: note.createdAt ? this.safeConvertToDate(note.createdAt) : undefined,
          }));
        }
        
        return convertedItem;
      });
    } catch (error) {
      console.error(`Error getting ${resource} data:`, error);
      return [];
    }
  }

  static getById<T extends { id: string }>(resource: AdminResource, id: string): T | null {
    const items = this.getAll<T>(resource);
    return items.find(item => item.id === id) || null;
  }

  static update<T extends { id: string }>(
    resource: AdminResource,
    id: string,
    updates: Partial<Omit<T, 'id' | 'createdAt'>>
  ): T | null {
    console.log(`Updating ${resource} ${id}:`, updates);
    
    const items = this.getAll<T>(resource);
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) {
      console.error(`${resource} with id ${id} not found`);
      return null;
    }
    
    const updatedItem = {
      ...items[index],
      ...updates,
      updatedAt: new Date(),
    } as T;
    
    items[index] = updatedItem;
    this.saveAll(resource, items);
    this.updateMetadata(resource, 'update');
    
    console.log(`Updated ${resource}:`, updatedItem.id);
    return updatedItem;
  }

  static delete(resource: AdminResource, id: string): boolean {
    console.log(`Deleting ${resource} ${id}`);
    
    const items = this.getAll(resource);
    const filteredItems = items.filter(item => (item as any).id !== id);
    
    if (items.length === filteredItems.length) {
      console.error(`${resource} with id ${id} not found`);
      return false;
    }
    
    this.saveAll(resource, filteredItems);
    this.updateMetadata(resource, 'delete');
    
    console.log(`Deleted ${resource}:`, id);
    return true;
  }

  static deleteMultiple(resource: AdminResource, ids: string[]): number {
    console.log(`Deleting multiple ${resource}:`, ids);
    
    const items = this.getAll(resource);
    const filteredItems = items.filter(item => !ids.includes((item as any).id));
    const deletedCount = items.length - filteredItems.length;
    
    this.saveAll(resource, filteredItems);
    this.updateMetadata(resource, 'delete', deletedCount);
    
    console.log(`Deleted ${deletedCount} ${resource} items`);
    return deletedCount;
  }

  // Utility methods
  static saveAll<T>(resource: AdminResource, data: T[]): void {
    try {
      const storageKey = STORAGE_KEYS[resource as keyof typeof STORAGE_KEYS];
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${resource} data:`, error);
      throw new Error(`Failed to save ${resource} data`);
    }
  }

  static count(resource: AdminResource): number {
    return this.getAll(resource).length;
  }

  static search<T extends Record<string, any>>(
    resource: AdminResource,
    query: string,
    fields: (keyof T)[]
  ): T[] {
    const items = this.getAll<T>(resource);
    const lowercaseQuery = query.toLowerCase().trim();
    
    if (!lowercaseQuery) return items;
    
    return items.filter(item =>
      fields.some(field => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(lowercaseQuery);
        }
        if (Array.isArray(value)) {
          return value.some((v: any) => 
            typeof v === 'string' && v.toLowerCase().includes(lowercaseQuery)
          );
        }
        return false;
      })
    );
  }

  static filter<T extends Record<string, any>>(
    resource: AdminResource,
    filters: Record<string, any>
  ): T[] {
    const items = this.getAll<T>(resource);
    
    return items.filter(item =>
      Object.entries(filters).every(([key, value]) => {
        if (value === undefined || value === null || value === '') return true;
        
        const itemValue = item[key];
        
        if (Array.isArray(value)) {
          return value.includes(itemValue);
        }
        
        if (typeof value === 'string' && typeof itemValue === 'string') {
          return itemValue.toLowerCase().includes(value.toLowerCase());
        }
        
        return itemValue === value;
      })
    );
  }

  static sort<T extends Record<string, any>>(
    items: T[],
    sortBy: keyof T,
    sortOrder: 'asc' | 'desc' = 'asc'
  ): T[] {
    return [...items].sort((a, b) => {
      const aValue = (a as any)[sortBy];
      const bValue = (b as any)[sortBy];
      
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortOrder === 'asc' 
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
  }

  // Metadata tracking
  static updateMetadata(resource: AdminResource, action: 'create' | 'update' | 'delete', count: number = 1): void {
    try {
      const metadata = this.getMetadata();
      const resourceKey = resource as keyof typeof metadata.resources;
      
      if (!metadata.resources[resourceKey]) {
        metadata.resources[resourceKey] = {
          total: 0,
          created: 0,
          updated: 0,
          deleted: 0,
          lastModified: new Date(),
        };
      }
      
      metadata.resources[resourceKey][action] += count;
      metadata.resources[resourceKey].lastModified = new Date();
      metadata.resources[resourceKey].total = this.count(resource);
      
      localStorage.setItem(STORAGE_KEYS.metadata, JSON.stringify(metadata));
    } catch (error) {
      console.error('Error updating metadata:', error);
    }
  }

  static getMetadata() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.metadata);
      if (!data) {
        return {
          resources: {} as Record<AdminResource, {
            total: number;
            created: number;
            updated: number;
            deleted: number;
            lastModified: Date;
          }>,
          lastBackup: null as Date | null,
          version: '1.0.0',
        };
      }
      
      const parsed = JSON.parse(data);
      
      // Convert date strings back to Date objects
      Object.values(parsed.resources).forEach((resource: any) => {
        if (resource.lastModified) {
          resource.lastModified = new Date(resource.lastModified);
        }
      });
      
      if (parsed.lastBackup) {
        parsed.lastBackup = new Date(parsed.lastBackup);
      }
      
      return parsed;
    } catch (error) {
      console.error('Error getting metadata:', error);
      return {
        resources: {},
        lastBackup: null,
        version: '1.0.0',
      };
    }
  }

  // Backup and restore
  static exportData(): string {
    const exportData: Record<string, any> = {};
    
    Object.entries(STORAGE_KEYS).forEach(([key, storageKey]) => {
      if (key !== 'metadata') {
        exportData[key] = this.getAll(key as AdminResource);
      }
    });
    
    exportData.metadata = this.getMetadata();
    exportData.exportedAt = new Date();
    
    return JSON.stringify(exportData, null, 2);
  }

  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      Object.entries(STORAGE_KEYS).forEach(([key, storageKey]) => {
        if (key in data && key !== 'metadata') {
          localStorage.setItem(storageKey, JSON.stringify(data[key]));
        }
      });
      
      console.log('Data imported successfully');
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  static clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(storageKey => {
      localStorage.removeItem(storageKey);
    });
    console.log('All admin data cleared');
  }
}

// Form validation utilities
export class AdminValidator {
  static required(value: any, fieldName: string): string | null {
    if (value === undefined || value === null || value === '') {
      return `${fieldName} is required`;
    }
    return null;
  }

  static email(value: string): string | null {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  }

  static minLength(value: string, min: number): string | null {
    if (!value) return null;
    if (value.length < min) {
      return `Must be at least ${min} characters long`;
    }
    return null;
  }

  static maxLength(value: string, max: number): string | null {
    if (!value) return null;
    if (value.length > max) {
      return `Must be no more than ${max} characters long`;
    }
    return null;
  }

  static url(value: string): string | null {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return 'Please enter a valid URL';
    }
  }

  static phone(value: string): string | null {
    if (!value) return null;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(value.replace(/\D/g, ''))) {
      return 'Please enter a valid phone number';
    }
    return null;
  }

  static number(value: any, min?: number, max?: number): string | null {
    const num = Number(value);
    if (isNaN(num)) {
      return 'Must be a valid number';
    }
    if (min !== undefined && num < min) {
      return `Must be at least ${min}`;
    }
    if (max !== undefined && num > max) {
      return `Must be no more than ${max}`;
    }
    return null;
  }

  static validateForm(
    data: Record<string, any>,
    rules: Record<string, ((value: any) => string | null)[]>
  ): Record<string, string> {
    const errors: Record<string, string> = {};
    
    Object.entries(rules).forEach(([field, validators]) => {
      const value = data[field];
      
      for (const validator of validators) {
        const error = validator(value);
        if (error) {
          errors[field] = error;
          break; // Stop at first error for this field
        }
      }
    });
    
    return errors;
  }
}