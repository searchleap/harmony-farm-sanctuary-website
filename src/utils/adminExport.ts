// Admin Export and Import Utilities
// Handle data export/import in various formats

export interface ExportConfig {
  filename?: string;
  format: 'csv' | 'json' | 'xlsx';
  fields?: string[]; // If not provided, export all fields
  headers?: Record<string, string>; // Custom column headers
  includeHeaders?: boolean;
  dateFormat?: string;
  booleanFormat?: 'true/false' | 'yes/no' | '1/0';
}

export interface ImportResult<T> {
  data: T[];
  errors: ImportError[];
  totalRows: number;
  successCount: number;
  errorCount: number;
}

export interface ImportError {
  row: number;
  field?: string;
  message: string;
  data?: any;
}

export class AdminExporter<T extends Record<string, any>> {
  private data: T[];

  constructor(data: T[]) {
    this.data = data;
  }

  // Export to CSV
  exportToCSV(config: Omit<ExportConfig, 'format'> = {}): void {
    const csvConfig: ExportConfig = { ...config, format: 'csv' };
    const csvContent = this.generateCSV(csvConfig);
    
    this.downloadFile(
      csvContent,
      csvConfig.filename || 'export.csv',
      'text/csv'
    );
  }

  // Export to JSON
  exportToJSON(config: Omit<ExportConfig, 'format'> = {}): void {
    const jsonConfig: ExportConfig = { ...config, format: 'json' };
    const processedData = this.processDataForExport(jsonConfig);
    const jsonContent = JSON.stringify(processedData, null, 2);
    
    this.downloadFile(
      jsonContent,
      jsonConfig.filename || 'export.json',
      'application/json'
    );
  }

  // Generate CSV content
  private generateCSV(config: ExportConfig): string {
    console.log('[AdminExporter] Generating CSV with config:', config);

    const processedData = this.processDataForExport(config);
    
    if (processedData.length === 0) {
      return config.includeHeaders !== false ? this.getHeaders(config).join(',') : '';
    }

    const lines: string[] = [];
    
    // Add headers
    if (config.includeHeaders !== false) {
      const headers = this.getHeaders(config);
      lines.push(headers.map(header => this.escapeCSVField(header)).join(','));
    }
    
    // Add data rows
    processedData.forEach(row => {
      const fields = this.getFieldsToExport(config);
      const values = fields.map(field => {
        const value = this.getNestedValue(row, field);
        return this.escapeCSVField(this.formatValue(value, config));
      });
      lines.push(values.join(','));
    });
    
    return lines.join('\n');
  }

  // Process data for export
  private processDataForExport(config: ExportConfig): T[] {
    const fields = this.getFieldsToExport(config);
    
    return this.data.map(item => {
      const processedItem: any = {};
      
      fields.forEach(field => {
        const value = this.getNestedValue(item, field);
        processedItem[field] = this.formatValue(value, config);
      });
      
      return processedItem;
    });
  }

  // Get fields to export
  private getFieldsToExport(config: ExportConfig): string[] {
    if (config.fields && config.fields.length > 0) {
      return config.fields;
    }
    
    // Get all unique fields from the data
    const allFields = new Set<string>();
    this.data.forEach(item => {
      this.getObjectPaths(item).forEach(path => allFields.add(path));
    });
    
    return Array.from(allFields).sort();
  }

  // Get headers for export
  private getHeaders(config: ExportConfig): string[] {
    const fields = this.getFieldsToExport(config);
    
    return fields.map(field => {
      return config.headers?.[field] || this.formatFieldName(field);
    });
  }

  // Format field name for header
  private formatFieldName(field: string): string {
    return field
      .split('.')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  // Format value for export
  private formatValue(value: any, config: ExportConfig): string {
    if (value === null || value === undefined) {
      return '';
    }
    
    if (typeof value === 'boolean') {
      switch (config.booleanFormat) {
        case 'yes/no':
          return value ? 'Yes' : 'No';
        case '1/0':
          return value ? '1' : '0';
        default:
          return value ? 'true' : 'false';
      }
    }
    
    if (value instanceof Date) {
      return config.dateFormat 
        ? this.formatDate(value, config.dateFormat)
        : value.toISOString();
    }
    
    if (Array.isArray(value)) {
      return value.join('; ');
    }
    
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    
    return String(value);
  }

  // Format date
  private formatDate(date: Date, format: string): string {
    const options: Intl.DateTimeFormatOptions = {};
    
    switch (format) {
      case 'short':
        options.dateStyle = 'short';
        break;
      case 'medium':
        options.dateStyle = 'medium';
        break;
      case 'long':
        options.dateStyle = 'long';
        break;
      case 'iso':
        return date.toISOString();
      default:
        return date.toLocaleDateString();
    }
    
    return date.toLocaleDateString(undefined, options);
  }

  // Escape CSV field
  private escapeCSVField(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  // Get nested value from object
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // Get all paths in an object (for field discovery)
  private getObjectPaths(obj: any, prefix = ''): string[] {
    const paths: string[] = [];
    
    Object.keys(obj).forEach(key => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];
      
      if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        paths.push(...this.getObjectPaths(value, fullKey));
      } else {
        paths.push(fullKey);
      }
    });
    
    return paths;
  }

  // Download file
  private downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    console.log('[AdminExporter] Downloaded file:', filename);
  }
}

// CSV Parser for imports
export class AdminImporter<T extends Record<string, any>> {
  
  // Parse CSV content
  static parseCSV<T>(content: string, options: {
    hasHeaders?: boolean;
    delimiter?: string;
    skipEmptyLines?: boolean;
  } = {}): ImportResult<T> {
    console.log('[AdminImporter] Parsing CSV content, length:', content.length);

    const {
      hasHeaders = true,
      delimiter = ',',
      skipEmptyLines = true
    } = options;

    const lines = content.split('\n').map(line => line.trim());
    const errors: ImportError[] = [];
    const data: T[] = [];
    
    if (lines.length === 0) {
      return { data, errors, totalRows: 0, successCount: 0, errorCount: 0 };
    }

    let headers: string[] = [];
    let startRow = 0;

    if (hasHeaders) {
      headers = this.parseCSVLine(lines[0], delimiter);
      startRow = 1;
    }

    for (let i = startRow; i < lines.length; i++) {
      const line = lines[i];
      
      if (skipEmptyLines && !line) {
        continue;
      }

      try {
        const values = this.parseCSVLine(line, delimiter);
        
        if (hasHeaders && values.length !== headers.length) {
          errors.push({
            row: i + 1,
            message: `Expected ${headers.length} columns, got ${values.length}`
          });
          continue;
        }

        const record: any = {};
        
        if (hasHeaders) {
          headers.forEach((header, index) => {
            record[header] = values[index] || '';
          });
        } else {
          values.forEach((value, index) => {
            record[`column_${index}`] = value;
          });
        }

        data.push(record as T);
      } catch (error) {
        errors.push({
          row: i + 1,
          message: `Parse error: ${error}`
        });
      }
    }

    return {
      data,
      errors,
      totalRows: lines.length - startRow,
      successCount: data.length,
      errorCount: errors.length
    };
  }

  // Parse a single CSV line
  private static parseCSVLine(line: string, delimiter: string): string[] {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    let i = 0;

    while (i < line.length) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i += 2;
        } else {
          inQuotes = !inQuotes;
          i++;
        }
      } else if (char === delimiter && !inQuotes) {
        values.push(current);
        current = '';
        i++;
      } else {
        current += char;
        i++;
      }
    }
    
    values.push(current);
    return values;
  }

  // Parse JSON content
  static parseJSON<T>(content: string): ImportResult<T> {
    console.log('[AdminImporter] Parsing JSON content');

    try {
      const parsed = JSON.parse(content);
      const data = Array.isArray(parsed) ? parsed : [parsed];
      
      return {
        data: data as T[],
        errors: [],
        totalRows: data.length,
        successCount: data.length,
        errorCount: 0
      };
    } catch (error) {
      return {
        data: [],
        errors: [{
          row: 0,
          message: `JSON parse error: ${error}`
        }],
        totalRows: 0,
        successCount: 0,
        errorCount: 1
      };
    }
  }
}

// Utility functions
export function exportAnimals(animals: any[], config?: Partial<ExportConfig>): void {
  const exporter = new AdminExporter(animals);
  const exportConfig: ExportConfig = {
    filename: 'animals-export.csv',
    format: 'csv' as const,
    fields: ['name', 'species', 'breed', 'age', 'status', 'description', 'createdAt'],
    headers: {
      'name': 'Animal Name',
      'species': 'Species',
      'breed': 'Breed',
      'age': 'Age',
      'status': 'Status',
      'description': 'Description',
      'createdAt': 'Date Added'
    },
    dateFormat: 'medium',
    booleanFormat: 'yes/no',
    ...config
  };
  
  if (exportConfig.format === 'json') {
    exporter.exportToJSON(exportConfig);
  } else {
    exporter.exportToCSV(exportConfig);
  }
}

export function exportBlogPosts(posts: any[], config?: Partial<ExportConfig>): void {
  const exporter = new AdminExporter(posts);
  const exportConfig: ExportConfig = {
    filename: 'blog-posts-export.csv',
    format: 'csv' as const,
    fields: ['title', 'author', 'status', 'publishedAt', 'excerpt'],
    headers: {
      'title': 'Title',
      'author': 'Author',
      'status': 'Status',
      'publishedAt': 'Published Date',
      'excerpt': 'Excerpt'
    },
    dateFormat: 'medium',
    ...config
  };
  
  if (exportConfig.format === 'json') {
    exporter.exportToJSON(exportConfig);
  } else {
    exporter.exportToCSV(exportConfig);
  }
}