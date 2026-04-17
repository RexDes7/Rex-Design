/**
 * Authentication Helper for API Routes
 * 
 * Provides utility functions to verify authentication in API routes
 */

import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

export interface AuthUser {
  sessionId: string;
  userId: string;
  email: string;
}

/**
 * Verify authentication token from request
 * Checks both cookies and Authorization header
 */
export function verifyAuth(request: NextRequest): AuthUser | null {
  try {
    // Try to get token from cookie first
    let token = request.cookies.get('auth-token')?.value;
    
    // If no cookie, try Authorization header
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    
    if (!token) {
      return null;
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      sessionId: string;
      userId: string;
      email: string;
      exp: number;
    };
    
    return {
      sessionId: decoded.sessionId,
      userId: decoded.userId,
      email: decoded.email
    };
  } catch (error) {
    return null;
  }
}

/**
 * Create unauthorized response
 */
export function unauthorizedResponse() {
  return Response.json(
    { error: 'Unauthorized' },
    { status: 401 }
  );
}
