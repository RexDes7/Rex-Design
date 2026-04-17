/**
 * Admin Backup Restore API Endpoint
 * 
 * POST /api/admin/backup/restore - Restore from a backup
 * 
 * Restores the database and images from a specified backup.
 * Implements rollback on failure to prevent data loss.
 * 
 * Requirements: 12.6, 12.7
 */

import { NextRequest, NextResponse } from 'next/server';
import { restoreBackup } from '@/lib/utils/backup';
import { loggerService } from '@/lib/services/logger.service';
import { validateCSRFFromRequest, createCSRFErrorResponse } from '@/lib/utils/csrf';

export async function POST(request: NextRequest) {
  try {
    // Validate CSRF token (Requirement 11.2)
    if (!validateCSRFFromRequest(request)) {
      return createCSRFErrorResponse();
    }

    const body = await request.json();
    const { timestamp } = body;

    if (!timestamp) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required field: timestamp'
        },
        { status: 400 }
      );
    }

    // Restore backup
    const result = await restoreBackup(timestamp);

    if (result.success) {
      // Log successful restore
      await loggerService.logAdminAction({
        userId: 'admin', // TODO: Get from session
        action: 'restore_backup',
        resource: 'backup',
        resourceId: timestamp,
        details: {
          restoredFrom: result.restoredFrom
        },
        timestamp: new Date()
      });

      return NextResponse.json({
        success: true,
        restoredFrom: result.restoredFrom,
        message: 'Backup restored successfully'
      });
    } else {
      // Log failed restore
      await loggerService.logSystemError({
        message: `Backup restoration failed: ${result.error}`,
        context: { 
          timestamp,
          restoredFrom: result.restoredFrom 
        },
        timestamp: new Date()
      });

      return NextResponse.json(
        {
          success: false,
          error: 'Backup restoration failed',
          message: result.error
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error restoring backup:', error);

    // Log error
    await loggerService.logSystemError({
      message: 'Backup restoration error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date()
    });

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to restore backup',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
