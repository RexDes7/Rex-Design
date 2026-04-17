-- ============================================================================
-- Initial Database Schema Migration
-- ============================================================================
-- This migration creates all tables for the admin panel including:
-- - User management (users, sessions)
-- - Content management (projects, site_content, contact_info)
-- - Image storage (images)
-- - Analytics (page_views, clicks, form_submissions)
-- - Logging (logs, archived_logs)
-- ============================================================================

-- ============================================================================
-- User Management Tables
-- ============================================================================

-- Users table (single admin user)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,
  last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index for session lookups by token
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);

-- Index for session expiration cleanup
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- ============================================================================
-- Content Management Tables
-- ============================================================================

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Веб-Дизайн', 'Брендинг', 'Типографика', 'UI/UX')),
  year TEXT NOT NULL,
  image TEXT NOT NULL,
  image_alt TEXT NOT NULL,
  wide INTEGER DEFAULT 0 CHECK (wide IN (0, 1)),
  featured INTEGER DEFAULT 0 CHECK (featured IN (0, 1)),
  display_order INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for ordering projects
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON projects(display_order);

-- Index for filtering featured projects
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);

-- Site content table (singleton - only one row with id=1)
CREATE TABLE IF NOT EXISTS site_content (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  about TEXT NOT NULL,
  manifesto JSON NOT NULL,
  skills JSON NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Contact info table (singleton - only one row with id=1)
CREATE TABLE IF NOT EXISTS contact_info (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  email TEXT NOT NULL,
  phone TEXT,
  social_links JSON NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- Image Management Tables
-- ============================================================================

-- Images table
CREATE TABLE IF NOT EXISTS images (
  id TEXT PRIMARY KEY,
  filename TEXT UNIQUE NOT NULL,
  original_name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('project', 'avatar', 'general')),
  size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for finding images by type
CREATE INDEX IF NOT EXISTS idx_images_type ON images(type);

-- Index for finding images by filename
CREATE INDEX IF NOT EXISTS idx_images_filename ON images(filename);

-- ============================================================================
-- Analytics Tables
-- ============================================================================

-- Page views table
CREATE TABLE IF NOT EXISTS page_views (
  id TEXT PRIMARY KEY,
  path TEXT NOT NULL,
  user_agent TEXT,
  session_id TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(path);
CREATE INDEX IF NOT EXISTS idx_page_views_timestamp ON page_views(timestamp);
CREATE INDEX IF NOT EXISTS idx_page_views_session ON page_views(session_id);

-- Clicks table
CREATE TABLE IF NOT EXISTS clicks (
  id TEXT PRIMARY KEY,
  element_id TEXT NOT NULL,
  element_type TEXT NOT NULL,
  path TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for click analytics
CREATE INDEX IF NOT EXISTS idx_clicks_element ON clicks(element_id);
CREATE INDEX IF NOT EXISTS idx_clicks_timestamp ON clicks(timestamp);
CREATE INDEX IF NOT EXISTS idx_clicks_path ON clicks(path);

-- Form submissions table
CREATE TABLE IF NOT EXISTS form_submissions (
  id TEXT PRIMARY KEY,
  form_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read INTEGER DEFAULT 0 CHECK (read IN (0, 1)),
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for submission queries
CREATE INDEX IF NOT EXISTS idx_submissions_timestamp ON form_submissions(timestamp);
CREATE INDEX IF NOT EXISTS idx_submissions_read ON form_submissions(read);
CREATE INDEX IF NOT EXISTS idx_submissions_form_id ON form_submissions(form_id);

-- ============================================================================
-- Logging Tables
-- ============================================================================

-- Logs table
CREATE TABLE IF NOT EXISTS logs (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('admin_action', 'system_error', 'security_event')),
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  message TEXT NOT NULL,
  details JSON,
  user_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Indexes for log queries
CREATE INDEX IF NOT EXISTS idx_logs_type ON logs(type);
CREATE INDEX IF NOT EXISTS idx_logs_severity ON logs(severity);
CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_logs_user_id ON logs(user_id);

-- Archived logs table (for logs older than 90 days)
CREATE TABLE IF NOT EXISTS archived_logs (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('admin_action', 'system_error', 'security_event')),
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  message TEXT NOT NULL,
  details JSON,
  user_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  timestamp DATETIME NOT NULL,
  archived_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for archived log queries
CREATE INDEX IF NOT EXISTS idx_archived_logs_timestamp ON archived_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_archived_logs_archived_at ON archived_logs(archived_at);

-- ============================================================================
-- Triggers
-- ============================================================================

-- Trigger to update updated_at timestamp on projects
CREATE TRIGGER IF NOT EXISTS update_projects_timestamp
AFTER UPDATE ON projects
FOR EACH ROW
BEGIN
  UPDATE projects SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger to update updated_at timestamp on site_content
CREATE TRIGGER IF NOT EXISTS update_site_content_timestamp
AFTER UPDATE ON site_content
FOR EACH ROW
BEGIN
  UPDATE site_content SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger to update updated_at timestamp on contact_info
CREATE TRIGGER IF NOT EXISTS update_contact_info_timestamp
AFTER UPDATE ON contact_info
FOR EACH ROW
BEGIN
  UPDATE contact_info SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger to update last_activity on sessions
CREATE TRIGGER IF NOT EXISTS update_session_activity
AFTER UPDATE ON sessions
FOR EACH ROW
WHEN NEW.last_activity = OLD.last_activity
BEGIN
  UPDATE sessions SET last_activity = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- ============================================================================
-- Initial Data Seeding
-- ============================================================================

-- Insert default site content (will be populated from existing data.ts)
INSERT OR IGNORE INTO site_content (id, about, manifesto, skills)
VALUES (
  1,
  '',
  '[]',
  '[]'
);

-- Insert default contact info (will be populated from existing data.ts)
INSERT OR IGNORE INTO contact_info (id, email, phone, social_links)
VALUES (
  1,
  'baracuda.max1@gmail.com',
  NULL,
  '[]'
);

-- ============================================================================
-- End of Migration
-- ============================================================================
