import { getDatabase } from './simple-client';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

/**
 * Initialize the simplified database
 * Creates tables and admin user if they don't exist
 */
export function initializeDatabase() {
  const db = getDatabase();

  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);

  // Create projects table
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      year TEXT NOT NULL,
      image TEXT,
      image_alt TEXT,
      images TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  // Create content table (key-value store)
  db.exec(`
    CREATE TABLE IF NOT EXISTS content (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  // Create pageviews table
  db.exec(`
    CREATE TABLE IF NOT EXISTS pageviews (
      id TEXT PRIMARY KEY,
      path TEXT NOT NULL,
      ip TEXT,
      timestamp TEXT NOT NULL
    )
  `);

  // Create admin user if doesn't exist
  const adminEmail = 'baracuda.max1@gmail.com';
  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail);

  if (!existingUser) {
    const passwordHash = bcrypt.hashSync('Raf070100', 10);
    const now = new Date().toISOString();
    
    db.prepare(`
      INSERT INTO users (id, email, password_hash, created_at)
      VALUES (?, ?, ?, ?)
    `).run(randomUUID(), adminEmail, passwordHash, now);

    console.log('Admin user created:', adminEmail);
  } else {
    console.log('Admin user already exists');
  }

  console.log('Database initialized successfully');
}
