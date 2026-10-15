/**
 * Admin Logout API
 * POST /api/admin/auth/logout — выход: очистка cookie `auth-token` + лог
 */
import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { logAdminAction } from '@/lib/logger'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const payload = verifyToken(request)

    if (payload) {
      void logAdminAction('Выход из админ-панели', { email: payload.email })
    }

    const response = NextResponse.json(
      { success: true, message: 'Logout successful' },
      { status: 200 }
    )

    response.cookies.delete('auth-token')

    return response
  } catch (error) {
    console.error('Logout endpoint error:', error)

    const response = NextResponse.json(
      { success: true, message: 'Logout successful' },
      { status: 200 }
    )
    response.cookies.delete('auth-token')
    return response
  }
}
