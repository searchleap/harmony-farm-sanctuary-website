// Admin Data Management Hooks
// React hooks for CRUD operations and data management in admin interface

import { useState, useEffect, useCallback, useMemo } from 'react';
import { AdminResource } from '../types/admin';
import { AdminDataManager, AdminDataType, ContactInquiry, DonationRecord, AdminValidator } from '../utils/adminData';

// Generic hook for admin data management
export function useAdminData<T extends { id: string }>(resource: AdminResource) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [resource]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(`Loading ${resource} data...`);
      
      const items = AdminDataManager.getAll<T>(resource);
      setData(items);
      console.log(`Loaded ${items.length} ${resource} items`);
    } catch (err) {
      console.error(`Error loading ${resource} data:`, err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [resource]);

  const create = useCallback(async (newData: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log(`Creating new ${resource}:`, newData);
      const created = AdminDataManager.create<T>(resource, newData);
      setData(prev => [created, ...prev]);
      return created;
    } catch (err) {
      console.error(`Error creating ${resource}:`, err);
      setError(err instanceof Error ? err.message : 'Failed to create item');
      throw err;
    }
  }, [resource]);

  const update = useCallback(async (id: string, updates: Partial<Omit<T, 'id' | 'createdAt'>>) => {
    try {
      console.log(`Updating ${resource} ${id}:`, updates);
      const updated = AdminDataManager.update<T>(resource, id, updates);
      
      if (updated) {
        setData(prev => prev.map(item => item.id === id ? updated : item));
        return updated;
      } else {
        throw new Error(`${resource} not found`);
      }
    } catch (err) {
      console.error(`Error updating ${resource}:`, err);
      setError(err instanceof Error ? err.message : 'Failed to update item');
      throw err;
    }
  }, [resource]);

  const remove = useCallback(async (id: string) => {
    try {
      console.log(`Deleting ${resource} ${id}`);
      const success = AdminDataManager.delete(resource, id);
      
      if (success) {
        setData(prev => prev.filter(item => item.id !== id));
        return true;
      } else {
        throw new Error(`${resource} not found`);
      }
    } catch (err) {
      console.error(`Error deleting ${resource}:`, err);
      setError(err instanceof Error ? err.message : 'Failed to delete item');
      throw err;
    }
  }, [resource]);

  const removeMultiple = useCallback(async (ids: string[]) => {
    try {
      console.log(`Deleting multiple ${resource}:`, ids);
      const deletedCount = AdminDataManager.deleteMultiple(resource, ids);
      setData(prev => prev.filter(item => !ids.includes(item.id)));
      return deletedCount;
    } catch (err) {
      console.error(`Error deleting multiple ${resource}:`, err);
      setError(err instanceof Error ? err.message : 'Failed to delete items');
      throw err;
    }
  }, [resource]);

  const getById = useCallback((id: string): T | undefined => {
    return data.find(item => item.id === id);
  }, [data]);

  return {
    data,
    loading,
    error,
    create,
    update,
    remove,
    removeMultiple,
    getById,
    reload: loadData,
    count: data.length,
  };
}

// Specialized hooks for different data types
export function useAnimals() {
  return useAdminData('animals');
}

export function useBlogPosts() {
  return useAdminData('blogPosts');
}

export function useFAQs() {
  return useAdminData('faqs');
}

export function useResources() {
  return useAdminData('resources');
}

export function useVolunteers() {
  return useAdminData('volunteers');
}

export function useInquiries() {
  return useAdminData<ContactInquiry>('inquiries');
}

export function useDonations() {
  return useAdminData<DonationRecord>('donations');
}

// Search and filter hook
export function useAdminSearch<T extends Record<string, any>>(
  resource: AdminResource,
  searchFields: (keyof T)[]
) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState<keyof T>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredData = useMemo(() => {
    let items = AdminDataManager.getAll<T>(resource);

    // Apply search
    if (query.trim()) {
      items = AdminDataManager.search<T>(resource, query, searchFields);
    }

    // Apply filters
    if (Object.keys(filters).length > 0) {
      items = AdminDataManager.filter<T>(resource, filters);
    }

    // Apply sorting
    items = AdminDataManager.sort<T>(items, sortBy, sortOrder);

    return items;
  }, [resource, query, filters, sortBy, sortOrder, searchFields]);

  const updateFilter = useCallback((key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const clearFilter = useCallback((key: string) => {
    setFilters(prev => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({});
    setQuery('');
  }, []);

  return {
    query,
    setQuery,
    filters,
    updateFilter,
    clearFilter,
    clearAllFilters,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    data: filteredData,
    count: filteredData.length,
  };
}

// Form state management hook
export function useAdminForm<T extends Record<string, any>>(
  initialData: T,
  validationRules?: Record<string, ((value: any) => string | null)[]>
) {
  const [formData, setFormData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback((field: keyof T, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field as string]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[field as string];
        return updated;
      });
    }
  }, [errors]);

  const touchField = useCallback((field: keyof T) => {
    setTouched(prev => ({
      ...prev,
      [field]: true,
    }));
  }, []);

  const validate = useCallback(() => {
    if (!validationRules) return {};
    
    const newErrors = AdminValidator.validateForm(formData, validationRules);
    
    setErrors(newErrors);
    return newErrors;
  }, [formData, validationRules]);

  const handleSubmit = useCallback(async (
    onSubmit: (data: T) => Promise<void>
  ) => {
    const validationErrors = validate();
    
    if (Object.keys(validationErrors).length > 0) {
      // Mark all fields as touched to show errors
      const allTouched = Object.keys(formData).reduce((acc, key) => ({
        ...acc,
        [key]: true,
      }), {});
      setTouched(allTouched);
      return false;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      return true;
    } catch (error) {
      console.error('Form submission error:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validate]);

  const reset = useCallback((newData?: T) => {
    setFormData(newData || initialData);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialData]);

  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(initialData);
  }, [formData, initialData]);

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  return {
    formData,
    errors,
    touched,
    isSubmitting,
    isDirty,
    isValid,
    updateField,
    touchField,
    validate,
    handleSubmit,
    reset,
  };
}

// Statistics hook
export function useAdminStats() {
  const [stats, setStats] = useState({
    animals: 0,
    blogPosts: 0,
    faqs: 0,
    resources: 0,
    volunteers: 0,
    inquiries: 0,
    donations: 0,
  });

  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      
      const newStats = {
        animals: AdminDataManager.count('animals'),
        blogPosts: AdminDataManager.count('blog'),
        faqs: AdminDataManager.count('faq'),
        resources: AdminDataManager.count('resources'),
        volunteers: AdminDataManager.count('volunteers'),
        inquiries: AdminDataManager.count('inquiries'),
        donations: AdminDataManager.count('donations'),
      };
      
      setStats(newStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    stats,
    loading,
    reload: loadStats,
  };
}

// Export/import hook
export function useAdminBackup() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const exportData = useCallback(async () => {
    try {
      setIsExporting(true);
      const data = AdminDataManager.exportData();
      
      // Create and download file
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `harmony-farm-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Export error:', error);
      return false;
    } finally {
      setIsExporting(false);
    }
  }, []);

  const importData = useCallback(async (file: File) => {
    try {
      setIsImporting(true);
      const text = await file.text();
      const success = AdminDataManager.importData(text);
      
      if (success) {
        // Reload page to refresh all data
        window.location.reload();
      }
      
      return success;
    } catch (error) {
      console.error('Import error:', error);
      return false;
    } finally {
      setIsImporting(false);
    }
  }, []);

  return {
    exportData,
    importData,
    isExporting,
    isImporting,
  };
}