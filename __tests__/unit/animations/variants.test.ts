/**
 * Unit tests for Framer Motion variants
 * Validates: Requirements 9.2, 9.3
 */

import {
  fadeInVariants,
  slideUpVariants,
  slideLeftVariants,
  scaleVariants,
  staggerContainerVariants,
} from '@/lib/animations/variants';
import { animationConfig } from '@/lib/animations/config';

describe('Framer Motion Variants', () => {
  describe('fadeInVariants', () => {
    it('should have hidden and visible states', () => {
      expect(fadeInVariants.hidden).toBeDefined();
      expect(fadeInVariants.visible).toBeDefined();
    });

    it('should animate opacity from 0 to 1', () => {
      expect(fadeInVariants.hidden).toHaveProperty('opacity', 0);
      expect(fadeInVariants.visible).toHaveProperty('opacity', 1);
    });

    it('should use duration from config', () => {
      const expectedDuration = animationConfig.durations.normal / 1000;
      expect(fadeInVariants.visible.transition?.duration).toBe(expectedDuration);
    });

    it('should use easing from config', () => {
      expect(fadeInVariants.visible.transition?.ease).toBe(animationConfig.easing.easeOut);
    });
  });

  describe('slideUpVariants', () => {
    it('should have hidden and visible states', () => {
      expect(slideUpVariants.hidden).toBeDefined();
      expect(slideUpVariants.visible).toBeDefined();
    });

    it('should animate opacity and y position', () => {
      expect(slideUpVariants.hidden).toHaveProperty('opacity', 0);
      expect(slideUpVariants.hidden).toHaveProperty('y', 50);
      expect(slideUpVariants.visible).toHaveProperty('opacity', 1);
      expect(slideUpVariants.visible).toHaveProperty('y', 0);
    });

    it('should use duration from config', () => {
      const expectedDuration = animationConfig.durations.normal / 1000;
      expect(slideUpVariants.visible.transition?.duration).toBe(expectedDuration);
    });
  });

  describe('slideLeftVariants', () => {
    it('should have hidden and visible states', () => {
      expect(slideLeftVariants.hidden).toBeDefined();
      expect(slideLeftVariants.visible).toBeDefined();
    });

    it('should animate opacity and x position', () => {
      expect(slideLeftVariants.hidden).toHaveProperty('opacity', 0);
      expect(slideLeftVariants.hidden).toHaveProperty('x', 50);
      expect(slideLeftVariants.visible).toHaveProperty('opacity', 1);
      expect(slideLeftVariants.visible).toHaveProperty('x', 0);
    });

    it('should use duration from config', () => {
      const expectedDuration = animationConfig.durations.normal / 1000;
      expect(slideLeftVariants.visible.transition?.duration).toBe(expectedDuration);
    });
  });

  describe('scaleVariants', () => {
    it('should have hidden and visible states', () => {
      expect(scaleVariants.hidden).toBeDefined();
      expect(scaleVariants.visible).toBeDefined();
    });

    it('should animate opacity and scale', () => {
      expect(scaleVariants.hidden).toHaveProperty('opacity', 0);
      expect(scaleVariants.hidden).toHaveProperty('scale', 0.8);
      expect(scaleVariants.visible).toHaveProperty('opacity', 1);
      expect(scaleVariants.visible).toHaveProperty('scale', 1);
    });

    it('should use duration from config', () => {
      const expectedDuration = animationConfig.durations.normal / 1000;
      expect(scaleVariants.visible.transition?.duration).toBe(expectedDuration);
    });
  });

  describe('staggerContainerVariants', () => {
    it('should have hidden and visible states', () => {
      expect(staggerContainerVariants.hidden).toBeDefined();
      expect(staggerContainerVariants.visible).toBeDefined();
    });

    it('should animate opacity', () => {
      expect(staggerContainerVariants.hidden).toHaveProperty('opacity', 0);
      expect(staggerContainerVariants.visible).toHaveProperty('opacity', 1);
    });

    it('should have staggerChildren in transition', () => {
      expect(staggerContainerVariants.visible.transition).toHaveProperty('staggerChildren');
    });

    it('should use stagger delay from config', () => {
      const expectedStagger = animationConfig.stagger.cards / 1000;
      expect(staggerContainerVariants.visible.transition?.staggerChildren).toBe(expectedStagger);
    });
  });

  describe('GPU-accelerated properties', () => {
    it('should only use GPU-accelerated properties (opacity, transform)', () => {
      const allVariants = [
        fadeInVariants,
        slideUpVariants,
        slideLeftVariants,
        scaleVariants,
        staggerContainerVariants,
      ];

      const gpuAcceleratedProps = ['opacity', 'x', 'y', 'scale', 'rotate', 'transition'];

      allVariants.forEach(variant => {
        const hiddenKeys = Object.keys(variant.hidden || {});
        const visibleKeys = Object.keys(variant.visible || {});

        hiddenKeys.forEach(key => {
          expect(gpuAcceleratedProps).toContain(key);
        });

        visibleKeys.forEach(key => {
          expect(gpuAcceleratedProps).toContain(key);
        });
      });
    });
  });

  describe('Variant differences', () => {
    it('should have different animation properties for visual variety', () => {
      // fadeIn only animates opacity
      expect(fadeInVariants.hidden).not.toHaveProperty('y');
      expect(fadeInVariants.hidden).not.toHaveProperty('x');
      expect(fadeInVariants.hidden).not.toHaveProperty('scale');

      // slideUp animates y
      expect(slideUpVariants.hidden).toHaveProperty('y');
      expect(slideUpVariants.hidden).not.toHaveProperty('x');

      // slideLeft animates x
      expect(slideLeftVariants.hidden).toHaveProperty('x');
      expect(slideLeftVariants.hidden).not.toHaveProperty('y');

      // scale animates scale
      expect(scaleVariants.hidden).toHaveProperty('scale');
      expect(scaleVariants.hidden).not.toHaveProperty('y');
      expect(scaleVariants.hidden).not.toHaveProperty('x');
    });
  });
});
