/**
 * Verification script for lazy loading implementation
 * 
 * This script verifies that:
 * 1. Lazy-loaded components exist
 * 2. They use Next.js dynamic imports
 * 3. The barrel export uses lazy versions by default
 */

const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '..', 'components', 'animations');

console.log('🔍 Verifying lazy loading implementation...\n');

// Check 1: Lazy components exist
const lazyFiles = [
  'LazyFadeInWhenVisible.tsx',
  'LazyAnimatedSection.tsx',
];

let allChecksPass = true;

console.log('✓ Check 1: Lazy component files exist');
lazyFiles.forEach(file => {
  const filePath = path.join(componentsDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✓ ${file} exists`);
  } else {
    console.log(`  ✗ ${file} NOT FOUND`);
    allChecksPass = false;
  }
});

// Check 2: Lazy components use dynamic imports
console.log('\n✓ Check 2: Lazy components use Next.js dynamic imports');
lazyFiles.forEach(file => {
  const filePath = path.join(componentsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  const hasDynamicImport = content.includes("import dynamic from 'next/dynamic'");
  const usesSSRFalse = content.includes('ssr: false');
  
  if (hasDynamicImport && usesSSRFalse) {
    console.log(`  ✓ ${file} uses dynamic import with ssr: false`);
  } else {
    console.log(`  ✗ ${file} missing proper dynamic import configuration`);
    allChecksPass = false;
  }
});

// Check 3: Barrel export uses lazy versions
console.log('\n✓ Check 3: Barrel export (index.ts) uses lazy versions');
const indexPath = path.join(componentsDir, 'index.ts');
if (fs.existsSync(indexPath)) {
  const content = fs.readFileSync(indexPath, 'utf8');
  
  const exportsLazyFadeIn = content.includes("from './LazyFadeInWhenVisible'");
  const exportsLazyAnimated = content.includes("from './LazyAnimatedSection'");
  
  if (exportsLazyFadeIn && exportsLazyAnimated) {
    console.log('  ✓ index.ts exports lazy-loaded components by default');
  } else {
    console.log('  ✗ index.ts does not export lazy versions');
    allChecksPass = false;
  }
} else {
  console.log('  ✗ index.ts NOT FOUND');
  allChecksPass = false;
}

// Check 4: Main page uses barrel import
console.log('\n✓ Check 4: Main page uses barrel import');
const pagePath = path.join(__dirname, '..', 'app', 'page.tsx');
if (fs.existsSync(pagePath)) {
  const content = fs.readFileSync(pagePath, 'utf8');
  
  const usesBarrelImport = content.includes("from '@/components/animations'");
  
  if (usesBarrelImport) {
    console.log('  ✓ app/page.tsx uses barrel import (lazy-loaded by default)');
  } else {
    console.log('  ⚠ app/page.tsx does not use barrel import (may be using direct imports)');
  }
} else {
  console.log('  ✗ app/page.tsx NOT FOUND');
  allChecksPass = false;
}

// Summary
console.log('\n' + '='.repeat(60));
if (allChecksPass) {
  console.log('✅ All checks passed! Lazy loading is properly implemented.');
  console.log('\nBenefits:');
  console.log('  • Framer Motion (~50KB gzipped) is code-split');
  console.log('  • Initial bundle size is reduced');
  console.log('  • Animation library loads on-demand');
  console.log('  • Faster initial page load');
} else {
  console.log('❌ Some checks failed. Please review the implementation.');
  process.exit(1);
}
