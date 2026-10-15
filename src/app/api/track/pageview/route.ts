/**
 * Pageview Tracking API
 * POST /api/track/pageview — запись просмотра страницы (публичный эндпоинт)
 */
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getClientIp } from '@/lib/analytics'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body?.path || typeof body.path !== 'string') {
      return NextResponse.json({ success: false, error: 'Path is required' }, { status: 400 })
    }

    const ip = getClientIp(request)

    await db.pageview.create({
      data: { path: body.path, ip },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking pageview:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to track pageview' },
      { status: 500 }
    )
  }
}
