/**
 * Admin Backup List API Endpoint
 * 
 * GET /api/admin/backup/list - List all available backups
 * 
 * Returns a list of all backups sorted by date (newest first).
 * Includes metadata such as size, timestamp, and backup details.
 * 
 * Requirements: 12.6
 */

import { NextRequest, NextResponse } from 'next/server';
import { listBackups } from '@/lib/utils/backup';

export async function GET(request: NextRequest) {
  try {
    // Get list of backups
    const backups = await listBackups();

    return NextResponse.json({
      success: true,
      backups: backups.map(backup => ({
        timestamp: backup.timestamp,
        date: backup.date,
        size: backup.size,
        databaseSize: backup.metadata.databaseSize,
        imagesSize: backup.metadata.imagesSize,
        version: backup.metadata.version
      })),
      count: backups.length
    });
  } catch (error) {
    console.error('Error listing backups:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to list backups',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
