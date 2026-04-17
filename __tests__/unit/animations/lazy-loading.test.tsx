/**
 * Unit tests for Lazy Loading and Code Splitting
 * Task 15.1: Реализовать lazy loading для Framer Motion
 * Task 15.3: Написать unit tests для оптимизаций
 * Requirements: 7.5
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Lazy Loading - Framer Motion Code Splitting', () => {
  const animationComponentsDir = path.join(process.cwd(), 'components', 'animations');

  describe('Source Code Verification', () => {
    it('should use dynamic import in LazyFadeInWhenVisible', () => {
      const filePath = path.join(animationComponentsDir, 'LazyFadeInWhenVisible.tsx');
      const content = fs.readFileSync(filePath, 'utf8');

      // Verify dynamic import from Next.js is used
      expect(content).toContain("import dynamic from 'next/dynamic'");
      expect(content).toContain("dynamic(() => import('./FadeInWhenVisible')");

      // Verify ssr: false is set
      expect(content).toContain('ssr: false');

      // Verify loading state is null
      expect(content).toMatch(/loading:\s*\(\)\s*=>\s*null/);
    });

    it('should use dynamic import in LazyAnimatedSection', () => {
      const filePath = path.join(animationComponentsDir, 'LazyAnimatedSection.tsx');
      const content = fs.readFileSync(filePath, 'utf8');

      // Verify dynamic import from Next.js is used
      expect(content).toContain("import dynamic from 'next/dynamic'");
      expect(content).toContain("dynamic(() => import('./AnimatedSection')");

      // Verify ssr: false is set
      expect(content).toContain('ssr: false');

      // Verify loading state is null
      expect(content).toMatch(/loading:\s*\(\)\s*=>\s*null/);
    });

    it('should export lazy components from index', () => {
      const indexPath = path.join(animationComponentsDir, 'index.ts');
      const content = fs.readFileSync(indexPath, 'utf8');

      // Verify lazy components are exported as default
      expect(content).toContain("export { default as FadeInWhenVisible } from './LazyFadeInWhenVisible'");
      expect(content).toContain("export { default as AnimatedSection } from './LazyAnimatedSection'");
    });

    it('should re-export types from index', () => {
      const indexPath = path.join(animationComponentsDir, 'index.ts');
      const content = fs.readFileSync(indexPath, 'utf8');

      // Verify types are re-exported
      expect(content).toContain('export type { FadeInWhenVisibleProps }');
      expect(content).toContain('export type { AnimatedSectionProps }');
      expect(content).toContain('export type { MarqueeProps }');
    });
  });

  describe('Module Structure', () => {
    it('should have all required animation files', () => {
      const requiredFiles = [
        'FadeInWhenVisible.tsx',
        'AnimatedSection.tsx',
        'LazyFadeInWhenVisible.tsx',
        'LazyAnimatedSection.tsx',
        'Marquee.tsx',
        'index.ts',
      ];

      requiredFiles.forEach((file) => {
        const filePath = path.join(animationComponentsDir, file);
        expect(fs.existsSync(filePath)).toBe(true);
      });
    });

    it('should have lib animation files', () => {
      const libAnimationsDir = path.join(process.cwd(), 'lib', 'animations');
      const requiredFiles = [
        'config.ts',
        'variants.ts',
        'errorHandling.ts',
      ];

      requiredFiles.forEach((file) => {
        const filePath = path.join(libAnimationsDir, file);
        expect(fs.existsSync(filePath)).toBe(true);
      });
    });
  });

  describe('Code Splitting Implementation', () => {
    it('should not import framer-motion in index.ts', () => {
      const indexPath = path.join(animationComponentsDir, 'index.ts');
      const content = fs.readFileSync(indexPath, 'utf8');

      // Index should not directly import framer-motion
      expect(content).not.toMatch(/from\s+['"]framer-motion['"]/);
    });

    it('should import from lazy wrappers in main page', () => {
      const mainPagePath = path.join(process.cwd(), 'app', 'page.tsx');
      const content = fs.readFileSync(mainPagePath, 'utf8');

      // Main page should import from @/components/animations
      expect(content).toMatch(/from\s+['"]@\/components\/animations['"]/);

      // Should not import framer-motion directly
      expect(content).not.toMatch(/from\s+['"]framer-motion['"]/);
    });
  });
});
