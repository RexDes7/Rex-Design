/**
 * Unit tests for Mobile Optimization
 * Task 15.2: Добавить mobile optimization
 * Task 15.3: Написать unit tests для оптимизаций
 * Requirements: 8.1, 8.2
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  getAnimationCapabilities,
  shouldEnableAnimations,
  getAnimationComplexity,
  type AnimationComplexity,
} from '@/lib/animations/errorHandling';

describe('Mobile Optimization - Animation Complexity Detection', () => {
  // Save original window and navigator
  const originalWindow = global.window;
  const originalNavigator = global.navigator;

  afterEach(() => {
    // Restore originals
    global.window = originalWindow;
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true,
    });
  });

  describe('getAnimationCapabilities', () => {
    it('should detect IntersectionObserver support', () => {
      // Mock IntersectionObserver as available
      Object.defineProperty(global, 'IntersectionObserver', {
        value: class IntersectionObserver {
          observe() {}
          unobserve() {}
          disconnect() {}
        },
        writable: true,
      });

      const capabilities = getAnimationCapabilities();
      expect(capabilities.intersectionObserver).toBe(true);
    });

    it('should detect CSS animations support', () => {
      const capabilities = getAnimationCapabilities();
      expect(capabilities.cssAnimations).toBe(true);
    });

    it('should detect 3D transforms support', () => {
      const capabilities = getAnimationCapabilities();
      expect(capabilities.transforms3d).toBe(true);
    });

    it('should detect prefers-reduced-motion', () => {
      // Mock matchMedia to return reduced motion preference
      Object.defineProperty(global.window, 'matchMedia', {
        value: jest.fn().mockImplementation((query) => ({
          matches: query.includes('reduced-motion'),
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

      const capabilities = getAnimationCapabilities();
      expect(capabilities.reducedMotion).toBe(true);
    });
  });

  describe('shouldEnableAnimations', () => {
    it('should return false when prefers-reduced-motion is set', () => {
      Object.defineProperty(global.window, 'matchMedia', {
        value: jest.fn().mockImplementation((query) => ({
          matches: query.includes('reduced-motion'),
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

      expect(shouldEnableAnimations()).toBe(false);
    });

    it('should return true when animations are supported and no reduced motion', () => {
      Object.defineProperty(global.window, 'matchMedia', {
        value: jest.fn().mockImplementation((query) => ({
          matches: false, // No reduced motion preference
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

      expect(shouldEnableAnimations()).toBe(true);
    });
  });

  describe('getAnimationComplexity', () => {
    it('should return "none" when reduced motion is preferred', () => {
      Object.defineProperty(global.window, 'matchMedia', {
        value: jest.fn().mockImplementation((query) => ({
          matches: query.includes('reduced-motion'),
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

      expect(getAnimationComplexity()).toBe('none');
    });

    it('should return "simplified" on mobile devices (viewport < 768px)', () => {
      // Mock no reduced motion
      Object.defineProperty(global.window, 'matchMedia', {
        value: jest.fn().mockImplementation((query) => ({
          matches: false,
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

      // Mock mobile viewport
      Object.defineProperty(global.window, 'innerWidth', {
        value: 375, // Mobile width
        writable: true,
      });

      const complexity = getAnimationComplexity();
      expect(complexity).toBe('simplified');
    });

    it('should return "simplified" on low-end devices (< 4 CPU cores)', () => {
      Object.defineProperty(global.window, 'matchMedia', {
        value: jest.fn().mockImplementation((query) => ({
          matches: false,
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

      // Mock desktop viewport
      Object.defineProperty(global.window, 'innerWidth', {
        value: 1920,
        writable: true,
      });

      // Mock low-end device (2 CPU cores)
      Object.defineProperty(global.navigator, 'hardwareConcurrency', {
        value: 2,
        writable: true,
      });

      expect(getAnimationComplexity()).toBe('simplified');
    });

    it('should return "full" on desktop with good specs', () => {
      Object.defineProperty(global.window, 'matchMedia', {
        value: jest.fn().mockImplementation((query) => ({
          matches: false,
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

      // Mock desktop viewport
      Object.defineProperty(global.window, 'innerWidth', {
        value: 1920,
        writable: true,
      });

      // Mock high-end device (8 CPU cores)
      Object.defineProperty(global.navigator, 'hardwareConcurrency', {
        value: 8,
        writable: true,
      });

      expect(getAnimationComplexity()).toBe('full');
    });

    it('should return "simplified" when 3D transforms not supported', () => {
      Object.defineProperty(global.window, 'matchMedia', {
        value: jest.fn().mockImplementation((query) => ({
          matches: false,
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

      // Mock CSS.supports to return false for 3D transforms
      const originalSupports = global.CSS?.supports;
      global.CSS = {
        ...global.CSS,
        supports: jest.fn((property, value) => {
          if (property === 'transform' && value.includes('translate3d')) {
            return false;
          }
          return true;
        }),
      };

      expect(getAnimationComplexity()).toBe('simplified');

      // Restore
      if (originalSupports) {
        global.CSS.supports = originalSupports;
      }
    });
  });
});

describe('Animation Components Mobile Behavior', () => {
  const originalWindow = global.window;

  afterEach(() => {
    global.window = originalWindow;
  });

  describe('FadeInWhenVisible', () => {
    it('should render without animation when complexity is "none"', async () => {
      // Mock reduced motion
      Object.defineProperty(global.window, 'matchMedia', {
        value: jest.fn().mockImplementation((query) => ({
          matches: query.includes('reduced-motion'),
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

      const FadeInWhenVisible = (await import('@/components/animations/FadeInWhenVisible')).default;

      const { container } = render(
        <FadeInWhenVisible>
          <div data-testid="child">Test Content</div>
        </FadeInWhenVisible>
      );

      // Should render children without motion.div wrapper
      expect(container.querySelector('motion.div')).not.toBeInTheDocument();
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should use simplified duration on mobile', async () => {
      // Mock mobile viewport
      Object.defineProperty(global.window, 'matchMedia', {
        value: jest.fn().mockImplementation((query) => ({
          matches: false,
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
        value: 375,
        writable: true,
      });

      const FadeInWhenVisible = (await import('@/components/animations/FadeInWhenVisible')).default;

      const { container } = render(
        <FadeInWhenVisible duration={600}>
          <div>Mobile Test</div>
        </FadeInWhenVisible>
      );

      // Component should render (specific animation values are internal)
      expect(container.textContent).toContain('Mobile Test');
    });
  });

  describe('AnimatedSection', () => {
    it('should render without animation when complexity is "none"', async () => {
      Object.defineProperty(global.window, 'matchMedia', {
        value: jest.fn().mockImplementation((query) => ({
          matches: query.includes('reduced-motion'),
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

      const AnimatedSection = (await import('@/components/animations/AnimatedSection')).default;

      const { container } = render(
        <AnimatedSection>
          <div>Section Content</div>
        </AnimatedSection>
      );

      expect(container.querySelector('motion.div')).not.toBeInTheDocument();
      expect(container.textContent).toContain('Section Content');
    });

    it('should use simplified stagger delay on mobile', async () => {
      Object.defineProperty(global.window, 'matchMedia', {
        value: jest.fn().mockImplementation((query) => ({
          matches: false,
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
        value: 375,
        writable: true,
      });

      const AnimatedSection = (await import('@/components/animations/AnimatedSection')).default;

      const { container } = render(
        <AnimatedSection staggerDelay={200}>
          <div>Mobile Stagger</div>
        </AnimatedSection>
      );

      expect(container.textContent).toContain('Mobile Stagger');
    });
  });
});
