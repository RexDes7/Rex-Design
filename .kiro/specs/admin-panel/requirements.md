# Requirements Document

## Introduction

Данный документ описывает требования к админ-панели для портфолио сайта на Next.js. Админ-панель предоставляет защищенный интерфейс для управления контентом сайта, мониторинга статистики посещений и просмотра логов системных событий.

## Glossary

- **Admin_Panel**: Защищенная веб-панель управления контентом и мониторинга сайта
- **Auth_System**: Система аутентификации пользователей
- **Content_Manager**: Модуль управления контентом (проекты, информация, изображения)
- **Analytics_Module**: Модуль сбора и отображения статистики посещений
- **Logger**: Система логирования действий и событий
- **Project**: Кейс/проект в портфолио (содержит title, description, category, year, image)
- **Contact_Info**: Контактная информация сайта (email, телефон, социальные сети)
- **Site_Content**: Общая информация на сайте (about, manifesto, skills)
- **Session**: Активная сессия аутентифицированного пользователя
- **Analytics_Event**: Событие для отслеживания (просмотр страницы, клик, отправка формы)
- **Image_Storage**: Хранилище загруженных изображений

## Requirements

### Requirement 1: Аутентификация администратора

**User Story:** Как администратор, я хочу безопасно входить в админ-панель, чтобы управлять контентом сайта

#### Acceptance Criteria

1. THE Auth_System SHALL provide a login page at /admin/login
2. WHEN valid credentials are submitted (email: baracuda.max1@gmail.com, password: Raf070100), THE Auth_System SHALL create a Session
3. WHEN invalid credentials are submitted, THE Auth_System SHALL return an error message within 500ms
4. THE Auth_System SHALL store Session data securely using HTTP-only cookies
5. WHEN a Session expires after 24 hours of inactivity, THE Auth_System SHALL redirect to login page
6. THE Auth_System SHALL protect all /admin/* routes except /admin/login from unauthorized access
7. WHEN an unauthenticated user attempts to access protected routes, THE Auth_System SHALL redirect to /admin/login

### Requirement 2: Управление проектами (кейсами)

**User Story:** Как администратор, я хочу создавать, редактировать и удалять проекты, чтобы поддерживать актуальное портфолио

#### Acceptance Criteria

1. THE Content_Manager SHALL display a list of all Projects with preview information
2. THE Content_Manager SHALL provide a form to create new Projects with fields: title, description, category, year, image, imageAlt, wide, featured
3. WHEN a new Project is created, THE Content_Manager SHALL validate all required fields (title, description, category, year)
4. WHEN a Project is saved, THE Content_Manager SHALL persist data to storage within 1 second
5. THE Content_Manager SHALL provide an edit interface for existing Projects
6. WHEN a Project is updated, THE Content_Manager SHALL preserve the original id
7. THE Content_Manager SHALL provide a delete function with confirmation dialog
8. WHEN a Project is deleted, THE Content_Manager SHALL remove associated images from Image_Storage
9. THE Content_Manager SHALL support reordering Projects via drag-and-drop interface

### Requirement 3: Загрузка и управление изображениями

**User Story:** Как администратор, я хочу загружать изображения для проектов и аватарку, чтобы визуально представить контент

#### Acceptance Criteria

1. THE Image_Storage SHALL accept image uploads in formats: JPEG, PNG, WebP
2. WHEN an image is uploaded, THE Image_Storage SHALL validate file size does not exceed 5MB
3. WHEN an image is uploaded, THE Image_Storage SHALL optimize the image for web delivery
4. THE Image_Storage SHALL generate a unique filename to prevent collisions
5. THE Image_Storage SHALL store images in /public/images/ directory
6. THE Content_Manager SHALL provide image preview before upload confirmation
7. THE Content_Manager SHALL allow replacing existing Project images
8. THE Content_Manager SHALL provide avatar upload interface for profile picture
9. WHEN an avatar is uploaded, THE Image_Storage SHALL resize it to 200x200 pixels

### Requirement 4: Редактирование информации сайта

**User Story:** Как администратор, я хочу редактировать информацию на сайте, чтобы поддерживать актуальность контента

#### Acceptance Criteria

1. THE Content_Manager SHALL provide an interface to edit Site_Content sections: about, manifesto, skills
2. THE Content_Manager SHALL provide an interface to edit Contact_Info: email, phone, social links
3. WHEN Site_Content is updated, THE Content_Manager SHALL validate data format
4. WHEN Contact_Info email is updated, THE Content_Manager SHALL validate email format
5. THE Content_Manager SHALL save changes to Site_Content within 1 second
6. THE Content_Manager SHALL provide a preview of changes before saving
7. THE Content_Manager SHALL support rich text editing for about section

### Requirement 5: Статистика посещений страниц

**User Story:** Как администратор, я хочу видеть статистику посещений, чтобы понимать популярность контента

#### Acceptance Criteria

1. THE Analytics_Module SHALL track page views for all site pages
2. WHEN a page is viewed, THE Analytics_Module SHALL record an Analytics_Event with timestamp, page path, and user agent
3. THE Analytics_Module SHALL display total page views per page in Admin_Panel
4. THE Analytics_Module SHALL display page views grouped by day, week, and month
5. THE Analytics_Module SHALL provide a date range filter for statistics
6. THE Analytics_Module SHALL calculate and display unique visitors count
7. THE Analytics_Module SHALL display most visited pages in descending order

### Requirement 6: Отслеживание кликов по кнопкам

**User Story:** Как администратор, я хочу отслеживать клики по важным кнопкам, чтобы анализировать поведение пользователей

#### Acceptance Criteria

1. THE Analytics_Module SHALL track clicks on contact buttons, project links, and navigation items
2. WHEN a tracked button is clicked, THE Analytics_Module SHALL record an Analytics_Event with button identifier and timestamp
3. THE Analytics_Module SHALL display click statistics grouped by button type
4. THE Analytics_Module SHALL calculate click-through rate for each tracked element
5. THE Analytics_Module SHALL display click trends over time in a chart

### Requirement 7: Отслеживание заявок через контактную форму

**User Story:** Как администратор, я хочу видеть количество отправленных заявок, чтобы оценивать эффективность контактной формы

#### Acceptance Criteria

1. WHEN a contact form is submitted, THE Analytics_Module SHALL record an Analytics_Event with submission timestamp
2. THE Analytics_Module SHALL display total number of form submissions
3. THE Analytics_Module SHALL display form submissions grouped by day, week, and month
4. THE Analytics_Module SHALL calculate form conversion rate (submissions / page views)
5. THE Analytics_Module SHALL store form submission data: name, email, message, timestamp
6. THE Admin_Panel SHALL display recent form submissions with full details
7. THE Admin_Panel SHALL mark form submissions as read/unread

### Requirement 8: Система логирования

**User Story:** Как администратор, я хочу просматривать логи системных событий, чтобы отслеживать изменения и диагностировать проблемы

#### Acceptance Criteria

1. THE Logger SHALL record all admin actions: login, logout, content changes, image uploads
2. WHEN an admin action occurs, THE Logger SHALL create a log entry with timestamp, action type, user identifier, and details
3. THE Logger SHALL record system errors with stack traces
4. THE Admin_Panel SHALL display logs in reverse chronological order (newest first)
5. THE Admin_Panel SHALL provide log filtering by: date range, action type, severity level
6. THE Admin_Panel SHALL support log search by keyword
7. THE Logger SHALL retain logs for 90 days
8. THE Logger SHALL automatically archive logs older than 90 days

### Requirement 9: Дашборд админ-панели

**User Story:** Как администратор, я хочу видеть обзор ключевых метрик на главной странице, чтобы быстро оценивать состояние сайта

#### Acceptance Criteria

1. THE Admin_Panel SHALL display a dashboard at /admin route
2. THE Admin_Panel SHALL display summary statistics: total projects, total page views (last 30 days), total form submissions (last 30 days)
3. THE Admin_Panel SHALL display recent activity: last 5 admin actions, last 5 form submissions
4. THE Admin_Panel SHALL display quick access links to: manage projects, view analytics, view logs
5. THE Admin_Panel SHALL display current Session information: logged in user, session start time
6. THE Admin_Panel SHALL refresh statistics automatically every 60 seconds

### Requirement 10: Навигация и интерфейс админ-панели

**User Story:** Как администратор, я хочу удобно перемещаться по админ-панели, чтобы эффективно выполнять задачи

#### Acceptance Criteria

1. THE Admin_Panel SHALL provide a sidebar navigation with sections: Dashboard, Projects, Content, Analytics, Logs, Settings
2. THE Admin_Panel SHALL highlight the current active section in navigation
3. THE Admin_Panel SHALL provide a logout button in the header
4. WHEN the logout button is clicked, THE Auth_System SHALL terminate the Session and redirect to login page
5. THE Admin_Panel SHALL be responsive and usable on desktop screens (minimum 1024px width)
6. THE Admin_Panel SHALL display loading indicators during data operations
7. THE Admin_Panel SHALL display success/error notifications for user actions

### Requirement 11: Безопасность данных

**User Story:** Как администратор, я хочу быть уверенным в безопасности данных, чтобы защитить сайт от несанкционированного доступа

#### Acceptance Criteria

1. THE Auth_System SHALL hash passwords using bcrypt with salt rounds >= 10
2. THE Auth_System SHALL implement CSRF protection for all form submissions
3. THE Admin_Panel SHALL validate and sanitize all user inputs before processing
4. THE Admin_Panel SHALL prevent SQL injection by using parameterized queries
5. THE Admin_Panel SHALL implement rate limiting: maximum 5 login attempts per 15 minutes per IP address
6. WHEN rate limit is exceeded, THE Auth_System SHALL block login attempts for 15 minutes
7. THE Logger SHALL record all failed login attempts with IP address and timestamp

### Requirement 12: Хранение данных

**User Story:** Как администратор, я хочу чтобы данные надежно сохранялись, чтобы не потерять контент при сбоях

#### Acceptance Criteria

1. THE Content_Manager SHALL persist all data changes to a database
2. THE Content_Manager SHALL support atomic transactions for data updates
3. WHEN a data operation fails, THE Content_Manager SHALL rollback changes and display error message
4. THE Content_Manager SHALL create automatic backups of data daily at 03:00 UTC
5. THE Content_Manager SHALL retain 7 daily backups
6. THE Admin_Panel SHALL provide a manual backup trigger in Settings section
7. THE Admin_Panel SHALL provide a restore from backup interface with backup selection

