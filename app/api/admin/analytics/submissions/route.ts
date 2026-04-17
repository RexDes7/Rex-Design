/**
 * Form Submissions Analytics API Endpoint
 * 
 * GET /api/admin/analytics/submissions
 * 
 * Returns form submission statistics with optional filtering and grouping.
 * Also supports marking submissions as read/unread.
 * 
 * Query parameters (GET):
 * - startDate: ISO date string (optional)
 * - endDate: ISO date string (optional)
 * - groupBy: 'day' | 'week' | 'month' (optional)
 * 
 * Body (PATCH):
 * - submissionId: ID of submission to update
 * - read: boolean
 * 
 * Requirements: 7.2, 7.3, 7.4, 7.6, 7.7
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSubmissions, getConversionRate, markSubmissionAsRead } from '@/lib/services/analytics.service';
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
    
    // Get submission statistics
    const stats = await getSubmissions(filter);
    
    // Get conversion rate
    const conversionRate = await getConversionRate(filter);
    
    return NextResponse.json({
      stats,
      conversionRate,
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching submission analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submission analytics' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.submissionId || typeof body.submissionId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing submissionId' },
        { status: 400 }
      );
    }
    
    if (typeof body.read !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid or missing read status' },
        { status: 400 }
      );
    }
    
    // Update submission read status
    await markSubmissionAsRead(body.submissionId, body.read);
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    );
  }
}
