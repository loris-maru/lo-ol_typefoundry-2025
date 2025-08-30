// utils/validator.ts

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface ValidationRule {
  test: (value: unknown) => boolean;
  message: string;
}

export class Validator {
  private rules: ValidationRule[] = [];

  addRule(rule: ValidationRule): Validator {
    this.rules.push(rule);
    return this;
  }

  validate(value: unknown): ValidationResult {
    const errors: string[] = [];

    for (const rule of this.rules) {
      if (!rule.test(value)) {
        errors.push(rule.message);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  clear(): Validator {
    this.rules = [];
    return this;
  }
}

// Common validation rules
export const commonRules = {
  required: (message = "This field is required"): ValidationRule => ({
    test: (value: unknown) =>
      value !== null && value !== undefined && value !== "",
    message,
  }),

  email: (message = "Please enter a valid email address"): ValidationRule => ({
    test: (value: unknown) => {
      if (!value) return true; // Allow empty if not required
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(String(value));
    },
    message,
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    test: (value: unknown) => {
      if (!value) return true; // Allow empty if not required
      return String(value).length >= min;
    },
    message: message || `Must be at least ${min} characters long`,
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    test: (value: unknown) => {
      if (!value) return true; // Allow empty if not required
      return String(value).length <= max;
    },
    message: message || `Must be no more than ${max} characters long`,
  }),

  numeric: (message = "Must be a number"): ValidationRule => ({
    test: (value: unknown) => {
      if (!value) return true; // Allow empty if not required
      return !isNaN(Number(value));
    },
    message,
  }),

  positiveNumber: (message = "Must be a positive number"): ValidationRule => ({
    test: (value: unknown) => {
      if (!value) return true; // Allow empty if not required
      const num = Number(value);
      return !isNaN(num) && num > 0;
    },
    message,
  }),

  url: (message = "Please enter a valid URL"): ValidationRule => ({
    test: (value: unknown) => {
      if (!value) return true; // Allow empty if not required
      try {
        new URL(String(value));
        return true;
      } catch {
        return false;
      }
    },
    message,
  }),
};

// Helper function to validate form data
export function validateForm<T extends Record<string, unknown>>(
  data: T,
  validators: Record<keyof T, ValidationRule[]>,
): Record<keyof T, ValidationResult> {
  const results: Record<keyof T, ValidationResult> = {} as Record<
    keyof T,
    ValidationResult
  >;

  for (const [field, rules] of Object.entries(validators)) {
    const validator = new Validator();
    rules.forEach((rule) => validator.addRule(rule));

    results[field as keyof T] = validator.validate(data[field]);
  }

  return results;
}

// Helper function to check if form is valid
export function isFormValid<T extends Record<string, unknown>>(
  results: Record<keyof T, ValidationResult>,
): boolean {
  return Object.values(results).every((result) => result.isValid);
}

// Example usage:
/*
const formData = {
  email: "user@example.com",
  password: "password123",
  age: "25"
};

const validators = {
  email: [commonRules.required(), commonRules.email()],
  password: [commonRules.required(), commonRules.minLength(8)],
  age: [commonRules.numeric(), commonRules.positiveNumber()]
};

const validationResults = validateForm(formData, validators);
const isValid = isFormValid(validationResults);

console.log(validationResults);
console.log("Form is valid:", isValid);
*/
