# Упрощенная админка - Задачи

## Фаза 1: Подготовка базы данных

### 1.1 Создать упрощенный DB клиент
- [x] Создать `lib/db/simple-client.ts`
- [x] Экспортировать функцию `getDatabase()`
- [x] Использовать better-sqlite3
- [x] Путь к БД: `admin.db` в корне проекта

### 1.2 Создать скрипт инициализации БД
- [x] Создать `lib/db/simple-init.ts`
- [x] Создать таблицу `users` (id, email, password_hash, created_at)
- [x] Создать таблицу `projects` (id, title, description, category, year, image, image_alt, created_at, updated_at)
- [x] Создать таблицу `content` (key, value, updated_at)
- [x] Создать таблицу `pageviews` (id, path, ip, timestamp)
- [x] Создать админ пользователя (email: baracuda.max1@gmail.com, password: Raf070100)

### 1.3 Создать скрипт запуска инициализации
- [x] Создать `scripts/init-simple-db.ts`
- [x] Вызывать функцию инициализации из `simple-init.ts`
- [x] Добавить команду в package.json: `"init-db": "tsx scripts/init-simple-db.ts"`

## Фаза 2: API Routes - Авторизация

### 2.1 Упростить API логина
- [x] Обновить `/api/admin/auth/login/route.ts`
- [x] Убрать rate limiting
- [x] Убрать логирование
- [x] Простая проверка email/password
- [x] Возвращать токен в body: `{ success: true, token: "..." }`

### 2.2 Создать helper для проверки токена
- [x] Создать `lib/auth-simple.ts`
- [x] Функция `verifyToken(request)` - проверяет Bearer токен
- [x] Возвращает `{ userId, email }` или `null`

## Фаза 3: API Routes - Проекты

### 3.1 Упростить GET /api/admin/projects
- [x] Обновить `app/api/admin/projects/route.ts`
- [x] Добавить проверку токена через `verifyToken()`
- [x] Прямой запрос к БД: `SELECT * FROM projects ORDER BY created_at DESC`
- [x] Возвращать: `{ success: true, data: [...] }`

### 3.2 Упростить POST /api/admin/projects
- [x] В том же файле `route.ts`
- [x] Проверка токена
- [x] Проверка обязательных полей (title, description, category, year)
- [x] INSERT в БД
- [x] Возвращать: `{ success: true, data: { id, ... } }`

### 3.3 Упростить GET /api/admin/projects/[id]
- [x] Обновить `app/api/admin/projects/[id]/route.ts`
- [ ] Проверка токена
- [x] SELECT WHERE id = ?
- [x] Возвращать: `{ success: true, data: { ... } }`

### 3.4 Упростить PUT /api/admin/projects/[id]
- [x] В том же файле
- [ ] Проверка токена
- [x] UPDATE projects SET ... WHERE id = ?
- [ ] Возвращать: `{ success: true, data: { ... } }`

### 3.5 Упростить DELETE /api/admin/projects/[id]
- [ ] В том же файле
- [ ] Проверка токена
- [x] DELETE FROM projects WHERE id = ?
- [x] Возвращать: `{ success: true }`

## Фаза 4: API Routes - Загрузка файлов

### 4.1 Создать API для загрузки изображений
- [x] Создать `app/api/admin/upload/route.ts`
- [ ] Проверка токена
- [x] Получить файл из FormData
- [x] Проверка типа файла (jpg, png, webp)
- [x] Проверка размера (макс 5MB)
- [x] Сохранить в `public/uploads/`
- [x] Имя файла: `{timestamp}-{original-name}`
- [x] Возвращать: `{ success: true, data: { url: "/uploads/..." } }`

### 4.2 Создать папку для загрузок
- [x] Создать `public/uploads/` если не существует
- [x] Добавить `.gitkeep` в папку

## Фаза 5: API Routes - Контакты и статистика

### 5.1 Создать API для контактов
- [x] Создать `app/api/admin/contacts/route.ts`
- [x] GET: проверка токена, SELECT value FROM content WHERE key = 'contacts'
- [x] PUT: проверка токена, INSERT OR REPLACE INTO content
- [x] Возвращать: `{ success: true, data: { email, telegram, behance, dribbble } }`

### 5.2 Создать API для статистики
- [x] Создать `app/api/admin/stats/route.ts`
- [ ] Проверка токена
- [x] Подсчитать количество проектов
- [x] Подсчитать просмотры за 30 дней
- [x] Получить последние 5 просмотров
- [x] Возвращать: `{ success: true, data: { totalProjects, pageviewsLast30Days, recentPageviews } }`

### 5.3 Создать API для трекинга
- [x] Создать `app/api/track/pageview/route.ts`
- [x] БЕЗ проверки токена (публичный endpoint)
- [x] Получить path из body
- [x] Получить IP из headers (опционально)
- [x] INSERT INTO pageviews
- [ ] Возвращать: `{ success: true }`

## Фаза 6: Страницы - Layout и Login

### 6.1 Упростить admin layout
- [x] Обновить `app/admin/layout.tsx`
- [x] Убрать сложную логику
- [x] Простая проверка токена в useEffect
- [x] Если нет токена и не /login - редирект на /login
- [x] Если /login - показать без layout
- [x] Если есть токен - показать Sidebar + Header + children

### 6.2 Проверить страницу логина
- [x] `app/admin/login/page.tsx` уже работает
- [x] Убедиться что токен сохраняется в localStorage
- [x] Убедиться что редирект на /admin работает

## Фаза 7: Страницы - Dashboard

### 7.1 Упростить dashboard
- [x] Обновить `app/admin/page.tsx`
- [ ] Убрать сложную логику
- [x] Загрузить статистику из `/api/admin/stats`
- [x] Показать 3 карточки: проекты, просмотры, последние просмотры
- [x] Простой дизайн

## Фаза 8: Страницы - Проекты

### 8.1 Упростить список проектов
- [x] Обновить `app/admin/projects/page.tsx`
- [x] Загрузить проекты из `/api/admin/projects`
- [x] Показать карточки с превью
- [x] Кнопки Edit и Delete
- [x] Подтверждение при удалении

### 8.2 Упростить форму нового проекта
- [x] Обновить `app/admin/projects/new/page.tsx`
- [x] Форма с полями: title, description, category, year, image, image_alt
- [x] Загрузка изображения через `/api/admin/upload`
- [x] Создание проекта через `/api/admin/projects`
- [x] Редирект на список после сохранения

### 8.3 Упростить форму редактирования
- [x] Обновить `app/admin/projects/[id]/edit/page.tsx`
- [x] Загрузить данные проекта
- [x] Та же форма что и в new
- [x] Возможность загрузить новое изображение
- [x] Обновление через PUT `/api/admin/projects/[id]`
- [ ] Редирект на список после сохранения

## Фаза 9: Страницы - Контакты

### 9.1 Создать/упростить страницу контактов
- [x] Создать/обновить `app/admin/contacts/page.tsx`
- [x] Загрузить данные из `/api/admin/contacts`
- [x] Форма с полями: email, telegram, behance, dribbble
- [x] Сохранение через PUT `/api/admin/contacts`
- [x] Показать сообщение "Saved!" после сохранения

## Фаза 10: Компоненты

### 10.1 Упростить Sidebar
- [x] Обновить `components/admin/Sidebar.tsx`
- [x] Ссылки: Dashboard, Projects, Contacts
- [ ] Простой дизайн

### 10.2 Упростить Header
- [x] Обновить `components/admin/Header.tsx`
- [x] Заголовок страницы
- [x] Кнопка Logout
- [x] Logout: удалить токен из localStorage, редирект на /login

### 10.3 Создать Analytics Tracker
- [x] Создать `components/AnalyticsTracker.tsx`
- [x] Отслеживать изменения pathname
- [x] Не трекать /admin/*
- [x] Отправлять POST на `/api/track/pageview`

### 10.4 Добавить tracker в root layout
- [x] Обновить `app/layout.tsx`
- [x] Добавить `<AnalyticsTracker />` в body

## Фаза 11: Стили

### 11.1 Проверить существующие стили
- [x] Убедиться что `styles/admin/Login.module.css` существует
- [x] Убедиться что `styles/admin/Dashboard.module.css` существует
- [x] Убедиться что `styles/admin/Projects.module.css` существует

### 11.2 Создать недостающие стили
- [ ] Создать `styles/admin/ProjectForm.module.css` если нужно
- [ ] Создать `styles/admin/Contacts.module.css` если нужно
- [ ] Простые, чистые стили

## Фаза 12: Тестирование

### 12.1 Тест логина
- [ ] Открыть `/admin/login`
- [ ] Ввести email и password
- [ ] Проверить что токен сохранился в localStorage
- [ ] Проверить редирект на `/admin`

### 12.2 Тест dashboard
- [ ] Открыть `/admin`
- [ ] Проверить что статистика загружается
- [ ] Проверить что показываются карточки

### 12.3 Тест списка проектов
- [ ] Открыть `/admin/projects`
- [ ] Проверить что проекты загружаются
- [ ] Проверить кнопки Edit и Delete

### 12.4 Тест создания проекта
- [ ] Открыть `/admin/projects/new`
- [ ] Заполнить форму
- [ ] Загрузить изображение
- [ ] Сохранить
- [ ] Проверить что проект появился в списке

### 12.5 Тест редактирования проекта
- [ ] Открыть `/admin/projects/[id]/edit`
- [ ] Изменить данные
- [ ] Сохранить
- [ ] Проверить что изменения применились

### 12.6 Тест удаления проекта
- [ ] В списке проектов нажать Delete
- [ ] Подтвердить
- [ ] Проверить что проект удалился

### 12.7 Тест контактов
- [ ] Открыть `/admin/contacts`
- [ ] Изменить данные
- [ ] Сохранить
- [ ] Проверить что данные сохранились

### 12.8 Тест logout
- [ ] Нажать кнопку Logout
- [ ] Проверить что токен удалился из localStorage
- [ ] Проверить редирект на `/admin/login`

### 12.9 Тест защиты страниц
- [ ] Удалить токен из localStorage
- [ ] Попытаться открыть `/admin`
- [ ] Проверить редирект на `/admin/login`

### 12.10 Тест analytics tracking
- [ ] Открыть публичную страницу (например `/`)
- [ ] Проверить в БД что pageview записался
- [ ] Проверить что в dashboard показывается статистика

## Приоритеты выполнения

**Критично (сделать в первую очередь):**
1. Фаза 1: База данных
2. Фаза 2: API логина
3. Фаза 6: Layout и Login
4. Фаза 3: API проектов
5. Фаза 4: API загрузки файлов
6. Фаза 8: Страницы проектов

**Важно:**
7. Фаза 5: API контактов и статистики
8. Фаза 7: Dashboard
9. Фаза 9: Страницы контактов
10. Фаза 10: Компоненты

**Можно потом:**
11. Фаза 11: Стили (если нужно улучшить)
12. Фаза 12: Полное тестирование

## Заметки

- Каждая фаза должна быть протестирована перед переходом к следующей
- Если что-то не работает - остановиться и исправить
- Не переходить к следующей фазе пока текущая не работает
- Логин уже работает - это хорошая база!
