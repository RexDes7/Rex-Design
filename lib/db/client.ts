import Database from 'better-sqlite3';
import path from 'path';

/**
 * SQLite Database Client
 * 
 * Provides a singleton instance of the SQLite database connection
 * for the admin panel. The database is stored in the project root
 * as 'admin.db'.
 * 
 * Features:
 * - Singleton pattern to ensure single connection
 * - WAL mode for better concurrent access
 * - Foreign keys enabled for referential integrity
 * - Automatic connection management
 */

let db: Database.Database | null = null;

/**
 * Get or create the SQLite database instance
 * 
 * @returns Database instance
 */
export function getDatabase(): Database.Database {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'admin.db');
    
    db = new Database(dbPath, {
      verbose: process.env.NODE_ENV === 'development' ? console.log : undefined,
    });

    // Enable WAL mode for better concurrent access
    db.pragma('journal_mode = WAL');
    
    // Enable foreign keys
    db.pragma('foreign_keys = ON');
    
    // Set busy timeout to 5 seconds
    db.pragma('busy_timeout = 5000');
  }

  return db;
}

/**
 * Close the database connection
 * Should be called during application shutdown
 */
export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}

/**
 * Execute a query with parameters
 * Wrapper for better error handling
 */
export function query<T = any>(sql: string, params?: any[]): T[] {
  const database = getDatabase();
  try {
    const stmt = database.prepare(sql);
    return stmt.all(params) as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Execute a single row query
 */
export function queryOne<T = any>(sql: string, params?: any[]): T | undefined {
  const database = getDatabase();
  try {
    const stmt = database.prepare(sql);
    return stmt.get(params) as T | undefined;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Execute an insert/update/delete query
 * Returns the number of affected rows
 */
export function execute(sql: string, params?: any[]): Database.RunResult {
  const database = getDatabase();
  try {
    const stmt = database.prepare(sql);
    return stmt.run(params);
  } catch (error) {
    console.error('Database execute error:', error);
    throw error;
  }
}

/**
 * Execute multiple statements in a transaction
 * Automatically rolls back on error
 */
export function transaction<T>(fn: (db: Database.Database) => T): T {
  const database = getDatabase();
  const txn = database.transaction(fn);
  return txn(database);
}

export default getDatabase;
