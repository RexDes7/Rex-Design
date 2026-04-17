/**
 * Property Test 12: No setInterval for animations
 * Property Test 17: Configurable animation components
 * 
 * Validates: Requirements 7.3, 9.3
 */

import fs from 'fs';
import path from 'path';

const libAnimationsDir = path.join(process.cwd(), 'lib', 'animations');
const componentsAnimationsDir = path.join(process.cwd(), 'components', 'animations');
const stylesAnimationsDir = path.join(process.cwd(), 'styles', 'animations');

/**
 * Recursively find all files matching extension in directory
 */
function findFiles(dir: string, extension: string): string[] {
  let results: string[] = [];
  
  if (!fs.existsSync(dir)) return results;
  
  const list = fs.readdirSync(dir);
  
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      results = results.concat(findFiles(filePath, extension));
    } else if (file.endsWith(extension)) {
      results.push(filePath);
    }
  });
  
  return results;
}

describe('Property Test 12: No setInterval for animations', () => {
  it('should not use setInterval in animation components', () => {
    const tsxFiles = findFiles(componentsAnimationsDir, '.tsx');
    const tsFiles = findFiles(libAnimationsDir, '.ts');
    const allFiles = [...tsxFiles, ...tsFiles];
    
    allFiles.forEach((filePath) => {
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Should not use setInterval for animations
      // Allow setInterval in non-animation contexts (e.g., polling)
      const hasSetInterval = /setInterval/.test(content);
      
      expect(hasSetInterval).toBe(false);
    });
  });

  it('should not use setInterval in animation styles', () => {
    const cssFiles = findFiles(stylesAnimationsDir, '.css');
    
    // CSS files shouldn't have setInterval anyway, but verify no inline JS
    cssFiles.forEach((filePath) => {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).not.toMatch(/setInterval/);
    });
  });

  it('should use requestAnimationFrame or CSS animations instead', () => {
    // Verify that animation components use proper animation techniques
    const fadeInPath = path.join(componentsAnimationsDir, 'FadeInWhenVisible.tsx');
    const animatedSectionPath = path.join(componentsAnimationsDir, 'AnimatedSection.tsx');
    const marqueePath = path.join(componentsAnimationsDir, 'Marquee.tsx');
    
    // FadeInWhenVisible should use Framer Motion (which uses requestAnimationFrame internally)
    if (fs.existsSync(fadeInPath)) {
      const content = fs.readFileSync(fadeInPath, 'utf-8');
      expect(content).toMatch(/framer-motion|motion\./i);
    }
    
    // AnimatedSection should use Framer Motion
    if (fs.existsSync(animatedSectionPath)) {
      const content = fs.readFileSync(animatedSectionPath, 'utf-8');
      expect(content).toMatch(/framer-motion|motion\./i);
    }
    
    // Marquee should use CSS animations
    if (fs.existsSync(marqueePath)) {
      const content = fs.readFileSync(marqueePath, 'utf-8');
      expect(content).toMatch(/animation|@keyframes/i);
    }
  });
});

describe('Property Test 17: Configurable animation components', () => {
  describe('Animation config usage', () => {
    it('should import animationConfig in animation components', () => {
      const files = [
        path.join(libAnimationsDir, 'variants.ts'),
        path.join(componentsAnimationsDir, 'AnimatedSection.tsx'),
      ];
      
      files.forEach((filePath) => {
        if (!fs.existsSync(filePath)) return;
        
        const content = fs.readFileSync(filePath, 'utf-8');
        expect(content).toMatch(/animationConfig|from.*config/i);
      });
    });

    it('should use config values instead of hardcoded numbers', () => {
      const variantsPath = path.join(libAnimationsDir, 'variants.ts');
      const content = fs.readFileSync(variantsPath, 'utf-8');
      
      // Should reference config for durations
      expect(content).toMatch(/animationConfig\.durations/i);
      // Should reference config for easing
      expect(content).toMatch(/animationConfig\.easing/i);
      // Should reference config for stagger
      expect(content).toMatch(/animationConfig\.stagger/i);
    });
  });

  describe('Component configurability', () => {
    it('should accept duration as prop in FadeInWhenVisible', () => {
      const fadeInPath = path.join(componentsAnimationsDir, 'FadeInWhenVisible.tsx');
      const content = fs.readFileSync(fadeInPath, 'utf-8');
      
      expect(content).toMatch(/duration\??:\s*number/);
    });

    it('should accept staggerDelay as prop in AnimatedSection', () => {
      const animatedSectionPath = path.join(componentsAnimationsDir, 'AnimatedSection.tsx');
      const content = fs.readFileSync(animatedSectionPath, 'utf-8');
      
      expect(content).toMatch(/staggerDelay\??:\s*number/);
    });

    it('should accept speed as prop in Marquee', () => {
      const marqueePath = path.join(componentsAnimationsDir, 'Marquee.tsx');
      const content = fs.readFileSync(marqueePath, 'utf-8');
      
      expect(content).toMatch(/speed\??:\s*number/);
    });

    it('should accept variant type as prop in FadeInWhenVisible', () => {
      const fadeInPath = path.join(componentsAnimationsDir, 'FadeInWhenVisible.tsx');
      const content = fs.readFileSync(fadeInPath, 'utf-8');
      
      expect(content).toMatch(/variant\??:/);
    });
  });

  describe('Config structure', () => {
    it('should have all required config sections', () => {
      const configPath = path.join(libAnimationsDir, 'config.ts');
      const content = fs.readFileSync(configPath, 'utf-8');
      
      expect(content).toMatch(/durations:/);
      expect(content).toMatch(/easing:/);
      expect(content).toMatch(/stagger:/);
      expect(content).toMatch(/marquee:/);
      expect(content).toMatch(/thresholds:/);
    });

    it('should export typed config', () => {
      const configPath = path.join(libAnimationsDir, 'config.ts');
      const content = fs.readFileSync(configPath, 'utf-8');
      
      expect(content).toMatch(/export.*AnimationConfig|as const/i);
    });
  });
});
