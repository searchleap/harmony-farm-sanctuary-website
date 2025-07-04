// Admin Search and Filter Utilities
// Advanced search and filtering functionality for admin data

export interface SearchConfig {
  searchableFields: string[];
  caseSensitive?: boolean;
  exactMatch?: boolean;
  highlightMatches?: boolean;
}

export interface FilterConfig {
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'between';
  value: any;
  type?: 'string' | 'number' | 'date' | 'boolean';
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
  type?: 'string' | 'number' | 'date';
}

export interface SearchResult<T> {
  data: T[];
  totalCount: number;
  searchTerm?: string;
  filters: FilterConfig[];
  sort?: SortConfig;
  pagination?: {
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export class AdminSearchEngine<T extends Record<string, any>> {
  private data: T[];
  private config: SearchConfig;

  constructor(data: T[], config: SearchConfig) {
    this.data = data;
    this.config = config;
  }

  // Main search method
  search(
    searchTerm: string = '',
    filters: FilterConfig[] = [],
    sort?: SortConfig,
    pagination?: { page: number; pageSize: number }
  ): SearchResult<T> {
    console.log('[AdminSearchEngine] Searching with term:', searchTerm, 'filters:', filters.length);

    let result = [...this.data];

    // Apply text search
    if (searchTerm.trim()) {
      result = this.applyTextSearch(result, searchTerm);
    }

    // Apply filters
    if (filters.length > 0) {
      result = this.applyFilters(result, filters);
    }

    // Apply sorting
    if (sort) {
      result = this.applySort(result, sort);
    }

    const totalCount = result.length;

    // Apply pagination
    if (pagination) {
      const start = (pagination.page - 1) * pagination.pageSize;
      const end = start + pagination.pageSize;
      result = result.slice(start, end);
    }

    return {
      data: result,
      totalCount,
      searchTerm,
      filters,
      sort,
      pagination: pagination ? {
        ...pagination,
        totalPages: Math.ceil(totalCount / pagination.pageSize)
      } : undefined
    };
  }

  private applyTextSearch(data: T[], searchTerm: string): T[] {
    const term = this.config.caseSensitive ? searchTerm : searchTerm.toLowerCase();
    
    return data.filter(item => {
      return this.config.searchableFields.some(field => {
        const value = this.getNestedValue(item, field);
        if (value === null || value === undefined) return false;
        
        const stringValue = this.config.caseSensitive 
          ? String(value) 
          : String(value).toLowerCase();

        if (this.config.exactMatch) {
          return stringValue === term;
        }
        
        return stringValue.includes(term);
      });
    });
  }

  private applyFilters(data: T[], filters: FilterConfig[]): T[] {
    return data.filter(item => {
      return filters.every(filter => this.applyFilter(item, filter));
    });
  }

  private applyFilter(item: T, filter: FilterConfig): boolean {
    const value = this.getNestedValue(item, filter.field);
    const filterValue = filter.value;

    if (value === null || value === undefined) {
      return filter.operator === 'equals' && filterValue === null;
    }

    switch (filter.operator) {
      case 'equals':
        return value === filterValue;
      
      case 'contains':
        return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
      
      case 'startsWith':
        return String(value).toLowerCase().startsWith(String(filterValue).toLowerCase());
      
      case 'endsWith':
        return String(value).toLowerCase().endsWith(String(filterValue).toLowerCase());
      
      case 'gt':
        return this.compareValues(value, filterValue, filter.type) > 0;
      
      case 'lt':
        return this.compareValues(value, filterValue, filter.type) < 0;
      
      case 'gte':
        return this.compareValues(value, filterValue, filter.type) >= 0;
      
      case 'lte':
        return this.compareValues(value, filterValue, filter.type) <= 0;
      
      case 'in':
        return Array.isArray(filterValue) && filterValue.includes(value);
      
      case 'between':
        if (Array.isArray(filterValue) && filterValue.length === 2) {
          const [min, max] = filterValue;
          const comparison1 = this.compareValues(value, min, filter.type);
          const comparison2 = this.compareValues(value, max, filter.type);
          return comparison1 >= 0 && comparison2 <= 0;
        }
        return false;
      
      default:
        return true;
    }
  }

  private applySort(data: T[], sort: SortConfig): T[] {
    return data.sort((a, b) => {
      const aValue = this.getNestedValue(a, sort.field);
      const bValue = this.getNestedValue(b, sort.field);
      
      const comparison = this.compareValues(aValue, bValue, sort.type);
      return sort.direction === 'asc' ? comparison : -comparison;
    });
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private compareValues(a: any, b: any, type?: string): number {
    if (a === null || a === undefined) return b === null || b === undefined ? 0 : -1;
    if (b === null || b === undefined) return 1;

    switch (type) {
      case 'number':
        return Number(a) - Number(b);
      
      case 'date':
        return new Date(a).getTime() - new Date(b).getTime();
      
      case 'boolean':
        return Number(a) - Number(b);
      
      default:
        return String(a).localeCompare(String(b));
    }
  }

  // Update data source
  updateData(newData: T[]): void {
    this.data = newData;
  }

  // Get current data
  getData(): T[] {
    return this.data;
  }

  // Get search suggestions
  getSearchSuggestions(searchTerm: string, maxSuggestions = 5): string[] {
    if (!searchTerm.trim()) return [];

    const suggestions = new Set<string>();
    const term = searchTerm.toLowerCase();

    this.data.forEach(item => {
      this.config.searchableFields.forEach(field => {
        const value = this.getNestedValue(item, field);
        if (value && typeof value === 'string') {
          const words = value.toLowerCase().split(/\s+/);
          words.forEach(word => {
            if (word.startsWith(term) && word !== term) {
              suggestions.add(word);
            }
          });
        }
      });
    });

    return Array.from(suggestions).slice(0, maxSuggestions);
  }
}

// Utility functions for common search patterns
export function createAnimalSearchConfig(): SearchConfig {
  return {
    searchableFields: ['name', 'species', 'breed', 'description', 'status'],
    caseSensitive: false,
    exactMatch: false
  };
}

export function createBlogSearchConfig(): SearchConfig {
  return {
    searchableFields: ['title', 'content', 'excerpt', 'author', 'tags'],
    caseSensitive: false,
    exactMatch: false
  };
}

export function createFAQSearchConfig(): SearchConfig {
  return {
    searchableFields: ['question', 'answer', 'category', 'tags'],
    caseSensitive: false,
    exactMatch: false
  };
}

export function createResourceSearchConfig(): SearchConfig {
  return {
    searchableFields: ['title', 'description', 'category', 'type', 'tags'],
    caseSensitive: false,
    exactMatch: false
  };
}

// Common filter presets
export const commonFilters = {
  // Status filters
  isActive: { field: 'isActive', operator: 'equals' as const, value: true, type: 'boolean' as const },
  isInactive: { field: 'isActive', operator: 'equals' as const, value: false, type: 'boolean' as const },
  
  // Date filters
  lastWeek: { 
    field: 'createdAt', 
    operator: 'gte' as const, 
    value: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 
    type: 'date' as const 
  },
  lastMonth: { 
    field: 'createdAt', 
    operator: 'gte' as const, 
    value: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 
    type: 'date' as const 
  },
  
  // Common status values
  published: { field: 'status', operator: 'equals' as const, value: 'published', type: 'string' as const },
  draft: { field: 'status', operator: 'equals' as const, value: 'draft', type: 'string' as const },
  archived: { field: 'status', operator: 'equals' as const, value: 'archived', type: 'string' as const }
};

// Quick search utility
export function quickSearch<T extends Record<string, any>>(
  data: T[],
  searchTerm: string,
  searchFields: string[]
): T[] {
  if (!searchTerm.trim()) return data;

  const engine = new AdminSearchEngine(data, {
    searchableFields: searchFields,
    caseSensitive: false,
    exactMatch: false
  });

  return engine.search(searchTerm).data;
}

// Volunteer search configuration
export function createVolunteerSearchConfig(): SearchConfig {
  return {
    fields: [
      { field: 'title', weight: 3, type: 'string' },
      { field: 'category', weight: 2, type: 'string' },
      { field: 'description', weight: 1, type: 'string' },
      { field: 'requirements', weight: 1, type: 'array' },
      { field: 'urgency', weight: 2, type: 'string' }
    ],
    filters: {
      ...commonFilters,
      highUrgency: { field: 'urgency', operator: 'equals', value: 'high', type: 'string' },
      animalCare: { field: 'category', operator: 'equals', value: 'animal-care', type: 'string' },
      active: { field: 'isActive', operator: 'equals', value: true, type: 'boolean' }
    },
    options: {
      caseSensitive: false,
      includeMatches: true,
      threshold: 0.3
    }
  };
}

// Inquiry search configuration
export function createInquirySearchConfig(): SearchConfig {
  return {
    fields: [
      { field: 'name', weight: 3, type: 'string' },
      { field: 'email', weight: 2, type: 'string' },
      { field: 'subject', weight: 3, type: 'string' },
      { field: 'message', weight: 1, type: 'string' },
      { field: 'type', weight: 2, type: 'string' }
    ],
    filters: {
      ...commonFilters,
      new: { field: 'status', operator: 'equals', value: 'new', type: 'string' },
      responded: { field: 'status', operator: 'equals', value: 'responded', type: 'string' },
      resolved: { field: 'status', operator: 'equals', value: 'resolved', type: 'string' },
      highPriority: { field: 'priority', operator: 'equals', value: 'high', type: 'string' },
      volunteer: { field: 'type', operator: 'equals', value: 'volunteer', type: 'string' },
      adoption: { field: 'type', operator: 'equals', value: 'adoption', type: 'string' }
    },
    options: {
      caseSensitive: false,
      includeMatches: true,
      threshold: 0.3
    }
  };
}

// Donation search configuration
export function createDonationSearchConfig(): SearchConfig {
  return {
    fields: [
      { field: 'donorName', weight: 3, type: 'string' },
      { field: 'donorEmail', weight: 2, type: 'string' },
      { field: 'purpose', weight: 2, type: 'string' },
      { field: 'type', weight: 2, type: 'string' },
      { field: 'method', weight: 1, type: 'string' }
    ],
    filters: {
      ...commonFilters,
      recurring: { field: 'isRecurring', operator: 'equals', value: true, type: 'boolean' },
      monthly: { field: 'type', operator: 'equals', value: 'monthly', type: 'string' },
      memorial: { field: 'type', operator: 'equals', value: 'memorial', type: 'string' },
      sponsorship: { field: 'type', operator: 'equals', value: 'sponsorship', type: 'string' },
      largeAmount: { field: 'amount', operator: 'gte', value: 100, type: 'number' }
    },
    options: {
      caseSensitive: false,
      includeMatches: true,
      threshold: 0.3
    }
  };
}