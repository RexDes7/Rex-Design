/**
 * Public Contacts API
 * GET /api/contacts - Get contact information (no auth required)
 * POST /api/contacts - Submit contact form (no auth required)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getContentByKey } from '@/lib/db/mongodb-content';
import { sendContactEmail } from '@/lib/email';

export async function GET() {
  try {
    const content = await getContentByKey('contacts');

    if (!content) {
      return NextResponse.json({
        success: true,
        data: {
          email: 'hello@arhiv24.com',
          telegram: 'https://t.me/arhiv24',
          behance: 'https://behance.net/arhiv24',
          dribbble: 'https://dribbble.com/arhiv24'
        }
      });
    }

    const contacts = JSON.parse(content.value);

    return NextResponse.json({
      success: true,
      data: contacts
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    await sendContactEmail({
      name: body.name,
      email: body.email,
      message: body.message
    });

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Error sending contact form:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
