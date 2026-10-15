/**
 * Admin Content API
 * GET /api/admin/content — весь контент сайта (contacts/about/manifesto/skills)
 * PUT /api/admin/content — upsert значения по ключу
 */
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { logAdminAction } from '@/lib/logger'

export const dynamic = 'force-dynamic'

const STRUCTURED_KEYS = ['contacts', 'about', 'manifesto', 'skills']

async function readParsed(key: string): Promise<unknown> {
  const content = await db.content.findUnique({ where: { key } })
  if (!content) return null
  try {
    return JSON.parse(content.value)
  } catch {
    return content.value
  }
}

export async function GET(request: Request) {
  try {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized

    const [contacts, about, manifesto, skills] = await Promise.all([
      readParsed('contacts'),
      readParsed('about'),
      readParsed('manifesto'),
      readParsed('skills'),
    ])

    return NextResponse.json({
      success: true,
      data: { contacts, about, manifesto, skills },
    })
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch content' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized

    const body = await request.json()
    const key = typeof body?.key === 'string' ? body.key.trim() : ''
    const value = body?.value

    if (!key || value === undefined || value === null) {
      return NextResponse.json(
        { success: false, error: 'Укажите key и value' },
        { status: 400 }
      )
    }

    // Значение может прийти объектом или уже сериализованной JSON-строкой
    let stored: string
    if (typeof value === 'string') {
      if (STRUCTURED_KEYS.includes(key)) {
        try {
          JSON.parse(value) // валидация JSON для структурированных ключей
        } catch {
          return NextResponse.json(
            { success: false, error: `Невалидный JSON для ключа ${key}` },
            { status: 400 }
          )
        }
      }
      stored = value
    } else {
      stored = JSON.stringify(value)
    }

    await db.content.upsert({
      where: { key },
      update: { value: stored },
      create: { key, value: stored },
    })

    void logAdminAction('Обновлён контент', { key })

    let data: unknown = stored
    try {
      data = JSON.parse(stored)
    } catch {
      data = stored
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error updating content:', error)
    return NextResponse.json({ success: false, error: 'Failed to update content' }, { status: 500 })
  }
}
