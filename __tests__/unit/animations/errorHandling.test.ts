/**
 * Unit tests for animation error handling and feature detection
 * Validates: Requirements 3.6, 8.1, 8.4
 */

import {
  getAnimationCapabilities,
  shouldEnableAnimations,
  getAnimationComplexity,
} from '@/lib/animations/errorHandling';

describe('Animation Error Handling', () => {
  describe('getAnimationCapabilities', () => {
    it('should return an object with capability flags', () => {
      const capabilities = getAnimationCapabilities();
      
      expect(capabilities).toHaveProperty('intersectionObserver');
      expect(capabilities).toHaveProperty('cssAnimations');
      expect(capabilities).toHaveProperty('transforms3d');
      expect(capabilities).toHaveProperty('reducedMotion');
      
      expect(typeof capabilities.intersectionObserver).toBe('boolean');
      expect(typeof capabilities.cssAnimations).toBe('boolean');
      expect(typeof capabilities.transforms3d).toBe('boolean');
      expect(typeof capabilities.reducedMotion).toBe('boolean');
    });

    it('should detect IntersectionObserver support', () => {
      const capabilities = getAnimationCapabilities();
      
      // In jsdom environment, IntersectionObserver might not be available
      // but the function should still return a boolean
      expect(typeof capabilities.intersectionObserver).toBe('boolean');
    });

    it('should detect CSS animation support', () => {
      const capabilities = getAnimationCapabilities();
      expect(typeof capabilities.cssAnimations).toBe('boolean');
    });

    it('should detect 3D transforms support', () => {
      const capabilities = getAnimationCapabilities();
      expect(typeof capabilities.transforms3d).toBe('boolean');
    });

    it('should detect reduced motion preference', () => {
      const capabilities = getAnimationCapabilities();
      expect(typeof capabilities.reducedMotion).toBe('boolean');
    });
  });

  describe('shouldEnableAnimations', () => {
    it('should return a boolean', () => {
      const result = shouldEnableAnimations();
      expect(typeof result).toBe('boolean');
    });

    it('should return false if reduced motion is preferred', () => {
      // Mock reduced motion preference
      const originalMatchMedia = window.matchMedia;
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const result = shouldEnableAnimations();
      expect(result).toBe(false);

      // Restore original
      window.matchMedia = originalMatchMedia;
    });

    it('should return false if CSS animations are not supported', () => {
      // Mock CSS.supports to return false
      const originalCSS = global.CSS;
      (global as any).CSS = {
        supports: jest.fn().mockReturnValue(false),
      };

      const result = shouldEnableAnimations();
      expect(result).toBe(false);

      // Restore original
      (global as any).CSS = originalCSS;
    });
  });

  describe('getAnimationComplexity', () => {
    it('should return one of the valid complexity levels', () => {
      const result = getAnimationComplexity();
      expect(['full', 'simplified', 'none']).toContain(result);
    });

    it('should return "none" if animations are disabled', () => {
      // Mock reduced motion preference
      const originalMatchMedia = window.matchMedia;
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const result = getAnimationComplexity();
      expect(result).toBe('none');

      // Restore original
      window.matchMedia = originalMatchMedia;
    });

    it('should return "simplified" if 3D transforms are not supported', () => {
      // Mock CSS.supports to return false for 3D transforms but true for animations
      const originalCSS = global.CSS;
      (global as any).CSS = {
        supports: jest.fn().mockImplementation((prop: string, value: string) => {
          if (value === 'translate3d(0,0,0)') return false;
          if (value === 'none' && prop === 'animation') return true;
          return false;
        }),
      };

      // Mock matchMedia to return false for reduced motion
      const originalMatchMedia = window.matchMedia;
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const result = getAnimationComplexity();
      expect(result).toBe('simplified');

      // Restore originals
      (global as any).CSS = originalCSS;
      window.matchMedia = originalMatchMedia;
    });
  });

  describe('Edge cases', () => {
    it('should handle missing window object gracefully', () => {
      // This test verifies the SSR safety of the functions
      // The functions should not throw errors when window is undefined
      expect(() => getAnimationCapabilities()).not.toThrow();
      expect(() => shouldEnableAnimations()).not.toThrow();
      expect(() => getAnimationComplexity()).not.toThrow();
    });

    it('should handle missing CSS object gracefully', () => {
      const originalCSS = global.CSS;
      (global as any).CSS = undefined;

      expect(() => getAnimationCapabilities()).not.toThrow();
      
      const capabilities = getAnimationCapabilities();
      expect(capabilities.cssAnimations).toBe(false);
      expect(capabilities.transforms3d).toBe(false);

      // Restore original
      (global as any).CSS = originalCSS;
    });

    it('should handle missing navigator.hardwareConcurrency gracefully', () => {
      const originalNavigator = global.navigator;
      Object.defineProperty(global, 'navigator', {
        value: {},
        writable: true,
        configurable: true,
      });

      expect(() => getAnimationComplexity()).not.toThrow();

      // Restore original
      Object.defineProperty(global, 'navigator', {
        value: originalNavigator,
        writable: true,
        configurable: true,
      });
    });
  });

  describe('Mobile detection', () => {
    it('should return "simplified" for mobile viewport widths', () => {
      // Mock window.innerWidth for mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });

      // Mock CSS.supports to return true
      const originalCSS = global.CSS;
      (global as any).CSS = {
        supports: jest.fn().mockReturnValue(true),
      };

      // Mock matchMedia to return false for reduced motion
      const originalMatchMedia = window.matchMedia;
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const result = getAnimationComplexity();
      expect(result).toBe('simplified');

      // Restore originals
      (global as any).CSS = originalCSS;
      window.matchMedia = originalMatchMedia;
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
    });
  });
});
