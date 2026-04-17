/**
 * Property Test: Responsive Animation Compatibility
 * Task 15.6: Property test для responsive compatibility
 * Property 15: Responsive animation compatibility
 * Validates: Requirements 8.3
 *
 * This test verifies that animations work correctly across different
 * viewport sizes and maintain visual consistency.
 */

import fc from 'fast-check';
import {
  getAnimationCapabilities,
  getAnimationComplexity,
  type AnimationComplexity,
} from '@/lib/animations/errorHandling';

describe('Property 15: Responsive Animation Compatibility', () => {
  const originalWindow = global.window;

  afterEach(() => {
    global.window = originalWindow;
  });

  const setupMockMatchMedia = (reducedMotion: boolean, viewportWidth: number) => {
    Object.defineProperty(global.window, 'matchMedia', {
      value: jest.fn().mockImplementation((query) => ({
        matches: query.includes('reduced-motion') ? reducedMotion : false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
      writable: true,
    });

    Object.defineProperty(global.window, 'innerWidth', {
      value: viewportWidth,
      writable: true,
    });
  };

  /**
   * Property: Animation complexity should adapt to viewport size
   *
   * We verify that the animation complexity function returns appropriate
   * values across different viewport sizes.
   */
  it('should determine animation complexity based on viewport size', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 3840 }), // Full range of viewport widths
        fc.boolean(), // reduced motion preference
        (viewportWidth, reducedMotion) => {
          setupMockMatchMedia(reducedMotion, viewportWidth);

          // Mock high-end device to isolate viewport testing
          Object.defineProperty(global.navigator, 'hardwareConcurrency', {
            value: 8,
            writable: true,
          });

          const complexity = getAnimationComplexity();

          // Should return a valid complexity level
          expect(['full', 'simplified', 'none']).toContain(complexity);

          // If reduced motion is enabled, should be 'none'
          if (reducedMotion) {
            expect(complexity).toBe('none');
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Mobile viewports should get simplified or full animations
   */
  it('should handle mobile viewports correctly', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 767 }), // Mobile viewport widths
        (viewportWidth) => {
          setupMockMatchMedia(false, viewportWidth);

          Object.defineProperty(global.navigator, 'hardwareConcurrency', {
            value: 8,
            writable: true,
          });

          const complexity = getAnimationComplexity();

          // Mobile should get simplified (due to viewport < 768)
          expect(complexity).toBe('simplified');

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property: Desktop viewports should get full animations
   */
  it('should handle desktop viewports correctly', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1024, max: 3840 }), // Desktop viewport widths
        (viewportWidth) => {
          setupMockMatchMedia(false, viewportWidth);

          Object.defineProperty(global.navigator, 'hardwareConcurrency', {
            value: 8,
            writable: true,
          });

          const complexity = getAnimationComplexity();

          // Desktop with good specs should get full animations
          expect(complexity).toBe('full');

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property: Edge case viewport sizes should be handled
   */
  it('should handle edge case viewport sizes', () => {
    const edgeCases = [
      { width: 320, expected: 'simplified' },  // Small phone
      { width: 375, expected: 'simplified' },  // iPhone
      { width: 414, expected: 'simplified' },  // Large phone
      { width: 767, expected: 'simplified' },  // Just below tablet
      { width: 768, expected: 'full' },        // Tablet breakpoint
      { width: 1024, expected: 'full' },       // Tablet
      { width: 1440, expected: 'full' },       // Laptop
      { width: 1920, expected: 'full' },       // Desktop
      { width: 2560, expected: 'full' },       // 2K
      { width: 3840, expected: 'full' },       // 4K
    ];

    edgeCases.forEach(({ width, expected }) => {
      setupMockMatchMedia(false, width);

      Object.defineProperty(global.navigator, 'hardwareConcurrency', {
        value: 8,
        writable: true,
      });

      const complexity = getAnimationComplexity();
      expect(complexity).toBe(expected);
    });
  });

  /**
   * Property: Animation capabilities should be detectable at all viewports
   */
  it('should detect animation capabilities at all viewport sizes', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 3840 }),
        (viewportWidth) => {
          setupMockMatchMedia(false, viewportWidth);

          const capabilities = getAnimationCapabilities();

          // Should always have these properties
          expect(capabilities).toHaveProperty('intersectionObserver');
          expect(capabilities).toHaveProperty('cssAnimations');
          expect(capabilities).toHaveProperty('transforms3d');
          expect(capabilities).toHaveProperty('reducedMotion');

          // Values should be booleans
          expect(typeof capabilities.intersectionObserver).toBe('boolean');
          expect(typeof capabilities.cssAnimations).toBe('boolean');
          expect(typeof capabilities.transforms3d).toBe('boolean');
          expect(typeof capabilities.reducedMotion).toBe('boolean');

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property: Reduced motion should be respected at all viewports
   */
  it('should respect reduced motion preference at all viewports', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 3840 }),
        (viewportWidth) => {
          setupMockMatchMedia(true, viewportWidth); // Reduced motion enabled

          Object.defineProperty(global.navigator, 'hardwareConcurrency', {
            value: 8,
            writable: true,
          });

          const complexity = getAnimationComplexity();

          // Should always be 'none' when reduced motion is preferred
          expect(complexity).toBe('none');

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property: Low-end devices should get simplified animations regardless of viewport
   */
  it('should simplify animations on low-end devices', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 768, max: 3840 }), // Tablet to desktop viewports
        fc.integer({ min: 1, max: 3 }), // Low-end CPU cores (1-3)
        (viewportWidth, cpuCores) => {
          setupMockMatchMedia(false, viewportWidth);

          Object.defineProperty(global.navigator, 'hardwareConcurrency', {
            value: cpuCores,
            writable: true,
          });

          const complexity = getAnimationComplexity();

          // Low-end devices should get simplified animations
          expect(complexity).toBe('simplified');

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});
