/**
 * Animation Library Exports
 * 
 * Centralized exports for animation utilities, hooks, and configuration.
 */

export { animationConfig } from './config';
export type { AnimationConfig } from './config';

export {
  getAnimationCapabilities,
  shouldEnableAnimations,
  getAnimationComplexity,
} from './errorHandling';
export type { AnimationCapabilities, AnimationComplexity } from './errorHandling';

export {
  fadeInVariants,
  slideUpVariants,
  slideLeftVariants,
  scaleVariants,
  staggerContainerVariants,
} from './variants';

export {
  useAnimationComplexity,
  useIsMobile,
  useAnimationsEnabled,
} from './useAnimationComplexity';
