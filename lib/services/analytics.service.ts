/**
 * Analytics Service
 * 
 * Service for tracking and querying analytics data including page views,
 * clicks, and form submissions. Provides aggregation and reporting capabilities.
 * 
 * Requirements: 5.1-5.7, 6.1-6.5, 7.1-7.5
 */

import { randomUUID } from 'crypto';
import { getDatabase } from '../db/client';
import type {
  PageView,
  Click,
  FormSubmission,
  AnalyticsFilter,
  PageViewStats,
  ClickStats,
  SubmissionStats,
  PageRanking,
} from '../db/schema';
import type {
  PageViewData,
  ClickData,
  SubmissionData,
  AnalyticsService as IAnalyticsService,
} from '../types/analytics';

/**
 * Track a page view event
 * 
 * @param data - Page view data including path, user agent, session ID
 * @returns Promise that resolves when the event is recorded
 * 
 * **Validates: Requirements 5.1, 5.2**
 */
export async function trackPageView(data: PageViewData): Promise<void> {
  const db = getDatabase();
  
  const stmt = db.prepare(`
    INSERT INTO page_views (id, path, user_agent, session_id, timestamp)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    randomUUID(),
    data.path,
    data.userAgent || null,
    data.sessionId || null,
    data.timestamp.toISOString()
  );
}

/**
 * Track a click event
 * 
 * @param data - Click data including element ID, type, and path
 * @returns Promise that resolves when the event is recorded
 * 
 * **Validates: Requirements 6.1, 6.2**
 */
export async function trackClick(data: ClickData): Promise<void> {
  const db = getDatabase();
  
  const stmt = db.prepare(`
    INSERT INTO clicks (id, element_id, element_type, path, timestamp)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    randomUUID(),
    data.elementId,
    data.elementType,
    data.path,
    data.timestamp.toISOString()
  );
}

/**
 * Track a form submission event
 * 
 * @param data - Submission data including form ID, name, email, message
 * @returns Promise that resolves when the event is recorded
 * 
 * **Validates: Requirements 7.1, 7.5**
 */
export async function trackSubmission(data: SubmissionData): Promise<void> {
  const db = getDatabase();
  
  const stmt = db.prepare(`
    INSERT INTO form_submissions (id, form_id, name, email, message, read, timestamp)
    VALUES (?, ?, ?, ?, ?, 0, ?)
  `);
  
  stmt.run(
    randomUUID(),
    data.formId,
    data.name,
    data.email,
    data.message,
    data.timestamp.toISOString()
  );
}

/**
 * Get page view statistics with optional filtering and grouping
 * 
 * @param filter - Filter options including date range, path, and grouping
 * @returns Page view statistics including total, unique visitors, and time series
 * 
 * **Validates: Requirements 5.3, 5.4, 5.5, 5.6**
 */
export async function getPageViews(filter: AnalyticsFilter): Promise<PageViewStats> {
  const db = getDatabase();
  
  // Build WHERE clause
  const conditions: string[] = [];
  const params: any[] = [];
  
  if (filter.startDate) {
    conditions.push('timestamp >= ?');
    params.push(filter.startDate.toISOString());
  }
  
  if (filter.endDate) {
    conditions.push('timestamp <= ?');
    params.push(filter.endDate.toISOString());
  }
  
  if (filter.path) {
    conditions.push('path = ?');
    params.push(filter.path);
  }
  
  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  
  // Get total count
  const totalStmt = db.prepare(`
    SELECT COUNT(*) as count
    FROM page_views
    ${whereClause}
  `);
  const totalResult = totalStmt.get(params) as { count: number };
  const total = totalResult.count;
  
  // Get unique visitors count
  const uniqueStmt = db.prepare(`
    SELECT COUNT(DISTINCT session_id) as count
    FROM page_views
    ${whereClause}
    AND session_id IS NOT NULL
  `);
  const uniqueResult = uniqueStmt.get(params) as { count: number };
  const unique = uniqueResult.count;
  
  // Get time series data if groupBy is specified
  let byPeriod: { period: string; count: number }[] = [];
  
  if (filter.groupBy) {
    const groupFormat = getDateFormat(filter.groupBy);
    const stmt = db.prepare(`
      SELECT 
        strftime('${groupFormat}', timestamp) as period,
        COUNT(*) as count
      FROM page_views
      ${whereClause}
      GROUP BY period
      ORDER BY period ASC
    `);
    byPeriod = stmt.all(params) as { period: string; count: number }[];
  }
  
  return {
    total,
    unique,
    byPeriod,
  };
}

/**
 * Get click statistics with optional filtering and grouping
 * 
 * @param filter - Filter options including date range and grouping
 * @returns Click statistics including total, by element, and time series
 * 
 * **Validates: Requirements 6.3, 6.5**
 */
export async function getClicks(filter: AnalyticsFilter): Promise<ClickStats> {
  const db = getDatabase();
  
  // Build WHERE clause
  const conditions: string[] = [];
  const params: any[] = [];
  
  if (filter.startDate) {
    conditions.push('timestamp >= ?');
    params.push(filter.startDate.toISOString());
  }
  
  if (filter.endDate) {
    conditions.push('timestamp <= ?');
    params.push(filter.endDate.toISOString());
  }
  
  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  
  // Get total count
  const totalStmt = db.prepare(`
    SELECT COUNT(*) as count
    FROM clicks
    ${whereClause}
  `);
  const totalResult = totalStmt.get(params) as { count: number };
  const total = totalResult.count;
  
  // Get clicks by element
  const byElementStmt = db.prepare(`
    SELECT 
      element_id as elementId,
      COUNT(*) as count
    FROM clicks
    ${whereClause}
    GROUP BY element_id
    ORDER BY count DESC
  `);
  const byElement = byElementStmt.all(params) as { elementId: string; count: number }[];
  
  // Get time series data if groupBy is specified
  let byPeriod: { period: string; count: number }[] = [];
  
  if (filter.groupBy) {
    const groupFormat = getDateFormat(filter.groupBy);
    const stmt = db.prepare(`
      SELECT 
        strftime('${groupFormat}', timestamp) as period,
        COUNT(*) as count
      FROM clicks
      ${whereClause}
      GROUP BY period
      ORDER BY period ASC
    `);
    byPeriod = stmt.all(params) as { period: string; count: number }[];
  }
  
  return {
    total,
    byElement,
    byPeriod,
  };
}

/**
 * Get form submission statistics with optional filtering and grouping
 * 
 * @param filter - Filter options including date range and grouping
 * @returns Submission statistics including total, time series, and recent submissions
 * 
 * **Validates: Requirements 7.2, 7.3, 7.6**
 */
export async function getSubmissions(filter: AnalyticsFilter): Promise<SubmissionStats> {
  const db = getDatabase();
  
  // Build WHERE clause
  const conditions: string[] = [];
  const params: any[] = [];
  
  if (filter.startDate) {
    conditions.push('timestamp >= ?');
    params.push(filter.startDate.toISOString());
  }
  
  if (filter.endDate) {
    conditions.push('timestamp <= ?');
    params.push(filter.endDate.toISOString());
  }
  
  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  
  // Get total count
  const totalStmt = db.prepare(`
    SELECT COUNT(*) as count
    FROM form_submissions
    ${whereClause}
  `);
  const totalResult = totalStmt.get(params) as { count: number };
  const total = totalResult.count;
  
  // Get time series data if groupBy is specified
  let byPeriod: { period: string; count: number }[] = [];
  
  if (filter.groupBy) {
    const groupFormat = getDateFormat(filter.groupBy);
    const stmt = db.prepare(`
      SELECT 
        strftime('${groupFormat}', timestamp) as period,
        COUNT(*) as count
      FROM form_submissions
      ${whereClause}
      GROUP BY period
      ORDER BY period ASC
    `);
    byPeriod = stmt.all(params) as { period: string; count: number }[];
  }
  
  // Get recent submissions (last 10)
  const recentStmt = db.prepare(`
    SELECT *
    FROM form_submissions
    ${whereClause}
    ORDER BY timestamp DESC
    LIMIT 10
  `);
  const recent = recentStmt.all(params) as FormSubmission[];
  
  return {
    total,
    byPeriod,
    recent,
  };
}

/**
 * Get unique visitors count for a given period
 * 
 * @param filter - Filter options including date range
 * @returns Number of unique visitors (distinct session IDs)
 * 
 * **Validates: Requirements 5.6**
 */
export async function getUniqueVisitors(filter: AnalyticsFilter): Promise<number> {
  const db = getDatabase();
  
  const conditions: string[] = ['session_id IS NOT NULL'];
  const params: any[] = [];
  
  if (filter.startDate) {
    conditions.push('timestamp >= ?');
    params.push(filter.startDate.toISOString());
  }
  
  if (filter.endDate) {
    conditions.push('timestamp <= ?');
    params.push(filter.endDate.toISOString());
  }
  
  const whereClause = `WHERE ${conditions.join(' AND ')}`;
  
  const stmt = db.prepare(`
    SELECT COUNT(DISTINCT session_id) as count
    FROM page_views
    ${whereClause}
  `);
  
  const result = stmt.get(params) as { count: number };
  return result.count;
}

/**
 * Get top pages by view count
 * 
 * @param limit - Maximum number of pages to return
 * @returns Array of pages with their view counts, sorted descending
 * 
 * **Validates: Requirements 5.7**
 */
export async function getTopPages(limit: number): Promise<PageRanking[]> {
  const db = getDatabase();
  
  const stmt = db.prepare(`
    SELECT 
      path,
      COUNT(*) as views
    FROM page_views
    GROUP BY path
    ORDER BY views DESC
    LIMIT ?
  `);
  
  return stmt.all(limit) as PageRanking[];
}

/**
 * Calculate click-through rate for a specific element
 * 
 * CTR = (clicks / impressions) * 100
 * Note: Impressions are approximated by page views on the same path
 * 
 * @param elementId - ID of the element to calculate CTR for
 * @returns Click-through rate as a percentage
 * 
 * **Validates: Requirements 6.4**
 */
export async function getClickThroughRate(elementId: string): Promise<number> {
  const db = getDatabase();
  
  // Get total clicks for this element
  const clicksStmt = db.prepare(`
    SELECT COUNT(*) as count
    FROM clicks
    WHERE element_id = ?
  `);
  const clicksResult = clicksStmt.get(elementId) as { count: number };
  const clicks = clicksResult.count;
  
  // Get paths where this element was clicked
  const pathsStmt = db.prepare(`
    SELECT DISTINCT path
    FROM clicks
    WHERE element_id = ?
  `);
  const paths = pathsStmt.all(elementId) as { path: string }[];
  
  if (paths.length === 0) {
    return 0;
  }
  
  // Get total page views for these paths (impressions)
  const placeholders = paths.map(() => '?').join(',');
  const impressionsStmt = db.prepare(`
    SELECT COUNT(*) as count
    FROM page_views
    WHERE path IN (${placeholders})
  `);
  const impressionsResult = impressionsStmt.get(paths.map(p => p.path)) as { count: number };
  const impressions = impressionsResult.count;
  
  if (impressions === 0) {
    return 0;
  }
  
  return (clicks / impressions) * 100;
}

/**
 * Calculate conversion rate for a given period
 * 
 * Conversion rate = (form submissions / page views) * 100
 * 
 * @param filter - Filter options including date range
 * @returns Conversion rate as a percentage
 * 
 * **Validates: Requirements 7.4**
 */
export async function getConversionRate(filter: AnalyticsFilter): Promise<number> {
  const db = getDatabase();
  
  const conditions: string[] = [];
  const params: any[] = [];
  
  if (filter.startDate) {
    conditions.push('timestamp >= ?');
    params.push(filter.startDate.toISOString());
  }
  
  if (filter.endDate) {
    conditions.push('timestamp <= ?');
    params.push(filter.endDate.toISOString());
  }
  
  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  
  // Get total page views
  const pageViewsStmt = db.prepare(`
    SELECT COUNT(*) as count
    FROM page_views
    ${whereClause}
  `);
  const pageViewsResult = pageViewsStmt.get(params) as { count: number };
  const pageViews = pageViewsResult.count;
  
  // Get total submissions
  const submissionsStmt = db.prepare(`
    SELECT COUNT(*) as count
    FROM form_submissions
    ${whereClause}
  `);
  const submissionsResult = submissionsStmt.get(params) as { count: number };
  const submissions = submissionsResult.count;
  
  if (pageViews === 0) {
    return 0;
  }
  
  return (submissions / pageViews) * 100;
}

/**
 * Mark a form submission as read or unread
 * 
 * @param submissionId - ID of the submission to update
 * @param read - Whether the submission should be marked as read
 * @returns Promise that resolves when the update is complete
 * 
 * **Validates: Requirements 7.7**
 */
export async function markSubmissionAsRead(submissionId: string, read: boolean): Promise<void> {
  const db = getDatabase();
  
  const stmt = db.prepare(`
    UPDATE form_submissions
    SET read = ?
    WHERE id = ?
  `);
  
  stmt.run(read ? 1 : 0, submissionId);
}

/**
 * Helper function to get SQLite date format string based on grouping
 */
function getDateFormat(groupBy: 'day' | 'week' | 'month'): string {
  switch (groupBy) {
    case 'day':
      return '%Y-%m-%d';
    case 'week':
      return '%Y-W%W';
    case 'month':
      return '%Y-%m';
    default:
      return '%Y-%m-%d';
  }
}

// Export service object
export const analyticsService: IAnalyticsService = {
  trackPageView,
  trackClick,
  trackSubmission,
  getPageViews,
  getClicks,
  getSubmissions,
  getUniqueVisitors,
  getTopPages,
  getClickThroughRate,
  getConversionRate,
};

export default analyticsService;
