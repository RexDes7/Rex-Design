import { initializeDatabase } from '../lib/db/simple-init';

/**
 * Script to initialize the simplified admin database
 * Run with: npm run init-db
 */

console.log('Initializing database...');

try {
  initializeDatabase();
  console.log('✓ Database initialization complete');
  process.exit(0);
} catch (error) {
  console.error('✗ Database initialization failed:', error);
  process.exit(1);
}
