# Admin Panel Deployment Guide

## Overview

This document provides comprehensive instructions for deploying and configuring the admin panel for the Next.js portfolio site.

## Prerequisites

- Node.js 20.x or higher
- npm or yarn package manager
- SQLite3 (included via better-sqlite3)
- Access to the server/hosting environment

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# JWT Secret for authentication tokens
# Generate a secure random string (minimum 32 characters)
JWT_SECRET=your-secure-jwt-secret-here-minimum-32-characters

# Database path (relative to project root)
DATABASE_PATH=./admin.db

# Node environment
NODE_ENV=production

# Optional: Custom port for development
PORT=3000
```

### Generating JWT_SECRET

Generate a secure JWT secret using one of these methods:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32

# Using Python
python -c "import secrets; print(secrets.token_hex(32))"
```

## Database Initialization

### Step 1: Initialize the Database

Run the database initialization script to create all tables and indexes:

```bash
npm run db:init
```

This script will:
- Create the SQLite database file at the path specified in `DATABASE_PATH`
- Execute the initial migration (`lib/db/migrations/001_initial.sql`)
- Create all required tables: users, sessions, projects, site_content, contact_info, images, page_views, clicks, form_submissions, logs, archived_logs
- Create all necessary indexes for optimal query performance

### Step 2: Verify Database Creation

Check that the database file exists:

```bash
ls -lh admin.db
```

You should see the database file with a size greater than 0 bytes.

## Data Migration

### Migrating Existing Data

If you have existing data in `lib/data.ts`, run the migration script:

```bash
npx tsx scripts/migrate-data.ts
```

This script will:
- Import all existing projects from `lib/data.ts` into the `projects` table
- Import site content (about, manifesto, skills) into the `site_content` table
- Import contact information into the `contact_info` table
- Create the admin user account with credentials:
  - Email: baracuda.max1@gmail.com
  - Password: Raf070100 (hashed with bcrypt, 12 salt rounds)

### Manual Data Import

If you need to manually import data, you can use SQLite commands:

```bash
sqlite3 admin.db

# Example: Insert a project
INSERT INTO projects (id, title, description, category, year, image, image_alt, wide, featured, display_order)
VALUES ('unique-id', 'Project Title', 'Description', 'Веб-Дизайн', '2024', '/images/project/image.jpg', 'Alt text', 0, 0, 1);
```

## Cron Jobs Setup

The admin panel requires two cron jobs for automated maintenance:

### 1. Daily Backups

**Schedule**: Daily at 03:00 UTC

**Command**:
```bash
cd /path/to/project && npm run cron
```

**Cron Entry** (add to crontab with `crontab -e`):
```cron
0 3 * * * cd /path/to/project && npm run cron >> /var/log/admin-panel-cron.log 2>&1
```

This job will:
- Create a full backup of the SQLite database
- Archive the `/public/images/` directory
- Create a `metadata.json` file with backup information
- Store backups in `/backups/{timestamp}/`
- Automatically delete backups older than 7 days (retention policy)

### 2. Log Archiving

**Schedule**: Daily at 04:00 UTC

**Command**:
```bash
cd /path/to/project && npx tsx scripts/archive-logs.ts
```

**Cron Entry**:
```cron
0 4 * * * cd /path/to/project && npx tsx scripts/archive-logs.ts >> /var/log/admin-panel-logs.log 2>&1
```

This job will:
- Move logs older than 90 days from `logs` table to `archived_logs` table
- Maintain the 90-day retention policy for active logs

### Verifying Cron Jobs

Check that cron jobs are running:

```bash
# View cron logs
tail -f /var/log/admin-panel-cron.log
tail -f /var/log/admin-panel-logs.log

# Check backup directory
ls -lh backups/

# Verify log archiving
sqlite3 admin.db "SELECT COUNT(*) FROM archived_logs;"
```

## Building for Production

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Build the Application

```bash
npm run build
```

This will:
- Compile TypeScript code
- Build Next.js application
- Optimize assets and images
- Generate static pages where possible

### Step 3: Start Production Server

```bash
npm start
```

The server will start on port 3000 by default (or the port specified in `PORT` environment variable).

## Deployment Options

### Option 1: Traditional Server (VPS, Dedicated Server)

1. Clone the repository to your server
2. Set up environment variables
3. Initialize the database
4. Migrate data
5. Set up cron jobs
6. Build the application
7. Use a process manager like PM2:

```bash
# Install PM2
npm install -g pm2

# Start the application
pm2 start npm --name "admin-panel" -- start

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
```

### Option 2: Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t admin-panel .
docker run -d -p 3000:3000 --env-file .env.local admin-panel
```

### Option 3: Vercel Deployment

**Note**: SQLite is not recommended for Vercel due to serverless architecture. Consider migrating to PostgreSQL or another cloud database for Vercel deployment.

If deploying to Vercel:
1. Set environment variables in Vercel dashboard
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `.next`
3. Deploy via Vercel CLI or GitHub integration

## Security Considerations

### 1. JWT Secret

- **Never commit** `JWT_SECRET` to version control
- Use a strong, randomly generated secret (minimum 32 characters)
- Rotate the secret periodically (requires all users to re-login)

### 2. Database Security

- Set appropriate file permissions on the database file:
  ```bash
  chmod 600 admin.db
  ```
- Ensure the database is not accessible via web server
- Regular backups are essential (automated via cron)

### 3. HTTPS

- **Always use HTTPS** in production
- Configure your reverse proxy (nginx, Apache) to enforce HTTPS
- Set `Secure` flag on cookies (automatically set in production)

### 4. Rate Limiting

The application includes built-in rate limiting:
- Maximum 5 login attempts per 15 minutes per IP address
- Automatic IP blocking for 15 minutes after limit exceeded
- All failed attempts are logged

### 5. File Upload Security

- Maximum file size: 5MB
- Allowed formats: JPEG, PNG, WebP only
- Files are validated and optimized before storage
- Unique filenames prevent collisions and overwrites

## Monitoring and Maintenance

### Health Checks

Create a health check endpoint or monitor:
- Application uptime
- Database connectivity
- Disk space (for database and backups)
- Log file sizes

### Log Monitoring

Monitor system logs for:
- Failed login attempts (security events)
- System errors
- Rate limit violations
- Backup failures

Query logs via admin panel or directly:

```bash
sqlite3 admin.db "SELECT * FROM logs WHERE severity = 'error' ORDER BY timestamp DESC LIMIT 10;"
```

### Backup Verification

Regularly verify backups:

```bash
# List recent backups
ls -lh backups/

# Test backup restoration (in a test environment)
npm run db:restore -- backups/2024-01-15-03-00-00/
```

### Database Maintenance

Periodically optimize the database:

```bash
sqlite3 admin.db "VACUUM;"
sqlite3 admin.db "ANALYZE;"
```

## Troubleshooting

### Database Locked Error

If you encounter "database is locked" errors:
- Ensure only one process is accessing the database
- Check for long-running queries
- Consider increasing the busy timeout in `lib/db/client.ts`

### Image Upload Failures

If image uploads fail:
- Check disk space: `df -h`
- Verify directory permissions: `ls -ld public/images/`
- Check Sharp library installation: `npm list sharp`

### Authentication Issues

If users cannot log in:
- Verify JWT_SECRET is set correctly
- Check session expiration settings
- Review rate limiting logs
- Verify database connectivity

### Cron Job Not Running

If automated tasks aren't executing:
- Check cron service status: `systemctl status cron`
- Verify cron entries: `crontab -l`
- Check log files for errors
- Ensure correct file paths in cron commands

## Performance Optimization

### Database Indexes

The initial migration creates indexes on frequently queried columns. Verify indexes exist:

```bash
sqlite3 admin.db ".indexes"
```

Expected indexes:
- `idx_page_views_path`
- `idx_page_views_timestamp`
- `idx_page_views_session`
- `idx_clicks_element`
- `idx_clicks_timestamp`
- `idx_submissions_timestamp`
- `idx_submissions_read`
- `idx_logs_type`
- `idx_logs_severity`
- `idx_logs_timestamp`

### Image Optimization

All uploaded images are automatically optimized:
- JPEG: 85% quality, progressive
- PNG: Compression level 9, progressive
- WebP: 85% quality
- Avatars: Resized to 200x200px

### Caching

Consider implementing:
- CDN for static assets and images
- Redis for session storage (if scaling beyond single server)
- HTTP caching headers for public pages

## Scaling Considerations

### Moving Beyond SQLite

If you need to scale beyond a single server:

1. **Migrate to PostgreSQL or MySQL**:
   - Update `lib/db/client.ts` to use appropriate driver
   - Modify SQL queries for database-specific syntax
   - Update migration scripts

2. **Separate File Storage**:
   - Move images to S3, Cloudinary, or similar service
   - Update `lib/services/image.service.ts` accordingly

3. **Session Management**:
   - Move sessions to Redis or database-backed store
   - Update `lib/services/auth.service.ts`

## Support and Maintenance

### Regular Tasks

- **Daily**: Monitor logs for errors and security events
- **Weekly**: Review backup integrity and disk space
- **Monthly**: Update dependencies (`npm update`)
- **Quarterly**: Security audit and password rotation

### Updating the Application

```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Run database migrations (if any)
npm run db:migrate

# Rebuild application
npm run build

# Restart server
pm2 restart admin-panel
```

## Admin Credentials

**Default Admin Account**:
- Email: baracuda.max1@gmail.com
- Password: Raf070100

**⚠️ IMPORTANT**: Change the default password immediately after first login through the admin panel settings.

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Sharp Image Processing](https://sharp.pixelplumbing.com/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## Contact

For issues or questions regarding deployment, refer to the project README or contact the development team.
