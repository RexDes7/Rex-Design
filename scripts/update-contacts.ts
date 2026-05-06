/**
 * Script to update contacts in MongoDB
 * Run with: npx tsx scripts/update-contacts.ts
 */

import * as dotenv from 'dotenv';
import { upsertContent } from '../lib/db/mongodb-content';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function updateContacts() {
  try {
    console.log('Updating contacts in MongoDB...');
    
    const contacts = {
      email: 'hello@arhiv24.com',
      telegram: 'https://t.me/RLC_W',
      behance: 'https://behance.net/arhiv24'
    };
    
    await upsertContent('contacts', JSON.stringify(contacts));
    
    console.log('✅ Contacts updated successfully!');
    console.log('New contacts:', contacts);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating contacts:', error);
    process.exit(1);
  }
}

updateContacts();
