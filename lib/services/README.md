# Services Layer

This directory contains business logic services for the admin panel.

## Content Service

`content.service.ts` provides database operations for:
- Projects (CRUD operations)
- Site content (about, manifesto, skills)
- Contact information

### Usage

The content service is used by:
1. **Admin Panel API Routes** (`app/api/admin/content/route.ts`, `app/api/admin/projects/[id]/route.ts`)
   - These routes use the service to read/write data to the database
   - All changes are persisted to `admin.db`

2. **Public Site** (`lib/data.ts`)
   - Currently uses static exports for optimal build-time performance
   - Data is managed through the admin panel
   - Future enhancement: Implement server-side data fetching for real-time updates

### Data Flow

```
Admin Panel UI → API Routes → Content Service → SQLite Database (admin.db)
                                                        ↓
                                                  (migration)
                                                        ↓
                                              lib/data.ts (static exports)
                                                        ↓
                                                  Public Site Pages
```

### Migration

The `scripts/migrate-data.ts` script migrates existing static data from `lib/data.ts` into the database.
Run it once after database initialization:

```bash
npx tsx scripts/migrate-data.ts
```

### Testing

Test the content service directly:

```bash
npx tsx scripts/test-content-service.ts
```

## Other Services

- `auth.service.ts` - Authentication and session management
- `analytics.service.ts` - Analytics tracking and reporting
- `logger.service.ts` - System logging
- `image.service.ts` - Image upload and optimization
