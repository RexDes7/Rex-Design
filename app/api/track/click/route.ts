/**
 * Click Tracking API Endpoint
 * 
 * POST /api/track/click
 * 
 * Tracks click events on buttons, links, and other interactive elements.
 * 
 * Requirements: 6.1, 6.2
 */

import { NextRequest, NextResponse } from 'next/server';
import { trackClick } from '@/lib/services/analytics.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.elementId || typeof body.elementId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing elementId' },
        { status: 400 }
      );
    }
    
    if (!body.elementType || typeof body.elementType !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing elementType' },
        { status: 400 }
      );
    }
    
    if (!body.path || typeof body.path !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing path' },
        { status: 400 }
      );
    }
    
    // Track the click
    await trackClick({
      elementId: body.elementId,
      elementType: body.elementType,
      path: body.path,
      timestamp: new Date(),
    });
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error tracking click:', error);
    return NextResponse.json(
      { error: 'Failed to track click' },
      { status: 500 }
    );
  }
}
