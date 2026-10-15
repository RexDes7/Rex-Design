/**
 * REX DESIGN — Seed script
 * Imports production data from the original MongoDB dump (mongodb-import-data.json)
 * Pageviews are re-distributed over the last 30 days so analytics looks live.
 */
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

interface DumpProject {
  id: string
  title: string
  description: string
  category: string
  categories?: string | null
  year: string | number
  image: string
  image_alt: string
  images: string | null
  wide: number
  featured: number
  display_order: number
  created_at: string
  updated_at: string
}

const DUMP_URL = '/home/z/rex-design-original/mongodb-import-data.json'

async function main() {
  const fs = await import('fs')
  const dump = JSON.parse(fs.readFileSync(DUMP_URL, 'utf-8'))

  // ---- Wipe ----
  await db.pageview.deleteMany()
  await db.click.deleteMany()
  await db.formSubmission.deleteMany()
  await db.log.deleteMany()
  await db.project.deleteMany()
  await db.content.deleteMany()
  await db.user.deleteMany()

  // ---- Users ----
  const dumpUser = dump.users[0]
  const validHash = await bcrypt.compare('Raf070100', dumpUser.password_hash).catch(() => false)
  await db.user.create({
    data: {
      id: dumpUser.id,
      email: dumpUser.email,
      passwordHash: validHash ? dumpUser.password_hash : await bcrypt.hash('Raf070100', 10),
      createdAt: new Date(dumpUser.created_at),
    },
  })
  console.log(`Seeded user: ${dumpUser.email} (hash valid: ${validHash})`)

  // ---- Projects ----
  let order = 0
  for (const p of dump.projects as DumpProject[]) {
    await db.project.create({
      data: {
        id: p.id,
        title: p.title,
        description: p.description,
        category: p.category,
        categories: p.categories ?? JSON.stringify([p.category]),
        year: String(p.year),
        image: p.image,
        imageAlt: p.image_alt,
        images: p.images ?? '[]',
        wide: p.wide ?? 0,
        featured: p.featured ?? 0,
        displayOrder: p.display_order ?? order,
        createdAt: new Date(p.created_at),
      },
    })
    order++
  }
  console.log(`Seeded projects: ${dump.projects.length}`)

  // ---- Content (contacts) ----
  for (const c of dump.content) {
    await db.content.create({
      data: { key: c.key, value: c.value, updatedAt: new Date(c.updated_at) },
    })
  }
  console.log(`Seeded content keys: ${dump.content.map((c: any) => c.key).join(', ')}`)

  // ---- Pageviews (270 records, redistributed over last 30 days) ----
  const now = Date.now()
  const THIRTY_DAYS = 30 * 24 * 3600 * 1000
  const ips = ['::1', '92.100.14.7', '185.44.12.90', '77.88.8.8', '5.166.72.31']
  const paths = ['/cases', '/', '/about', '/contact']
  const pvRows: { path: string; ip: string; timestamp: Date }[] = []
  // keep original path distribution & count
  dump.pageviews.forEach((pv: any, i: number) => {
    const offset = ((i * 7919) % 1000) / 1000 // deterministic spread
    const ts = new Date(now - Math.floor(THIRTY_DAYS * ((i / dump.pageviews.length) * 0.9 + offset * 0.08)))
    pvRows.push({ path: pv.path || paths[i % paths.length], ip: ips[i % ips.length], timestamp: ts })
  })
  await db.pageview.createMany({ data: pvRows })
  console.log(`Seeded pageviews: ${pvRows.length}`)

  // ---- Sample click stats ----
  const clickElements = [
    ['nav-portfolio', 'link'],
    ['nav-about', 'link'],
    ['nav-contact', 'link'],
    ['hero-cta', 'button'],
    ['footer-social-telegram', 'link'],
    ['project-card', 'card'],
    ['contact-submit', 'button'],
  ] as const
  const clickRows: { elementId: string; elementType: string; path: string; createdAt: Date }[] = []
  clickElements.forEach(([el, type], i) => {
    const count = 40 - i * 5
    for (let j = 0; j < count; j++) {
      clickRows.push({
        elementId: el,
        elementType: type,
        path: paths[j % paths.length],
        createdAt: new Date(now - Math.floor(Math.random() * THIRTY_DAYS)),
      })
    }
  })
  await db.click.createMany({ data: clickRows })
  console.log(`Seeded clicks: ${clickRows.length}`)

  // ---- Initial log entries ----
  await db.log.createMany({
    data: [
      { type: 'admin_action', message: 'База данных инициализирована (seed)', severity: 'info' },
      { type: 'system_error', message: 'Пример системной записи для проверки фильтров', severity: 'warning' },
    ],
  })
  console.log('Seeded logs: 2')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
