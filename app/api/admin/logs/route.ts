/**
 * Admin Logs API Endpoint
 * 
 * GET /api/admin/logs - Retrieve logs with filtering and search
 * 
 * Query Parameters:
 * - startDate: ISO date string for filtering logs after this date
 * - endDate: ISO date string for filtering logs before this date
 * - type: Filter by log type (admin_action, system_error, security_event)
 * - severity: Filter by severity (info, warning, error, critical)
 * - search: Keyword search in message and details
 * 
 * Requirements: 8.4, 8.5, 8.6
 */

import { NextRequest, NextResponse } from 'next/server';
import { loggerService } from '@/lib/services/logger.service';
import type { LogType, LogSeverity } from '@/lib/db/schema';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse filter parameters
    const startDateStr = searchParams.get('startDate');
    const endDateStr = searchParams.get('endDate');
    const type = searchParams.get('type') as LogType | null;
    const severity = searchParams.get('severity') as LogSeverity | null;
    const search = searchParams.get('search');

    // Build filter object
    const filter: any = {};
    
    if (startDateStr) {
      filter.startDate = new Date(startDateStr);
    }
    
    if (endDateStr) {
      filter.endDate = new Date(endDateStr);
    }
    
    if (type) {
      filter.type = type;
    }
    
    if (severity) {
      filter.severity = severity;
    }

    // Get logs with filtering or search
    let logs;
    if (search) {
      logs = await loggerService.searchLogs(search, filter);
    } else {
      logs = await loggerService.getLogs(filter);
    }

    // Logs are already in reverse chronological order from the service
    return NextResponse.json({
      success: true,
      logs,
      count: logs.length
    });

  } catch (error) {
    console.error('Error fetching logs:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch logs',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
