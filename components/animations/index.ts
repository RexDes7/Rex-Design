/**
 * Animation Components Barrel Export
 * 
 * Exports lazy-loaded animation components by default for optimal bundle size.
 * Direct imports are still available for cases where lazy loading is not desired.
 * 
 * Validates: Requirements 7.5
 */

// Lazy-loaded components (recommended for production)
export { default as FadeInWhenVisible } from './LazyFadeInWhenVisible';
export { default as AnimatedSection } from './LazyAnimatedSection';

// Non-animated components
export { default as Marquee } from './Marquee';

// Re-export types
export type { FadeInWhenVisibleProps } from './FadeInWhenVisible';
export type { AnimatedSectionProps } from './AnimatedSection';
export type { MarqueeProps } from './Marquee';
