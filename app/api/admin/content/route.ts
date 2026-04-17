import { NextRequest, NextResponse } from 'next/server';
import { contentService } from '@/lib/services/content.service';
import { LoggerServiceImpl } from '@/lib/services/logger.service';
import type { AdminAction } from '@/lib/types/logger';
import { validateCSRFFromRequest, createCSRFErrorResponse } from '@/lib/utils/csrf';
import { sanitizeObject, isValidEmail } from '@/lib/utils/validation';

const logger = new LoggerServiceImpl();

/**
 * GET /api/admin/content
 * 
 * Get site content and contact info
 * 
 * Query parameters:
 * - type: 'site' | 'contact' (optional, returns both if not specified)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    if (type === 'contact') {
      const contactInfo = await contentService.getContactInfo();
      
      if (!contactInfo) {
        return NextResponse.json(
          { success: false, error: 'Contact info not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ success: true, data: contactInfo });
    }
    
    // Return contact info by default
    const contactInfo = await contentService.getContactInfo();
    
    if (!contactInfo) {
      return NextResponse.json(
        { success: false, error: 'Content not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: contactInfo });
  } catch (error) {
    console.error('Error fetching content:', error);
    
    await logger.logSystemError({
      message: 'Failed to fetch content',
      stack: error instanceof Error ? error.stack : undefined,
      context: { error: String(error) },
      timestamp: new Date(),
    });
    
    return NextResponse.json(
      { success: false, error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/content
 * 
 * Update site content or contact info
 * 
 * Body:
 * - type: 'site' | 'contact' (required)
 * - data: UpdateSiteContentInput | UpdateContactInfoInput (required)
 * 
 * Requirements: 11.2 (CSRF protection)
 */
export async function PUT(request: NextRequest) {
  try {
    // Validate CSRF token (Requirement 11.2)
    if (!validateCSRFFromRequest(request)) {
      return createCSRFErrorResponse();
    }

    const body = await request.json();
    const data = body;
    
    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Missing required data' },
        { status: 400 }
      );
    }
    
    // Get user ID from session
    const userId = request.headers.get('x-user-id') || 'admin';
    
    // Validate and sanitize contact info
    const sanitizedData = sanitizeObject(data);
    
    // Validate email format if provided
    if (sanitizedData.email !== undefined) {
      if (typeof sanitizedData.email !== 'string') {
        return NextResponse.json(
          { success: false, error: 'Invalid email field: must be a string' },
          { status: 400 }
        );
      }
      
      if (!isValidEmail(sanitizedData.email)) {
        return NextResponse.json(
          { success: false, error: 'Invalid email format' },
          { status: 400 }
        );
      }
    }
    
    try {
      await contentService.updateContactInfo(sanitizedData);
      
      // Log the action
      const action: AdminAction = {
        userId,
        action: 'update_contact_info',
        resource: 'contact_info',
        resourceId: '1',
        details: {
          fields: Object.keys(sanitizedData),
        },
        timestamp: new Date(),
      };
      
      await logger.logAdminAction(action);
      
      const updated = await contentService.getContactInfo();
      
      return NextResponse.json({ success: true, data: updated });
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid email format') {
        return NextResponse.json(
          { success: false, error: 'Invalid email format' },
          { status: 400 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('Error updating content:', error);
    
    await logger.logSystemError({
      message: 'Failed to update content',
      stack: error instanceof Error ? error.stack : undefined,
      context: { error: String(error) },
      timestamp: new Date(),
    });
    
    return NextResponse.json(
      { success: false, error: 'Failed to update content' },
      { status: 500 }
    );
  }
}

