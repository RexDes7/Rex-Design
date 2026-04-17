/**
 * Log Archive API Route
 * 
 * Provides endpoints for manual log archiving and cron job management.
 * 
 * POST /api/admin/logs/archive - Manually archive old logs
 * GET /api/admin/logs/archive - Get archive status
 */

import { NextRequest, NextResponse } from 'next/server';
import { loggerService } from '@/lib/services/logger.service';
import { cronScheduler } from '@/lib/utils/cron';

/**
 * POST - Manually trigger log archiving
 * 
 * Archives logs older than the specified number of days (default: 90)
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json().catch(() => ({}));
    const daysOld = body.daysOld || 90;

    // Calculate cutoff date
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    // Archive logs
    const archivedCount = await loggerService.archiveLogs(cutoffDate);

    // Log the action
    await loggerService.logAdminAction({
      userId: 'admin', // TODO: Get from session
      action: 'archive_logs',
      resource: 'logs',
      details: {
        daysOld,
        cutoffDate: cutoffDate.toISOString(),
        archivedCount
      },
      timestamp: new Date()
    });

    return NextResponse.json({
      success: true,
      archivedCount,
      cutoffDate: cutoffDate.toISOString(),
      message: `Successfully archived ${archivedCount} logs older than ${daysOld} days`
    });
  } catch (error) {
    console.error('Error archiving logs:', error);

    // Log the error
    await loggerService.logSystemError({
      message: 'Failed to archive logs',
      stack: error instanceof Error ? error.stack : undefined,
      context: { error: String(error) },
      timestamp: new Date()
    });

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to archive logs',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

/**
 * GET - Get archive status and cron job information
 */
export async function GET(request: NextRequest) {
  try {
    // Get cron scheduler status
    const cronStatus = cronScheduler.getStatus();

    // Get log counts
    const allLogs = await loggerService.getLogs({});
    const oldLogs = await loggerService.getLogs({
      endDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    });

    return NextResponse.json({
      success: true,
      cron: cronStatus,
      stats: {
        totalLogs: allLogs.length,
        logsOlderThan90Days: oldLogs.length
      }
    });
  } catch (error) {
    console.error('Error getting archive status:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get archive status',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

