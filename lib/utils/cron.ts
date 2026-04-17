/**
 * Cron Job Utilities
 * 
 * Provides scheduling functionality for periodic tasks such as:
 * - Log archiving (daily at 03:00 UTC)
 * - Database backups (daily at 03:00 UTC)
 * - Cleanup operations
 * 
 * This is a simple implementation using setInterval. For production,
 * consider using a proper cron library like 'node-cron' or system cron.
 */

import { loggerService } from '../services/logger.service';

/**
 * Job configuration
 */
export interface CronJob {
  name: string;
  schedule: CronSchedule;
  task: () => Promise<void>;
  enabled: boolean;
}

/**
 * Cron schedule configuration
 */
export interface CronSchedule {
  hour: number;    // 0-23
  minute: number;  // 0-59
  timezone?: string; // Default: UTC
}

/**
 * Job execution result
 */
export interface JobResult {
  jobName: string;
  success: boolean;
  executedAt: Date;
  duration: number;
  error?: string;
}

/**
 * Cron scheduler class
 */
class CronScheduler {
  private jobs: Map<string, CronJob> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private lastRun: Map<string, Date> = new Map();
  private isRunning: boolean = false;

  /**
   * Register a cron job
   */
  registerJob(job: CronJob): void {
    this.jobs.set(job.name, job);
    console.log(`[Cron] Registered job: ${job.name}`);
  }

  /**
   * Start the cron scheduler
   */
  start(): void {
    if (this.isRunning) {
      console.log('[Cron] Scheduler already running');
      return;
    }

    this.isRunning = true;
    console.log('[Cron] Starting scheduler...');

    // Check every minute if any job should run
    const checkInterval = setInterval(() => {
      this.checkAndRunJobs();
    }, 60 * 1000); // Check every minute

    this.intervals.set('main', checkInterval);

    // Run initial check
    this.checkAndRunJobs();

    console.log('[Cron] Scheduler started');
  }

  /**
   * Stop the cron scheduler
   */
  stop(): void {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    
    // Clear all intervals
    for (const [name, interval] of this.intervals) {
      clearInterval(interval);
    }
    this.intervals.clear();

    console.log('[Cron] Scheduler stopped');
  }

  /**
   * Check if any jobs should run and execute them
   */
  private async checkAndRunJobs(): Promise<void> {
    const now = new Date();
    const currentHour = now.getUTCHours();
    const currentMinute = now.getUTCMinutes();

    for (const [name, job] of this.jobs) {
      if (!job.enabled) {
        continue;
      }

      // Check if job should run at this time
      if (
        job.schedule.hour === currentHour &&
        job.schedule.minute === currentMinute
      ) {
        // Check if already ran in the last minute
        const lastRun = this.lastRun.get(name);
        if (lastRun && now.getTime() - lastRun.getTime() < 60 * 1000) {
          continue; // Already ran recently
        }

        // Execute job
        await this.executeJob(job);
        this.lastRun.set(name, now);
      }
    }
  }

  /**
   * Execute a job and log the result
   */
  private async executeJob(job: CronJob): Promise<JobResult> {
    const startTime = Date.now();
    const executedAt = new Date();

    console.log(`[Cron] Executing job: ${job.name}`);

    try {
      await job.task();
      
      const duration = Date.now() - startTime;
      const result: JobResult = {
        jobName: job.name,
        success: true,
        executedAt,
        duration
      };

      console.log(`[Cron] Job completed: ${job.name} (${duration}ms)`);
      
      // Log successful execution
      await loggerService.logAdminAction({
        userId: 'system',
        action: 'archive_logs',
        resource: 'cron_job',
        resourceId: job.name,
        details: { duration, success: true },
        timestamp: executedAt
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      const result: JobResult = {
        jobName: job.name,
        success: false,
        executedAt,
        duration,
        error: errorMessage
      };

      console.error(`[Cron] Job failed: ${job.name}`, error);
      
      // Log failed execution
      await loggerService.logSystemError({
        message: `Cron job failed: ${job.name}`,
        stack: error instanceof Error ? error.stack : undefined,
        context: { jobName: job.name, duration },
        timestamp: executedAt
      });

      return result;
    }
  }

  /**
   * Get job status
   */
  getStatus(): {
    isRunning: boolean;
    jobs: Array<{ name: string; enabled: boolean; lastRun?: Date }>;
  } {
    const jobs = Array.from(this.jobs.values()).map(job => ({
      name: job.name,
      enabled: job.enabled,
      lastRun: this.lastRun.get(job.name)
    }));

    return {
      isRunning: this.isRunning,
      jobs
    };
  }

  /**
   * Manually trigger a job
   */
  async triggerJob(jobName: string): Promise<JobResult> {
    const job = this.jobs.get(jobName);
    if (!job) {
      throw new Error(`Job not found: ${jobName}`);
    }

    return this.executeJob(job);
  }
}

// Singleton instance
export const cronScheduler = new CronScheduler();

/**
 * Initialize default cron jobs
 */
export function initializeCronJobs(): void {
  // Job 1: Archive logs older than 90 days (daily at 03:00 UTC)
  cronScheduler.registerJob({
    name: 'archive-old-logs',
    schedule: {
      hour: 3,
      minute: 0,
      timezone: 'UTC'
    },
    task: async () => {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      const archivedCount = await loggerService.archiveLogs(ninetyDaysAgo);
      console.log(`[Cron] Archived ${archivedCount} logs older than 90 days`);
    },
    enabled: true
  });

  // Job 2: Create daily backup (daily at 03:00 UTC)
  cronScheduler.registerJob({
    name: 'daily-backup',
    schedule: {
      hour: 3,
      minute: 0,
      timezone: 'UTC'
    },
    task: async () => {
      const { createBackup, deleteOldBackups } = await import('./backup');
      
      // Create backup
      const backupResult = await createBackup();
      
      if (backupResult.success) {
        console.log(`[Cron] Backup created successfully: ${backupResult.backupPath}`);
        
        // Log successful backup
        await loggerService.logAdminAction({
          userId: 'system',
          action: 'create_backup',
          resource: 'backup',
          resourceId: backupResult.metadata.timestamp,
          details: {
            size: backupResult.metadata.totalSize,
            databaseSize: backupResult.metadata.databaseSize,
            imagesSize: backupResult.metadata.imagesSize
          },
          timestamp: new Date()
        });

        // Delete old backups (keep last 7 days)
        const deletedCount = await deleteOldBackups(7);
        if (deletedCount > 0) {
          console.log(`[Cron] Deleted ${deletedCount} old backups`);
        }
      } else {
        console.error(`[Cron] Backup failed: ${backupResult.error}`);
        
        // Log failed backup
        await loggerService.logSystemError({
          message: `Backup creation failed: ${backupResult.error}`,
          context: { jobName: 'daily-backup' },
          timestamp: new Date()
        });
      }
    },
    enabled: true
  });

  console.log('[Cron] Default jobs initialized');
}

/**
 * Start the cron scheduler with default jobs
 * 
 * This should be called when the application starts.
 * For Next.js, this can be called in a custom server or API route.
 */
export function startCronScheduler(): void {
  initializeCronJobs();
  cronScheduler.start();
}

/**
 * Stop the cron scheduler
 * 
 * This should be called during application shutdown.
 */
export function stopCronScheduler(): void {
  cronScheduler.stop();
}

