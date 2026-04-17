/**
 * Database Verification Script
 * 
 * Quick script to verify the database structure and contents
 */

import { getDatabase } from './client';

function verifyDatabase() {
  const db = getDatabase();
  
  console.log('Database Verification\n');
  console.log('='.repeat(60));
  
  // Check tables
  const tables = db.prepare(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name NOT LIKE 'sqlite_%'
    ORDER BY name
  `).all() as { name: string }[];
  
  console.log('\nTables:');
  tables.forEach(t => console.log(`  ✓ ${t.name}`));
  
  // Check users
  const users = db.prepare('SELECT id, email, created_at FROM users').all();
  console.log('\nUsers:');
  console.log(`  Count: ${users.length}`);
  if (users.length > 0) {
    console.log('  Details:', JSON.stringify(users, null, 2));
  }
  
  // Check site_content
  const siteContent = db.prepare('SELECT id FROM site_content').all();
  console.log('\nSite Content:');
  console.log(`  Initialized: ${siteContent.length > 0 ? 'Yes' : 'No'}`);
  
  // Check contact_info
  const contactInfo = db.prepare('SELECT id, email FROM contact_info').all();
  console.log('\nContact Info:');
  console.log(`  Initialized: ${contactInfo.length > 0 ? 'Yes' : 'No'}`);
  if (contactInfo.length > 0) {
    console.log('  Details:', JSON.stringify(contactInfo, null, 2));
  }
  
  // Check indexes
  const indexes = db.prepare(`
    SELECT name FROM sqlite_master 
    WHERE type='index' AND name NOT LIKE 'sqlite_%'
  `).all() as { name: string }[];
  console.log('\nIndexes:');
  console.log(`  Count: ${indexes.length}`);
  
  // Check triggers
  const triggers = db.prepare(`
    SELECT name FROM sqlite_master 
    WHERE type='trigger'
  `).all() as { name: string }[];
  console.log('\nTriggers:');
  console.log(`  Count: ${triggers.length}`);
  triggers.forEach(t => console.log(`  ✓ ${t.name}`));
  
  console.log('\n' + '='.repeat(60));
  console.log('✓ Verification complete\n');
}

verifyDatabase();
