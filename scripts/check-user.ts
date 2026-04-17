#!/usr/bin/env tsx
/**
 * Check if admin user exists in database
 */

import { getDatabase } from '../lib/db/client';

try {
  const db = getDatabase();
  
  console.log('Checking for admin user...\n');
  
  const user = db.prepare('SELECT id, email, created_at FROM users WHERE email = ?')
    .get('baracuda.max1@gmail.com');
  
  if (user) {
    console.log('✓ Admin user found:');
    console.log(`  Email: ${(user as any).email}`);
    console.log(`  ID: ${(user as any).id}`);
    console.log(`  Created: ${(user as any).created_at}`);
  } else {
    console.log('✗ Admin user NOT found');
    console.log('\nPlease run: npm run db:init');
  }
} catch (error) {
  console.error('Error checking user:', error);
  process.exit(1);
}
