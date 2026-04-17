/**
 * Verify Authentication Token
 * 
 * GET /api/admin/auth/verify
 * 
 * Verifies if the provided token is valid
 */

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

export async function GET(request: NextRequest) {
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
      return NextResponse.json(
        { valid: false, error: 'No token provided' },
        { status: 401 }
      );
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      sessionId: string;
      userId: string;
      email: string;
      exp: number;
    };
    
    return NextResponse.json({
      valid: true,
      user: {
        userId: decoded.userId,
        email: decoded.email
      }
    });
  } catch (error) {
    return NextResponse.json(
      { valid: false, error: 'Invalid token' },
      { status: 401 }
    );
  }
}
