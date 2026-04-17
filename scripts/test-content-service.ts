/**
 * Test Content Service directly
 */

import { contentService } from '../lib/services/content.service';

console.log('Testing content service...\n');

async function test() {
  try {
    const projects = await contentService.getProjects();
    console.log('Projects:', projects.length);
    projects.forEach(p => {
      console.log(`  - ${p.title}`);
    });
  } catch (error) {
    console.error('Error getting projects:', error);
  }

  try {
    const contactInfo = await contentService.getContactInfo();
    console.log('\nContact Info:', contactInfo);
  } catch (error) {
    console.error('Error getting contact info:', error);
  }

  console.log('\n✓ Test completed!');
}

test();
