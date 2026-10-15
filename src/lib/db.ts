import { PrismaClient } from '@prisma/client'
import { copyFileSync, existsSync, mkdirSync } from 'fs'
import path from 'path'

/**
 * Разрешение DATABASE_URL для SQLite:
 * 1. Если задан process.env.DATABASE_URL (.env локально / Vercel env) — используем как есть.
 * 2. На Vercel (serverless, read-only ФС) — база из бандла копируется в /tmp и
 *    работает оттуда (все эндпоинты функционируют; данные инстанса — в /tmp).
 * 3. Локально без env — файл db/custom.db в корне проекта.
 */
function resolveDatabaseUrl(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL

  const source = path.join(process.cwd(), 'db', 'custom.db')

  if (process.env.VERCEL) {
    const targetDir = '/tmp/rex-design-db'
    const target = path.join(targetDir, 'custom.db')
    if (!existsSync(target)) {
      try {
        mkdirSync(targetDir, { recursive: true })
        if (existsSync(source)) copyFileSync(source, target)
      } catch (error) {
        console.error('[db] Не удалось подготовить копию SQLite в /tmp:', error)
      }
    }
    return `file:${target}`
  }

  return `file:${source}`
}

process.env.DATABASE_URL ||= resolveDatabaseUrl()

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
