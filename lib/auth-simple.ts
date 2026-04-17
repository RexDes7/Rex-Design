import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

interface TokenPayload {
  userId: string;
  email: string;
}

// Old token format (from previous auth system)
interface OldTokenPayload {
  sessionId: string;
  userId: string;
  email: string;
}

/**
 * Verify JWT token from Authorization header
 * Supports both old and new token formats for backward compatibility
 * @param request - Next.js request object
 * @returns Token payload or null if invalid
 */
export function verifyToken(request: NextRequest): TokenPayload | null {
  const authHeader = request.headers.get('authorization');
  console.log('[DEBUG] Auth header:', authHeader ? 'present' : 'missing');
  
  if (!authHeader?.startsWith('Bearer ')) {
    console.log('[DEBUG] No Bearer token');
    return null;
  }
  
  const token = authHeader.substring(7);
  console.log('[DEBUG] Token (first 30 chars):', token.substring(0, 30));
  
  try {
    // Try to decode without verification first to see what's in it
    const decoded = jwt.decode(token);
    console.log('[DEBUG] Decoded token (no verification):', JSON.stringify(decoded));
    
    const payload = jwt.verify(token, JWT_SECRET) as any;
    console.log('[DEBUG] Verified payload:', JSON.stringify(payload));
    
    // Handle both old format (with sessionId) and new format (without sessionId)
    if (payload.userId && payload.email) {
      return {
        userId: payload.userId,
        email: payload.email
      };
    }
    
    console.log('[DEBUG] Payload missing userId or email');
    return null;
  } catch (error) {
    console.log('[DEBUG] Verification error:', error instanceof Error ? error.message : String(error));
    return null;
  }
}
