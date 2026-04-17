/**
 * Page Views Analytics API Endpoint
 * 
 * GET /api/admin/analytics/pageviews
 * 
 * Returns page view statistics with optional filtering and grouping.
 * 
 * Query parameters:
 * - startDate: ISO date string (optional)
 * - endDate: ISO date string (optional)
 * - path: specific path to filter (optional)
 * - groupBy: 'day' | 'week' | 'month' (optional)
 * 
 * Requirements: 5.3, 5.4, 5.5, 5.6, 5.7
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPageViews, getUniqueVisitors, getTopPages } from '@/lib/services/analytics.service';
import type { AnalyticsFilter } from '@/lib/db/schema';
import { verifyAuth, unauthorizedResponse } from '@/lib/utils/auth-helper';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const user = verifyAuth(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const { searchParams } = new URL(request.url);
    
    // Build filter from query parameters
    const filter: AnalyticsFilter = {};
    
    const startDate = searchParams.get('startDate');
    if (startDate) {
      filter.startDate = new Date(startDate);
    }
    
    const endDate = searchParams.get('endDate');
    if (endDate) {
      filter.endDate = new Date(endDate);
    }
    
    const path = searchParams.get('path');
    if (path) {
      filter.path = path;
    }
    
    const groupBy = searchParams.get('groupBy');
    if (groupBy && (groupBy === 'day' || groupBy === 'week' || groupBy === 'month')) {
      filter.groupBy = groupBy;
    }
    
    // Get page view statistics
    const stats = await getPageViews(filter);
    
    // Get unique visitors
    const uniqueVisitors = await getUniqueVisitors(filter);
    
    // Get top pages (limit to 10)
    const topPages = await getTopPages(10);
    
    return NextResponse.json({
      stats,
      uniqueVisitors,
      topPages,
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching page view analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch page view analytics' },
      { status: 500 }
    );
  }
}
