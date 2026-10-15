/**
 * JSON-бэкапы БД в `db/backups/`.
 * Хранит последние 7 копий, каждая — полный дамп таблиц Prisma.
 * На Vercel (read-only ФС) — в /tmp, чтобы админка оставалась работоспособной.
 */
import { promises as fs } from 'fs'
import path from 'path'
import { db } from '@/lib/db'

const BACKUP_DIR = process.env.VERCEL
  ? path.join('/tmp', 'rex-design-backups')
  : path.join(process.cwd(), 'db', 'backups')
const INDEX_FILE = path.join(BACKUP_DIR, 'index.json')
const MAX_BACKUPS = 7

export interface BackupIndexEntry {
  timestamp: string
  filename: string
  size: number
  counts: {
    users: number
    projects: number
    content: number
    pageviews: number
    clicks: number
    formSubmissions: number
  }
}

interface BackupDump {
  timestamp: string
  users: Array<Record<string, unknown>>
  projects: Array<Record<string, unknown>>
  content: Array<Record<string, unknown>>
  pageviews: Array<Record<string, unknown>>
  clicks: Array<Record<string, unknown>>
  formSubmissions: Array<Record<string, unknown>>
}

async function readIndex(): Promise<BackupIndexEntry[]> {
  try {
    const raw = await fs.readFile(INDEX_FILE, 'utf-8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as BackupIndexEntry[]) : []
  } catch {
    return []
  }
}

async function writeIndex(entries: BackupIndexEntry[]): Promise<void> {
  await fs.mkdir(BACKUP_DIR, { recursive: true })
  await fs.writeFile(INDEX_FILE, JSON.stringify(entries, null, 2), 'utf-8')
}

/** Создать бэкап: дамп всех таблиц в `{timestamp}.json` + запись в index.json */
export async function createBackup(): Promise<{
  success: boolean
  backupPath?: string
  metadata?: { timestamp: string; projects: number; pageviews: number; sizeBytes: number }
  error?: string
}> {
  try {
    await fs.mkdir(BACKUP_DIR, { recursive: true })

    const [users, projects, content, pageviews, clicks, formSubmissions] = await Promise.all([
      db.user.findMany(),
      db.project.findMany(),
      db.content.findMany(),
      db.pageview.findMany(),
      db.click.findMany(),
      db.formSubmission.findMany(),
    ])

    const timestamp = new Date().toISOString()
    const dump: BackupDump = {
      timestamp,
      users: users as unknown as Array<Record<string, unknown>>,
      projects: projects as unknown as Array<Record<string, unknown>>,
      content: content as unknown as Array<Record<string, unknown>>,
      pageviews: pageviews as unknown as Array<Record<string, unknown>>,
      clicks: clicks as unknown as Array<Record<string, unknown>>,
      formSubmissions: formSubmissions as unknown as Array<Record<string, unknown>>,
    }

    const filename = `${timestamp.replace(/[:.]/g, '-')}.json`
    const backupPath = path.join(BACKUP_DIR, filename)
    await fs.writeFile(backupPath, JSON.stringify(dump, null, 2), 'utf-8')

    const stat = await fs.stat(backupPath)
    const entry: BackupIndexEntry = {
      timestamp,
      filename,
      size: stat.size,
      counts: {
        users: users.length,
        projects: projects.length,
        content: content.length,
        pageviews: pageviews.length,
        clicks: clicks.length,
        formSubmissions: formSubmissions.length,
      },
    }

    // Обновляем индекс: новые сверху, храним только последние MAX_BACKUPS
    const existing = await readIndex()
    const merged = [...existing.filter(e => e.timestamp !== timestamp), entry]
      .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
      .slice(0, MAX_BACKUPS)

    const removed = merged.length === MAX_BACKUPS
      ? existing
          .filter(e => !merged.some(m => m.timestamp === e.timestamp))
          .map(e => path.join(BACKUP_DIR, e.filename))
      : []

    await writeIndex(merged)

    // Удаляем файлы бэкапов, выпавших из окна хранения
    await Promise.all(
      removed.map(file =>
        fs.unlink(file).catch(err => console.error('[backup] Не удалось удалить старый бэкап:', err))
      )
    )

    return {
      success: true,
      backupPath,
      metadata: {
        timestamp,
        projects: projects.length,
        pageviews: pageviews.length,
        sizeBytes: stat.size,
      },
    }
  } catch (error) {
    console.error('[backup] Ошибка создания бэкапа:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

/** Список бэкапов (новые сверху) */
export async function listBackups(): Promise<{
  success: boolean
  backups: BackupIndexEntry[]
}> {
  const entries = await readIndex()
  return {
    success: true,
    backups: entries.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1)),
  }
}

/** Восстановить БД из бэкапа (транзакционно, с полным откатом при ошибке) */
export async function restoreBackup(timestamp: string): Promise<{
  success: boolean
  restored?: {
    users: number
    projects: number
    content: number
    pageviews: number
    clicks: number
    formSubmissions: number
  }
  error?: string
}> {
  try {
    const index = await readIndex()
    const entry = index.find(e => e.timestamp === timestamp)
    if (!entry) {
      return { success: false, error: 'Бэкап не найден' }
    }

    const raw = await fs.readFile(path.join(BACKUP_DIR, entry.filename), 'utf-8')
    const dump = JSON.parse(raw) as BackupDump

    await db.$transaction(async tx => {
      await tx.pageview.deleteMany()
      await tx.click.deleteMany()
      await tx.formSubmission.deleteMany()
      await tx.project.deleteMany()
      await tx.content.deleteMany()
      await tx.user.deleteMany()

      // Оригинальные id сохраняются, чтобы ссылки между данными остались валидными
      await tx.user.createMany({ data: dump.users as never })
      await tx.project.createMany({ data: dump.projects as never })
      await tx.content.createMany({ data: dump.content as never })
      await tx.pageview.createMany({ data: dump.pageviews as never })
      await tx.click.createMany({ data: dump.clicks as never })
      await tx.formSubmission.createMany({ data: dump.formSubmissions as never })
    })

    return {
      success: true,
      restored: {
        users: dump.users.length,
        projects: dump.projects.length,
        content: dump.content.length,
        pageviews: dump.pageviews.length,
        clicks: dump.clicks.length,
        formSubmissions: dump.formSubmissions.length,
      },
    }
  } catch (error) {
    console.error('[backup] Ошибка восстановления бэкапа:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}
