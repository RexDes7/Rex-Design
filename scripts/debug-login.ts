/**
 * Debug Login Script
 * 
 * Tests the login flow step by step to identify where it fails
 */

import { getDatabase } from '../lib/db/client';
import { authService } from '../lib/services/auth.service';

async function debugLogin() {
  console.log('='.repeat(60));
  console.log('Login Debug Script');
  console.log('='.repeat(60));
  console.log();

  const email = 'baracuda.max1@gmail.com';
  const password = 'Raf070100';

  try {
    // Step 1: Check database connection
    console.log('1. Checking database connection...');
    const db = getDatabase();
    console.log('   ✓ Database connected');
    console.log();

    // Step 2: Check if user exists
    console.log('2. Checking if user exists...');
    const user = db.prepare('SELECT id, email FROM users WHERE email = ?').get(email);
    if (user) {
      console.log('   ✓ User found:', user);
    } else {
      console.log('   ✗ User not found!');
      console.log('   Run: npx tsx scripts/migrate-data.ts');
      process.exit(1);
    }
    console.log();

    // Step 3: Test login
    console.log('3. Testing login...');
    const result = await authService.login(email, password);
    
    if (result.success) {
      console.log('   ✓ Login successful!');
      console.log('   Token:', result.token?.substring(0, 20) + '...');
    } else {
      console.log('   ✗ Login failed!');
      console.log('   Error:', result.error);
    }
    console.log();

    // Step 4: Check sessions table
    console.log('4. Checking sessions...');
    const sessions = db.prepare('SELECT id, user_id, expires_at FROM sessions ORDER BY created_at DESC LIMIT 5').all();
    console.log(`   Found ${sessions.length} session(s)`);
    sessions.forEach((s: any) => {
      console.log(`   - Session: ${s.id.substring(0, 8)}... expires: ${s.expires_at}`);
    });
    console.log();

    console.log('='.repeat(60));
    console.log('✓ Debug complete');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n✗ Debug failed:');
    console.error(error);
    process.exit(1);
  }
}

debugLogin();
