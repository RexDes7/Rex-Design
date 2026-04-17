/**
 * Clicks Analytics API Endpoint
 * 
 * GET /api/admin/analytics/clicks
 * 
 * Returns click statistics with optional filtering and grouping.
 * 
 * Query parameters:
 * - startDate: ISO date string (optional)
 * - endDate: ISO date string (optional)
 * - groupBy: 'day' | 'week' | 'month' (optional)
 * - elementId: specific element to get CTR for (optional)
 * 
 * Requirements: 6.3, 6.4, 6.5
 */

import { NextRequest, NextResponse } from 'next/server';
import { getClicks, getClickThroughRate } from '@/lib/services/analytics.service';
import type { AnalyticsFilter } from '@/lib/db/schema';

export async function GET(request: NextRequest) {
  try {
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
    
    const groupBy = searchParams.get('groupBy');
    if (groupBy && (groupBy === 'day' || groupBy === 'week' || groupBy === 'month')) {
      filter.groupBy = groupBy;
    }
    
    // Get click statistics
    const stats = await getClicks(filter);
    
    // Get CTR for specific element if requested
    let ctr: number | undefined;
    const elementId = searchParams.get('elementId');
    if (elementId) {
      ctr = await getClickThroughRate(elementId);
    }
    
    return NextResponse.json({
      stats,
      ctr,
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching click analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch click analytics' },
      { status: 500 }
    );
  }
}
