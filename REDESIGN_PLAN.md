# REX DESIGN — Редизайн v2 / План работы

> Документ создан в режиме планирования. После approve пользователя — старт реализации.

---

## 0. Контекст

- **Проект**: Next.js 14 (App Router) + MongoDB + Cloudinary портфолио дизайнера
- **Цель**: Полная переработка визуала в направлении **Editorial Light**
- **Backend, MongoDB, Cloudinary, admin-панель** — НЕ трогаем
- **URL structure, SEO metadata** — сохраняем
- **Push strategy**: прямые коммиты в `main`, Vercel авто-деплой

---

## 1. Концепция

**«Editorial Light»** — премиальное портфолио в духе архитектурных презентаций и редакционных журналов.

**Ключевая фраза:** «сайт как разговор с дизайнером, а не корпоративный портал».

**Принципы:**
- Светлый фон, белый / soft gray
- Крупная выразительная типографика как главный визуальный элемент
- Синий `#1F4ED8` — только как акцент
- Тёмные секции `#08111F` — изредка, для ритма
- Скруглённые карточки (20–32px)
- Асимметричные композиции, magazine rhythm
- Минимум текста, максимум воздуха
- Никаких 3D-сфер, метеоров, кастомных курсоров, noise-overlay

---

## 2. Дизайн-токены

### Цвета

| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#FFFFFF` | Основной фон |
| `--bg-secondary` | `#F6F7F9` | Альтернативный фон секций |
| `--bg-dark` | `#08111F` | Тёмные акцентные секции |
| `--accent` | `#1F4ED8` | Синий акцент |
| `--accent-soft` | `rgba(31,78,216,0.08)` | Фон accent-плашек |
| `--text-primary` | `#151515` | Основной текст |
| `--text-secondary` | `#4A4A4A` | Вторичный |
| `--text-muted` | `#8A8A8A` | Метаданные |
| `--text-on-dark` | `#FFFFFF` | Текст на тёмном |
| `--border` | `rgba(21,21,21,0.08)` | Тонкие границы |

### Радиусы
- `--radius-sm: 12px` · `--radius-md: 20px` · `--radius-lg: 28px` · `--radius-xl: 32px` · `--radius-full: 999px`

### Тени (мягкие)
- `--shadow-xs: 0 1px 2px rgba(21,21,21,0.04)`
- `--shadow-sm: 0 2px 8px rgba(21,21,21,0.04)`
- `--shadow-md: 0 8px 24px rgba(21,21,21,0.06)`
- `--shadow-lg: 0 16px 48px rgba(21,21,21,0.08)`
- `--shadow-accent: 0 8px 24px rgba(31,78,216,0.18)`

### Типографика — 2 варианта

**Вариант T1 — Editorial Serif** (характерный, magazine)
- Display: **Fraunces** (variable serif)
- Body: **Inter**
- Mono: **JetBrains Mono**

**Вариант T2 — Modern Sans** ⭐ Рекомендую
- Display: **Plus Jakarta Sans** (800/900)
- Body: **Inter**
- Mono: **JetBrains Mono**

### Type scale
- Display: `clamp(3.5rem, 9vw, 8rem)`
- H1: `clamp(2.5rem, 6vw, 5rem)`
- H2: `clamp(2rem, 4vw, 3.5rem)`
- H3: `clamp(1.5rem, 2.5vw, 2rem)`
- Body large: `clamp(1.125rem, 1.5vw, 1.375rem)`
- Body: `1rem` · Small: `0.875rem` · Label: `0.75rem` (uppercase, 0.08em)

### Spacing
xs 0.5 · sm 1 · md 1.5 · lg 2.5 · xl 4 · 2xl 6 · 3xl 8 · 4xl 12 rem

---

## 3. Компоненты — инвентаризация

### ❌ Удаляем
- `components/MetallicSphere.tsx` (3D сфера)
- `components/SpaceEffects.tsx` (метеоры, спутник)
- `components/CustomCursor.tsx` (кастомный курсор)
- `styles/SpaceEffects.module.css`, `styles/CustomCursor.module.css`
- Из `globals.css`: `cursor: none`, `body::before` noise overlay

### ♻️ Переписываем с нуля
- `Navigation.tsx` — sticky, прозрачный, тонкая линия при scroll
- `Footer.tsx` — большой editorial footer
- `ProjectCard.tsx` — с variants: hero/standard/wide/compact
- `ProjectModal.tsx` — чистый, фокус на изображениях
- `ContactForm.tsx` — минимальная, floating labels
- `ManifestoCard.tsx` → `ApproachCard.tsx`

### ➕ Новые компоненты
- `ServiceCard.tsx` — карточка услуги
- `ProcessStep.tsx` — шаг процесса
- `TestimonialCard.tsx` — отзыв клиента
- `StatCard.tsx` — статистика
- `SectionLabel.tsx` — маленький синий лейбл секции

---

## 4. Страницы — структура

### Home (`app/page.tsx`)
1. Hero — крупный заголовок, 2 CTA, абстрактный геометрический акцент
2. Friendly intro — короткий личный блок
3. Selected works — 3–4 проекта, разные размеры
4. Design approach — 3 принципa (ApproachCard)
5. Services overview — 4–6 услуг
6. Featured project — 1 крупный с сторителлингом
7. Creative process — 4–5 шагов
8. Testimonials — 2–3 отзыва
9. CTA — тёмная секция для контраста

### Portfolio (`app/cases/page.tsx`)
- Hero «Selected works 2020–2026»
- Sticky filter bar (pill-кнопки)
- **Magazine grid**: hero / 2-col / 3-col / offset / wide / чередование
- Используем поля `featured` и `wide` для раскладки

### About (`app/about/page.tsx`)
1. Personal intro + портрет
2. Story (не резюме)
3. Design philosophy
4. Experience timeline 2020→2026
5. Skills grid
6. Tools
7. Creative process
8. Fun facts
9. Photography
10. CTA

### Contact (`app/contact/page.tsx`)
1. Large invitation
2. Availability badge
3. Minimal form
4. Direct contacts (крупно)
5. Social links
6. Closing quote

---

## 5. Что НЕ трогаю

- `app/api/**` — все API routes
- `app/admin/**` — админ-панель
- `lib/db/**`, `lib/services/**` — DB и бизнес-логика
- `lib/auth-simple.ts`, `middleware.ts` — авторизация
- `types/**` — контракты данных
- `app/layout.tsx` metadata — SEO (только шрифты поменяю)
- `app/sitemap.ts`, `app/robots.ts`, `app/schema.tsx` — SEO
- `public/uploads/**` — загруженные изображения
- `mongodb-import-data.json` — данные БД

---

## 6. Migration safety

### Перед каждым пушем
1. `npm install` (если меняю deps)
2. `npx tsc --noEmit` — типы
3. `npm run build` — сборка
4. Успех → commit → push в `main`
5. Ошибка → фикс → повтор

### Откат
- Каждый блок = 1 коммит
- `git revert <commit>` + push → Vercel redeploy

### Проверка
- Agent Browser после каждого крупного коммита
- Desktop + mobile, 4 страницы
- Console errors check

---

## 7. Порядок работы

- **Phase 0**: Создать REDESIGN_PLAN.md → `chore: add redesign plan`
- **Phase 1**: Foundation (globals, layout, nav, footer) → `feat: foundation`
- **Phase 2**: Core components (ProjectCard, modal, form, new cards) + удаление 3D/cursor → `feat: core components`
- **Phase 3**: Home page → `feat: home editorial layout`
- **Phase 4**: Portfolio magazine grid → `feat: portfolio magazine`
- **Phase 5**: About + Contact → `feat: about and contact`
- **Phase 6**: Polish + final build + push → `chore: final polish`

---

## 8. Вопросы к пользователю перед стартом

1. **Шрифты** — T1 (Fraunces serif) или T2 (Plus Jakarta Sans)? Рекомендую T2.
2. **Портрет для About** — реальное фото скинешь, или плейсхолдер «заменить позже»?
3. **Testimonials** — есть реальные отзывы? Скинь 2–3 (имя, роль, текст). Или заглушка.
4. **Services** — используем 6 skills + добавим «Консультация» и «Айдентика»? Или другой список?
5. **Creative process** — твои шаги, или универсальный: Brief → Research → Concept → Design → Delivery?
6. **Photography на About** — личные фото, или Cloudinary-изображения из проектов?

---

_После ответов на 6 вопросов — старт Phase 1._
