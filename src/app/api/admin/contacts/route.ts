/**
 * Admin Contacts API
 * GET /api/admin/contacts — контакты (fallback как в публичном роуте)
 * PUT /api/admin/contacts — обновление контактов (upsert content)
 */
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { logAdminAction } from '@/lib/logger'

export const dynamic = 'force-dynamic'

const FALLBACK_CONTACTS = {
  email: 'hello@arhiv24.com',
  telegram: 'https://t.me/RLC_W',
  behance: 'https://behance.net/arhiv24',
}

export async function GET(request: Request) {
  try {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized

    const content = await db.content.findUnique({ where: { key: 'contacts' } })

    if (!content) {
      return NextResponse.json({ success: true, data: FALLBACK_CONTACTS })
    }

    const contacts = JSON.parse(content.value)
    return NextResponse.json({ success: true, data: contacts })
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch contacts' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized

    const body = await request.json()

    const contactsData = {
      email: typeof body?.email === 'string' ? body.email : '',
      phone: typeof body?.phone === 'string' ? body.phone : '',
      telegram: typeof body?.telegram === 'string' ? body.telegram : '',
      behance: typeof body?.behance === 'string' ? body.behance : '',
      dribbble: typeof body?.dribbble === 'string' ? body.dribbble : '',
      avatar: typeof body?.avatar === 'string' ? body.avatar : '',
    }

    await db.content.upsert({
      where: { key: 'contacts' },
      update: { value: JSON.stringify(contactsData) },
      create: { key: 'contacts', value: JSON.stringify(contactsData) },
    })

    void logAdminAction('Обновлены контакты', { fields: Object.keys(contactsData) })

    return NextResponse.json({ success: true, data: contactsData })
  } catch (error) {
    console.error('Error updating contacts:', error)
    return NextResponse.json({ success: false, error: 'Failed to update contacts' }, { status: 500 })
  }
}
