/**
 * Error handling and feature detection utilities for animations
 * Provides graceful degradation for unsupported features and user preferences
 */

export interface AnimationCapabilities {
  intersectionObserver: boolean;
  cssAnimations: boolean;
  transforms3d: boolean;
  reducedMotion: boolean;
}

export type AnimationComplexity = 'full' | 'simplified' | 'none';

/**
 * Detects browser capabilities for animations
 * @returns Object with boolean flags for each capability
 */
export function getAnimationCapabilities(): AnimationCapabilities {
  // Check if running in browser environment
  if (typeof window === 'undefined') {
    return {
      intersectionObserver: false,
      cssAnimations: false,
      transforms3d: false,
      reducedMotion: false,
    };
  }

  return {
    intersectionObserver: 'IntersectionObserver' in window,
    cssAnimations: typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('animation', 'none'),
    transforms3d: typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('transform', 'translate3d(0,0,0)'),
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  };
}

/**
 * Determines if animations should be enabled based on capabilities and user preferences
 * @returns true if animations should be enabled, false otherwise
 */
export function shouldEnableAnimations(): boolean {
  const capabilities = getAnimationCapabilities();
  
  // Respect user's reduced motion preference
  if (capabilities.reducedMotion) return false;
  
  // Require basic CSS animation support
  if (!capabilities.cssAnimations) return false;
  
  return true;
}

/**
 * Determines the complexity level of animations to use based on device capabilities
 * @returns 'full' for full animations, 'simplified' for reduced animations, 'none' for no animations
 */
export function getAnimationComplexity(): AnimationComplexity {
  const capabilities = getAnimationCapabilities();
  
  // No animations if disabled or not supported
  if (!shouldEnableAnimations()) return 'none';
  
  // Simplified animations if 3D transforms not supported
  if (!capabilities.transforms3d) return 'simplified';
  
  // Check device performance indicators
  if (typeof window !== 'undefined') {
    const isMobile = window.innerWidth < 768;
    const isLowEnd = typeof navigator !== 'undefined' && 
                     navigator.hardwareConcurrency && 
                     navigator.hardwareConcurrency < 4;
    
    if (isMobile || isLowEnd) return 'simplified';
  }
  
  return 'full';
}
