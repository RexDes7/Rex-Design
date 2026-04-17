/**
 * FadeInWhenVisible HOC Component
 * 
 * Higher-order component that triggers animations when elements become visible during scroll.
 * Uses Framer Motion's useInView hook for intersection detection.
 * 
 * Validates: Requirements 3.1, 3.5, 5.1
 */

'use client';

import React from 'react';
import { motion, useInView } from 'framer-motion';
import {
  fadeInVariants,
  slideUpVariants,
  slideLeftVariants,
  scaleVariants,
} from '@/lib/animations/variants';
import { useAnimationComplexity } from '@/lib/animations/useAnimationComplexity';

export interface FadeInWhenVisibleProps {
  children: React.ReactNode;
  delay?: number;            // Задержка анимации (ms), default: 0
  duration?: number;         // Длительность (ms), default: 600
  threshold?: number;        // Intersection threshold, default: 0.1
  once?: boolean;            // Анимировать только один раз, default: true
  variant?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'scale';
}

export default function FadeInWhenVisible({
  children,
  delay = 0,
  duration = 600,
  threshold = 0.1,
  once = true,
  variant = 'fadeIn',
}: FadeInWhenVisibleProps): JSX.Element {
  const ref = React.useRef(null);
  const isInView = useInView(ref, {
    once,
    amount: threshold,
  });

  // Check animation complexity for mobile optimization
  const complexity = useAnimationComplexity();

  // If animations are disabled, render children without animation
  if (complexity === 'none') {
    return <div ref={ref}>{children}</div>;
  }

  // Select the appropriate variant based on the prop
  const variantMap = {
    fadeIn: fadeInVariants,
    slideUp: slideUpVariants,
    slideLeft: slideLeftVariants,
    scale: scaleVariants,
  };

  const selectedVariant = variantMap[variant];

  // Simplify animations on mobile devices
  const simplifiedDuration = complexity === 'simplified' ? duration * 0.5 : duration;
  const simplifiedVariant = complexity === 'simplified' ? 'fadeIn' : variant;

  // Create custom variant with delay and duration overrides
  const customVariant = {
    hidden: variantMap[simplifiedVariant].hidden,
    visible: {
      ...variantMap[simplifiedVariant].visible,
      transition: {
        ...(variantMap[simplifiedVariant].visible as any).transition,
        delay: delay / 1000,
        duration: simplifiedDuration / 1000,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={customVariant}
    >
      {children}
    </motion.div>
  );
}
