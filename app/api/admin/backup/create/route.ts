/**
 * Admin Backup Create API Endpoint
 * 
 * POST /api/admin/backup/create - Create a manual backup
 * 
 * Creates a backup of the database and images directory.
 * Logs the backup operation for audit purposes.
 * 
 * Requirements: 12.6
 */

import { NextRequest, NextResponse } from 'next/server';
import { createBackup } from '@/lib/utils/backup';
import { loggerService } from '@/lib/services/logger.service';
import { validateCSRFFromRequest, createCSRFErrorResponse } from '@/lib/utils/csrf';

export async function POST(request: NextRequest) {
  try {
    // Validate CSRF token (Requirement 11.2)
    if (!validateCSRFFromRequest(request)) {
      return createCSRFErrorResponse();
    }

    // Create backup
    const result = await createBackup();

    if (result.success) {
      // Log successful backup
      await loggerService.logAdminAction({
        userId: 'admin', // TODO: Get from session
        action: 'create_backup',
        resource: 'backup',
        resourceId: result.metadata.timestamp,
        details: {
          size: result.metadata.totalSize,
          databaseSize: result.metadata.databaseSize,
          imagesSize: result.metadata.imagesSize,
          manual: true
        },
        timestamp: new Date()
      });

      return NextResponse.json({
        success: true,
        backup: {
          timestamp: result.metadata.timestamp,
          date: result.metadata.date,
          size: result.metadata.totalSize,
          databaseSize: result.metadata.databaseSize,
          imagesSize: result.metadata.imagesSize
        },
        message: 'Backup created successfully'
      });
    } else {
      // Log failed backup
      await loggerService.logSystemError({
        message: `Manual backup creation failed: ${result.error}`,
        context: { manual: true },
        timestamp: new Date()
      });

      return NextResponse.json(
        {
          success: false,
          error: 'Backup creation failed',
          message: result.error
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating backup:', error);

    // Log error
    await loggerService.logSystemError({
      message: 'Backup creation error',
      stack: error instanceof Error ? error.stack : undefined,
      context: { manual: true },
      timestamp: new Date()
    });

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create backup',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
