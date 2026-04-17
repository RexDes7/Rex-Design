/**
 * Validation and Sanitization Utilities
 * 
 * Provides functions for validating and sanitizing user inputs
 * to prevent XSS, injection attacks, and ensure data integrity.
 * 
 * Requirements: 11.3
 */

/**
 * Email validation regex
 * Validates standard email format
 */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * URL validation regex
 * Validates HTTP and HTTPS URLs
 */
const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

/**
 * Validate email format
 * 
 * @param email - Email address to validate
 * @returns true if email is valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  if (typeof email !== 'string') {
    return false;
  }
  
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Validate URL format
 * 
 * @param url - URL to validate
 * @returns true if URL is valid, false otherwise
 */
export function isValidURL(url: string): boolean {
  if (typeof url !== 'string') {
    return false;
  }
  
  return URL_REGEX.test(url.trim());
}

/**
 * Validate text length
 * 
 * @param text - Text to validate
 * @param minLength - Minimum length (default: 0)
 * @param maxLength - Maximum length (default: Infinity)
 * @returns true if text length is within bounds, false otherwise
 */
export function isValidLength(
  text: string,
  minLength: number = 0,
  maxLength: number = Infinity
): boolean {
  if (typeof text !== 'string') {
    return false;
  }
  
  const length = text.trim().length;
  return length >= minLength && length <= maxLength;
}

/**
 * Validate that a value is not empty
 * 
 * @param value - Value to validate
 * @returns true if value is not empty, false otherwise
 */
export function isRequired(value: any): boolean {
  if (value === null || value === undefined) {
    return false;
  }
  
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  
  return true;
}

/**
 * Validate that a value is a valid number
 * 
 * @param value - Value to validate
 * @param min - Minimum value (optional)
 * @param max - Maximum value (optional)
 * @returns true if value is a valid number within bounds, false otherwise
 */
export function isValidNumber(
  value: any,
  min?: number,
  max?: number
): boolean {
  const num = Number(value);
  
  if (isNaN(num) || !isFinite(num)) {
    return false;
  }
  
  if (min !== undefined && num < min) {
    return false;
  }
  
  if (max !== undefined && num > max) {
    return false;
  }
  
  return true;
}

/**
 * Sanitize string to prevent XSS attacks
 * Escapes HTML special characters
 * 
 * @param input - String to sanitize
 * @returns Sanitized string
 */
export function sanitizeHTML(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize string by removing dangerous HTML tags
 * Removes script, iframe, object, embed tags
 * 
 * @param input - String to sanitize
 * @returns Sanitized string
 */
export function sanitizeText(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  return input
    .trim()
    // Remove script tags and content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove iframe tags and content
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    // Remove object tags and content
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    // Remove embed tags
    .replace(/<embed\b[^>]*>/gi, '')
    // Remove on* event handlers
    .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');
}

/**
 * Sanitize filename to prevent directory traversal
 * Removes path separators and special characters
 * 
 * @param filename - Filename to sanitize
 * @returns Sanitized filename
 */
export function sanitizeFilename(filename: string): string {
  if (typeof filename !== 'string') {
    return '';
  }
  
  return filename
    .trim()
    // Remove path separators
    .replace(/[\/\\]/g, '')
    // Remove null bytes
    .replace(/\0/g, '')
    // Remove control characters
    .replace(/[\x00-\x1f\x80-\x9f]/g, '')
    // Remove special characters that could cause issues
    .replace(/[<>:"|?*]/g, '');
}

/**
 * Sanitize object recursively
 * Applies sanitization to all string values in an object
 * 
 * @param obj - Object to sanitize
 * @param sanitizer - Sanitization function to apply (default: sanitizeText)
 * @returns Sanitized object
 */
export function sanitizeObject<T>(
  obj: T,
  sanitizer: (input: string) => string = sanitizeText
): T {
  if (typeof obj === 'string') {
    return sanitizer(obj) as any;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, sanitizer)) as any;
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = sanitizeObject(obj[key], sanitizer);
      }
    }
    return sanitized;
  }
  
  return obj;
}

/**
 * Validate and sanitize email
 * 
 * @param email - Email to validate and sanitize
 * @returns Sanitized email or null if invalid
 */
export function validateAndSanitizeEmail(email: string): string | null {
  if (!isValidEmail(email)) {
    return null;
  }
  
  return email.trim().toLowerCase();
}

/**
 * Validate and sanitize URL
 * 
 * @param url - URL to validate and sanitize
 * @returns Sanitized URL or null if invalid
 */
export function validateAndSanitizeURL(url: string): string | null {
  if (!isValidURL(url)) {
    return null;
  }
  
  return url.trim();
}

/**
 * Validation error class
 */
export class ValidationError extends Error {
  public field: string;
  public code: string;
  
  constructor(field: string, message: string, code: string = 'VALIDATION_ERROR') {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.code = code;
  }
}

/**
 * Validate object against schema
 * 
 * @param obj - Object to validate
 * @param schema - Validation schema
 * @returns Validated and sanitized object
 * @throws ValidationError if validation fails
 */
export function validateSchema<T>(
  obj: any,
  schema: ValidationSchema
): T {
  const errors: string[] = [];
  const validated: any = {};
  
  for (const [field, rules] of Object.entries(schema)) {
    const value = obj[field];
    
    // Check required
    if (rules.required && !isRequired(value)) {
      errors.push(`${field} is required`);
      continue;
    }
    
    // Skip validation if not required and value is empty
    if (!rules.required && !isRequired(value)) {
      continue;
    }
    
    // Type validation
    if (rules.type === 'email') {
      if (!isValidEmail(value)) {
        errors.push(`${field} must be a valid email address`);
        continue;
      }
      validated[field] = validateAndSanitizeEmail(value);
    } else if (rules.type === 'url') {
      if (!isValidURL(value)) {
        errors.push(`${field} must be a valid URL`);
        continue;
      }
      validated[field] = validateAndSanitizeURL(value);
    } else if (rules.type === 'string') {
      if (typeof value !== 'string') {
        errors.push(`${field} must be a string`);
        continue;
      }
      
      // Length validation
      if (rules.minLength !== undefined || rules.maxLength !== undefined) {
        if (!isValidLength(value, rules.minLength, rules.maxLength)) {
          errors.push(
            `${field} must be between ${rules.minLength || 0} and ${rules.maxLength || 'unlimited'} characters`
          );
          continue;
        }
      }
      
      // Sanitize
      validated[field] = rules.sanitize !== false ? sanitizeText(value) : value;
    } else if (rules.type === 'number') {
      if (!isValidNumber(value, rules.min, rules.max)) {
        errors.push(
          `${field} must be a valid number${rules.min !== undefined ? ` >= ${rules.min}` : ''}${rules.max !== undefined ? ` <= ${rules.max}` : ''}`
        );
        continue;
      }
      validated[field] = Number(value);
    } else if (rules.type === 'boolean') {
      validated[field] = Boolean(value);
    } else {
      validated[field] = value;
    }
  }
  
  if (errors.length > 0) {
    throw new ValidationError('validation', errors.join(', '), 'VALIDATION_FAILED');
  }
  
  return validated as T;
}

/**
 * Validation schema type
 */
export interface ValidationSchema {
  [field: string]: {
    required?: boolean;
    type?: 'string' | 'number' | 'boolean' | 'email' | 'url';
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    sanitize?: boolean;
  };
}
