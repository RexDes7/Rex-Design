/**
 * Pageview Tracking API (MongoDB)
 * POST /api/track/pageview - Track page view (public endpoint)
 */

import { NextRequest, NextResponse } from 'next/server';
import { trackPageview } from '@/lib/db/mongodb-analytics';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.path) {
      return NextResponse.json(
        { success: false, error: 'Path is required' },
        { status: 400 }
      );
    }

    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : undefined;

    await trackPageview(body.path, ip);

    return NextResponse.json({
      success: true
    });
  } catch (error) {
    console.error('Error tracking pageview:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track pageview' },
      { status: 500 }
    );
  }
}
