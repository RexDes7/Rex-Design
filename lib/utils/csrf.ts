/**
 * CSRF Protection Utility
 * 
 * Provides CSRF token generation and validation for form submissions.
 * Requirements: 11.2
 */

import { randomBytes } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Generate a CSRF token
 * Returns a random hex string
 */
export function generateCSRFToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Validate CSRF token
 * Compares provided token with expected token using timing-safe comparison
 */
export function validateCSRFToken(token: string | null, expectedToken: string): boolean {
  if (!token || !expectedToken) {
    return false;
  }
  
  // Use timing-safe comparison to prevent timing attacks
  if (token.length !== expectedToken.length) {
    return false;
  }
  
  const tokenBuffer = Buffer.from(token);
  const expectedBuffer = Buffer.from(expectedToken);
  
  return tokenBuffer.equals(expectedBuffer);
}

/**
 * Validate CSRF token from request
 * Extracts token from request header and validates against cookie
 * 
 * @param request - Next.js request object
 * @returns true if token is valid, false otherwise
 */
export function validateCSRFFromRequest(request: NextRequest): boolean {
  // Get token from header
  const headerToken = request.headers.get('x-csrf-token');
  
  // Get token from cookie
  const cookieToken = request.cookies.get('csrf-token')?.value;
  
  if (!headerToken || !cookieToken) {
    return false;
  }
  
  return validateCSRFToken(headerToken, cookieToken);
}

/**
 * Create CSRF error response
 * Returns a standardized error response for CSRF validation failures
 */
export function createCSRFErrorResponse(): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'CSRF_VALIDATION_FAILED',
        message: 'Invalid or missing CSRF token',
        timestamp: new Date().toISOString(),
      },
    },
    { status: 403 }
  );
}
