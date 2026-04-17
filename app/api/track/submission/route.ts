/**
 * Form Submission Tracking API Endpoint
 * 
 * POST /api/track/submission
 * 
 * Tracks form submission events and stores submission data.
 * 
 * Requirements: 7.1, 7.5
 */

import { NextRequest, NextResponse } from 'next/server';
import { trackSubmission } from '@/lib/services/analytics.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.formId || typeof body.formId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing formId' },
        { status: 400 }
      );
    }
    
    if (!body.name || typeof body.name !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing name' },
        { status: 400 }
      );
    }
    
    if (!body.email || typeof body.email !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing email' },
        { status: 400 }
      );
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    if (!body.message || typeof body.message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing message' },
        { status: 400 }
      );
    }
    
    // Track the submission
    await trackSubmission({
      formId: body.formId,
      name: body.name,
      email: body.email,
      message: body.message,
      timestamp: new Date(),
    });
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error tracking submission:', error);
    return NextResponse.json(
      { error: 'Failed to track submission' },
      { status: 500 }
    );
  }
}
