# Упрощенная админка - Технический дизайн

## Архитектура

### Общая структура
```
Portfolio Website (Next.js 14 App Router)
├── Public Pages (/)
│   └── Analytics tracking component
├── Admin Panel (/admin)
│   ├── Client-side auth check
│   └── Protected pages
└── API Routes (/api/admin)
    └── Token verification
```

### Принципы
- **Простота**: Минимум абстракций, прямолинейный код
- **Один файл = одна функция**: Каждый API route делает одну вещь
- **Без middleware**: Проверка авторизации в каждом route отдельно
- **Без сервисов**: Прямые запросы к БД из API routes
- **Без валидации**: Базовая проверка только обязательных полей

## База данных

### SQLite файл: `admin.db`

**Таблица: users**
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL
);
```

**Таблица: projects**
```sql
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  year TEXT NOT NULL,
  image TEXT,
  image_alt TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

**Таблица: content** (key-value хранилище)
```sql
CREATE TABLE content (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

**Таблица: pageviews**
```sql
CREATE TABLE pageviews (
  id TEXT PRIMARY KEY,
  path TEXT NOT NULL,
  ip TEXT,
  timestamp TEXT NOT NULL
);
```

### Инициализация БД
- Файл: `lib/db/simple-init.ts`
- Создает таблицы если их нет
- Создает админ пользователя если его нет
- Email: `baracuda.max1@gmail.com`
- Password: `Raf070100`

## Авторизация

### Логин flow
1. Пользователь вводит email/password на `/admin/login`
2. POST `/api/admin/auth/login`
3. Проверка пароля (bcrypt)
4. Генерация JWT токена (jsonwebtoken)
5. Возврат токена в response body
6. Клиент сохраняет токен в localStorage
7. Редирект на `/admin`

### JWT токен
```javascript
{
  userId: "uuid",
  email: "email@example.com",
  exp: timestamp // 24 часа
}
```

### Проверка авторизации

**На клиенте (app/admin/layout.tsx):**
```javascript
useEffect(() => {
  const token = localStorage.getItem('auth-token');
  if (!token) {
    window.location.href = '/admin/login';
  }
}, []);
```

**В API routes:**
```javascript
function verifyToken(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
```

## API Routes

### Структура ответов

**Успех:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Ошибка:**
```json
{
  "success": false,
  "error": "Error message"
}
```

### Endpoints

#### POST /api/admin/auth/login
```javascript
// Input
{ email: string, password: string }

// Output (success)
{ success: true, token: string }

// Output (error)
{ success: false, error: string }
```

#### GET /api/admin/projects
```javascript
// Headers: Authorization: Bearer {token}

// Output
{
  success: true,
  data: [
    {
      id: string,
      title: string,
      description: string,
      category: string,
      year: string,
      image: string,
      image_alt: string,
      created_at: string,
      updated_at: string
    }
  ]
}
```

#### POST /api/admin/projects
```javascript
// Headers: Authorization: Bearer {token}

// Input
{
  title: string,
  description: string,
  category: string,
  year: string,
  image: string,
  image_alt: string
}

// Output
{ success: true, data: { id, ...project } }
```

#### GET /api/admin/projects/[id]
```javascript
// Headers: Authorization: Bearer {token}

// Output
{ success: true, data: { ...project } }
```

#### PUT /api/admin/projects/[id]
```javascript
// Headers: Authorization: Bearer {token}

// Input (все поля опциональны)
{
  title?: string,
  description?: string,
  category?: string,
  year?: string,
  image?: string,
  image_alt?: string
}

// Output
{ success: true, data: { ...updated_project } }
```

#### DELETE /api/admin/projects/[id]
```javascript
// Headers: Authorization: Bearer {token}

// Output
{ success: true }
```

#### POST /api/admin/upload
```javascript
// Headers: Authorization: Bearer {token}
// Content-Type: multipart/form-data

// Input
FormData with file field

// Output
{
  success: true,
  data: {
    url: "/uploads/1234567890-image.jpg"
  }
}
```

#### GET /api/admin/contacts
```javascript
// Headers: Authorization: Bearer {token}

// Output
{
  success: true,
  data: {
    email: string,
    telegram: string,
    behance: string,
    dribbble: string
  }
}
```

#### PUT /api/admin/contacts
```javascript
// Headers: Authorization: Bearer {token}

// Input
{
  email: string,
  telegram: string,
  behance: string,
  dribbble: string
}

// Output
{ success: true }
```

#### GET /api/admin/stats
```javascript
// Headers: Authorization: Bearer {token}

// Output
{
  success: true,
  data: {
    totalProjects: number,
    pageviewsLast30Days: number,
    recentPageviews: [
      { path: string, timestamp: string }
    ]
  }
}
```

## Страницы

### /admin/login
**Файл:** `app/admin/login/page.tsx`

**Компоненты:**
- Форма с email/password
- Кнопка "Sign In"
- Сообщение об ошибке

**Логика:**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  const res = await fetch('/api/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (data.success) {
    localStorage.setItem('auth-token', data.token);
    window.location.href = '/admin';
  } else {
    setError(data.error);
  }
};
```

### /admin (Dashboard)
**Файл:** `app/admin/page.tsx`

**Компоненты:**
- Статистика (3 карточки)
- Список последних просмотров

**Данные:**
```javascript
useEffect(() => {
  const token = localStorage.getItem('auth-token');
  fetch('/api/admin/stats', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(data => setStats(data.data));
}, []);
```

### /admin/projects
**Файл:** `app/admin/projects/page.tsx`

**Компоненты:**
- Кнопка "Create New Project"
- Список проектов (карточки)
- Каждая карточка: превью, название, категория, год, кнопки Edit/Delete

**Данные:**
```javascript
useEffect(() => {
  const token = localStorage.getItem('auth-token');
  fetch('/api/admin/projects', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(data => setProjects(data.data));
}, []);
```

**Удаление:**
```javascript
const handleDelete = async (id) => {
  if (!confirm('Are you sure?')) return;
  
  const token = localStorage.getItem('auth-token');
  await fetch(`/api/admin/projects/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  // Обновить список
  setProjects(projects.filter(p => p.id !== id));
};
```

### /admin/projects/new
**Файл:** `app/admin/projects/new/page.tsx`

**Компоненты:**
- Форма с полями:
  - Title (input)
  - Description (textarea)
  - Category (select)
  - Year (input)
  - Image (file upload)
  - Image Alt (input)
- Кнопка "Save"

**Логика:**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // 1. Загрузить изображение
  const formData = new FormData();
  formData.append('file', imageFile);
  
  const uploadRes = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });
  const uploadData = await uploadRes.json();
  
  // 2. Создать проект
  const projectData = {
    title,
    description,
    category,
    year,
    image: uploadData.data.url,
    image_alt: imageAlt
  };
  
  const res = await fetch('/api/admin/projects', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(projectData)
  });
  
  if (res.ok) {
    router.push('/admin/projects');
  }
};
```

### /admin/projects/[id]/edit
**Файл:** `app/admin/projects/[id]/edit/page.tsx`

**Компоненты:**
- Та же форма что и в /new
- Поля заполнены текущими данными

**Логика:**
```javascript
// Загрузка данных
useEffect(() => {
  const token = localStorage.getItem('auth-token');
  fetch(`/api/admin/projects/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(data => {
    setTitle(data.data.title);
    setDescription(data.data.description);
    // ... остальные поля
  });
}, [id]);

// Сохранение
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Если новое изображение - загрузить
  let imageUrl = currentImage;
  if (newImageFile) {
    const formData = new FormData();
    formData.append('file', newImageFile);
    const uploadRes = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    const uploadData = await uploadRes.json();
    imageUrl = uploadData.data.url;
  }
  
  // Обновить проект
  const projectData = {
    title,
    description,
    category,
    year,
    image: imageUrl,
    image_alt: imageAlt
  };
  
  await fetch(`/api/admin/projects/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(projectData)
  });
  
  router.push('/admin/projects');
};
```

### /admin/contacts
**Файл:** `app/admin/contacts/page.tsx`

**Компоненты:**
- Форма с полями: Email, Telegram, Behance, Dribbble
- Кнопка "Save"

**Логика:**
```javascript
// Загрузка
useEffect(() => {
  const token = localStorage.getItem('auth-token');
  fetch('/api/admin/contacts', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(data => {
    setEmail(data.data.email);
    setTelegram(data.data.telegram);
    // ...
  });
}, []);

// Сохранение
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const token = localStorage.getItem('auth-token');
  await fetch('/api/admin/contacts', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, telegram, behance, dribbble })
  });
  
  alert('Saved!');
};
```

## Layout

### app/admin/layout.tsx

**Структура:**
```
┌─────────────────────────────────────┐
│ Sidebar │ Header                    │
│         ├───────────────────────────┤
│ - Home  │                           │
│ - Proj  │                           │
│ - Cont  │      Content Area         │
│         │                           │
│         │                           │
└─────────────────────────────────────┘
```

**Компоненты:**
- Sidebar: навигация
- Header: заголовок + кнопка Logout
- Content: {children}

**Auth check:**
```javascript
useEffect(() => {
  if (pathname === '/admin/login') return;
  
  const token = localStorage.getItem('auth-token');
  if (!token) {
    window.location.href = '/admin/login';
  }
}, [pathname]);
```

## Загрузка изображений

### Процесс
1. Пользователь выбирает файл
2. Показывается превью
3. При сохранении формы:
   - Файл отправляется на `/api/admin/upload`
   - Сервер сохраняет в `/public/uploads/`
   - Возвращается URL
   - URL сохраняется в БД вместе с проектом

### API Route: /api/admin/upload

```javascript
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request) {
  // Проверка токена
  const user = verifyToken(request);
  if (!user) {
    return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  
  // Получить файл
  const formData = await request.formData();
  const file = formData.get('file');
  
  // Проверки
  if (!file) {
    return Response.json({ success: false, error: 'No file' }, { status: 400 });
  }
  
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return Response.json({ success: false, error: 'File too large' }, { status: 400 });
  }
  
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return Response.json({ success: false, error: 'Invalid file type' }, { status: 400 });
  }
  
  // Сохранить файл
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const timestamp = Date.now();
  const filename = `${timestamp}-${file.name}`;
  const filepath = join(process.cwd(), 'public', 'uploads', filename);
  
  await writeFile(filepath, buffer);
  
  return Response.json({
    success: true,
    data: { url: `/uploads/${filename}` }
  });
}
```

## Analytics Tracking

### Компонент: components/AnalyticsTracker.tsx

```javascript
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  
  useEffect(() => {
    // Не трекать админку
    if (pathname.startsWith('/admin')) return;
    
    // Отправить pageview
    fetch('/api/track/pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname })
    });
  }, [pathname]);
  
  return null;
}
```

### API Route: /api/track/pageview

```javascript
import { getDatabase } from '@/lib/db/simple-client';
import { randomUUID } from 'crypto';

export async function POST(request) {
  const { path } = await request.json();
  
  const db = getDatabase();
  const now = new Date().toISOString();
  
  // Получить IP (опционально)
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || null;
  
  db.prepare(`
    INSERT INTO pageviews (id, path, ip, timestamp)
    VALUES (?, ?, ?, ?)
  `).run(randomUUID(), path, ip, now);
  
  return Response.json({ success: true });
}
```

## Стили

### Подход
- CSS Modules для каждой страницы
- Простые, чистые стили
- Responsive (минимум 768px)

### Цветовая схема
```css
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --text-primary: #000000;
  --text-secondary: #666666;
  --border: #e0e0e0;
  --accent: #0066cc;
  --success: #00aa00;
  --error: #cc0000;
}
```

## Файловая структура

```
app/
├── admin/
│   ├── layout.tsx              # Layout с sidebar
│   ├── page.tsx                # Dashboard
│   ├── login/
│   │   └── page.tsx            # Логин
│   ├── projects/
│   │   ├── page.tsx            # Список проектов
│   │   ├── new/
│   │   │   └── page.tsx        # Новый проект
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx    # Редактировать проект
│   └── contacts/
│       └── page.tsx            # Контакты
├── api/
│   ├── admin/
│   │   ├── auth/
│   │   │   └── login/
│   │   │       └── route.ts    # POST логин
│   │   ├── projects/
│   │   │   ├── route.ts        # GET/POST проекты
│   │   │   └── [id]/
│   │   │       └── route.ts    # GET/PUT/DELETE проект
│   │   ├── upload/
│   │   │   └── route.ts        # POST загрузка файла
│   │   ├── contacts/
│   │   │   └── route.ts        # GET/PUT контакты
│   │   └── stats/
│   │       └── route.ts        # GET статистика
│   └── track/
│       └── pageview/
│           └── route.ts        # POST трекинг
├── layout.tsx                  # Root layout
└── page.tsx                    # Home page

components/
├── admin/
│   ├── Sidebar.tsx             # Боковое меню
│   └── Header.tsx              # Шапка админки
└── AnalyticsTracker.tsx        # Трекинг компонент

lib/
└── db/
    ├── simple-client.ts        # SQLite клиент
    └── simple-init.ts          # Инициализация БД

public/
└── uploads/                    # Загруженные изображения

styles/
└── admin/
    ├── Login.module.css
    ├── Dashboard.module.css
    ├── Projects.module.css
    ├── ProjectForm.module.css
    └── Contacts.module.css
```

## Что используем из существующего кода

### Можно переиспользовать:
- ✅ `app/admin/login/page.tsx` - уже работает!
- ✅ `lib/db/client.ts` - SQLite клиент
- ✅ `lib/services/auth.service.ts` - логин логика
- ✅ Стили из `styles/admin/`

### Что упростим/перепишем:
- ❌ Middleware - уберем, проверка в layout
- ❌ Сложные API routes - упростим
- ❌ Валидация - минимальная
- ❌ Логирование - уберем
- ❌ Rate limiting - уберем

## План миграции

1. Создать новую БД структуру (упрощенную)
2. Скопировать данные из старой БД
3. Обновить API routes (упростить)
4. Обновить страницы админки
5. Тестировать каждую функцию отдельно
