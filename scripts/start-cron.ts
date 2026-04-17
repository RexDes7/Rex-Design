#!/usr/bin/env tsx
/**
 * Cron Job Starter Script
 * 
 * This script starts the cron scheduler for periodic tasks like log archiving.
 * 
 * Usage:
 *   npm run cron
 *   or
 *   tsx scripts/start-cron.ts
 * 
 * The script will run continuously and execute scheduled jobs.
 * Press Ctrl+C to stop.
 */

import { startCronScheduler, stopCronScheduler } from '../lib/utils/cron';

console.log('='.repeat(60));
console.log('Admin Panel Cron Scheduler');
console.log('='.repeat(60));
console.log('');
console.log('Starting cron scheduler...');
console.log('Scheduled jobs:');
console.log('  - Archive logs older than 90 days (daily at 03:00 UTC)');
console.log('');
console.log('Press Ctrl+C to stop');
console.log('');

// Start the scheduler
startCronScheduler();

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\nShutting down cron scheduler...');
  stopCronScheduler();
  console.log('Cron scheduler stopped');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\nShutting down cron scheduler...');
  stopCronScheduler();
  console.log('Cron scheduler stopped');
  process.exit(0);
});

// Keep the process running
process.stdin.resume();

