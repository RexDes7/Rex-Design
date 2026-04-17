# Technical Design Document: Admin Panel

## Overview

Админ-панель представляет собой защищенное веб-приложение для управления контентом портфолио сайта, построенное на Next.js 14 с использованием App Router. Система обеспечивает полный цикл управления проектами, контентом, изображениями, а также предоставляет аналитику посещений и систему логирования.

### Key Design Principles

1. **Security First**: Все административные маршруты защищены аутентификацией с использованием HTTP-only cookies и CSRF-защиты
2. **Type Safety**: Полная типизация на TypeScript для всех компонентов и API
3. **Progressive Enhancement**: Базовая функциональность работает без JavaScript, расширенные возможности добавляются прогрессивно
4. **Separation of Concerns**: Четкое разделение между слоями данных, бизнес-логики и представления
5. **Minimal Dependencies**: Использование встроенных возможностей Next.js и минимум внешних библиотек

### Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.3+
- **Database**: SQLite (для простоты развертывания и бэкапов)
- **Authentication**: Custom JWT-based auth с HTTP-only cookies
- **Styling**: CSS Modules (соответствует текущему стеку проекта)
- **File Storage**: Local filesystem (/public/images/)
- **Testing**: Jest + fast-check для property-based testing

## Architecture

### System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        UI[Admin UI Components]
        PublicUI[Public Site]
    end
    
    subgraph "Next.js App Router"
        AdminRoutes[/admin/* Routes]
        PublicRoutes[Public Routes]
        API[API Routes]
        Middleware[Auth Middleware]
    end
    
    subgraph "Business Logic Layer"
        AuthService[Auth Service]
        ContentService[Content Service]
        AnalyticsService[Analytics Service]
        LoggerService[Logger Service]
        ImageService[Image Service]
    end
    
    subgraph "Data Layer"
        DB[(SQLite Database)]
        FileSystem[File System]
    end
    
    UI --> AdminRoutes
    PublicUI --> PublicRoutes
    AdminRoutes --> Middleware
    Middleware --> AuthService
    AdminRoutes --> API
    API --> ContentService
    API --> AnalyticsService
    API --> LoggerService
    API --> ImageService
    ContentService --> DB
    AnalyticsService --> DB
    LoggerService --> DB
    ImageService --> FileSystem
    ImageService --> DB
```

### Directory Structure

```
app/
├── admin/
│   ├── layout.tsx              # Admin layout with navigation
│   ├── page.tsx                # Dashboard
│   ├── login/
│   │   └── page.tsx            # Login page
│   ├── projects/
│   │   ├── page.tsx            # Projects list
│   │   ├── new/
│   │   │   └── page.tsx        # Create project
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx    # Edit project
│   ├── content/
│   │   └── page.tsx            # Edit site content
│   ├── analytics/
│   │   └── page.tsx            # Analytics dashboard
│   ├── logs/
│   │   └── page.tsx            # System logs
│   └── settings/
│       └── page.tsx            # Settings & backups
├── api/
│   ├── admin/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.ts
│   │   │   └── logout/
│   │   │       └── route.ts
│   │   ├── projects/
│   │   │   ├── route.ts        # GET, POST
│   │   │   └── [id]/
│   │   │       └── route.ts    # GET, PUT, DELETE
│   │   ├── content/
│   │   │   └── route.ts        # GET, PUT
│   │   ├── images/
│   │   │   └── route.ts        # POST, DELETE
│   │   ├── analytics/
│   │   │   ├── pageviews/
│   │   │   │   └── route.ts
│   │   │   ├── clicks/
│   │   │   │   └── route.ts
│   │   │   └── submissions/
│   │   │       └── route.ts
│   │   ├── logs/
│   │   │   └── route.ts
│   │   └── backup/
│   │       ├── create/
│   │       │   └── route.ts
│   │       └── restore/
│   │           └── route.ts
│   └── track/
│       ├── pageview/
│       │   └── route.ts
│       ├── click/
│       │   └── route.ts
│       └── submission/
│           └── route.ts
└── middleware.ts               # Auth middleware

lib/
├── services/
│   ├── auth.service.ts
│   ├── content.service.ts
│   ├── analytics.service.ts
│   ├── logger.service.ts
│   └── image.service.ts
├── db/
│   ├── client.ts               # SQLite client
│   ├── schema.ts               # Database schema
│   └── migrations/
│       └── 001_initial.sql
├── utils/
│   ├── validation.ts
│   ├── crypto.ts
│   └── backup.ts
└── types/
    ├── admin.ts
    ├── analytics.ts
    └── logger.ts

components/
└── admin/
    ├── Sidebar.tsx
    ├── Header.tsx
    ├── ProjectForm.tsx
    ├── ContentEditor.tsx
    ├── AnalyticsChart.tsx
    ├── LogsTable.tsx
    └── ImageUploader.tsx

styles/
└── admin/
    ├── Admin.module.css
    ├── Dashboard.module.css
    ├── ProjectForm.module.css
    └── Analytics.module.css
```

## Components and Interfaces

### Authentication System

#### Auth Service Interface

```typescript
interface AuthService {
  // Authenticate user with credentials
  login(email: string, password: string): Promise<AuthResult>
  
  // Verify session token
  verifySession(token: string): Promise<SessionData | null>
  
  // Terminate session
  logout(token: string): Promise<void>
  
  // Check if session is expired
  isSessionExpired(session: SessionData): boolean
}

interface AuthResult {
  success: boolean
  token?: string
  error?: string
}

interface SessionData {
  userId: string
  email: string
  createdAt: Date
  expiresAt: Date
}
```

#### Implementation Details

- Пароль хешируется с использованием bcrypt (salt rounds: 12)
- JWT токен содержит: userId, email, iat, exp
- Токен хранится в HTTP-only cookie с флагами: Secure, SameSite=Strict
- Session TTL: 24 часа с момента последней активности
- Rate limiting: максимум 5 попыток входа за 15 минут на IP

### Content Management System

#### Content Service Interface

```typescript
interface ContentService {
  // Projects
  getProjects(): Promise<Project[]>
  getProject(id: string): Promise<Project | null>
  createProject(data: CreateProjectInput): Promise<Project>
  updateProject(id: string, data: UpdateProjectInput): Promise<Project>
  deleteProject(id: string): Promise<void>
  reorderProjects(order: string[]): Promise<void>
  
  // Site Content
  getSiteContent(): Promise<SiteContent>
  updateSiteContent(data: UpdateSiteContentInput): Promise<SiteContent>
  
  // Contact Info
  getContactInfo(): Promise<ContactInfo>
  updateContactInfo(data: UpdateContactInfoInput): Promise<ContactInfo>
}

interface CreateProjectInput {
  title: string
  description: string
  category: ProjectCategory
  year: string
  image: string
  imageAlt: string
  wide?: boolean
  featured?: boolean
}

interface UpdateProjectInput extends Partial<CreateProjectInput> {}

interface SiteContent {
  about: string
  manifesto: ManifestoPrinciple[]
  skills: Skill[]
}

interface ContactInfo {
  email: string
  phone?: string
  socialLinks: SocialLink[]
}

type ProjectCategory = 'Веб-Дизайн' | 'Брендинг' | 'Типографика' | 'UI/UX'
```

### Image Management System

#### Image Service Interface

```typescript
interface ImageService {
  // Upload and optimize image
  uploadImage(file: File, type: ImageType): Promise<ImageUploadResult>
  
  // Delete image from storage
  deleteImage(filename: string): Promise<void>
  
  // Optimize existing image
  optimizeImage(filename: string): Promise<void>
  
  // Get image metadata
  getImageMetadata(filename: string): Promise<ImageMetadata>
}

interface ImageUploadResult {
  filename: string
  url: string
  width: number
  height: number
  size: number
}

interface ImageMetadata {
  filename: string
  originalName: string
  size: number
  mimeType: string
  width: number
  height: number
  uploadedAt: Date
}

type ImageType = 'project' | 'avatar' | 'general'
```

#### Image Processing Pipeline

1. **Validation**: Проверка типа файла (JPEG, PNG, WebP) и размера (max 5MB)
2. **Optimization**: Сжатие изображения с использованием Sharp library
3. **Naming**: Генерация уникального имени: `{timestamp}-{random}.{ext}`
4. **Storage**: Сохранение в `/public/images/{type}/`
5. **Database**: Запись метаданных в таблицу images
6. **Avatar Processing**: Дополнительный resize до 200x200px для аватаров

### Analytics System

#### Analytics Service Interface

```typescript
interface AnalyticsService {
  // Track events
  trackPageView(data: PageViewData): Promise<void>
  trackClick(data: ClickData): Promise<void>
  trackSubmission(data: SubmissionData): Promise<void>
  
  // Query analytics
  getPageViews(filter: AnalyticsFilter): Promise<PageViewStats>
  getClicks(filter: AnalyticsFilter): Promise<ClickStats>
  getSubmissions(filter: AnalyticsFilter): Promise<SubmissionStats>
  getUniqueVisitors(filter: AnalyticsFilter): Promise<number>
  
  // Aggregations
  getTopPages(limit: number): Promise<PageRanking[]>
  getClickThroughRate(elementId: string): Promise<number>
  getConversionRate(filter: AnalyticsFilter): Promise<number>
}

interface PageViewData {
  path: string
  userAgent: string
  timestamp: Date
  sessionId?: string
}

interface ClickData {
  elementId: string
  elementType: string
  path: string
  timestamp: Date
}

interface SubmissionData {
  formId: string
  name: string
  email: string
  message: string
  timestamp: Date
}

interface AnalyticsFilter {
  startDate?: Date
  endDate?: Date
  path?: string
  groupBy?: 'day' | 'week' | 'month'
}

interface PageViewStats {
  total: number
  unique: number
  byPeriod: { period: string; count: number }[]
}

interface ClickStats {
  total: number
  byElement: { elementId: string; count: number }[]
  byPeriod: { period: string; count: number }[]
}

interface SubmissionStats {
  total: number
  byPeriod: { period: string; count: number }[]
  recent: Submission[]
}

interface Submission {
  id: string
  name: string
  email: string
  message: string
  timestamp: Date
  read: boolean
}
```

#### Analytics Implementation

- События отслеживаются через API endpoints `/api/track/*`
- Клиентский код отправляет события асинхронно (не блокирует UI)
- SessionId генерируется на клиенте и хранится в localStorage
- Unique visitors определяются по sessionId
- Aggregation queries используют SQL GROUP BY для эффективности
- Conversion rate = (submissions / pageviews) * 100

### Logger System

#### Logger Service Interface

```typescript
interface LoggerService {
  // Log actions
  logAdminAction(action: AdminAction): Promise<void>
  logSystemError(error: SystemError): Promise<void>
  logSecurityEvent(event: SecurityEvent): Promise<void>
  
  // Query logs
  getLogs(filter: LogFilter): Promise<LogEntry[]>
  searchLogs(query: string, filter?: LogFilter): Promise<LogEntry[]>
  
  // Maintenance
  archiveLogs(beforeDate: Date): Promise<number>
  deleteLogs(beforeDate: Date): Promise<number>
}

interface AdminAction {
  userId: string
  action: ActionType
  resource: string
  resourceId?: string
  details?: Record<string, any>
  timestamp: Date
}

interface SystemError {
  message: string
  stack?: string
  context?: Record<string, any>
  timestamp: Date
}

interface SecurityEvent {
  type: SecurityEventType
  ipAddress: string
  userAgent: string
  details?: Record<string, any>
  timestamp: Date
}

interface LogFilter {
  startDate?: Date
  endDate?: Date
  actionType?: ActionType
  severity?: LogSeverity
  userId?: string
}

interface LogEntry {
  id: string
  type: 'admin_action' | 'system_error' | 'security_event'
  severity: LogSeverity
  message: string
  details: Record<string, any>
  timestamp: Date
}

type ActionType = 
  | 'login' 
  | 'logout' 
  | 'create_project' 
  | 'update_project' 
  | 'delete_project'
  | 'update_content'
  | 'upload_image'
  | 'delete_image'
  | 'create_backup'
  | 'restore_backup'

type SecurityEventType = 
  | 'failed_login' 
  | 'rate_limit_exceeded' 
  | 'invalid_token'
  | 'unauthorized_access'

type LogSeverity = 'info' | 'warning' | 'error' | 'critical'
```

## Data Models

### Database Schema

```sql
-- Users table (single admin user)
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,
  last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Projects table
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  year TEXT NOT NULL,
  image TEXT NOT NULL,
  image_alt TEXT NOT NULL,
  wide INTEGER DEFAULT 0,
  featured INTEGER DEFAULT 0,
  display_order INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Site content table
CREATE TABLE site_content (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  about TEXT NOT NULL,
  manifesto JSON NOT NULL,
  skills JSON NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Contact info table
CREATE TABLE contact_info (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  email TEXT NOT NULL,
  phone TEXT,
  social_links JSON NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Images table
CREATE TABLE images (
  id TEXT PRIMARY KEY,
  filename TEXT UNIQUE NOT NULL,
  original_name TEXT NOT NULL,
  type TEXT NOT NULL,
  size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Analytics: Page views
CREATE TABLE page_views (
  id TEXT PRIMARY KEY,
  path TEXT NOT NULL,
  user_agent TEXT,
  session_id TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_page_views_path ON page_views(path);
CREATE INDEX idx_page_views_timestamp ON page_views(timestamp);
CREATE INDEX idx_page_views_session ON page_views(session_id);

-- Analytics: Clicks
CREATE TABLE clicks (
  id TEXT PRIMARY KEY,
  element_id TEXT NOT NULL,
  element_type TEXT NOT NULL,
  path TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_clicks_element ON clicks(element_id);
CREATE INDEX idx_clicks_timestamp ON clicks(timestamp);

-- Analytics: Form submissions
CREATE TABLE form_submissions (
  id TEXT PRIMARY KEY,
  form_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read INTEGER DEFAULT 0,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_submissions_timestamp ON form_submissions(timestamp);
CREATE INDEX idx_submissions_read ON form_submissions(read);

-- Logs table
CREATE TABLE logs (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  severity TEXT NOT NULL,
  message TEXT NOT NULL,
  details JSON,
  user_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_logs_type ON logs(type);
CREATE INDEX idx_logs_severity ON logs(severity);
CREATE INDEX idx_logs_timestamp ON logs(timestamp);

-- Archived logs table
CREATE TABLE archived_logs (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  severity TEXT NOT NULL,
  message TEXT NOT NULL,
  details JSON,
  user_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  timestamp DATETIME NOT NULL,
  archived_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Data Migration Strategy

1. **Initial Migration**: Создание всех таблиц и индексов
2. **Data Seeding**: Импорт существующих данных из lib/data.ts
3. **Admin User Creation**: Создание пользователя с хешированным паролем
4. **Backward Compatibility**: Сохранение lib/data.ts для публичной части сайта до полной миграции

### Backup Strategy

- **Automatic Backups**: Ежедневно в 03:00 UTC
- **Backup Format**: SQLite database file + images directory archive
- **Retention**: 7 последних бэкапов
- **Storage Location**: `/backups/{timestamp}/`
- **Backup Contents**:
  - `database.db` - полная копия SQLite базы
  - `images.tar.gz` - архив директории /public/images/
  - `metadata.json` - информация о бэкапе (timestamp, size, version)



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property Reflection

После анализа всех acceptance criteria выявлены следующие группы свойств, которые можно объединить:

**Группа 1: Трекинг событий аналитики**
- 5.1, 5.2 (page views), 6.1, 6.2 (clicks), 7.1 (submissions) - все эти свойства о записи событий с обязательными полями
- Можно объединить в одно свойство: "Для любого типа аналитического события должны записываться все обязательные поля"

**Группа 2: Группировка данных по периодам**
- 5.4 (page views by period), 6.3 (clicks by period), 7.3 (submissions by period)
- Можно объединить в одно свойство: "Для любого типа аналитических данных группировка по периодам должна работать корректно"

**Группа 3: Подсчет общего количества**
- 5.3 (total page views), 7.2 (total submissions)
- Можно объединить в одно свойство: "Для любого набора аналитических событий подсчет общего количества должен быть корректным"

**Группа 4: Логирование действий**
- 8.1, 8.2 (admin actions), 8.3 (errors), 11.7 (failed logins)
- Можно объединить в одно свойство: "Для любого типа события (действие, ошибка, security event) должна создаваться запись лога со всеми обязательными полями"

**Группа 5: Валидация входных данных**
- 2.3 (project fields), 4.3 (site content), 4.4 (email), 11.3 (all inputs)
- Можно объединить в одно свойство: "Для любых входных данных должна происходить валидация перед обработкой"

**Группа 6: Защита маршрутов**
- 1.6, 1.7 - оба о защите /admin/* маршрутов
- Можно объединить в одно свойство: "Для любого защищенного маршрута неаутентифицированный доступ должен приводить к редиректу на /admin/login"

**Группа 7: Фильтрация данных**
- 5.5 (date range for analytics), 8.5 (log filtering)
- Можно объединить в одно свойство: "Для любого набора данных с timestamp фильтрация по диапазону дат должна возвращать только записи в пределах диапазона"

**Свойства, которые остаются отдельными:**
- Уникальность имен файлов (3.4)
- Сохранение id при обновлении проекта (2.6)
- Каскадное удаление изображений (2.8)
- Rate limiting (11.5, 11.6)
- Транзакции и rollback (12.2, 12.3)
- Хеширование паролей (11.1)
- CSRF защита (11.2)
- Оптимизация изображений (3.3)
- Resize аватаров (3.9)
- Сортировка (5.7, 8.4)
- Уникальные посетители (5.6)
- CTR и conversion rate (6.4, 7.4)
- Retention policies (8.7, 8.8, 12.5)

После reflection количество свойств сократилось с ~60 до ~30, устраняя избыточность и дублирование.

### Correctness Properties

#### Property 1: Invalid credentials rejection

*For any* invalid email/password combination, the authentication system should return an error and not create a session.

**Validates: Requirements 1.3**

#### Property 2: Session cookie security

*For any* successful authentication, the session cookie should have HttpOnly, Secure, and SameSite=Strict flags set.

**Validates: Requirements 1.4**

#### Property 3: Expired session redirect

*For any* session with expiration time in the past, accessing a protected route should redirect to /admin/login.

**Validates: Requirements 1.5**

#### Property 4: Protected routes authentication

*For any* /admin/* route (except /admin/login), an unauthenticated request should redirect to /admin/login.

**Validates: Requirements 1.6, 1.7**

#### Property 5: Project list completeness

*For any* set of projects in the database, the projects list page should display all of them.

**Validates: Requirements 2.1**

#### Property 6: Required fields validation

*For any* project creation/update with missing required fields (title, description, category, year), the system should reject the operation and return a validation error.

**Validates: Requirements 2.3**

#### Property 7: Project ID preservation

*For any* project update operation, the project ID should remain unchanged after the update.

**Validates: Requirements 2.6**

#### Property 8: Cascading image deletion

*For any* project deletion, all associated images should be removed from the file system.

**Validates: Requirements 2.8**

#### Property 9: Image format validation

*For any* uploaded file, the system should accept only JPEG, PNG, and WebP formats and reject all others.

**Validates: Requirements 3.1**

#### Property 10: Image size validation

*For any* uploaded image, the system should reject files exceeding 5MB.

**Validates: Requirements 3.2**

#### Property 11: Image optimization

*For any* uploaded image, the optimized file size should be less than or equal to the original file size.

**Validates: Requirements 3.3**

#### Property 12: Filename uniqueness

*For any* set of uploaded images, all generated filenames should be unique (no collisions).

**Validates: Requirements 3.4**

#### Property 13: Image storage location

*For any* uploaded image, the file should exist in the /public/images/ directory after upload.

**Validates: Requirements 3.5**

#### Property 14: Image replacement

*For any* project image replacement, the old image file should be deleted and the new image should be stored.

**Validates: Requirements 3.7**

#### Property 15: Avatar resizing

*For any* uploaded avatar image, the resulting image dimensions should be exactly 200x200 pixels.

**Validates: Requirements 3.9**


#### Property 16: Input validation

*For any* user input (project data, site content, contact info), the system should validate and sanitize the data before processing.

**Validates: Requirements 2.3, 4.3, 4.4, 11.3**

#### Property 17: Email format validation

*For any* email input, the system should accept only valid email formats and reject invalid ones.

**Validates: Requirements 4.4**

#### Property 18: Analytics event recording

*For any* analytics event (page view, click, form submission), the system should record all required fields: timestamp, event type, and event-specific data.

**Validates: Requirements 5.1, 5.2, 6.1, 6.2, 7.1**

#### Property 19: Analytics count accuracy

*For any* set of analytics events, the total count displayed should equal the actual number of events in the database.

**Validates: Requirements 5.3, 7.2**

#### Property 20: Analytics grouping by period

*For any* set of analytics events, grouping by day/week/month should correctly aggregate events within each period.

**Validates: Requirements 5.4, 6.3, 7.3**

#### Property 21: Date range filtering

*For any* set of timestamped data and any date range filter, the results should contain only records with timestamps within the specified range.

**Validates: Requirements 5.5, 8.5**

#### Property 22: Unique visitors calculation

*For any* set of page view events with session IDs, the unique visitors count should equal the number of distinct session IDs.

**Validates: Requirements 5.6**

#### Property 23: Descending sort order

*For any* set of pages with view counts, the most visited pages list should be sorted in descending order by view count.

**Validates: Requirements 5.7**

#### Property 24: Click-through rate calculation

*For any* tracked element, the CTR should be calculated as (clicks / impressions) * 100.

**Validates: Requirements 6.4**

#### Property 25: Conversion rate calculation

*For any* time period, the conversion rate should be calculated as (form submissions / page views) * 100.

**Validates: Requirements 7.4**

#### Property 26: Form submission data persistence

*For any* form submission, all fields (name, email, message, timestamp) should be stored in the database.

**Validates: Requirements 7.5**

#### Property 27: Recent submissions display

*For any* set of form submissions, the admin panel should display all details for each submission.

**Validates: Requirements 7.6**

#### Property 28: Submission read status toggle

*For any* form submission, marking it as read/unread should update its status in the database.

**Validates: Requirements 7.7**


#### Property 29: Comprehensive logging

*For any* system event (admin action, error, security event), a log entry should be created with all required fields: type, severity, message, timestamp, and event-specific details.

**Validates: Requirements 8.1, 8.2, 8.3, 11.7**

#### Property 30: Log chronological ordering

*For any* set of log entries, they should be displayed in reverse chronological order (newest first).

**Validates: Requirements 8.4**

#### Property 31: Log filtering

*For any* log filter criteria (date range, action type, severity), the results should contain only logs matching all specified criteria.

**Validates: Requirements 8.5**

#### Property 32: Log keyword search

*For any* keyword search query, all returned log entries should contain the keyword in their message or details.

**Validates: Requirements 8.6**

#### Property 33: Log retention policy

*For any* log entry older than 90 days, it should be moved to the archived_logs table.

**Validates: Requirements 8.7, 8.8**

#### Property 34: Dashboard statistics accuracy

*For any* point in time, the dashboard statistics (total projects, page views last 30 days, submissions last 30 days) should match the actual counts in the database.

**Validates: Requirements 9.2**

#### Property 35: Recent activity limit

*For any* request for recent activity, the system should return at most 5 items of each type (admin actions, form submissions).

**Validates: Requirements 9.3**

#### Property 36: Session information display

*For any* active session, the admin panel should display the correct user email and session start time.

**Validates: Requirements 9.5**

#### Property 37: Active navigation highlighting

*For any* admin page, the corresponding navigation item should be marked as active.

**Validates: Requirements 10.2**

#### Property 38: Logout session termination

*For any* logout action, the session should be removed from the database and the user should be redirected to /admin/login.

**Validates: Requirements 10.4**

#### Property 39: Action notifications

*For any* user action (create, update, delete), the system should display a success or error notification.

**Validates: Requirements 10.7**

#### Property 40: Password hashing strength

*For any* password, the system should hash it using bcrypt with at least 10 salt rounds.

**Validates: Requirements 11.1**

#### Property 41: CSRF protection

*For any* form submission in the admin panel, the request should include and validate a CSRF token.

**Validates: Requirements 11.2**

#### Property 42: Rate limiting enforcement

*For any* IP address, after 5 failed login attempts within 15 minutes, all subsequent login attempts should be blocked for 15 minutes.

**Validates: Requirements 11.5, 11.6**


#### Property 43: Data persistence

*For any* data modification operation (create, update, delete), the changes should be persisted to the database.

**Validates: Requirements 12.1**

#### Property 44: Transaction atomicity

*For any* multi-step data operation, if any step fails, all changes should be rolled back and the database should remain in its original state.

**Validates: Requirements 12.2, 12.3**

#### Property 45: Backup retention limit

*For any* point in time, the system should maintain at most 7 backup files, automatically removing older backups.

**Validates: Requirements 12.5**

## Error Handling

### Error Categories

1. **Authentication Errors**
   - Invalid credentials: Return 401 with error message
   - Expired session: Return 401 and redirect to login
   - Rate limit exceeded: Return 429 with retry-after header
   - Invalid CSRF token: Return 403 with error message

2. **Validation Errors**
   - Missing required fields: Return 400 with field-specific errors
   - Invalid format (email, file type): Return 400 with validation message
   - File size exceeded: Return 413 with size limit information
   - Invalid data type: Return 400 with type error

3. **Resource Errors**
   - Resource not found: Return 404 with resource identifier
   - Resource already exists: Return 409 with conflict details
   - Resource locked: Return 423 with lock information

4. **System Errors**
   - Database connection failure: Return 503 with retry information
   - File system error: Return 500 with error details (logged)
   - External service failure: Return 502 with service information
   - Unexpected errors: Return 500 with generic message (full details logged)

### Error Response Format

```typescript
interface ErrorResponse {
  error: {
    code: string           // Machine-readable error code
    message: string        // Human-readable error message
    details?: any          // Additional error context
    timestamp: string      // ISO 8601 timestamp
    requestId: string      // Unique request identifier for tracking
  }
}
```

### Error Handling Strategy

1. **Client-Side Errors (4xx)**
   - Log to analytics for monitoring
   - Display user-friendly message in UI
   - Provide actionable guidance when possible
   - Do not expose sensitive system information

2. **Server-Side Errors (5xx)**
   - Log full error with stack trace
   - Create alert for critical errors
   - Display generic message to user
   - Include request ID for support reference

3. **Graceful Degradation**
   - Analytics tracking failures should not block user actions
   - Image optimization failures should fall back to original image
   - Backup failures should alert admin but not block operations
   - Non-critical features should fail silently with logging

### Error Recovery

- **Retry Logic**: Automatic retry for transient failures (max 3 attempts with exponential backoff)
- **Circuit Breaker**: Disable failing external services temporarily
- **Fallback Values**: Use cached or default values when fresh data unavailable
- **User Notification**: Inform users of degraded functionality

## Testing Strategy

### Dual Testing Approach

Тестирование админ-панели использует комбинацию unit tests и property-based tests для обеспечения полного покрытия:

**Unit Tests** - для конкретных примеров и edge cases:
- Успешный вход с валидными учетными данными (1.2)
- Наличие страницы логина по маршруту /admin/login (1.1)
- Наличие формы создания проекта с требуемыми полями (2.2)
- Наличие интерфейса редактирования проекта (2.5)
- Наличие диалога подтверждения удаления (2.7)
- Наличие интерфейса загрузки аватара (3.8)
- Наличие интерфейсов редактирования контента (4.1, 4.2)
- Наличие дашборда по маршруту /admin (9.1)
- Наличие quick access links на дашборде (9.4)
- Наличие sidebar navigation с требуемыми секциями (10.1)
- Наличие кнопки logout (10.3)
- Наличие функции ручного бэкапа (12.6)
- Наличие интерфейса восстановления из бэкапа (12.7)
- Integration tests для критических user flows

**Property-Based Tests** - для универсальных свойств:
- Все 45 correctness properties, определенных выше
- Минимум 100 итераций на каждый тест
- Использование библиотеки fast-check (уже в package.json)

### Property-Based Testing Configuration

**Library**: fast-check (уже установлен в проекте)

**Test Structure**:
```typescript
import fc from 'fast-check'

describe('Feature: admin-panel, Property X: [property description]', () => {
  it('should hold for all valid inputs', () => {
    fc.assert(
      fc.property(
        // Generators for test inputs
        fc.string(),
        fc.integer(),
        // Test function
        (input1, input2) => {
          // Arrange
          const result = systemUnderTest(input1, input2)
          
          // Assert property
          expect(result).toSatisfyProperty()
        }
      ),
      { numRuns: 100 } // Minimum 100 iterations
    )
  })
})
```

**Test Organization**:
```
__tests__/
├── unit/
│   ├── auth.test.ts
│   ├── projects.test.ts
│   ├── images.test.ts
│   ├── content.test.ts
│   ├── analytics.test.ts
│   └── logs.test.ts
├── properties/
│   ├── auth.properties.test.ts
│   ├── projects.properties.test.ts
│   ├── images.properties.test.ts
│   ├── content.properties.test.ts
│   ├── analytics.properties.test.ts
│   ├── logs.properties.test.ts
│   └── security.properties.test.ts
└── integration/
    ├── admin-flow.test.ts
    └── content-management.test.ts
```

### Test Data Generators

Для property-based testing необходимо создать генераторы тестовых данных:

```typescript
// Generators for domain objects
const projectGenerator = fc.record({
  title: fc.string({ minLength: 1, maxLength: 100 }),
  description: fc.string({ minLength: 1, maxLength: 500 }),
  category: fc.constantFrom('Веб-Дизайн', 'Брендинг', 'Типографика', 'UI/UX'),
  year: fc.integer({ min: 2000, max: 2030 }).map(String),
  image: fc.string(),
  imageAlt: fc.string(),
  wide: fc.boolean(),
  featured: fc.boolean()
})

const emailGenerator = fc.emailAddress()

const invalidEmailGenerator = fc.string().filter(s => !isValidEmail(s))

const sessionGenerator = fc.record({
  userId: fc.uuid(),
  email: fc.emailAddress(),
  createdAt: fc.date(),
  expiresAt: fc.date()
})

const analyticsEventGenerator = fc.record({
  path: fc.constantFrom('/', '/about', '/cases', '/contact'),
  userAgent: fc.string(),
  sessionId: fc.uuid(),
  timestamp: fc.date()
})
```

### Coverage Goals

- **Line Coverage**: Minimum 80%
- **Branch Coverage**: Minimum 75%
- **Function Coverage**: Minimum 85%
- **Property Coverage**: 100% (все 45 свойств должны быть протестированы)

### CI/CD Integration

- Тесты запускаются автоматически при каждом commit
- Property-based tests с фиксированным seed для воспроизводимости
- Failing tests блокируют merge в main branch
- Coverage reports генерируются и отслеживаются

### Manual Testing Checklist

Несмотря на автоматизацию, некоторые аспекты требуют ручной проверки:

- [ ] Responsive design на разных разрешениях экрана
- [ ] Визуальное качество оптимизированных изображений
- [ ] UX flow для создания/редактирования проектов
- [ ] Читаемость и полезность error messages
- [ ] Производительность при больших объемах данных
- [ ] Accessibility (keyboard navigation, screen readers)
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari)

