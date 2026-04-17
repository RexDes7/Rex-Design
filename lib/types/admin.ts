/**
 * Admin Panel Service Types
 * 
 * Type definitions for admin panel services including authentication,
 * content management, and image management.
 */

import type {
  User,
  Session,
  Project,
  SiteContent,
  ContactInfo,
  Image,
  CreateProjectInput,
  UpdateProjectInput,
  UpdateSiteContentInput,
  UpdateContactInfoInput,
  ManifestoPrinciple,
  Skill,
  SocialLink,
  ImageType
} from '../db/schema';

// ============================================================================
// Authentication Service Types
// ============================================================================

export interface AuthService {
  /**
   * Authenticate user with credentials
   */
  login(email: string, password: string): Promise<AuthResult>;
  
  /**
   * Verify session token
   */
  verifySession(token: string): Promise<SessionData | null>;
  
  /**
   * Terminate session
   */
  logout(token: string): Promise<void>;
  
  /**
   * Check if session is expired
   */
  isSessionExpired(session: SessionData): boolean;
}

export interface AuthResult {
  success: boolean;
  token?: string;
  error?: string;
}

export interface SessionData {
  userId: string;
  email: string;
  createdAt: Date;
  expiresAt: Date;
}

// ============================================================================
// Content Service Types
// ============================================================================

export interface ContentService {
  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | null>;
  createProject(data: CreateProjectInput): Promise<Project>;
  updateProject(id: string, data: UpdateProjectInput): Promise<Project>;
  deleteProject(id: string): Promise<void>;
  reorderProjects(order: string[]): Promise<void>;
  
  // Site Content
  getSiteContent(): Promise<SiteContentParsed>;
  updateSiteContent(data: UpdateSiteContentInput): Promise<SiteContentParsed>;
  
  // Contact Info
  getContactInfo(): Promise<ContactInfoParsed>;
  updateContactInfo(data: UpdateContactInfoInput): Promise<ContactInfoParsed>;
}

/**
 * Parsed version of SiteContent with JSON fields deserialized
 */
export interface SiteContentParsed {
  id: number;
  about: string;
  manifesto: ManifestoPrinciple[];
  skills: Skill[];
  updated_at: string;
}

/**
 * Parsed version of ContactInfo with JSON fields deserialized
 */
export interface ContactInfoParsed {
  id: number;
  email: string;
  phone: string | null;
  social_links: SocialLink[];
  updated_at: string;
}

// ============================================================================
// Image Service Types
// ============================================================================

export interface ImageService {
  /**
   * Upload and optimize image
   */
  uploadImage(file: File, type: ImageType): Promise<ImageUploadResult>;
  
  /**
   * Delete image from storage
   */
  deleteImage(filename: string): Promise<void>;
  
  /**
   * Optimize existing image
   */
  optimizeImage(filename: string): Promise<void>;
  
  /**
   * Get image metadata
   */
  getImageMetadata(filename: string): Promise<ImageMetadata>;
}

export interface ImageUploadResult {
  filename: string;
  url: string;
  width: number;
  height: number;
  size: number;
}

export interface ImageMetadata {
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  width: number;
  height: number;
  uploadedAt: Date;
}

// ============================================================================
// Backup Service Types
// ============================================================================

export interface BackupService {
  /**
   * Create a backup of database and images
   */
  createBackup(): Promise<BackupMetadata>;
  
  /**
   * Restore from a backup
   */
  restoreBackup(timestamp: string): Promise<void>;
  
  /**
   * List available backups
   */
  listBackups(): Promise<BackupMetadata[]>;
  
  /**
   * Delete old backups beyond retention limit
   */
  deleteOldBackups(): Promise<number>;
}

export interface BackupMetadata {
  timestamp: string;
  databaseSize: number;
  imagesSize: number;
  totalSize: number;
  version: string;
}

// ============================================================================
// Rate Limiting Types
// ============================================================================

export interface RateLimiter {
  /**
   * Check if IP address is rate limited
   */
  isRateLimited(ipAddress: string): boolean;
  
  /**
   * Record a failed login attempt
   */
  recordAttempt(ipAddress: string): void;
  
  /**
   * Clear attempts for an IP address
   */
  clearAttempts(ipAddress: string): void;
  
  /**
   * Get remaining attempts for an IP address
   */
  getRemainingAttempts(ipAddress: string): number;
}

export interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
}

// ============================================================================
// CSRF Protection Types
// ============================================================================

export interface CSRFService {
  /**
   * Generate a CSRF token
   */
  generateToken(): string;
  
  /**
   * Validate a CSRF token
   */
  validateToken(token: string): boolean;
  
  /**
   * Invalidate a CSRF token
   */
  invalidateToken(token: string): void;
}

// ============================================================================
// Validation Types
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface Validator {
  /**
   * Validate email format
   */
  validateEmail(email: string): ValidationResult;
  
  /**
   * Validate project data
   */
  validateProject(data: CreateProjectInput | UpdateProjectInput): ValidationResult;
  
  /**
   * Validate site content data
   */
  validateSiteContent(data: UpdateSiteContentInput): ValidationResult;
  
  /**
   * Validate contact info data
   */
  validateContactInfo(data: UpdateContactInfoInput): ValidationResult;
  
  /**
   * Sanitize string input
   */
  sanitize(input: string): string;
}

// ============================================================================
// Error Response Types
// ============================================================================

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
    requestId: string;
  };
}

export type ErrorCode =
  | 'AUTH_INVALID_CREDENTIALS'
  | 'AUTH_SESSION_EXPIRED'
  | 'AUTH_RATE_LIMITED'
  | 'AUTH_INVALID_TOKEN'
  | 'VALIDATION_REQUIRED_FIELD'
  | 'VALIDATION_INVALID_FORMAT'
  | 'VALIDATION_FILE_TOO_LARGE'
  | 'RESOURCE_NOT_FOUND'
  | 'RESOURCE_ALREADY_EXISTS'
  | 'RESOURCE_LOCKED'
  | 'DATABASE_ERROR'
  | 'FILE_SYSTEM_ERROR'
  | 'EXTERNAL_SERVICE_ERROR'
  | 'INTERNAL_ERROR';
