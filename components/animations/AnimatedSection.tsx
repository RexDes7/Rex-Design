// AnimatedSection wrapper component for staggered animations
// Validates: Requirements 3.2, 4.2, 5.2

'use client';

import { motion } from 'framer-motion';
import { staggerContainerVariants } from '@/lib/animations/variants';
import { animationConfig } from '@/lib/animations/config';
import { useAnimationComplexity } from '@/lib/animations/useAnimationComplexity';

export interface AnimatedSectionProps {
  children: React.ReactNode;
  staggerDelay?: number; // Delay between elements in ms, default: 100
  className?: string;
}

/**
 * AnimatedSection wrapper component that applies staggered animations to its children.
 * Uses Framer Motion's staggerChildren feature to create sequential entrance animations.
 * 
 * @param children - Child elements to animate
 * @param staggerDelay - Delay between each child animation in milliseconds (default: 100)
 * @param className - Optional CSS class name
 */
export default function AnimatedSection({
  children,
  staggerDelay = animationConfig.stagger.cards,
  className,
}: AnimatedSectionProps): JSX.Element {
  // Check animation complexity for mobile optimization
  const complexity = useAnimationComplexity();

  // If animations are disabled, render children without animation
  if (complexity === 'none') {
    return <div className={className}>{children}</div>;
  }

  // Simplify stagger delay on mobile devices (reduce by 50%)
  const effectiveStaggerDelay = complexity === 'simplified' 
    ? staggerDelay * 0.5 
    : staggerDelay;

  // Create custom variants with the specified stagger delay
  const customVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: effectiveStaggerDelay / 1000, // Convert ms to seconds for Framer Motion
      },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={customVariants}
    >
      {children}
    </motion.div>
  );
}
