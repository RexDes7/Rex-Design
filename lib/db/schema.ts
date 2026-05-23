/**
 * Database Schema Types
 * 
 * TypeScript type definitions for all database tables in the admin panel.
 * These types match the SQL schema defined in migrations/001_initial.sql
 */

// ============================================================================
// User Management
// ============================================================================

export interface User {
  id: string;
  email: string;
  password_hash: string;
  created_at: string; // ISO 8601 datetime string
}

export interface Session {
  id: string;
  user_id: string;
  token: string;
  created_at: string; // ISO 8601 datetime string
  expires_at: string; // ISO 8601 datetime string
  last_activity: string; // ISO 8601 datetime string
}

// ============================================================================
// Content Management
// ============================================================================

export type ProjectCategory = 'Веб-Дизайн' | 'Брендинг' | 'Типографика' | 'UI/UX' | 'Инфографика' | 'Полиграфия' | 'Иллюстрация' | 'Анимация';

export interface Project {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  year: string;
  image: string;
  image_alt: string;
  wide: number; // SQLite boolean (0 or 1)
  featured: number; // SQLite boolean (0 or 1)
  display_order: number;
  created_at: string; // ISO 8601 datetime string
  updated_at: string; // ISO 8601 datetime string
}

export interface ManifestoPrinciple {
  title: string;
  description: string;
}

export interface Skill {
  name: string;
  level: number;
}

export interface SiteContent {
  id: number; // Always 1 (singleton)
  about: string;
  manifesto: string; // JSON string of ManifestoPrinciple[]
  skills: string; // JSON string of Skill[]
  updated_at: string; // ISO 8601 datetime string
}

export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

export interface ContactInfo {
  id: number; // Always 1 (singleton)
  email: string;
  phone: string | null;
  social_links: string; // JSON string of SocialLink[]
  updated_at: string; // ISO 8601 datetime string
}

// ============================================================================
// Image Management
// ============================================================================

export type ImageType = 'project' | 'avatar' | 'general';

export interface Image {
  id: string;
  filename: string;
  original_name: string;
  type: ImageType;
  size: number; // bytes
  mime_type: string;
  width: number;
  height: number;
  uploaded_at: string; // ISO 8601 datetime string
}

// ============================================================================
// Analytics
// ============================================================================

export interface PageView {
  id: string;
  path: string;
  user_agent: string | null;
  session_id: string | null;
  timestamp: string; // ISO 8601 datetime string
}

export interface Click {
  id: string;
  element_id: string;
  element_type: string;
  path: string;
  timestamp: string; // ISO 8601 datetime string
}

export interface FormSubmission {
  id: string;
  form_id: string;
  name: string;
  email: string;
  message: string;
  read: number; // SQLite boolean (0 or 1)
  timestamp: string; // ISO 8601 datetime string
}

// ============================================================================
// Logging
// ============================================================================

export type LogType = 'admin_action' | 'system_error' | 'security_event';
export type LogSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface Log {
  id: string;
  type: LogType;
  severity: LogSeverity;
  message: string;
  details: string | null; // JSON string
  user_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  timestamp: string; // ISO 8601 datetime string
}

export interface ArchivedLog {
  id: string;
  type: LogType;
  severity: LogSeverity;
  message: string;
  details: string | null; // JSON string
  user_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  timestamp: string; // ISO 8601 datetime string
  archived_at: string; // ISO 8601 datetime string
}

// ============================================================================
// Input Types (for creating/updating records)
// ============================================================================

export interface CreateProjectInput {
  title: string;
  description: string;
  category: ProjectCategory;
  year: string;
  image: string;
  image_alt: string;
  wide?: boolean;
  featured?: boolean;
}

export interface UpdateProjectInput extends Partial<CreateProjectInput> {}

export interface UpdateSiteContentInput {
  about?: string;
  manifesto?: ManifestoPrinciple[];
  skills?: Skill[];
}

export interface UpdateContactInfoInput {
  email?: string;
  phone?: string | null;
  social_links?: SocialLink[];
}

export interface CreateImageInput {
  filename: string;
  original_name: string;
  type: ImageType;
  size: number;
  mime_type: string;
  width: number;
  height: number;
}

export interface CreatePageViewInput {
  path: string;
  user_agent?: string;
  session_id?: string;
}

export interface CreateClickInput {
  element_id: string;
  element_type: string;
  path: string;
}

export interface CreateFormSubmissionInput {
  form_id: string;
  name: string;
  email: string;
  message: string;
}

export interface CreateLogInput {
  type: LogType;
  severity: LogSeverity;
  message: string;
  details?: Record<string, any>;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
}

// ============================================================================
// Query Filter Types
// ============================================================================

export interface AnalyticsFilter {
  startDate?: Date;
  endDate?: Date;
  path?: string;
  groupBy?: 'day' | 'week' | 'month';
}

export interface LogFilter {
  startDate?: Date;
  endDate?: Date;
  type?: LogType;
  severity?: LogSeverity;
  userId?: string;
}

// ============================================================================
// Result Types
// ============================================================================

export interface PageViewStats {
  total: number;
  unique: number;
  byPeriod: { period: string; count: number }[];
}

export interface ClickStats {
  total: number;
  byElement: { elementId: string; count: number }[];
  byPeriod: { period: string; count: number }[];
}

export interface SubmissionStats {
  total: number;
  byPeriod: { period: string; count: number }[];
  recent: FormSubmission[];
}

export interface PageRanking {
  path: string;
  views: number;
}
