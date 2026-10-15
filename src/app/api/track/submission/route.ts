/**
 * Form Submission Tracking API
 * POST /api/track/submission — запись отправки формы
 */
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body?.formId || typeof body.formId !== 'string') {
      return NextResponse.json({ error: 'Invalid or missing formId' }, { status: 400 })
    }

    if (!body?.name || typeof body.name !== 'string') {
      return NextResponse.json({ error: 'Invalid or missing name' }, { status: 400 })
    }

    if (!body?.email || typeof body.email !== 'string') {
      return NextResponse.json({ error: 'Invalid or missing email' }, { status: 400 })
    }

    if (!EMAIL_REGEX.test(body.email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    if (!body?.message || typeof body.message !== 'string') {
      return NextResponse.json({ error: 'Invalid or missing message' }, { status: 400 })
    }

    await db.formSubmission.create({
      data: {
        formId: body.formId,
        name: body.name,
        email: body.email,
        message: body.message,
      },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error tracking submission:', error)
    return NextResponse.json({ error: 'Failed to track submission' }, { status: 500 })
  }
}
