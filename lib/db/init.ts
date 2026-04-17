/**
 * Database Initialization Script
 * 
 * This script initializes the SQLite database by running all migrations
 * and optionally seeding initial data. It should be run once during
 * application setup or when resetting the database.
 * 
 * Usage:
 *   npm run db:init
 *   or
 *   node -r ts-node/register lib/db/init.ts
 */

import fs from 'fs';
import path from 'path';
import { getDatabase } from './client';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';

/**
 * Run a migration file
 */
function runMigration(migrationPath: string): void {
  console.log(`Running migration: ${path.basename(migrationPath)}`);
  
  const sql = fs.readFileSync(migrationPath, 'utf-8');
  const db = getDatabase();
  
  // Execute the entire migration file at once
  // SQLite can handle multiple statements in a single exec() call
  try {
    db.exec(sql);
  } catch (error) {
    console.error(`Error executing migration: ${path.basename(migrationPath)}`);
    throw error;
  }
  
  console.log(`✓ Migration completed: ${path.basename(migrationPath)}`);
}

/**
 * Run all migrations in order
 */
function runMigrations(): void {
  console.log('Starting database migrations...\n');
  
  const migrationsDir = path.join(__dirname, 'migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    console.error(`Migrations directory not found: ${migrationsDir}`);
    process.exit(1);
  }
  
  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort(); // Ensure migrations run in order
  
  if (migrationFiles.length === 0) {
    console.log('No migration files found.');
    return;
  }
  
  for (const file of migrationFiles) {
    const migrationPath = path.join(migrationsDir, file);
    runMigration(migrationPath);
  }
  
  console.log('\n✓ All migrations completed successfully\n');
}

/**
 * Create the default admin user
 */
async function createAdminUser(): Promise<void> {
  console.log('Creating default admin user...');
  
  const db = getDatabase();
  const email = 'baracuda.max1@gmail.com';
  const password = 'Raf070100';
  
  // Check if user already exists
  const existingUser = db
    .prepare('SELECT id FROM users WHERE email = ?')
    .get(email);
  
  if (existingUser) {
    console.log('✓ Admin user already exists');
    return;
  }
  
  // Hash password with bcrypt (12 salt rounds as per requirements)
  const passwordHash = await bcrypt.hash(password, 12);
  
  // Create user
  const userId = randomUUID();
  db.prepare(`
    INSERT INTO users (id, email, password_hash)
    VALUES (?, ?, ?)
  `).run(userId, email, passwordHash);
  
  console.log('✓ Admin user created successfully');
  console.log(`  Email: ${email}`);
  console.log(`  Password: ${password}`);
}

/**
 * Verify database integrity
 */
function verifyDatabase(): void {
  console.log('\nVerifying database integrity...');
  
  const db = getDatabase();
  
  // Check that all expected tables exist
  const expectedTables = [
    'users',
    'sessions',
    'projects',
    'site_content',
    'contact_info',
    'images',
    'page_views',
    'clicks',
    'form_submissions',
    'logs',
    'archived_logs'
  ];
  
  const tables = db
    .prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `)
    .all() as { name: string }[];
  
  const tableNames = tables.map(t => t.name);
  
  for (const expectedTable of expectedTables) {
    if (!tableNames.includes(expectedTable)) {
      console.error(`✗ Missing table: ${expectedTable}`);
      process.exit(1);
    }
  }
  
  console.log(`✓ All ${expectedTables.length} tables created successfully`);
  
  // Check indexes
  const indexes = db
    .prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='index' AND name NOT LIKE 'sqlite_%'
    `)
    .all() as { name: string }[];
  
  console.log(`✓ ${indexes.length} indexes created`);
  
  // Check triggers
  const triggers = db
    .prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='trigger'
    `)
    .all() as { name: string }[];
  
  console.log(`✓ ${triggers.length} triggers created`);
  
  // Verify foreign keys are enabled
  const fkEnabled = db.pragma('foreign_keys', { simple: true });
  if (fkEnabled !== 1) {
    console.error('✗ Foreign keys are not enabled');
    process.exit(1);
  }
  console.log('✓ Foreign keys enabled');
  
  // Verify WAL mode
  const journalMode = db.pragma('journal_mode', { simple: true });
  if (journalMode !== 'wal') {
    console.warn('⚠ WAL mode not enabled (expected for better concurrency)');
  } else {
    console.log('✓ WAL mode enabled');
  }
  
  console.log('\n✓ Database integrity verified\n');
}

/**
 * Main initialization function
 */
async function initializeDatabase(): Promise<void> {
  try {
    console.log('='.repeat(60));
    console.log('Database Initialization');
    console.log('='.repeat(60));
    console.log();
    
    // Run migrations
    runMigrations();
    
    // Create admin user
    await createAdminUser();
    
    // Verify database
    verifyDatabase();
    
    console.log('='.repeat(60));
    console.log('✓ Database initialization completed successfully!');
    console.log('='.repeat(60));
    console.log();
    
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Database initialization failed:');
    console.error(error);
    process.exit(1);
  }
}

// Run initialization if this script is executed directly
if (require.main === module) {
  initializeDatabase();
}

export { initializeDatabase, runMigrations, createAdminUser, verifyDatabase };
