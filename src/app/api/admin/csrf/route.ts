/**
 * CSRF Token API
 * GET /api/admin/csrf — выдача CSRF-токена (httpOnly cookie `rex-csrf`, 1 час)
 */
import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { generateCsrfToken } from '@/lib/csrf'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized

    const token = generateCsrfToken()

    const response = NextResponse.json({
      success: true,
      token,
    })

    response.cookies.set('rex-csrf', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 час
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Error generating CSRF token:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate CSRF token' },
      { status: 500 }
    )
  }
}
