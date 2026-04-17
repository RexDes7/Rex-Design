/**
 * Image Upload API Endpoint
 * 
 * POST /api/admin/images - Upload new image
 * DELETE /api/admin/images - Delete image
 * 
 * Requirements: 3.1, 3.2, 3.5
 */

import { NextRequest, NextResponse } from 'next/server';
import { imageService } from '@/lib/services/image.service';
import { loggerService } from '@/lib/services/logger.service';
import type { ImageType } from '@/lib/db/schema';
import { validateCSRFFromRequest, createCSRFErrorResponse } from '@/lib/utils/csrf';

// ============================================================================
// POST - Upload Image
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // Validate CSRF token (Requirement 11.2)
    if (!validateCSRFFromRequest(request)) {
      return createCSRFErrorResponse();
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = (formData.get('type') as ImageType) || 'general';

    // Validate file presence
    if (!file) {
      return NextResponse.json(
        { error: { code: 'MISSING_FILE', message: 'No file provided' } },
        { status: 400 }
      );
    }

    // Validate type
    const validTypes: ImageType[] = ['project', 'avatar', 'general'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { 
          error: { 
            code: 'INVALID_TYPE', 
            message: `Invalid image type. Allowed types: ${validTypes.join(', ')}` 
          } 
        },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload image using service
    const result = await imageService.uploadImage(
      buffer,
      file.name,
      file.type,
      type
    );

    // Log the upload action
    await loggerService.logAdminAction({
      userId: 'admin', // TODO: Get from session
      action: 'upload_image',
      resource: 'image',
      resourceId: result.filename,
      details: {
        filename: result.filename,
        type,
        size: result.size,
        dimensions: `${result.width}x${result.height}`,
      },
      timestamp: new Date(),
    });

    // Return success response
    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    // Log error
    await loggerService.logSystemError({
      message: error instanceof Error ? error.message : 'Unknown error during image upload',
      stack: error instanceof Error ? error.stack : undefined,
      context: {
        endpoint: '/api/admin/images',
        method: 'POST',
      },
      timestamp: new Date(),
    });

    // Return error response
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
    const statusCode = errorMessage.includes('Invalid file format') || 
                       errorMessage.includes('File size exceeds') ? 400 : 500;

    return NextResponse.json(
      {
        error: {
          code: statusCode === 400 ? 'VALIDATION_ERROR' : 'UPLOAD_FAILED',
          message: errorMessage,
          timestamp: new Date().toISOString(),
        },
      },
      { status: statusCode }
    );
  }
}

// ============================================================================
// DELETE - Delete Image
// ============================================================================

export async function DELETE(request: NextRequest) {
  try {
    // Validate CSRF token (Requirement 11.2)
    if (!validateCSRFFromRequest(request)) {
      return createCSRFErrorResponse();
    }

    // Get filename from query params
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    // Validate filename
    if (!filename) {
      return NextResponse.json(
        { error: { code: 'MISSING_FILENAME', message: 'No filename provided' } },
        { status: 400 }
      );
    }

    // Delete image using service
    await imageService.deleteImage(filename);

    // Log the delete action
    await loggerService.logAdminAction({
      userId: 'admin', // TODO: Get from session
      action: 'delete_image',
      resource: 'image',
      resourceId: filename,
      details: {
        filename,
      },
      timestamp: new Date(),
    });

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    });

  } catch (error) {
    // Log error
    await loggerService.logSystemError({
      message: error instanceof Error ? error.message : 'Unknown error during image deletion',
      stack: error instanceof Error ? error.stack : undefined,
      context: {
        endpoint: '/api/admin/images',
        method: 'DELETE',
      },
      timestamp: new Date(),
    });

    // Return error response
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete image';
    const statusCode = errorMessage.includes('not found') ? 404 : 500;

    return NextResponse.json(
      {
        error: {
          code: statusCode === 404 ? 'IMAGE_NOT_FOUND' : 'DELETE_FAILED',
          message: errorMessage,
          timestamp: new Date().toISOString(),
        },
      },
      { status: statusCode }
    );
  }
}
