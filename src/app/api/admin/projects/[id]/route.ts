/**
 * Individual Project API
 * GET /api/admin/projects/[id] — получить проект
 * PUT /api/admin/projects/[id] — обновить проект
 * DELETE /api/admin/projects/[id] — удалить проект
 */
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { logAdminAction } from '@/lib/logger'
import { normalizeCategories, normalizeImages, pickImageAlt } from '@/lib/project-input'

export const dynamic = 'force-dynamic'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized

    const { id } = await params

    const project = await db.project.findUnique({ where: { id } })

    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: project })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch project' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized

    const { id } = await params

    const body = (await request.json()) as Record<string, unknown>

    const title = typeof body?.title === 'string' ? body.title : ''
    const description = typeof body?.description === 'string' ? body.description : ''
    const category = typeof body?.category === 'string' ? body.category : ''
    const year = body?.year !== undefined && body?.year !== null ? String(body.year) : ''

    if (!title || !description || !category || !year) {
      return NextResponse.json(
        { success: false, error: 'Отсутствуют обязательные поля: title, description, category, year' },
        { status: 400 }
      )
    }

    if (!/^\d{4}$/.test(year)) {
      return NextResponse.json(
        { success: false, error: 'Год должен состоять из 4 цифр' },
        { status: 400 }
      )
    }

    const existing = await db.project.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 })
    }

    const project = await db.project.update({
      where: { id },
      data: {
        title,
        description,
        category,
        categories: normalizeCategories(body?.categories, category),
        year,
        image: typeof body?.image === 'string' ? body.image : existing.image,
        imageAlt: pickImageAlt(body, title),
        images: body?.images !== undefined ? normalizeImages(body.images) : existing.images,
        wide: body?.wide !== undefined ? Number(body.wide) || 0 : existing.wide,
        featured: body?.featured !== undefined ? Number(body.featured) || 0 : existing.featured,
        displayOrder:
          body?.displayOrder !== undefined ? Number(body.displayOrder) || 0 : existing.displayOrder,
      },
    })

    void logAdminAction('Обновлён проект', { id, title: project.title })

    return NextResponse.json({ success: true, data: project })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      {
        success: false,
        error:
          'Failed to update project: ' +
          (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized

    const { id } = await params

    const existing = await db.project.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 })
    }

    await db.project.delete({ where: { id } })

    void logAdminAction('Удалён проект', { id, title: existing.title })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete project' }, { status: 500 })
  }
}
