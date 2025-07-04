import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface AdminFormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'date';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  rows?: number;
  min?: string | number;
  max?: string | number;
  className?: string;
}

export const AdminFormField: React.FC<AdminFormFieldProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  error,
  helpText,
  rows = 3,
  min,
  max,
  className = ''
}) => {
  const baseInputClasses = `
    w-full px-3 py-2 border rounded-lg text-sm
    focus:ring-2 focus:ring-blue-500 focus:border-transparent
    transition-colors duration-200
    ${error 
      ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-400' 
      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
    }
    ${disabled 
      ? 'bg-gray-100 cursor-not-allowed' 
      : 'hover:border-gray-400'
    }
  `.trim();

  const renderInput = () => {
    if (type === 'textarea') {
      return (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows}
          className={baseInputClasses}
        />
      );
    }

    return (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        className={baseInputClasses}
      />
    );
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {renderInput()}
      
      {error && (
        <div className="flex items-center gap-1 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
      
      {helpText && !error && (
        <p className="text-sm text-gray-600">{helpText}</p>
      )}
    </div>
  );
};