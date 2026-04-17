/**
 * Backup Utilities
 * 
 * Provides backup and restore functionality for the admin panel including:
 * - Database backup (SQLite file copy)
 * - Images directory archiving
 * - Backup metadata management
 * - Backup restoration with rollback support
 * - Old backup cleanup
 * 
 * Requirements: 12.4, 12.6
 */

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import { getDatabase } from '../db/client';

const execAsync = promisify(exec);

/**
 * Backup metadata
 */
export interface BackupMetadata {
  timestamp: string;
  date: Date;
  databaseSize: number;
  imagesSize: number;
  totalSize: number;
  version: string;
  success: boolean;
}

/**
 * Backup result
 */
export interface BackupResult {
  success: boolean;
  backupPath: string;
  metadata: BackupMetadata;
  error?: string;
}

/**
 * Restore result
 */
export interface RestoreResult {
  success: boolean;
  restoredFrom: string;
  error?: string;
}

/**
 * Backup list item
 */
export interface BackupInfo {
  timestamp: string;
  date: Date;
  path: string;
  size: number;
  metadata: BackupMetadata;
}

/**
 * Get backup directory path
 */
function getBackupDir(): string {
  return path.join(process.cwd(), 'backups');
}

/**
 * Get database path
 */
function getDatabasePath(): string {
  return path.join(process.cwd(), 'admin.db');
}

/**
 * Get images directory path
 */
function getImagesDir(): string {
  return path.join(process.cwd(), 'public', 'images');
}

/**
 * Ensure backup directory exists
 */
function ensureBackupDir(): void {
  const backupDir = getBackupDir();
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
}

/**
 * Get directory size recursively
 */
function getDirectorySize(dirPath: string): number {
  let totalSize = 0;

  if (!fs.existsSync(dirPath)) {
    return 0;
  }

  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      totalSize += getDirectorySize(filePath);
    } else {
      totalSize += stats.size;
    }
  }

  return totalSize;
}

/**
 * Copy directory recursively
 */
function copyDirectory(src: string, dest: string): void {
  if (!fs.existsSync(src)) {
    return;
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const files = fs.readdirSync(src);
  
  for (const file of files) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    const stats = fs.statSync(srcPath);
    
    if (stats.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Delete directory recursively
 */
function deleteDirectory(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    return;
  }

  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      deleteDirectory(filePath);
    } else {
      fs.unlinkSync(filePath);
    }
  }

  fs.rmdirSync(dirPath);
}

/**
 * Create a backup of the database and images
 * 
 * Creates a timestamped backup directory containing:
 * - admin.db (SQLite database copy)
 * - images/ (copy of /public/images/)
 * - metadata.json (backup information)
 * 
 * @returns Promise that resolves to backup result
 * 
 * Validates: Requirements 12.4, 12.6
 */
export async function createBackup(): Promise<BackupResult> {
  try {
    ensureBackupDir();

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(getBackupDir(), timestamp);
    
    // Create backup directory
    fs.mkdirSync(backupPath, { recursive: true });

    // 1. Backup database
    const dbPath = getDatabasePath();
    const dbBackupPath = path.join(backupPath, 'admin.db');
    
    if (fs.existsSync(dbPath)) {
      // Close any open connections and create a backup
      const db = getDatabase();
      db.backup(dbBackupPath);
    } else {
      throw new Error('Database file not found');
    }

    const databaseSize = fs.statSync(dbBackupPath).size;

    // 2. Backup images directory
    const imagesDir = getImagesDir();
    const imagesBackupPath = path.join(backupPath, 'images');
    
    copyDirectory(imagesDir, imagesBackupPath);
    const imagesSize = getDirectorySize(imagesBackupPath);

    // 3. Create metadata
    const metadata: BackupMetadata = {
      timestamp,
      date: new Date(),
      databaseSize,
      imagesSize,
      totalSize: databaseSize + imagesSize,
      version: '1.0.0',
      success: true
    };

    const metadataPath = path.join(backupPath, 'metadata.json');
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

    return {
      success: true,
      backupPath,
      metadata
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return {
      success: false,
      backupPath: '',
      metadata: {
        timestamp: new Date().toISOString(),
        date: new Date(),
        databaseSize: 0,
        imagesSize: 0,
        totalSize: 0,
        version: '1.0.0',
        success: false
      },
      error: errorMessage
    };
  }
}

/**
 * Restore from a backup
 * 
 * Restores the database and images from a backup directory.
 * Creates a temporary backup of current state before restoration
 * to enable rollback on failure.
 * 
 * @param backupTimestamp - Timestamp of the backup to restore
 * @returns Promise that resolves to restore result
 * 
 * Validates: Requirements 12.6, 12.7
 */
export async function restoreBackup(backupTimestamp: string): Promise<RestoreResult> {
  const backupPath = path.join(getBackupDir(), backupTimestamp);
  
  if (!fs.existsSync(backupPath)) {
    return {
      success: false,
      restoredFrom: backupTimestamp,
      error: 'Backup not found'
    };
  }

  // Create temporary backup of current state for rollback
  const tempBackupPath = path.join(getBackupDir(), `temp-${Date.now()}`);
  
  try {
    // 1. Create temporary backup of current state
    fs.mkdirSync(tempBackupPath, { recursive: true });
    
    const dbPath = getDatabasePath();
    const tempDbPath = path.join(tempBackupPath, 'admin.db');
    if (fs.existsSync(dbPath)) {
      fs.copyFileSync(dbPath, tempDbPath);
    }

    const imagesDir = getImagesDir();
    const tempImagesPath = path.join(tempBackupPath, 'images');
    copyDirectory(imagesDir, tempImagesPath);

    // 2. Restore database
    const backupDbPath = path.join(backupPath, 'admin.db');
    if (!fs.existsSync(backupDbPath)) {
      throw new Error('Backup database file not found');
    }
    
    fs.copyFileSync(backupDbPath, dbPath);

    // 3. Restore images
    const backupImagesPath = path.join(backupPath, 'images');
    
    // Clear current images directory
    if (fs.existsSync(imagesDir)) {
      deleteDirectory(imagesDir);
    }
    
    // Copy backup images
    copyDirectory(backupImagesPath, imagesDir);

    // 4. Clean up temporary backup
    deleteDirectory(tempBackupPath);

    return {
      success: true,
      restoredFrom: backupTimestamp
    };
  } catch (error) {
    // Rollback: restore from temporary backup
    try {
      const dbPath = getDatabasePath();
      const tempDbPath = path.join(tempBackupPath, 'admin.db');
      if (fs.existsSync(tempDbPath)) {
        fs.copyFileSync(tempDbPath, dbPath);
      }

      const imagesDir = getImagesDir();
      const tempImagesPath = path.join(tempBackupPath, 'images');
      if (fs.existsSync(tempImagesPath)) {
        if (fs.existsSync(imagesDir)) {
          deleteDirectory(imagesDir);
        }
        copyDirectory(tempImagesPath, imagesDir);
      }

      // Clean up temporary backup
      deleteDirectory(tempBackupPath);
    } catch (rollbackError) {
      console.error('Rollback failed:', rollbackError);
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return {
      success: false,
      restoredFrom: backupTimestamp,
      error: errorMessage
    };
  }
}

/**
 * List all available backups
 * 
 * @returns Promise that resolves to array of backup information
 * 
 * Validates: Requirements 12.6
 */
export async function listBackups(): Promise<BackupInfo[]> {
  const backupDir = getBackupDir();
  
  if (!fs.existsSync(backupDir)) {
    return [];
  }

  const backups: BackupInfo[] = [];
  const entries = fs.readdirSync(backupDir);

  for (const entry of entries) {
    const entryPath = path.join(backupDir, entry);
    const stats = fs.statSync(entryPath);

    if (stats.isDirectory() && !entry.startsWith('temp-')) {
      const metadataPath = path.join(entryPath, 'metadata.json');
      
      if (fs.existsSync(metadataPath)) {
        try {
          const metadataContent = fs.readFileSync(metadataPath, 'utf-8');
          const metadata: BackupMetadata = JSON.parse(metadataContent);

          backups.push({
            timestamp: entry,
            date: new Date(metadata.date),
            path: entryPath,
            size: metadata.totalSize,
            metadata
          });
        } catch (error) {
          console.error(`Failed to read metadata for backup ${entry}:`, error);
        }
      }
    }
  }

  // Sort by date descending (newest first)
  backups.sort((a, b) => b.date.getTime() - a.date.getTime());

  return backups;
}

/**
 * Delete backups older than specified days
 * 
 * @param daysToKeep - Number of days to keep backups (default: 7)
 * @returns Promise that resolves to number of backups deleted
 * 
 * Validates: Requirements 12.5
 */
export async function deleteOldBackups(daysToKeep: number = 7): Promise<number> {
  const backups = await listBackups();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  let deletedCount = 0;

  for (const backup of backups) {
    if (backup.date < cutoffDate) {
      try {
        deleteDirectory(backup.path);
        deletedCount++;
      } catch (error) {
        console.error(`Failed to delete backup ${backup.timestamp}:`, error);
      }
    }
  }

  return deletedCount;
}
