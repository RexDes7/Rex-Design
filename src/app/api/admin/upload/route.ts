/**
 * Image Upload API
 * POST /api/admin/upload — multipart/form-data, поле `file` (или `image`)
 * Максимум 4MB, только JPG/PNG/WebP.
 *
 * Хранилище: если заданы Cloudinary-переменные (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
 * CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) — загрузка в Cloudinary CDN (папка
 * rex-portfolio), как в продакшене оригинала. Иначе — локально public/uploads/{timestamp}-{имя}
 * (sandbox / локальная разработка).
 */
import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import { createHash } from 'crypto'
import path from 'path'
import { requireAuth } from '@/lib/auth'
import { logAdminAction } from '@/lib/logger'

export const dynamic = 'force-dynamic'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')
const MAX_SIZE = 4 * 1024 * 1024 // 4MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']

/** Санитизация имени файла: пробелы → дефисы, разрешены латиница/кириллица/цифры/._- */
function sanitizeFilename(name: string): string {
  const base = path.basename(name)
  return base
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9а-яА-ЯёЁ._-]/g, '')
    .replace(/\.+/g, '.')
    .slice(-100) // ограничиваем длину
}

export async function POST(request: Request) {
  try {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized

    const formData = await request.formData()
    const file = (formData.get('file') ?? formData.get('image')) as File | null

    if (!file || file.size === 0) {
      return NextResponse.json({ success: false, error: 'Файл не выбран' }, { status: 400 })
    }

    const extension = path.extname(file.name).toLowerCase()
    const typeAllowed =
      ALLOWED_TYPES.includes(file.type) || ALLOWED_EXTENSIONS.includes(extension)
    if (!typeAllowed) {
      return NextResponse.json(
        { success: false, error: 'Недопустимый тип файла. Разрешены JPG, PNG и WebP' },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `Файл слишком большой. Максимальный размер 4MB. Ваш файл: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
        },
        { status: 400 }
      )
    }

    const safeName = sanitizeFilename(file.name) || `upload${extension}`
    const bytes = await file.arrayBuffer()

    // --- Cloudinary (продакшен) ---
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (cloudName && apiKey && apiSecret) {
      const timestamp = Math.round(Date.now() / 1000)
      // Сигнатура: параметры (кроме api_key, file, resource_type) по алфавиту + api_secret
      const signature = createHash('sha1')
        .update(`folder=rex-portfolio&timestamp=${timestamp}${apiSecret}`)
        .digest('hex')

      const cloudForm = new FormData()
      cloudForm.append(
        'file',
        new Blob([bytes], { type: file.type }),
        safeName || `upload${extension}`
      )
      cloudForm.append('api_key', apiKey)
      cloudForm.append('timestamp', String(timestamp))
      cloudForm.append('folder', 'rex-portfolio')
      cloudForm.append('signature', signature)

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: cloudForm }
      )
      const cloudJson = (await cloudRes.json()) as {
        secure_url?: string
        error?: { message?: string }
      }
      if (!cloudRes.ok || !cloudJson.secure_url) {
        console.error('Cloudinary upload error:', cloudJson.error?.message)
        return NextResponse.json(
          { success: false, error: 'Failed to upload file' },
          { status: 500 }
        )
      }

      void logAdminAction('Загружен файл (Cloudinary)', {
        folder: 'rex-portfolio',
        size: file.size,
        type: file.type,
      })

      return NextResponse.json({
        success: true,
        data: { url: cloudJson.secure_url },
      })
    }

    // --- Локальное хранилище (sandbox / разработка) ---
    await fs.mkdir(UPLOAD_DIR, { recursive: true })

    const filename = `${Date.now()}-${safeName}`
    const filePath = path.join(UPLOAD_DIR, filename)
    await fs.writeFile(filePath, Buffer.from(bytes))

    void logAdminAction('Загружен файл', { filename, size: file.size, type: file.type })

    return NextResponse.json({
      success: true,
      data: {
        url: `/uploads/${encodeURIComponent(filename)}`,
      },
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
