/**
 * Test Data Migration
 * 
 * Simple script to verify that data can be read from the database
 * through the content service and lib/data.ts
 */

import { projects, skills, manifestoPrinciples } from '../lib/data';

console.log('Testing data migration...\n');

console.log('Projects:', projects.length);
projects.forEach(p => {
  console.log(`  - ${p.title} (${p.category}, ${p.year})`);
});

console.log('\nSkills:', skills.length);
skills.forEach(s => {
  console.log(`  - ${s.name}`);
});

console.log('\nManifesto Principles:', manifestoPrinciples.length);
manifestoPrinciples.forEach(m => {
  console.log(`  - ${m.number}. ${m.title}`);
});

console.log('\n✓ Data migration test completed successfully!');
