# REX DESIGN — Дизайн-студия Рафаэля Апаряна

Полный редизайн портфолио в пост-модерн стиле: тёмная тема, острые углы,
контурная типографика (Oswald + Onest + JetBrains Mono + Caveat), красный
акцент `#E63946`, бумажная текстура, бегущая строка и magazine-сетка.

**Live:** https://rex-dsgn.vercel.app

## Стек

- **Next.js 16** (App Router, Turbopack)
- **TypeScript 5**
- **Tailwind CSS 4** + **shadcn/ui** (New York) + Lucide
- **Prisma ORM + SQLite** (`db/custom.db` — контент сайта в репозитории)
- **Framer Motion** — анимации
- **JWT** (jsonwebtoken + bcryptjs) — админ-панель

## Структура

```
src/
  app/
    page.tsx        — SPA с hash-роутингом (#/, #/cases, #/about, #/contact, #/admin)
    api/            — 24 REST-эндпоинта (projects, contacts, track/*, admin/*)
  components/
    site/           — публичные секции (hero, marquee, портфолио, услуги, футер)
    admin/          — админ-панель (проекты, контакты, аналитика, логи, бэкапы)
    ui/             — shadcn/ui
  lib/              — auth, db, email (SMTP), logger, backup
prisma/schema.prisma
db/custom.db        — SQLite с контентом (коммитится)
public/uploads/     — изображения проектов
```

## Разработка

```bash
npm install        # или bun install
npm run dev        # http://localhost:3000
```

Админка: `#/admin` — вход по email/паролю (таблица `User` в базе).

## Переменные окружения

См. `.env.example`. Все переменные необязательны, кроме `DATABASE_URL`
(локально). Ключевые:

| Переменная | Назначение |
|---|---|
| `DATABASE_URL` | SQLite (`file:./db/custom.db`) |
| `JWT_SECRET` | подпись JWT админки |
| `SMTP_*` | письма из формы контактов |
| `CLOUDINARY_*` | загрузка изображений в админке (иначе — `public/uploads`) |

## Деплой (Vercel)

Проект привязан к репозиторию — пуш в `main` запускает деплой.

Особенности serverless:

- SQLite-база из репозитория копируется в `/tmp` (ФС лямбды read-only) —
  сайт полностью работает, но изменения в базе на Vercel живут в рамках
  инстанса функции. Для постоянного хранилища подключите
  [Turso](https://turso.tech) и задайте `DATABASE_URL`.
- Загрузка изображений уходит в Cloudinary, если заданы `CLOUDINARY_*`.

## Скрипты

```bash
npm run dev     # dev-сервер
npm run build   # prisma generate + next build
npm run start   # прод-сервер
npm run lint    # ESLint
npm run db:push # применить схему Prisma к SQLite
```
