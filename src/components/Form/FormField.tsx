import React, { useState, useId } from 'react';
import { AlertCircle, Eye, EyeOff, Check, Info } from 'lucide-react';

export interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select' | 'checkbox' | 'radio';
  value: any;
  onChange: (value: any) => void;
  error?: string | null;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  rows?: number;
  options?: Array<{ label: string; value: any }>;
  min?: number;
  max?: number;
  step?: number;
  helpText?: string;
  icon?: React.ComponentType<{ className?: string }>;
  validation?: {
    showOnFocus?: boolean;
    showSuccess?: boolean;
  };
  onBlur?: () => void;
  onFocus?: () => void;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  rows = 3,
  options = [],
  min,
  max,
  step,
  helpText,
  icon: Icon,
  validation = {},
  onBlur,
  onFocus
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);
  const id = useId();

  const hasError = Boolean(error);
  const isValid = !hasError && value && validation.showSuccess;

  const handleFocus = () => {
    setFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setFocused(false);
    onBlur?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    let newValue = e.target.value;
    
    if (type === 'number') {
      newValue = e.target.value === '' ? '' : Number(e.target.value);
    } else if (type === 'checkbox') {
      newValue = (e.target as HTMLInputElement).checked;
    }
    
    onChange(newValue);
  };

  const getInputClasses = () => {
    const baseClasses = `
      w-full px-3 py-2 border rounded-lg transition-all duration-200 
      focus:outline-none focus:ring-2 focus:border-transparent
      disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
      dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:disabled:bg-gray-800
    `;
    
    const stateClasses = hasError
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-600'
      : isValid
      ? 'border-green-300 focus:ring-green-500 focus:border-green-500 dark:border-green-600'
      : focused
      ? 'border-blue-300 focus:ring-blue-500 focus:border-blue-500 dark:border-blue-500'
      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600';
    
    const iconPadding = Icon ? 'pl-10' : '';
    const passwordPadding = type === 'password' ? 'pr-10' : '';
    
    return `${baseClasses} ${stateClasses} ${iconPadding} ${passwordPadding}`;
  };

  const renderInput = () => {
    const commonProps = {
      id,
      name,
      value: type === 'checkbox' ? undefined : value,
      checked: type === 'checkbox' ? value : undefined,
      onChange: handleChange,
      onFocus: handleFocus,
      onBlur: handleBlur,
      placeholder,
      required,
      disabled,
      className: getInputClasses(),
      min,
      max,
      step
    };

    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={rows}
          />
        );
      
      case 'select':
        return (
          <select {...commonProps}>
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'checkbox':
        return (
          <input
            type="checkbox"
            {...commonProps}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 dark:border-gray-600"
          />
        );
      
      case 'radio':
        return (
          <div className="space-y-2">
            {options.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange(e.target.value)}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required={required}
                  disabled={disabled}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2 dark:border-gray-600"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        );
      
      case 'password':
        return (
          <input
            {...commonProps}
            type={showPassword ? 'text' : 'password'}
          />
        );
      
      default:
        return <input {...commonProps} type={type} />;
    }
  };

  if (type === 'checkbox') {
    return (
      <div className={`${className}`}>
        <label className="flex items-start">
          {renderInput()}
          <div className="ml-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </span>
            {helpText && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {helpText}
              </p>
            )}
          </div>
        </label>
        
        {hasError && (
          <div className="mt-1 flex items-center text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Label */}
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className={`w-4 h-4 ${hasError ? 'text-red-400' : isValid ? 'text-green-400' : 'text-gray-400'}`} />
          </div>
        )}
        
        {/* Input */}
        {renderInput()}
        
        {/* Right Icons */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}
          
          {isValid && (
            <Check className="w-4 h-4 text-green-500 dark:text-green-400 ml-2" />
          )}
          
          {hasError && (
            <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 ml-2" />
          )}
        </div>
      </div>
      
      {/* Help Text */}
      {helpText && !hasError && (
        <div className="mt-1 flex items-center text-gray-500 dark:text-gray-400 text-xs">
          <Info className="w-3 h-3 mr-1 flex-shrink-0" />
          {helpText}
        </div>
      )}
      
      {/* Error Message */}
      {hasError && (
        <div className="mt-1 flex items-center text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
          {error}
        </div>
      )}
      
      {/* Real-time Validation Hints */}
      {validation.showOnFocus && focused && !hasError && type !== 'checkbox' && (
        <div className="mt-1 text-xs text-blue-600 dark:text-blue-400">
          {type === 'password' && 'Password must contain at least 8 characters with uppercase, lowercase, and number'}
          {type === 'email' && 'Enter a valid email address'}
          {type === 'url' && 'Enter a valid URL (https://example.com)'}
          {type === 'tel' && 'Enter a valid phone number'}
        </div>
      )}
    </div>
  );
};

export default FormField;