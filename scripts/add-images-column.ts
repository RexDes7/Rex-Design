import { getDatabase } from '../lib/db/simple-client';

/**
 * Add images column to projects table
 */
function addImagesColumn() {
  const db = getDatabase();
  
  try {
    // Check if column exists
    const tableInfo = db.prepare("PRAGMA table_info(projects)").all() as any[];
    const hasImagesColumn = tableInfo.some(col => col.name === 'images');
    
    if (!hasImagesColumn) {
      db.exec('ALTER TABLE projects ADD COLUMN images TEXT');
      console.log('✓ Added images column to projects table');
    } else {
      console.log('✓ Images column already exists');
    }
  } catch (error) {
    console.error('Error adding images column:', error);
  }
}

addImagesColumn();
