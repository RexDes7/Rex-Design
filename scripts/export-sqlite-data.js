const Database = require('better-sqlite3');
const fs = require('fs');

const db = new Database('admin.db');

console.log('Exporting data from SQLite...');

// Export users
const users = db.prepare('SELECT * FROM users').all();
console.log(`Found ${users.length} users`);

// Export projects
const projects = db.prepare('SELECT * FROM projects ORDER BY display_order').all();
console.log(`Found ${projects.length} projects`);

// Export content
const content = db.prepare('SELECT * FROM content').all();
console.log(`Found ${content.length} content items`);

// Export pageviews (last 1000)
const pageviews = db.prepare('SELECT * FROM pageviews ORDER BY timestamp DESC LIMIT 1000').all();
console.log(`Found ${pageviews.length} pageviews`);

// Export contacts (if table exists)
let contacts = [];
try {
  contacts = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all();
  console.log(`Found ${contacts.length} contacts`);
} catch (e) {
  console.log('No contacts table found');
}

const exportData = {
  users,
  projects,
  content,
  pageviews,
  contacts,
  exportedAt: new Date().toISOString(),
};

fs.writeFileSync('mongodb-import-data.json', JSON.stringify(exportData, null, 2));
console.log('\n✓ Data exported to mongodb-import-data.json');
console.log('\nYou can now import this data to MongoDB using:');
console.log('1. MongoDB Compass - Import JSON');
console.log('2. VS Code MongoDB extension');
console.log('3. mongoimport command');

db.close();
