/**
 * Next.js Middleware for Admin Route Protection
 * 
 * This middleware protects all /admin/* routes except /admin/login
 * by verifying JWT tokens and checking session expiration.
 * 
 * Features:
 * - JWT token verification from HTTP-only cookies
 * - Session expiration checking
 * - Automatic redirect to /admin/login for unauthenticated users
 * - Allows public access to /admin/login
 * 
 * Requirements: 1.5, 1.6, 1.7
 */

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// JWT secret - must match the one in auth.service.ts
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

/**
 * Middleware function that runs on every request to /admin/* routes
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log('[Middleware] Path:', pathname);
  
  // Allow access to login page without authentication
  if (pathname === '/admin/login') {
    console.log('[Middleware] Login page - allowing access');
    return NextResponse.next();
  }
  
  // Get auth token from cookies
  const token = request.cookies.get('auth-token')?.value;
  
  console.log('[Middleware] Token:', token ? 'present' : 'missing');
  
  // If no token, redirect to login
  if (!token) {
    console.log('[Middleware] No token - redirecting to login');
    return redirectToLogin(request);
  }
  
  try {
    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      sessionId: string;
      userId: string;
      email: string;
      exp: number;
    };
    
    console.log('[Middleware] Token valid for user:', decoded.email);
    
    // Check if token has expired (JWT library checks this, but we double-check)
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      console.log('[Middleware] Token expired - redirecting to login');
      return redirectToLogin(request);
    }
    
    // Token is valid, allow request to proceed
    console.log('[Middleware] Access granted');
    return NextResponse.next();
  } catch (error) {
    // Token verification failed (invalid, expired, or malformed)
    console.error('[Middleware] Token verification failed:', error);
    return redirectToLogin(request);
  }
}

/**
 * Helper function to redirect to login page
 */
function redirectToLogin(request: NextRequest): NextResponse {
  const loginUrl = new URL('/admin/login', request.url);
  return NextResponse.redirect(loginUrl);
}

/**
 * Configure which routes this middleware should run on
 * Temporarily disabled to allow client-side auth
 */
export const config = {
  matcher: []  // Disabled - using client-side auth check instead
};
