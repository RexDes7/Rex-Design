/**
 * Session Info API Endpoint
 * 
 * GET /api/admin/auth/session
 * 
 * Returns current session information including user email and session start time.
 * 
 * Requirements: 9.5
 */

import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NO_SESSION',
            message: 'No active session',
          },
        },
        { status: 401 }
      );
    }
    
    // Verify session
    const session = await authService.verifySession(token);
    
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_SESSION',
            message: 'Invalid or expired session',
          },
        },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: {
        email: session.email,
        sessionStart: session.createdAt.toISOString(),
        expiresAt: session.expiresAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Session endpoint error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SESSION_ERROR',
          message: 'Failed to get session information',
        },
      },
      { status: 500 }
    );
  }
}
