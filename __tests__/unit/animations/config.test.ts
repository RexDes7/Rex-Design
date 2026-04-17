/**
 * Unit tests for animation configuration
 * Validates: Requirements 9.1, 9.2
 */

import { animationConfig } from '@/lib/animations/config';

describe('Animation Configuration', () => {
  describe('Structure', () => {
    it('should export animationConfig object', () => {
      expect(animationConfig).toBeDefined();
      expect(typeof animationConfig).toBe('object');
    });

    it('should have durations property with correct values', () => {
      expect(animationConfig.durations).toBeDefined();
      expect(animationConfig.durations.fast).toBe(200);
      expect(animationConfig.durations.normal).toBe(400);
      expect(animationConfig.durations.slow).toBe(600);
      expect(animationConfig.durations.hero).toBe(1500);
    });

    it('should have easing property with correct arrays', () => {
      expect(animationConfig.easing).toBeDefined();
      expect(Array.isArray(animationConfig.easing.easeOut)).toBe(true);
      expect(animationConfig.easing.easeOut).toHaveLength(4);
      expect(Array.isArray(animationConfig.easing.easeIn)).toBe(true);
      expect(animationConfig.easing.easeInOut).toHaveLength(4);
      expect(animationConfig.easing.bounce).toHaveLength(4);
    });

    it('should have stagger property with correct values', () => {
      expect(animationConfig.stagger).toBeDefined();
      expect(animationConfig.stagger.cards).toBe(100);
      expect(animationConfig.stagger.buttons).toBe(150);
      expect(animationConfig.stagger.list).toBe(50);
    });

    it('should have marquee property with correct speeds', () => {
      expect(animationConfig.marquee).toBeDefined();
      expect(animationConfig.marquee.slow).toBe(30);
      expect(animationConfig.marquee.normal).toBe(50);
      expect(animationConfig.marquee.fast).toBe(80);
    });

    it('should have thresholds property with correct values', () => {
      expect(animationConfig.thresholds).toBeDefined();
      expect(animationConfig.thresholds.minimal).toBe(0.1);
      expect(animationConfig.thresholds.half).toBe(0.5);
      expect(animationConfig.thresholds.full).toBe(1.0);
    });
  });

  describe('Value Constraints', () => {
    it('should have positive duration values', () => {
      Object.values(animationConfig.durations).forEach(duration => {
        expect(duration).toBeGreaterThan(0);
      });
    });

    it('should have positive stagger values', () => {
      Object.values(animationConfig.stagger).forEach(stagger => {
        expect(stagger).toBeGreaterThan(0);
      });
    });

    it('should have positive marquee speeds', () => {
      Object.values(animationConfig.marquee).forEach(speed => {
        expect(speed).toBeGreaterThan(0);
      });
    });

    it('should have threshold values between 0 and 1', () => {
      Object.values(animationConfig.thresholds).forEach(threshold => {
        expect(threshold).toBeGreaterThanOrEqual(0);
        expect(threshold).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('Easing Functions', () => {
    it('should have valid cubic-bezier values (between 0 and 1 for time, any for value)', () => {
      Object.values(animationConfig.easing).forEach(easing => {
        expect(easing).toHaveLength(4);
        // First and third values (time) should be between 0 and 1
        expect(easing[0]).toBeGreaterThanOrEqual(0);
        expect(easing[0]).toBeLessThanOrEqual(1);
        expect(easing[2]).toBeGreaterThanOrEqual(0);
        expect(easing[2]).toBeLessThanOrEqual(1);
        // Second and fourth values can be any number
        expect(typeof easing[1]).toBe('number');
        expect(typeof easing[3]).toBe('number');
      });
    });
  });
});
