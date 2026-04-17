/**
 * Analytics Service Types
 * 
 * Type definitions for analytics tracking and reporting services.
 */

import type {
  PageView,
  Click,
  FormSubmission,
  AnalyticsFilter,
  PageViewStats,
  ClickStats,
  SubmissionStats,
  PageRanking
} from '../db/schema';

// ============================================================================
// Analytics Service Interface
// ============================================================================

export interface AnalyticsService {
  // Track events
  trackPageView(data: PageViewData): Promise<void>;
  trackClick(data: ClickData): Promise<void>;
  trackSubmission(data: SubmissionData): Promise<void>;
  
  // Query analytics
  getPageViews(filter: AnalyticsFilter): Promise<PageViewStats>;
  getClicks(filter: AnalyticsFilter): Promise<ClickStats>;
  getSubmissions(filter: AnalyticsFilter): Promise<SubmissionStats>;
  getUniqueVisitors(filter: AnalyticsFilter): Promise<number>;
  
  // Aggregations
  getTopPages(limit: number): Promise<PageRanking[]>;
  getClickThroughRate(elementId: string): Promise<number>;
  getConversionRate(filter: AnalyticsFilter): Promise<number>;
}

// ============================================================================
// Event Data Types
// ============================================================================

export interface PageViewData {
  path: string;
  userAgent: string;
  timestamp: Date;
  sessionId?: string;
}

export interface ClickData {
  elementId: string;
  elementType: string;
  path: string;
  timestamp: Date;
}

export interface SubmissionData {
  formId: string;
  name: string;
  email: string;
  message: string;
  timestamp: Date;
}

// ============================================================================
// Analytics Query Types
// ============================================================================

export interface AnalyticsQuery {
  startDate?: Date;
  endDate?: Date;
  path?: string;
  groupBy?: 'day' | 'week' | 'month';
  limit?: number;
  offset?: number;
}

export interface TimeSeriesData {
  period: string;
  count: number;
}

export interface ElementStats {
  elementId: string;
  elementType: string;
  clicks: number;
  impressions: number;
  ctr: number;
}

// ============================================================================
// Dashboard Statistics Types
// ============================================================================

export interface DashboardStats {
  totalProjects: number;
  pageViewsLast30Days: number;
  submissionsLast30Days: number;
  uniqueVisitorsLast30Days: number;
  topPages: PageRanking[];
  recentSubmissions: SubmissionWithDetails[];
  recentActivity: ActivityItem[];
}

export interface SubmissionWithDetails extends FormSubmission {
  isNew: boolean;
}

export interface ActivityItem {
  id: string;
  type: 'admin_action' | 'form_submission';
  description: string;
  timestamp: string;
  userId?: string;
  userEmail?: string;
}

// ============================================================================
// Analytics Report Types
// ============================================================================

export interface AnalyticsReport {
  period: {
    start: Date;
    end: Date;
  };
  pageViews: {
    total: number;
    unique: number;
    trend: TimeSeriesData[];
    topPages: PageRanking[];
  };
  clicks: {
    total: number;
    byElement: ElementStats[];
    trend: TimeSeriesData[];
  };
  submissions: {
    total: number;
    conversionRate: number;
    trend: TimeSeriesData[];
    recent: FormSubmission[];
  };
}

// ============================================================================
// Session Tracking Types
// ============================================================================

export interface SessionTracker {
  /**
   * Get or create session ID for tracking
   */
  getSessionId(): string;
  
  /**
   * Check if session is new
   */
  isNewSession(): boolean;
  
  /**
   * Update session activity
   */
  updateActivity(): void;
}

export interface SessionInfo {
  sessionId: string;
  startTime: Date;
  lastActivity: Date;
  pageViews: number;
  clicks: number;
}

// ============================================================================
// Event Tracking Configuration
// ============================================================================

export interface TrackingConfig {
  enabled: boolean;
  trackPageViews: boolean;
  trackClicks: boolean;
  trackSubmissions: boolean;
  excludePaths?: string[];
  sampleRate?: number; // 0-1, for sampling events
}

export interface TrackedElement {
  id: string;
  type: 'button' | 'link' | 'form' | 'navigation';
  label: string;
  category?: string;
}

// ============================================================================
// Analytics Aggregation Types
// ============================================================================

export interface AggregationOptions {
  groupBy: 'hour' | 'day' | 'week' | 'month' | 'year';
  timezone?: string;
  fillGaps?: boolean; // Fill missing periods with zero
}

export interface AggregatedData {
  period: string;
  metrics: {
    [key: string]: number;
  };
}

// ============================================================================
// Funnel Analysis Types
// ============================================================================

export interface FunnelStep {
  name: string;
  path?: string;
  eventType: 'pageview' | 'click' | 'submission';
  elementId?: string;
}

export interface FunnelAnalysis {
  steps: FunnelStep[];
  results: FunnelStepResult[];
  conversionRate: number;
}

export interface FunnelStepResult {
  step: FunnelStep;
  count: number;
  dropoffRate: number;
  conversionRate: number;
}

// ============================================================================
// Real-time Analytics Types
// ============================================================================

export interface RealtimeStats {
  activeUsers: number;
  pageViewsLastHour: number;
  clicksLastHour: number;
  submissionsLastHour: number;
  topPagesNow: PageRanking[];
}

export interface RealtimeEvent {
  type: 'pageview' | 'click' | 'submission';
  data: PageViewData | ClickData | SubmissionData;
  timestamp: Date;
}

// ============================================================================
// Export Types
// ============================================================================

export interface AnalyticsExport {
  format: 'json' | 'csv' | 'xlsx';
  data: any[];
  filename: string;
  generatedAt: Date;
}

export interface ExportOptions {
  format: 'json' | 'csv' | 'xlsx';
  dateRange: {
    start: Date;
    end: Date;
  };
  includePageViews?: boolean;
  includeClicks?: boolean;
  includeSubmissions?: boolean;
}
