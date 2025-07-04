// Admin Validation Utilities
// Comprehensive validation functions for admin forms and data

export type ValidationRule = 
  | 'required'
  | 'email'
  | 'url'
  | 'phone'
  | 'date'
  | 'number'
  | 'integer'
  | 'positive'
  | 'negative'
  | 'min'
  | 'max'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'custom';

export interface ValidationConfig {
  rule: ValidationRule;
  value?: any; // For rules like min, max, minLength, etc.
  message?: string;
  validator?: (value: any) => boolean | string; // For custom validation
}

export interface FieldValidation {
  field: string;
  label?: string;
  rules: ValidationConfig[];
  required?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  rule: ValidationRule;
  value?: any;
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

export class AdminValidator {
  private validations: FieldValidation[];

  constructor(validations: FieldValidation[] = []) {
    this.validations = validations;
  }

  // Validate a single value
  static validateValue(value: any, rules: ValidationConfig[]): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    for (const rule of rules) {
      const error = this.applyRule(value, rule);
      if (error) {
        errors.push({
          field: 'value',
          message: error,
          rule: rule.rule,
          value
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // Validate an object against configured validations
  validate(data: Record<string, any>): ValidationResult {
    console.log('[AdminValidator] Validating data:', Object.keys(data));

    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    for (const validation of this.validations) {
      const value = this.getNestedValue(data, validation.field);
      
      for (const rule of validation.rules) {
        const error = AdminValidator.applyRule(value, rule);
        if (error) {
          errors.push({
            field: validation.field,
            message: error,
            rule: rule.rule,
            value
          });
        }
      }

      // Check for common warnings
      const warning = this.checkWarnings(validation.field, value, validation);
      if (warning) {
        warnings.push(warning);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // Apply a single validation rule
  private static applyRule(value: any, rule: ValidationConfig): string | null {
    const isEmpty = value === null || value === undefined || value === '';

    switch (rule.rule) {
      case 'required':
        return isEmpty ? (rule.message || 'This field is required') : null;

      case 'email':
        if (isEmpty) return null;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? null : (rule.message || 'Please enter a valid email address');

      case 'url':
        if (isEmpty) return null;
        try {
          new URL(value);
          return null;
        } catch {
          return rule.message || 'Please enter a valid URL';
        }

      case 'phone':
        if (isEmpty) return null;
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(value.replace(/\s/g, '')) ? null : (rule.message || 'Please enter a valid phone number');

      case 'date':
        if (isEmpty) return null;
        const date = new Date(value);
        return !isNaN(date.getTime()) ? null : (rule.message || 'Please enter a valid date');

      case 'number':
        if (isEmpty) return null;
        return !isNaN(Number(value)) ? null : (rule.message || 'Please enter a valid number');

      case 'integer':
        if (isEmpty) return null;
        return Number.isInteger(Number(value)) ? null : (rule.message || 'Please enter a valid integer');

      case 'positive':
        if (isEmpty) return null;
        return Number(value) > 0 ? null : (rule.message || 'Please enter a positive number');

      case 'negative':
        if (isEmpty) return null;
        return Number(value) < 0 ? null : (rule.message || 'Please enter a negative number');

      case 'min':
        if (isEmpty) return null;
        return Number(value) >= rule.value ? null : (rule.message || `Minimum value is ${rule.value}`);

      case 'max':
        if (isEmpty) return null;
        return Number(value) <= rule.value ? null : (rule.message || `Maximum value is ${rule.value}`);

      case 'minLength':
        if (isEmpty) return null;
        return String(value).length >= rule.value ? null : (rule.message || `Minimum length is ${rule.value} characters`);

      case 'maxLength':
        if (isEmpty) return null;
        return String(value).length <= rule.value ? null : (rule.message || `Maximum length is ${rule.value} characters`);

      case 'pattern':
        if (isEmpty) return null;
        const regex = new RegExp(rule.value);
        return regex.test(String(value)) ? null : (rule.message || 'Please enter a valid format');

      case 'custom':
        if (isEmpty) return null;
        if (rule.validator) {
          const result = rule.validator(value);
          return typeof result === 'string' ? result : (result ? null : (rule.message || 'Invalid value'));
        }
        return null;

      default:
        return null;
    }
  }

  // Check for warnings
  private checkWarnings(field: string, value: any, validation: FieldValidation): ValidationWarning | null {
    // Password strength warning
    if (field.toLowerCase().includes('password') && value && typeof value === 'string') {
      if (value.length < 8) {
        return {
          field,
          message: 'Password is quite short',
          suggestion: 'Consider using at least 8 characters for better security'
        };
      }
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
        return {
          field,
          message: 'Password could be stronger',
          suggestion: 'Include uppercase, lowercase, and numbers'
        };
      }
    }

    // Email domain warning
    if (validation.rules.some(r => r.rule === 'email') && value && typeof value === 'string') {
      const commonDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
      const domain = value.split('@')[1]?.toLowerCase();
      if (domain && !commonDomains.includes(domain)) {
        return {
          field,
          message: 'Uncommon email domain',
          suggestion: 'Please double-check the email address'
        };
      }
    }

    return null;
  }

  // Get nested value from object
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // Add validation
  addValidation(validation: FieldValidation): void {
    this.validations.push(validation);
  }

  // Remove validation
  removeValidation(field: string): void {
    this.validations = this.validations.filter(v => v.field !== field);
  }

  // Clear all validations
  clearValidations(): void {
    this.validations = [];
  }
}

// Predefined validation sets
export const commonValidations = {
  // Animal validations
  animalName: {
    field: 'name',
    label: 'Animal Name',
    rules: [
      { rule: 'required' as const },
      { rule: 'minLength' as const, value: 2, message: 'Name must be at least 2 characters' },
      { rule: 'maxLength' as const, value: 50, message: 'Name must be less than 50 characters' }
    ]
  },

  animalSpecies: {
    field: 'species',
    label: 'Species',
    rules: [
      { rule: 'required' as const },
      { rule: 'minLength' as const, value: 2 }
    ]
  },

  animalAge: {
    field: 'age',
    label: 'Age',
    rules: [
      { rule: 'number' as const },
      { rule: 'positive' as const },
      { rule: 'max' as const, value: 50, message: 'Age seems unusually high' }
    ]
  },

  // Blog validations
  blogTitle: {
    field: 'title',
    label: 'Blog Title',
    rules: [
      { rule: 'required' as const },
      { rule: 'minLength' as const, value: 5, message: 'Title must be at least 5 characters' },
      { rule: 'maxLength' as const, value: 200, message: 'Title must be less than 200 characters' }
    ]
  },

  blogContent: {
    field: 'content',
    label: 'Blog Content',
    rules: [
      { rule: 'required' as const },
      { rule: 'minLength' as const, value: 100, message: 'Content must be at least 100 characters' }
    ]
  },

  // User validations
  email: {
    field: 'email',
    label: 'Email',
    rules: [
      { rule: 'required' as const },
      { rule: 'email' as const }
    ]
  },

  password: {
    field: 'password',
    label: 'Password',
    rules: [
      { rule: 'required' as const },
      { rule: 'minLength' as const, value: 8, message: 'Password must be at least 8 characters' }
    ]
  },

  phone: {
    field: 'phone',
    label: 'Phone Number',
    rules: [
      { rule: 'phone' as const }
    ]
  },

  url: {
    field: 'url',
    label: 'Website URL',
    rules: [
      { rule: 'url' as const }
    ]
  },

  // Generic validations
  required: (field: string, label?: string): FieldValidation => ({
    field,
    label: label || field,
    rules: [{ rule: 'required' }]
  }),

  text: (field: string, label?: string, minLength = 1, maxLength = 1000): FieldValidation => ({
    field,
    label: label || field,
    rules: [
      { rule: 'minLength', value: minLength },
      { rule: 'maxLength', value: maxLength }
    ]
  }),

  number: (field: string, label?: string, min?: number, max?: number): FieldValidation => ({
    field,
    label: label || field,
    rules: [
      { rule: 'number' },
      ...(min !== undefined ? [{ rule: 'min' as const, value: min }] : []),
      ...(max !== undefined ? [{ rule: 'max' as const, value: max }] : [])
    ]
  })
};

// Utility functions
export function createAnimalValidator(): AdminValidator {
  return new AdminValidator([
    commonValidations.animalName,
    commonValidations.animalSpecies,
    commonValidations.animalAge
  ]);
}

export function createBlogValidator(): AdminValidator {
  return new AdminValidator([
    commonValidations.blogTitle,
    commonValidations.blogContent
  ]);
}

export function createUserValidator(): AdminValidator {
  return new AdminValidator([
    commonValidations.email,
    commonValidations.password,
    commonValidations.phone
  ]);
}

// Quick validation functions
export function validateEmail(email: string): boolean {
  return AdminValidator.validateValue(email, [{ rule: 'email' }]).isValid;
}

export function validateURL(url: string): boolean {
  return AdminValidator.validateValue(url, [{ rule: 'url' }]).isValid;
}

export function validatePhone(phone: string): boolean {
  return AdminValidator.validateValue(phone, [{ rule: 'phone' }]).isValid;
}