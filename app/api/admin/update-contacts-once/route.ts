/**
 * One-time endpoint to update contacts in MongoDB
 * DELETE THIS FILE AFTER USE!
 */

import { NextResponse } from 'next/server';
import { upsertContent } from '@/lib/db/mongodb-content';

export async function GET() {
  try {
    const contacts = {
      email: 'hello@arhiv24.com',
      telegram: 'https://t.me/RLC_W',
      behance: 'https://behance.net/arhiv24'
    };
    
    await upsertContent('contacts', JSON.stringify(contacts));
    
    return NextResponse.json({
      success: true,
      message: 'Contacts updated successfully',
      data: contacts
    });
  } catch (error) {
    console.error('Error updating contacts:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update contacts',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
