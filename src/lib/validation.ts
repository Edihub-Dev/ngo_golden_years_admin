// Validation utilities for form inputs

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Common validation patterns
export const patterns = {
  mobile: /^[6-9]\d{9}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  pincode: /^\d{6}$/,
  name: /^[a-zA-Z\s]{2,50}$/,
  age: /^(5[0-9]|[6-9][0-9]|1[01][0-9]|120)$/, // 50-120 years
  otp: /^\d{6}$/,
};

export class Validator {
  // Validate a single field
  static validateField(value: any, rules: ValidationRule, fieldName: string): string | null {
    // Required validation
    if (rules.required && (!value || value.toString().trim() === '')) {
      return `${fieldName} is required`;
    }

    // Skip other validations if field is empty and not required
    if (!value || value.toString().trim() === '') {
      return null;
    }

    const stringValue = value.toString();

    // Length validations
    if (rules.minLength && stringValue.length < rules.minLength) {
      return `${fieldName} must be at least ${rules.minLength} characters`;
    }

    if (rules.maxLength && stringValue.length > rules.maxLength) {
      return `${fieldName} must not exceed ${rules.maxLength} characters`;
    }

    // Number validations
    if (rules.min !== undefined && Number(value) < rules.min) {
      return `${fieldName} must be at least ${rules.min}`;
    }

    if (rules.max !== undefined && Number(value) > rules.max) {
      return `${fieldName} must not exceed ${rules.max}`;
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(stringValue)) {
      return `${fieldName} format is invalid`;
    }

    // Custom validation
    if (rules.custom) {
      const customError = rules.custom(value);
      if (customError) return customError;
    }

    return null;
  }

  // Validate entire form
  static validateForm(data: Record<string, any>, rules: Record<string, ValidationRule>): ValidationResult {
    const errors: Record<string, string> = {};

    for (const [field, fieldRules] of Object.entries(rules)) {
      const error = this.validateField(data[field], fieldRules, this.formatFieldName(field));
      if (error) {
        errors[field] = error;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Sanitize input values
  static sanitize(value: any): string {
    if (typeof value !== 'string') return value;
    
    return value
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript protocol
      .replace(/on\w+\s*=/gi, ''); // Remove event handlers
  }

  // Sanitize entire form data
  static sanitizeForm(data: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitize(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeForm(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  private static formatFieldName(field: string): string {
    return field
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/\./g, ' ');
  }
}

// Predefined validation rules
export const validationRules = {
  mobile: {
    required: true,
    pattern: patterns.mobile,
    custom: (value: string) => {
      if (!patterns.mobile.test(value)) {
        return 'Please enter a valid 10-digit mobile number';
      }
      return null;
    }
  },
  
  otp: {
    required: true,
    minLength: 6,
    maxLength: 6,
    pattern: patterns.otp,
    custom: (value: string) => {
      if (!patterns.otp.test(value)) {
        return 'Please enter a valid 6-digit OTP';
      }
      return null;
    }
  },

  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: patterns.name,
    custom: (value: string) => {
      if (!patterns.name.test(value)) {
        return 'Name should only contain letters and spaces';
      }
      return null;
    }
  },

  age: {
    required: true,
    min: 50,
    max: 120,
    pattern: patterns.age,
    custom: (value: string) => {
      const age = parseInt(value);
      if (isNaN(age) || age < 50 || age > 120) {
        return 'Age must be between 50 and 120 years';
      }
      return null;
    }
  },

  email: {
    pattern: patterns.email,
    custom: (value: string) => {
      if (value && !patterns.email.test(value)) {
        return 'Please enter a valid email address';
      }
      return null;
    }
  },

  pincode: {
    required: true,
    minLength: 6,
    maxLength: 6,
    pattern: patterns.pincode,
    custom: (value: string) => {
      if (!patterns.pincode.test(value)) {
        return 'Please enter a valid 6-digit pincode';
      }
      return null;
    }
  },

  address: {
    street: { required: true, minLength: 5, maxLength: 200 },
    city: { required: true, minLength: 2, maxLength: 50 },
    state: { required: true, minLength: 2, maxLength: 50 },
  },

  emergencyContact: {
    name: { required: true, minLength: 2, maxLength: 50 },
    mobile: {
      required: true,
      pattern: patterns.mobile,
      custom: (value: string) => {
        if (!patterns.mobile.test(value)) {
          return 'Please enter a valid 10-digit mobile number';
        }
        return null;
      }
    },
    relationship: { required: true, minLength: 2, maxLength: 50 }
  }
};

// Utility function to validate registration form
export function validateRegistrationForm(formData: any): ValidationResult {
  const rules = {
    name: validationRules.name,
    age: validationRules.age,
    email: validationRules.email,
    'address.street': validationRules.address.street,
    'address.city': validationRules.address.city,
    'address.state': validationRules.address.state,
    'address.pincode': validationRules.pincode,
    'emergencyContact.name': validationRules.emergencyContact.name,
    'emergencyContact.mobile': validationRules.emergencyContact.mobile,
    'emergencyContact.relationship': validationRules.emergencyContact.relationship,
  };

  // Sanitize data first
  const sanitizedData = Validator.sanitizeForm(formData);
  
  // Validate
  return Validator.validateForm(sanitizedData, rules);
}
