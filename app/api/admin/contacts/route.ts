/**
 * Contacts API (MongoDB)
 * GET /api/admin/contacts - Get contacts
 * PUT /api/admin/contacts - Update contacts
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-simple';
import { getContentByKey, upsertContent } from '@/lib/db/mongodb-content';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const content = await getContentByKey('contacts');

    if (!content) {
      return NextResponse.json({
        success: true,
        data: {
          email: '',
          telegram: '',
          phone: '',
          behance: '',
          dribbble: '',
          avatar: ''
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

export async function PUT(request: NextRequest) {
  try {
    const user = verifyToken(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const contactsData = {
      email: body.email || '',
      telegram: body.telegram || '',
      phone: body.phone || '',
      behance: body.behance || '',
      dribbble: body.dribbble || '',
      avatar: body.avatar || ''
    };

    await upsertContent('contacts', JSON.stringify(contactsData));

    return NextResponse.json({
      success: true
    });
  } catch (error) {
    console.error('Error updating contacts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update contacts' },
      { status: 500 }
    );
  }
}
