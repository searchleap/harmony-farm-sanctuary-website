import React, { useState, useCallback } from 'react';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

export interface AdminFormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'date' | 'file';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: { value: string | number; label: string }[];
  validation?: {
    pattern?: RegExp;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    custom?: (value: any) => string | null;
  };
  description?: string;
  multiple?: boolean; // For file inputs
  accept?: string; // For file inputs
  rows?: number; // For textarea
}

export interface AdminFormProps {
  fields: AdminFormField[];
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void | Promise<void>;
  submitText?: string;
  cancelText?: string;
  onCancel?: () => void;
  loading?: boolean;
  className?: string;
  layout?: 'vertical' | 'horizontal';
  showRequiredIndicator?: boolean;
}

export interface AdminFormErrors {
  [key: string]: string;
}

export function AdminForm({
  fields,
  initialValues = {},
  onSubmit,
  submitText = 'Save',
  cancelText = 'Cancel',
  onCancel,
  loading = false,
  className = '',
  layout = 'vertical',
  showRequiredIndicator = true
}: AdminFormProps) {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<AdminFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  console.log('[AdminForm] Rendering with fields:', fields.length, 'values:', values);

  // Validate a single field
  const validateField = useCallback((field: AdminFormField, value: any): string | null => {
    if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return `${field.label} is required`;
    }

    if (!value && !field.required) return null;

    const validation = field.validation;
    if (!validation) return null;

    // Pattern validation
    if (validation.pattern && typeof value === 'string' && !validation.pattern.test(value)) {
      return `${field.label} format is invalid`;
    }

    // Length validation
    if (validation.minLength && typeof value === 'string' && value.length < validation.minLength) {
      return `${field.label} must be at least ${validation.minLength} characters`;
    }

    if (validation.maxLength && typeof value === 'string' && value.length > validation.maxLength) {
      return `${field.label} must be no more than ${validation.maxLength} characters`;
    }

    // Number validation
    if (field.type === 'number') {
      const numValue = Number(value);
      if (validation.min !== undefined && numValue < validation.min) {
        return `${field.label} must be at least ${validation.min}`;
      }
      if (validation.max !== undefined && numValue > validation.max) {
        return `${field.label} must be no more than ${validation.max}`;
      }
    }

    // Custom validation
    if (validation.custom) {
      return validation.custom(value);
    }

    return null;
  }, []);

  // Validate all fields
  const validateForm = useCallback((): boolean => {
    const newErrors: AdminFormErrors = {};
    
    fields.forEach(field => {
      const error = validateField(field, values[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [fields, values, validateField]);

  // Handle field change
  const handleChange = (field: AdminFormField, value: any) => {
    setValues(prev => ({ ...prev, [field.name]: value }));
    
    // Clear error for this field
    if (errors[field.name]) {
      setErrors(prev => ({ ...prev, [field.name]: '' }));
    }

    // Validate field if it has been touched
    if (touched[field.name]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field.name]: error || '' }));
    }
  };

  // Handle field blur
  const handleBlur = (field: AdminFormField) => {
    setTouched(prev => ({ ...prev, [field.name]: true }));
    
    const error = validateField(field, values[field.name]);
    setErrors(prev => ({ ...prev, [field.name]: error || '' }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(values);
    } catch (error) {
      console.error('[AdminForm] Submit error:', error);
    }
  };

  // Render field based on type
  const renderField = (field: AdminFormField) => {
    const value = values[field.name] || '';
    const error = errors[field.name];
    const hasError = Boolean(error && touched[field.name]);

    const baseInputClass = `
      block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500
      ${hasError ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-transparent'}
      ${field.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
    `;

    const commonProps = {
      id: field.name,
      name: field.name,
      disabled: field.disabled || loading,
      onBlur: () => handleBlur(field),
      className: baseInputClass.trim()
    };

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            value={value}
            placeholder={field.placeholder}
            rows={field.rows || 3}
            onChange={(e) => handleChange(field, e.target.value)}
          />
        );

      case 'select':
        return (
          <select
            {...commonProps}
            value={value}
            onChange={(e) => handleChange(field, e.target.value)}
          >
            <option value="">{field.placeholder || `Select ${field.label}`}</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={field.name}
              name={field.name}
              checked={Boolean(value)}
              disabled={field.disabled || loading}
              onChange={(e) => handleChange(field, e.target.checked)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor={field.name} className="ml-2 block text-sm text-gray-900">
              {field.label}
              {field.required && showRequiredIndicator && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </label>
          </div>
        );

      case 'file':
        return (
          <input
            {...commonProps}
            type="file"
            accept={field.accept}
            multiple={field.multiple}
            onChange={(e) => handleChange(field, field.multiple ? e.target.files : e.target.files?.[0])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
        );

      case 'password':
        return (
          <div className="relative">
            <input
              {...commonProps}
              type={showPassword[field.name] ? 'text' : 'password'}
              value={value}
              placeholder={field.placeholder}
              onChange={(e) => handleChange(field, e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(prev => ({ ...prev, [field.name]: !prev[field.name] }))}
            >
              {showPassword[field.name] ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        );

      default:
        return (
          <input
            {...commonProps}
            type={field.type}
            value={value}
            placeholder={field.placeholder}
            onChange={(e) => handleChange(field, e.target.value)}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {fields.map(field => {
        if (field.type === 'checkbox') {
          return (
            <div key={field.name} className="flex items-start">
              <div className="flex items-center h-5">
                {renderField(field)}
              </div>
              {field.description && (
                <p className="mt-1 text-sm text-gray-500">{field.description}</p>
              )}
              {errors[field.name] && touched[field.name] && (
                <div className="mt-1 flex items-center text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors[field.name]}
                </div>
              )}
            </div>
          );
        }

        return (
          <div key={field.name} className={layout === 'horizontal' ? 'sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start' : ''}>
            <label 
              htmlFor={field.name} 
              className={`block text-sm font-medium text-gray-700 ${
                layout === 'horizontal' ? 'sm:pt-2' : 'mb-1'
              }`}
            >
              {field.label}
              {field.required && showRequiredIndicator && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </label>
            
            <div className={layout === 'horizontal' ? 'mt-1 sm:mt-0 sm:col-span-2' : ''}>
              {renderField(field)}
              
              {field.description && (
                <p className="mt-1 text-sm text-gray-500">{field.description}</p>
              )}
              
              {errors[field.name] && touched[field.name] && (
                <div className="mt-1 flex items-center text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors[field.name]}
                </div>
              )}
            </div>
          </div>
        );
      })}

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
          >
            {cancelText}
          </button>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
        >
          {loading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          )}
          {submitText}
        </button>
      </div>
    </form>
  );
}