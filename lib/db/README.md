# Database Setup

This directory contains the database schema, migrations, and initialization scripts for the admin panel.

## Files

- **client.ts** - SQLite database client with connection management
- **schema.ts** - TypeScript type definitions for all database tables
- **init.ts** - Database initialization script
- **migrations/** - SQL migration files

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Initialize Database

Run the initialization script to create all tables and the admin user:

```bash
npm run db:init
```

This will:
- Create the SQLite database file (`admin.db` in project root)
- Run all migrations to create tables, indexes, and triggers
- Create the default admin user
- Verify database integrity

### 3. Default Admin Credentials

After initialization, you can log in with:

- **Email:** baracuda.max1@gmail.com
- **Password:** Raf070100

⚠️ **Important:** Change the default password after first login!

## Database Schema

The database includes the following tables:

### User Management
- `users` - Admin user accounts
- `sessions` - Active user sessions

### Content Management
- `projects` - Portfolio projects/cases
- `site_content` - Site content (about, manifesto, skills)
- `contact_info` - Contact information

### Image Management
- `images` - Uploaded image metadata

### Analytics
- `page_views` - Page view tracking
- `clicks` - Button/link click tracking
- `form_submissions` - Contact form submissions

### Logging
- `logs` - System and admin action logs
- `archived_logs` - Archived logs (older than 90 days)

## Database Features

### Connection Management
- Singleton pattern ensures single database connection
- WAL mode enabled for better concurrent access
- Foreign keys enabled for referential integrity
- Automatic connection management

### Data Integrity
- Foreign key constraints
- Check constraints for enums and booleans
- Unique constraints for emails, tokens, filenames
- Automatic timestamp updates via triggers

### Performance
- Indexes on frequently queried columns
- Optimized for analytics queries
- Efficient date range filtering

## Migrations

Migrations are SQL files in the `migrations/` directory, numbered sequentially:

- `001_initial.sql` - Initial schema creation

To add a new migration:

1. Create a new file: `migrations/002_description.sql`
2. Write your SQL statements
3. Run `npm run db:init` to apply (or create a migration runner)

## TypeScript Types

All database tables have corresponding TypeScript types in `schema.ts`:

```typescript
import { Project, User, Session } from '@/lib/db/schema';

// Use types for type-safe database operations
const project: Project = {
  id: '123',
  title: 'My Project',
  // ... other fields
};
```

## Database Location

The SQLite database file is created at:
```
<project-root>/admin.db
```

This file should be:
- ✅ Included in `.gitignore`
- ✅ Backed up regularly
- ✅ Excluded from version control

## Backup and Restore

The admin panel includes built-in backup functionality:

- **Automatic backups:** Daily at 03:00 UTC
- **Manual backups:** Available in Settings section
- **Retention:** 7 most recent backups
- **Location:** `/backups/{timestamp}/`

Each backup includes:
- `database.db` - Full SQLite database copy
- `images.tar.gz` - Images directory archive
- `metadata.json` - Backup information

## Troubleshooting

### Database locked error
If you get "database is locked" errors:
- Ensure no other processes are accessing the database
- WAL mode should prevent most locking issues
- Check that `busy_timeout` is set (default: 5000ms)

### Migration errors
If migrations fail:
- Check the error message for SQL syntax issues
- Verify the database file has write permissions
- Delete `admin.db` and run `npm run db:init` again

### Foreign key violations
If you get foreign key errors:
- Ensure foreign keys are enabled: `PRAGMA foreign_keys = ON`
- Check that referenced records exist before inserting
- Use transactions for multi-table operations

## Development

### Resetting the Database

To completely reset the database:

```bash
# Delete the database file
rm admin.db admin.db-shm admin.db-wal

# Re-initialize
npm run db:init
```

### Querying the Database

You can use the SQLite CLI to inspect the database:

```bash
sqlite3 admin.db

# List all tables
.tables

# Show schema for a table
.schema projects

# Query data
SELECT * FROM users;

# Exit
.quit
```

### Using the Client

```typescript
import { getDatabase, query, queryOne, execute, transaction } from '@/lib/db/client';

// Simple query
const projects = query<Project>('SELECT * FROM projects ORDER BY display_order');

// Query with parameters
const project = queryOne<Project>('SELECT * FROM projects WHERE id = ?', [projectId]);

// Insert/Update/Delete
execute('INSERT INTO projects (...) VALUES (...)', [values]);

// Transaction
transaction((db) => {
  // Multiple operations
  db.prepare('INSERT INTO ...').run(values);
  db.prepare('UPDATE ...').run(values);
  // Automatically commits or rolls back
});
```

## Security Notes

- Passwords are hashed with bcrypt (12 salt rounds)
- Session tokens are stored in HTTP-only cookies
- All user inputs should be validated and sanitized
- Use parameterized queries to prevent SQL injection
- Rate limiting implemented for login attempts
- Failed login attempts are logged with IP addresses

## Requirements Validation

This database schema satisfies:
- **Requirement 12.1:** All data persisted to database
- **Requirement 12.2:** Atomic transactions supported
- **Requirement 11.1:** Password hashing with bcrypt
- **Requirement 11.4:** Parameterized queries prevent SQL injection
- **Requirement 8.7, 8.8:** Log retention and archival
