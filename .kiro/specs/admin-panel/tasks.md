# План реализации: Админ-панель портфолио сайта

## Обзор

Реализация защищенной админ-панели для управления контентом портфолио сайта на Next.js 14. Система включает аутентификацию, управление проектами и контентом, загрузку изображений, аналитику посещений и логирование. Используется SQLite для хранения данных, JWT для аутентификации, TypeScript для типобезопасности.

## Задачи

- [x] 1. Настройка инфраструктуры и базы данных
  - [x] 1.1 Установить зависимости и настроить SQLite
    - Установить пакеты: better-sqlite3, bcryptjs, jsonwebtoken, sharp, @types для всех библиотек
    - Создать lib/db/client.ts с SQLite клиентом
    - _Требования: 12.1_

  - [x] 1.2 Создать схему базы данных и миграции
    - Создать lib/db/schema.ts с TypeScript типами для всех таблиц
    - Создать lib/db/migrations/001_initial.sql с SQL схемой (users, sessions, projects, site_content, contact_info, images, page_views, clicks, form_submissions, logs, archived_logs)
    - Создать скрипт инициализации БД
    - _Требования: 12.1, 12.2_

  - [x] 1.3 Создать TypeScript типы и интерфейсы
    - Создать lib/types/admin.ts с интерфейсами для проектов, контента, сессий
    - Создать lib/types/analytics.ts с интерфейсами для аналитики
    - Создать lib/types/logger.ts с интерфейсами для логирования
    - _Требования: все_

- [x] 2. Реализация системы аутентификации
  - [x] 2.1 Создать Auth Service с хешированием паролей
    - Реализовать lib/services/auth.service.ts с методами login, verifySession, logout, isSessionExpired
    - Использовать bcrypt с 12 salt rounds для хеширования паролей
    - Реализовать генерацию JWT токенов с TTL 24 часа
    - _Требования: 1.2, 1.4, 1.5, 11.1_

  - [ ]* 2.2 Написать property test для Auth Service
    - **Property 1: Invalid credentials rejection**
    - **Property 40: Password hashing strength**
    - **Проверяет: Требования 1.3, 11.1**

  - [x] 2.3 Создать API endpoints для аутентификации
    - Создать app/api/admin/auth/login/route.ts (POST) с валидацией credentials
    - Создать app/api/admin/auth/logout/route.ts (POST) с удалением сессии
    - Установить HTTP-only cookies с флагами Secure, SameSite=Strict
    - _Требования: 1.2, 1.4_

  - [ ]* 2.4 Написать property test для session cookies
    - **Property 2: Session cookie security**
    - **Проверяет: Требования 1.4**

  - [x] 2.5 Реализовать middleware для защиты маршрутов
    - Создать app/middleware.ts с проверкой JWT токена
    - Защитить все /admin/* маршруты кроме /admin/login
    - Реализовать редирект на /admin/login для неаутентифицированных пользователей
    - Проверять expiration time сессии
    - _Требования: 1.5, 1.6, 1.7_

  - [ ]* 2.6 Написать property tests для защиты маршрутов
    - **Property 3: Expired session redirect**
    - **Property 4: Protected routes authentication**
    - **Проверяет: Требования 1.5, 1.6, 1.7**

  - [x] 2.7 Реализовать rate limiting для login
    - Создать lib/utils/rate-limiter.ts с отслеживанием попыток по IP
    - Ограничить до 5 попыток за 15 минут
    - Блокировать IP на 15 минут при превышении лимита
    - Логировать все неудачные попытки входа
    - _Требования: 11.5, 11.6, 11.7_

  - [ ]* 2.8 Написать property test для rate limiting
    - **Property 42: Rate limiting enforcement**
    - **Проверяет: Требования 11.5, 11.6**

  - [x] 2.9 Создать страницу логина
    - Создать app/admin/login/page.tsx с формой входа
    - Реализовать CSRF защиту для формы
    - Добавить обработку ошибок и отображение сообщений
    - Добавить стили в styles/admin/Login.module.css
    - _Требования: 1.1, 1.3, 11.2_

  - [ ]* 2.10 Написать unit tests для страницы логина
    - Проверить наличие формы с полями email и password
    - Проверить отображение ошибок при неверных credentials
    - Проверить редирект после успешного входа
    - _Требования: 1.1, 1.3_

- [x] 3. Checkpoint - Проверка аутентификации
  - Убедиться, что все тесты проходят
  - Проверить работу логина и защиты маршрутов
  - Спросить пользователя, если возникли вопросы

- [x] 4. Реализация системы логирования
  - [x] 4.1 Создать Logger Service
    - Реализовать lib/services/logger.service.ts с методами logAdminAction, logSystemError, logSecurityEvent
    - Реализовать методы getLogs, searchLogs, archiveLogs, deleteLogs
    - Добавить поддержку фильтрации по дате, типу действия, severity
    - _Требования: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [ ]* 4.2 Написать property tests для Logger Service
    - **Property 29: Comprehensive logging**
    - **Property 30: Log chronological ordering**
    - **Property 31: Log filtering**
    - **Property 32: Log keyword search**
    - **Проверяет: Требования 8.1, 8.2, 8.3, 8.4, 8.5, 8.6**

  - [x] 4.3 Реализовать автоматическую архивацию логов
    - Создать cron job для архивации логов старше 90 дней
    - Перемещать старые логи в таблицу archived_logs
    - _Требования: 8.7, 8.8_

  - [ ]* 4.4 Написать property test для retention policy
    - **Property 33: Log retention policy**
    - **Проверяет: Требования 8.7, 8.8**

- [x] 5. Реализация управления изображениями
  - [x] 5.1 Создать Image Service
    - Реализовать lib/services/image.service.ts с методами uploadImage, deleteImage, optimizeImage, getImageMetadata
    - Использовать Sharp для оптимизации и resize изображений
    - Генерировать уникальные имена файлов: {timestamp}-{random}.{ext}
    - Сохранять изображения в /public/images/{type}/
    - _Требования: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ]* 5.2 Написать property tests для Image Service
    - **Property 9: Image format validation**
    - **Property 10: Image size validation**
    - **Property 11: Image optimization**
    - **Property 12: Filename uniqueness**
    - **Property 13: Image storage location**
    - **Проверяет: Требования 3.1, 3.2, 3.3, 3.4, 3.5**

  - [x] 5.3 Реализовать специальную обработку аватаров
    - Добавить resize до 200x200px для типа 'avatar'
    - Сохранять аватары в /public/images/avatar/
    - _Требования: 3.9_

  - [ ]* 5.4 Написать property test для avatar resizing
    - **Property 15: Avatar resizing**
    - **Проверяет: Требования 3.9**

  - [x] 5.5 Создать API endpoint для загрузки изображений
    - Создать app/api/admin/images/route.ts (POST, DELETE)
    - Валидировать формат файла (JPEG, PNG, WebP) и размер (max 5MB)
    - Записывать метаданные в таблицу images
    - Возвращать URL загруженного изображения
    - _Требования: 3.1, 3.2, 3.5_

  - [x] 5.6 Создать компонент ImageUploader
    - Создать components/admin/ImageUploader.tsx с drag-and-drop
    - Добавить preview изображения перед загрузкой
    - Показывать progress bar во время загрузки
    - Добавить стили в styles/admin/ImageUploader.module.css
    - _Требования: 3.6_

  - [ ]* 5.7 Написать unit tests для ImageUploader
    - Проверить отображение preview
    - Проверить валидацию формата и размера на клиенте
    - Проверить обработку ошибок загрузки
    - _Требования: 3.6_

- [x] 6. Реализация управления проектами
  - [x] 6.1 Создать Content Service для проектов
    - Реализовать lib/services/content.service.ts с методами getProjects, getProject, createProject, updateProject, deleteProject, reorderProjects
    - Добавить валидацию обязательных полей (title, description, category, year)
    - Реализовать транзакции для атомарности операций
    - _Требования: 2.1, 2.3, 2.4, 2.6, 2.9, 12.2_

  - [ ]* 6.2 Написать property tests для Content Service
    - **Property 5: Project list completeness**
    - **Property 6: Required fields validation**
    - **Property 7: Project ID preservation**
    - **Property 16: Input validation**
    - **Проверяет: Требования 2.1, 2.3, 2.6, 11.3**

  - [x] 6.3 Реализовать каскадное удаление изображений
    - При удалении проекта удалять связанные изображения из файловой системы
    - Удалять записи из таблицы images
    - _Требования: 2.8_

  - [ ]* 6.4 Написать property test для cascading deletion
    - **Property 8: Cascading image deletion**
    - **Property 14: Image replacement**
    - **Проверяет: Требования 2.8, 3.7**

  - [x] 6.5 Создать API endpoints для проектов
    - Создать app/api/admin/projects/route.ts (GET, POST)
    - Создать app/api/admin/projects/[id]/route.ts (GET, PUT, DELETE)
    - Добавить валидацию и sanitization входных данных
    - Логировать все операции через Logger Service
    - _Требования: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 8.1_

  - [x] 6.6 Создать компонент ProjectForm
    - Создать components/admin/ProjectForm.tsx с полями: title, description, category, year, image, imageAlt, wide, featured
    - Интегрировать ImageUploader для загрузки изображений
    - Добавить валидацию на клиенте
    - Добавить стили в styles/admin/ProjectForm.module.css
    - _Требования: 2.2, 2.3_

  - [ ]* 6.7 Написать unit tests для ProjectForm
    - Проверить наличие всех обязательных полей
    - Проверить валидацию перед отправкой
    - Проверить интеграцию с ImageUploader
    - _Требования: 2.2, 2.3_

  - [x] 6.8 Создать страницу списка проектов
    - Создать app/admin/projects/page.tsx с отображением всех проектов
    - Добавить drag-and-drop для изменения порядка проектов
    - Добавить кнопки редактирования и удаления
    - Реализовать диалог подтверждения удаления
    - Добавить стили в styles/admin/Projects.module.css
    - _Требования: 2.1, 2.7, 2.9_

  - [x] 6.9 Создать страницы создания и редактирования проекта
    - Создать app/admin/projects/new/page.tsx для создания
    - Создать app/admin/projects/[id]/edit/page.tsx для редактирования
    - Использовать компонент ProjectForm
    - Добавить обработку успеха/ошибок с уведомлениями
    - _Требования: 2.2, 2.5, 10.7_

  - [ ]* 6.10 Написать unit tests для страниц проектов
    - Проверить отображение списка проектов
    - Проверить наличие форм создания и редактирования
    - Проверить диалог подтверждения удаления
    - _Требования: 2.1, 2.2, 2.5, 2.7_

- [x] 7. Checkpoint - Проверка управления проектами
  - Убедиться, что все тесты проходят
  - Проверить CRUD операции для проектов
  - Проверить загрузку и удаление изображений
  - Спросить пользователя, если возникли вопросы

- [x] 8. Реализация управления контентом сайта
  - [x] 8.1 Расширить Content Service для site content и contact info
    - Добавить методы getSiteContent, updateSiteContent, getContactInfo, updateContactInfo
    - Добавить валидацию формата email
    - Реализовать транзакции для обновлений
    - _Требования: 4.1, 4.2, 4.3, 4.4, 4.5, 12.2_

  - [ ]* 8.2 Написать property tests для content validation
    - **Property 16: Input validation**
    - **Property 17: Email format validation**
    - **Проверяет: Требования 4.3, 4.4, 11.3**

  - [x] 8.3 Создать API endpoint для контента
    - Создать app/api/admin/content/route.ts (GET, PUT)
    - Обрабатывать site_content и contact_info
    - Добавить валидацию и sanitization
    - Логировать изменения через Logger Service
    - _Требования: 4.1, 4.2, 4.3, 4.4, 4.5, 8.1_

  - [x] 8.4 Создать компонент ContentEditor
    - Создать components/admin/ContentEditor.tsx для редактирования about, manifesto, skills
    - Добавить rich text editor для about секции
    - Добавить формы для редактирования contact info
    - Реализовать preview изменений перед сохранением
    - Добавить стили в styles/admin/ContentEditor.module.css
    - _Требования: 4.1, 4.2, 4.6, 4.7_

  - [x] 8.5 Создать страницу редактирования контента
    - Создать app/admin/content/page.tsx
    - Использовать компонент ContentEditor
    - Добавить обработку успеха/ошибок с уведомлениями
    - _Требования: 4.1, 4.2, 10.7_

  - [ ]* 8.6 Написать unit tests для ContentEditor
    - Проверить наличие интерфейсов редактирования
    - Проверить preview функциональность
    - Проверить валидацию email
    - _Требования: 4.1, 4.2, 4.4, 4.6_

- [x] 9. Реализация системы аналитики
  - [x] 9.1 Создать Analytics Service
    - Реализовать lib/services/analytics.service.ts с методами trackPageView, trackClick, trackSubmission
    - Реализовать методы getPageViews, getClicks, getSubmissions, getUniqueVisitors
    - Реализовать методы getTopPages, getClickThroughRate, getConversionRate
    - Добавить поддержку фильтрации по датам и группировки по периодам
    - _Требования: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ]* 9.2 Написать property tests для Analytics Service
    - **Property 18: Analytics event recording**
    - **Property 19: Analytics count accuracy**
    - **Property 20: Analytics grouping by period**
    - **Property 21: Date range filtering**
    - **Property 22: Unique visitors calculation**
    - **Property 23: Descending sort order**
    - **Property 24: Click-through rate calculation**
    - **Property 25: Conversion rate calculation**
    - **Проверяет: Требования 5.1-5.7, 6.1-6.5, 7.1-7.4**

  - [x] 9.3 Создать API endpoints для трекинга событий
    - Создать app/api/track/pageview/route.ts (POST)
    - Создать app/api/track/click/route.ts (POST)
    - Создать app/api/track/submission/route.ts (POST)
    - Генерировать sessionId на клиенте и хранить в localStorage
    - _Требования: 5.1, 5.2, 6.1, 6.2, 7.1_

  - [x] 9.4 Создать API endpoints для получения аналитики
    - Создать app/api/admin/analytics/pageviews/route.ts (GET)
    - Создать app/api/admin/analytics/clicks/route.ts (GET)
    - Создать app/api/admin/analytics/submissions/route.ts (GET)
    - Поддержать query параметры для фильтрации и группировки
    - _Требования: 5.3, 5.4, 5.5, 5.6, 5.7, 6.3, 6.4, 6.5, 7.2, 7.3, 7.4_

  - [x] 9.5 Интегрировать трекинг в публичную часть сайта
    - Добавить трекинг page views в layout.tsx
    - Добавить трекинг кликов на кнопки контакта и навигации
    - Добавить трекинг отправки контактной формы
    - Реализовать асинхронную отправку событий (не блокировать UI)
    - _Требования: 5.1, 5.2, 6.1, 6.2, 7.1_

  - [x] 9.6 Реализовать хранение и управление заявками
    - Сохранять данные формы (name, email, message, timestamp) в таблицу form_submissions
    - Реализовать функцию отметки заявок как прочитанных/непрочитанных
    - _Требования: 7.5, 7.6, 7.7_

  - [ ]* 9.7 Написать property tests для form submissions
    - **Property 26: Form submission data persistence**
    - **Property 27: Recent submissions display**
    - **Property 28: Submission read status toggle**
    - **Проверяет: Требования 7.5, 7.6, 7.7**

  - [x] 9.8 Создать компонент AnalyticsChart
    - Создать components/admin/AnalyticsChart.tsx для визуализации данных
    - Реализовать графики для page views, clicks, submissions по периодам
    - Добавить фильтры по датам и группировке (день/неделя/месяц)
    - Добавить стили в styles/admin/Analytics.module.css
    - _Требования: 5.4, 5.5, 6.3, 6.5, 7.3_

  - [x] 9.9 Создать страницу аналитики
    - Создать app/admin/analytics/page.tsx
    - Отображать статистику page views с группировкой и фильтрацией
    - Отображать статистику кликов по элементам
    - Отображать статистику заявок с conversion rate
    - Отображать список последних заявок с полными данными
    - Использовать компонент AnalyticsChart
    - _Требования: 5.3, 5.4, 5.5, 5.6, 5.7, 6.3, 6.4, 6.5, 7.2, 7.3, 7.4, 7.6, 7.7_

  - [ ]* 9.10 Написать unit tests для страницы аналитики
    - Проверить отображение всех метрик
    - Проверить работу фильтров
    - Проверить отображение списка заявок
    - _Требования: 5.3, 5.4, 5.5, 6.3, 7.2, 7.3, 7.6_

- [x] 10. Checkpoint - Проверка аналитики
  - Убедиться, что все тесты проходят
  - Проверить трекинг событий на публичной части
  - Проверить отображение статистики в админ-панели
  - Спросить пользователя, если возникли вопросы

- [x] 11. Реализация интерфейса логов
  - [x] 11.1 Создать API endpoint для логов
    - Создать app/api/admin/logs/route.ts (GET)
    - Поддержать фильтрацию по дате, типу действия, severity
    - Поддержать поиск по ключевым словам
    - Возвращать логи в обратном хронологическом порядке
    - _Требования: 8.4, 8.5, 8.6_

  - [x] 11.2 Создать компонент LogsTable
    - Создать components/admin/LogsTable.tsx для отображения логов
    - Добавить фильтры по дате, типу, severity
    - Добавить поле поиска по ключевым словам
    - Добавить пагинацию для больших объемов данных
    - Добавить стили в styles/admin/Logs.module.css
    - _Требования: 8.4, 8.5, 8.6_

  - [x] 11.3 Создать страницу логов
    - Создать app/admin/logs/page.tsx
    - Использовать компонент LogsTable
    - Отображать логи с фильтрацией и поиском
    - _Требования: 8.4, 8.5, 8.6_

  - [ ]* 11.4 Написать unit tests для страницы логов
    - Проверить отображение логов
    - Проверить работу фильтров
    - Проверить поиск по ключевым словам
    - _Требования: 8.4, 8.5, 8.6_

- [x] 12. Реализация системы бэкапов
  - [x] 12.1 Создать утилиты для бэкапов
    - Создать lib/utils/backup.ts с функциями createBackup, restoreBackup, listBackups, deleteOldBackups
    - Реализовать создание копии SQLite базы данных
    - Реализовать архивацию директории /public/images/
    - Создавать metadata.json с информацией о бэкапе
    - Сохранять бэкапы в /backups/{timestamp}/
    - _Требования: 12.4, 12.6_

  - [ ]* 12.2 Написать property tests для backup system
    - **Property 43: Data persistence**
    - **Property 44: Transaction atomicity**
    - **Property 45: Backup retention limit**
    - **Проверяет: Требования 12.1, 12.2, 12.3, 12.5**

  - [x] 12.2 Реализовать автоматические бэкапы
    - Создать cron job для ежедневных бэкапов в 03:00 UTC
    - Автоматически удалять бэкапы старше 7 дней
    - Логировать успешные и неудачные бэкапы
    - _Требования: 12.4, 12.5_

  - [x] 12.3 Создать API endpoints для бэкапов
    - Создать app/api/admin/backup/create/route.ts (POST) для ручного создания
    - Создать app/api/admin/backup/restore/route.ts (POST) для восстановления
    - Создать app/api/admin/backup/list/route.ts (GET) для списка бэкапов
    - Реализовать rollback при ошибках восстановления
    - _Требования: 12.3, 12.6, 12.7_

  - [x] 12.4 Создать страницу настроек с управлением бэкапами
    - Создать app/admin/settings/page.tsx
    - Добавить кнопку ручного создания бэкапа
    - Добавить список доступных бэкапов с возможностью восстановления
    - Отображать информацию о последнем автоматическом бэкапе
    - Добавить стили в styles/admin/Settings.module.css
    - _Требования: 12.6, 12.7_

  - [ ]* 12.5 Написать unit tests для страницы настроек
    - Проверить наличие функции ручного бэкапа
    - Проверить наличие интерфейса восстановления
    - Проверить отображение списка бэкапов
    - _Требования: 12.6, 12.7_

- [x] 13. Реализация дашборда и навигации
  - [x] 13.1 Создать компоненты навигации
    - Создать components/admin/Sidebar.tsx с навигацией по секциям: Dashboard, Projects, Content, Analytics, Logs, Settings
    - Создать components/admin/Header.tsx с информацией о сессии и кнопкой logout
    - Подсвечивать активную секцию в навигации
    - Добавить стили в styles/admin/Admin.module.css
    - _Требования: 10.1, 10.2, 10.3_

  - [ ]* 13.2 Написать unit tests для навигации
    - Проверить наличие всех секций в sidebar
    - Проверить подсветку активной секции
    - Проверить наличие кнопки logout
    - _Требования: 10.1, 10.2, 10.3_

  - [x] 13.3 Создать layout для админ-панели
    - Создать app/admin/layout.tsx с Sidebar и Header
    - Добавить loading indicators для асинхронных операций
    - Добавить систему уведомлений для success/error сообщений
    - Обеспечить responsive design (минимум 1024px)
    - _Требования: 10.1, 10.5, 10.6, 10.7_

  - [x] 13.4 Создать страницу дашборда
    - Создать app/admin/page.tsx
    - Отображать summary statistics: total projects, page views (last 30 days), form submissions (last 30 days)
    - Отображать recent activity: last 5 admin actions, last 5 form submissions
    - Отображать quick access links к основным секциям
    - Отображать информацию о текущей сессии (email, session start time)
    - Реализовать автоматическое обновление статистики каждые 60 секунд
    - Добавить стили в styles/admin/Dashboard.module.css
    - _Требования: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

  - [ ]* 13.5 Написать property tests для дашборда
    - **Property 34: Dashboard statistics accuracy**
    - **Property 35: Recent activity limit**
    - **Property 36: Session information display**
    - **Проверяет: Требования 9.2, 9.3, 9.5**

  - [ ]* 13.6 Написать unit tests для дашборда
    - Проверить наличие дашборда по маршруту /admin
    - Проверить отображение всех summary statistics
    - Проверить отображение quick access links
    - _Требования: 9.1, 9.2, 9.4_

  - [x] 13.7 Реализовать функцию logout
    - Обработать клик на кнопку logout
    - Вызвать API endpoint /api/admin/auth/logout
    - Удалить сессию из базы данных
    - Очистить cookie с токеном
    - Редиректить на /admin/login
    - Логировать действие через Logger Service
    - _Требования: 10.4, 8.1_

  - [ ]* 13.8 Написать property test для logout
    - **Property 38: Logout session termination**
    - **Проверяет: Требования 10.4**

- [x] 14. Checkpoint - Проверка UI и навигации
  - Убедиться, что все тесты проходят
  - Проверить навигацию между всеми страницами
  - Проверить отображение уведомлений
  - Проверить работу logout
  - Спросить пользователя, если возникли вопросы

- [x] 15. Реализация дополнительных security мер
  - [x] 15.1 Реализовать CSRF защиту
    - Создать lib/utils/csrf.ts с генерацией и валидацией CSRF токенов
    - Добавить CSRF токены во все формы админ-панели
    - Валидировать CSRF токены на сервере для всех POST/PUT/DELETE запросов
    - _Требования: 11.2_

  - [ ]* 15.2 Написать property test для CSRF protection
    - **Property 41: CSRF protection**
    - **Проверяет: Требования 11.2**

  - [x] 15.3 Реализовать SQL injection защиту
    - Использовать parameterized queries во всех SQL запросах
    - Добавить валидацию и sanitization всех входных данных
    - _Требования: 11.4_

  - [x] 15.4 Создать утилиты валидации и sanitization
    - Создать lib/utils/validation.ts с функциями для валидации email, URL, текста
    - Создать функции sanitization для предотвращения XSS
    - Использовать во всех API endpoints
    - _Требования: 11.3_

- [x] 16. Миграция данных из lib/data.ts
  - [x] 16.1 Создать скрипт миграции данных
    - Создать scripts/migrate-data.ts
    - Импортировать существующие проекты из lib/data.ts в таблицу projects
    - Импортировать site content и contact info
    - Создать начального admin пользователя (email: baracuda.max1@gmail.com)
    - Сохранить хеш пароля в таблицу users
    - _Требования: 1.2, 2.1, 4.1, 4.2_

  - [x] 16.2 Обновить публичную часть сайта для работы с БД
    - Обновить lib/data.ts для чтения данных из БД вместо статических данных
    - Обеспечить обратную совместимость интерфейсов
    - Протестировать отображение данных на публичных страницах
    - _Требования: 2.1, 4.1, 4.2_

  - [ ]* 16.3 Написать unit tests для миграции
    - Проверить корректность импорта всех проектов
    - Проверить корректность импорта site content
    - Проверить создание admin пользователя
    - _Требования: 1.2, 2.1, 4.1_

- [x] 17. Финальная интеграция и тестирование
  - [x] 17.1 Написать integration tests для критических user flows
    - Тест: полный цикл аутентификации (login -> access protected route -> logout)
    - Тест: создание проекта с загрузкой изображения
    - Тест: редактирование и удаление проекта
    - Тест: обновление site content и contact info
    - Тест: трекинг аналитических событий и отображение статистики
    - _Требования: все_

  - [x] 17.2 Проверить покрытие всех correctness properties
    - Убедиться, что все 45 properties имеют property-based tests
    - Запустить все тесты с минимум 100 итерациями
    - Исправить failing tests
    - _Требования: все_

  - [x] 17.3 Провести ручное тестирование
    - Проверить responsive design на разных разрешениях (минимум 1024px)
    - Проверить визуальное качество оптимизированных изображений
    - Проверить UX flow для всех операций
    - Проверить читаемость error messages
    - Проверить производительность при больших объемах данных
    - _Требования: 10.5_

  - [x] 17.4 Оптимизация и финальные доработки
    - Проверить и оптимизировать SQL queries (добавить индексы где необходимо)
    - Добавить error boundaries для React компонентов
    - Проверить обработку всех edge cases
    - Добавить graceful degradation для некритичных функций
    - _Требования: все_

  - [x] 17.5 Создать документацию для развертывания
    - Документировать процесс инициализации БД
    - Документировать процесс миграции данных
    - Документировать настройку cron jobs для бэкапов и архивации логов
    - Документировать переменные окружения (JWT_SECRET, DATABASE_PATH)
    - _Требования: все_

- [x] 18. Final checkpoint - Завершение реализации
  - Убедиться, что все тесты проходят (unit, property-based, integration)
  - Проверить работу всех функций админ-панели
  - Проверить работу публичной части сайта с новой БД
  - Убедиться, что все требования выполнены
  - Спросить пользователя о готовности к деплою


## Примечания

- Задачи, отмеченные `*`, являются опциональными и могут быть пропущены для более быстрого MVP
- Каждая задача ссылается на конкретные требования для отслеживаемости
- Checkpoints обеспечивают инкрементальную валидацию
- Property tests проверяют универсальные свойства корректности
- Unit tests проверяют конкретные примеры и edge cases
- Integration tests проверяют end-to-end flows

## Технологический стек

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.3+
- **Database**: SQLite (better-sqlite3)
- **Authentication**: JWT с HTTP-only cookies
- **Password Hashing**: bcryptjs
- **Image Processing**: Sharp
- **Styling**: CSS Modules
- **Testing**: Jest + fast-check (property-based testing)

## Порядок выполнения

Задачи организованы в логическом порядке с учетом зависимостей:
1. Инфраструктура и БД (задачи 1.x)
2. Аутентификация (задачи 2.x)
3. Логирование (задачи 4.x) - нужно для логирования всех последующих действий
4. Управление изображениями (задачи 5.x)
5. Управление проектами (задачи 6.x)
6. Управление контентом (задачи 8.x)
7. Аналитика (задачи 9.x)
8. Интерфейс логов (задачи 11.x)
9. Система бэкапов (задачи 12.x)
10. Дашборд и навигация (задачи 13.x)
11. Security меры (задачи 15.x)
12. Миграция данных (задачи 16.x)
13. Финальная интеграция (задачи 17.x)
