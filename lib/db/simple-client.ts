import Database from 'better-sqlite3';
import path from 'path';

/**
 * Simplified SQLite Database Client
 * 
 * A minimal database client for the simplified admin panel.
 * Connects to admin.db in the project root.
 */

let db: Database.Database | null = null;

/**
 * Get or create the SQLite database instance
 * 
 * @returns Database instance connected to admin.db
 */
export function getDatabase(): Database.Database {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'admin.db');
    db = new Database(dbPath);
  }

  return db;
}
