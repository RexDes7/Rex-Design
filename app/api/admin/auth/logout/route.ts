/**
 * Admin Logout API Endpoint
 * 
 * POST /api/admin/auth/logout
 * 
 * Terminates the current session by removing it from the database
 * and clearing the auth cookie.
 * 
 * Requirements: 1.2, 1.4
 */

import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { loggerService } from '@/lib/services/logger.service';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  const requestId = randomUUID();
  
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value;
    
    if (token) {
      // Verify session to get user info for logging
      const session = await authService.verifySession(token);
      
      // Remove session from database
      await authService.logout(token);
      
      // Log logout action (Requirement 10.4, 8.1)
      if (session) {
        try {
          await loggerService.logAdminAction({
            userId: session.userId,
            action: 'logout',
            resource: 'session',
            resourceId: undefined,
            details: {
              email: session.email,
            },
            timestamp: new Date(),
          });
        } catch (logError) {
          // Don't fail logout if logging fails
          console.error('Failed to log logout action:', logError);
        }
      }
    }
    
    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: 'Logout successful'
      },
      { status: 200 }
    );
    
    // Clear the auth cookie
    response.cookies.delete('auth-token');
    
    return response;
  } catch (error) {
    console.error('Logout endpoint error:', error);
    
    // Even if there's an error, we should clear the cookie
    // and return success from the user's perspective
    const response = NextResponse.json(
      {
        success: true,
        message: 'Logout successful'
      },
      { status: 200 }
    );
    
    response.cookies.delete('auth-token');
    
    return response;
  }
}
