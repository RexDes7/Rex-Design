/**
 * Property Test 1: Existing animations preservation
 * Property Test 2: Brutalism style consistency
 * 
 * Validates: Requirements 1.1, 1.2, 1.3, 1.4
 * 
 * These property tests verify that existing animations and brutalism style
 * are preserved after adding new animation enhancements.
 */

import fs from 'fs';
import path from 'path';

const componentsDir = path.join(process.cwd(), 'components');
const stylesDir = path.join(process.cwd(), 'styles');

describe('Property Test 1: Existing animations preservation', () => {
  describe('Custom cursor component', () => {
    it('should have CustomCursor component with trail effect', () => {
      const cursorPath = path.join(componentsDir, 'CustomCursor.tsx');
      expect(fs.existsSync(cursorPath)).toBe(true);

      const content = fs.readFileSync(cursorPath, 'utf-8');
      
      // Verify trail effect implementation
      expect(content).toMatch(/trail/i);
      expect(content).toMatch(/mousemove/i);
    });

    it('should have CustomCursor styles', () => {
      const cursorStylesPath = path.join(stylesDir, 'CustomCursor.module.css');
      expect(fs.existsSync(cursorStylesPath)).toBe(true);

      const content = fs.readFileSync(cursorStylesPath, 'utf-8');
      
      // Verify cursor styling
      expect(content).toMatch(/cursor/i);
      expect(content).toMatch(/fixed/i);
      expect(content).toMatch(/pointer-events:\s*none/i);
    });

    it('should render CustomCursor in layout', () => {
      const layoutPath = path.join(process.cwd(), 'app', 'layout.tsx');
      expect(fs.existsSync(layoutPath)).toBe(true);

      const content = fs.readFileSync(layoutPath, 'utf-8');
      expect(content).toMatch(/CustomCursor/i);
    });
  });

  describe('Hover effects preservation', () => {
    const hoverFiles = [
      'Navigation.module.css',
      'Home.module.css',
      'ProjectCard.module.css',
      'SkillCard.module.css',
      'ManifestoCard.module.css',
    ];

    it.each(hoverFiles)('should have hover effects in %s', (fileName) => {
      const filePath = path.join(stylesDir, fileName);
      
      if (!fs.existsSync(filePath)) return; // Skip if file doesn't exist

      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Should have at least one hover state
      const hasHover = /:hover/.test(content);
      expect(hasHover).toBe(true);
    });

    it('should use transform in hover effects (GPU-accelerated)', () => {
      const navPath = path.join(stylesDir, 'Navigation.module.css');
      const content = fs.readFileSync(navPath, 'utf-8');
      
      // Should use transform for hover animations
      expect(content).toMatch(/transform|translate|scale/i);
    });
  });

  describe('Animation technology consistency', () => {
    it('should use CSS transitions for simple hover effects', () => {
      const navPath = path.join(stylesDir, 'Navigation.module.css');
      const content = fs.readFileSync(navPath, 'utf-8');
      
      expect(content).toMatch(/transition:/i);
    });

    it('should use Framer Motion for scroll-triggered animations', () => {
      const fadeInPath = path.join(componentsDir, 'animations', 'FadeInWhenVisible.tsx');
      const content = fs.readFileSync(fadeInPath, 'utf-8');
      
      expect(content).toMatch(/framer-motion/i);
      expect(content).toMatch(/useInView|whileInView/i);
    });
  });
});

describe('Property Test 2: Brutalism style consistency', () => {
  describe('Yellow color (#ffd709) usage', () => {
    it('should use yellow as primary brand color', () => {
      const globalsPath = path.join(stylesDir, 'globals.css');
      const content = fs.readFileSync(globalsPath, 'utf-8');
      
      expect(content).toMatch(/#ffd709|--primary-fixed.*#ffd709/i);
    });

    it('should apply yellow to hero section', () => {
      const homePath = path.join(stylesDir, 'Home.module.css');
      const content = fs.readFileSync(homePath, 'utf-8');
      
      expect(content).toMatch(/#ffd709/);
    });
  });

  describe('Black borders', () => {
    it('should use solid black borders on components', () => {
      const files = [
        'ProjectCard.module.css',
        'Home.module.css',
        'Navigation.module.css',
      ];

      files.forEach((fileName) => {
        const filePath = path.join(stylesDir, fileName);
        if (!fs.existsSync(filePath)) return;

        const content = fs.readFileSync(filePath, 'utf-8');
        expect(content).toMatch(/border.*solid.*#000000|border.*#000000.*solid/i);
      });
    });

    it('should use hard black box shadows', () => {
      const projectCardPath = path.join(stylesDir, 'ProjectCard.module.css');
      const content = fs.readFileSync(projectCardPath, 'utf-8');
      
      expect(content).toMatch(/box-shadow.*#000000/i);
    });
  });

  describe('Bold typography', () => {
    it('should use font-weight 900 for headings and buttons', () => {
      const files = [
        'Home.module.css',
        'ProjectCard.module.css',
        'Navigation.module.css',
      ];

      let found900 = false;
      files.forEach((fileName) => {
        const filePath = path.join(stylesDir, fileName);
        if (!fs.existsSync(filePath)) return;

        const content = fs.readFileSync(filePath, 'utf-8');
        if (/font-weight:\s*900/.test(content)) {
          found900 = true;
        }
      });

      expect(found900).toBe(true);
    });

    it('should use uppercase text transforms', () => {
      const navPath = path.join(stylesDir, 'Navigation.module.css');
      const content = fs.readFileSync(navPath, 'utf-8');
      
      expect(content).toMatch(/text-transform:\s*uppercase/i);
    });
  });

  describe('Zero border-radius (sharp corners)', () => {
    it('should enforce border-radius: 0px globally', () => {
      const globalsPath = path.join(stylesDir, 'globals.css');
      const content = fs.readFileSync(globalsPath, 'utf-8');
      
      // Can be either direct 0px or via CSS variable that resolves to 0px
      const hasDirectZero = /border-radius:\s*0px\s*!important/i.test(content);
      const hasVarZero = /border-radius:\s*var\(--border-radius\)\s*!important/i.test(content);
      const hasVarDefZero = /--border-radius:\s*0px/i.test(content);
      
      expect(hasDirectZero || (hasVarZero && hasVarDefZero)).toBe(true);
    });
  });

  describe('Brutalism style in animation components', () => {
    it('should not introduce rounded corners in animation components', () => {
      const animationStylesDir = path.join(stylesDir, 'animations');
      
      if (!fs.existsSync(animationStylesDir)) return;

      const files = fs.readdirSync(animationStylesDir).filter(f => f.endsWith('.css'));
      
      files.forEach((fileName) => {
        const filePath = path.join(animationStylesDir, fileName);
        const content = fs.readFileSync(filePath, 'utf-8');
        
        // Should not have border-radius > 0
        const borderRadiusMatches = content.match(/border-radius:\s*(\d+)px/g);
        if (borderRadiusMatches) {
          borderRadiusMatches.forEach((match) => {
            const value = parseInt(match.match(/\d+/)?.[0] || '0');
            expect(value).toBe(0);
          });
        }
      });
    });
  });
});
