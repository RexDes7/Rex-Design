# Cron Jobs Documentation

## Overview

The admin panel uses a cron scheduler to run periodic maintenance tasks automatically. The main task is archiving logs older than 90 days.

## Scheduled Jobs

### 1. Archive Old Logs
- **Schedule**: Daily at 03:00 UTC
- **Task**: Archives logs older than 90 days to the `archived_logs` table
- **Purpose**: Maintains database performance and implements log retention policy

## Running the Cron Scheduler

### Option 1: Standalone Process (Recommended for Production)

Run the cron scheduler as a separate process:

```bash
npm run cron
```

This will start the scheduler and keep it running. Press Ctrl+C to stop.

### Option 2: System Cron (Alternative)

For production deployments, you can use system cron instead:

1. Create a script to run the archive task:

```bash
# scripts/archive-logs.ts
import { loggerService } from '../lib/services/logger.service';

async function archiveLogs() {
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  
  const count = await loggerService.archiveLogs(ninetyDaysAgo);
  console.log(`Archived ${count} logs`);
}

archiveLogs().catch(console.error);
```

2. Add to system crontab:

```bash
# Run daily at 03:00 UTC
0 3 * * * cd /path/to/project && npm run archive-logs
```

### Option 3: Manual Archiving

You can manually trigger log archiving through the API:

```bash
curl -X POST http://localhost:3000/api/admin/logs/archive \
  -H "Content-Type: application/json" \
  -d '{"daysOld": 90}'
```

Or from the admin panel Settings page.

## Monitoring

### Check Cron Status

Get the current status of the cron scheduler:

```bash
curl http://localhost:3000/api/admin/logs/archive
```

Response:
```json
{
  "success": true,
  "cron": {
    "isRunning": true,
    "jobs": [
      {
        "name": "archive-old-logs",
        "enabled": true,
        "lastRun": "2024-01-15T03:00:00.000Z"
      }
    ]
  },
  "stats": {
    "totalLogs": 1500,
    "logsOlderThan90Days": 200
  }
}
```

### Logs

All cron job executions are logged to the system logs:
- Successful runs: `info` level with duration
- Failed runs: `error` level with error details

View logs in the admin panel at `/admin/logs` or query via API:

```bash
curl http://localhost:3000/api/admin/logs?type=admin_action&action=archive_logs
```

## Configuration

### Changing Archive Retention Period

To change the 90-day retention period, edit `lib/utils/cron.ts`:

```typescript
cronScheduler.registerJob({
  name: 'archive-old-logs',
  schedule: { hour: 3, minute: 0 },
  task: async () => {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - 180); // Change to 180 days
    
    const count = await loggerService.archiveLogs(daysAgo);
    console.log(`Archived ${count} logs`);
  },
  enabled: true
});
```

### Changing Schedule Time

To change when the job runs, edit the `schedule` property:

```typescript
schedule: {
  hour: 2,    // Run at 02:00 UTC instead of 03:00
  minute: 30, // Run at :30 instead of :00
  timezone: 'UTC'
}
```

### Adding New Jobs

To add a new scheduled job:

```typescript
cronScheduler.registerJob({
  name: 'my-custom-job',
  schedule: {
    hour: 4,
    minute: 0,
    timezone: 'UTC'
  },
  task: async () => {
    // Your task logic here
    console.log('Running custom job');
  },
  enabled: true
});
```

## Troubleshooting

### Cron Not Running

1. Check if the cron process is running:
   ```bash
   ps aux | grep start-cron
   ```

2. Check logs for errors:
   ```bash
   npm run cron
   ```

3. Verify database connection:
   ```bash
   npm run db:init
   ```

### Jobs Not Executing

1. Check job status via API:
   ```bash
   curl http://localhost:3000/api/admin/logs/archive
   ```

2. Manually trigger the job:
   ```bash
   curl -X POST http://localhost:3000/api/admin/logs/archive
   ```

3. Check system logs for errors

### High Memory Usage

If the cron process uses too much memory:

1. Reduce check interval in `lib/utils/cron.ts`
2. Archive logs more frequently
3. Delete very old archived logs

## Production Deployment

### Docker

Add to your Dockerfile:

```dockerfile
# Start cron scheduler in background
CMD ["sh", "-c", "npm run cron & npm start"]
```

### PM2

Use PM2 to manage both the app and cron:

```json
{
  "apps": [
    {
      "name": "admin-panel",
      "script": "npm",
      "args": "start"
    },
    {
      "name": "cron-scheduler",
      "script": "npm",
      "args": "run cron"
    }
  ]
}
```

### Systemd

Create a systemd service:

```ini
[Unit]
Description=Admin Panel Cron Scheduler
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/project
ExecStart=/usr/bin/npm run cron
Restart=always

[Install]
WantedBy=multi-user.target
```

## Security Considerations

1. **Authentication**: The manual archive API endpoint should be protected with authentication
2. **Rate Limiting**: Consider rate limiting the manual archive endpoint
3. **Logging**: All cron operations are logged for audit trail
4. **Permissions**: Ensure the cron process has appropriate file system permissions

