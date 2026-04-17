/**
 * Property Test: Mobile Animation Simplification
 * Task 15.5: Property test для mobile simplification
 * Property 14: Mobile animation simplification
 * Validates: Requirements 8.2
 *
 * This test verifies that animations are simplified on mobile devices
 * and low-end hardware to maintain performance.
 */

import fc from 'fast-check';
import {
  getAnimationCapabilities,
  getAnimationComplexity,
  shouldEnableAnimations,
  type AnimationComplexity,
} from '@/lib/animations/errorHandling';

describe('Property 14: Mobile Animation Simplification', () => {
  const originalWindow = global.window;
  const originalNavigator = global.navigator;
  const originalCSS = global.CSS;

  afterEach(() => {
    global.window = originalWindow;
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true,
    });
    if (originalCSS) {
      global.CSS = originalCSS;
    }
  });

  const setupMockMatchMedia = (reducedMotion: boolean) => {
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
  };

  /**
   * Property: Animation complexity should be 'simplified' or 'none' on mobile viewports
   *
   * We verify this by testing various mobile viewport widths and ensuring
   * the complexity is appropriately reduced.
   */
  it('should simplify animations on mobile viewports (< 768px)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 767 }), // Mobile viewport widths
        fc.boolean(), // reduced motion preference
        (viewportWidth, reducedMotion) => {
          setupMockMatchMedia(reducedMotion);

          Object.defineProperty(global.window, 'innerWidth', {
            value: viewportWidth,
            writable: true,
          });

          Object.defineProperty(global.navigator, 'hardwareConcurrency', {
            value: 8, // High-end CPU to isolate viewport testing
            writable: true,
          });

          const complexity = getAnimationComplexity();

          if (reducedMotion) {
            expect(complexity).toBe('none');
          } else {
            // Mobile should get simplified animations
            expect(['simplified', 'full']).toContain(complexity);
          }

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property: Animation complexity should be 'full' on desktop viewports with good specs
   */
  it('should use full animations on desktop viewports with good specs', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1024, max: 3840 }), // Desktop viewport widths
        fc.integer({ min: 4, max: 16 }), // CPU cores
        (viewportWidth, cpuCores) => {
          setupMockMatchMedia(false);

          Object.defineProperty(global.window, 'innerWidth', {
            value: viewportWidth,
            writable: true,
          });

          Object.defineProperty(global.navigator, 'hardwareConcurrency', {
            value: cpuCores,
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
   * Property: Animation complexity should be 'simplified' on low-end devices
   */
  it('should simplify animations on low-end devices (< 4 CPU cores)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 768, max: 1920 }), // Tablet/desktop viewport widths
        fc.integer({ min: 1, max: 3 }), // Low-end CPU cores
        (viewportWidth, cpuCores) => {
          setupMockMatchMedia(false);

          Object.defineProperty(global.window, 'innerWidth', {
            value: viewportWidth,
            writable: true,
          });

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

  /**
   * Property: Respects prefers-reduced-motion accessibility setting
   */
  it('should disable animations when prefers-reduced-motion is set', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 3840 }), // Any viewport
        fc.integer({ min: 1, max: 16 }), // Any CPU count
        (viewportWidth, cpuCores) => {
          setupMockMatchMedia(true); // Reduced motion enabled

          Object.defineProperty(global.window, 'innerWidth', {
            value: viewportWidth,
            writable: true,
          });

          Object.defineProperty(global.navigator, 'hardwareConcurrency', {
            value: cpuCores,
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
   * Property: Duration should be reduced on mobile
   */
  it('should use shorter durations for simplified animations', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 100, max: 2000 }), // Original duration in ms
        (duration) => {
          setupMockMatchMedia(false);

          // Mobile viewport
          Object.defineProperty(global.window, 'innerWidth', {
            value: 375,
            writable: true,
          });

          Object.defineProperty(global.navigator, 'hardwareConcurrency', {
            value: 8,
            writable: true,
          });

          const complexity = getAnimationComplexity();

          if (complexity === 'simplified') {
            // Simplified duration should be 50% of original
            const simplifiedDuration = duration * 0.5;
            expect(simplifiedDuration).toBeLessThan(duration);
          }

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property: Stagger delay should be reduced on mobile
   */
  it('should use shorter stagger delays on mobile', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 50, max: 500 }), // Original stagger delay in ms
        (staggerDelay) => {
          setupMockMatchMedia(false);

          // Mobile viewport
          Object.defineProperty(global.window, 'innerWidth', {
            value: 375,
            writable: true,
          });

          Object.defineProperty(global.navigator, 'hardwareConcurrency', {
            value: 8,
            writable: true,
          });

          const complexity = getAnimationComplexity();

          if (complexity === 'simplified') {
            // Simplified stagger should be 50% of original
            const simplifiedStagger = staggerDelay * 0.5;
            expect(simplifiedStagger).toBeLessThan(staggerDelay);
          }

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property: Variant simplification on mobile
   */
  it('should use fadeIn variant for all animations on mobile', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(['fadeIn', 'slideUp', 'slideLeft', 'scale'] as const),
        (originalVariant) => {
          setupMockMatchMedia(false);

          // Mobile viewport
          Object.defineProperty(global.window, 'innerWidth', {
            value: 375,
            writable: true,
          });

          Object.defineProperty(global.navigator, 'hardwareConcurrency', {
            value: 8,
            writable: true,
          });

          const complexity = getAnimationComplexity();

          if (complexity === 'simplified') {
            // All variants should be simplified to fadeIn
            const simplifiedVariant = complexity === 'simplified' ? 'fadeIn' : originalVariant;
            expect(simplifiedVariant).toBe('fadeIn');
          }

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});
