#!/usr/bin/env tsx
/**
 * Test login functionality
 */

import { authService } from '../lib/services/auth.service';

async function testLogin() {
  console.log('Testing login functionality...\n');
  
  const email = 'baracuda.max1@gmail.com';
  const password = 'Raf070100';
  
  console.log(`Attempting login with:`);
  console.log(`  Email: ${email}`);
  console.log(`  Password: ${password}\n`);
  
  try {
    const result = await authService.login(email, password);
    
    if (result.success) {
      console.log('✓ Login successful!');
      console.log(`  Token: ${result.token?.substring(0, 20)}...`);
    } else {
      console.log('✗ Login failed');
      console.log(`  Error: ${result.error}`);
    }
  } catch (error) {
    console.error('✗ Error during login:', error);
  }
}

testLogin();
