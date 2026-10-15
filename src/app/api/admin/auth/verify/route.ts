/**
 * Verify Authentication Token
 * GET /api/admin/auth/verify — проверка валидности JWT (Bearer)
 */
import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const payload = verifyToken(request)

    if (!payload) {
      return NextResponse.json({ success: false }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      user: {
        userId: payload.userId,
        email: payload.email,
      },
    })
  } catch (error) {
    console.error('Error verifying token:', error)
    return NextResponse.json({ success: false }, { status: 401 })
  }
}
