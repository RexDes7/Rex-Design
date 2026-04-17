// Framer Motion animation variants for visual enhancements
// Validates: Requirements 9.2, 9.3

import { Variants } from 'framer-motion';
import { animationConfig } from './config';

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: animationConfig.durations.normal / 1000,
      ease: animationConfig.easing.easeOut,
    },
  },
};

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: animationConfig.durations.normal / 1000,
      ease: animationConfig.easing.easeOut,
    },
  },
};

export const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: animationConfig.durations.normal / 1000,
      ease: animationConfig.easing.easeOut,
    },
  },
};

export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: animationConfig.durations.normal / 1000,
      ease: animationConfig.easing.easeOut,
    },
  },
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: animationConfig.stagger.cards / 1000,
    },
  },
};
