import { getDatabase } from './mongodb';
import bcrypt from 'bcryptjs';

/**
 * Initialize MongoDB collections and indexes
 */
export async function initializeMongoDB() {
  try {
    const db = await getDatabase();

    // Create collections if they don't exist
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    // Users collection
    if (!collectionNames.includes('users')) {
      await db.createCollection('users');
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
    }

    // Projects collection
    if (!collectionNames.includes('projects')) {
      await db.createCollection('projects');
      await db.collection('projects').createIndex({ display_order: 1 });
      await db.collection('projects').createIndex({ created_at: -1 });
    }

    // Content collection
    if (!collectionNames.includes('content')) {
      await db.createCollection('content');
      await db.collection('content').createIndex({ key: 1 }, { unique: true });
    }

    // Pageviews collection
    if (!collectionNames.includes('pageviews')) {
      await db.createCollection('pageviews');
      await db.collection('pageviews').createIndex({ timestamp: -1 });
      await db.collection('pageviews').createIndex({ path: 1 });
    }

    // Contacts collection
    if (!collectionNames.includes('contacts')) {
      await db.createCollection('contacts');
      await db.collection('contacts').createIndex({ created_at: -1 });
    }

    // Create admin user if doesn't exist
    const adminEmail = 'baracuda.max1@gmail.com';
    const existingUser = await db.collection('users').findOne({ email: adminEmail });

    if (!existingUser) {
      const passwordHash = bcrypt.hashSync('Raf070100', 10);
      await db.collection('users').insertOne({
        email: adminEmail,
        password_hash: passwordHash,
        created_at: new Date().toISOString(),
      });
      console.log('Admin user created:', adminEmail);
    } else {
      console.log('Admin user already exists');
    }

    console.log('MongoDB initialized successfully');
  } catch (error) {
    console.error('Error initializing MongoDB:', error);
    throw error;
  }
}
