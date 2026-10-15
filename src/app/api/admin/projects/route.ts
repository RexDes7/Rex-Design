/**
 * Admin Projects API
 * GET /api/admin/projects — список всех проектов
 * POST /api/admin/projects — создание проекта
 */
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { logAdminAction } from '@/lib/logger'
import { normalizeCategories, normalizeImages, pickImageAlt } from '@/lib/project-input'

export const dynamic = 'force-dynamic'

const YEAR_REGEX = /^\d{4}$/

export async function GET(request: Request) {
  try {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized

    const projects = await db.project.findMany({
      orderBy: { displayOrder: 'asc' },
    })

    return NextResponse.json({ success: true, data: projects })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized

    const body = (await request.json()) as Record<string, unknown>

    const title = typeof body?.title === 'string' ? body.title : ''
    const description = typeof body?.description === 'string' ? body.description : ''
    const category = typeof body?.category === 'string' ? body.category : ''
    const year = body?.year !== undefined && body?.year !== null ? String(body.year) : ''

    if (!title || !description || !category || !year) {
      return NextResponse.json(
        {
          success: false,
          error: 'Отсутствуют обязательные поля: title, description, category, year',
        },
        { status: 400 }
      )
    }

    if (!/^\d{4}$/.test(year)) {
      return NextResponse.json(
        { success: false, error: 'Год должен состоять из 4 цифр' },
        { status: 400 }
      )
    }

    const maxOrderProject = await db.project.findFirst({
      orderBy: { displayOrder: 'desc' },
      select: { displayOrder: true },
    })
    const displayOrder = (maxOrderProject?.displayOrder ?? -1) + 1

    const project = await db.project.create({
      data: {
        title,
        description,
        category,
        categories: normalizeCategories(body?.categories, category),
        year,
        image: typeof body?.image === 'string' ? body.image : '',
        imageAlt: pickImageAlt(body, title),
        images: normalizeImages(body?.images),
        wide: Number(body?.wide) || 0,
        featured: Number(body?.featured) || 0,
        displayOrder,
      },
    })

    void logAdminAction('Создан проект', { id: project.id, title: project.title })

    return NextResponse.json({ success: true, data: project }, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create project',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
