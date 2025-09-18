import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { FormValidator, ValidationRule } from '../../utils/validation';

interface FormProps {
  children: React.ReactNode;
  onSubmit: (data: any, isValid: boolean) => Promise<void> | void;
  validationRules?: Record<string, ValidationRule>;
  initialData?: Record<string, any>;
  className?: string;
  submitText?: string;
  showSubmitButton?: boolean;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  resetOnSubmit?: boolean;
  disabled?: boolean;
}

interface FormContextType {
  data: Record<string, any>;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isValid: boolean;
  setValue: (field: string, value: any) => void;
  setError: (field: string, error: string | null) => void;
  getError: (field: string) => string | null;
  hasError: (field: string) => boolean;
  validateField: (field: string) => void;
  validateForm: () => boolean;
}

export const FormContext = React.createContext<FormContextType | null>(null);

export const useForm = () => {
  const context = React.useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a Form component');
  }
  return context;
};

const Form: React.FC<FormProps> = ({
  children,
  onSubmit,
  validationRules = {},
  initialData = {},
  className = '',
  submitText = 'Submit',
  showSubmitButton = true,
  validateOnChange = true,
  validateOnBlur = true,
  resetOnSubmit = false,
  disabled = false
}) => {
  const [data, setData] = useState<Record<string, any>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  const validator = new FormValidator(validationRules);

  // Update data when initialData changes
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const setValue = (field: string, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
    
    if (validateOnChange && touched[field]) {
      validateField(field);
    }
  };

  const setError = (field: string, error: string | null) => {
    setErrors(prev => {
      if (error === null) {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
      return { ...prev, [field]: error };
    });
  };

  const getError = (field: string): string | null => {
    return errors[field] || null;
  };

  const hasError = (field: string): boolean => {
    return Boolean(errors[field]);
  };

  const validateField = (field: string) => {
    if (validationRules[field]) {
      const error = validator.validateField(field, data[field], validationRules[field]);
      setError(field, error);
      return !error;
    }
    return true;
  };

  const validateForm = (): boolean => {
    const result = validator.validate(data);
    setErrors(result.errors);
    return result.isValid;
  };

  const handleFieldBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    if (validateOnBlur) {
      validateField(field);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (disabled || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const isValid = validateForm();
      await onSubmit(data, isValid);
      
      if (resetOnSubmit && isValid) {
        setData(initialData);
        setErrors({});
        setTouched({});
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = Object.keys(errors).length === 0 && Object.keys(validationRules).length > 0;
  const hasErrors = Object.keys(errors).length > 0;
  const hasData = Object.values(data).some(value => value !== '' && value !== null && value !== undefined);

  const contextValue: FormContextType = {
    data,
    errors,
    isSubmitting,
    isValid,
    setValue,
    setError,
    getError,
    hasError,
    validateField,
    validateForm
  };

  // Clone children and inject form props
  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.props.name) {
      return React.cloneElement(child as any, {
        value: data[child.props.name] || '',
        onChange: (value: any) => setValue(child.props.name, value),
        error: getError(child.props.name),
        onBlur: () => handleFieldBlur(child.props.name),
        disabled: disabled || isSubmitting,
        ...child.props
      });
    }
    return child;
  });

  return (
    <FormContext.Provider value={contextValue}>
      <form onSubmit={handleSubmit} className={`space-y-6 ${className}`} noValidate>
        {/* Form Status Banner */}
        {hasErrors && hasData && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
              <div>
                <h4 className="text-sm font-medium text-red-800 dark:text-red-300">
                  Please fix the following errors:
                </h4>
                <ul className="mt-1 text-sm text-red-700 dark:text-red-400 list-disc list-inside">
                  {Object.entries(errors).map(([field, error]) => (
                    <li key={field}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Form Success Banner */}
        {isValid && hasData && !isSubmitting && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
              <p className="text-sm font-medium text-green-800 dark:text-green-300">
                Form is valid and ready to submit
              </p>
            </div>
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-4">
          {enhancedChildren}
        </div>

        {/* Submit Button */}
        {showSubmitButton && (
          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              disabled={disabled || isSubmitting || (Object.keys(validationRules).length > 0 && !isValid)}
              className={`
                flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all
                ${disabled || isSubmitting || (!isValid && Object.keys(validationRules).length > 0)
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
                }
              `}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {submitText}
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </FormContext.Provider>
  );
};

export default Form;