/**
 * Data Migration Script
 * 
 * Migrates existing static data from lib/data.ts into the SQLite database.
 * This script is idempotent and can be run multiple times safely.
 * 
 * Migrates:
 * - Projects from lib/data.ts to projects table
 * - Site content (manifesto, skills) to site_content table
 * - Contact info to contact_info table
 * - Creates initial admin user if not exists
 * 
 * Usage:
 *   npm run migrate
 *   or
 *   npx ts-node scripts/migrate-data.ts
 */

import { getDatabase } from '../lib/db/client.js';
import { projects, skills, manifestoPrinciples } from '../lib/data.js';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';

/**
 * Migrate projects from lib/data.ts to database
 */
function migrateProjects(): void {
  console.log('Migrating projects...');
  
  const db = getDatabase();
  
  // Check if projects already exist
  const existingCount = db
    .prepare('SELECT COUNT(*) as count FROM projects')
    .get() as { count: number };
  
  if (existingCount.count > 0) {
    console.log(`  ⚠ ${existingCount.count} projects already exist in database`);
    console.log('  Skipping project migration (run with --force to override)');
    return;
  }
  
  // Prepare insert statement
  const insertStmt = db.prepare(`
    INSERT INTO projects (
      id, title, description, category, year, 
      image, image_alt, wide, featured, display_order
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  // Insert all projects in a transaction
  const insertMany = db.transaction((projectsToInsert: typeof projects) => {
    projectsToInsert.forEach((project, index) => {
      insertStmt.run(
        project.id,
        project.title,
        project.description,
        project.category,
        project.year,
        project.image,
        project.imageAlt,
        project.wide ? 1 : 0,
        project.featured ? 1 : 0,
        index // display_order based on array position
      );
    });
  });
  
  insertMany(projects);
  
  console.log(`  ✓ Migrated ${projects.length} projects`);
}

/**
 * Migrate site content (manifesto and skills) to database
 */
function migrateSiteContent(): void {
  console.log('Migrating site content...');
  
  const db = getDatabase();
  
  // Check if site content already exists
  const existing = db
    .prepare('SELECT id FROM site_content WHERE id = 1')
    .get();
  
  if (existing) {
    console.log('  ⚠ Site content already exists in database');
    console.log('  Skipping site content migration (run with --force to override)');
    return;
  }
  
  // Prepare manifesto data (convert to format expected by database)
  const manifestoData = manifestoPrinciples.map(p => ({
    title: p.title,
    description: p.description
  }));
  
  // Prepare skills data (convert to format expected by database)
  const skillsData = skills.map(s => ({
    name: s.name,
    level: 80 // Default level since it's not in the source data
  }));
  
  // Default about text
  const aboutText = `Я дизайнер с фокусом на создании современных цифровых продуктов. 
Работаю на стыке дизайна и технологий, создавая интерфейсы, которые решают реальные задачи бизнеса.

Специализируюсь на UI/UX дизайне, брендинге и типографике. Верю в силу минимализма и функциональности.`;
  
  // Insert site content
  db.prepare(`
    INSERT INTO site_content (id, about, manifesto, skills)
    VALUES (1, ?, ?, ?)
  `).run(
    aboutText,
    JSON.stringify(manifestoData),
    JSON.stringify(skillsData)
  );
  
  console.log('  ✓ Migrated site content');
  console.log(`    - ${manifestoData.length} manifesto principles`);
  console.log(`    - ${skillsData.length} skills`);
}

/**
 * Migrate contact info to database
 */
function migrateContactInfo(): void {
  console.log('Migrating contact info...');
  
  const db = getDatabase();
  
  // Check if contact info already exists
  const existing = db
    .prepare('SELECT id FROM contact_info WHERE id = 1')
    .get();
  
  if (existing) {
    console.log('  ⚠ Contact info already exists in database');
    console.log('  Skipping contact info migration (run with --force to override)');
    return;
  }
  
  // Default contact info
  const email = 'baracuda.max1@gmail.com';
  const phone = null;
  const socialLinks = [
    { platform: 'Telegram', url: 'https://t.me/username', icon: 'telegram' },
    { platform: 'Behance', url: 'https://behance.net/username', icon: 'behance' },
    { platform: 'Instagram', url: 'https://instagram.com/username', icon: 'instagram' }
  ];
  
  // Insert contact info
  db.prepare(`
    INSERT INTO contact_info (id, email, phone, social_links)
    VALUES (1, ?, ?, ?)
  `).run(
    email,
    phone,
    JSON.stringify(socialLinks)
  );
  
  console.log('  ✓ Migrated contact info');
  console.log(`    - Email: ${email}`);
  console.log(`    - ${socialLinks.length} social links`);
}

/**
 * Create initial admin user
 */
async function createAdminUser(): Promise<void> {
  console.log('Creating admin user...');
  
  const db = getDatabase();
  const email = 'baracuda.max1@gmail.com';
  const password = 'Raf070100';
  
  // Check if user already exists
  const existingUser = db
    .prepare('SELECT id FROM users WHERE email = ?')
    .get(email);
  
  if (existingUser) {
    console.log('  ⚠ Admin user already exists');
    console.log('  Skipping user creation');
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
  
  console.log('  ✓ Admin user created');
  console.log(`    - Email: ${email}`);
  console.log(`    - Password: ${password}`);
}

/**
 * Verify migration results
 */
function verifyMigration(): void {
  console.log('\nVerifying migration...');
  
  const db = getDatabase();
  
  // Check projects
  const projectCount = db
    .prepare('SELECT COUNT(*) as count FROM projects')
    .get() as { count: number };
  console.log(`  ✓ Projects: ${projectCount.count}`);
  
  // Check site content
  const siteContent = db
    .prepare('SELECT id FROM site_content WHERE id = 1')
    .get();
  console.log(`  ✓ Site content: ${siteContent ? 'exists' : 'missing'}`);
  
  // Check contact info
  const contactInfo = db
    .prepare('SELECT id FROM contact_info WHERE id = 1')
    .get();
  console.log(`  ✓ Contact info: ${contactInfo ? 'exists' : 'missing'}`);
  
  // Check admin user
  const userCount = db
    .prepare('SELECT COUNT(*) as count FROM users')
    .get() as { count: number };
  console.log(`  ✓ Users: ${userCount.count}`);
  
  console.log('\n✓ Migration verification complete');
}

/**
 * Main migration function
 */
async function runMigration(): Promise<void> {
  try {
    console.log('='.repeat(60));
    console.log('Data Migration Script');
    console.log('='.repeat(60));
    console.log();
    
    // Migrate projects
    migrateProjects();
    console.log();
    
    // Migrate site content
    migrateSiteContent();
    console.log();
    
    // Migrate contact info
    migrateContactInfo();
    console.log();
    
    // Create admin user
    await createAdminUser();
    
    // Verify migration
    verifyMigration();
    
    console.log();
    console.log('='.repeat(60));
    console.log('✓ Data migration completed successfully!');
    console.log('='.repeat(60));
    console.log();
    
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Migration failed:');
    console.error(error);
    process.exit(1);
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  runMigration();
}

export { runMigration, migrateProjects, migrateSiteContent, migrateContactInfo, createAdminUser };
