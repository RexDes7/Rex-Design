/**
 * Hook to track animation complexity based on device capabilities and viewport size
 * Responds to viewport resize changes for responsive animation behavior
 * 
 * Validates: Requirements 8.1, 8.2, 8.3
 */

'use client';

import { useState, useEffect } from 'react';
import { getAnimationComplexity, AnimationComplexity } from '@/lib/animations/errorHandling';

/**
 * Hook that returns the current animation complexity level
 * Updates when viewport size changes to ensure responsive behavior
 * 
 * @returns Current animation complexity: 'full' | 'simplified' | 'none'
 */
export function useAnimationComplexity(): AnimationComplexity {
  const [complexity, setComplexity] = useState<AnimationComplexity>('full');

  useEffect(() => {
    // Update complexity on mount
    setComplexity(getAnimationComplexity());

    // Listen for viewport changes
    const handleResize = () => {
      setComplexity(getAnimationComplexity());
    };

    // Debounce resize events for performance
    let resizeTimeout: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 150);
    };

    window.addEventListener('resize', debouncedResize);

    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return complexity;
}

/**
 * Hook to check if animations should be simplified for mobile
 * 
 * @returns true if on mobile/simplified device, false otherwise
 */
export function useIsMobile(): boolean {
  const complexity = useAnimationComplexity();
  return complexity === 'simplified' || complexity === 'none';
}

/**
 * Hook to check if full animations are enabled
 * 
 * @returns true if full animations are enabled, false otherwise
 */
export function useAnimationsEnabled(): boolean {
  const complexity = useAnimationComplexity();
  return complexity !== 'none';
}
