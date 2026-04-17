/**
 * Projects Reorder API Route
 * 
 * Handles reordering of projects via drag-and-drop.
 * 
 * Requirement: 2.9
 */

import { NextRequest, NextResponse } from 'next/server';
import { contentService } from '@/lib/services/content.service';
import { loggerService } from '@/lib/services/logger.service';

/**
 * POST /api/admin/projects/reorder
 * Reorder projects
 * Requirement 2.9: Support reordering Projects via drag-and-drop
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order } = body;

    // Validate input
    if (!Array.isArray(order) || order.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Order must be a non-empty array of project IDs',
          },
        },
        { status: 400 }
      );
    }

    // Reorder projects
    await contentService.reorderProjects(order);

    // Log admin action
    try {
      await loggerService.logAdminAction({
        userId: 'admin', // TODO: Get from session
        action: 'update_project',
        resource: 'project',
        resourceId: 'multiple',
        details: {
          action: 'reorder',
          count: order.length,
        },
        timestamp: new Date(),
      });
    } catch (logError) {
      // Don't fail the request if logging fails
      console.error('Failed to log admin action:', logError);
    }

    return NextResponse.json({
      success: true,
      message: 'Projects reordered successfully',
    });
  } catch (error) {
    console.error('Error reordering projects:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'REORDER_ERROR',
          message: 'Failed to reorder projects',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}
