export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  email?: boolean;
  phone?: boolean;
  url?: boolean;
  custom?: (value: any) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export class FormValidator {
  private rules: Record<string, ValidationRule> = {};
  private errors: Record<string, string> = {};

  constructor(rules: Record<string, ValidationRule> = {}) {
    this.rules = rules;
  }

  addRule(field: string, rule: ValidationRule) {
    this.rules[field] = rule;
    return this;
  }

  validate(data: Record<string, any>): ValidationResult {
    this.errors = {};

    for (const [field, rule] of Object.entries(this.rules)) {
      const value = data[field];
      const error = this.validateField(field, value, rule);
      if (error) {
        this.errors[field] = error;
      }
    }

    return {
      isValid: Object.keys(this.errors).length === 0,
      errors: { ...this.errors }
    };
  }

  validateField(field: string, value: any, rule: ValidationRule): string | null {
    // Required validation
    if (rule.required && (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0))) {
      return `${this.getFieldDisplayName(field)} is required`;
    }

    // Skip other validations if value is empty and not required
    if (!rule.required && (value === undefined || value === null || value === '')) {
      return null;
    }

    // String validations
    if (typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        return `${this.getFieldDisplayName(field)} must be at least ${rule.minLength} characters`;
      }

      if (rule.maxLength && value.length > rule.maxLength) {
        return `${this.getFieldDisplayName(field)} must not exceed ${rule.maxLength} characters`;
      }

      if (rule.email && !this.isValidEmail(value)) {
        return `${this.getFieldDisplayName(field)} must be a valid email address`;
      }

      if (rule.phone && !this.isValidPhone(value)) {
        return `${this.getFieldDisplayName(field)} must be a valid phone number`;
      }

      if (rule.url && !this.isValidUrl(value)) {
        return `${this.getFieldDisplayName(field)} must be a valid URL`;
      }

      if (rule.pattern && !rule.pattern.test(value)) {
        return `${this.getFieldDisplayName(field)} format is invalid`;
      }
    }

    // Number validations
    if (typeof value === 'number') {
      if (rule.min !== undefined && value < rule.min) {
        return `${this.getFieldDisplayName(field)} must be at least ${rule.min}`;
      }

      if (rule.max !== undefined && value > rule.max) {
        return `${this.getFieldDisplayName(field)} must not exceed ${rule.max}`;
      }
    }

    // Array validations
    if (Array.isArray(value)) {
      if (rule.minLength && value.length < rule.minLength) {
        return `${this.getFieldDisplayName(field)} must have at least ${rule.minLength} items`;
      }

      if (rule.maxLength && value.length > rule.maxLength) {
        return `${this.getFieldDisplayName(field)} must not have more than ${rule.maxLength} items`;
      }
    }

    // Custom validation
    if (rule.custom) {
      const customError = rule.custom(value);
      if (customError) {
        return customError;
      }
    }

    return null;
  }

  private getFieldDisplayName(field: string): string {
    return field
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  getError(field: string): string | null {
    return this.errors[field] || null;
  }

  hasError(field: string): boolean {
    return !!this.errors[field];
  }

  getErrors(): Record<string, string> {
    return { ...this.errors };
  }

  clearErrors(): void {
    this.errors = {};
  }

  clearFieldError(field: string): void {
    delete this.errors[field];
  }
}

// Predefined validation rules for common use cases
export const commonValidationRules = {
  email: {
    required: true,
    email: true,
    maxLength: 255
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/
  },
  phone: {
    phone: true,
    minLength: 10,
    maxLength: 15
  },
  productName: {
    required: true,
    minLength: 3,
    maxLength: 100
  },
  productDescription: {
    required: true,
    minLength: 10,
    maxLength: 500
  },
  price: {
    required: true,
    min: 0
  },
  stock: {
    required: true,
    min: 0
  },
  slug: {
    required: true,
    minLength: 3,
    maxLength: 100,
    pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  },
  category: {
    required: true,
    minLength: 2,
    maxLength: 50
  }
};

// Form field validation helper
export const validateField = (value: any, rules: ValidationRule): string | null => {
  const validator = new FormValidator({ field: rules });
  const result = validator.validate({ field: value });
  return result.errors.field || null;
};

// Real-time validation hook helper
export const createRealTimeValidator = (rules: Record<string, ValidationRule>) => {
  const validator = new FormValidator(rules);
  
  return {
    validate: (data: Record<string, any>) => validator.validate(data),
    validateField: (field: string, value: any) => {
      if (rules[field]) {
        return validator.validateField(field, value, rules[field]);
      }
      return null;
    },
    getError: (field: string) => validator.getError(field),
    hasError: (field: string) => validator.hasError(field)
  };
};

export default FormValidator;