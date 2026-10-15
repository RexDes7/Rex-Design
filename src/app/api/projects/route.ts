/**
 * Public Projects API
 * GET /api/projects — все проекты (без авторизации), displayOrder asc.
 */
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const projects = await db.project.findMany({
      orderBy: { displayOrder: 'asc' },
    })

    return NextResponse.json(
      { success: true, data: projects },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch projects' }, { status: 500 })
  }
}
