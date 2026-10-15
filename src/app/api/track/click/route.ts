/**
 * Click Tracking API
 * POST /api/track/click — запись клика по интерактивному элементу
 */
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body?.elementId || typeof body.elementId !== 'string') {
      return NextResponse.json({ error: 'Invalid or missing elementId' }, { status: 400 })
    }

    if (!body?.elementType || typeof body.elementType !== 'string') {
      return NextResponse.json({ error: 'Invalid or missing elementType' }, { status: 400 })
    }

    if (!body?.path || typeof body.path !== 'string') {
      return NextResponse.json({ error: 'Invalid or missing path' }, { status: 400 })
    }

    await db.click.create({
      data: {
        elementId: body.elementId,
        elementType: body.elementType,
        path: body.path,
      },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error tracking click:', error)
    return NextResponse.json({ error: 'Failed to track click' }, { status: 500 })
  }
}
