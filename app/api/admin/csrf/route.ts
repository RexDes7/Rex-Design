/**
 * CSRF Token API Endpoint
 * 
 * GET /api/admin/csrf
 * 
 * Generates and returns a CSRF token for form submissions.
 * The token is stored in the session for validation.
 * 
 * Requirements: 11.2
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateCSRFToken } from '@/lib/utils/csrf';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Generate CSRF token
    const csrfToken = generateCSRFToken();
    
    // Create response
    const response = NextResponse.json({
      success: true,
      token: csrfToken,
    });
    
    // Store token in HTTP-only cookie for validation
    response.cookies.set('csrf-token', csrfToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Error generating CSRF token:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'CSRF_GENERATION_ERROR',
          message: 'Failed to generate CSRF token',
        },
      },
      { status: 500 }
    );
  }
}
