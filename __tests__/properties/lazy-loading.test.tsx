/**
 * Property Test: Animation Library Code Splitting
 * Task 15.4: Property test для animation library code splitting
 * Property 13: Animation library code splitting
 * Validates: Requirements 7.5
 *
 * This test verifies that Framer Motion is properly code-split
 * using dynamic imports to reduce initial bundle size.
 */

import fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';

describe('Property 13: Animation Library Code Splitting', () => {
  /**
   * Property: Framer Motion should only be imported in animation components
   * and loaded lazily through dynamic imports.
   *
   * We verify this by checking:
   * 1. Framer Motion imports are isolated to animation components
   * 2. Lazy wrappers use dynamic() with ssr: false
   * 3. Main pages import from lazy wrappers, not directly from framer-motion
   */

  const animationComponentsDir = path.join(process.cwd(), 'components', 'animations');
  const appDir = path.join(process.cwd(), 'app');

  // Files that are allowed to import framer-motion directly
  const allowedFramerMotionImports = [
    'FadeInWhenVisible.tsx',
    'AnimatedSection.tsx',
    'Marquee.tsx',
    'variants.ts',
    'config.ts',
    'errorHandling.ts',
    'LazyFadeInWhenVisible.tsx',
    'LazyAnimatedSection.tsx',
  ];

  it('should isolate Framer Motion imports to animation components', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(['components', 'app']),
        (directory) => {
          const searchDir = directory === 'components'
            ? path.join(process.cwd(), 'components')
            : path.join(process.cwd(), 'app');

          const files = getAllFilesRecursively(searchDir);

          files.forEach((filePath) => {
            if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;

            const fileName = path.basename(filePath);
            const content = fs.readFileSync(filePath, 'utf8');

            // Check if file imports framer-motion
            const hasFramerMotionImport = /from\s+['"]framer-motion['"]/.test(content);

            if (hasFramerMotionImport) {
              // Verify it's in an allowed location
              const isAllowed = allowedFramerMotionImports.some(
                (allowed) => filePath.includes(`animations/${allowed}`)
              );

              // Pages and non-animation components should NOT import framer-motion directly
              if (directory === 'app' || !filePath.includes('animations')) {
                expect(isAllowed).toBe(true);
              }
            }
          });

          return true;
        }
      ),
      { numRuns: 1 }
    );
  });

  it('should use dynamic import with ssr: false for lazy components', () => {
    const files = ['LazyFadeInWhenVisible.tsx', 'LazyAnimatedSection.tsx'];

    files.forEach((fileName) => {
      const filePath = path.join(animationComponentsDir, fileName);
      const content = fs.readFileSync(filePath, 'utf8');

      // Verify dynamic import is used
      expect(content).toMatch(/import dynamic from ['"]next\/dynamic['"]/);

      // Verify ssr: false is set
      expect(content).toMatch(/ssr:\s*false/);

      // Verify the import path points to the non-lazy component
      expect(content).toMatch(/import\(['"]\.\/(FadeInWhenVisible|AnimatedSection)['"]\)/);
    });
  });

  it('should export lazy components as default from index', () => {
    const indexPath = path.join(animationComponentsDir, 'index.ts');
    const content = fs.readFileSync(indexPath, 'utf8');

    // Verify lazy components are exported as default
    expect(content).toContain("export { default as FadeInWhenVisible } from './LazyFadeInWhenVisible'");
    expect(content).toContain("export { default as AnimatedSection } from './LazyAnimatedSection'");
  });

  it('should not have framer-motion in main page imports', () => {
    const mainPagePath = path.join(appDir, 'page.tsx');
    const content = fs.readFileSync(mainPagePath, 'utf8');

    // Main page should import from @/components/animations, not directly from framer-motion
    expect(content).not.toMatch(/from\s+['"]framer-motion['"]/);

    // Should import animation components
    expect(content).toMatch(/from\s+['"]@\/components\/animations['"]/);
  });

  it('should have loading: () => null for immediate render', () => {
    const files = ['LazyFadeInWhenVisible.tsx', 'LazyAnimatedSection.tsx'];

    files.forEach((fileName) => {
      const filePath = path.join(animationComponentsDir, fileName);
      const content = fs.readFileSync(filePath, 'utf8');

      // Verify loading state is set to null (immediate render)
      expect(content).toMatch(/loading:\s*\(\)\s*=>\s*null/);
    });
  });
});

// Helper function to get all files recursively
function getAllFilesRecursively(dir: string): string[] {
  const files: string[] = [];

  try {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        if (!item.startsWith('__') && item !== 'node_modules' && item !== '.next') {
          files.push(...getAllFilesRecursively(fullPath));
        }
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Ignore errors for directories that don't exist
  }

  return files;
}
